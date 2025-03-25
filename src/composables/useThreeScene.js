import { onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useSceneStore } from '../stores/sceneStore'

export function useThreeScene(container) {
  // 不使用Vue的响应式系统来存储Three.js对象
  let scene = null
  let camera = null
  let renderer = null
  let controls = null
  let isDragging = false
  let previousMousePosition = { x: 0, y: 0 }
  const sceneStore = useSceneStore()
  
  // 射线投射器（用于对象选择）
  let raycaster = null
  let mouse = null
  
  // 相机设置
  const cameraSettings = {
    minHeight: 30,    // 最小高度
    maxHeight: 200,   // 最大高度
    minTilt: 30,      // 最小俯角（度）
    maxTilt: 80,      // 最大俯角（度）
    moveSpeed: 0.5    // 移动速度
  }
  
  // 初始化场景
  const initScene = () => {
    try {
      // 创建场景
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0xf0f0f0)
      
      // 创建相机
      const containerRect = container.value.getBoundingClientRect()
      camera = new THREE.PerspectiveCamera(
        45, // 更自然的视角
        containerRect.width / containerRect.height,
        0.1,
        1000
      )
      
      // 设置初始位置 - 使用中等高度
      const initialHeight = (cameraSettings.minHeight + cameraSettings.maxHeight) / 2
      const initialTilt = calculateTiltFromHeight(initialHeight)
      setCamera(0, 0, initialHeight, initialTilt)
      
      // 创建WebGL渲染器
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, // 抗锯齿
        alpha: true // 支持透明
      })
      renderer.setSize(containerRect.width, containerRect.height)
      renderer.setPixelRatio(window.devicePixelRatio) // 更清晰的渲染
      renderer.shadowMap.enabled = true // 启用阴影
      renderer.shadowMap.type = THREE.PCFSoftShadowMap // 柔和阴影
      container.value.appendChild(renderer.domElement)
      
      // 初始化射线投射器和鼠标向量
      raycaster = new THREE.Raycaster()
      mouse = new THREE.Vector2()
      
      // 设置自定义控制
      setupCustomControls()
      
      // 添加光照
      setupLights()
      
      // 创建地面
      createGround()
      
      // 添加事件监听
      window.addEventListener('resize', onWindowResize)
      
      // 开始动画循环
      animate()
    } catch (error) {
      console.error('初始化场景失败:', error)
    }
  }
  
  // 设置自定义控制
  const setupCustomControls = () => {
    // 添加鼠标事件监听器
    const domElement = renderer.domElement
    
    // 鼠标按下事件
    domElement.addEventListener('mousedown', onMouseDown)
    
    // 鼠标移动事件
    domElement.addEventListener('mousemove', onMouseMove)
    
    // 鼠标抬起事件
    domElement.addEventListener('mouseup', onMouseUp)
    
    // 鼠标离开事件
    domElement.addEventListener('mouseleave', onMouseUp)
    
    // 滚轮事件
    domElement.addEventListener('wheel', onMouseWheel, { passive: false })
    
    // 鼠标点击事件（用于选择对象）
    domElement.addEventListener('click', onMouseClick)
  }
  
  // 鼠标按下事件处理
  const onMouseDown = (event) => {
    event.preventDefault()
    
    isDragging = true
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    }
  }
  
  // 鼠标移动事件处理
  const onMouseMove = (event) => {
    event.preventDefault()
    
    if (!isDragging) return
    
    // 计算鼠标移动距离
    const deltaX = event.clientX - previousMousePosition.x
    const deltaY = event.clientY - previousMousePosition.y
    
    // 更新上一次鼠标位置
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    }
    
    // 移动相机
    moveCamera(deltaX, deltaY)
  }
  
  // 鼠标抬起事件处理
  const onMouseUp = (event) => {
    event.preventDefault()
    isDragging = false
  }
  
  // 移动相机
  const moveCamera = (deltaX, deltaY) => {
    if (!camera) return
    
    // 获取相机当前位置
    const x = camera.position.x
    const y = camera.position.y
    const z = camera.position.z
    
    // 计算相机前进方向（水平面上）
    const direction = new THREE.Vector3()
    camera.getWorldDirection(direction)
    direction.y = 0 // 保持在水平面上
    direction.normalize()
    
    // 计算相机右方向（水平面上）
    const right = new THREE.Vector3()
    right.crossVectors(new THREE.Vector3(0, 1, 0), direction)
    
    // 根据鼠标移动计算新位置
    // 向右拖动 -> 相机向左移动（反向）
    // 向上拖动 -> 相机向后移动（反向）
    const moveSpeed = cameraSettings.moveSpeed
    const newX = x + deltaX * moveSpeed * right.x + deltaY * moveSpeed * direction.x
    const newZ = z + deltaX * moveSpeed * right.z + deltaY * moveSpeed * direction.z
    
    // 获取当前俯角
    const tilt = calculateTiltFromHeight(y)
    
    // 更新相机位置
    setCamera(newX, newZ, y, tilt)
  }
  
  // 根据高度计算俯角（线性对应）
  const calculateTiltFromHeight = (height) => {
    // 线性插值：当高度为minHeight时俯角为minTilt，当高度为maxHeight时俯角为maxTilt
    const heightRange = cameraSettings.maxHeight - cameraSettings.minHeight
    const tiltRange = cameraSettings.maxTilt - cameraSettings.minTilt
    
    // 计算当前高度在范围内的比例
    const heightRatio = (height - cameraSettings.minHeight) / heightRange
    
    // 根据比例计算对应的俯角（度）
    return cameraSettings.minTilt + (heightRatio * tiltRange)
  }
  
  // 设置相机位置和角度
  const setCamera = (x, z, height, tiltDegrees) => {
    if (!camera) return
    
    // 限制高度在范围内
    height = Math.max(cameraSettings.minHeight, Math.min(cameraSettings.maxHeight, height))
    
    // 计算俯角（弧度）
    const tiltRadians = THREE.MathUtils.degToRad(tiltDegrees)
    
    // 设置相机位置
    camera.position.set(x, height, z)
    
    // 计算相机前方的点，考虑俯角
    const lookDistance = height * Math.tan(Math.PI/2 - tiltRadians)
    const lookX = x
    const lookZ = z - lookDistance // 默认相机看向Z轴负方向
    
    // 设置相机看向的点
    camera.lookAt(lookX, 0, lookZ)
  }
  
  // 鼠标滚轮事件处理
  const onMouseWheel = (event) => {
    event.preventDefault()
    
    // 获取当前相机高度
    const currentHeight = camera.position.y
    
    // 根据滚轮方向调整高度（向上滚动减小高度，向下滚动增加高度）
    const zoomSpeed = 10
    const newHeight = currentHeight - Math.sign(event.deltaY) * zoomSpeed
    
    // 计算新高度对应的俯角
    const newTilt = calculateTiltFromHeight(newHeight)
    
    // 设置相机位置和角度
    setCamera(camera.position.x, camera.position.z, newHeight, newTilt)
  }
  
  // 鼠标点击事件处理
  const onMouseClick = (event) => {
    if (isDragging) return // 如果是拖拽操作，不处理点击
    
    event.preventDefault()
    
    if (!scene || !camera) return
    
    // 计算鼠标位置的归一化设备坐标 (-1 到 +1)
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    
    // 设置射线投射器
    raycaster.setFromCamera(mouse, camera)
    
    // 计算与射线相交的对象
    const intersects = raycaster.intersectObjects(scene.children, true)
    
    if (intersects.length > 0) {
      // 从交点找到最顶层对象
      let selectedObject = intersects[0].object
      
      // 向上遍历对象层次结构，找到包含id的对象
      while (selectedObject && (!selectedObject.userData || !selectedObject.userData.id)) {
        selectedObject = selectedObject.parent
      }
      
      // 如果找到了包含id的对象
      if (selectedObject && selectedObject.userData && selectedObject.userData.id) {
        // 通知store选择对象
        if (sceneStore) {
          sceneStore.selectObject(selectedObject.userData.id)
        }
      }
    } else {
      // 如果没有点击任何对象，清除选择
      if (sceneStore) {
        sceneStore.clearSelection()
      }
    }
  }
  
  // 设置光照
  const setupLights = () => {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    
    // 主方向光（从前上方照射）
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8)
    mainLight.position.set(-35, 55, 35)
    mainLight.castShadow = true
    
    // 设置阴影参数
    mainLight.shadow.camera.near = 0.5
    mainLight.shadow.camera.far = 500
    mainLight.shadow.camera.left = -100
    mainLight.shadow.camera.right = 100
    mainLight.shadow.camera.top = 100
    mainLight.shadow.camera.bottom = -100
    mainLight.shadow.mapSize.width = 2048
    mainLight.shadow.mapSize.height = 2048
    
    scene.add(mainLight)
    
    // 次要方向光（从后上方照射）
    const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.4)
    secondaryLight.position.set(35, 55, -35)
    scene.add(secondaryLight)
    
    // 填充光（从前下方照射）
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
    fillLight.position.set(0, 15, 40)
    scene.add(fillLight)
  }
  
  // 创建地面
  const createGround = () => {
    // 创建一个大型平面作为地面
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000)
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x999999,
      roughness: 0.8,
      metalness: 0.2
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    
    // 旋转平面使其水平
    ground.rotation.x = -Math.PI / 2
    
    // 接收阴影
    ground.receiveShadow = true
    ground.name = 'ground'
    
    // 添加到场景
    scene.add(ground)
    
    // 添加网格辅助线
    const gridHelper = new THREE.GridHelper(1000, 100, 0x000000, 0x444444)
    scene.add(gridHelper)
  }
  
  // 窗口大小调整
  const onWindowResize = () => {
    if (!camera || !renderer || !container.value) return
    
    const containerRect = container.value.getBoundingClientRect()
    camera.aspect = containerRect.width / containerRect.height
    camera.updateProjectionMatrix()
    renderer.setSize(containerRect.width, containerRect.height)
  }
  
  // 动画循环
  const animate = () => {
    requestAnimationFrame(animate)
    
    if (renderer && scene && camera) {
      try {
        renderer.render(scene, camera)
      } catch (error) {
        console.error('渲染错误:', error)
      }
    }
  }
  
  // 添加3D对象到场景
  const addObjectToScene = (object3D, objectData) => {
    if (!scene) return
    
    try {
      // 设置对象的位置
      object3D.position.set(
        objectData.position.x,
        objectData.position.y,
        objectData.position.z
      )
      
      // 设置对象的旋转（如果有）
      if (objectData.rotation) {
        object3D.rotation.set(
          objectData.rotation.x || 0,
          objectData.rotation.y || 0,
          objectData.rotation.z || 0
        )
      }
      
      // 设置对象的缩放（如果有）
      if (objectData.scale) {
        object3D.scale.set(
          objectData.scale.x || 1,
          objectData.scale.y || 1,
          objectData.scale.z || 1
        )
      }
      
      // 存储对象ID到userData
      object3D.userData.id = objectData.id
      object3D.userData.name = objectData.name || '';
      object3D.userData.description = objectData.description || '';
      object3D.userData.type = objectData.type || '';
      
      // 添加到场景
      scene.add(object3D)
      
      return true;
    } catch (error) {
      console.error('添加对象到场景失败:', error);
      return false;
    }
  }
  
  // 从场景中移除对象
  const removeObjectFromScene = (objectId) => {
    if (!scene) return
    
    // 查找具有指定ID的对象
    const object = scene.children.find(
      child => child.userData && child.userData.id === objectId
    )
    
    if (object) {
      scene.remove(object)
    }
  }
  
  // 重置相机位置
  const resetCamera = () => {
    if (camera) {
      // 使用中等高度
      const initialHeight = (cameraSettings.minHeight + cameraSettings.maxHeight) / 2
      const initialTilt = calculateTiltFromHeight(initialHeight)
      setCamera(0, 0, initialHeight, initialTilt)
    }
  }
  
  // 设置对象选择功能
  const setupObjectSelection = (storeInstance) => {
    // 更新store引用
    if (storeInstance) {
      // 仅在需要时更新引用
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
    window.removeEventListener('resize', onWindowResize)
    
    if (renderer && renderer.domElement) {
      renderer.domElement.removeEventListener('mousedown', onMouseDown)
      renderer.domElement.removeEventListener('mousemove', onMouseMove)
      renderer.domElement.removeEventListener('mouseup', onMouseUp)
      renderer.domElement.removeEventListener('mouseleave', onMouseUp)
      renderer.domElement.removeEventListener('wheel', onMouseWheel)
      renderer.domElement.removeEventListener('click', onMouseClick)
    }
    
    if (renderer) {
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
    
    if (controls) {
      controls.dispose()
    }
    
    // 清理场景中的对象
    if (scene) {
      while(scene.children.length > 0) { 
        const object = scene.children[0]
        scene.remove(object)
      }
    }
    
    // 清空引用
    scene = null
    camera = null
    renderer = null
    controls = null
    raycaster = null
    mouse = null
  })
  
  return {
    addObjectToScene,
    removeObjectFromScene,
    resetCamera,
    setupObjectSelection
  }
} 