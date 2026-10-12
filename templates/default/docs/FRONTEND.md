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
- 编译与运行基线: TypeScript, React 19, Vite；保持 `StrictMode` 全局启用。
- 依赖管理: 统一使用 pnpm，CI 与本地环境严格使用 `--frozen-lockfile`。
- 设计系统底座: Semi Design (`@douyinfe/semi-ui`, `@semi-bot/semi-theme-xxx`)，图标统一使用 `@douyinfe/semi-icons`。
- 样式集成: Tailwind CSS v4 (基于 CSS-first `@theme` 接入)，由 `@tailwindcss/vite` 统一插件编译。

约束:
- 仅记录真实引入的基线版本，技术选型以已批准的技术栈清单为准。
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

依赖流向准则:
`shared (基础设施) → features (业务特性) → router / app (应用外壳与路由编排)`

约束:
- 业务特性平级自治: `src/features/` 下各特性保持独立；跨特性共享逻辑统一提取至 `shared/` 或公共 `components/`。
- 根组件与共享层保持通用性，专注基础设施与纯展示能力。
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
| 基础控件 | **Semi Design 原生组件** | 业务功能统一复用原生交互、无障碍支持与键盘导航。 |
| 页面网格容器、Flex 布局、间距排版、响应式断点 | **Tailwind CSS v4** | 在 JSX 中使用完整、静态可分析的工具类。 |
| 全局 Reset、Tokens 映射、第三方库微调、复杂动画关键帧 | **原生 CSS** | 收敛于 `src/index.css` 或组件样式模块；严格消费 DSM 注入的 `--semi-*` 变量。 |
| 组件定制主题与品牌色 | **DSM 主题包 / Theme Tokens** | 通过全局主题变量集中分发，样式统一消费 Design Tokens。 |

约束:
- 每个视觉属性采用单一样式方案 (Tailwind 类或样式模块)。
- 业务卡片与通用容器遵循统一圆角与阴影规范，保持全局视觉一致性。
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
1. 组件状态 (Component State): `useState`/`useReducer`，就近收敛在单个组件内部。
2. 客户端共享状态 (Application State): 纯客户端全局状态（如暗黑模式、侧边栏折叠），由轻量 Store (如 Zustand) 承载。
3. 服务端缓存状态 (Server Cache State): 远端 API 异步数据，由专用缓存工具 (如 TanStack Query) 独占承载。
4. 表单状态 (Form State): 输入数据与校验结果，由表单库就近受控管理，局部渲染。
5. 路由状态 (URL State): 过滤条件、分页、Tab 切换，以 URL SearchParams 作为唯一真理源，支持分享与持久化。

数据获取与缓存准则:
- 服务端数据生命周期完全由专用 Query Client 掌管，客户端 Store 仅保存纯客户端状态。
- 衍生状态在 render 阶段直接计算（必要时配合 `useMemo`）。
- 业务请求统一在 `features/<feature>/api/` 中导出为自定义 Query/Mutation Hook，集中管理网络调用。
- 写操作（Mutation）成功后，通过精准的 Query Key 做针对性 Invalidate，实现按需刷新。

约束:
- 状态保持最小作用域，优先局部管理。
- 请求头装配与认证 Token 注入统一收敛于 HTTP 客户端拦截器。
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
- 统一导航: 应用导航由 `src/router/` 中的路由对象统筹管理，保持全局单一路由树。
- 会话前置绑定: 受保护路由的业务 loader 等待全局会话 Bootstrap 确认有效用户与租户上下文后发起业务请求。
- 请求生命周期与取消: loader 与请求 Hook 显式传递 `request.signal`，在路由切换与重新导航时优雅终止过时请求。
- 单一数据所有者: 路由 loader 负责首屏数据拉取，页面组件直接消费 loader 结果。

约束:
- 路由切换期间的 Pending 状态呈现优雅骨架屏或行内指示，保持页面平滑过渡。
-->


## Interactive States & Feedback (异步状态与统一交互反馈)

<!-- harness:placeholder
用途:
明确异步操作必须完整覆盖四态设计，并统一用户反馈组件与表单交互规范。

包含内容:
- 四大异步交互状态标准 (Loading, Empty, Error, Success)
- 用户反馈组件使用分级规范 (Toast, Banner, Modal, SideSheet)
- 表单验证即时反馈与防重提交

格式示例:
1. 四态设计标准:
   - 加载态 (Loading): 局部更新使用行内 Spinner 或骨架屏，保持界面可操作性。
   - 空状态 (Empty): 明确说明当前无数据的原因（如“暂无任务” vs “无符合筛选条件的结果”），并提供正向操作指引。
   - 错误态 (Error): 提供清晰的错误原因说明与可点击的“重试”按钮，保障链路可恢复。
   - 禁用态 (Disabled): 控件处于不可用状态时，配合 Tooltip 说明启用条件与禁用原因。

2. 反馈组件使用分级规范:
   - 轻量临时反馈 (如保存成功、复制成功): 统一使用 `Toast.success()` / `Toast.error()`，自动消失，保持交互流畅。
   - 页面级持久提示 (如环境配置缺失、配额即将用尽): 使用行内 `<Banner>`。
   - 关键操作确认 (如删除资产、重置配置): 必须使用模态弹窗 `<Modal>` 进行显式二次确认。
   - 复杂详情与高频表单抽屉: 统一使用 `<SideSheet>`，替代全屏跳转。

3. 表单交互准则:
   - 表单项具备独立的 `<label>` 元素，Placeholder 仅作为格式辅助提示。
   - 提交期间将提交按钮置为 loading 与 disabled，提供明确的提交中反馈。
   - 校验错误信息在输入控件就近实时展示，校验未通过时完整保留用户已填内容。

约束:
- 界面交付完整覆盖加载、成功、空数据与异常恢复四类场景。
- 请求异常展示错误恢复态，无数据展示空引导态，明确区分两者语义。
-->


## Frontend Invariants & Verification (前端架构不变量与验证准出)

<!-- harness:placeholder
用途:
定义前端开发中必须永久遵守的确定性代码准则，并列出提测交付前必须通过的差分验证指令。

前端架构不变量清单:
1. 单向依赖流动: `shared → features → router/app`，跨特性通过共享层协作。
2. 服务端数据独占管理: 远端缓存统一交由专用 Query Client 维护，客户端 Store 仅承载客户端状态。
3. 纯净副作用: `useEffect` 严格用于外部系统 (DOM / 定时器) 同步；衍生计算收敛于渲染期。
4. 扁平精简导出: 特性模块按需显式导入，保护 Tree-shaking 与快速热重载。
5. 可访问性与语义化: 交互控件统一使用原生 Button 或具备完整键盘焦点的 ARIA 组件。
6. 精确类型推导: 优先使用强类型推导与类型守卫，未知外部数据通过 Schema (如 Zod) 安全窄化。

前端交付差分验证指令:
- 依赖冻结安装: `pnpm --dir frontend install --frozen-lockfile`
- 类型检查与生产构建: `pnpm --dir frontend build`
- 静态代码规范检查: `pnpm --dir frontend lint`
- 针对性单元测试: 使用 `pnpm --dir frontend test` 执行受本次变更影响的测试套件
- 规范校验: `AIharness validate docs/FRONTEND.md`

约束:
- 任务交付以编译无报错、类型系统检查通过与相关测试全绿为准出凭证。
- UI 交互与视觉效果在真实浏览器环境完成人工验收。
-->
