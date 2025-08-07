<script setup lang="ts">
import Hero from '~/components/content/hero/Hero.vue';
import PortfolioCards from '~/components/content/portfolio/PortfolioCards.vue';

const { data: home } = await useAsyncData(() => queryCollection('content').path('/').first())

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description
})
</script>

<template>
  <div>
    <Hero />
    <PortfolioCards />
    <div class="content-section">
      <ContentRenderer v-if="home" :value="home" />
      <div v-else>Home not found</div>
    </div>
  </div>
</template>

<style scoped>
.content-section {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
