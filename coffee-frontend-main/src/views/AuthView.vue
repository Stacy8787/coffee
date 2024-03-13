<script setup>
import { ref } from 'vue';
import { coffeeApi } from '@/service/axios.service.js';
import router from '@/router';
import { useStore } from '@/stores/store';

const store = useStore();
const login = ref('');
const password = ref('');

const onSubmit = () => {
  coffeeApi.post('/login', { login: login.value, password: password.value })
    .then(() => {
      router.push('/catalog');
      store.isAuth = true;
    })
    .catch((error) => {
      alert(error.response.data.error)
    });
}
</script>

<template>
  <div class="container-sm">
    <form @submit.prevent>
      <div class="mb-3">
        <label for="inputLogin" class="form-label">Логин</label>
        <input class="form-control" id="inputLogin" v-model="login">
      </div>
      <div class="mb-3">
        <label for="inputPassword" class="form-label">Пароль</label>
        <input type="password" class="form-control" v-model="password" id="inputPassword">
      </div>
      <button class="btn btn-primary" @click="onSubmit()">Войти</button>
    </form>
  </div>
</template>

<style scoped lang="scss">
form {
  max-width: 360px;
  margin: 40px auto;
}
</style>
