<script setup>
import { coffeeApi } from '@/service/axios.service.js';
import { reactive, ref } from 'vue';

let dateSignup = reactive();

let isLoaded = ref(false);
let userInfo = reactive({})
let orders = reactive({})
coffeeApi.get('profile').then((data) => {
  userInfo = data.data.user;
  orders = data.data.order;
  isLoaded.value = true;
  dateSignup = new Date(userInfo.createdAt).toLocaleDateString();
})
</script>
<template>
  <div class="container mb-5" v-if="isLoaded">
    <div class="col-sm-12 col-md-6 mx-auto">
      <h1 class="display-3 text-center mt-5">Профиль</h1>

      <ul class="list-group mt-3">
        <li class="list-group-item">
          <span>Имя: {{ userInfo.name }}</span>
        </li>
        <li class="list-group-item">
          <span>Фамилия: {{ userInfo.surname }}</span>
        </li>
        <li class="list-group-item">
          <span>Телефон: {{ userInfo.phone }}</span>
        </li>
        <li class="list-group-item">
          <span>Адрес: {{ userInfo.address }}</span>
        </li>
        <li class="list-group-item">
          <span>Дата регистрации: {{ dateSignup }}</span>
        </li>
        <li class="list-group-item">
          <span>Количество заказов: {{ orders.length }}</span>
        </li>
        <li class="list-group-item">
          <span>Товаров в корзине: {{ userInfo.basket.length }}</span>
        </li>
      </ul>
      <h1 class="display-5 text-center mt-3">Заказы</h1>
      <h5 class="text-center text-secondary" v-if="!orders.length">Нет ни одного заказа</h5>
      <div id="accordion">
        <div class="card" v-for="item in orders">
          <div class="card-header">
            <a class="btn w-100" data-bs-toggle="collapse" href="#collapseOne">
              <div class="d-flex justify-content-between">
                <div>Заказ #{{ item.id }}</div> <strong>{{ item.price }}₽</strong>
              </div>
            </a>
          </div>
          <div id="collapseOne" class="collapse show" data-bs-parent="#accordion">
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