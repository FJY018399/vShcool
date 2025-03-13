import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSceneStore = defineStore('scene', () => {
  // 场景对象
  const objects = ref([])
  
  // 当前选中的对象
  const selectedObjectId = ref(null)
  const selectedObject = computed(() => 
    objects.value.find(obj => obj.id === selectedObjectId.value)
  )
  
  // 相机设置
  const cameraSettings = ref({
    minHeight: 10,    // 最小高度
    maxHeight: 500,   // 最大高度
    currentHeight: 200, // 当前高度
    minTilt: 30,      // 最小俯角（度）
    maxTilt: 80,      // 最大俯角（度）
  })
  
  // 地图设置
  const mapSettings = ref({
    width: 1024,
    height: 1024,
    texture: '/textures/grid.png', // 添加默认纹理路径
  })
  
  // 添加对象
  function addObject(object) {
    // 生成唯一ID
    object.id = Date.now().toString()
    objects.value.push(object)
    return object.id
  }
  
  // 更新对象
  function updateObject(id, properties) {
    const index = objects.value.findIndex(obj => obj.id === id)
    if (index !== -1) {
      objects.value[index] = { ...objects.value[index], ...properties }
    }
  }
  
  // 删除对象
  function removeObject(id) {
    const index = objects.value.findIndex(obj => obj.id === id)
    if (index !== -1) {
      objects.value.splice(index, 1)
      if (selectedObjectId.value === id) {
        selectedObjectId.value = null
      }
    }
  }
  
  // 选择对象
  function selectObject(id) {
    selectedObjectId.value = id
  }
  
  // 清除选择
  function clearSelection() {
    selectedObjectId.value = null
  }
  
  // 保存场景
  function saveScene() {
    return {
      objects: objects.value,
      mapSettings: mapSettings.value
    }
  }
  
  // 加载场景
  function loadScene(sceneData) {
    if (sceneData.objects) {
      objects.value = sceneData.objects
    }
    if (sceneData.mapSettings) {
      mapSettings.value = sceneData.mapSettings
    }
    clearSelection()
  }
  
  // 清除所有对象
  function clearObjects() {
    objects.value = []
    clearSelection()
  }
  
  return {
    objects,
    selectedObjectId,
    selectedObject,
    cameraSettings,
    mapSettings,
    addObject,
    updateObject,
    removeObject,
    selectObject,
    clearSelection,
    saveScene,
    loadScene,
    clearObjects
  }
}) 