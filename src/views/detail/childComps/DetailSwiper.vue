<template>
  <swiper class="detail-swiper">
    <swiper-item  v-for="item in topImages" :key="item.index" @load="imgLoad">
      <img :src="item" alt="">
    </swiper-item>
  </swiper>

</template>

<script>
  import {Swiper,SwiperItem} from '../../../components/common/swiper'
  export default {
    name: 'DetailSwiper',
    components: {
      Swiper,
      SwiperItem
    },
    props: {
      topImages: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        counter: 0,
        topImagesLength:0
      }
    },
    methods: {
      imgLoad() {
        if(++this.counter === this.topImagesLength){
          this.$emit('topImageLoad')
        }
      }
    },
    watch: {
      topImages(){
        this.topImagesLength = this.topImages.length
      }
    }
  }
</script>

<style scoped>
  .detail-swiper {
    height: 300px;
    overflow: hidden;
  }
</style>>

