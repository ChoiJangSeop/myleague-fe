<script>
import TheNavigation from '@/components/TheNavigation.vue'
export default {
  components: {
    TheNavigation
  },
  data() {
    return {
      appStyle: {
        backgroundColor: "#4a4f5a"
      }
    }
  }
}
</script>

<template>
  <TheNavigation />
  <router-view></router-view>
</template>

<style scoped>

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
