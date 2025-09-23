<template>
  <FooterSkeleton v-if="loading" />

  <footer v-else :class="footerClass">
    <SvgIcon />
    <Copyright />
  </footer>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import FooterSkeleton from '~/components/admin/skeletons/FooterSkeleton.vue';
  import Copyright from '~/components/global/Copyright.vue';
  import SvgIcon from '~/components/global/SvgIcon.vue';

  const props = defineProps<{
    footerClass?: string | string[] | Record<string, boolean>;
  }>();
  const footerClass = props.footerClass;

  const loading = ref(true);
  onMounted(() => {
    setTimeout(() => (loading.value = false), 1200);
  });
</script>
