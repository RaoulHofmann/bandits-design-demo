<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue'
import Modal from '~/components/ui/Modal/Modal.vue'

export interface Card {
  id: number
  image: string
  title: string
  description: string
}

interface Props {
  cards: Card[]
  title?: string
  initialIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Collection',
  initialIndex: undefined
})

const cardsContainer: Ref<HTMLElement | null> = ref(null)
const selectedCard: Ref<Card | null> = ref(null)
const isModalOpen: Ref<boolean> = ref(false)

const currentIndex: Ref<number> = ref(
    props.initialIndex !== undefined
        ? props.initialIndex
        : Math.floor(props.cards.length / 2)
)

const openModal = (card: Card): void => {
  selectedCard.value = card
  isModalOpen.value = true
}

const closeModal = (): void => {
  isModalOpen.value = false
  selectedCard.value = null
}

const nextCard = (): void => {
  currentIndex.value = (currentIndex.value + 1) % props.cards.length
}

const prevCard = (): void => {
  currentIndex.value = currentIndex.value === 0 ? props.cards.length - 1 : currentIndex.value - 1
}

const goToCard = (index: number): void => {
  currentIndex.value = index
}

console.log(currentIndex.value)

onMounted(() => {
  // Touch/swipe support
  let startX = 0
  let endX = 0

  cardsContainer?.value?.addEventListener('touchstart', (e) => {
    startX = e.touches[0]?.clientX || 0
  })

  cardsContainer?.value?.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0]?.clientX || 0
    handleSwipe()
  })

  const handleSwipe = () => {
    const threshold = 50
    const diff = startX - endX

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextCard()
      } else {
        prevCard()
      }
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextCard()
    if (e.key === 'ArrowLeft') prevCard()
  })
})
</script>

<template>
  <section ref="cardsContainer" class="cards-section">
    <div class="container">
      <div class="gallery-header">
        <h2 class="gallery-title">{{ title }}</h2>
      </div>
      <div class="cards-grid pt-4" :style="{ '--current-index': currentIndex }">
        <div
            v-for="(card, index) in cards"
            :key="card.id"
            class="card"
            :class="{ active: index === currentIndex }"
            :style="{ '--card-index': index }"
            @click="openModal(card)"
        >
          <div class="card-inner">
            <div class="card-front">
              <NuxtImg :src="card.image" :alt="card.title"/>
              <div class="card-title">{{ card.title }}</div>
            </div>
            <div class="card-back">
              <div class="card-back-content">
                <h3>{{ card.title }}</h3>
                <p>{{ card.description }}</p>
                <div class="view-btn">View Full Image</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Carousel Navigation -->
        <div class="navigation-controls">
          <button @click="prevCard" class="nav-btn prev-btn" aria-label="Previous Card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
          </button>

          <button @click="nextCard" class="nav-btn next-btn" aria-label="Next Card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <Modal
        :is-open="isModalOpen"
        :image="selectedCard?.image || ''"
        :title="selectedCard?.title || ''"
        :content="{ Description: selectedCard?.description || '' }"
        @close="closeModal"
    />
  </section>
</template>

<style scoped>
.gallery-header {
  text-align: center;
  margin-bottom: 6rem;
}

.gallery-title {
  font-size: 3rem;
  background: var(--pitch-dark);
  background-size: 400% 400%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 8s ease infinite;
  margin-bottom: 1rem;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.cards-section {
  padding-bottom: 5rem;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.section-title {
  text-align: center;
  font-size: 3rem;
  font-weight: 700;
  color: var(--secondary);
  margin-bottom: 4rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.cards-grid {
  --current-index: 2;
  --card-index: 0;

  position: relative;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  position: absolute;
  width: 400px;
  height: 600px;
  perspective: 1000px;
  cursor: pointer;
  transform: translateX(calc((var(--card-index) - var(--current-index)) * 350px)) rotate(calc((var(--card-index) - var(--current-index)) * 2deg)) scale(0.9);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 1;
}

.card.active {
  transform: translateX(calc((var(--card-index) - var(--current-index)) * 350px)) rotate(calc((var(--card-index) - var(--current-index)) * 2deg)) scale(1);
  z-index: 101;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.3s;
  transform-style: preserve-3d;
}

.card:hover .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  overflow: hidden;
}

.card-front {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-back {
  transform: rotateY(-180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #ffffff;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
  background-image: radial-gradient(circle at 10% 10%, rgba(237, 122, 26, 0.05) 1px, transparent 1px),
  radial-gradient(circle at 90% 90%, rgba(237, 122, 26, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.card-front img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: var(--primary-foreground);
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
}

.card:hover .card-shine {
  left: 100%;
}

.card-back-content {
  padding: 2rem;
  text-align: center;
  color: var(--foreground);
}

.card-back-content h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.card-back-content p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.view-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  display: inline-block;
  transition: all 0.3s;
}

.view-btn:hover {
  background: white;
  color: var(--bandit-orange);
}

.navigation-controls {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: space-between;
  z-index: 100;
}

.nav-btn {
  background: var(--bandit-orange);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 100;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.dots-indicator {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  transform: scale(1.2);
}

.dot:hover {
  background: rgba(255, 255, 255, 0.6);
}

@media (max-width: 768px) {
  .cards-section {
    padding: 4rem 1rem;
  }

  .cards-grid {
    height: 700px;
    padding-top: 0;
  }

  .card {
    width: 100%;
    height: 600px;
    transform: translateX(calc((var(--card-index) - var(--current-index)) * 250px)) rotate(calc((var(--card-index) - var(--current-index)) * 2deg)) scale(0.9);
  }

  .card.active {
    transform: translateX(calc((var(--card-index) - var(--current-index)) * 250px)) rotate(calc((var(--card-index) - var(--current-index)) * 2deg)) scale(1);
  }
}
</style>