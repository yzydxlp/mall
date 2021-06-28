<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="detailNav"></detail-nav-bar>
    <scroll class="content" 
            ref="scroll" 
            @scroll="contentScroll"
            :probeType="3">
      <detail-swiper :topImages="topImages" @topImageLoad="topImageLoad"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :paramInfo="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :commentInfo="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="showBackTop"></back-top>
    <detail-bottom-bar @addCart="addCart"></detail-bottom-bar>
    <!-- <toast :message="message" :show="show"></toast> -->
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar.vue'
  import DetailSwiper from './childComps/DetailSwiper.vue'
  import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
  import DetailShopInfo from './childComps/DetailShopInfo.vue'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
  import DetailParamInfo from './childComps/DetailParamInfo.vue'
  import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
  import DetailBottomBar from './childComps/DetailBottomBar.vue'
 

  import Scroll from '../../components/common/scroll/Scroll.vue'
  import GoodsList from '../../components/content/goods/GoodsList.vue'
  
  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from '../../network/detail.js'
  import {itemListenerMixin,backTopMixin} from '../../common/mixin.js';
  import { debounce } from '../../common/utils.js'

  import {mapActions} from 'vuex'
  // import Toast from '../../components/common/toast/Toast.vue'
  
  export default {
    name: "Detail",
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo, 
      DetailBottomBar,    
      Scroll,
      GoodsList,
      // Toast,
    },
    mixins:[itemListenerMixin,backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo:{},
        paramInfo:{},
        commentInfo:{},
        recommends:[],
        themeTopYs:[],
        getThemeTopY:null,
        currentIndex:0,
        // message: '',
        // show:false
      }
    },
    created() {
      //1.保存传入的iid
      this.iid = this.$route.params.iid
      //2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // console.log(res)
        //1.获取顶部的图片轮播数据
        const data  = res.result
        this.topImages = res.result.itemInfo.topImages
        //2.获取商品信息
        this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
        //3.获取店铺信息
        this.shop = new Shop(data.shopInfo)
        //4.保存商品的详情数据
        this.detailInfo = data.detailInfo
        //5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        //6.取出评论信息
        if(data.rate.cRate !== 0 ) {
          this.commentInfo = data.rate.list[0]
        }
        
        
      })
      //3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })

      this.getThemeTopY = debounce(()=>{
        this.themeTopYs=[]
        this.themeTopYs.push(0);
        this.themeTopYs.push(-this.$refs.params.$el.offsetTop+44);
        this.themeTopYs.push(-this.$refs.comment.$el.offsetTop+44);
        this.themeTopYs.push(-this.$refs.recommend.$el.offsetTop+44);
        this.themeTopYs.push(-Number.MAX_VALUE)
        // console.log(this.themeTopYs)
      })
    },
    methods: {
      ...mapActions(['addProduct']),
      topImageLoad(){
        this.$refs.scroll.refresh()
        // this.getThemeTopY()
      },
      imageLoad(){
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index){
        // console.log(index)
        this.$refs.scroll.scrollTo(0,this.themeTopYs[index],200)
      },
      contentScroll(position){
        // console.log(position)
        const positionY = position.y
        const length = this.themeTopYs.length
        for(let i=0;i< length-1;i++){
          // console.log(this.currentIndex,positionY,this.themeTopYs[i])
          if(this.currentIndex !== i && (positionY<this.themeTopYs[i]&&positionY>=this.themeTopYs[i+1])){
            this.currentIndex = i;
            
            this.$refs.detailNav.currentIndex = this.currentIndex
          }
        }
        //2.backTop的显示与否
        this.listenShowBackTop(position)
      },
      addCart(){
        // console.log('----加入购物车----')
        //1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid
        //2.将商品添加到购物车
        // this.$store.commit('addProduct',product)
        this.addProduct(product).then(res => {
          // this.show = true;
          // this.message = res;
          // setTimeout(()=>{
          //   this.show = false;
          //   this.message  = ''
          // },1000)
          this.$toast.show(res,1000)
          // this.$toast.show()
          // console.log(this.$toast)
        })
        // this.$store.dispatch('addProduct',product).then(res => {
        //   console.log(res)
        // })
        //3.添加到购物车成功
      }
    },
    mounted() {
    },
    destroyed() {
      this.$bus.$off('itemImgLoad',this.itemImgListener)
    },
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 10;
    background-color: #fff;
  }
  .content {
    height: calc(100% - 44px - 49px);
  }
 
</style>