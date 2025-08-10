<script setup lang="ts">
interface SubtitleProps {
  class?: string
}

const props = withDefaults(defineProps<SubtitleProps>(), {
  class: 'subtitle mx-auto',
})
</script>

<template>
  <p :class="props.class">
    <slot />
  </p>
</template>

<style scoped>

</style>