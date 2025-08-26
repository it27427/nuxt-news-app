<template>
  <nav class="bg-white border-b border-light-50 h-12">
    <div class="jonopath-container flex items-center mobcontainer">
      <div class="flex md:none">
        <Hamburger />
      </div>

      <div class="scrollable-nav">
        <HeaderList />
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import HeaderList from "@/components/global/lists/HeaderList.vue";
import Hamburger from "@/components/global/Hamburger.vue";
</script>
