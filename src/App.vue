<script setup>
import SiteHeader from "./components/SiteHeader.vue"
import SiteFooter from "./components/SiteFooter.vue"
</script>

<template>
  <SiteHeader />
  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <SiteFooter />
</template>

<style scoped>
main { min-height: 70vh; }
</style>