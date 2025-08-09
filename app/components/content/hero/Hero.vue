<script setup lang="ts">
import { ref, onMounted } from 'vue';
const { $gsap: gsap } = useNuxtApp();

const heroSection = ref(null);

onMounted(() => {
  // Initial animations for the hero section
  gsap.from('.hero-title-bandits', {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.2
  });
  
  gsap.from('.hero-title-design', {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.4
  });
  
  gsap.from('.hero-image', {
    x: 100,
    opacity: 0,
    duration: 1.2,
    delay: 0.6
  });
  
  // Scroll animation for the hero image
  gsap.to('.hero-image', {
    right: '0%', // Move to center
    scrollTrigger: {
      trigger: heroSection.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true, // Smooth animation tied to scroll position
    }
  });
});
</script>

<template>
  <div ref="heroSection" class="hero-container">
    <div class="hero-content">
      <div class="hero-title">
        <div class="hero-title-bandits">BANDITS</div>
        <div class="hero-title-design">DESIGN</div>
      </div>
      <div class="hero-image">
        <NuxtImg src="/Bandits_Design_squar-cropped.svg" alt="Bandits Design Logo" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-container {
  background-color: #000;
  height: 60vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: center; /* Center content horizontally */
  width: 80%;
  max-width: 1200px;
  z-index: 1;
  position: relative; /* Added for absolute positioning of image */
}

.hero-title {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center title elements */
  text-align: center;
  z-index: 2; /* Ensure title is above the image */
}

.hero-title-bandits {
  background-color: #fff;
  color: #000;
  font-size: 4rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  display: inline-block;
}

.hero-title-design {
  background-color: #000;
  color: #fff;
  font-size: 4rem;
  font-weight: 400;
  padding: 0.5rem 1rem;
  border-top: 2px solid #fff; /* Only border-top as requested */
  display: inline-block;
  width: 100%;
}

.hero-image {
  position: absolute;
  width: 100%; /* Larger image */
  max-width: 800px;
  right: -50%;
}

.hero-image img {
  width: 100%;
  opacity: 0.4;
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-image {
    width: 70%;
    margin-top: 2rem;
  }
  
  .hero-title-bandits, .hero-title-design {
    font-size: 3rem;
  }
}
</style>