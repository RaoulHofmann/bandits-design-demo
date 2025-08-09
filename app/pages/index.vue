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
    <Hero />
    <div  class="text-center mb-3">
      <h1 id="about">About</h1>
      <p class="subtitle mx-auto">
        We're a Perth based graphic design company specialising in sports design. Whether you need social media graphics, flyers, jerseys or logos, we can help
      </p>
    </div>
    <h1 id="portfolio" class="text-center">Portfolio</h1>
    <PortfolioCards />
    <JerseyGallery />
    <GameDayGallery />
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

.subtitle {
  font-size: 1.5rem;
  color: var(--pitch-light);
  font-weight: 300;
  letter-spacing: 1px;
  text-align: center;
  width: 70%;
}
</style>
