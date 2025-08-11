<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import Modal from '~/components/ui/Modal/Modal.vue'

interface ClientCard {
  id: number
  image: string
  title: string
  description?: string
}

const selectedCard: Ref<ClientCard | null> = ref(null)
const isModalOpen: Ref<boolean> = ref(false)
const cardsPerRow = 3

const cards: Ref<ClientCard[]> = ref([
  {
    id: 1,
    image: '/clients/BasketballIcon.png.webp',
    title: 'Basketball Icon',
  },
  {
    id: 2,
    image: '/clients/Redbacks_logo_600.png.webp',
    title: 'Redbacks Logo',
  },
  {
    id: 3,
    image: '/clients/Promondo-Web-Black-o.jpeg.webp',
    title: 'Perth Redbacks',
  },
  {
    id: 4,
    image: '/clients/Grace_Basketball_log.png.webp',
    title: 'Grace Basketball',
  },
  // Add more cards as needed...
])

// Computed property to create rows dynamically
const gridRows = computed(() => {
  const rows = []
  for (let i = 0; i < cards.value.length; i += cardsPerRow) {
    const rowCards = cards.value.slice(i, i + cardsPerRow)
    const isOffset = Math.floor(i / cardsPerRow) % 2 === 1 // Every second row is offset
    rows.push({
      cards: rowCards,
      isOffset,
      key: `row-${i}`
    })
  }
  return rows
})

const openModal = (card: ClientCard): void => {
  selectedCard.value = card
  isModalOpen.value = true
}

const closeModal = (): void => {
  isModalOpen.value = false
}
</script>

<template>
  <section class="clients-gallery-section sub-section">
    <div class="container">
      <div class="gallery-header">
        <h2 class="gallery-title">Our Clients</h2>
      </div>

      <div class="clients-grid">
        <div
            v-for="row in gridRows"
            :key="row.key"
            class="grid-row"
            :class="{ offset: row.isOffset }"
        >
          <div
              v-for="card in row.cards"
              :key="card.id"
              class="grid-card"
              @click="openModal(card)"
          >
            <div class="card-image-wrapper">
              <NuxtImg :src="card.image" :alt="card.title" class="card-image" loading="lazy" />
              <div class="card-overlay">
                <div class="card-content">
                  <h3 class="card-title">{{ card.title }}</h3>
                  <p v-if="card.description" class="card-description">{{ card.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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

/* Grid Layout */
.clients-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.grid-row {
  display: flex;
  gap: 1.5rem;
  justify-content: flex-start;
}

.grid-row.offset {
  padding-left: 10%;
  width: 90%;
}

.grid-card {
  width: calc((100% - 3rem) / 3); /* Fixed width for 3 cards per row with gaps */
  min-width: 280px;
  position: relative;
  cursor: pointer;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 250px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.grid-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
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
  background-color: rgba(255, 255, 255, 0.05);
}

.grid-card:hover .card-image {
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
  padding: 1.5rem;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.grid-card:hover .card-overlay {
  opacity: 1;
}

.card-content {
  color: white;
  text-align: left;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #fff;
}

.card-description {
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  opacity: 0.9;
}

/* Modal Styles */
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

/* Responsive Styles */
@media (max-width: 1024px) {
  .grid-row.offset {
    padding-left: 8%;
    width: 92%;
  }

  .grid-card {
    width: calc((100% - 2rem) / 3);
    min-width: 240px;
    height: 220px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .gallery-title {
    font-size: 2rem;
  }

  .clients-grid {
    gap: 1.5rem;
  }

  .grid-row {
    gap: 1rem;
  }

  .grid-row.offset {
    padding-left: 5%;
    width: 95%;
  }

  .grid-card {
    width: calc((100% - 2rem) / 3);
    min-width: 180px;
    height: 180px;
  }

  .card-title {
    font-size: 1.2rem;
  }

  .card-description {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .grid-row {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }

  .grid-row.offset {
    padding-left: 0;
    width: 100%;
  }

  .grid-card {
    width: 100%;
    max-width: 350px;
    height: 200px;
  }
}
</style>