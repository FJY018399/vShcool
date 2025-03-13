<script setup>
import MapViewer from './components/Viewer/MapViewer.vue'
</script>

<template>
  <div class="app">
    <main class="app-content">
      <MapViewer />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: Arial, sans-serif;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}
</style>
