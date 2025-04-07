<template>
  <div class="map-viewer">
    <div ref="sceneContainer" class="scene-container"></div>
    <div v-if="selectedObject" class="info-panel">
      <h3>{{ selectedObject.name }}</h3>
      <p>{{ selectedObject.description }}</p>
      <p class="object-type">类型: {{ getObjectTypeName(selectedObject.type) }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useThreeScene } from '../../composables/useThreeScene'
import { useSceneStore } from '../../stores/sceneStore'
import { OBJECT_TYPES, objectFactory } from '../../utils/objectFactory'

const sceneContainer = ref(null)
const sceneStore = useSceneStore()

// 使用Three.js场景组合式API
const { 
  addObjectToScene,
  removeObjectFromScene,
  resetCamera,
  setupObjectSelection
} = useThreeScene(sceneContainer)

// 获取选中的对象
const selectedObject = computed(() => sceneStore.selectedObject)

// 将对象类型转换为中文名称
const getObjectTypeName = (type) => {
  const typeNames = {
    [OBJECT_TYPES.HOUSE]: '房屋',
    [OBJECT_TYPES.TREE]: '树木',
    [OBJECT_TYPES.BUILDING]: '建筑物',
    [OBJECT_TYPES.CLASSROOM]: '教学楼',
    [OBJECT_TYPES.LABORATORY]: '实验室',
    [OBJECT_TYPES.GYMNASIUM]: '体育馆',
    [OBJECT_TYPES.PLAYGROUND]: '操场'
  }
  return typeNames[type] || '未知类型'
}

// 加载建筑物数据
async function loadBuildingsData() {
  try {
    // 获取当前场景中的所有对象ID
    const currentObjectIds = sceneStore.objects.map(obj => obj.id)
    
    // 移除所有当前对象
    currentObjectIds.forEach(id => {
      removeObjectFromScene(id)
    })
    
    // 清除store中的对象
    sceneStore.clearObjects()
    
    // 从API获取建筑物数据
    const sceneData = await getBuildingsDataFromApi()
    
    // 创建并添加对象到场景
    for (const objData of sceneData.objects) {
      try {
        const object3D = await objectFactory.createObject(
          objData.type,
          objData.options || {}
        )
        
        if (object3D) {
          // 添加到场景
          const success = addObjectToScene(object3D, objData)
          
          if (success) {
            // 添加到store
            sceneStore.addObject(objData)
          }
        }
      } catch (error) {
        console.error(`处理对象失败: ${objData.id}`, error)
      }
    }
    
    // 设置对象选择功能
    setupObjectSelection(sceneStore)
    
    // 重置相机位置
    resetCamera()
  } catch (error) {
    console.error('加载建筑物数据失败:', error)
  }
}

// 从API获取建筑物数据
async function getBuildingsDataFromApi() {
  try {
    // 尝试从后台管理系统API获取建筑物数据
    const apiUrl = 'http://localhost:3000/api/buildings'
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // 允许发送跨域凭证
      credentials: 'omit' // 如果不需要发送Cookie等凭证，使用'omit'
    })
    
    if (!response.ok) {
      throw new Error('获取建筑物数据失败')
    }
    
    const data = await response.json()
    
    // 确保建筑物数据中的颜色值都是数字格式
    const processedBuildings = (data.buildings || []).map(building => {
      return {
        ...building,
        options: ensureColorValuesAreNumbers(building.options || {})
      }
    })
    
    return {
      objects: processedBuildings,
      mapSettings: {
        width: 1024,
        height: 1024,
        texture: '/textures/grid.png'
      }
    }
  } catch (error) {
    console.error('从API获取建筑物数据失败:', error)
    return {
      objects: [],
      mapSettings: {
        width: 1024,
        height: 1024,
        texture: '/textures/grid.png'
      }
    }
  }
}

// 确保颜色值是数字格式
function ensureColorValuesAreNumbers(options) {
  if (!options) return options
  
  const result = { ...options }
  
  // 处理常见的颜色属性
  const colorProps = ['color', 'roofColor', 'trunkColor', 'leavesColor']
  
  colorProps.forEach(prop => {
    if (typeof result[prop] === 'string' && result[prop].startsWith('0x')) {
      result[prop] = parseInt(result[prop], 16)
    }
  })
  
  return result
}

// 组件挂载时加载数据
onMounted(() => {
  loadBuildingsData()
})

onUnmounted(() => {
  // 清理
  sceneStore.clearSelection()
})
</script>

<style scoped>
.map-viewer {
  height: 100%;
  width: 100%;
  position: relative;
}

.scene-container {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.info-panel {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  max-width: 300px;
  z-index: 10;
}

.info-panel h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #2c3e50;
}

.info-panel p {
  margin: 5px 0;
  color: #333;
}

.object-type {
  font-style: italic;
  color: #666;
  margin-top: 10px;
}
</style> 