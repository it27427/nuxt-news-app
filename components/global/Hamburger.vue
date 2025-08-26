<template>
  <div>
    <!-- Hamburger button -->
    <button
      class="text-dark w-12 h-12 flex items-center justify-center focus:outline-none"
      @click="isOpen = true"
    >
      <!-- Hamburger Icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <!-- Overlay -->
    <div
      v-show="isOpen"
      class="fixed inset-0 top-15 bg-black/50 z-40"
      @click="isOpen = false"
    />

    <!-- Offcanvas Sidebar -->
    <transition name="slide">
      <aside
        v-show="isOpen"
        class="fixed top-15 left-0 h-full w-full bg-white shadow-lg z-50 px-1"
      >
        <!-- Close Button -->
        <div class="flex items-center justify-start w-full h-12">
          <button
            class="text-dark w-12 h-12 flex items-center justify-center focus:outline-none"
            @click="isOpen = false"
          >
            <i class="fa-solid fa-xmark"/>
          </button>
        </div>

        <!-- ✅ Use your nav list here -->
        <ul class="flex flex-col">
          <li v-for="navItem in navItems" :key="navItem.label" class="py-3 border-b border-light-50">
            <NuxtLink
              :to="navItem.to"
              class="text-dark mobile-link h-12 flex items-center"
              @click="isOpen = false">
            
              <span class="mobile-link-text">{{ navItem.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </aside>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const isOpen = ref(false);

// Your nav list
const nav = [
  { label: "মূলপাতা", to: "/", active: false },
  { label: "রাজনীতি", to: "/topics/politics", active: false },
  { label: "সর্বাধিক পঠিত", to: "/popular/read", active: false },
  { label: "বিশ্ব", to: "/topics/world", active: false },
  { label: "অর্থনীতি", to: "/topics/economy", active: false },
  { label: "স্বাস্থ্য", to: "/topics/health", active: false },
  { label: "খেলা", to: "/topics/game", active: false },
  { label: "প্রযুক্তি", to: "/topics/technology", active: false },
  { label: "ভিডিও", to: "/topics/video", active: false },
];

type NavItem = { label: string; to: string; active: boolean };
const navItems = ref<NavItem[]>(nav);

const route = useRoute();

// Active link detection
watch(
  () => route.path,
  (newPath) => {
    navItems.value.forEach((item) => {
      if (item.to === "/") {
        item.active = newPath === "/";
      } else {
        item.active = newPath.startsWith(item.to);
      }
    });
  },
  { immediate: true }
);
</script>

<style>
/* Slide transition */
.slide-enter-from {
  transform: translateX(-100%);
}

.slide-enter-to {
  transform: translateX(0);
}

.slide-leave-from {
  transform: translateX(0);
}

.slide-leave-to {
  transform: translateX(-100%);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
</style>
