<script setup>
import { RouterView } from 'vue-router'
import {useStore} from '@/stores/store.js'
import Navbar from './components/Navbar.vue';
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const cookieValue = cookies.get("coffee-token");
const store = useStore();

if(cookieValue) {
  store.isAuth = true;
}
</script>

<template>
  <Navbar />
  <div >
    <RouterView />
  </div>
</template>

<style scoped></style>
