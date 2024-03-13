<script setup>
import { useStore } from '@/stores/store.js'
import { useCookies } from "vue3-cookies";
import router from '@/router';

const { cookies } = useCookies();
const store = useStore();

function logout() {
  cookies.remove('coffee-token');
  store.isAuth = false;
  router.push('/')
}
</script>
<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Кофейня Анастасии</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto">
          <li class="nav-item" v-if="store.isAuth">
            <router-link class="nav-link" to="/catalog">Каталог товаров</router-link>
          </li>
          <li class="nav-item" v-if="store.isAuth">
            <router-link class="nav-link" to="/basket">Корзина</router-link>
          </li>
          <li class="nav-item" v-if="store.isAuth">
            <router-link class="nav-link" to="/profile">Личный кабинет</router-link>
          </li>
          <li class="nav-item" v-if="!store.isAuth">
            <router-link class="nav-link" to="/auth">Авторизация</router-link>
          </li>
          <li class="nav-item" v-if="!store.isAuth">
            <router-link class="nav-link" to="/signup">Регистрация</router-link>
          </li>
          <li class="nav-item" v-if="store.isAuth">
            <div class="nav-link logout" @click="logout()">Выйти</div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<style scoper>
  .logout {
    cursor: pointer;
  }
</style>