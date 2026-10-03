# Frontend Engineering Guide

## Baseline & Tech Stack (技术栈基线与严格模式)

<!-- harness:placeholder
用途:
明确前端工程的核心语言基线、框架主版本、打包工具链与包管理配置，确保所有代码运行在统一标准下。

包含内容:
- 核心语言与严格模式 (TypeScript, StrictMode)
- 前端框架与核心渲染模型 (React 19 / Vite)
- 依赖包管理器与锁定机制 (pnpm / frozen-lockfile)
- 核心 UI 基础组件系统与主题扩展包

格式示例:
- 编译与运行基线: TypeScript, React 19, Vite；必须保持 `StrictMode` 全局启用。
- 依赖管理: 统一使用 pnpm，CI 与本地环境严格使用 `--frozen-lockfile`。
- 设计系统底座: Semi Design (`@douyinfe/semi-ui`, `@semi-bot/semi-theme-xxx`)，图标统一使用 `@douyinfe/semi-icons`。
- 样式集成: Tailwind CSS v4 (基于 CSS-first `@theme` 接入)，由 `@tailwindcss/vite` 统一插件编译。

约束:
- 仅记录真实引入的基线版本，严禁引入未经批准的备选框架。
-->


## Source Structure & Ownership (源码分层与所有权边界)

<!-- harness:placeholder
用途:
定义前端代码目录组织模型，规范模块边界与严格的单向依赖流向。

包含内容:
- `src/router/` — Data Router 路由对象、Layout、全局会话 bootstrap 与错误边界
- `src/features/<feature>/` — 面向产品领域的自包含特性模块
  - `api/` — 特性专有的 API 契约、fetcher 与 Query/Mutation Hook
  - `components/` — 仅当前特性使用的 UI 视图与展示组件
  - `hooks/` / `stores/` — 特性专有的逻辑与局部客户端状态
  - `model/` (或 `types/`) — 特性专有的领域 DTO 与纯类型
- `src/components/` — 跨领域、无业务状态、具备高度复用价值的纯展示组件
- `src/shared/api/` — 统一 HTTP 客户端、拦截器与全局请求头装配
- `src/shared/` (或 `src/lib/`) — 跨领域通用的基础工具与第三方库封装

依赖流向铁律:
`shared (基础设施) → features (业务特性) → router / app (应用外壳与路由编排)`

约束:
- 业务特性绝对解耦: `src/features/A` 严禁直接导入 `src/features/B` 的代码；跨特性共享逻辑必须提升至 `shared/` 或 `components/`。
- 根组件与共享层严禁包含任何特定业务领域的硬编码逻辑。
-->


## UI System & Styling Ownership (组件库与样式所有权分工)

<!-- harness:placeholder
用途:
通过明确的所有权表格，严格界定基础组件库、Tailwind 工具类与自定义 CSS 的使用边界。

包含内容:
- 样式与组件选型决策对照表
- Design Tokens 消费原则
- 响应式布局与断点标准

格式示例:
| 界面开发需求 | 首选方案 | 约束与说明 |
| :--- | :--- | :--- |
| 基础控件 | **Semi Design 原生组件** | 绝大多数业务功能必须优先复用其交互、无障碍支持与键盘导航；严禁私自重复造轮子。 |
| 页面网格容器、Flex 布局、间距排版、响应式断点 | **Tailwind CSS v4** | 在 JSX 中使用完整、静态可分析的工具类；禁止使用字符串动态拼接类名。 |
| 全局 Reset、Tokens 映射、第三方库微调、复杂动画关键帧 | **原生 CSS** | 写在 `src/index.css` 或组件同名样式文件中；严格消费 DSM 注入的 `--semi-*` 变量。 |
| 组件定制主题与品牌色 | **DSM 主题包 / Theme Tokens** | 通过全局主题变量集中分发，严禁在 JSX 中书写硬编码的十六进制颜色或像素值。 |

约束:
- 严禁在同一个视觉属性上同时混用 Tailwind 类与手写内联 CSS。
- 业务卡片与通用容器遵循统一圆角与阴影规范，不得引入突兀的第三方风格。
-->


## State Classification & Data Fetching (5类状态划分与远端缓存)

<!-- harness:placeholder
用途:
将前端状态严格拆解为 5 大核心类型，界定各类状态的归属所有者，并规范远端数据获取与缓存模式。

包含内容:
- 5 大状态所有权体系
- API 客户端与远端数据生命周期
- 缓存失效、乐观更新与重试策略

状态分类与归属准则:
1. 组件状态 (Component State): `useState`/`useReducer`，严格限制在单个组件内部。
2. 客户端共享状态 (Application State): 纯客户端全局状态（如暗黑模式、侧边栏折叠），由轻量 Store (如 Zustand) 承载。
3. 服务端缓存状态 (Server Cache State): 远端 API 异步数据，由专用缓存工具 (如 TanStack Query) 承载。
4. 表单状态 (Form State): 输入数据与校验结果，由表单库就近受控管理，避免全局触发重渲染。
5. 路由状态 (URL State): 过滤条件、分页、Tab 切换，必须以 URL SearchParams 作为唯一真理源，支持用户分享与刷新。

数据获取与缓存铁律:
- 严禁将服务端响应数据手动拷贝到全局客户端 Store (如 Zustand/Redux) 中进行双重维护。
- 衍生状态直接在 render 中计算（或配合 `useMemo`），严禁使用 `useEffect` 监听状态并 `setState` 反向同步。
- 业务请求统一在 `features/<feature>/api/` 中导出为自定义 Query/Mutation Hook，严禁在 UI 组件内裸写 `fetch` 或 `axios`。
- 写操作（Mutation）成功后，必须通过精准的 Query Key 做针对性 Invalidate，避免大范围无差别刷新。

约束:
- 单组件能自洽解决的状态，严禁随意提升到全局。
- 严禁在各个组件中分散重复写请求头与认证 Token 注入。
-->


## Routing & Data Lifecycle (路由架构与数据生命周期)

<!-- harness:placeholder
用途:
规范路由配置、受保护路由鉴权、数据生命周期与异步取消支持。

包含内容:
- React Router Data Router 统一管理机制
- 受保护路由的全局会话 Bootstrap
- Loader 数据生命周期与并发取消信号 (AbortSignal)

格式示例:
- 统一导航: 应用导航由 `src/router/` 中的路由对象统筹管理，严禁在 Feature 内部创建并行的第二套路由实例。
- 会话前置绑定: 受保护路由的业务 loader 必须等待全局会话 Bootstrap 确认当前登录用户与活跃租户后，方可发出业务请求；严禁仅依赖 `localStorage` 的旧值臆测会话有效性。
- 请求生命周期与取消: 所有 loader 与请求 Hook 必须显式传递 `request.signal`，当页面快速切换或导航被取消时，主动终止无效的网络请求，避免旧数据覆盖新页面。
- 单一数据所有者: 已经由路由 loader 加载的首屏数据，严禁在页面组件的 `useEffect` 中重复发起初始拉取。

约束:
- 路由切换过程中的 Pending 状态必须保留既有内容或展示优雅骨架，禁止整屏闪烁。
-->


## Interactive States & Feedback (异步状态与统一交互反馈)

<!-- harness:placeholder
用途:
强制要求异步操作必须完整覆盖四态设计，并统一用户反馈组件与表单交互规范。

包含内容:
- 四大异步交互状态标准 (Loading, Empty, Error, Success)
- 用户反馈组件使用分级规范 (Toast, Banner, Modal, SideSheet)
- 表单验证即时反馈与防重提交

格式示例:
1. 四态设计底线:
   - 加载态 (Loading): 局部更新优先使用行内 Spinner 或骨架屏，避免全局锁屏。
   - 空状态 (Empty): 必须清楚说明当前无数据的原因（如“暂无任务” vs “无符合筛选条件的结果”）。
   - 错误态 (Error): 必须提供可理解的错误说明与可点击的“重试”按钮，严禁直接展示原始网络报错或空白死页。
   - 禁用态 (Disabled): 控件处于不可用状态时，必须提供 Tooltip 解释禁用原因。

2. 反馈组件使用分级规范:
   - 轻量临时反馈 (如保存成功、复制成功): 统一使用 `Toast.success()` / `Toast.error()`，自动消失，不打断用户心流。
   - 页面级持久警告 (如环境配置缺失、配额即将用尽): 使用行内 `<Banner>`。
   - 破坏性或关键确认 (如删除资产、重置配置): 必须使用模态弹窗 `<Modal>` 进行显式二次确认。
   - 复杂详情与高频表单抽屉: 统一使用 `<SideSheet>`，替代传统的全屏跳转。

3. 表单交互底线:
   - 表单项必须具有持久的独立 `<label>`，严禁仅依靠 Placeholder 传递字段含义。
   - 提交期间必须将提交按钮置为 loading 与 disabled，防止用户误触二次重复提交。
   - 校验错误信息紧随对应的输入框下方实时提示，校验失败时必须完整保留用户已输入内容。

约束:
- 严禁仅完成 Happy Path 就宣称前端实现完成。
- 禁止将请求失败偷换成空状态展示。
-->


## Frontend Invariants & Verification (前端代码红线与验证准出)

<!-- harness:placeholder
用途:
定义前端开发中必须永久遵守的硬性代码红线，并列出提测交付前必须通过的差分验证指令。

前端架构红线清单:
1. 依赖流向单向: `shared → features → router/app`，严禁跨 Feature 直接引用。
2. 远端数据入 Query: 远端缓存数据由 Dedicated Query Client 掌管，严禁私自拷贝进 Zustand 等全局客户端 Store。
3. 纯洁的 `useEffect`: `useEffect` 仅用于与外部 DOM / 定时器同步；严禁用于计算衍生状态，严禁在用户交互事件中通过 setState 间接引爆 effect。
4. 杜绝 Barrel 桶文件: 避免在特性根目录创建导出全部内部模块的 `index.ts`，以保护构建 Tree-shaking 与局部热更新性能。
5. 保持焦点与键盘可达: 交互元素保持键盘可导航与焦点可见性，严禁直接使用非交互元素 (如 `<div onClick>`) 替代原生 Button。
6. 严格类型窄化: 严禁滥用 `any` 绕过校验；无法确定的外部数据使用 `unknown` 并通过 Zod 或类型守卫窄化。

前端交付差分验证指令:
- 依赖冻结安装: `pnpm --dir frontend install --frozen-lockfile`
- 类型检查与生产构建: `pnpm --dir frontend build`
- 静态代码规范检查: `pnpm --dir frontend lint`
- 针对性单元测试: 使用 `pnpm --dir frontend test` 执行受本次变更影响的测试套件
- 规范校验: `AIharness validate docs/FRONTEND.md`

约束:
- 严禁在存在确定性报错（类型报错、Lint 报警、单测未过）时宣布任务完成。
- UI 交互改动必须经过真实浏览器人工复核。
-->
