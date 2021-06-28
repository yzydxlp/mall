<template>
  <div class="bottom-bar">  
    <div class="check-content">
      <checked-button class="check-button" 
                      :isChecked="isSelectAll" 
                      @click.native="checkClick"></checked-button>
      <span>全选</span>
    </div>
    <div class="price">
      合计:{{totalPrice}}
    </div>
    <div class="calculate" @click="calcClick">
      去计算:({{checkedLength}})
    </div>
  </div>
</template>

<script>
import CheckedButton from '../../../components/content/checkedButton/CheckedButton.vue'
import {mapGetters} from 'vuex'
export default {
  components: { 
    CheckedButton 
  },
  name: 'CartBottomBar',
  computed: {
    ...mapGetters(['cartList']),
    totalPrice(){
      return '￥'+ this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue,item)=>{
        return preValue + item.price*item.count
      },0).toFixed(2)
    },
    checkedLength() {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectAll(){
      if (this.cartList.length === 0) return false
      return !this.cartList.find(item => !item.checked)
    }
  },
  methods: {
    checkClick(){
      if(this.isSelectAll) {//如果本来是全部选中
        this.cartList.forEach(item => item.checked = false);
      } else {
        this.cartList.forEach(item => item.checked = true)
      }
      // this.cartList.forEach(item => item.checked = !this.isSelectAll)
    },
    calcClick(){
      if(this.cartList.filter(item => item.checked).length === 0){
        this.$toast.show('请选择购买的商品',1000)
      }
    }
  },
}
</script>

<style scoped>
  .bottom-bar{
    height: 40px;
    background-color: #eee;
    position: relative;
    line-height: 40px;
    display: flex;
  }
  .check-content{
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }
  .check-button{
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price {
    margin-left: 30px;
    flex: 1;
  }
  .calculate {
    color: white;
    width: 90px;
    background-color: var(--color-tint);
    text-align: center;
  }
</style>