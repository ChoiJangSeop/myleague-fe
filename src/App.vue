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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fjalla+One&family=Roboto+Mono:wght@500&display=swap" rel="stylesheet">

  <TheNavigation />
  <router-view></router-view>
</template>

<style>

body {

  background-color: #202022;   
  color: white;
}

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
