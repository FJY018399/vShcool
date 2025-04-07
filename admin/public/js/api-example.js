/**
 * 前端API使用示例
 * 这个文件展示如何在前端获取和使用建筑物数据
 */

// 对象类型常量 - 与前端使用的类型保持一致
const OBJECT_TYPES = {
  HOUSE: 'house',
  TREE: 'tree',
  BUILDING: 'building',
  CLASSROOM: 'classroom',
  LABORATORY: 'laboratory',
  GYMNASIUM: 'gymnasium',
  PLAYGROUND: 'playground'
}

// 获取建筑物数据示例 - 同域调用
async function fetchBuildings() {
  try {
    const response = await fetch('/api/buildings');
    if (!response.ok) {
      throw new Error('获取建筑物数据失败');
    }
    
    const data = await response.json();
    // 类型格式已统一，不再需要转换
    return data.buildings || [];
  } catch (error) {
    console.error('获取建筑物数据出错:', error);
    return [];
  }
}

// 获取建筑物数据示例 - 跨域调用
async function fetchBuildingsCrossOrigin() {
  try {
    const apiUrl = 'http://localhost:3000/api/buildings'; // 使用完整URL
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'omit' // 如果不需要发送Cookie等凭证，使用'omit'
    });
    
    if (!response.ok) {
      throw new Error('获取建筑物数据失败');
    }
    
    const data = await response.json();
    // 类型格式已统一，不再需要转换
    return data.buildings || [];
  } catch (error) {
    console.error('跨域获取建筑物数据出错:', error);
    return [];
  }
}

// 加载建筑物到Three.js场景的示例
async function loadBuildingsToScene(scene, objectFactory, crossOrigin = false) {
  try {
    // 获取建筑物数据
    const buildings = crossOrigin ? await fetchBuildingsCrossOrigin() : await fetchBuildings();
    
    if (!buildings.length) {
      console.log('没有找到建筑物数据');
      return;
    }
    
    console.log(`加载 ${buildings.length} 个建筑物到场景中...`);
    
    // 遍历所有建筑物并添加到场景中
    for (const building of buildings) {
      try {
        // 创建3D对象
        const object3D = await objectFactory.createObject(
          building.type,
          building.options || {}
        );
        
        if (!object3D) {
          console.warn(`创建类型为 ${building.type} 的建筑物失败`);
          continue;
        }
        
        // 设置位置
        object3D.position.set(
          building.position.x,
          building.position.y,
          building.position.z
        );
        
        // 设置旋转
        object3D.rotation.set(
          building.rotation.x,
          building.rotation.y,
          building.rotation.z
        );
        
        // 设置缩放
        object3D.scale.set(
          building.scale.x,
          building.scale.y,
          building.scale.z
        );
        
        // 设置对象ID（用于选择）
        object3D.userData.id = building.id;
        object3D.userData.name = building.name;
        object3D.userData.description = building.description;
        object3D.userData.type = building.type;
        
        // 添加到场景
        scene.add(object3D);
        
        console.log(`添加建筑物: ${building.name} (ID: ${building.id})`);
      } catch (error) {
        console.error(`添加建筑物 ${building.name} 时出错:`, error);
      }
    }
    
    console.log('所有建筑物加载完成');
  } catch (error) {
    console.error('加载建筑物到场景时出错:', error);
  }
}

// 这是一个如何集成到前端代码的示例
// 在实际应用中，这些代码应该集成到现有的Three.js初始化和场景管理代码中
/*
document.addEventListener('DOMContentLoaded', async () => {
  // 初始化Three.js场景、相机、渲染器等
  const scene = new THREE.Scene();
  
  // 加载建筑物，参数true表示使用跨域调用
  await loadBuildingsToScene(scene, objectFactory, true);
  
  // 渲染场景
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  
  animate();
});
*/ 