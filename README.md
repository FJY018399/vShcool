# vShcool 3D场景查看器

这是一个基于Vue 3和Three.js的3D场景查看器应用，允许用户查看虚拟校园3D场景。

## 项目概述

vShcool是一个轻量级的3D场景查看器，专为教育和展示目的设计。它使用Three.js渲染3D场景，并通过Vue 3提供响应式的用户界面。

### 主要功能

- 加载和查看预设的3D场景
- 支持多种3D对象类型（房屋、树木、建筑物、教学楼、实验室、体育馆等）
- 高性能的3D渲染
- 鼠标拖拽移动摄像机
- 滚轮滚动调整视图高度（俯角自动调整）
- 场景选择切换功能
- 对象选择与信息显示功能
- **新增**: 后台管理系统，可配置建筑物信息
- **新增**: 支持跨域资源共享(CORS)，前端可从不同域名访问后台API

## 后台管理系统

在admin目录下添加了一个前后端不分离的后台管理系统，用于管理地图中的建筑物。

### 功能

- 添加、编辑、删除建筑物
- 设置建筑物的位置、旋转和缩放
- 提供API接口供前端获取建筑物数据
- 支持跨域资源共享(CORS)，允许从不同域名访问API

### 技术栈

- **Express.js**: Web应用框架
- **EJS**: 模板引擎
- **本地文件存储**: 使用JSON文件存储建筑物数据
- **CORS**: 跨域资源共享支持

### 启动方式

```bash
# 进入后台管理系统目录
cd admin

# 安装依赖
npm install

# 启动服务器
npm start
```

访问 http://localhost:3000 使用管理系统

### API

- **GET /api/buildings**: 获取所有建筑物数据

### 跨域配置

后台API已配置CORS支持，默认允许所有域名访问。如需修改CORS配置，请编辑admin/app.js文件中的以下部分：

```javascript
// 配置CORS
app.use(cors({
  origin: '*', // 允许所有来源访问，生产环境中应该设置为特定域名，如 'http://example.com'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

在生产环境中，建议将origin设置为特定域名，以提高安全性。

## 前端与后台系统集成

前端可以通过发送HTTP请求获取后台系统中配置的建筑物数据：

```javascript
// 获取建筑物数据示例
async function fetchBuildingsData() {
  try {
    const response = await fetch('/api/buildings');
    const data = await response.json();
    return data.buildings;
  } catch (error) {
    console.error('获取建筑物数据失败:', error);
    return [];
  }
}
```

### 类型格式说明

后台管理系统和前端应用程序现在使用相同的类型格式：建筑物类型使用小写字符串（如 `'house'`、`'tree'` 等）。这确保了前后端代码的一致性，无需额外的类型转换。

### 颜色格式说明

建筑物数据中的颜色值现在统一使用数字格式，而不是十六进制字符串格式。例如，使用 `15657130` 而不是 `"0xEEE8AA"`。这确保了前后端数据格式的一致性，并简化了三维渲染过程。

颜色数据处理：
- 后台保存时：自动将十六进制字符串颜色值转换为数字格式
- 数据迁移：已提供 `colorConverter.js` 脚本将已有数据中的颜色字符串转换为数字格式
- 前端处理：提供了兼容性处理，确保任何可能的字符串颜色值被正确转换为数字

运行颜色转换脚本：
```bash
# 在admin目录下
npm run convert-colors
```

## 项目结构

```
vShcool/
├── admin/                 # 后台管理系统
│   ├── app.js             # Express应用主文件
│   ├── data/              # 数据存储
│   ├── public/            # 静态资源
│   └── views/             # 视图模板
├── src/                   # 前端源代码
└── public/                # 前端静态资源
```

## 启动前端项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 核心模块说明

### 1. 场景管理 (useThreeScene.js)

`useThreeScene.js` 是一个Vue组合式API，负责初始化和管理Three.js场景。它提供以下功能：

- 初始化Three.js场景、相机和渲染器
- 设置光照和地面
- 添加和移除3D对象
- 处理窗口大小调整
- 管理动画循环
- 自定义相机控制（移动和高度调整）
- 对象选择功能（射线投射）

```javascript
// 使用示例
const { addObjectToScene, removeObjectFromScene, resetCamera, setupObjectSelection } = useThreeScene(containerRef)
```

### 2. 对象工厂 (objectFactory.js)

`objectFactory.js` 负责创建各种3D对象。它提供以下功能：

- 创建不同类型的3D对象（房屋、树木、建筑物、教学楼、实验室、体育馆等）
- 自定义对象属性（颜色、尺寸等）
- 添加细节和纹理

```javascript
// 使用示例
const house = await objectFactory.createObject(OBJECT_TYPES.HOUSE, { color: 0xffffff })
```

#### 对象类型

应用支持以下对象类型：

- **房屋 (HOUSE)**: 简单的住宅建筑，带有屋顶、窗户和门
- **树木 (TREE)**: 多层次的树木，带有树干和树叶
- **建筑物 (BUILDING)**: 高层建筑，带有多层窗户和细节
- **教学楼 (CLASSROOM)**: 学校教学楼，带有多层教室和特殊入口
- **实验室 (LABORATORY)**: 科学实验室，带有现代风格设计和特殊屋顶
- **体育馆 (GYMNASIUM)**: 拱形体育馆，带有特殊的半圆柱形结构

### 3. 状态管理 (sceneStore.js)

`sceneStore.js` 使用Pinia管理应用状态。它存储以下信息：

- 场景中的所有对象
- 当前选中的对象
- 相机设置
- 地图设置

```javascript
// 使用示例
const sceneStore = useSceneStore()
sceneStore.addObject(objectData)
sceneStore.selectObject(objectId)
```

### 4. 场景查看器 (MapViewer.vue)

`MapViewer.vue` 是主要的用户界面组件，它提供以下功能：

- 显示3D场景
- 加载不同的预设场景
- 显示选中对象的信息面板

## 预设场景

应用包含以下预设场景：

- **默认场景**: 简单的测试场景，包含一个房屋、一棵树和一栋建筑物
- **城市场景**: 模拟城市环境，包含多个高层建筑
- **乡村场景**: 模拟乡村环境，包含农舍、谷仓和树木
- **公园场景**: 模拟公园环境，包含多种树木和一个凉亭
- **学校场景**: 模拟学校环境，包含教学楼、实验室、体育馆和其他校园建筑

## 使用指南

### 场景选择

在顶部选择框中选择不同的场景进行加载和查看。

### 场景导航

- **鼠标拖拽**: 在场景中按住鼠标左键并拖拽可以移动摄像机，拖拽方向与移动方向相反（类似于"拖拽"场景）
- **滚轮滚动**: 使用鼠标滚轮可以调整视图高度，相机俯角会根据高度自动调整，提供更自然的视角
- **点击选择**: 点击场景中的建筑物或对象可以选择它们，右下角会显示所选对象的信息

### 信息面板

右下角的信息面板会显示当前选中对象的以下信息：

- 对象名称
- 对象描述
- 对象类型

## 相机控制系统

本项目实现了自定义的相机控制系统，具有以下特点：

1. **高度与俯角联动**: 当调整相机高度时，俯角会自动调整，保持视觉上的一致性
   - 低高度时使用较小的俯角，提供更接近地面的视角
   - 高高度时使用较大的俯角，提供更俯视的视角

2. **直观的摄像机移动**: 使用鼠标拖拽可以移动摄像机，采用"拖拽场景"的交互模式
   - 向左/右拖动鼠标会使摄像机向右/左移动
   - 向上/下拖动鼠标会使摄像机向后/前移动

3. **平滑过渡**: 所有相机移动都有平滑过渡效果，提供更好的用户体验

## 对象选择系统

本项目实现了对象选择系统，具有以下特点：

1. **射线投射选择**: 使用Three.js的射线投射功能，精确检测用户点击的对象
2. **对象层次结构遍历**: 自动向上遍历对象层次结构，找到包含ID的父对象
3. **状态管理集成**: 与Pinia状态管理系统集成，保持UI与选择状态的同步

## 性能优化

为了提高性能，本项目采用了以下优化措施：

1. 使用原生JavaScript对象而非Vue响应式对象存储Three.js对象，避免代理问题
2. 优化渲染循环，减少不必要的更新
3. 使用适当的光照和阴影设置，平衡视觉效果和性能
4. 实现对象池和延迟加载，减少内存使用

## 故障排除

### 常见问题

1. **场景无法加载**
   - 检查控制台是否有错误信息
   - 确保所有资源文件（纹理等）可用

2. **渲染性能问题**
   - 减少场景中的对象数量
   - 降低阴影质量
   - 检查浏览器是否支持WebGL

3. **对象选择不工作**
   - 确保对象具有唯一ID
   - 检查对象层次结构是否正确
   - 确认射线投射设置正确

4. **对象显示异常**
   - 检查对象的位置、旋转和缩放值
   - 确保材质和纹理正确加载

## 未来计划

- 添加更多类型的3D对象
- 优化渲染性能
- 支持更多场景类型
- 添加交互式编辑功能
- 实现场景保存和加载功能
- 增强对象选择和信息展示

## 贡献指南

欢迎贡献代码、报告问题或提出建议。请遵循以下步骤：

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

本项目采用MIT许可证。详见LICENSE文件。