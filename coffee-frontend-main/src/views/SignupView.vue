<script setup>
import { ref } from 'vue';
import { coffeeApi } from '@/service/axios.service.js';
import router from '@/router';
import { useStore } from '@/stores/store';

const store = useStore()

const login = ref('');
const password = ref('');
const name = ref('');
const surname = ref('');
const phone = ref('');
const address = ref('');

const onSubmit = () => {
  coffeeApi.post('/signup',
    {
      login: login.value,
      password: password.value,
      name: name.value,
      surname: surname.value,
      phone: phone.value,
      address: address.value
    })
    .then(() => {
      store.isAuth = true;
      router.push('/catalog');
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
      <div class="mb-3">
        <label for="inputname" class="form-label">Имя</label>
        <input class="form-control" v-model="name" id="inputname">
      </div>
      <div class="mb-3">
        <label for="inputsurname" class="form-label">Фамилия</label>
        <input class="form-control" v-model="surname" id="inputsurname">
      </div>
      <div class="mb-3">
        <label for="inputphone" class="form-label">Телефон</label>
        <input class="form-control" v-model="phone" id="inputphone">
      </div>
      <div class="mb-3">
        <label for="inputaddress" class="form-label">Адрес</label>
        <input class="form-control" v-model="address" id="inputaddress">
      </div>
      <button class="btn btn-primary" @click="onSubmit()">Зарегистрироваться</button>
    </form>
  </div>
</template>

<style scoped lang="scss">
form {
  max-width: 360px;
  margin: 40px auto;
}
</style>
