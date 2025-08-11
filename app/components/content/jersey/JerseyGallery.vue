<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Modal from '~/components/ui/Modal/Modal.vue'

gsap.registerPlugin(ScrollTrigger)

const jerseyContainer = ref(null)
const jerseyItems = ref([])

const jerseys = [
  {
    src: '/jerseys/HawksVRedbacks_Chyon.jpg.webp',
    name: 'Hawks vs Redbacks',
    year: '2024',
    type: 'Match Jersey'
  },
  {
    src: '/jerseys/Nat_Chou.JPG.webp',
    name: 'National Championship',
    year: '2024',
    type: 'Championship Jersey'
  },
  {
    src: '/jerseys/P1529654_edit.jpg.webp',
    name: 'Professional Series',
    year: '2024',
    type: 'Pro Jersey'
  },
  {
    src: '/jerseys/P1634004.jpg.webp',
    name: 'Tournament Edition',
    year: '2024',
    type: 'Tournament Jersey'
  },
  {
    src: '/jerseys/Redbacks-2025-PinkJe.jpg.webp',
    name: 'Redbacks Pink Edition',
    year: '2025',
    type: 'Special Edition'
  }
]

const selectedJersey = ref(0)
const isModalOpen = ref(false)

const openJerseyModal = (index) => {
  selectedJersey.value = index
  isModalOpen.value = true
}

const closeJerseyModal = () => {
  isModalOpen.value = false
}

const initAnimations = () => {
  // Animate jerseys on scroll
  jerseyItems.value.forEach((item, index) => {
    if (!item) return

    gsap.fromTo(item,
        {
          y: 100,
          opacity: 0,
          rotateX: -90,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
    )
  })

  // Title animation
  gsap.fromTo('.gallery-title',
      { y: -50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.gallery-title',
          start: "top 80%"
        }
      }
  )

  gsap.fromTo('.gallery-subtitle',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.gallery-subtitle',
          start: "top 80%"
        }
      }
  )
}

onMounted(() => {
  nextTick(() => {
    initAnimations()
  })
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<template>
  <section class="jersey-gallery">
    <div class="gallery-header">
      <h2 class="gallery-title">Jersey Collection</h2>
      <p class="gallery-subtitle">Explore our unique jersey designs</p>
    </div>
    
    <div class="jerseys-container" ref="jerseyContainer">
      <div 
        v-for="(jersey, index) in jerseys" 
        :key="index"
        class="jersey-item"
        :ref="el => jerseyItems[index] = el"
        @click="openJerseyModal(index)"
      >
        <div class="jersey-image-wrapper">
          <NuxtImg
            :src="jersey.src" 
            :alt="jersey.name"
            class="jersey-image"
            loading="lazy"
          />
          <div class="jersey-overlay">
            <h3 class="jersey-name">{{ jersey.name }}</h3>
            <div class="jersey-details">
              <span class="jersey-year">{{ jersey.year }}</span>
              <span class="jersey-type">{{ jersey.type }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal for expanded jersey view -->
    <Modal
      :is-open="isModalOpen"
      :image="jerseys[selectedJersey]?.src || ''"
      :title="jerseys[selectedJersey]?.name || ''"
      :content="{
        Year: jerseys[selectedJersey]?.year || '',
        Type: jerseys[selectedJersey]?.type || ''
      }"
      @close="closeJerseyModal"
    />
  </section>
</template>

<style scoped>
.jersey-gallery {
  padding: 2rem;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
}

.gallery-header {
  text-align: center;
  margin-bottom: 6rem;
}

.gallery-title {
  font-size: 3rem;
  background: var(--bandit-orange);
  background-size: 400% 400%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 8s ease infinite;
  margin-bottom: 1rem;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.gallery-subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 300;
  letter-spacing: 1px;
}

.jerseys-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;
  perspective: 1000px;
}

.jersey-item {
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: all 0.3s ease;
}

.jersey-image-wrapper {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.jersey-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.jersey-item:hover .jersey-image {
  transform: scale(1.1);
}

.jersey-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  padding: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.jersey-name {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}

.jersey-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.jersey-year,
.jersey-type {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  padding: 0.3rem 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(5px);
}


@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@media (max-width: 768px) {
  .gallery-title {
    font-size: 2.5rem;
  }
  
  .jerseys-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
  
  .jersey-gallery {
    padding: 4rem 1rem;
  }
  
  .jersey-image {
    height: 450px;
  }
  
  /* Modal mobile styles */
  .modal-content {
    max-width: 95vw;
    max-height: 95vh;
    padding: 1rem;
  }
  
  .modal-jersey {
    flex-direction: column;
    gap: 1rem;
  }
  
  .modal-jersey-image {
    width: 100%;
    max-width: 350px;
    height: 450px;
  }
  
  .modal-jersey-info {
    padding: 1rem;
    text-align: center;
  }
  
  .modal-jersey-name {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  .modal-jersey-year,
  .modal-jersey-type {
    font-size: 1rem;
    padding: 0.8rem 1rem;
  }
}
</style>