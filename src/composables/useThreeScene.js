import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useSceneStore } from '../stores/sceneStore'

export function useThreeScene(container) {
  const scene = ref(null)
  const camera = ref(null)
  const renderer = ref(null)
  const controls = ref(null)
  const raycaster = ref(new THREE.Raycaster())
  const mouse = ref(new THREE.Vector2())
  const sceneStore = useSceneStore()
  
  // 初始化场景
  const initScene = () => {
    try {
      // 创建场景
      scene.value = new THREE.Scene()
      
      // 创建相机
      const containerRect = container.value.getBoundingClientRect()
      camera.value = new THREE.PerspectiveCamera(
        60,
        containerRect.width / containerRect.height,
        1,
        2000
      )
      
      // 设置初始位置，但不设置旋转（由setTiltByHeight控制）
      camera.value.position.set(0, 120, 120)
      
      // 创建CSS3D渲染器
      renderer.value = new CSS3DRenderer()
      renderer.value.setSize(containerRect.width, containerRect.height)
      renderer.value.domElement.style.position = 'absolute'
      renderer.value.domElement.style.top = '0'
      container.value.appendChild(renderer.value.domElement)
      
      // 不使用OrbitControls，而是自己实现平移和高度控制
      // 添加鼠标事件监听
      container.value.addEventListener('mousedown', onMouseDown)
      container.value.addEventListener('wheel', onWheel)
      
      // 创建地面
      createGround()
      
      // 添加事件监听
      window.addEventListener('resize', onWindowResize)
      container.value.addEventListener('click', onClick)
      
      // 设置初始俯角
      setTiltByHeight(0, 120)
      
      // 开始动画循环
      animate()
    } catch (error) {
      console.error('初始化场景失败:', error)
    }
  }
  
  // 鼠标按下事件
  const onMouseDown = (event) => {
    event.preventDefault()
    
    // 记录鼠标按下的位置
    const startX = event.clientX
    const startY = event.clientY
    
    // 记录相机初始位置
    const startCameraX = camera.value.position.x
    const startCameraZ = camera.value.position.z
    
    // 鼠标移动事件处理函数
    const onMouseMove = (moveEvent) => {
      // 计算鼠标移动距离
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY
      
      // 根据鼠标移动距离平移相机
      // 移动方向与鼠标移动方向相反，以实现拖拽效果
      camera.value.position.x = startCameraX - deltaX * 0.5
      camera.value.position.z = startCameraZ + deltaY * 0.5
      
      // 保持相机高度不变
      setTiltByHeight(camera.value.position.x, camera.value.position.z)
    }
    
    // 鼠标释放事件处理函数
    const onMouseUp = () => {
      // 移除事件监听
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
    
    // 添加事件监听
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }
  
  // 自定义滚轮事件处理
  const onWheel = (event) => {
    event.preventDefault()
    
    // 获取滚轮方向（向上滚动为负，向下滚动为正）
    const delta = Math.sign(event.deltaY)
    
    // 高度范围
    const minHeight = 80
    const maxHeight = 200
    
    // 获取当前高度
    const currentHeight = camera.value.position.y
    
    // 如果已经达到高度限制且继续朝同一方向滚动，则不做任何操作
    if ((delta > 0 && currentHeight >= maxHeight) || (delta < 0 && currentHeight <= minHeight)) {
      return
    }
    
    // 高度变化量
    const heightChange = delta * 5
    
    // 计算新高度，确保在范围内
    const newHeight = Math.max(minHeight, Math.min(maxHeight, currentHeight + heightChange))
    
    // 保存当前相机位置的水平坐标
    const currentX = camera.value.position.x
    const currentZ = camera.value.position.z
    
    // 更新相机高度
    camera.value.position.y = newHeight
    
    // 根据新高度设置俯角
    setTiltByHeight(currentX, currentZ)
  }
  
  // 根据高度设置俯角
  const setTiltByHeight = (keepX, keepZ) => {
    if (!camera.value) return
    
    // 高度范围和对应的俯角范围
    const minHeight = 80
    const maxHeight = 200
    const minTilt = 30 // 最小俯角（度）
    const maxTilt = 60 // 最大俯角（度）
    
    // 获取当前高度
    const height = camera.value.position.y
    
    // 确保高度在范围内，并计算对应的俯角
    let tiltAngle
    
    if (height <= minHeight) {
      // 如果高度小于等于最小高度，使用最小俯角
      tiltAngle = minTilt
    } else if (height >= maxHeight) {
      // 如果高度大于等于最大高度，使用最大俯角
      tiltAngle = maxTilt
    } else {
      // 在高度范围内，线性映射计算俯角
      const heightPercent = (height - minHeight) / (maxHeight - minHeight)
      tiltAngle = minTilt + heightPercent * (maxTilt - minTilt)
    }
    
    // 将角度转换为弧度
    const tiltRadians = THREE.MathUtils.degToRad(tiltAngle)
    
    // 设置相机俯角
    camera.value.rotation.set(0, 0, 0) // 重置所有旋转
    camera.value.rotation.x = -tiltRadians
    
    // 保持水平位置不变
    if (keepX !== undefined && keepZ !== undefined) {
      camera.value.position.x = keepX
      camera.value.position.z = keepZ
    }
    
    // 更新相机矩阵
    camera.value.updateMatrix()
    camera.value.updateMatrixWorld(true)
    camera.value.updateProjectionMatrix()
  }
  
  // 更新相机俯角（保留此函数以兼容现有代码）
  const updateCameraTilt = (keepX, keepZ) => {
    setTiltByHeight(keepX, keepZ)
  }
  
  // 创建地面
  const createGround = () => {
    // 创建一个DOM元素作为地面
    const element = document.createElement('div')
    element.style.width = '1000px'
    element.style.height = '1000px'
    element.style.backgroundColor = '#999999'
    element.style.opacity = '0.8'
    
    // 创建CSS3D对象
    const ground = new CSS3DObject(element)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0
    ground.name = 'ground'
    
    scene.value.add(ground)
  }
  
  // 窗口大小调整
  const onWindowResize = () => {
    const containerRect = container.value.getBoundingClientRect()
    camera.value.aspect = containerRect.width / containerRect.height
    camera.value.updateProjectionMatrix()
    renderer.value.setSize(containerRect.width, containerRect.height)
  }
  
  // 鼠标点击
  const onClick = (event) => {
    const containerRect = container.value.getBoundingClientRect()
    mouse.value.x = ((event.clientX - containerRect.left) / containerRect.width) * 2 - 1
    mouse.value.y = -((event.clientY - containerRect.top) / containerRect.height) * 2 + 1
    
    raycaster.value.setFromCamera(mouse.value, camera.value)
    
    // 检查是否点击了对象
    const intersects = raycaster.value.intersectObjects(scene.value.children, true)
    
    if (intersects.length > 0) {
      const object = intersects[0].object
      
      // 如果点击的是地面，可以在这里处理放置对象的逻辑
      if (object.name === 'ground') {
        // 获取点击位置
        const position = intersects[0].point
        console.log('点击地面位置:', position)
      } else {
        // 如果点击的是其他对象，选中它
        const userData = object.userData
        if (userData && userData.id) {
          sceneStore.selectObject(userData.id)
        }
      }
    } else {
      // 点击空白处，清除选择
      sceneStore.clearSelection()
    }
  }
  
  // 动画循环
  const animate = () => {
    setTimeout(() => {
      animate()
    }, 1000 / 30)
    
    if (renderer.value && scene.value && camera.value) {
      try {
        renderer.value.render(scene.value, camera.value)
      } catch (error) {
        console.error('渲染错误:', error)
      }
    }
  }
  
  // 添加3D对象到场景
  const addObjectToScene = (object3D, objectData) => {
    if (!scene.value) return
    
    try {
      // 设置对象的位置
      object3D.position.set(
        objectData.position.x,
        objectData.position.y,
        objectData.position.z
      )
      
      // 存储对象ID到userData
      object3D.userData.id = objectData.id
      object3D.userData.name = objectData.name || '';
      object3D.userData.description = objectData.description || '';
      
      // 添加到场景
      scene.value.add(object3D)
      
      return true;
    } catch (error) {
      console.error('添加对象到场景失败:', error);
      return false;
    }
  }
  
  // 从场景中移除对象
  const removeObjectFromScene = (objectId) => {
    if (!scene.value) return
    
    // 查找具有指定ID的对象
    const object = scene.value.children.find(
      child => child.userData && child.userData.id === objectId
    )
    
    if (object) {
      scene.value.remove(object)
    }
  }
  
  // 组件挂载时初始化场景
  onMounted(() => {
    if (container.value) {
      initScene()
    }
  })
  
  // 组件卸载时清理资源
  onUnmounted(() => {
    if (container.value) {
      container.value.removeEventListener('click', onClick)
      container.value.removeEventListener('wheel', onWheel)
      container.value.removeEventListener('mousedown', onMouseDown)
    }
    
    window.removeEventListener('resize', onWindowResize)
    
    if (renderer.value) {
      if (renderer.value.domElement && renderer.value.domElement.parentNode) {
        renderer.value.domElement.parentNode.removeChild(renderer.value.domElement)
      }
    }
  })
  
  return {
    scene,
    camera,
    renderer,
    controls,
    addObjectToScene,
    removeObjectFromScene,
    updateCameraTilt,
    setTiltByHeight
  }
} 