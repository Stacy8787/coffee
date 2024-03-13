<script setup>
import { coffeeApi } from '@/service/axios.service.js';
import { reactive, ref } from 'vue';

let products = reactive([]);
let totalPrice = ref(0);
coffeeApi.get('basket')
  .then((data) => {
    products.push(...data.data.products);
    countTotalPrice()
  });

function countTotalPrice() {
  totalPrice.value = 0;
  products.forEach((el) => {
    totalPrice.value = totalPrice.value + el.price
  })
}

function changeBasketState(id) {
  coffeeApi.post('/control-basket', { productId: id, value: true })
  products = products.filter((el) => el.id !== id)
  countTotalPrice()
}
</script>
<template>
  <div class="container">
    <div class="mt-5 mx-auto col-xs-12  col-md-6" v-if="products.length">
      <h4 class="d-flex justify-content-between align-items-center mb-3">
        <span class="text-primary">Ваша корзина</span>
      </h4>
      <ul class="list-group mb-3">
        <li class="list-group-item d-flex justify-content-between lh-sm" v-for="item in products" :key="item.id">
          <div>
            <h6 class="my-0">{{ item.name }}</h6>
            <small class="text-body-secondary">{{ item.description }}</small>
          </div>
          <div class="d-flex gap-2 align-items-center">
            <span class="text-body-secondary">{{ item.price }}₽</span>
            <button class="btn btn-sm btn-primary" @click="changeBasketState(item.id)">Удалить</button>
          </div>
        </li>
        <li class="list-group-item d-flex justify-content-between">
          <span>Всего (РУБ)</span>
          <strong>{{ totalPrice }}₽</strong>
        </li>
      </ul>

      <form class="card p-2">
        <div class="input-group">
          <router-link class="btn btn-secondary w-100" to="/order">Оформить заказ</router-link>
        </div>
      </form>
    </div>
    <div v-if="!products.length">
      <h1 class="text-center mt-3">Корзина пуста</h1>
    </div>
  </div>
</template>