<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <!-- 商品列表 -->
    <cart-list></cart-list>
    <!-- 底部汇总 -->
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
  import NavBar from '../../components/common/navbar/NavBar.vue'
  import CartList from './childComps/CartList.vue'
  import CartBottomBar from './childComps/CartBottomBar.vue'

  import {mapGetters} from 'vuex'



  export default {
    components: { 
      NavBar,
      CartList,
      CartBottomBar 
    },
    name:"Shopcart",
    computed: {
      ...mapGetters([
        'cartLength'
      ])
    }
  }
</script>

<style scoped>
  .cart {
    height:100vh
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: snow;
    font-weight: 700;
  }

</style>