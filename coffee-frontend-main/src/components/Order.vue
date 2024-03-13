<script setup>
import { coffeeApi } from '@/service/axios.service.js';
import { reactive, ref } from 'vue';
import router from '@/router';

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

let name = reactive('')
let surname = reactive('')
let phone = reactive()
let address = reactive('')

function createOrder() {
  const productIds = products.map((el) => {
    return el.id
  })

  coffeeApi.post('create-order', { name, surname, phone, address, productIds })
    .then((data) => {
      router.push('/profile')
    }).catch((error) => {
      alert(error.response.data.error)
    });
}
</script>
<template>

  <div class="container">
    <div class="py-5 text-center">
      <h2>Форма оформления заказа</h2>
    </div>

    <div class="row g-5">
      <div class="col-md-5 col-lg-4 order-md-last">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-primary">Ваша корзина</span>
        </h4>
        <ul class="list-group mb-3">
          <li class="list-group-item d-flex justify-content-between lh-sm" v-for="item in products" :key="item.id">
            <div>
              <h6 class="my-0">{{ item.name }}</h6>
              <small class="text-body-secondary">{{ item.description }}</small>
            </div>
            <span class="text-body-secondary">{{ item.price }}₽</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Всего (РУБ)</span>
            <strong>{{ totalPrice }}₽</strong>
          </li>
        </ul>

        <div class="card p-2">
          <div class="input-group">
            <button class="btn btn-secondary w-100" @click="createOrder()">Оформить заказ</button>
          </div>
        </div>
      </div>
      <div class="col-md-7 col-lg-8">
        <form class="needs-validation">
          <div class="row g-3">
            <div class="col-sm-6">
              <label for="firstName" class="form-label">Имя</label>
              <input type="text" class="form-control" id="firstName" placeholder="" v-model="name">
              <div class="invalid-feedback">
                Действительное имя обязательно.
              </div>
            </div>

            <div class="col-sm-6">
              <label for="lastName" class="form-label">Фамилия</label>
              <input type="text" class="form-control" id="lastName" placeholder="" v-model="surname">
              <div class="invalid-feedback">
                Действительная фамилия обязательна.
              </div>
            </div>

            <div class="col-12">
              <label for="username" class="form-label">Номер телефона</label>
              <div class="input-group has-validation">
                <input type="text" class="form-control" id="username" placeholder="+70000000000" v-model="phone">
                <div class="invalid-feedback">
                  Номер телефона обязательно.
                </div>
              </div>
            </div>

            <div class="col-12">
              <label for="address" class="form-label">Адрес</label>
              <input type="text" class="form-control" id="address" placeholder="ул. Фокина" v-model="address">
              <div class="invalid-feedback">
                Пожалуйста, введите свой адрес доставки.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>