# AGENTS.md

## Project (项目概述与技术基线)

<!-- harness:placeholder
用途:
基于仓库中已验证的事实，简要总结本项目的核心定位与技术栈基线。

包含内容:
- 主要开发语言与运行时版本
- 前端技术栈 (框架、组件库、样式系统、包管理器)
- 后端技术栈 (框架、构建工具、核心依赖中间件)
- 数据与存储 (数据库类型)

格式示例:
- 项目定位: AI Center 平台系统，统一管理前后端与跨领域资产；具体业务意图以已批准的 OpenSpec 变更与需求为准。
- 前端技术栈: TypeScript, React 19, Vite, Semi Design (@douyinfe/semi-ui), Tailwind CSS v4, pnpm。
- 后端技术栈: Java 21, Spring Boot 4.0, Maven Wrapper, MyBatis-Plus, Redisson。
- 数据库: MySQL 8.0。

约束:
- 仅记录仓库中已真实引入的技术栈。
- 确切的依赖版本以 package.json、pom.xml、lockfile 等清单为唯一事实来源。
-->


## Operating Invariants (工程不变量与操作准则)

<!-- harness:placeholder
用途:
定义 Agent 在日常交互式编码中必须遵循的执行纪律与操作不变量，确保改动聚焦、因果收敛与高质量交付。

包含内容:
- 差分作用域验证原则 (Diff-Scoped Verification)
- 最小因果集与保留现状原则 (Minimal Causal Edit & Status Quo)
- 根因闭环与真实契约验证 (Root Cause Resolution & Real Verification)
- 符号事实锚定原则 (Evidence-Grounded Referencing)

格式示例:
- 差分作用域验证: 验证行为严格局限于 `git diff` 变动的目标文件及其直接依赖链路。日常检查默认运行受影响文件或模块的单文件编译、类型检查与针对性单测。
- 最小因果集与保留现状: 代码改动严格限定于实现当前目标所需的最小因果集合。周边检测到的既有历史警告、格式偏差或代码坏味道保持原样 (Leave as-is)，由独立的专项任务统一处理。
- 根因闭环与真实契约验证: 必须查明异常引发的核心代码行并实现正向修复；所有修复必须确保目标契约与主链路测试在真实环境下完整通过。
- 符号事实锚定: 所有调用的 API、依赖包、目录路径与架构事实，必须以现有仓库源码树或清单文件 (package.json / pom.xml / lockfile) 中已存在的声明为唯一依据。构建输出目录与 lockfile 统一由对应工具链维护。

约束:
- 规则必须具备可观察性、明确动作边界与正向可执行性。
- 强调交互式上下文中的正向行动准则，避免空泛概念与负向暗示。
-->


## Task Routing (任务路由与事实来源)

<!-- harness:placeholder
用途:
定义各类任务的唯一入口文档、权威事实来源 (Single Source of Truth) 与冲突裁决原则。

包含内容:
- 各类任务对应的权威文档与核心关注
- 适用的专用工作流或 Skill
- 权威裁决与冲突仲裁准则 (Precedence & Conflict Resolution)

格式示例:
任务路由映射:
- 前端与 UI 开发任务
  - 权威来源: `docs/FRONTEND.md`
  - 适用 Skill: `.agents/skills/manage-docs`

- 后端与服务开发任务
  - 权威来源: `docs/BACKEND.md`
  - 适用 Skill: `.agents/skills/manage-docs`

- 系统架构与跨端调整
  - 权威来源: `ARCHITECTURE.md`

- 规格定义与行为变更 (OpenSpec)
  - 权威来源: `openspec/specs/` 与 `openspec/changes/`
  - 适用 Skill: `.agents/skills/openspec-*`
  - 工作目录: `openspec/changes/<change-name>/`

权威裁决与冲突仲裁准则:
1. 规格高于既有代码: 系统业务行为以 `openspec/specs/` 为最高权威；既有代码若与规格冲突，以规格为准并修复代码实现。
2. 权威冲突主动升级: 若两个权威来源发生矛盾，立即暂停自发推演并触发 `Ask for Human Judgment` 提交人工仲裁。

约束:
- 每个领域仅绑定一个唯一明确的权威所有者，保持规则单点维护。
- 仅作为导航路由与仲裁准则，详细的工作流步骤下沉到具体的 Skill 或端侧文档中。
-->


## Commands (高频指令集)

<!-- harness:placeholder
用途:
列出 Agent 在本仓库中最常使用的稳定、高价值命令及其简要作用。

包含内容:
- 依赖安装命令
- 本地启动与联调命令
- 静态检查与 Lint 命令
- 类型检查与构建命令
- 自动化测试与覆盖率命令
- 规范校验命令

格式示例:
- 前端依赖安装: `pnpm --dir frontend install --frozen-lockfile`
- 前端本地启动: `pnpm --dir frontend dev`
- 前端类型校验与构建: `pnpm --dir frontend build`
- 前端静态代码检查: `pnpm --dir frontend lint`
- 后端构建与测试: 在 `backend/` 下执行 `./mvnw clean verify` (Windows 使用 `./mvnw.cmd clean verify`)
- 后端本地启动: 在 `backend/` 下执行 `./mvnw spring-boot:run` (Windows 使用 `./mvnw.cmd spring-boot:run`)

约束:
- 仅列出当前仓库真实可用且高频使用的命令。
- 命令失败时如实报告原始输出并查明根本原因。
- 本节仅收录高频核心指令；高级参数查阅工具自身的 help。
-->


## Completion Criteria (任务准出与交付标准)

<!-- harness:placeholder
用途:
定义 Agent 在向用户报告工作完成前，必须满足并验证的客观准出充要条件。

包含内容:
- 针对性差分测试要求
- 编译、类型与静态检查要求
- 规范与受管文档校验要求
- UI 交互与视觉真实验收原则
- 最小因果改动检查 (零多余文件)
- 客观证据交付

格式示例:
- 差分测试通过: 本次变更影响范围内的单元测试与核心契约测试全部通过；新增行为提供对应的回归测试用例。
- 静态检查干净: 变动范围内的编译通过，类型系统校验无报错 (如 tsc、javac)，无新增 Lint 警告。
- 规范有效性通过: 若修改了受管文档，运行 `AIharness validate <file> --json` 且校验通过。
- UI 真实核验原则: 前端 UI 改动由人工在真实浏览器环境完成交互与视觉核验。
- 最小因果改动: 交付前检查 `git status` / `git diff`，确保仅包含当前任务所需的必要改动，保持周边无关文件干净。
- 证据交付: 最终交付总结中，明确列出已执行过的验证命令及其输出关键证据。

约束:
- 交付必须以确定性的构建通过、类型通过与测试绿灯作为充要条件。
- 任务完成以客观验证输出与有效凭证为准。
-->


## Ask for Human Judgment When (人工介入条件)

<!-- harness:placeholder
用途:
明确列出 Agent 必须主动暂停自发推演、请求用户人工介入决策的典型场景。

包含内容:
- 需求理解层面的多解与歧义
- 数据与系统层面的高影响/高危操作
- 安全、合规与隐私层面的缺失
- 权威来源冲突与超纲请求
- 人工介入三段式提问模板 (Structured Escalation Protocol)

格式示例:
- 产品需求存在实质性多解，且无法从已有代码和规格推导唯一合理的实现路径。
- 需要执行高影响或破坏性操作（如删除数据库字段、清空表、删除历史配置、强制重置分支）。
- 缺失关键的安全、权限、计费、数据脱敏或隐私合规决策。
- 两个权威规范出现直接矛盾，无法自行判定优先级。
- 用户请求超出当前系统架构范围，或缺乏客观证据判定方案是否可行。

人工介入三段式提问标准:
1. 现状阻碍 / 歧义根因: [指出具体代码行、规格断点或权威冲突点]
2. 备选方案权衡:
   - 方案 A: [简要描述 + 核心利弊 + 影响范围]
   - 方案 B: [简要描述 + 核心利弊 + 影响范围]
3. 推荐路径与求证: [给出 Agent 推荐的具体方案及客观依据，提请人工裁决/批准]

约束:
- 遇到上述情形时，主动暂停自发推演，按三段式模板清晰列出选项、权衡与推荐方案提请用户决策。
-->
