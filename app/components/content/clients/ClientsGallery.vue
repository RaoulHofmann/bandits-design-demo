<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue'
import Modal from '~/components/ui/Modal/Modal.vue'

interface ClientCard {
  id: number
  image: string
  title: string
  description: string
}

const cardsContainer: Ref<HTMLElement | null> = ref(null)
const selectedCard: Ref<ClientCard | null> = ref(null)
const isModalOpen: Ref<boolean> = ref(false)
const cards: Ref<ClientCard[]> = ref([
  {
    id: 1,
    image: '/clients/BasketballIcon.png.webp',
    title: 'Basketball Icon',
    description: 'Professional basketball icon design with modern styling and clean aesthetics.'
  },
  {
    id: 2,
    image: '/clients/Redbacks_logo_600.png.webp',
    title: 'Redbacks Logo',
    description: 'Official Redbacks team logo featuring bold design and team branding elements.'
  },
  {
    id: 3,
    image: '/clients/Promondo-Web-Black-o.jpeg.webp',
    title: 'Promondo',
    description: 'Promondo brand identity with sophisticated black and white design approach.'
  },
  {
    id: 4,
    image: '/clients/Grace_Basketball_log.png.webp',
    title: 'Grace Basketball',
    description: 'Grace Basketball logo design combining elegance with sports energy and movement.'
  }
])
const currentIndex: Ref<number> = ref(Math.floor(cards.value.length / 2))

const nextCard = (): void => {
  currentIndex.value = (currentIndex.value + 1) % cards.value.length
}

const prevCard = (): void => {
  currentIndex.value = currentIndex.value === 0 ? cards.value.length - 1 : currentIndex.value - 1
}

const goToCard = (index: number): void => {
  currentIndex.value = index
}

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

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextCard()
    if (e.key === 'ArrowLeft') prevCard()
  })
})
</script>

<template>
  <section ref="cardsContainer" class="clients-gallery-section">
    <div class="container">
      <div class="gallery-header">
        <h2 class="gallery-title">Our Clients</h2>
      </div>
      
      <div class="cards-carousel">
        <div class="cards-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <div
            v-for="(card, index) in cards"
            :key="card.id"
            class="card"
            :class="{ 
              'active': index === currentIndex,
              'prev': index === (currentIndex - 1 + cards.length) % cards.length,
              'next': index === (currentIndex + 1) % cards.length
            }"
          >
            <div class="card-image-wrapper">
              <NuxtImg :src="card.image" :alt="card.title" class="card-image" loading="lazy" />
              <div class="card-overlay">
                <div class="card-content">
                  <h3 class="card-title">{{ card.title }}</h3>
                  <p class="card-description">{{ card.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="navigation-controls">
        <button @click="prevCard" class="nav-btn prev-btn" aria-label="Previous client">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <div class="dots-indicator">
          <button
            v-for="(card, index) in cards"
            :key="index"
            @click="goToCard(index)"
            :class="['dot', { active: index === currentIndex }]"
            :aria-label="`Go to client ${index + 1}`"
          ></button>
        </div>
        
        <button @click="nextCard" class="nav-btn next-btn" aria-label="Next client">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal -->
    <Modal :is-open="isModalOpen" @close="closeModal">
      <div v-if="selectedCard" class="modal-content">
        <img :src="selectedCard.image" :alt="selectedCard.title" class="modal-image" />
        <div class="modal-info">
          <h3 class="modal-title">{{ selectedCard.title }}</h3>
          <p class="modal-description">{{ selectedCard.description }}</p>
        </div>
      </div>
    </Modal>
  </section>
</template>

<style scoped>
.clients-gallery-section {
  padding: 4rem 0;
  min-height: 70vh;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.gallery-header {
  text-align: center;
  margin-bottom: 3rem;
}

.gallery-title {
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: white;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cards-carousel {
  position: relative;
  height: 500px;
  overflow: hidden;
  border-radius: 20px;
}

.cards-track {
  display: flex;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.card {
  flex: 0 0 100%;
  position: relative;
  cursor: pointer;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-image-wrapper {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.6s ease;
}

.card:hover .card-image {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 2rem;
  transition: opacity 0.3s ease;
}

.card:hover .card-overlay {
  opacity: 1;
}

.card-content {
  color: white;
  text-align: left;
}

.card-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #fff;
}

.card-description {
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  opacity: 0.9;
}

.view-btn {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.view-btn:hover {
  transform: translateY(-2px);
}

.navigation-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.1);
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

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.modal-image {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.modal-info {
  padding: 1rem;
}

.modal-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #333;
}

.modal-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .gallery-title {
    font-size: 2rem;
  }

  .cards-carousel {
    height: 400px;
  }

  .card-content {
    padding: 1rem;
  }

  .card-title {
    font-size: 1.4rem;
  }

  .card-description {
    font-size: 0.9rem;
  }

  .navigation-controls {
    gap: 1rem;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
  }
}
</style>