<template>
  <div class="map-viewer">
    <div ref="sceneContainer" class="scene-container"></div>
    
    <div class="viewer-panel">
      <div class="object-info" v-if="selectedObject">
        <h3>对象信息</h3>
        <div class="info-item">
          <span class="label">类型:</span>
          <span class="value">{{ getObjectTypeName(selectedObject.type) }}</span>
        </div>
        <div class="info-item">
          <span class="label">位置:</span>
          <span class="value">
            X: {{ selectedObject.position.x.toFixed(2) }}, 
            Z: {{ selectedObject.position.z.toFixed(2) }}
          </span>
        </div>
        <div class="info-item" v-if="selectedObject.name">
          <span class="label">名称:</span>
          <span class="value">{{ selectedObject.name }}</span>
        </div>
        <div class="info-item" v-if="selectedObject.description">
          <span class="label">描述:</span>
          <p class="description">{{ selectedObject.description }}</p>
        </div>
      </div>
      <div class="no-selection" v-else>
        <p>点击地图上的对象查看详细信息</p>
      </div>
      
      <div class="scene-selector">
        <h3>场景选择</h3>
        <div class="scene-list">
          <button 
            v-for="scene in availableScenes" 
            :key="scene.id"
            @click="loadScene(scene.id)"
            :class="{ active: currentSceneId === scene.id }"
          >
            {{ scene.name }}
          </button>
        </div>
      </div>
      
      <div class="viewer-actions">
        <button @click="resetCamera">重置视角</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThreeScene } from '../../composables/useThreeScene'
import { useSceneStore } from '../../stores/sceneStore'
import { OBJECT_TYPES, objectFactory } from '../../utils/objectFactory'

const sceneContainer = ref(null)
const sceneStore = useSceneStore()

// 使用Three.js场景组合式API
const { 
  scene, 
  camera, 
  renderer, 
  controls,
  addObjectToScene,
  removeObjectFromScene,
  updateCameraTilt,
  setTiltByHeight
} = useThreeScene(sceneContainer)

// 当前选中的对象
const selectedObject = computed(() => sceneStore.selectedObject)

// 可用场景列表
const availableScenes = [
  { id: 'default', name: '默认场景' },
  { id: 'city', name: '城市场景' },
  { id: 'village', name: '乡村场景' },
  { id: 'park', name: '公园场景' }
]

// 当前场景ID
const currentSceneId = ref('default')

// 获取对象类型名称
function getObjectTypeName(type) {
  switch (type) {
    case OBJECT_TYPES.HOUSE:
      return '房子'
    case OBJECT_TYPES.TREE:
      return '树'
    case OBJECT_TYPES.BUILDING:
      return '建筑'
    default:
      return '未知'
  }
}

// 加载场景
async function loadScene(sceneId) {
  try {
    // 更新当前场景ID
    currentSceneId.value = sceneId
    
    // 清除当前场景中的对象
    if (scene.value) {
      // 找到所有需要移除的对象
      const objectsToRemove = []
      scene.value.children.forEach(child => {
        if (child.userData && child.userData.id) {
          objectsToRemove.push(child)
        }
      })
      
      // 移除对象
      objectsToRemove.forEach(obj => {
        scene.value.remove(obj)
      })
    }
    
    // 清除store中的对象
    sceneStore.clearObjects()
    
    // 加载场景数据
    const sceneData = await getSceneData(sceneId)
    
    // 创建并添加对象到场景
    for (const objData of sceneData.objects) {
      try {
        const object3D = await objectFactory.createObject(
          objData.type,
          objData.options || {}
        )
        
        if (object3D) {
          // 添加到场景
          addObjectToScene(object3D, objData)
          
          // 添加到store
          sceneStore.addObject(objData)
        }
      } catch (error) {
        console.error(`处理对象失败: ${objData.id}`, error)
      }
    }
    
    // 重置相机位置
    resetCamera()
  } catch (error) {
    console.error('加载场景失败:', error)
  }
}

// 获取场景数据
async function getSceneData(sceneId) {
  try {
    // 尝试从服务器加载场景数据
    const response = await fetch(`/scenes/${sceneId}.json`)
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('从服务器加载场景失败:', error)
  }
  
  // 如果从服务器加载失败，使用内置的模拟数据
  // 默认场景
  if (sceneId === 'default') {
    return {
      objects: [
        {
          id: '1',
          type: OBJECT_TYPES.HOUSE,
          name: '主屋',
          description: '这是一座美丽的主屋，位于地图中心。',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          options: { color: 0xffffff, roofColor: 0xff0000 }
        },
        {
          id: '2',
          type: OBJECT_TYPES.TREE,
          name: '大树',
          description: '这是一棵高大的树，提供了良好的遮阳。',
          position: { x: 30, y: 0, z: 30 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.2, y: 1.2, z: 1.2 },
          options: { trunkColor: 0x8B4513, leavesColor: 0x00AA00 }
        },
        {
          id: '3',
          type: OBJECT_TYPES.BUILDING,
          name: '办公楼',
          description: '这是一座现代化的办公楼。',
          position: { x: -50, y: 0, z: -50 },
          rotation: { x: 0, y: 0.5, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          options: { color: 0xAAAAAA }
        }
      ],
      mapSettings: {
        width: 1024,
        height: 1024,
        texture: '/textures/grid.png'
      }
    }
  }
  
  // 城市场景
  if (sceneId === 'city') {
    return {
      objects: [
        {
          id: '1',
          type: OBJECT_TYPES.BUILDING,
          name: '摩天大楼',
          description: '这是城市中心的摩天大楼，高度超过200米。',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.5, y: 2, z: 1.5 },
          options: { color: 0x888888 }
        },
        {
          id: '2',
          type: OBJECT_TYPES.BUILDING,
          name: '商业中心',
          description: '这是一座繁忙的商业中心，包含多家商店和餐厅。',
          position: { x: 50, y: 0, z: 50 },
          rotation: { x: 0, y: 0.2, z: 0 },
          scale: { x: 1.2, y: 1, z: 1.2 },
          options: { color: 0xAAAAAA }
        },
        {
          id: '3',
          type: OBJECT_TYPES.BUILDING,
          name: '公寓楼',
          description: '这是一座现代化的公寓楼，提供舒适的居住环境。',
          position: { x: -50, y: 0, z: 50 },
          rotation: { x: 0, y: -0.2, z: 0 },
          scale: { x: 1, y: 1.5, z: 1 },
          options: { color: 0xCCCCCC }
        },
        {
          id: '4',
          type: OBJECT_TYPES.TREE,
          name: '城市绿化',
          description: '城市中心的绿化带，提供了一片宜人的休息区域。',
          position: { x: 0, y: 0, z: 80 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          options: { trunkColor: 0x8B4513, leavesColor: 0x00AA00 }
        }
      ],
      mapSettings: {
        width: 1024,
        height: 1024,
        texture: '/textures/grid.png'
      }
    }
  }
  
  // 乡村场景
  if (sceneId === 'village') {
    return {
      objects: [
        {
          id: '1',
          type: OBJECT_TYPES.HOUSE,
          name: '农舍',
          description: '这是一座传统的农舍，周围环绕着田野。',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0.1, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          options: { color: 0xF5DEB3, roofColor: 0xA52A2A }
        },
        {
          id: '2',
          type: OBJECT_TYPES.TREE,
          name: '果树',
          description: '这是一棵结满果实的果树。',
          position: { x: 30, y: 0, z: 20 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          options: { trunkColor: 0x8B4513, leavesColor: 0x228B22 }
        },
        {
          id: '3',
          type: OBJECT_TYPES.TREE,
          name: '大树',
          description: '这是一棵古老的大树，村民们经常在树下乘凉。',
          position: { x: -40, y: 0, z: -30 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.5, y: 1.5, z: 1.5 },
          options: { trunkColor: 0x8B4513, leavesColor: 0x006400 }
        },
        {
          id: '4',
          type: OBJECT_TYPES.HOUSE,
          name: '谷仓',
          description: '这是一座用于存储农作物的谷仓。',
          position: { x: 50, y: 0, z: -20 },
          rotation: { x: 0, y: -0.2, z: 0 },
          scale: { x: 1.2, y: 1.2, z: 1.2 },
          options: { color: 0xCD853F, roofColor: 0x8B4513 }
        }
      ],
      mapSettings: {
        width: 1024,
        height: 1024,
        texture: '/textures/grid.png'
      }
    }
  }
  
  // 公园场景
  if (sceneId === 'park') {
    return {
      objects: [
        {
          id: '1',
          type: OBJECT_TYPES.TREE,
          name: '中央大树',
          description: '这是公园中心的一棵巨大的橡树，已有百年历史。',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 2, y: 2, z: 2 },
          options: { trunkColor: 0x8B4513, leavesColor: 0x006400 }
        },
        {
          id: '2',
          type: OBJECT_TYPES.TREE,
          name: '松树',
          description: '这是一棵高大的松树，四季常青。',
          position: { x: 40, y: 0, z: 40 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.2, y: 1.5, z: 1.2 },
          options: { trunkColor: 0x8B4513, leavesColor: 0x2E8B57 }
        },
        {
          id: '3',
          type: OBJECT_TYPES.TREE,
          name: '樱花树',
          description: '这是一棵美丽的樱花树，春季盛开粉色花朵。',
          position: { x: -40, y: 0, z: 40 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          options: { trunkColor: 0x8B4513, leavesColor: 0xFFB6C1 }
        },
        {
          id: '4',
          type: OBJECT_TYPES.HOUSE,
          name: '凉亭',
          description: '这是一座传统风格的凉亭，供游客休息。',
          position: { x: 0, y: 0, z: 60 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 0.8, y: 0.8, z: 0.8 },
          options: { color: 0xF5F5DC, roofColor: 0x8B0000 }
        }
      ],
      mapSettings: {
        width: 1024,
        height: 1024,
        texture: '/textures/grid.png'
      }
    }
  }
  
  // 默认返回空场景
  return {
    objects: [],
    mapSettings: {
      width: 1024,
      height: 1024,
      texture: '/textures/grid.png'
    }
  }
}

// 重置相机位置
function resetCamera() {
  if (camera.value && controls.value) {
    // 设置相机位置，使用合理的初始高度
    camera.value.position.set(0, 120, 120)
    
    // 不使用lookAt，让setTiltByHeight完全控制相机旋转
    
    // 重置控制器目标点
    controls.value.target.set(0, 0, 0)
    
    // 更新控制器
    controls.value.update()
    
    // 更新相机俯角，保持水平位置
    setTiltByHeight(0, 120)
  }
}

// 监听场景点击事件
onMounted(() => {
  // 加载默认场景
  loadScene('default')
})

onUnmounted(() => {
  // 清理
  sceneStore.clearSelection()
})
</script>

<style scoped>
.map-viewer {
  display: flex;
  height: 100%;
  width: 100%;
}

.scene-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.viewer-panel {
  width: 300px;
  padding: 16px;
  background-color: #f5f5f5;
  border-left: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.object-info, .no-selection, .scene-selector {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.object-info h3, .scene-selector h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 16px;
  color: #333;
}

.info-item {
  margin-bottom: 8px;
}

.label {
  font-weight: bold;
  color: #555;
  margin-right: 8px;
}

.description {
  margin-top: 4px;
  font-size: 14px;
  line-height: 1.4;
  color: #666;
}

.no-selection p {
  color: #888;
  font-style: italic;
  text-align: center;
}

.scene-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scene-list button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.scene-list button.active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.viewer-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.viewer-actions button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.viewer-actions button:hover {
  background-color: #45a049;
}
</style> 