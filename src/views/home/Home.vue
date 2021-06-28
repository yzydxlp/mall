<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']" 
                   @tabClick = "tabClick" 
                   ref="tabControl1" 
                   class="tab-control"
                   v-show="isTabFixed"/>
    <scroll class="content" 
            ref="scroll" 
            :probeType="3" 
            @scroll="contentScroll"
            :pullUpLoad="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <home-recommend-view :recommends="recommends"/>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']" 
                   @tabClick = "tabClick" 
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="showBackTop"></back-top>
    
  </div>
</template>

<script>
  
  import HomeSwiper from './childComps/HomeSwiper.vue'
  import HomeRecommendView from './childComps/HomeRecommendView.vue'
  import FeatureView from './childComps/FeatureView.vue'

  import NavBar from '../../components/common/navbar/NavBar.vue'
  import TabControl from '../../components/content/tabControl/TabControl.vue'
  import GoodsList from '../../components/content/goods/GoodsList.vue'
  import Scroll from '../../components/common/scroll/Scroll.vue'

  import { getHomeMultidata, getHomeGoods} from "../../network/home"
  import {itemListenerMixin, backTopMixin} from '../../common/mixin.js'

  export default {
    name:"Home",
    components: {
      HomeSwiper,
      HomeRecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
    },
    mixins:[itemListenerMixin,backTopMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        titles: [],
        goods: {
          'pop': {page: 0,list: []},
          'new': {page: 0,list: []},
          'sell': {page: 0,list: []},
        },
        currentType:'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      //1.请求多个数据
      this.getHomeMultidata()
      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
      
    },
    mounted() {
     
    },
    methods: {
      //事件监听相关方法
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      contentScroll(position){
        // console.log(position)
        this.listenShowBackTop(position)
        //this.showBackTop = position.y<-BACKTOP_DISTANCE
        //2.决定tab-control是否吸顶
        this.isTabFixed = (-position.y)>this.tabOffsetTop
      },
      loadMore(){
        // console.log('上拉加载更多')
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad(){
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
      // 网络请求相关方法
      getHomeMultidata() {
        getHomeMultidata().then( res  => {
        //console.log(res);
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page+1;
        getHomeGoods(type,page).then(res => {
          //console.log(res);
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp()
        })
      },
      
    },
    activated() {
      // console.log('activated')
      // console.log('saveY:'+this.saveY)
      this.$refs.scroll.scrollTo(0,this.saveY,1)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // console.log('deactivated')
      //1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY()
      //2.取消全局事件的监听
      this.$bus.$off('itemImgLoad',this.itemImgListener)
      
    },

  }
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    position: relative;
    height: 100vh;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: white;
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }
  /* .tab-control {
    background-color: white;
    position: sticky;
    top: 44px;
    z-index: 9;
  } */
  .tab-control {
    position: relative;
    z-index: 9;
    background-color: white;
  }
  .content {
    /* height:470px; */
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>