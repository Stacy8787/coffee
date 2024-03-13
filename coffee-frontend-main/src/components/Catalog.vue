<script setup>
import { coffeeApi } from '@/service/axios.service.js';
import ProductItem from './ProductItem.vue'
import { reactive, ref, watch } from 'vue';

const products = reactive([]);
let displayProduct = reactive([]);
coffeeApi.get('catalog').then((data) => {
  products.push(...data.data.products);
  displayProduct.push(...data.data.products);
});

function changeBasketState(id) {
  const index = displayProduct.findIndex((el) => el.id === id);
  const value = displayProduct[index].inBasket;
  coffeeApi.post('/control-basket', { productId: id, value: value })

  displayProduct[index] = { ...displayProduct[index], inBasket: !value };
}

let searchInput = ref('');
function searchProduct() {
  displayProduct.splice(0, displayProduct.length, ...products.filter(item => item.name.toLowerCase().includes(searchInput.value.toLowerCase())));
}

const sortPrice = ref(-1)
const sortType = ref(-1)

watch(sortPrice, (newValue, oldValue) => {
  searchInput.value = '';
  displayProduct = products;

  if (+newValue === 0) {
    displayProduct = displayProduct.sort((next, prev) => next.id - prev.id)
  }
  if (+newValue === 1) {
    displayProduct = displayProduct.sort((next, prev) => next.price - prev.price)
  }
  if (+newValue === 2) {
    displayProduct = displayProduct.sort((next, prev) => prev.price - next.price)
  }
});

watch(sortType, (newValue, oldValue) => {
  searchInput.value = '';
  displayProduct = products;

  if (+newValue === 0) {
    if (searchInput.value.length) {
      displayProduct.splice(0, displayProduct.length, ...products.filter(item => item.name.toLowerCase().includes(searchInput.value.toLowerCase())));
    } else {
      displayProduct = products
    }
  }
  if (+newValue === 1) {
    displayProduct = products.filter((el) => el.isTea)
  }
  if (+newValue === 2) {
    displayProduct = products.filter((el) => el.isCoffee)
  }
  if (+newValue === 3) {
    displayProduct = products.filter((el) => el.isBakery)
  }
});

function reset() {
  console.log(products);
  sortPrice.value = '0';
  sortType.value = '0';
  searchInput.value = '';
  displayProduct = products;
}


</script>
<template>
  <div class="container mb-5">
    <div class="input-group mt-4 mx-auto">
      <input type="text" class="form-control" placeholder="Поиск" v-model="searchInput"> <button class="btn btn-primary"
        @click="searchProduct()">Поиск</button>
    </div>
    <div class="d-flex gap-3 justify-content-center mt-3">
      <div>
        <label class="form-label">Сортировать по цене:</label>
        <select class="form-select" v-model="sortPrice">
          <option value="0"></option>
          <option value="1">По возрастанию</option>
          <option value="2">По убыванию</option>
        </select>
      </div>
      <div>
        <label class="form-label">Показать:</label>
        <select class="form-select" v-model="sortType">
          <option value="0"></option>
          <option value="1">Чай</option>
          <option value="2">Кофе</option>
          <option value="3">Выпечка</option>
        </select>
      </div>
      <button class="btn btn-primary btn-sm reset" @click="reset()">Сбросить</button>
    </div>
    <div class="d-flex mt-5 gap-3 flex-wrap justify-content-center">
      <div v-for="item in displayProduct" :key="item.id">
        <ProductItem :id="item.id" :title="item.name" :description="item.description" :imgPath="item.imgPath"
          :inBasket="item.inBasket" :price="item.price" @controlBasket="(id) => { changeBasketState(id) }" />
      </div>
    </div>
  </div>
</template>
<style>
.input-group {
  max-width: 400px;
}

.reset {
  height: min-content;
  align-self: flex-end;
}
</style>