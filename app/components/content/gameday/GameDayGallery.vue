<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import Modal from '~/components/ui/Modal/Modal.vue'

const games = [
  {
    src: '/game-day/Game_1_vs_Wolves.png.webp',
    title: 'Bandits vs Wolves',
    subtitle: 'Victory at Home Court',
    date: 'March 15, 2024',
    venue: 'Home Court',
    result: 'Victory'
  },
  {
    src: '/game-day/Game_2_at_Buccs.png.webp',
    title: 'Bandits at Buccs',
    subtitle: 'Triumphant Away Game',
    date: 'March 22, 2024',
    venue: 'Away Game',
    result: 'Victory'
  },
  {
    src: '/game-day/Game_3_at_Hawks.png.webp',
    title: 'Bandits at Hawks',
    subtitle: 'Intense Battle',
    date: 'March 29, 2024',
    venue: 'Away Game',
    result: 'Close Match'
  },
  {
    src: '/game-day/Game_4_at_Senators.png.webp',
    title: 'Bandits at Senators',
    subtitle: 'Hard Fought Contest',
    date: 'April 5, 2024',
    venue: 'Away Game',
    result: 'Hard Fought'
  },
  {
    src: '/game-day/Game_5_vs_Giants.png.webp',
    title: 'Bandits vs Giants',
    subtitle: 'Dominant Home Victory',
    date: 'April 12, 2024',
    venue: 'Home Court',
    result: 'Victory'
  }
]

const currentIndex = ref(0)
const isModalOpen = ref(false)
const wrapper = ref(null)
const slider = ref(null)
const navContainer = ref(null)
const progressInterval = ref(null)

const selectedGame = computed(() => games[currentIndex.value])

const updateNavPosition = (index) => {
  if (navContainer.value) {
    const navItems = navContainer.value.querySelectorAll('.nav-item')
    if (navItems.length > 0) {
      const itemWidth = navItems[0].offsetWidth + 30 // item width + margin
      const containerWidth = navContainer.value.offsetWidth
      const totalWidth = itemWidth * games.length
      
      // Calculate the offset to center the active item
      let offset = -(index * itemWidth) + (containerWidth / 2) - (itemWidth / 2)
      
      // Create infinite scroll effect by duplicating items visually
      if (offset > 0) {
        offset -= totalWidth
      } else if (offset < -(totalWidth - containerWidth)) {
        offset += totalWidth
      }
      
      gsap.to('.nav-items', {
        x: offset,
        duration: 0.6,
        ease: "power2.out"
      })
    }
  }
}

const goToSlide = (index) => {
  if (index !== currentIndex.value && index >= 0 && index < games.length) {
    currentIndex.value = index
    animateToSlide(index)
    resetProgressBar()
    updateNavPosition(index)
  }
}

const nextSlide = () => {
  const nextIndex = (currentIndex.value + 1) % games.length
  goToSlide(nextIndex)
}

const animateToSlide = (index) => {
  // Animate slides
  gsap.to('.slide', {
    xPercent: -100 * index,
    duration: 0.8,
    ease: "power2.inOut"
  })
  
  // Animate text
  gsap.fromTo('#text', {
    opacity: 0,
    y: -50
  }, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    delay: 0.3,
    ease: "power2.out"
  })
}

const resetProgressBar = () => {
  // Reset all progress bars
  gsap.set('.nav-bar::before', { transform: 'translateX(-100%)' })
  
  // Animate the active progress bar
  const activeBar = document.querySelector(`.nav-item:nth-child(${currentIndex.value + 1}) .nav-bar::before`)
  if (activeBar) {
    gsap.to(activeBar, {
      transform: 'translateX(0%)',
      duration: 0.5,
      ease: "power2.out"
    })
  }
}

const openGameModal = () => {
  isModalOpen.value = true
}

const closeGameModal = () => {
  isModalOpen.value = false
}

onMounted(() => {
  // Initialize first slide
  goToSlide(0)
})

onBeforeUnmount(() => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
  }
})
</script>

<template>
  <div class="wrapper" id="wrapper" ref="wrapper">
    <div class="slider" ref="slider">
      <div 
        v-for="(game, index) in games" 
        :key="index"
        class="slide" 
        @click="openGameModal"
      >
        <NuxtImg 
          :src="game.src" 
          :alt="game.title"
          class="slide-image"
          loading="lazy"
        />
      </div>
    </div>

    <div class="text" id="text">
      {{ selectedGame.title }}
    </div>

    <div class="nav" id="nav" ref="navContainer">
      <div class="nav-items">
        <!-- Original items -->
        <div 
          v-for="(game, index) in games"
          :key="`original-${index}`"
          class="nav-item"
          :class="{ active: index === currentIndex }"
          @click="goToSlide(index)"
        >
          <span>{{ game.title }}</span>
          <div class="nav-bar"></div>
        </div>
        <!-- Duplicated items for infinite scroll effect -->
        <div 
          v-for="(game, index) in games"
          :key="`duplicate-${index}`"
          class="nav-item"
          :class="{ active: index === currentIndex }"
          @click="goToSlide(index)"
        >
          <span>{{ game.title }}</span>
          <div class="nav-bar"></div>
        </div>
      </div>
    </div>

    <button class="button" id="next" @click="nextSlide">
      <span>Next</span>
    </button>

    <!-- Modal -->
    <Modal
      :is-open="isModalOpen"
      :image="selectedGame?.src || ''"
      :title="selectedGame?.title || ''"
      :content="{
        Date: selectedGame?.date || '',
        Venue: selectedGame?.venue || '',
        Result: selectedGame?.result || ''
      }"
      @close="closeGameModal"
    />
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 100vh;
  background-color: #111;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.slider {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.slide {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  font-size: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: absolute;
  top: 0;
  left: 0;
}

.text {
  position: absolute;
  top: 120px;
  left: 120px;
  color: white;
  font-size: 60px;
  z-index: 10;
  opacity: 1;
  transform: translateY(-50px);
}

/* Positionierung und Styling der Navigationsleiste */
.nav {
  position: absolute;
  bottom: 80px;
  left: 100px;
  width: calc(100% - 200px);
  overflow: hidden;
  z-index: 10;
}

.nav-items {
  display: flex;
  flex-direction: row;
  transition: transform 0.6s ease;
}

/* Navigationsleiste */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 30px;
  cursor: pointer;
}

.nav-item span {
  color: white;
  opacity: 0.5;
  transition: opacity 0.5s ease;
}

.nav-item.active span {
  opacity: 1;
}

.nav-bar {
  width: 370px; /* Set this to the width you want for the nav bar */
  height: 5px;
  background-color: rgba(255, 255, 255, 0.5); /* Default background color */
  position: relative;
  overflow: hidden;
  opacity: 0.5; /* Default opacity */
  transition: opacity 0.5s ease, width 0.5s ease; /* Transition for width and opacity */
  margin-top: 20px;
}

.nav-bar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: white; /* Set background-color for the loading bar */
  transform: translateX(-100%); /* Start outside the bar */
  opacity: 1; /* Default opacity for loading animation */
  transition: transform 0.5s ease, opacity 0.5s ease;
}

/* Activate loading animation for the active bar */
.nav-item.active .nav-bar::before {
  transform: translateX(0); /* Fill the bar from left to right */
  opacity: 1; /* Set full opacity when active */
}

/* Full opacity for the active bar */
.nav-item.active .nav-bar {
  opacity: 1; /* Full opacity for active bar */
}

/* Hover-Effekt */
.nav-item:hover .nav-bar {
  background-color: white;
  opacity: 1;
}

/* Pfeil-Button */
.button {
  position: absolute;
  bottom: 60px;
  right: 40px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  z-index: 10;
  padding: 0;
  color: white;
}

.button span {
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Responsive Styles for smaller screens */
@media (max-width: 768px) {
  .button {
    bottom: 60px;
    right: 10px;
    width: 60px; /* Set a smaller width */
    height: 50px; /* Set a smaller height */
  }

  .button span {
    font-size: 14px;
  }

  .text {
    font-size: 40px;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .nav {
    position: absolute;
    bottom: 60px; /* Aligns the nav with the button */
    left: 10px; /* Align left with the button */
    width: calc(100% - 80px); /* Full width minus some padding for the button */
    overflow: hidden;
    z-index: 10;
  }

  .nav-items {
    display: flex;
    flex-direction: row;
    transition: transform 0.6s ease;
  }

  .nav-item {
    flex: 1; /* Each item takes equal space */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 0; /* No margin between items */
    cursor: pointer;
  }

  /* Inactive bars */
  .nav-bar {
    width: 60px; /* Smaller width for inactive bars */
    height: 4px; /* Adjust height if needed */
    background-color: transparent;
    position: relative;
    overflow: hidden;
    opacity: 0.5; /* Set to 0.5 for inactive bars on smaller screens */
    transition: opacity 0.5s ease, width 0.5s ease; /* Animate width and opacity */
  }

  /* Active bar */
  .nav-item.active .nav-bar {
    width: 90px; /* Larger width for the active bar */
    opacity: 1; /* Full opacity for active */
  }

  .nav-bar::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: white;
    transform: translateX(-100%); /* Start outside the bar */
    opacity: 0.5; /* Set to 0.5 for consistency */
    transition: transform 0.5s ease, opacity 0.5s ease;
  }

  /* Loading animation for active bar */
  .nav-item.active .nav-bar::before {
    transform: translateX(0); /* Fill the bar from left to right */
    opacity: 1;
  }

  /* Inactive text styling */
  .nav-item span {
    font-size: 14px; /* Keep the font size for visibility */
    opacity: 0.5; /* Slightly dim the inactive text */
  }

  /* Active text styling */
  .nav-item.active span {
    opacity: 1; /* Full opacity for active text */
  }
}

/* Keep the design for larger displays */
@media (min-width: 769px) and (max-width: 1366px) {
  .text {
    font-size: 80px;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .button {
    bottom: 11vh;
    right: 1vh;
    width: 120px; /* Set a smaller width */
    height: 40px; /* Set a smaller height */
  }

  .button span {
    font-size: 16px;
  }

  .nav {
    position: absolute;
    bottom: 7vh;
    left: 20px;
    display: flex;
    flex-direction: row;
    z-index: 10;
  }

  .nav-bar {
    width: 200px; /* Adjusted width to make it narrower */
    height: 5px; /* Adjust height if needed */
    background-color: rgba(255, 255, 255, 0.7);
    position: relative;
    overflow: hidden;
    opacity: 0.5; /* Set to 0.5 for inactive bars */
    transition: opacity 0.5s ease;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 10px; /* Reduced margin to create a more compact layout */
    cursor: pointer;
  }

  .nav-item:last-child {
    margin-right: 0; /* Remove margin for the last item */
  }

  .nav-item span {
    font-size: 14px; /* Keep the font size for visibility */
  }
}
</style>