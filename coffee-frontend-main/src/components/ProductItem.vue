<script setup>
const props = defineProps(['id', 'title', 'description', 'imgPath', "inBasket", "price"])

</script>

<template>
  <div class="card" style="width: 18rem;">
    <img :src="props.imgPath" class="card-img-top">
    <div class="card-body">
      <h5 class="card-title">{{ props.title }}</h5>
      <p class="card-text"> {{ props.description }}, <strong>{{ props.price }}₽</strong></p>
      <div href="#" class="btn btn-primary" @click="$emit('controlBasket', props.id)">
        {{ props.inBasket ? 'Удалить из коризны' : 'Добавить в корзину' }}
      </div>
      <router-link class="btn" :to="'/product/' + props.id">Подробнее</router-link>
    </div>
  </div>
</template>
<style scoped>
img {
  max-width: 286px;
  max-height: 300px;
  object-fit: cover;
}
</style>