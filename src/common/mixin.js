import {debounce} from "./utils.js"
import BackTop from '../components/content/backTop/BackTop.vue'
import {BACKTOP_DISTANCE} from '../common/const.js'
export const itemListenerMixin = {
  data() {
    return {
      itemImgListener:null
    }
  },
  mounted() {
    let newRefresh = debounce(this.$refs.scroll.refresh,100)
    this.itemImgListener = ()=>{
        newRefresh()
    }
    this.$bus.$on('itemImgLoad',this.itemImgListener)
  },
}
export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      showBackTop:false
    }
  },
  methods: {
    backClick(){
      this.$refs.scroll.scrollTo(0,0,1000)
    },
    listenShowBackTop(position) {
      this.showBackTop = position.y<-BACKTOP_DISTANCE
    }
  },
}