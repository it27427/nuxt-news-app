/*export default defineNuxtPlugin(() => {
  // Run ASAP on client
  const removeLoader = () => {
    const loader = document.getElementById('__nuxt_loading__');
    if (loader) {
      loader.remove();
      return true;
    }
    return false;
  };

  // Try immediately
  if (!removeLoader()) {
    // If not yet in DOM, observe until Nuxt injects it
    const observer = new MutationObserver(() => {
      if (removeLoader()) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true });
  }
});
*/
