<script setup lang="ts">
import Hero from '~/components/content/hero/Hero.vue';
import PortfolioCards from '~/components/content/portfolio/PortfolioCards.vue';
import JerseyGallery from '~/components/content/jersey/JerseyGallery.vue';
import GameDayGallery from '~/components/content/gameday/GameDayGallery.vue';

const { data: home } = await useAsyncData(() => queryCollection('content').path('/').first())

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description
})
</script>

<template>
  <div>
    <div class="content-section">
      <ContentRenderer v-if="home" :value="home" />
      <div v-else>Home not found</div>
    </div>
  </div>
</template>

<style scoped>
.content-section {
  width: 100%;
  margin: 0 auto;
}


</style>
