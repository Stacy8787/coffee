<script setup>
import { coffeeApi } from '@/service/axios.service.js';
import { reactive, ref } from 'vue';

let isLoaded = ref(false);
let users = reactive({});
let orders = reactive({});
let sumSales = reactive(0);
let totalAvarageBill = reactive(0);
let popularProduct = reactive({});

coffeeApi.get('report').then((data) => {
  isLoaded.value = true;
  orders = data.data.orders;
  users = data.data.users;
  popularProduct = data.data.popularProduct;

  for (const item of users) {
    const userOrders = orders.filter((el) =>
      el.userId == item.id
    )
    let totalBill = 0;

    for (const order of userOrders) {
      totalBill += order.price;
    }

    item.avarageBill = Math.round(totalBill / userOrders.length);
  }

  orders.forEach((el) => {
    sumSales += el.price;
  })

  totalAvarageBill = Math.round(sumSales / orders.length);

})



</script>
<template>
  <div class="container mb-5" v-if="isLoaded">
    <div class="col-sm-12 col-md-6 mx-auto">
      <h1 class="display-3 text-center mt-3">Отчет</h1>
      <hr>
      <ul class="list-group mt-3">
        <li class="list-group-item">
          <span>Заказов за всё время: <strong>{{ orders.length }}</strong></span>
        </li>
        <li class="list-group-item">
          <span>Cумма общих продаж: <strong>{{ sumSales }}₽</strong></span>
        </li>
        <li class="list-group-item">
          <span>Количество клиентов: <strong>{{ users.length }}</strong></span>
        </li>
        <li class="list-group-item">
          <span>Средний чек: <strong>{{ totalAvarageBill }}₽</strong></span>
        </li>
        <li class="list-group-item">
          <div class="d-flex gap-2 align-items-center">
            <img :src="popularProduct.imgPath" class="img-thumbnail product-img" alt="">
            <span>Самый продаваемый продукт: <strong>{{ popularProduct.name }}</strong> <br>
              Продан: <strong>{{ popularProduct.countSales }} раз(а)</strong></span>
          </div>
        </li>
      </ul>
      <h5 class="display-6 text-center mt-5">Зарегистрированные пользователи</h5>
      <ul class="list-group mt-3">
        <li class="list-group-item d-flex justify-content-between gap-2 flex-wrap" v-for="item in users">
          <span>Логин: <strong>{{ item.login }}</strong></span>
          <span>Средний чек: <strong>{{ item.avarageBill }}₽</strong></span>
          <span>Дата регистрации: <strong>{{ new Date(item.createdAt).toLocaleDateString() }}</strong></span>
        </li>
      </ul>
      <h5 class="display-6 text-center mt-5">Оформленные заказы</h5>
      <div id="accordion">
        <div class="card" v-for="item in orders">
          <div class="card-header">
            <a class="btn w-100" data-bs-toggle="collapse" :href="'#collapse' + item.id">
              <div class="d-flex justify-content-between">
                <div>Заказ #{{ item.id }}</div>
                <div>Пользователь: {{ item.user.login }}</div> <strong>{{ item.price }}₽</strong>
              </div>
            </a>
          </div>
          <div :id="'collapse' + item.id" class="collapse" data-bs-parent="#accordion">
            <div class="card-body">
              <ul>
                <li v-for="product in item.productToOrder">
                  {{ product.product.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.product-img {
  width: 100px;
}
</style>