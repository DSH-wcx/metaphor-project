# 隐喻之镜 ——多模态隐喻理解与生成系统

一个基于Deepseek的 NLP 项目，专注于隐喻的检测、解释、生成和跨文化映射。

## 功能特性

### 🔍 隐喻检测
- 自动识别文本中的隐喻表达
- 分类隐喻类型（概念隐喻、新奇隐喻、死隐喻、拟人、通感等）
- 分析源域→目标域的映射关系
- 提供创意程度评分

### 💡 隐喻解释
- 将复杂隐喻转化为通俗解释
- 展示认知映射关系
- 提供适用场景和例句
- 列出类似表达供参考

### ✨ 隐喻生成
- 根据抽象概念创造新隐喻
- 支持多种风格（诗意、哲理、幽默、文学、广告）
- 生成从常规到突破性的创意表达
- 推荐最佳选择并给出写作建议

### 🌏 跨文化映射
- 支持中、英、日、法、西等语言文化
- 分析文化世界观差异
- 提供文化对等表达及相似度评分
- 给出使用注意事项

## 快速开始

### 前置要求
- Node.js 18+
- Deepseek API Key（从 [DeepSeek 开放平台](https://platform.deepseek.com/usage) 获取）

### 安装步骤

```bash
# 1. 进入项目目录
cd metaphor-project

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录中。

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite 5
- **AI 服务**: Deepseek API
- **样式**: CSS-in-JS

## 使用说明

1. 首次使用需要输入 Deepseek API Key
2. API Key 仅存储在浏览器内存中，刷新页面后需重新输入
3. 选择功能模块，输入文本，点击分析按钮即可

## 项目结构

```
metaphor-project/
├── index.html          # HTML 入口
├── package.json        # 项目配置
├── vite.config.js      # Vite 配置
├── README.md           # 项目说明
└── src/
    ├── main.jsx        # React 入口
    └── MetaphorSystem.jsx  # 主组件
```
