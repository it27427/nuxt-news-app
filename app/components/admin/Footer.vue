<template>
  <footer :class="footerClass">
    <SvgIcon />
    <Copyright />
  </footer>
</template>

<script lang="ts" setup>
  import Copyright from '@/components/global/Copyright.vue';
  import SvgIcon from '@/components/global/SvgIcon.vue';
  const props = defineProps<{
    footerClass?: string | string[] | Record<string, boolean>;
  }>();
  const footerClass = props.footerClass;
</script>
