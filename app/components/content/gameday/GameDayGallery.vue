<script setup lang="ts">
import Carousel from "~/components/ui/Carousel/Carousel.vue";

export interface Card {
  id: number
  image: string
  title: string
  description: string
}

const gameCards: Card[] = [
  {
    id: 1,
    image: '/game-day/Game_1_vs_Wolves.png.webp',
    title: 'Bandits vs Wolves',
    description: 'Victory at Home Court - March 15, 2024'
  },
  {
    id: 2,
    image: '/game-day/Game_2_at_Buccs.png.webp',
    title: 'Bandits at Buccs',
    description: 'Triumphant Away Game - March 22, 2024'
  },
  {
    id: 3,
    image: '/game-day/Game_3_at_Hawks.png.webp',
    title: 'Bandits at Hawks',
    description: 'Intense Battle - March 29, 2024'
  },
  {
    id: 4,
    image: '/game-day/Game_4_at_Senators.png.webp',
    title: 'Bandits at Senators',
    description: 'Hard Fought Contest - April 5, 2024'
  },
  {
    id: 5,
    image: '/game-day/Game_5_vs_Giants.png.webp',
    title: 'Bandits vs Giants',
    description: 'Dominant Home Victory - April 12, 2024'
  }
]
</script>

<template>
  <section class="gameday-gallery">
    <Carousel
        :cards="gameCards"
        title="Game Day Collection"
        :initial-index="Math.floor(gameCards.length / 2)"
    />
  </section>
</template>

<style scoped>
.gameday-gallery {
  padding: 2rem;
}
</style>