const fs = require('fs-extra');
const path = require('path');

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data');
const BUILDINGS_FILE = path.join(DATA_DIR, 'buildings.json');

// 确保数据目录存在
fs.ensureDirSync(DATA_DIR);

// 检查值是否为十六进制颜色字符串
function isHexColorString(value) {
  return typeof value === 'string' && value.startsWith('0x');
}

// 将十六进制颜色字符串转换为数字
function convertColorStringToNumber(hexString) {
  if (!hexString || typeof hexString !== 'string') return hexString;
  if (hexString.startsWith('0x')) {
    return parseInt(hexString, 16);
  }
  return hexString;
}

// 递归转换对象中的所有颜色值
function convertObjectColors(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const result = Array.isArray(obj) ? [] : {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (typeof value === 'object' && value !== null) {
        // 递归处理嵌套对象
        result[key] = convertObjectColors(value);
      } else if (isHexColorString(value)) {
        // 转换颜色字符串
        result[key] = convertColorStringToNumber(value);
        console.log(`转换颜色: ${value} -> ${result[key]}`);
      } else {
        // 保持原值不变
        result[key] = value;
      }
    }
  }
  
  return result;
}

// 转换建筑物数据中的颜色值
function convertBuildingColors() {
  try {
    // 读取数据文件
    console.log('读取建筑物数据文件...');
    const data = fs.readJsonSync(BUILDINGS_FILE);
    
    if (!data.buildings || !Array.isArray(data.buildings)) {
      console.log('没有找到建筑物数据或数据格式不正确');
      return false;
    }
    
    // 转换每个建筑物的颜色值
    const convertedBuildings = data.buildings.map(building => {
      console.log(`处理建筑物: ${building.name} (ID: ${building.id})`);
      
      // 转换options中的颜色值
      if (building.options) {
        building.options = convertObjectColors(building.options);
      }
      
      return building;
    });
    
    // 备份原始数据
    const backupFile = `${BUILDINGS_FILE}.color-backup-${Date.now()}`;
    fs.copySync(BUILDINGS_FILE, backupFile);
    console.log(`原始数据已备份至 ${backupFile}`);
    
    // 保存更新后的数据
    fs.writeJsonSync(BUILDINGS_FILE, { buildings: convertedBuildings }, { spaces: 2 });
    console.log(`成功转换 ${convertedBuildings.length} 个建筑物的颜色格式！`);
    return true;
  } catch (error) {
    console.error('转换建筑物颜色时出错:', error);
    return false;
  }
}

// 执行转换
convertBuildingColors(); 