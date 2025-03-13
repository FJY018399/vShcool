<template>
  <div class="map-editor">
    <div ref="sceneContainer" class="scene-container"></div>
    
    <div class="editor-panel">
      <ObjectPlacer ref="objectPlacer" @place-object="handlePlaceObject" />
      
      <div class="editor-actions">
        <button @click="saveMap">保存地图</button>
        <button @click="loadMap">加载地图</button>
        <button @click="clearMap">清空地图</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useThreeScene } from '../../composables/useThreeScene'
import { useSceneStore } from '../../stores/sceneStore'
import ObjectPlacer from './ObjectPlacer.vue'

const sceneContainer = ref(null)
const objectPlacer = ref(null)
const sceneStore = useSceneStore()

// 使用Three.js场景组合式API
const { 
  scene, 
  camera, 
  renderer, 
  controls,
  addObjectToScene,
  removeObjectFromScene
} = useThreeScene(sceneContainer)

// 处理放置对象事件
function handlePlaceObject({ object3D, objectData }) {
  addObjectToScene(object3D, objectData)
}

// 处理地面点击事件
function handleGroundClick(position) {
  if (objectPlacer.value) {
    objectPlacer.value.createObject(position)
  }
}

// 保存地图
function saveMap() {
  const sceneData = sceneStore.saveScene()
  const dataStr = JSON.stringify(sceneData, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
  
  const exportName = 'map_' + new Date().toISOString().slice(0, 10) + '.json'
  
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportName)
  linkElement.click()
}

// 加载地图
function loadMap() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const sceneData = JSON.parse(e.target.result)
        sceneStore.loadScene(sceneData)
        
        // 清除当前场景中的对象
        if (scene.value) {
          const objectsToRemove = scene.value.children.filter(
            child => child.userData && child.userData.id
          )
          
          objectsToRemove.forEach(obj => {
            scene.value.remove(obj)
          })
        }
        
        // 重新加载对象
        // 注意：这里需要实现加载对象的逻辑
        alert('地图加载成功！')
      } catch (error) {
        console.error('加载地图失败:', error)
        alert('加载地图失败，请检查文件格式。')
      }
    }
    
    reader.readAsText(file)
  }
  
  input.click()
}

// 清空地图
function clearMap() {
  if (confirm('确定要清空地图吗？此操作不可撤销。')) {
    // 清除store中的对象
    const objectIds = [...sceneStore.objects].map(obj => obj.id)
    objectIds.forEach(id => sceneStore.removeObject(id))
    
    // 清除场景中的对象
    if (scene.value) {
      const objectsToRemove = scene.value.children.filter(
        child => child.userData && child.userData.id
      )
      
      objectsToRemove.forEach(obj => {
        scene.value.remove(obj)
      })
    }
  }
}

// 监听场景点击事件
onMounted(() => {
  // 这里需要添加对地面点击的监听
  // 在useThreeScene.js中已经实现了点击检测
  // 我们需要将handleGroundClick传递给useThreeScene
  
  // 临时解决方案：覆盖window对象上的方法
  window.handleGroundClick = handleGroundClick
})

onUnmounted(() => {
  // 清理
  if (window.handleGroundClick) {
    delete window.handleGroundClick
  }
})
</script>

<style scoped>
.map-editor {
  display: flex;
  height: 100%;
  width: 100%;
}

.scene-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.editor-panel {
  width: 300px;
  padding: 16px;
  background-color: #f5f5f5;
  border-left: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.editor-actions {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.editor-actions button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.editor-actions button:hover {
  background-color: #45a049;
}

.editor-actions button:last-child {
  background-color: #f44336;
}

.editor-actions button:last-child:hover {
  background-color: #d32f2f;
}
</style> 