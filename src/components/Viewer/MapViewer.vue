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
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useThreeScene } from '../../composables/useThreeScene'
import { useSceneStore } from '../../stores/sceneStore'
import { OBJECT_TYPES, objectFactory } from '../../utils/objectFactory'

// 接收场景ID作为prop
const props = defineProps({
  sceneId: {
    type: String,
    default: 'default'
  }
})

const sceneContainer = ref(null)
const sceneStore = useSceneStore()

// 使用Three.js场景组合式API
const { 
  addObjectToScene,
  removeObjectFromScene,
  resetCamera,
  setupObjectSelection
} = useThreeScene(sceneContainer)

// 当前场景ID
const currentSceneId = ref(props.sceneId)

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
    
    // 设置对象选择功能
    setupObjectSelection(sceneStore)
    
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
  
  // 学校场景
  if (sceneId === 'school') {
    return {
      objects: [
        {
          id: '1',
          type: OBJECT_TYPES.CLASSROOM,
          name: '主教学楼',
          description: '这是学校的主教学楼，拥有多个教室和办公室。',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.2, y: 1, z: 1.2 },
          options: { color: 0xEEE8AA }
        },
        {
          id: '2',
          type: OBJECT_TYPES.LABORATORY,
          name: '科学实验室',
          description: '这是学校的科学实验室，配备了先进的实验设备。',
          position: { x: 100, y: 0, z: 40 },
          rotation: { x: 0, y: -0.2, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          options: { color: 0xF5F5F5 }
        },
        {
          id: '3',
          type: OBJECT_TYPES.GYMNASIUM,
          name: '体育馆',
          description: '这是学校的体育馆，可以举办各种体育活动和大型集会。',
          position: { x: -120, y: 0, z: -80 },
          rotation: { x: 0, y: 0.5, z: 0 },
          scale: { x: 0.8, y: 1, z: 0.8 },
          options: { color: 0xD2B48C }
        },
        {
          id: '4',
          type: OBJECT_TYPES.CLASSROOM,
          name: '艺术楼',
          description: '这是学校的艺术楼，用于音乐、绘画和其他艺术课程。',
          position: { x: -80, y: 0, z: 60 },
          rotation: { x: 0, y: 0.3, z: 0 },
          scale: { x: 0.9, y: 0.8, z: 0.9 },
          options: { color: 0xFAF0E6 }
        },
        {
          id: '5',
          type: OBJECT_TYPES.TREE,
          name: '校园绿化',
          description: '校园里的绿化树木，提供舒适的学习环境。',
          position: { x: 40, y: 0, z: 120 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.5, y: 1.5, z: 1.5 },
          options: { trunkColor: 0x8B4513, leavesColor: 0x006400 }
        },
        {
          id: '6',
          type: OBJECT_TYPES.TREE,
          name: '校园绿化',
          description: '校园里的绿化树木，提供舒适的学习环境。',
          position: { x: -40, y: 0, z: 120 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.2, y: 1.2, z: 1.2 },
          options: { trunkColor: 0x8B4513, leavesColor: 0x006400 }
        },
        {
          id: '7',
          type: OBJECT_TYPES.LABORATORY,
          name: '计算机实验室',
          description: '这是学校的计算机实验室，配备了现代化的计算机设备。',
          position: { x: 120, y: 0, z: -60 },
          rotation: { x: 0, y: 0.1, z: 0 },
          scale: { x: 0.9, y: 0.9, z: 0.9 },
          options: { color: 0xF0F8FF }
        },
        {
          id: '8',
          type: OBJECT_TYPES.BUILDING,
          name: '图书馆',
          description: '这是学校的图书馆，收藏了大量的图书资料。',
          position: { x: 0, y: 0, z: -160 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.2, y: 1, z: 1.2 },
          options: { color: 0xDEB887 }
        },
        {
          id: '9',
          type: OBJECT_TYPES.HOUSE,
          name: '校长办公室',
          description: '这是校长的办公室，处理学校的行政事务。',
          position: { x: -60, y: 0, z: -40 },
          rotation: { x: 0, y: 0.2, z: 0 },
          scale: { x: 0.8, y: 0.9, z: 0.8 },
          options: { color: 0xFFE4C4 }
        },
        {
          id: '10',
          type: OBJECT_TYPES.CLASSROOM,
          name: '数学楼',
          description: '这是专门用于数学教学的教学楼。',
          position: { x: 80, y: 0, z: 120 },
          rotation: { x: 0, y: -0.1, z: 0 },
          scale: { x: 1, y: 0.9, z: 1 },
          options: { color: 0xF0E68C }
        },
        {
          id: '11',
          type: OBJECT_TYPES.TREE,
          name: '樱花树',
          description: '校园中的樱花树，春季盛开美丽的樱花。',
          position: { x: 30, y: 0, z: -40 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.3, y: 1.3, z: 1.3 },
          options: { trunkColor: 0x8B4513, leavesColor: 0xFFB6C1 }
        },
        {
          id: '12',
          type: OBJECT_TYPES.TREE,
          name: '樱花树',
          description: '校园中的樱花树，春季盛开美丽的樱花。',
          position: { x: 50, y: 0, z: -40 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.1, y: 1.1, z: 1.1 },
          options: { trunkColor: 0x8B4513, leavesColor: 0xFFB6C1 }
        },
        {
          id: '13',
          type: OBJECT_TYPES.GYMNASIUM,
          name: '游泳馆',
          description: '这是学校的游泳馆，设有标准游泳池和跳水台。',
          position: { x: -160, y: 0, z: -160 },
          rotation: { x: 0, y: 0.7, z: 0 },
          scale: { x: 0.7, y: 0.8, z: 0.9 },
          options: { color: 0xADD8E6 }
        },
        {
          id: '14',
          type: OBJECT_TYPES.BUILDING,
          name: '学生宿舍',
          description: '这是学生宿舍楼，为学生提供住宿。',
          position: { x: 160, y: 0, z: 160 },
          rotation: { x: 0, y: -0.3, z: 0 },
          scale: { x: 1.5, y: 1, z: 0.8 },
          options: { color: 0xFAFAD2 }
        },
        {
          id: '15',
          type: OBJECT_TYPES.LABORATORY,
          name: '物理实验室',
          description: '这是学校的物理实验室，配备了各种物理实验设备。',
          position: { x: 110, y: 0, z: 100 },
          rotation: { x: 0, y: -0.5, z: 0 },
          scale: { x: 0.8, y: 0.8, z: 0.8 },
          options: { color: 0xE6E6FA }
        },
        {
          id: '16',
          type: OBJECT_TYPES.HOUSE,
          name: '食堂',
          description: '这是学校的食堂，为师生提供餐饮服务。',
          position: { x: -40, y: 0, z: -120 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.8, y: 0.7, z: 1.2 },
          options: { color: 0xFFDAB9 }
        },
        {
          id: '17',
          type: OBJECT_TYPES.PLAYGROUND,
          name: '田径运动场',
          description: '这是学校的田径运动场，包括标准400米跑道和足球场。',
          position: { x: 40, y: 0, z: -300 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.5, y: 1, z: 1.5 },
          options: { width: 80, length: 120 }
        },
        {
          id: '18',
          type: OBJECT_TYPES.TREE,
          name: '橡树',
          description: '校园中高大的橡树，为学生提供阴凉休息的地方。',
          position: { x: -50, y: 0, z: 10 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.8, y: 1.7, z: 1.8 },
          options: { trunkColor: 0x8B4513, leavesColor: 0x556B2F }
        },
        {
          id: '19',
          type: OBJECT_TYPES.TREE,
          name: '橡树',
          description: '校园中高大的橡树，为学生提供阴凉休息的地方。',
          position: { x: 50, y: 0, z: 10 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.7, y: 1.6, z: 1.7 },
          options: { trunkColor: 0x8B4513, leavesColor: 0x556B2F }
        },
        {
          id: '20',
          type: OBJECT_TYPES.TREE,
          name: '松树',
          description: '校园中四季常青的松树。',
          position: { x: -120, y: 0, z: 120 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.4, y: 2, z: 1.4 },
          options: { trunkColor: 0x8B4513, leavesColor: 0x2E8B57 }
        },
        {
          id: '21',
          type: OBJECT_TYPES.TREE,
          name: '松树',
          description: '校园中四季常青的松树。',
          position: { x: -140, y: 0, z: 140 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.2, y: 1.8, z: 1.2 },
          options: { trunkColor: 0x8B4513, leavesColor: 0x2E8B57 }
        },
        {
          id: '22',
          type: OBJECT_TYPES.HOUSE,
          name: '门卫室',
          description: '校园门口的门卫室，负责校园安全和访客登记。',
          position: { x: 0, y: 0, z: 200 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 0.6, y: 0.6, z: 0.6 },
          options: { color: 0xF5F5DC }
        },
        {
          id: '23',
          type: OBJECT_TYPES.BUILDING,
          name: '行政楼',
          description: '学校的行政办公楼，包含校长办公室和各部门办公室。',
          position: { x: -100, y: 0, z: 0 },
          rotation: { x: 0, y: 0.1, z: 0 },
          scale: { x: 1.1, y: 1.2, z: 0.8 },
          options: { color: 0xF5DEB3 }
        },
        {
          id: '24',
          type: OBJECT_TYPES.HOUSE,
          name: '保安亭',
          description: '校园内的保安亭，提供校园安全巡逻服务。',
          position: { x: 100, y: 0, z: 0 },
          rotation: { x: 0, y: 0.2, z: 0 },
          scale: { x: 0.5, y: 0.6, z: 0.5 },
          options: { color: 0xFFE4C4 }
        },
        {
          id: '25',
          type: OBJECT_TYPES.LABORATORY,
          name: '化学实验室',
          description: '这是学校的化学实验室，配备了各种化学实验设备。',
          position: { x: 140, y: 0, z: -100 },
          rotation: { x: 0, y: -0.3, z: 0 },
          scale: { x: 0.8, y: 0.8, z: 0.8 },
          options: { color: 0xF0FFFF }
        },
        {
          id: '26',
          type: OBJECT_TYPES.CLASSROOM,
          name: '语言楼',
          description: '这是专门用于语言教学的教学楼。',
          position: { x: -140, y: 0, z: 40 },
          rotation: { x: 0, y: 0.4, z: 0 },
          scale: { x: 1, y: 0.9, z: 1 },
          options: { color: 0xFFF8DC }
        },
        {
          id: '27',
          type: OBJECT_TYPES.TREE,
          name: '银杏树',
          description: '校园中的银杏树，秋季叶子变成金黄色。',
          position: { x: 0, y: 0, z: 80 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.6, y: 1.8, z: 1.6 },
          options: { trunkColor: 0x8B4513, leavesColor: 0xFFD700 }
        },
        {
          id: '28',
          type: OBJECT_TYPES.HOUSE,
          name: '医务室',
          description: '这是学校的医务室，为师生提供医疗服务。',
          position: { x: -80, y: 0, z: -120 },
          rotation: { x: 0, y: 0.1, z: 0 },
          scale: { x: 0.9, y: 0.7, z: 0.9 },
          options: { color: 0xF0FFF0 }
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

// 监听场景ID变化
watch(() => props.sceneId, (newSceneId) => {
  loadScene(newSceneId)
})

// 组件挂载时加载指定场景
onMounted(() => {
  loadScene(props.sceneId)
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