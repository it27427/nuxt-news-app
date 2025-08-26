
<template>
  <div class="relative">
    <Topbar />

    <!-- First Header -->
    <div
      :class="[
        'w-full transition-transform duration-300',
        showFirstHeader ? 'translate-y-0 fixed top-0 left-0' : '-translate-y-full'
      ]"
    >
      <Header />
    </div>

    <!-- Second Header -->
    <Header
      :class="[
        'fixed bottom-0 left-0 w-full z-50 bg-white shadow-lg transition-transform duration-300',
        showSecondHeader ? 'translate-y-0' : 'translate-y-full'
      ]"
    />

    <main class="min-h-screen mb-96">
      <slot />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Topbar from '@/components/global/layouts/TopBar.vue'
import Header from '@/components/global/layouts/Header.vue'
import Footer from '@/components/global/layouts/Footer.vue'

const showFirstHeader = ref(true)
const showSecondHeader = ref(false)

let lastScrollY = 0

const handleScroll = () => {
  const currentScrollY = window.scrollY
  const scrollingUp = currentScrollY < lastScrollY
  const scrollingDown = currentScrollY > lastScrollY

  // scroll down → ২য় হেডার show, ১ম hide
  if (scrollingDown) {
    showSecondHeader.value = true
    showFirstHeader.value = false
  }
  // scroll up → ২য় হেডার hide, ১ম show (animation সহ)
  else if (scrollingUp) {
    showSecondHeader.value = false
    showFirstHeader.value = true
  }

  lastScrollY = currentScrollY
}

onMounted(() => {
  lastScrollY = window.scrollY
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

