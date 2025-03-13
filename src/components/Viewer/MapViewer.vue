<template>
  <div class="map-viewer">
    <div ref="sceneContainer" class="scene-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useThreeScene } from '../../composables/useThreeScene'
import { useSceneStore } from '../../stores/sceneStore'
import { OBJECT_TYPES, objectFactory } from '../../utils/objectFactory'

const sceneContainer = ref(null)
const sceneStore = useSceneStore()

// 使用Three.js场景组合式API
const { 
  addObjectToScene,
  removeObjectFromScene,
  resetCamera
} = useThreeScene(sceneContainer)

// 当前场景ID
const currentSceneId = ref('default')

// 加载场景
async function loadScene(sceneId) {
  try {
    // 更新当前场景ID
    currentSceneId.value = sceneId
    
    // 获取当前场景中的所有对象ID
    const currentObjectIds = sceneStore.objects.map(obj => obj.id)
    
    // 移除所有当前对象
    currentObjectIds.forEach(id => {
      removeObjectFromScene(id)
    })
    
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

// 组件挂载时加载默认场景
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
  height: 100%;
  width: 100%;
}

.scene-container {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style> 