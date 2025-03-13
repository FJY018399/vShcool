import * as THREE from 'three'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

// 对象类型
export const OBJECT_TYPES = {
  HOUSE: 'house',
  TREE: 'tree',
  BUILDING: 'building',
}

// 对象工厂
export class ObjectFactory {
  constructor() {
    // 不使用模型加载器和纹理加载器
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
    // 创建一个DOM元素作为房子
    const element = document.createElement('div')
    element.style.width = '10px'
    element.style.height = '8px'
    element.style.backgroundColor = options.color ? `#${options.color.toString(16)}` : '#ffffff'
    element.style.border = '1px solid #000'
    element.style.borderRadius = '2px'
    
    // 创建CSS3D对象
    const house = new CSS3DObject(element)
    house.position.y = 4 // 半高
    
    return house
  }
  
  // 创建树
  createTree(options = {}) {
    // 创建一个DOM元素作为树
    const element = document.createElement('div')
    element.style.width = '5px'
    element.style.height = '10px'
    element.style.backgroundColor = options.color ? `#${options.color.toString(16)}` : '#00AA00'
    element.style.border = '1px solid #006600'
    element.style.borderRadius = '50% 50% 0 0'
    
    // 创建CSS3D对象
    const tree = new CSS3DObject(element)
    tree.position.y = 5 // 半高
    
    return tree
  }
  
  // 创建建筑物
  createBuilding(options = {}) {
    // 创建一个DOM元素作为建筑物
    const element = document.createElement('div')
    element.style.width = '20px'
    element.style.height = '30px'
    element.style.backgroundColor = options.color ? `#${options.color.toString(16)}` : '#AAAAAA'
    element.style.border = '1px solid #666'
    
    // 创建CSS3D对象
    const building = new CSS3DObject(element)
    building.position.y = 15 // 半高
    
    return building
  }
}

// 创建单例实例
export const objectFactory = new ObjectFactory() 