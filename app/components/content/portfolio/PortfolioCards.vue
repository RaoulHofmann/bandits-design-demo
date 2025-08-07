<script setup lang="ts">
import { ref, onMounted } from 'vue';
const { $gsap: gsap, $ScrollTrigger: ScrollTrigger } = useNuxtApp();

const cardsContainer = ref(null);
const selectedCard = ref(null);
const isModalOpen = ref(false);
const cards = ref([
  { 
    id: 1, 
    image: '/portfolio/Formosa.png.webp',
    title: 'Formosa',
    description: 'A dynamic design showcasing the energy and movement of sports.',
    weight: 2 // Lower weight, positioned to the left
  },
  { 
    id: 2, 
    image: '/portfolio/Game_Day_Game_3_post.png.webp',
    title: 'Game Day',
    description: 'Promotional material designed for game day excitement and fan engagement.',
    weight: 4 // Medium-low weight, positioned left of center
  },
  { 
    id: 3, 
    image: '/portfolio/NBL1_Wallpaper_v6.jpg.webp',
    title: 'NBL1 Wallpaper',
    description: 'Official wallpaper design for the National Basketball League featuring bold colors and dynamic elements.',
    weight: 5 // Highest weight, positioned in the center
  },
  { 
    id: 4, 
    image: '/portfolio/NBL_Champion.png.webp',
    title: 'NBL Champion',
    description: 'Championship celebration design highlighting the achievement and victory moment.',
    weight: 3 // Medium-high weight, positioned right of center
  },
  { 
    id: 5, 
    image: '/portfolio/PBA_Wallpaper_v6.jpg.webp',
    title: 'PBA Wallpaper',
    description: 'Professional Basketball Association wallpaper with striking visuals and team branding.',
    weight: 1 // Lowest weight, positioned to the right
  }
]);

// Methods for modal functionality
const openModal = (card) => {
  selectedCard.value = card;
  isModalOpen.value = true;
  
  // Animate modal opening
  gsap.fromTo('.modal-container', 
    { opacity: 0, scale: 0.8 }, 
    { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
  );
};

const closeModal = () => {
  // Animate modal closing
  gsap.to('.modal-container', {
    opacity: 0, 
    scale: 0.8, 
    duration: 0.3,
    onComplete: () => {
      isModalOpen.value = false;
      selectedCard.value = null;
    }
  });
};

onMounted(() => {
  // Initialize GSAP animations
  initCardAnimations();
});

const initCardAnimations = () => {
  // Set initial state for cards
  gsap.set('.portfolio-card', { 
    y: 100,
    opacity: 0,
    rotationY: -15,
    transformPerspective: 800,
    scale: 0.9
  });
  
  // Create staggered animation for cards
  ScrollTrigger.batch('.portfolio-card', {
    start: "top bottom-=100",
    onEnter: (elements) => {
      gsap.to(elements, {
        y: 0,
        opacity: 1,
        rotationY: 0,
        scale: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(1.2)"
      });
      
      // Add subtle floating animation to all cards
      elements.forEach((card, index) => {
        gsap.to(card, {
          y: '-=5',
          duration: 2 + (index * 0.2),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.1
        });
      });
    },
    onLeaveBack: (elements) => {
      gsap.to(elements, {
        y: 100,
        opacity: 0,
        rotationY: -15,
        scale: 0.9,
        stagger: 0.1,
        duration: 0.5
      });
    }
  });
  
  // Add hover animations for each card
  const cards = document.querySelectorAll('.portfolio-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Only change shadow on hover, not position
      gsap.to(card, {
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    card.addEventListener('mouseleave', () => {
      // Restore original shadow
      gsap.to(card, {
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        duration: 0.5,
        ease: "power2.out"
      });
    });
  });
};
</script>

<template>
  <section ref="cardsContainer" class="portfolio-cards-section">
    <div class="container">
      <h2 class="section-title">Portfolio</h2>
      <div class="cards-grid">
        <div 
          v-for="card in cards" 
          :key="card.id" 
          class="portfolio-card"
          :data-weight="card.weight"
          @click="openModal(card)"
        >
          <div class="card-inner">
            <div class="card-front">
              <NuxtImg :src="card.image" :alt="card.title" />
              <div class="card-title">{{ card.title }}</div>
              <div class="card-shine"></div>
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
      </div>
    </div>
    
    <!-- Modal for full image view -->
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <button class="modal-close" @click="closeModal">&times;</button>
        <div class="modal-content">
          <h2>{{ selectedCard.title }}</h2>
          <p class="modal-description">{{ selectedCard.description }}</p>
          <div class="modal-image">
            <NuxtImg :src="selectedCard.image" :alt="selectedCard.title" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.portfolio-cards-section {
  padding: 6rem 2rem 4rem;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.cards-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
  position: relative;
  padding: 2rem 0;
}

.portfolio-card {
  perspective: 1000px;
  height: 800px; /* Increased height from 380px to 480px */
  width: 450px; /* Increased width to span more horizontally */
  cursor: pointer;
  transition: all 0.5s ease;
  position: absolute;
  transform-origin: bottom center;
}

/* Fan layout positioning based on card weight */

/* Apply styles dynamically based on card weight */
.portfolio-card[data-weight="5"] {
  transform: rotate(0deg);
  z-index: 5;
}

.portfolio-card[data-weight="4"] {
  transform: rotate(-15deg) translateX(-30%) translateY(2%);
  z-index: 4;
}

.portfolio-card[data-weight="3"] {
  transform: rotate(15deg) translateX(30%) translateY(2%);
  z-index: 3;
}

.portfolio-card[data-weight="2"] {
  transform: rotate(-30deg) translateX(-60%) translateY(5%);
  z-index: 2;
}

.portfolio-card[data-weight="1"] {
  transform: rotate(30deg) translateX(60%) translateY(5%);
  z-index: 1;
}

.portfolio-card:hover {
  z-index: 10;
  /* No transform change on hover - cards stay in place when flipping */
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.portfolio-card:hover .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border: 2px solid var(--bandit-orange);
  border-radius: 12px;
  overflow: hidden;
}

.card-front {
  background: linear-gradient(135deg, var(--pitch-dark), var(--pitch-blue));
}

.card-back {
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #ffffff; /* White background for card game look */
  border: 2px solid var(--bandit-orange);
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1); /* Inner shadow for depth */
  background-image: 
    radial-gradient(circle at 10% 10%, rgba(237, 122, 26, 0.05) 1px, transparent 1px),
    radial-gradient(circle at 90% 90%, rgba(237, 122, 26, 0.05) 1px, transparent 1px);
  background-size: 20px 20px; /* Subtle pattern for card game feel */
}

.card-back-content {
  padding: 2rem;
  color: #000; /* Black text for better contrast on white */
  width: 90%;
  max-width: 300px;
}

.card-back-content h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--bandit-orange); /* Orange title for card game feel */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid var(--bandit-orange);
  padding-bottom: 0.5rem;
}

.card-back-content p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: var(--pitch-dark);
  font-style: italic;
}

.card-back-content .view-btn {
  font-size: 0.9rem;
  padding: 0.5rem 1.2rem;
  background-color: var(--bandit-orange);
  display: inline-block;
  border-radius: 4px;
  margin-top: 1rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: none;
  position: relative;
}

.card-back-content .view-btn:hover {
  background-color: #c45e14;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.card-back-content .view-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.card-front img {
  width: 100%;
  height: 85%;
  object-fit: cover;
  border-bottom: 2px solid var(--bandit-orange);
}

.card-title {
  padding: 0.8rem;
  text-align: center;
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
}

.card-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 0.05) 75%,
    rgba(255, 255, 255, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.portfolio-card:hover .card-shine {
  opacity: 1;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  max-width: 90%;
  max-height: 90vh;
  width: auto;
  overflow: hidden;
  position: relative;
  padding: 2rem;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--bandit-orange);
  color: white;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-content h2 {
  margin-bottom: 0.75rem;
  color: var(--pitch-dark);
  text-align: center;
}

.modal-description {
  text-align: center;
  margin-bottom: 1.5rem;
  max-width: 600px;
  color: #333;
  line-height: 1.6;
  font-size: 1.1rem;
}

.modal-image {
  width: 100%;
  max-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-image img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border: 3px solid var(--bandit-orange);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .cards-grid {
    padding: 0 1rem;
  }
  
  .portfolio-card {
    height: 420px; /* Adjusted for mobile */
    width: 240px;
  }
  
  .modal-container {
    padding: 1rem;
    width: 95%;
  }
}
</style>