import * as THREE from 'three'
// 移除CSS3DObject导入
// import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

// 对象类型
export const OBJECT_TYPES = {
  HOUSE: 'house',
  TREE: 'tree',
  BUILDING: 'building',
  CLASSROOM: 'classroom',     // 教学楼
  LABORATORY: 'laboratory',   // 实验室
  GYMNASIUM: 'gymnasium',     // 体育馆
  PLAYGROUND: 'playground',   // 操场
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
    
    // 教学楼材质
    this.classroomMaterials = {
      wall: new THREE.MeshStandardMaterial({
        color: 0xEEE8AA, // 浅黄色墙壁
        roughness: 0.7,
        metalness: 0.2
      }),
      window: new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        roughness: 0.2,
        metalness: 0.5,
        transparent: true,
        opacity: 0.7
      }),
      roof: new THREE.MeshStandardMaterial({
        color: 0x8B4513, // 棕色屋顶
        roughness: 0.6,
        metalness: 0.3
      }),
      detail: new THREE.MeshStandardMaterial({
        color: 0xCD853F, // 珊栏等细节
        roughness: 0.5,
        metalness: 0.2
      })
    }
    
    // 实验室材质
    this.laboratoryMaterials = {
      wall: new THREE.MeshStandardMaterial({
        color: 0xF5F5F5, // 白色墙壁
        roughness: 0.6,
        metalness: 0.4
      }),
      window: new THREE.MeshStandardMaterial({
        color: 0xADD8E6, // 浅蓝色窗户
        roughness: 0.2,
        metalness: 0.6,
        transparent: true,
        opacity: 0.8
      }),
      roof: new THREE.MeshStandardMaterial({
        color: 0x4682B4, // 钢蓝色屋顶
        roughness: 0.5,
        metalness: 0.5
      }),
      detail: new THREE.MeshStandardMaterial({
        color: 0xC0C0C0, // 银色细节
        roughness: 0.4,
        metalness: 0.7
      })
    }
    
    // 体育馆材质
    this.gymnasiumMaterials = {
      wall: new THREE.MeshStandardMaterial({
        color: 0xD2B48C, // 棕褐色墙壁
        roughness: 0.7,
        metalness: 0.2
      }),
      window: new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        roughness: 0.2,
        metalness: 0.5,
        transparent: true,
        opacity: 0.7
      }),
      roof: new THREE.MeshStandardMaterial({
        color: 0x800000, // 深红色屋顶
        roughness: 0.6,
        metalness: 0.3
      }),
      detail: new THREE.MeshStandardMaterial({
        color: 0xDEB887, // 细节部分
        roughness: 0.5,
        metalness: 0.3
      })
    }
    
    // 操场材质
    this.playgroundMaterials = {
      track: new THREE.MeshStandardMaterial({
        color: 0xB22222, // 红色跑道
        roughness: 0.9,
        metalness: 0.1
      }),
      field: new THREE.MeshStandardMaterial({
        color: 0x228B22, // 绿色草地
        roughness: 0.8,
        metalness: 0.1
      }),
      stand: new THREE.MeshStandardMaterial({
        color: 0xA9A9A9, // 灰色看台
        roughness: 0.7,
        metalness: 0.2
      }),
      detail: new THREE.MeshStandardMaterial({
        color: 0xFFFFFF, // 白色线条
        roughness: 0.5,
        metalness: 0.1
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
      case OBJECT_TYPES.CLASSROOM:
        return this.createClassroom(options)
      case OBJECT_TYPES.LABORATORY:
        return this.createLaboratory(options)
      case OBJECT_TYPES.GYMNASIUM:
        return this.createGymnasium(options)
      case OBJECT_TYPES.PLAYGROUND:
        return this.createPlayground(options)
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
  
  // 创建教学楼
  createClassroom(options = {}) {
    const group = new THREE.Group()
    
    // 自定义颜色
    if (options.color) {
      this.classroomMaterials.wall.color.setHex(options.color)
    }
    
    // 建筑尺寸
    const width = options.width || 40
    const height = options.height || 15
    const depth = options.depth || 20
    const floors = options.floors || 3
    
    // 创建建筑主体
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth)
    const building = new THREE.Mesh(buildingGeometry, this.classroomMaterials.wall)
    building.castShadow = true
    building.receiveShadow = true
    building.position.y = height / 2
    group.add(building)
    
    // 创建建筑线框
    const edges = new THREE.EdgesGeometry(buildingGeometry)
    const line = new THREE.LineSegments(edges, this.lineMaterial)
    line.position.y = height / 2
    group.add(line)
    
    // 创建屋顶
    const roofHeight = height * 0.1
    const roofGeometry = new THREE.BoxGeometry(width + 1, roofHeight, depth + 1)
    const roof = new THREE.Mesh(roofGeometry, this.classroomMaterials.roof)
    roof.position.y = height + roofHeight / 2
    group.add(roof)
    
    // 创建屋顶线框
    const roofEdges = new THREE.EdgesGeometry(roofGeometry)
    const roofLine = new THREE.LineSegments(roofEdges, this.lineMaterial)
    roofLine.position.y = height + roofHeight / 2
    group.add(roofLine)
    
    // 创建楼层分隔线
    const floorHeight = height / floors
    for (let i = 1; i < floors; i++) {
      const y = i * floorHeight
      
      // 前面
      const frontDivider = new THREE.Mesh(
        new THREE.BoxGeometry(width, 0.3, 0.1),
        this.classroomMaterials.detail
      )
      frontDivider.position.set(0, y, depth / 2 + 0.05)
      group.add(frontDivider)
      
      // 后面
      const backDivider = new THREE.Mesh(
        new THREE.BoxGeometry(width, 0.3, 0.1),
        this.classroomMaterials.detail
      )
      backDivider.position.set(0, y, -depth / 2 - 0.05)
      group.add(backDivider)
      
      // 左侧
      const leftDivider = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.3, depth),
        this.classroomMaterials.detail
      )
      leftDivider.position.set(-width / 2 - 0.05, y, 0)
      group.add(leftDivider)
      
      // 右侧
      const rightDivider = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.3, depth),
        this.classroomMaterials.detail
      )
      rightDivider.position.set(width / 2 + 0.05, y, 0)
      group.add(rightDivider)
    }
    
    // 创建窗户
    const windowWidth = 3
    const windowHeight = 2
    const windowDepth = 0.1
    
    // 每层楼的窗户数量
    const windowsPerFloor = {
      front: 8,
      side: 4
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
          this.classroomMaterials.window
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
          this.classroomMaterials.window
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
          this.classroomMaterials.window
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
          this.classroomMaterials.window
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
    
    // 创建入口
    const entranceWidth = 5
    const entranceHeight = 4
    const entranceDepth = 3
    
    const entranceGeometry = new THREE.BoxGeometry(entranceWidth, entranceHeight, entranceDepth)
    const entrance = new THREE.Mesh(entranceGeometry, this.classroomMaterials.detail)
    entrance.position.set(0, entranceHeight / 2, depth / 2 + entranceDepth / 2)
    group.add(entrance)
    
    // 创建入口线框
    const entranceEdges = new THREE.EdgesGeometry(entranceGeometry)
    const entranceLine = new THREE.LineSegments(entranceEdges, this.lineMaterial)
    entranceLine.position.set(0, entranceHeight / 2, depth / 2 + entranceDepth / 2)
    group.add(entranceLine)
    
    // 创建入口门
    const doorWidth = 3
    const doorHeight = 3
    const doorGeometry = new THREE.PlaneGeometry(doorWidth, doorHeight)
    const door = new THREE.Mesh(doorGeometry, this.classroomMaterials.detail)
    door.position.set(0, doorHeight / 2, depth / 2 + entranceDepth + 0.01)
    group.add(door)
    
    return group
  }
  
  // 创建实验室
  createLaboratory(options = {}) {
    const group = new THREE.Group()
    
    // 自定义颜色
    if (options.color) {
      this.laboratoryMaterials.wall.color.setHex(options.color)
    }
    
    // 建筑尺寸
    const width = options.width || 30
    const height = options.height || 12
    const depth = options.depth || 25
    
    // 创建建筑主体
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth)
    const building = new THREE.Mesh(buildingGeometry, this.laboratoryMaterials.wall)
    building.castShadow = true
    building.receiveShadow = true
    building.position.y = height / 2
    group.add(building)
    
    // 创建建筑线框
    const edges = new THREE.EdgesGeometry(buildingGeometry)
    const line = new THREE.LineSegments(edges, this.lineMaterial)
    line.position.y = height / 2
    group.add(line)
    
    // 创建特殊圆顶屋顶
    const roofRadius = Math.min(width, depth) / 2
    const roofHeight = height * 0.3
    const roofGeometry = new THREE.SphereGeometry(roofRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)
    const roof = new THREE.Mesh(roofGeometry, this.laboratoryMaterials.roof)
    roof.position.y = height
    group.add(roof)
    
    // 创建屋顶线框
    const roofEdges = new THREE.EdgesGeometry(roofGeometry)
    const roofLine = new THREE.LineSegments(roofEdges, this.lineMaterial)
    roofLine.position.y = height
    group.add(roofLine)
    
    // 创建窗户
    const windowSize = 4
    const windowDepth = 0.1
    
    // 窗户数量
    const windowsPerSide = 5
    
    // 窗户间距
    const spacing = width / (windowsPerSide + 1)
    
    // 创建大型玻璃窗（用于实验室的现代感）
    // 前面窗户（大型玻璃窗）
    const frontWindowGeometry = new THREE.BoxGeometry(width * 0.8, height * 0.7, windowDepth)
    const frontWindow = new THREE.Mesh(frontWindowGeometry, this.laboratoryMaterials.window)
    frontWindow.position.set(0, height * 0.6, depth / 2 + windowDepth / 2)
    group.add(frontWindow)
    
    // 侧面窗户
    for (let i = 1; i <= windowsPerSide; i++) {
      // 左侧
      const leftWindow = new THREE.Mesh(
        new THREE.BoxGeometry(windowDepth, windowSize, windowSize),
        this.laboratoryMaterials.window
      )
      leftWindow.position.set(
        -width / 2 - windowDepth / 2,
        height * 0.6,
        -depth / 2 + i * (depth / (windowsPerSide + 1))
      )
      group.add(leftWindow)
      
      // 右侧
      const rightWindow = new THREE.Mesh(
        new THREE.BoxGeometry(windowDepth, windowSize, windowSize),
        this.laboratoryMaterials.window
      )
      rightWindow.position.set(
        width / 2 + windowDepth / 2,
        height * 0.6,
        -depth / 2 + i * (depth / (windowsPerSide + 1))
      )
      group.add(rightWindow)
    }
    
    // 创建入口
    const entranceWidth = 6
    const entranceHeight = 4
    const entranceDepth = 2
    
    const entranceGeometry = new THREE.BoxGeometry(entranceWidth, entranceHeight, entranceDepth)
    const entrance = new THREE.Mesh(entranceGeometry, this.laboratoryMaterials.detail)
    entrance.position.set(0, entranceHeight / 2, depth / 2 + entranceDepth / 2)
    group.add(entrance)
    
    // 创建入口线框
    const entranceEdges = new THREE.EdgesGeometry(entranceGeometry)
    const entranceLine = new THREE.LineSegments(entranceEdges, this.lineMaterial)
    entranceLine.position.set(0, entranceHeight / 2, depth / 2 + entranceDepth / 2)
    group.add(entranceLine)
    
    // 添加一些实验室特有的细节装饰（屋顶设备）
    const equipmentSize = 3
    const equipmentHeight = 2
    
    const equipment1Geometry = new THREE.CylinderGeometry(equipmentSize/2, equipmentSize/2, equipmentHeight, 16)
    const equipment1 = new THREE.Mesh(equipment1Geometry, this.laboratoryMaterials.detail)
    equipment1.position.set(width/4, height + equipmentHeight/2, depth/4)
    group.add(equipment1)
    
    const equipment2Geometry = new THREE.BoxGeometry(equipmentSize, equipmentHeight, equipmentSize)
    const equipment2 = new THREE.Mesh(equipment2Geometry, this.laboratoryMaterials.detail)
    equipment2.position.set(-width/4, height + equipmentHeight/2, -depth/4)
    group.add(equipment2)
    
    return group
  }
  
  // 创建体育馆
  createGymnasium(options = {}) {
    const group = new THREE.Group()
    
    // 自定义颜色
    if (options.color) {
      this.gymnasiumMaterials.wall.color.setHex(options.color)
    }
    
    // 建筑尺寸
    const width = options.width || 50
    const height = options.height || 15
    const depth = options.depth || 60
    
    // 创建体育馆主体（半圆柱形）
    const mainGeometry = new THREE.CylinderGeometry(height, height, width, 32, 1, true, -Math.PI/2, Math.PI)
    const main = new THREE.Mesh(mainGeometry, this.gymnasiumMaterials.wall)
    main.rotation.z = Math.PI / 2
    main.position.y = height
    group.add(main)
    
    // 创建体育馆线框
    const mainEdges = new THREE.EdgesGeometry(mainGeometry)
    const mainLine = new THREE.LineSegments(mainEdges, this.lineMaterial)
    mainLine.rotation.z = Math.PI / 2
    mainLine.position.y = height
    group.add(mainLine)
    
    // 创建两侧封闭板
    const sideGeometry = new THREE.CircleGeometry(height, 32, -Math.PI/2, Math.PI)
    
    // 左侧
    const leftSide = new THREE.Mesh(sideGeometry, this.gymnasiumMaterials.wall)
    leftSide.rotation.y = Math.PI / 2
    leftSide.position.set(-width/2, height, 0)
    group.add(leftSide)
    
    // 左侧线框
    const leftSideEdges = new THREE.EdgesGeometry(sideGeometry)
    const leftSideLine = new THREE.LineSegments(leftSideEdges, this.lineMaterial)
    leftSideLine.rotation.y = Math.PI / 2
    leftSideLine.position.set(-width/2, height, 0)
    group.add(leftSideLine)
    
    // 右侧
    const rightSide = new THREE.Mesh(sideGeometry, this.gymnasiumMaterials.wall)
    rightSide.rotation.y = -Math.PI / 2
    rightSide.position.set(width/2, height, 0)
    group.add(rightSide)
    
    // 右侧线框
    const rightSideEdges = new THREE.EdgesGeometry(sideGeometry)
    const rightSideLine = new THREE.LineSegments(rightSideEdges, this.lineMaterial)
    rightSideLine.rotation.y = -Math.PI / 2
    rightSideLine.position.set(width/2, height, 0)
    group.add(rightSideLine)
    
    // 创建底部
    const floorGeometry = new THREE.PlaneGeometry(width, depth)
    const floor = new THREE.Mesh(floorGeometry, this.gymnasiumMaterials.detail)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = 0.1
    group.add(floor)
    
    // 创建入口（前方）
    const entranceWidth = 10
    const entranceHeight = 6
    const entranceDepth = 5
    
    const entranceGeometry = new THREE.BoxGeometry(entranceWidth, entranceHeight, entranceDepth)
    const entrance = new THREE.Mesh(entranceGeometry, this.gymnasiumMaterials.detail)
    entrance.position.set(0, entranceHeight/2, depth/2 - 2)
    group.add(entrance)
    
    // 创建入口线框
    const entranceEdges = new THREE.EdgesGeometry(entranceGeometry)
    const entranceLine = new THREE.LineSegments(entranceEdges, this.lineMaterial)
    entranceLine.position.set(0, entranceHeight/2, depth/2 - 2)
    group.add(entranceLine)
    
    // 添加窗户
    const windowRadius = 2
    const windowSegments = 16
    
    // 体育馆两侧的圆形窗户
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 2; j++) {
        const windowGeometry = new THREE.CircleGeometry(windowRadius, windowSegments)
        const window = new THREE.Mesh(windowGeometry, this.gymnasiumMaterials.window)
        
        // 左侧
        const leftWindow = window.clone()
        leftWindow.rotation.y = Math.PI / 2
        leftWindow.position.set(
          -width/2 - 0.1,
          height * 0.5 + j * height * 0.5,
          -depth/3 + i * depth/5
        )
        group.add(leftWindow)
        
        // 右侧
        const rightWindow = window.clone()
        rightWindow.rotation.y = -Math.PI / 2
        rightWindow.position.set(
          width/2 + 0.1,
          height * 0.5 + j * height * 0.5,
          -depth/3 + i * depth/5
        )
        group.add(rightWindow)
      }
    }
    
    return group
  }
  
  // 创建操场
  createPlayground(options = {}) {
    const group = new THREE.Group()
    
    // 操场尺寸
    const width = options.width || 100
    const length = options.length || 150
    
    // 创建跑道（椭圆形）
    const trackWidth = 8
    const trackInnerWidth = width
    const trackInnerLength = length
    const trackOuterWidth = trackInnerWidth + trackWidth * 2
    const trackOuterLength = trackInnerLength + trackWidth * 2
    
    // 创建外部跑道
    const trackOuterShape = new THREE.Shape()
    trackOuterShape.ellipse(0, 0, trackOuterWidth/2, trackOuterLength/2, 0, Math.PI * 2, false)
    
    // 创建内部空洞
    const trackInnerShape = new THREE.Path()
    trackInnerShape.ellipse(0, 0, trackInnerWidth/2, trackInnerLength/2, 0, Math.PI * 2, true)
    trackOuterShape.holes.push(trackInnerShape)
    
    // 创建跑道几何体
    const trackGeometry = new THREE.ExtrudeGeometry(trackOuterShape, {
      depth: 0.3,
      bevelEnabled: false,
    })
    
    // 创建跑道网格
    const track = new THREE.Mesh(trackGeometry, this.playgroundMaterials.track)
    track.rotation.x = -Math.PI / 2
    track.position.y = 0.15
    group.add(track)
    
    // 创建草坪（内部区域）
    const fieldGeometry = new THREE.PlaneGeometry(trackInnerWidth, trackInnerLength)
    const field = new THREE.Mesh(fieldGeometry, this.playgroundMaterials.field)
    field.rotation.x = -Math.PI / 2
    field.position.y = 0.2
    group.add(field)
    
    // 创建足球场线条
    const soccerWidth = trackInnerWidth * 0.8
    const soccerLength = trackInnerLength * 0.8
    
    // 外围线条
    const soccerOutlineGeometry = new THREE.PlaneGeometry(soccerWidth, soccerLength)
    const soccerOutline = new THREE.LineSegments(
      new THREE.EdgesGeometry(soccerOutlineGeometry),
      this.playgroundMaterials.detail
    )
    soccerOutline.rotation.x = -Math.PI / 2
    soccerOutline.position.y = 0.25
    group.add(soccerOutline)
    
    // 中线
    const midLineGeometry = new THREE.PlaneGeometry(soccerWidth, 0.1)
    const midLine = new THREE.Mesh(midLineGeometry, this.playgroundMaterials.detail)
    midLine.rotation.x = -Math.PI / 2
    midLine.position.y = 0.25
    group.add(midLine)
    
    // 中心圆
    const centerCircleGeometry = new THREE.RingGeometry(8.9, 9, 32)
    const centerCircle = new THREE.Mesh(centerCircleGeometry, this.playgroundMaterials.detail)
    centerCircle.rotation.x = -Math.PI / 2
    centerCircle.position.y = 0.25
    group.add(centerCircle)
    
    // 创建看台（一侧）
    const standWidth = trackInnerWidth * 0.5
    const standDepth = 15
    const standHeight = 10
    const standSteps = 10
    const stepHeight = standHeight / standSteps
    const stepDepth = standDepth / standSteps
    
    // 创建看台组
    const standGroup = new THREE.Group()
    
    // 创建看台阶梯
    for (let i = 0; i < standSteps; i++) {
      const stepGeometry = new THREE.BoxGeometry(
        standWidth, 
        stepHeight, 
        stepDepth
      )
      const step = new THREE.Mesh(stepGeometry, this.playgroundMaterials.stand)
      step.position.set(
        0,
        i * stepHeight + stepHeight / 2,
        -trackInnerLength / 2 - trackWidth - standDepth / 2 + i * stepDepth
      )
      standGroup.add(step)
    }
    
    // 添加看台到组
    group.add(standGroup)
    
    // 创建第二个看台（对侧）
    const standGroup2 = standGroup.clone()
    standGroup2.rotation.y = Math.PI
    group.add(standGroup2)
    
    // 创建旗杆
    const flagPoleHeight = 10
    const flagPoleRadius = 0.2
    
    // 旗杆位置（四个角落）
    const flagPositions = [
      {x: soccerWidth/2, z: soccerLength/2},
      {x: -soccerWidth/2, z: soccerLength/2},
      {x: soccerWidth/2, z: -soccerLength/2},
      {x: -soccerWidth/2, z: -soccerLength/2}
    ]
    
    // 创建旗杆
    flagPositions.forEach(pos => {
      const poleGeometry = new THREE.CylinderGeometry(
        flagPoleRadius, flagPoleRadius, flagPoleHeight, 8
      )
      const pole = new THREE.Mesh(poleGeometry, this.lineMaterial)
      pole.position.set(pos.x, flagPoleHeight/2, pos.z)
      group.add(pole)
      
      // 创建旗帜
      const flagWidth = 3
      const flagHeight = 2
      const flagGeometry = new THREE.PlaneGeometry(flagWidth, flagHeight)
      const flag = new THREE.Mesh(flagGeometry, this.playgroundMaterials.detail)
      flag.position.set(pos.x + flagWidth/2, flagPoleHeight - flagHeight/2, pos.z)
      flag.rotation.y = Math.PI / 2
      group.add(flag)
    })
    
    return group
  }
}

// 创建单例实例
export const objectFactory = new ObjectFactory() 