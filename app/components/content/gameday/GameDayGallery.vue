<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Modal from '~/components/ui/Modal.vue'

gsap.registerPlugin(ScrollTrigger)

const galleryContainer = ref(null)
const gameItems = ref([])
const titleRef = ref(null)
const subtitleRef = ref(null)

const games = [
  {
    src: '/game-day/Game_1_vs_Wolves.png.webp',
    title: 'Game 1: Bandits vs Wolves',
    date: 'March 15, 2024',
    venue: 'Home Court',
    result: 'Victory'
  },
  {
    src: '/game-day/Game_2_at_Buccs.png.webp',
    title: 'Game 2: Bandits at Buccs',
    date: 'March 22, 2024',
    venue: 'Away Game',
    result: 'Victory'
  },
  {
    src: '/game-day/Game_3_at_Hawks.png.webp',
    title: 'Game 3: Bandits at Hawks',
    date: 'March 29, 2024',
    venue: 'Away Game',
    result: 'Close Match'
  },
  {
    src: '/game-day/Game_4_at_Senators.png.webp',
    title: 'Game 4: Bandits at Senators',
    date: 'April 5, 2024',
    venue: 'Away Game',
    result: 'Hard Fought'
  },
  {
    src: '/game-day/Game_5_vs_Giants.png.webp',
    title: 'Game 5: Bandits vs Giants',
    date: 'April 12, 2024',
    venue: 'Home Court',
    result: 'Victory'
  }
]

const selectedGame = ref(0)
const isModalOpen = ref(false)
const tl = ref(null)

const openGameModal = (index) => {
  selectedGame.value = index
  isModalOpen.value = true
}

const closeGameModal = () => {
  isModalOpen.value = false
}

const initAnimations = () => {
  // Create main timeline for coordinated animations
  tl.value = gsap.timeline({
    scrollTrigger: {
      trigger: galleryContainer.value,
      start: "top 70%",
      end: "bottom 30%",
      toggleActions: "play none none reverse"
    }
  })

  // Title animation with typewriter effect
  if (titleRef.value) {
    const titleText = titleRef.value.textContent
    titleRef.value.textContent = ''
    tl.value.to(titleRef.value, {
      duration: 1.5,
      text: titleText,
      ease: "none"
    }, 0)
  }

  // Subtitle slide up
  if (subtitleRef.value) {
    tl.value.fromTo(subtitleRef.value,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      0.5
    )
  }

  // Game cards with morphing entrance animation
  gameItems.value.forEach((item, index) => {
    if (!item) return

    // Get the final rotation from CSS
    const finalRotations = [-2, 1.5, -1, 2, -1.5]
    const finalRotation = finalRotations[index] || 0

    // Set initial state
    gsap.set(item, {
      scale: 0,
      rotation: finalRotation + 180,
      opacity: 0,
      y: 100 + (index * 20),
      transformOrigin: "center center"
    })

    // Create individual scroll trigger for each card
    gsap.to(item, {
      scale: 1,
      rotation: finalRotation,
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "back.out(1.2)",
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      delay: index * 0.2
    })

    // Add hover animations
    item.addEventListener('mouseenter', () => {
      gsap.to(item, {
        scale: 1.05,
        rotationY: 5,
        z: 50,
        duration: 0.3,
        ease: "power2.out"
      })
    })

    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        scale: 1,
        rotationY: 0,
        z: 0,
        duration: 0.3,
        ease: "power2.out"
      })
    })
  })

}

onMounted(async () => {
  await nextTick()
  initAnimations()

})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.trigger && galleryContainer.value?.contains(trigger.vars.trigger)) {
      trigger.kill()
    }
  })
  if (tl.value) {
    tl.value.kill()
  }
})
</script>

<template>
  <section class="game-day-gallery" ref="galleryContainer">
    <div class="container">
      <h2 class="gallery-title" ref="titleRef">Game Day Highlights</h2>
      <p class="gallery-subtitle" ref="subtitleRef">
        Relive the excitement from our epic matchups and victories
      </p>
      
      <div class="games-grid">
        <div
          v-for="(game, index) in games"
          :key="index"
          :ref="(el) => gameItems[index] = el"
          class="game-card"
          @click="openGameModal(index)"
        >
          <div class="game-image-wrapper">
            <NuxtImg :src="game.src" :alt="game.title" class="game-image" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Modal
      :is-open="isModalOpen"
      :image="games[selectedGame]?.src || ''"
      :title="games[selectedGame]?.title || ''"
      :content="{
        Date: games[selectedGame]?.date || '',
        Venue: games[selectedGame]?.venue || '',
        Result: games[selectedGame]?.result || ''
      }"
      @close="closeGameModal"
    />
  </section>
</template>

<style scoped>
.game-day-gallery {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.game-day-gallery::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(78, 205, 196, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.gallery-title {
  font-size: 4rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease-in-out infinite alternate;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.gallery-subtitle {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 4rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(800px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
  position: relative;
  justify-items: center;
  max-width: 1800px;
  margin: 0 auto;
}

.game-card {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  background: transparent;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  flex-shrink: 0;
  transform-style: preserve-3d;
  width: 500px;
  height: 600px;
}

.game-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 1px,
      rgba(0, 0, 0, 0.01) 1px,
      rgba(0, 0, 0, 0.01) 2px
    );
  pointer-events: none;
  z-index: 1;
}

.game-card:nth-child(1) {
  transform: rotate(-2deg) translateY(-40px);
  grid-column: 1;
  grid-row: 1;
}

.game-card:nth-child(2) {
  transform: rotate(1.5deg) translateY(80px) translateX(-30px);
  grid-column: 2;
  grid-row: 1;
}

.game-card:nth-child(3) {
  transform: rotate(-1deg) translateY(-60px) translateX(40px);
  grid-column: 1;
  grid-row: 2;
}

.game-card:nth-child(4) {
  transform: rotate(2deg) translateY(100px) translateX(-20px);
  grid-column: 2;
  grid-row: 2;
}

.game-card:nth-child(5) {
  transform: rotate(-1.5deg) translateY(20px) translateX(30px);
  grid-column: 1 / -1;
  grid-row: 3;
  justify-self: center;
}

.game-image-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.game-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.game-card:hover .game-image {
  transform: scale(1.1);
}

.game-card:hover {
  transform: translateY(-15px);
}

.game-card:hover .game-overlay {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .gallery-title {
    font-size: 2.5rem;
  }
  
  .games-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
    max-width: 100%;
  }
  
  .game-card:nth-child(1),
  .game-card:nth-child(2),
  .game-card:nth-child(3),
  .game-card:nth-child(4),
  .game-card:nth-child(5) {
    width: 90vw;
    max-width: 400px;
    height: 300px;
    transform: rotate(0deg) translateX(0) translateY(0);
    grid-column: 1;
    grid-row: auto;
    justify-self: center;
  }

  .game-day-gallery {
    padding: 3rem 1rem;
  }
}
</style>