# Cloud Ladder Web

Cloud Ladder 平台的前端应用，提供用户友好的营销内容管理界面。

## 功能特性

- **用户系统** - 登录、注册页面
- **Dashboard** - 数据概览与快捷操作
- **账号管理** - 管理已绑定的社交平台账号
- **任务管理** - 创建、编辑、查看发布任务

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI 组件**: shadcn/ui + Radix UI
- **样式**: Tailwind CSS
- **表单**: React Hook Form + Zod
- **HTTP 客户端**: Axios

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
src/
├── app/
│   ├── login/           # 登录页
│   ├── register/        # 注册页
│   └── dashboard/       # 仪表盘
│       ├── accounts/    # 账号管理
│       └── tasks/       # 任务管理
├── components/          # 公共组件
└── lib/                 # 工具函数与 API 封装
```

## 相关项目

- [cloud-ladder](../cloud-ladder) - 后端 API 服务
