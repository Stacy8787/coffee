<script setup>
import { coffeeApi } from '@/service/axios.service.js';
import { useRoute } from 'vue-router';
import { reactive, ref } from 'vue';


const route = useRoute();
const productId = route.params.id
let productInfo = reactive();
let loading = ref(true)
let createdDate;
coffeeApi.post('/detailed-product', { productId }).then((data) => {
  productInfo = data.data
  loading.value = false
  createdDate = new Date(productInfo.createdAt).toLocaleDateString();
})

</script>
<template>
  <div class="container my-5" v-if="!loading">
    <div class="col-sm-12 col-md-6 mx-auto">
      <div class="d-flex justify-content-center">
        <img :src="productInfo.imgPath">
      </div>
      <ul class="list-group mt-3">
        <li class="list-group-item">
          <span>Название: {{ productInfo.name }}</span>
        </li>
        <li class="list-group-item">
          <span>Цена: <strong>{{ productInfo.price }}₽</strong></span>
        </li>
        <li class="list-group-item">
          <span>Описание: {{ productInfo.description }}</span>
        </li>
        <li class="list-group-item">
          <span>В корзине у {{ productInfo.basket.length }}ч.</span>
        </li>
        <li class="list-group-item">
          <span>Заказали: {{ productInfo.productToOrder.length }} раз(а)</span>
        </li>
        <li class="list-group-item">
          <span>Товар добавлен: {{ createdDate }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
img {
  max-height: 360px;
  border-radius: 20px;
}
</style>