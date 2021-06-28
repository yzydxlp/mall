import {ADD_COUNTER,ADD_TO_CART} from './mutation-types.js'

export default {
  addProduct(context,payLoad){
    return new Promise((resolve,reject) => {
      //payLoad添加新的商品
      let oldProduct = context.state.cartList.find(item => item.iid === payLoad.iid)
      //2.判断oldProduct是否有值
      if(oldProduct){
        // oldProduct.count +=1
        context.commit(ADD_COUNTER,oldProduct)
        resolve('当前的商品数量+1')
      } else {
        payLoad.count = 1
        // context.state.cartList.push(payLoad)
        context.commit(ADD_TO_CART,payLoad)
        resolve('添加了新的商品')
      }
    })
  }
}