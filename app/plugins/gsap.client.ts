import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { Observer } from 'gsap/Observer'

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(Observer, ScrollTrigger, InertiaPlugin)

  return {
    provide: {
      gsap,
      Observer,
      ScrollTrigger,
    }
  }
})