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


## Operating Redlines (操作红线与工程铁律)

<!-- harness:placeholder
用途:
定义 Agent 在日常交互式编码中绝对不可逾越的底线规则，防止发散扫描、范围蔓延与低质交付。

包含内容:
- 差分验证原则与禁止过度审计 (Prohibit Audit Theater)
- 最小因果集原则与禁止无指令附带修复 (No Unsolicited Remediation)
- 彻底解决根因与严禁降级补丁 (Root Cause Resolution)
- 保持既有约定与严禁臆造 (Preserve Conventions & No Hallucination)

格式示例:
- 禁止过度审计与发散式扫描: 交互式任务严格做变动范围内的差分检查 (如受影响文件的编译、类型校验与针对性单测)。严禁在缺少明确指令时，自发发起全仓静态代码扫描、全量依赖漏洞扫描或全局质量打分巡检。
- 禁止无指令附带修复: 静态检查若在变更区域周边检测出历史遗留的警告、格式偏差或代码坏味道 (Code Smell)，严禁自发顺手清理。严格保持改动聚焦于最小因果集，杜绝范围蔓延 (Scope Creep)。
- 彻底解决根因，禁止降级兜底: 必须查明并修复根本原因；严禁以降级处理、临时兜底、启发式绕道、mock 或非严谨的后处理修补替代正确实现。
- 严禁臆造与伪造事实: 严禁凭空捏造不存在的 API、包依赖、目录路径或架构事实；不手工编辑构建生成目录及 lockfile。

约束:
- 规则必须具备可观察性与明确界限。
- 强调交互式上下文中的行动准则，避免假大空的抽象口号。
-->


## Task Routing (任务路由与事实来源)

<!-- harness:placeholder
用途:
定义各类任务的唯一入口文档、权威事实来源 (Single Source of Truth) 与冲突裁决原则。

包含内容:
- 各类任务对应的权威文档与核心关注
- 适用的专用工作流或 Skill
- 权威裁决与冲突仲裁铁律 (Precedence & Conflict Resolution)

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

权威裁决与冲突仲裁铁律:
1. 规格高于既有代码: 系统业务行为以 `openspec/specs/` 为最高权威；既有代码若与规格冲突，视为代码实现 Bug，严禁把代码缺陷反向合理化为合法规格。
2. 权威冲突必须暂停: 若两个权威来源发生矛盾，Agent 严禁自行脑补猜测，必须暂停并触发 `Ask for Human Judgment` 提交人工仲裁。

约束:
- 每个领域仅绑定一个唯一明确的权威所有者，严禁在文档间互相复制权威规则。
- 仅作为导航路由与仲裁准则，详细的工作流步骤应下沉到具体的 Skill 或端侧文档中。
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
- 命令失败时必须如实报告原始错误并查明根本原因，严禁篡改脚本跳过检查。
- 不要在本节罗列完整命令行手册；高级参数查阅工具自身的 help。
-->


## Completion Criteria (任务准出与交付标准)

<!-- harness:placeholder
用途:
定义 Agent 在向用户报告工作完成前，必须满足并验证的客观准出底线。

包含内容:
- 针对性差分测试要求
- 编译、类型与静态检查要求
- 规范与受管文档校验要求
- UI 交互与视觉真实验收原则
- 最小因果改动检查 (零多余文件)

格式示例:
- 差分测试通过: 本次变更影响范围内的单元测试与核心契约测试全部通过；新增行为必须有对应的回归测试用例。
- 静态检查干净: 变动范围内的编译通过，类型系统校验无报错 (如 tsc、javac)，无新增 Lint 警告。
- 规范有效性通过: 若修改了受管文档，必须运行 `AIharness validate <file> --json` 且校验无报错。
- UI 真实核验原则: 前端 UI 改动必须由人工在真实浏览器环境完成交互与视觉核验；AI 不得以无头浏览器自动化假装完成视觉验收。
- 最小因果改动: 交付前检查 `git status` / `git diff`，确保仅包含当前任务所需的必要改动，没有夹带周边无关文件的改动或格式化污染。
- 证据交付: 在最终交付总结中，明确列出已执行过的验证命令及其输出关键证据。

约束:
- 严禁在存在确定性报错（测试失败、类型报错、构建异常）时假装完成。
- 文件“存在”不等于任务“完成”；禁止无证据宣称完成。
-->


## Ask for Human Judgment When (人工介入条件)

<!-- harness:placeholder
用途:
明确列出 Agent 严禁自行脑补决策、必须主动暂停并请求用户人工介入的典型场景。

包含内容:
- 需求理解层面的多解与歧义
- 数据与系统层面的破坏性/高危操作
- 安全、合规与隐私层面的缺失
- 权威来源冲突与超纲请求

格式示例:
- 产品需求存在实质性多解，且无法从已有代码和规格推导唯一合理的实现路径。
- 需要执行破坏性操作（如删除数据库字段、清空表、删除历史配置、强制重置分支）。
- 缺失关键的安全、权限、计费、数据脱敏或隐私合规决策。
- 两个权威规范出现直接矛盾，无法自行判定优先级。
- 用户请求明显超出当前系统架构范围，或缺乏客观证据判定方案是否可行。

约束:
- 遇到上述情形时，必须停止自发推演，清晰列出选项与考量并询问用户。
-->
