/**
 * 数据迁移脚本
 * 将旧格式的建筑物数据转换为新格式
 */

const fs = require('fs-extra');
const path = require('path');

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data');
const BUILDINGS_FILE = path.join(DATA_DIR, 'buildings.json');

// 获取类型的默认选项
function getDefaultOptions(type) {
  const defaults = {
    'HOUSE': { color: 0xffffff, roofColor: 0xff0000 },
    'TREE': { trunkColor: 0x8B4513, leavesColor: 0x00AA00 },
    'BUILDING': { color: 0xAAAAAA },
    'CLASSROOM': { color: 0xEEE8AA },
    'LABORATORY': { color: 0xF5F5F5 },
    'GYMNASIUM': { color: 0xD2B48C },
    'PLAYGROUND': { width: 80, length: 120 }
  };
  
  return defaults[type] || {};
}

// 确保数据目录存在
fs.ensureDirSync(DATA_DIR);

// 迁移数据
function migrateData() {
  try {
    // 检查文件是否存在
    if (!fs.existsSync(BUILDINGS_FILE)) {
      console.log('建筑物数据文件不存在，创建新文件...');
      fs.writeJsonSync(BUILDINGS_FILE, { buildings: [] });
      console.log('创建成功！');
      return;
    }
    
    // 读取数据文件
    const data = fs.readJsonSync(BUILDINGS_FILE);
    
    if (!data.buildings || !Array.isArray(data.buildings)) {
      console.log('数据格式无效，创建新数据...');
      fs.writeJsonSync(BUILDINGS_FILE, { buildings: [] });
      console.log('创建成功！');
      return;
    }
    
    // 转换每个建筑物数据
    const migratedBuildings = data.buildings.map(building => {
      // 如果已经是新格式，不需要转换
      if (
        building.rotation && typeof building.rotation === 'object' && 
        building.scale && typeof building.scale === 'object' &&
        building.options
      ) {
        return building;
      }
      
      // 转换旋转值
      const rotation = typeof building.rotation === 'number'
        ? { x: 0, y: building.rotation, z: 0 }
        : { x: 0, y: 0, z: 0 };
      
      // 转换缩放值
      const scale = typeof building.scale === 'number'
        ? { x: building.scale, y: building.scale, z: building.scale }
        : { x: 1, y: 1, z: 1 };
      
      // 添加options
      const options = getDefaultOptions(building.type);
      
      return {
        ...building,
        rotation,
        scale,
        options
      };
    });
    
    // 保存转换后的数据
    fs.writeJsonSync(BUILDINGS_FILE, { buildings: migratedBuildings });
    
    console.log(`成功迁移 ${migratedBuildings.length} 个建筑物数据！`);
  } catch (error) {
    console.error('迁移数据时出错:', error);
  }
}

// 执行迁移
migrateData(); 