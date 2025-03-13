# vShcool 3D场景查看器

这是一个基于Vue 3和Three.js的3D场景查看器应用，允许用户查看3D场景。

## 项目概述

vShcool是一个轻量级的3D场景查看器，专为教育和展示目的设计。它使用Three.js渲染3D场景，并通过Vue 3提供响应式的用户界面。

### 主要功能

- 加载和查看预设的3D场景
- 支持多种3D对象类型（房屋、树木、建筑物等）
- 高性能的3D渲染
- 鼠标拖拽移动摄像机
- 滚轮滚动调整视图高度（俯角自动调整）

## 技术架构

### 前端框架

- **Vue 3**: 使用组合式API构建响应式用户界面
- **Pinia**: 状态管理库，用于管理应用状态
- **Three.js**: 3D图形库，用于渲染3D场景

### 项目结构

```
vShcool/
├── src/
│   ├── components/         # Vue组件
│   │   └── Viewer/         # 场景查看器组件
│   ├── composables/        # Vue组合式API
│   │   └── useThreeScene.js # Three.js场景管理
│   ├── stores/             # Pinia状态管理
│   │   └── sceneStore.js   # 场景状态管理
│   ├── utils/              # 工具函数
│   │   └── objectFactory.js # 3D对象工厂
│   ├── App.vue             # 主应用组件
│   └── main.js             # 应用入口
└── public/                 # 静态资源
    └── textures/           # 纹理资源
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

```javascript
// 使用示例
const { addObjectToScene, removeObjectFromScene, resetCamera } = useThreeScene(containerRef)
```

### 2. 对象工厂 (objectFactory.js)

`objectFactory.js` 负责创建各种3D对象。它提供以下功能：

- 创建不同类型的3D对象（房屋、树木、建筑物等）
- 自定义对象属性（颜色、尺寸等）
- 添加细节和纹理

```javascript
// 使用示例
const house = await objectFactory.createObject(OBJECT_TYPES.HOUSE, { color: 0xffffff })
```

### 3. 状态管理 (sceneStore.js)

`sceneStore.js` 使用Pinia管理应用状态。它存储以下信息：

- 场景中的所有对象
- 相机设置
- 地图设置

```javascript
// 使用示例
const sceneStore = useSceneStore()
sceneStore.addObject(objectData)
```

### 4. 场景查看器 (MapViewer.vue)

`MapViewer.vue` 是主要的用户界面组件，它提供以下功能：

- 显示3D场景
- 自动加载默认场景

## 使用指南

### 场景导航

- **鼠标拖拽**: 在场景中按住鼠标左键并拖拽可以移动摄像机，拖拽方向与移动方向相反（类似于"拖拽"场景）
- **滚轮滚动**: 使用鼠标滚轮可以调整视图高度，相机俯角会根据高度自动调整，提供更自然的视角

## 相机控制系统

本项目实现了自定义的相机控制系统，具有以下特点：

1. **高度与俯角联动**: 当调整相机高度时，俯角会自动调整，保持视觉上的一致性
   - 低高度时使用较小的俯角，提供更接近地面的视角
   - 高高度时使用较大的俯角，提供更俯视的视角

2. **直观的摄像机移动**: 使用鼠标拖拽可以移动摄像机，采用"拖拽场景"的交互模式
   - 向左/右拖动鼠标会使摄像机向右/左移动
   - 向上/下拖动鼠标会使摄像机向后/前移动

3. **平滑过渡**: 所有相机移动都有平滑过渡效果，提供更好的用户体验

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

3. **对象显示异常**
   - 检查对象的位置、旋转和缩放值
   - 确保材质和纹理正确加载

## 未来计划

- 添加更多类型的3D对象
- 优化渲染性能
- 支持更多场景类型

## 贡献指南

欢迎贡献代码、报告问题或提出建议。请遵循以下步骤：

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

本项目采用MIT许可证。详见LICENSE文件。