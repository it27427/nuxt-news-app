<template>
  <ul class="flex items-center gap-3 h-12">
    <li v-for="navItem in navItems" :key="navItem.label">
      <NuxtLink
        :to="navItem.to"
        class="header-link h-12 border-b-4 border-transparent transition-colors"
        active-class="border-primary"
        exact-active-class="border-primary"
      >
        {{ navItem.label }}
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { queryContent } from '#imports'

type NavItem = {
  label: string
  to: string
}

const navItems = ref<NavItem[]>([])

// load nav items from content/nav/*.md or nav.json
const { data: navData } = await useAsyncData('nav-data', () =>
  queryContent('nav').find()
)

watchEffect(() => {
  if (Array.isArray(navData.value)) {
    navItems.value = navData.value as NavItem[]
  }
})
</script>
