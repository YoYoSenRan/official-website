# 官方网站

一个基于 Nuxt 4 构建的现代化企业官方网站，采用 Vue 3 + TypeScript + Tailwind CSS 技术栈。

## 🚀 技术栈

- **框架**: [Nuxt 4](https://nuxt.com/) - Vue.js 全栈框架
- **前端**: [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS 4](https://tailwindcss.com/) + [UnoCSS](https://unocss.dev/) + SCSS
- **UI 组件**: [@nuxt/ui](https://ui.nuxt.com/)
- **动画**: [AOS](https://michalsnik.github.io/aos/) + [GSAP](https://greensock.com/gsap/)
- **图标**: [Lucide Vue Next](https://lucide.dev/)
- **代码规范**: ESLint + Prettier
- **包管理**: pnpm

## 📁 项目结构

```
official-website/
├── app/
│   ├── components/          # 可复用组件
│   │   ├── Banner/          # 横幅组件
│   │   ├── Breadcrumb/      # 面包屑导航
│   │   ├── Footer/          # 页脚组件
│   │   ├── Header/          # 页头组件
│   │   └── NewsDetail/      # 新闻详情组件
│   ├── layouts/             # 布局模板
│   │   └── default.vue      # 默认布局
│   ├── pages/               # 页面路由
│   │   ├── index.vue        # 首页
│   │   ├── about.vue        # 关于我们
│   │   ├── gsgk/            # 公司概况
│   │   │   ├── dsj.vue      # 董事长致辞
│   │   │   └── gsjj.vue     # 公司简介
│   │   ├── news/            # 新闻中心
│   │   │   ├── company-news.vue     # 公司新闻
│   │   │   ├── industry-trends.vue  # 行业动态
│   │   │   └── media-focus.vue      # 媒体聚焦
│   │   └── party/           # 党建工作
│   │       ├── integrity-building.vue  # 廉政建设
│   │       ├── party-building.vue      # 党建工作
│   │       └── union-youth.vue         # 工会青年
│   ├── assets/              # 静态资源
│   │   ├── css/             # 样式文件
│   │   └── images/          # 图片资源
│   ├── composables/         # 组合式函数
│   │   └── useMenuData.ts   # 菜单数据管理
│   ├── store/               # 状态管理
│   └── utils/               # 工具函数
├── public/                  # 公共静态文件
├── nuxt.config.ts          # Nuxt 配置文件
├── package.json            # 项目依赖配置
├── tsconfig.json           # TypeScript 配置
├── uno.config.ts           # UnoCSS 配置
└── eslint.config.mjs       # ESLint 配置
```

## 🛠️ 开发环境设置

### 环境要求

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

> 💡 推荐使用 [nvm](https://github.com/nvm-sh/nvm) 或 [fnm](https://github.com/Schniz/fnm) 来管理 Node.js 版本

### 安装 pnpm

pnpm 是一个快速、高效的包管理器。以下是多种安装方式：

#### 方式一：使用 npm 安装（推荐）

```bash
# 全局安装 pnpm
npm install -g pnpm

# 验证安装
pnpm --version
```

#### 方式二：使用 Homebrew 安装（macOS）

```bash
brew install pnpm
```

#### 方式三：使用 curl 安装

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### 方式四：使用 PowerShell 安装（Windows）

```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

#### 方式五：使用 Corepack（Node.js 16.13+）

```bash
# 启用 Corepack
corepack enable

# 安装 pnpm
corepack prepare pnpm@latest --activate

# 验证安装
pnpm --version
```

### 安装项目依赖

#### 1. 克隆项目

```bash
# 使用 Git 克隆项目
git clone <repository-url>

# 进入项目目录
cd official-website
```

#### 2. 安装依赖包

```bash
# 安装所有依赖（推荐）
pnpm install

# 或者简写
pnpm i
```

> 📝 **说明**：
>
> - 首次安装可能需要几分钟时间，请耐心等待
> - 安装完成后会自动执行 `postinstall` 脚本进行 Nuxt 准备
> - 如果遇到网络问题，可以使用国内镜像源：
>   ```bash
>   # 设置淘宝镜像
>   pnpm config set registry https://registry.npmmirror.com
>   ```

#### 3. 验证安装

```bash
# 检查依赖是否安装成功
pnpm list --depth=0

# 查看项目信息
pnpm info nuxt
```

### 开发模式

#### 启动开发服务器

```bash
# 启动开发服务器（默认端口 3100）
pnpm dev

# 或者指定端口
pnpm dev --port 3000

# 启动并监听所有网络接口
pnpm dev --host
```

#### 访问应用

启动成功后，访问以下地址查看网站：

- **本地访问**: [http://localhost:3100](http://localhost:3100)
- **网络访问**: [http://0.0.0.0:3100](http://0.0.0.0:3100)（如果使用了 --host 参数）

> 💡 **开发提示**：
>
> - 修改代码后会自动热重载（HMR）
> - 可以在浏览器控制台查看详细的错误信息
> - 使用 `Ctrl + C` 停止开发服务器

### 构建生产版本

#### 1. 构建应用

```bash
# 构建生产版本
pnpm build
```

> 📝 **构建说明**：
>
> - 构建过程会执行代码压缩、优化等操作
> - 构建产物会输出到 `.output` 目录
> - 构建时间取决于项目大小，通常需要 1-3 分钟

#### 2. 预览生产版本

构建完成后，可以在本地预览生产版本：

```bash
# 预览生产构建
pnpm preview

# 指定端口预览
pnpm preview --port 3000
```

访问 [http://localhost:3000](http://localhost:3000) 查看预览效果。

#### 3. 生成静态站点（SSG）

如果需要生成静态站点用于静态托管：

```bash
# 生成静态站点
pnpm generate
```

> 📝 **说明**：
>
> - 静态站点会输出到 `dist` 目录
> - 所有页面都会被预渲染为静态 HTML
> - 适合部署到 GitHub Pages、Netlify、Vercel 等静态托管平台

### 部署指南

#### 部署方式一：使用 Node.js 服务器部署（SSR）

适用于需要服务端渲染的场景：

**1. 构建应用**

```bash
pnpm build
```

**2. 启动生产服务器**

```bash
# 方式一：使用 Node.js 直接运行
node .output/server/index.mjs

# 方式二：使用 PM2 管理进程（推荐生产环境）
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start .output/server/index.mjs --name official-website

# 查看状态
pm2 status

# 查看日志
pm2 logs official-website

# 设置开机自启
pm2 startup
pm2 save
```

**3. 配置反向代理（Nginx）**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**4. 配置 HTTPS（可选）**

```bash
# 使用 Certbot 获取 SSL 证书
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### 部署方式二：静态站点部署（SSG）

适用于静态内容为主的网站：

**1. 生成静态文件**

```bash
pnpm generate
```

**2. 部署到 GitHub Pages**

```bash
# 构建完成后，将 dist 目录内容推送到 gh-pages 分支
# 或使用 GitHub Actions 自动部署
```

**3. 部署到 Netlify**

```bash
# 方式一：通过 Netlify CLI
npm install -g netlify-cli
netlify deploy --dir=dist --prod

# 方式二：连接 GitHub 仓库，Netlify 会自动构建部署
```

**4. 部署到 Vercel**

```bash
# 方式一：通过 Vercel CLI
npm install -g vercel
vercel --prod

# 方式二：连接 GitHub 仓库，Vercel 会自动构建部署
```

**5. 部署到传统服务器**

```bash
# 将 dist 目录内容上传到服务器
scp -r dist/* user@server:/var/www/html/

# 或使用 rsync
rsync -avz dist/ user@server:/var/www/html/
```

#### 部署方式三：Docker 部署（推荐）

**1. 创建 Dockerfile**

```dockerfile
# 使用官方 Node.js 镜像
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 生产环境镜像
FROM node:18-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖和构建产物
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", ".output/server/index.mjs"]
```

**2. 构建和运行 Docker 镜像**

```bash
# 构建镜像
docker build -t official-website .

# 运行容器
docker run -d -p 3000:3000 --name official-website official-website

# 查看运行状态
docker ps

# 查看日志
docker logs official-website
```

**3. 使用 Docker Compose（推荐）**

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

运行：

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 部署前检查清单

- [ ] 确认环境变量已正确配置
- [ ] 确认 API 接口地址已更新为生产环境
- [ ] 确认图片资源路径正确
- [ ] 确认 SEO 配置（meta 标签、sitemap 等）
- [ ] 确认 CDN 配置（如使用）
- [ ] 确认域名和 SSL 证书配置
- [ ] 确认服务器资源充足（内存、CPU）
- [ ] 配置日志和监控
- [ ] 设置备份策略

#### 性能优化建议

1. **启用缓存**：配置浏览器缓存和 CDN 缓存
2. **压缩资源**：启用 Gzip 或 Brotli 压缩
3. **图片优化**：使用 WebP 格式，配置图片 CDN
4. **代码分割**：确保路由级别的代码分割生效
5. **监控性能**：使用 Google Analytics 或 Sentry 监控性能

## 📝 代码规范

### 格式化代码

```bash
# 格式化所有文件
pnpm format

# 检查代码格式
pnpm format:check
```

### 代码检查

```bash
# 运行 ESLint
pnpm lint

# 自动修复 ESLint 问题
pnpm lint:fix
```

## ✨ 主要功能

- 🏠 **首页**: 展示安全生产无事故天数计数器
- 📋 **公司概况**: 包含董事长致辞和公司简介
- 📰 **新闻中心**: 公司新闻、行业动态、媒体聚焦
- 🏛️ **党建工作**: 党建工作、廉政建设、工会青年
- 📱 **响应式设计**: 适配各种设备屏幕
- 🎨 **现代化UI**: 使用 Tailwind CSS 和 Nuxt UI 组件
- ⚡ **性能优化**: 基于 Nuxt 4 的服务端渲染和静态生成
- 🎭 **动画效果**: AOS 滚动动画和 GSAP 交互动画

## 🔧 配置说明

### Nuxt 配置

项目使用 Nuxt 4 的最新特性，包括：

- 自动导入组件和组合式函数
- 服务端渲染 (SSR)
- 静态站点生成 (SSG)
- 图片优化
- SEO 优化

### 样式配置

- **Tailwind CSS 4**: 现代化的原子化 CSS 框架
- **UnoCSS**: 即时按需的原子化 CSS 引擎
- **SCSS**: 支持变量和混入
- **响应式设计**: 移动端优先的设计理念

### 动画配置

- **AOS**: 滚动触发动画，配置了全局设置
- **GSAP**: 高性能的 JavaScript 动画库
