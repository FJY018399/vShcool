const fs = require('fs-extra');
const path = require('path');

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data');
const BUILDINGS_FILE = path.join(DATA_DIR, 'buildings.json');

// 确保数据目录存在
fs.ensureDirSync(DATA_DIR);

// 类型转换函数
function convertToLowerCaseTypes() {
  try {
    // 读取数据文件
    console.log('读取建筑物数据文件...');
    const data = fs.readJsonSync(BUILDINGS_FILE);
    
    if (!data.buildings || !Array.isArray(data.buildings)) {
      console.log('没有找到建筑物数据或数据格式不正确');
      return false;
    }
    
    let conversionNeeded = false;
    
    // 转换每个建筑物类型为小写
    const convertedBuildings = data.buildings.map(building => {
      // 检查类型是否是大写
      if (building.type && building.type.toUpperCase() === building.type) {
        conversionNeeded = true;
        console.log(`转换类型: ${building.type} -> ${building.type.toLowerCase()}`);
        return {
          ...building,
          type: building.type.toLowerCase()
        };
      }
      return building;
    });
    
    if (!conversionNeeded) {
      console.log('所有建筑物类型已经是小写格式，无需转换');
      return false;
    }
    
    // 备份原始数据
    const backupFile = `${BUILDINGS_FILE}.backup-${Date.now()}`;
    fs.copySync(BUILDINGS_FILE, backupFile);
    console.log(`原始数据已备份至 ${backupFile}`);
    
    // 保存更新后的数据
    fs.writeJsonSync(BUILDINGS_FILE, { buildings: convertedBuildings }, { spaces: 2 });
    console.log(`成功转换 ${convertedBuildings.length} 个建筑物的类型格式为小写！`);
    return true;
  } catch (error) {
    console.error('转换建筑物类型时出错:', error);
    return false;
  }
}

// 执行转换
convertToLowerCaseTypes(); 