import * as THREE from 'three'
// 移除CSS3DObject导入
// import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

// 对象类型
export const OBJECT_TYPES = {
  HOUSE: 'house',
  TREE: 'tree',
  BUILDING: 'building',
}

// 对象工厂
export class ObjectFactory {
  constructor() {
    // 初始化材质和纹理
    this.initMaterials()
  }
  
  // 初始化材质
  initMaterials() {
    // 房屋材质
    this.houseMaterials = {
      wall: new THREE.MeshStandardMaterial({
        color: 0xf0f0f0,
        roughness: 0.7,
        metalness: 0.1
      }),
      roof: new THREE.MeshStandardMaterial({
        color: 0xcc4444,
        roughness: 0.6,
        metalness: 0.1
      }),
      window: new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        roughness: 0.2,
        metalness: 0.5,
        transparent: true,
        opacity: 0.7
      }),
      door: new THREE.MeshStandardMaterial({
        color: 0x885533,
        roughness: 0.8,
        metalness: 0.2
      })
    }
    
    // 树材质
    this.treeMaterials = {
      trunk: new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.9,
        metalness: 0.1
      }),
      leaves: new THREE.MeshStandardMaterial({
        color: 0x228B22,
        roughness: 0.8,
        metalness: 0.1
      })
    }
    
    // 建筑材质
    this.buildingMaterials = {
      wall: new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.7,
        metalness: 0.3
      }),
      window: new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        roughness: 0.2,
        metalness: 0.5,
        transparent: true,
        opacity: 0.7
      }),
      roof: new THREE.MeshStandardMaterial({
        color: 0x666666,
        roughness: 0.6,
        metalness: 0.4
      }),
      detail: new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.5,
        metalness: 0.5
      })
    }
    
    // 线框材质
    this.lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 })
  }
  
  // 创建对象
  async createObject(type, options = {}) {
    switch (type) {
      case OBJECT_TYPES.HOUSE:
        return this.createHouse(options)
      case OBJECT_TYPES.TREE:
        return this.createTree(options)
      case OBJECT_TYPES.BUILDING:
        return this.createBuilding(options)
      default:
        console.error(`未知对象类型: ${type}`)
        return null
    }
  }
  
  // 创建房子
  createHouse(options = {}) {
    const group = new THREE.Group()
    
    // 自定义颜色
    if (options.color) {
      this.houseMaterials.wall.color.setHex(options.color)
    }
    
    // 房屋尺寸
    const width = options.width || 10
    const height = options.height || 8
    const depth = options.depth || 10
    
    // 创建房屋主体
    const houseGeometry = new THREE.BoxGeometry(width, height, depth)
    const house = new THREE.Mesh(houseGeometry, this.houseMaterials.wall)
    house.castShadow = true
    house.receiveShadow = true
    house.position.y = height / 2
    group.add(house)
    
    // 创建房屋线框
    const edges = new THREE.EdgesGeometry(houseGeometry)
    const line = new THREE.LineSegments(edges, this.lineMaterial)
    line.position.y = height / 2
    group.add(line)
    
    // 创建屋顶
    const roofHeight = height * 0.5
    const roofGeometry = new THREE.ConeGeometry(width * 0.7, roofHeight, 4)
    const roof = new THREE.Mesh(roofGeometry, this.houseMaterials.roof)
    roof.castShadow = true
    roof.position.y = height + roofHeight / 2
    roof.rotation.y = Math.PI / 4
    group.add(roof)
    
    // 创建屋顶线框
    const roofEdges = new THREE.EdgesGeometry(roofGeometry)
    const roofLine = new THREE.LineSegments(roofEdges, this.lineMaterial)
    roofLine.position.y = height + roofHeight / 2
    roofLine.rotation.y = Math.PI / 4
    group.add(roofLine)
    
    // 创建门
    const doorWidth = width * 0.3
    const doorHeight = height * 0.6
    const doorGeometry = new THREE.PlaneGeometry(doorWidth, doorHeight)
    const door = new THREE.Mesh(doorGeometry, this.houseMaterials.door)
    door.position.z = depth / 2 + 0.01
    door.position.y = doorHeight / 2
    group.add(door)
    
    // 创建窗户
    const windowSize = width * 0.2
    const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize)
    
    // 前面窗户
    const frontWindow1 = new THREE.Mesh(windowGeometry, this.houseMaterials.window)
    frontWindow1.position.z = depth / 2 + 0.01
    frontWindow1.position.x = width * 0.25
    frontWindow1.position.y = height * 0.7
    group.add(frontWindow1)
    
    const frontWindow2 = new THREE.Mesh(windowGeometry, this.houseMaterials.window)
    frontWindow2.position.z = depth / 2 + 0.01
    frontWindow2.position.x = -width * 0.25
    frontWindow2.position.y = height * 0.7
    group.add(frontWindow2)
    
    // 侧面窗户
    const sideWindow1 = new THREE.Mesh(windowGeometry, this.houseMaterials.window)
    sideWindow1.position.x = width / 2 + 0.01
    sideWindow1.position.z = 0
    sideWindow1.position.y = height * 0.7
    sideWindow1.rotation.y = Math.PI / 2
    group.add(sideWindow1)
    
    const sideWindow2 = new THREE.Mesh(windowGeometry, this.houseMaterials.window)
    sideWindow2.position.x = -width / 2 - 0.01
    sideWindow2.position.z = 0
    sideWindow2.position.y = height * 0.7
    sideWindow2.rotation.y = -Math.PI / 2
    group.add(sideWindow2)
    
    return group
  }
  
  // 创建树
  createTree(options = {}) {
    const group = new THREE.Group()
    
    // 自定义颜色
    if (options.color) {
      this.treeMaterials.leaves.color.setHex(options.color)
    }
    
    // 树干
    const trunkRadius = 0.5
    const trunkHeight = 4
    const trunkGeometry = new THREE.CylinderGeometry(trunkRadius * 0.7, trunkRadius, trunkHeight, 8)
    const trunk = new THREE.Mesh(trunkGeometry, this.treeMaterials.trunk)
    trunk.castShadow = true
    trunk.position.y = trunkHeight / 2
    group.add(trunk)
    
    // 树干线框
    const trunkEdges = new THREE.EdgesGeometry(trunkGeometry)
    const trunkLine = new THREE.LineSegments(trunkEdges, this.lineMaterial)
    trunkLine.position.y = trunkHeight / 2
    group.add(trunkLine)
    
    // 树叶（多层）
    const leafRadius = 3
    const leafHeight = 6
    const leafSegments = 8
    
    // 底层树叶（最大）
    const leafGeometry1 = new THREE.ConeGeometry(leafRadius, leafHeight * 0.4, leafSegments)
    const leaf1 = new THREE.Mesh(leafGeometry1, this.treeMaterials.leaves)
    leaf1.castShadow = true
    leaf1.position.y = trunkHeight + leafHeight * 0.2
    group.add(leaf1)
    
    // 底层树叶线框
    const leafEdges1 = new THREE.EdgesGeometry(leafGeometry1)
    const leafLine1 = new THREE.LineSegments(leafEdges1, this.lineMaterial)
    leafLine1.position.y = trunkHeight + leafHeight * 0.2
    group.add(leafLine1)
    
    // 中层树叶
    const leafGeometry2 = new THREE.ConeGeometry(leafRadius * 0.8, leafHeight * 0.4, leafSegments)
    const leaf2 = new THREE.Mesh(leafGeometry2, this.treeMaterials.leaves)
    leaf2.castShadow = true
    leaf2.position.y = trunkHeight + leafHeight * 0.5
    group.add(leaf2)
    
    // 中层树叶线框
    const leafEdges2 = new THREE.EdgesGeometry(leafGeometry2)
    const leafLine2 = new THREE.LineSegments(leafEdges2, this.lineMaterial)
    leafLine2.position.y = trunkHeight + leafHeight * 0.5
    group.add(leafLine2)
    
    // 顶层树叶（最小）
    const leafGeometry3 = new THREE.ConeGeometry(leafRadius * 0.6, leafHeight * 0.4, leafSegments)
    const leaf3 = new THREE.Mesh(leafGeometry3, this.treeMaterials.leaves)
    leaf3.castShadow = true
    leaf3.position.y = trunkHeight + leafHeight * 0.8
    group.add(leaf3)
    
    // 顶层树叶线框
    const leafEdges3 = new THREE.EdgesGeometry(leafGeometry3)
    const leafLine3 = new THREE.LineSegments(leafEdges3, this.lineMaterial)
    leafLine3.position.y = trunkHeight + leafHeight * 0.8
    group.add(leafLine3)
    
    return group
  }
  
  // 创建建筑物
  createBuilding(options = {}) {
    const group = new THREE.Group()
    
    // 自定义颜色
    if (options.color) {
      this.buildingMaterials.wall.color.setHex(options.color)
    }
    
    // 建筑尺寸
    const width = options.width || 20
    const height = options.height || 30
    const depth = options.depth || 20
    const floors = options.floors || 5
    
    // 创建建筑主体
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth)
    const building = new THREE.Mesh(buildingGeometry, this.buildingMaterials.wall)
    building.castShadow = true
    building.receiveShadow = true
    building.position.y = height / 2
    group.add(building)
    
    // 创建建筑线框
    const edges = new THREE.EdgesGeometry(buildingGeometry)
    const line = new THREE.LineSegments(edges, this.lineMaterial)
    line.position.y = height / 2
    group.add(line)
    
    // 创建楼层分隔线
    const floorHeight = height / floors
    for (let i = 1; i < floors; i++) {
      const y = i * floorHeight
      
      // 前面
      const frontDivider = new THREE.Mesh(
        new THREE.BoxGeometry(width, 0.2, 0.1),
        this.buildingMaterials.detail
      )
      frontDivider.position.set(0, y, depth / 2 + 0.05)
      group.add(frontDivider)
      
      // 后面
      const backDivider = new THREE.Mesh(
        new THREE.BoxGeometry(width, 0.2, 0.1),
        this.buildingMaterials.detail
      )
      backDivider.position.set(0, y, -depth / 2 - 0.05)
      group.add(backDivider)
      
      // 左侧
      const leftDivider = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.2, depth),
        this.buildingMaterials.detail
      )
      leftDivider.position.set(-width / 2 - 0.05, y, 0)
      group.add(leftDivider)
      
      // 右侧
      const rightDivider = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.2, depth),
        this.buildingMaterials.detail
      )
      rightDivider.position.set(width / 2 + 0.05, y, 0)
      group.add(rightDivider)
    }
    
    // 创建窗户
    const windowWidth = 2
    const windowHeight = 3
    const windowDepth = 0.1
    
    // 每层楼的窗户数量
    const windowsPerFloor = {
      front: 5,
      side: 3
    }
    
    // 窗户间距
    const frontSpacing = width / (windowsPerFloor.front + 1)
    const sideSpacing = depth / (windowsPerFloor.side + 1)
    
    // 为每层楼创建窗户
    for (let floor = 0; floor < floors; floor++) {
      const baseY = floor * floorHeight + floorHeight / 2
      
      // 前面窗户
      for (let i = 1; i <= windowsPerFloor.front; i++) {
        const window = new THREE.Mesh(
          new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth),
          this.buildingMaterials.window
        )
        window.position.set(
          -width / 2 + i * frontSpacing,
          baseY,
          depth / 2 + windowDepth / 2
        )
        group.add(window)
      }
      
      // 后面窗户
      for (let i = 1; i <= windowsPerFloor.front; i++) {
        const window = new THREE.Mesh(
          new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth),
          this.buildingMaterials.window
        )
        window.position.set(
          -width / 2 + i * frontSpacing,
          baseY,
          -depth / 2 - windowDepth / 2
        )
        window.rotation.y = Math.PI
        group.add(window)
      }
      
      // 左侧窗户
      for (let i = 1; i <= windowsPerFloor.side; i++) {
        const window = new THREE.Mesh(
          new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth),
          this.buildingMaterials.window
        )
        window.position.set(
          -width / 2 - windowDepth / 2,
          baseY,
          -depth / 2 + i * sideSpacing
        )
        window.rotation.y = -Math.PI / 2
        group.add(window)
      }
      
      // 右侧窗户
      for (let i = 1; i <= windowsPerFloor.side; i++) {
        const window = new THREE.Mesh(
          new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth),
          this.buildingMaterials.window
        )
        window.position.set(
          width / 2 + windowDepth / 2,
          baseY,
          -depth / 2 + i * sideSpacing
        )
        window.rotation.y = Math.PI / 2
        group.add(window)
      }
    }
    
    // 创建屋顶
    const roofHeight = height * 0.1
    const roofGeometry = new THREE.BoxGeometry(width + 2, roofHeight, depth + 2)
    const roof = new THREE.Mesh(roofGeometry, this.buildingMaterials.roof)
    roof.position.y = height + roofHeight / 2
    group.add(roof)
    
    // 创建屋顶线框
    const roofEdges = new THREE.EdgesGeometry(roofGeometry)
    const roofLine = new THREE.LineSegments(roofEdges, this.lineMaterial)
    roofLine.position.y = height + roofHeight / 2
    group.add(roofLine)
    
    return group
  }
}

// 创建单例实例
export const objectFactory = new ObjectFactory() 