<script setup>
import MapViewer from './components/Viewer/MapViewer.vue'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>3D地图展示器</h1>
    </header>
    
    <main class="app-content">
      <MapViewer />
    </main>
    
    <footer class="app-footer">
      <p>基于Three.js和Vue3的3D地图展示器</p>
    </footer>
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

.app-header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
}

.app-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.app-footer {
  background-color: #f8f9fa;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.8rem;
  color: #6c757d;
  border-top: 1px solid #dee2e6;
}
</style>
