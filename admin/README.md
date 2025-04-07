# 虚拟校园管理系统

这是一个用于管理vShcool虚拟校园项目中建筑物的后台管理系统。该系统使用Express.js构建，采用前后端不分离的架构，并使用本地文件进行数据存储。

## 功能

- 建筑物管理（添加、编辑、删除）
- 提供API接口用于前端获取建筑物数据
- 使用本地JSON文件存储数据
- 支持跨域资源共享(CORS)，允许不同域名的前端应用访问API

## 技术栈

- **Express.js**: Web应用框架
- **EJS**: 模板引擎
- **Bootstrap 5**: 前端UI框架
- **fs-extra**: 增强的文件系统操作
- **cors**: 跨域资源共享中间件

## 安装与运行

1. 安装依赖

```bash
npm install
```

2. 启动服务器

```bash
npm start
```

或者使用开发模式（自动重启）：

```bash
npm run dev
```

3. 访问应用

打开浏览器，访问 http://localhost:3000

## API端点

- **GET /api/buildings**: 获取所有建筑物数据

## 跨域资源共享(CORS)

该系统已配置CORS支持，允许来自不同源的前端应用访问API。默认配置允许所有源访问API。

### CORS配置

CORS配置位于`app.js`文件中：

```javascript
// 配置CORS
app.use(cors({
  origin: '*', // 允许所有来源访问
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 自定义CORS配置

为提高安全性，在生产环境中建议将`origin`设置为特定域名：

```javascript
// 配置CORS - 生产环境示例
app.use(cors({
  origin: 'https://你的前端域名.com', // 只允许特定域名访问
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // 如需支持跨域Cookie
}));
```

## 数据结构

建筑物数据结构示例：

```json
{
  "id": "1617282115000",
  "name": "教学楼A",
  "type": "classroom",
  "description": "主教学楼，设有多间标准教室",
  "position": {
    "x": 10,
    "y": 0,
    "z": 15
  },
  "rotation": {
    "x": 0,
    "y": 45,
    "z": 0
  },
  "scale": {
    "x": 1.2,
    "y": 1.2,
    "z": 1.2
  },
  "options": {
    "color": 0xEEE8AA
  },
  "created": "2023-04-01T10:15:15.000Z"
}
```

### 数据字段说明

- **id**: 唯一标识符
- **name**: 建筑物名称
- **type**: 建筑物类型，可选值包括：
  - `house`: 住宅建筑
  - `tree`: 树木
  - `building`: 普通建筑
  - `classroom`: 教学楼
  - `laboratory`: 实验室
  - `gymnasium`: 体育馆
  - `playground`: 操场
- **description**: 建筑物描述
- **position**: 三维坐标位置 (x, y, z)
- **rotation**: 三维旋转角度，目前只使用y值（绕Y轴旋转）
- **scale**: 三维缩放比例，三个值保持一致（整体缩放）
- **options**: 建筑物外观选项，根据类型自动设置
- **created/updated**: 创建/更新时间

### 类型格式迁移

注意：本系统最近进行了类型格式更新，将所有建筑物类型从大写格式（例如 `"HOUSE"`）改为小写格式（例如 `"house"`），以与前端代码保持一致。

如果您有旧数据需要转换，可以使用以下命令：

```bash
npm run convert-types
```

此命令会将所有现有建筑物类型转换为小写格式，并且在转换前会自动备份原始数据。

## 与前端集成

您可以通过以下步骤将管理系统与前端的地图系统集成：

1. 在前端应用中，通过API获取建筑物数据：

```javascript
fetch('http://localhost:3000/api/buildings')
  .then(response => response.json())
  .then(data => {
    // 处理获取到的建筑物数据
    const buildings = data.buildings;
    // 将数据传递给地图渲染系统
  });
```

注意：由于启用了CORS，您可以从不同域名的前端应用访问此API。

2. 根据建筑物类型和位置信息在Three.js场景中创建相应的3D对象

### 类型格式转换

注意：后台管理系统返回的建筑物类型是大写字符串格式（例如 `"HOUSE"`），而前端Three.js实现通常使用小写字符串格式（例如 `"house"`）。在集成时，您需要进行类型转换：

```javascript
// 类型转换函数
function convertBuildingType(type) {
  const typeMapping = {
    'HOUSE': 'house',
    'TREE': 'tree',
    'BUILDING': 'building',
    'CLASSROOM': 'classroom',
    'LABORATORY': 'laboratory',
    'GYMNASIUM': 'gymnasium',
    'PLAYGROUND': 'playground'
  }
  
  return typeMapping[type] || type
}

// 转换应用示例
const buildings = data.buildings.map(building => ({
  ...building,
  type: convertBuildingType(building.type)
}));
```

## 建筑物类型默认样式

每种建筑类型都有预设的默认样式：

- **HOUSE**: 住宅建筑，白色墙壁，红色屋顶
- **TREE**: 树木，棕色树干，绿色树叶
- **BUILDING**: 普通建筑，浅灰色
- **CLASSROOM**: 教学楼，淡黄色
- **LABORATORY**: 实验室，白色
- **GYMNASIUM**: 体育馆，棕褐色
- **PLAYGROUND**: 操场，标准尺寸

## 文件结构

```
admin/
├── app.js                 # 主应用文件
├── package.json           # 项目信息和依赖
├── data/                  # 数据文件目录
│   └── buildings.json     # 建筑物数据
├── public/                # 静态资源
│   ├── css/               # CSS样式文件
│   └── js/                # JavaScript文件
└── views/                 # 视图模板
    ├── layout.ejs         # 布局模板
    ├── index.ejs          # 首页
    ├── building-form.ejs  # 建筑物表单
    └── error.ejs          # 错误页面
``` 