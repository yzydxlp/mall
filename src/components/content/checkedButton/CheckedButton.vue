<template>
  <div class="check-button" :class="{check:isChecked}">
    <img src="../../../assets/img/shopcart/tick.svg" alt="">
  </div>
</template>

<script>
  export default {
    name: 'CheckedButtom',
    props: {
      isChecked: {
        type:Boolean,
        default:false
      }
    }
  }
</script>

<style scoped>
  .check-button{
    
    border-radius: 50%;
    border: 2px solid #aaa;
  }
  .check {
    background-color: var(--color-tint);
    border-color:var(--color-tint);
  }
</style>