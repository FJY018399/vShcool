const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data');
const BUILDINGS_FILE = path.join(DATA_DIR, 'buildings.json');

// 确保数据目录存在
fs.ensureDirSync(DATA_DIR);
// 确保建筑物数据文件存在
if (!fs.existsSync(BUILDINGS_FILE)) {
  fs.writeJsonSync(BUILDINGS_FILE, { buildings: [] });
}

// 获取类型的默认选项
function getDefaultOptions(type) {
  const defaults = {
    'house': { color: 0xffffff, roofColor: 0xff0000 },
    'tree': { trunkColor: 0x8B4513, leavesColor: 0x00AA00 },
    'building': { color: 0xAAAAAA },
    'classroom': { color: 0xEEE8AA },
    'laboratory': { color: 0xF5F5F5 },
    'gymnasium': { color: 0xD2B48C },
    'playground': { width: 80, length: 120 }
  };
  
  return defaults[type] || {};
}

// 将颜色字符串转换为数字格式 (0xFFFFFF => 16777215)
function convertColorValuesToNumbers(options) {
  if (!options) return options;
  
  const convertedOptions = { ...options };
  
  // 处理各种options属性
  if (typeof convertedOptions.color === 'string' && convertedOptions.color.startsWith('0x')) {
    convertedOptions.color = parseInt(convertedOptions.color, 16);
  }
  
  if (typeof convertedOptions.roofColor === 'string' && convertedOptions.roofColor.startsWith('0x')) {
    convertedOptions.roofColor = parseInt(convertedOptions.roofColor, 16);
  }
  
  if (typeof convertedOptions.trunkColor === 'string' && convertedOptions.trunkColor.startsWith('0x')) {
    convertedOptions.trunkColor = parseInt(convertedOptions.trunkColor, 16);
  }
  
  if (typeof convertedOptions.leavesColor === 'string' && convertedOptions.leavesColor.startsWith('0x')) {
    convertedOptions.leavesColor = parseInt(convertedOptions.leavesColor, 16);
  }
  
  return convertedOptions;
}

// 迁移数据到新格式
function migrateData() {
  try {
    // 读取数据文件
    const data = fs.readJsonSync(BUILDINGS_FILE);
    
    if (!data.buildings || !Array.isArray(data.buildings)) {
      return { buildings: [] };
    }
    
    let needsMigration = false;
    
    // 转换每个建筑物数据
    const migratedBuildings = data.buildings.map(building => {
      let needsMigrationForThisBuilding = false;
      let updatedBuilding = {...building};
      
      // 检查并转换类型（大写转小写）
      if (building.type && building.type.toUpperCase() === building.type) {
        updatedBuilding.type = building.type.toLowerCase();
        needsMigrationForThisBuilding = true;
        needsMigration = true;
      }
      
      // 如果已经是新格式（有rotation和scale对象以及options），不需要转换结构
      if (
        building.rotation && typeof building.rotation === 'object' && 
        building.scale && typeof building.scale === 'object' &&
        building.options
      ) {
        return needsMigrationForThisBuilding ? updatedBuilding : building;
      }
      
      needsMigration = true;
      
      // 转换旋转值
      const rotation = typeof building.rotation === 'number'
        ? { x: 0, y: building.rotation, z: 0 }
        : { x: 0, y: 0, z: 0 };
      
      // 转换缩放值
      const scale = typeof building.scale === 'number'
        ? { x: building.scale, y: building.scale, z: building.scale }
        : { x: 1, y: 1, z: 1 };
      
      // 添加options
      const options = getDefaultOptions(updatedBuilding.type);
      
      return {
        ...updatedBuilding,
        rotation,
        scale,
        options
      };
    });
    
    // 只有在需要迁移时才保存
    if (needsMigration) {
      console.log('正在迁移建筑物数据到新格式...');
      fs.writeJsonSync(BUILDINGS_FILE, { buildings: migratedBuildings });
      console.log(`成功迁移 ${migratedBuildings.length} 个建筑物数据！`);
    }
    
    return { buildings: migratedBuildings };
  } catch (error) {
    console.error('迁移数据时出错:', error);
    return { buildings: [] };
  }
}

// 在启动时迁移数据
const initialData = migrateData();

// 设置视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// 中间件
app.use(morgan('dev')); // 日志
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// 配置CORS
app.use(cors({
  origin: '*', // 允许所有来源访问，生产环境中应该设置为特定域名
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// 手动处理OPTIONS请求
app.options('*', cors());

// 辅助函数：读取建筑物数据
function getBuildingsData() {
  return fs.readJsonSync(BUILDINGS_FILE);
}

// 辅助函数：保存建筑物数据
function saveBuildingsData(data) {
  return fs.writeJsonSync(BUILDINGS_FILE, data);
}

// 路由 - 首页
app.get('/', (req, res) => {
  res.render('index', { 
    title: '虚拟校园管理系统',
    buildings: getBuildingsData().buildings
  });
});

// 路由 - 添加建筑物表单页面
app.get('/buildings/add', (req, res) => {
  res.render('building-form', { 
    title: '添加建筑物',
    building: null,
    isEdit: false
  });
});

// 路由 - 编辑建筑物表单页面
app.get('/buildings/edit/:id', (req, res) => {
  const buildingId = req.params.id;
  const data = getBuildingsData();
  const building = data.buildings.find(b => b.id === buildingId);
  
  if (!building) {
    return res.status(404).render('error', { 
      title: '错误',
      message: '未找到该建筑物' 
    });
  }
  
  res.render('building-form', { 
    title: '编辑建筑物',
    building,
    isEdit: true
  });
});

// 路由 - 保存新建筑物
app.post('/buildings', (req, res) => {
  const data = getBuildingsData();
  const scaleValue = parseFloat(req.body.scale);
  const rotationValue = parseFloat(req.body.rotation);
  
  // 获取默认选项并转换颜色值为数字格式
  const options = convertColorValuesToNumbers(getDefaultOptions(req.body.type));
  
  const newBuilding = {
    id: Date.now().toString(),
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
    position: {
      x: parseFloat(req.body.positionX),
      y: parseFloat(req.body.positionY),
      z: parseFloat(req.body.positionZ)
    },
    rotation: {
      x: 0,
      y: rotationValue,
      z: 0
    },
    scale: {
      x: scaleValue,
      y: scaleValue,
      z: scaleValue
    },
    options: options,
    created: new Date().toISOString()
  };
  
  data.buildings.push(newBuilding);
  saveBuildingsData(data);
  
  res.redirect('/');
});

// 路由 - 更新建筑物
app.post('/buildings/:id', (req, res) => {
  const buildingId = req.params.id;
  const data = getBuildingsData();
  const buildingIndex = data.buildings.findIndex(b => b.id === buildingId);
  
  if (buildingIndex === -1) {
    return res.status(404).render('error', { 
      title: '错误',
      message: '未找到该建筑物' 
    });
  }
  
  const scaleValue = parseFloat(req.body.scale);
  const rotationValue = parseFloat(req.body.rotation);
  const oldType = data.buildings[buildingIndex].type;
  const newType = req.body.type;
  
  // 保留旧的选项，如果类型变化则使用新类型的默认选项
  const options = oldType === newType && data.buildings[buildingIndex].options
    ? data.buildings[buildingIndex].options
    : convertColorValuesToNumbers(getDefaultOptions(newType));
  
  data.buildings[buildingIndex] = {
    ...data.buildings[buildingIndex],
    name: req.body.name,
    type: newType,
    description: req.body.description,
    position: {
      x: parseFloat(req.body.positionX),
      y: parseFloat(req.body.positionY),
      z: parseFloat(req.body.positionZ)
    },
    rotation: {
      x: 0, 
      y: rotationValue,
      z: 0
    },
    scale: {
      x: scaleValue,
      y: scaleValue,
      z: scaleValue
    },
    options: options,
    updated: new Date().toISOString()
  };
  
  saveBuildingsData(data);
  
  res.redirect('/');
});

// 路由 - 删除建筑物
app.post('/buildings/delete/:id', (req, res) => {
  const buildingId = req.params.id;
  const data = getBuildingsData();
  
  data.buildings = data.buildings.filter(b => b.id !== buildingId);
  saveBuildingsData(data);
  
  res.redirect('/');
});

// 路由 - API获取所有建筑物数据
app.get('/api/buildings', (req, res) => {
  res.json(getBuildingsData());
});

// 错误处理
app.use((req, res) => {
  res.status(404).render('error', { 
    title: '404 - 页面未找到',
    message: '您请求的页面不存在' 
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 