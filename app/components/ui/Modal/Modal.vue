<script setup lang="ts">
interface ModalProps {
  isOpen: boolean
  image: string
  title: string
  content?: Record<string, string | number>
  showNavigation?: boolean
  canNavigate?: {
    prev: boolean
    next: boolean
  }
}

const props = withDefaults(defineProps<ModalProps>(), {
  showNavigation: false,
  canNavigate: () => ({ prev: true, next: true })
})

const emit = defineEmits(['close', 'prev', 'next'])

const handleClose = () => {
  emit('close')
  // Restore body scrolling
  document.body.style.overflow = 'auto'
}

const handlePrev = () => {
  if (props.canNavigate?.prev) {
    emit('prev')
  }
}

const handleNext = () => {
  if (props.canNavigate?.next) {
    emit('next')
  }
}

// Prevent body scrolling when modal is open
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})

// Keyboard navigation
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (!props.isOpen) return
    
    switch (e.key) {
      case 'Escape':
        handleClose()
        break
      case 'ArrowLeft':
        handlePrev()
        break
      case 'ArrowRight':
        handleNext()
        break
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="modal-overlay"
      @click="handleClose"
    >
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="handleClose">&times;</button>
        
        <div class="modal-image-container">
          <NuxtImg 
            :src="image" 
            :alt="title"
            class="modal-image"
            loading="lazy"
          />
          
          <div class="modal-overlay-info">
            <h3 class="modal-title">{{ title }}</h3>
            <slot name="content" :content="content">
              <div v-if="content" class="modal-details">
                <span v-for="(value, key) in content" :key="key" class="modal-detail">
                  <strong>{{ key }}:</strong> {{ value }}
                </span>
              </div>
            </slot>
          </div>
        </div>
        
        <div v-if="showNavigation" class="modal-navigation">
          <button 
            :disabled="!canNavigate?.prev" 
            class="nav-button prev"
            aria-label="Previous"
            @click="handlePrev"
          >
            ‹
          </button>
          <button 
            :disabled="!canNavigate?.next"
            class="nav-button next"
            aria-label="Next"
            @click="handleNext"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: modalFadeIn 0.3s ease;
}

.modal-content {
  background: rgba(10, 10, 10, 0.95);
  border-radius: 20px;
  padding: 1rem;
  height: 95vh;
  max-width: 95vw;
  max-height: 95vh;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: modalSlideIn 0.4s ease;
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1001;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal-image-container {
  position: relative;
  display: flex;
  justify-content: center;
  height: 90vh;
}

.modal-image {
  max-width: 100%;
  max-height: 90vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.modal-overlay-info {
  display: none;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 2rem;
  border-radius: 0 0 15px 15px;
  text-align: left;
  transform: translateY(100%);
  transition: transform 1s ease;
  opacity: 0;
}

.modal-image-container:hover .modal-overlay-info {
  transform: translateY(0);
  display: block;
  transition: transform 1s ease;
  opacity: 1;
}

.modal-title {
  font-size: 1.8rem;
  margin-bottom: 0.8rem;
  color: white;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.modal-details {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.modal-detail {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  backdrop-filter: blur(5px);
}

.modal-detail strong {
  color: white;
  text-transform: capitalize;
  margin-right: 0.3rem;
}

.modal-navigation {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.nav-button {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  color: white;
  padding: 0.8rem 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.2s ease;
  min-width: 50px;
}

.nav-button:hover:not(:disabled) {
  transform: scale(1.1);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideIn {
  from { 
    opacity: 0;
    transform: scale(0.8) translateY(50px);
  }
  to { 
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .modal-image {
    max-height: 100vh;
  }
  
  .modal-title {
    font-size: 1.2rem;
  }
  
  .nav-button {
    padding: 0.6rem 1rem;
    font-size: 1.2rem;
  }
}
</style>