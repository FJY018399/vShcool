<template>
  <div class="object-placer">
    <div class="object-types">
      <button 
        v-for="type in objectTypes" 
        :key="type.id"
        :class="{ active: selectedType === type.id }"
        @click="selectObjectType(type.id)"
      >
        {{ type.name }}
      </button>
    </div>
    
    <div v-if="selectedType" class="object-options">
      <h3>{{ getSelectedTypeName() }} 选项</h3>
      
      <div class="option-group">
        <label>颜色</label>
        <input type="color" v-model="objectOptions.color" />
      </div>
      
      <div class="option-group">
        <label>大小</label>
        <input 
          type="range" 
          v-model.number="objectOptions.scale" 
          min="0.5" 
          max="2" 
          step="0.1" 
        />
        <span>{{ objectOptions.scale.toFixed(1) }}</span>
      </div>
      
      <div class="option-group">
        <label>旋转</label>
        <input 
          type="range" 
          v-model.number="objectOptions.rotation" 
          min="0" 
          max="360" 
          step="15" 
        />
        <span>{{ objectOptions.rotation }}°</span>
      </div>
    </div>
    
    <div class="placement-mode">
      <label>
        <input 
          type="checkbox" 
          v-model="placementMode" 
          :disabled="!selectedType"
        />
        放置模式
      </label>
      <p v-if="placementMode" class="hint">点击地图放置对象</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import * as THREE from 'three'
import { useSceneStore } from '../../stores/sceneStore'
import { OBJECT_TYPES, objectFactory } from '../../utils/objectFactory'

const sceneStore = useSceneStore()
const emit = defineEmits(['place-object'])

// 对象类型列表
const objectTypes = [
  { id: OBJECT_TYPES.HOUSE, name: '房子' },
  { id: OBJECT_TYPES.TREE, name: '树' },
  { id: OBJECT_TYPES.BUILDING, name: '建筑' },
]

// 当前选中的对象类型
const selectedType = ref(null)

// 对象选项
const objectOptions = ref({
  color: '#ffffff',
  scale: 1.0,
  rotation: 0,
})

// 放置模式
const placementMode = ref(false)

// 选择对象类型
function selectObjectType(typeId) {
  selectedType.value = typeId
  
  // 根据类型设置默认选项
  switch (typeId) {
    case OBJECT_TYPES.HOUSE:
      objectOptions.value.color = '#ffffff'
      break
    case OBJECT_TYPES.TREE:
      objectOptions.value.color = '#00aa00'
      break
    case OBJECT_TYPES.BUILDING:
      objectOptions.value.color = '#aaaaaa'
      break
  }
  
  // 自动开启放置模式
  placementMode.value = true
}

// 获取选中类型的名称
function getSelectedTypeName() {
  const type = objectTypes.find(t => t.id === selectedType.value)
  return type ? type.name : ''
}

// 创建对象
async function createObject(position) {
  if (!selectedType.value || !placementMode.value) return
  
  // 准备对象数据
  const objectData = {
    type: selectedType.value,
    position: {
      x: position.x,
      y: 0, // 放在地面上
      z: position.z,
    },
    rotation: {
      x: 0,
      y: THREE.MathUtils.degToRad(objectOptions.value.rotation),
      z: 0,
    },
    scale: {
      x: objectOptions.value.scale,
      y: objectOptions.value.scale,
      z: objectOptions.value.scale,
    },
    options: {
      color: parseInt(objectOptions.value.color.replace('#', '0x'), 16),
    }
  }
  
  // 添加到场景存储
  const objectId = sceneStore.addObject(objectData)
  
  // 创建3D对象
  const object3D = await objectFactory.createObject(
    objectData.type, 
    { 
      ...objectData.options,
    }
  )
  
  if (object3D) {
    // 发出放置对象事件
    emit('place-object', {
      object3D,
      objectData: {
        ...objectData,
        id: objectId
      }
    })
  }
}

// 导出方法供父组件调用
defineExpose({
  createObject
})
</script>

<style scoped>
.object-placer {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.object-types {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.object-types button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: all 0.2s;
}

.object-types button.active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.object-options {
  margin-bottom: 16px;
}

.object-options h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 16px;
}

.option-group {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.option-group label {
  width: 60px;
  font-size: 14px;
}

.option-group input[type="range"] {
  flex: 1;
  margin: 0 8px;
}

.option-group span {
  width: 40px;
  text-align: right;
  font-size: 14px;
}

.placement-mode {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.placement-mode label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.placement-mode input[type="checkbox"] {
  margin-right: 8px;
}

.hint {
  margin: 8px 0 0;
  font-size: 14px;
  color: #666;
}
</style> 