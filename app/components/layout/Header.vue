<script setup lang="ts">
import { ref, onMounted } from 'vue';
const { $gsap: gsap, $ScrollTrigger: ScrollTrigger } = useNuxtApp();

const header = ref(null);
const logo = ref(null);
const isScrolled = ref(false);

onMounted(() => {
  // Initially hide the logo
  gsap.set(logo.value, { opacity: 0 });
  
  // Set up scroll trigger for header color change and logo appearance
  ScrollTrigger.create({
    start: "top -50",
    onEnter: () => {
      isScrolled.value = true;
      // Animate logo to appear
      gsap.to(logo.value, { opacity: 1, duration: 0.5 });
    },
    onLeaveBack: () => {
      isScrolled.value = false;
      // Animate logo to disappear
      gsap.to(logo.value, { opacity: 0, duration: 0.3 });
    }
  });
});
</script>

<template>
  <header ref="header" class="header" :class="{ 'scrolled': isScrolled }">
    <div class="header-container">
      <div ref="logo" class="logo">
        <span class="logo-bandits">BANDITS</span>
        <span class="logo-design">DESIGN</span>
      </div>
      <nav class="menu">
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Portfolio</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #000; /* Initially black to blend with hero */
  border-bottom: 0;
  box-shadow: none;
  outline-color: #000;
  z-index: 1;
  transition: all 0.5s ease;
}

.header.scrolled {
  background: linear-gradient(135deg, var(--pitch-dark), var(--pitch-blue));
  border-bottom: 2px solid var(--bandit-orange);
  z-index: 9999;
  box-shadow: 0 4px 20px rgba(237, 122, 26, 0.2) !important;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-bandits {
  background-color: #fff;
  color: #000;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  font-size: 1.2rem;
}

.logo-design {
  background-color: #000;
  color: #fff;
  font-weight: 400;
  padding: 0.2rem 0.5rem;
  border: 1px solid #fff;
  font-size: 1.2rem;
}

.menu ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu li {
  margin-left: 2rem;
}

.menu a {
  color: var(--primary-foreground);
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.menu a:hover {
  color: var(--bandit-orange);
}

.header.scrolled .menu a {
  color: var(--primary-foreground);
}

.header.scrolled .menu a:hover {
  color: var(--bandit-orange);
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    padding: 1rem;
  }
  
  .menu {
    margin-top: 1rem;
  }
  
  .menu ul {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .menu li {
    margin: 0.5rem;
  }
}
</style>