# ShopEase 电子商务网站

一个现代化的电子商务网站前端实现，基于React 18、TypeScript和Tailwind CSS构建。

## 功能特点

- 响应式设计，适配各种设备尺寸
- 完整的购物流程：浏览商品、加入购物车、结账
- 多语言支持
- 深色/浅色主题切换
- 商品管理和订单管理功能
- 本地存储数据持久化

## 本地开发

### 环境要求

- Node.js 16.x 或更高版本
- npm 或 pnpm 包管理器

### 安装步骤

1. 克隆仓库
```bash
git clone <repository-url>
cd shopease
```

2. 安装依赖
```bash
npm install
# 或
pnpm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 在浏览器中访问 http://localhost:3000

## 构建与部署

### 构建项目

```bash
npm run build
```

构建完成后，静态文件将生成在`dist`目录中。

### 本地测试构建结果

**不建议直接双击打开dist/index.html文件**，而是使用本地服务器:

```bash
# 使用Vite预览
npm run preview

# 或使用serve静态服务器
npm install -g serve
serve -s dist
```

### 部署选项

- [使用Vercel部署](DEPLOYMENT.md#使用vercel部署)
- [使用腾讯云静态网站托管部署](DEPLOYMENT.md#使用腾讯云静态网站托管部署)

## 项目结构

- `src/components` - 可复用UI组件
- `src/contexts` - React上下文（状态管理）
- `src/hooks` - 自定义React钩子
- `src/lib` - 工具函数和模拟数据
- `src/pages` - 页面组件
- `src/index.css` - 全局样式