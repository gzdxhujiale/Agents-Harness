# Backend Engineering Guide

## Baseline & Runtime (运行时基线与工程管理)

<!-- harness:placeholder
用途:
明确后端的编译运行基线、核心框架主线版本、构建工具及依赖管理准则。

包含内容:
- 编译与运行基线版本 (如: Java 21, Node.js 20 LTS)
- 框架主维护线及锁定的补丁版本 (如: Spring Boot 4.0.x)
- 构建工具链与依赖锁定 (如: Maven 3.9.x Wrapper, pnpm)
- 核心基础设施组件库 (如: MyBatis-Plus, Redisson, Spring AI)

格式示例:
- 语言运行时: Java 21 为唯一受支持的编译与运行基线。
- 框架主线: Spring Boot 固定在 4.0 维护线，锁定当前稳定补丁版本。
- 构建工具: 使用 Maven Wrapper (mvnw / mvnw.cmd)，构建配置强制校验 Java 主版本。
- 核心组件: 集成 Web、Security、Spring JDBC、MyBatis-Plus、Redisson（分布式任务队列与信号量限流）与 Spring AI 客户端。

约束:
- 仅记录仓库中已真实引入的技术栈，配置项与已启用的数据库及中间件一一对应。
-->


## Package & Layering Boundaries (包结构垂直分层与边界)

<!-- harness:placeholder
用途:
规范服务端代码包组织模型，坚决贯彻按业务能力纵向切分与内聚，消除全局横向无序依赖。

包含内容:
- 业务能力垂直分包 (Capability-based Packaging)
- 领域内部的四层架构职责:
  - `api` — 负责 HTTP/REST 传输协议、入参校验与 DTO 转换，专注传输层适配
  - `application` — 负责用例编排、事务边界控制与领域端口协调，通过抽象接口依赖基础设施
  - `domain` — 纯净的领域模型与核心业务规则，保持无外部框架依赖的纯粹性
  - `infrastructure` — 实现数据库持久化 (Mapper/Repository)、分布式队列与外部第三方客户端端口
  - `shared` — 仅容纳全系统通用的稳定技术基础设施，保持通用工具纯粹性

格式示例:
```text
com.project.backend
├─ BackendApplication.java
├─ <capability>/              # 独立业务能力目录 (如 auth, task, workflow)
│  ├─ api/                    # 控制器、入参 Request、出参 Response
│  ├─ application/            # 应用服务编排、用例逻辑
│  ├─ domain/                 # 核心实体、值对象、领域规则
│  └─ infrastructure/         # 数据库访问适配器、持久化实体、外部客户端
└─ shared/                    # 稳定的跨能力基础设施
```

协作准则:
- 业务能力之间协作通过显式公开的应用服务接口（Service Interface）或领域事件完成；持久层组件封装在各业务能力内部。

约束:
- 模块组织贯彻业务能力垂直分包，保持高内聚低耦合。
-->


## Configuration & Security Operations (配置隔离、安全与数据脱敏)

<!-- harness:placeholder
用途:
规范服务端运行期环境配置隔离、密钥凭证注入、全链路可观测性与数据脱敏白名单。

包含内容:
- 敏感配置注入原则
- 全链路日志与 Trace ID 贯穿
- 敏感数据脱敏白名单策略

格式示例:
1. 凭据管理准则:
   - 数据库密码、Redis 授权、第三方 API Key、JWT 签名私钥统一通过运行环境环境变量注入；代码仓库配置文件仅维护非敏感默认值。
   - `application.yml` 仅允许存放非敏感的通用默认值。

2. 全链路可观测性与 Trace 贯穿:
   - 全链路显式贯穿 Trace ID 与 Span 上下文 (如集成 OpenTelemetry 与 Micrometer)，保持父子调用关系链完整。

3. 日志与指标白名单脱敏:
   - 日志与监控指标执行严格的字段白名单打印策略；敏感信息（密码、凭证、卡号等）在进入日志前统一完成脱敏掩码处理。

约束:
- 生产密钥与安全凭据通过部署配置管理系统统一托管。
- 接口异常响应对外输出统一定义的安全错误码与友好摘要，技术细节与堆栈信息留存在服务端可审计日志中。
-->


## Persistence & Data Isolation (数据持久化与多租户隔离)

<!-- harness:placeholder
用途:
规范数据库访问、多租户上下文隔离、短事务控制与审计字段标准。

包含内容:
- 严格多租户数据隔离机制
- 数据库事务边界与防挂起原则
- 统一实体审计字段与逻辑删除

格式示例:
1. 严格多租户隔离:
   - 核心业务表统一包含 `tenant_id` (或 `workspace_id`)。
   - 持久层通过自动拦截器 (如 MyBatis-Plus TenantLineHandler) 全局统一追加租户过滤条件，确保所有数据读写在受限租户作用域内。
   - 租户上下文统一以服务端鉴权通过的 Session 身份为准。

2. 事务编排两阶段原则:
   - 数据库事务聚焦核心数据一致性，保持轻量短事务。
   - 大模型调用、文件流传输与耗时第三方 HTTP 请求放在事务外部执行，结果就绪后再开启本地数据库事务完成持久化。

3. 规范化审计字段:
   - 核心业务表统一维护 `id`, `tenant_id`, `created_at`, `updated_at`, `created_by`, `deleted` 字段；统一使用逻辑删除与时间戳自动更新。

约束:
- 数据查询统一采用参数化预编译或 ORM 安全绑定，确保 SQL 结构静态安全。
-->


## Concurrency, Queue & Reliability (并发流控、队列与可靠性)

<!-- harness:placeholder
用途:
规范并发控制、分布式锁、异步队列消费、流控限流与幂等防重机制。

包含内容:
- 分布式任务队列与信号量流控 (如 Redisson)
- 异步消息处理的幂等性设计
- 重试退避、超时熔断与故障降级

格式示例:
1. 并发流控与分布式锁:
   - 高频资源竞争或防并发冲突采用分布式锁或 CAS 乐观锁版本号机制。
   - 耗时任务（如批量生成、长耗时导出）采用分布式任务队列削峰填谷，并配置明确的信号量并发上限。

2. 异步消费幂等防重:
   - 后台定时任务与消息队列消费者统一基于唯一业务/任务 ID (`requestId` / `taskId`) 实现原子防重，保障重复投递下的数据幂等性。

3. 异常退避与调用准入:
   - 依赖外部不稳定服务时，显式配置超时阈值、指数退避重试 (Exponential Backoff) 及断路器熔断机制。

约束:
- 并发线程池与异步连接均设定明确的最大容量与拒绝策略。
- 异步任务执行失败时记录完整的错误上下文并持久化失败终态，确保状态可追溯。
-->


## Backend Invariants & Verification (后端架构不变量与验证准出)

<!-- harness:placeholder
用途:
定义后端开发必须永久坚守的确定性架构准则，并列出提测准出前必须执行的确定性验证指令。

后端架构不变量清单:
1. 能力垂直自治: 业务能力之间通过公开服务接口通信，数据访问组件内部闭环。
2. 环境变量凭据托管: 生产密钥与连接密码统一由环境注入。
3. 严格多租户隔离: 数据访问全链路受会话租户上下文自动约束。
4. 事务与外部 IO 两阶段解耦: 慢速外部网络调用在事务外编排，本地事务仅负责紧凑数据写入。
5. 异步消息幂等闭环: 队列消费与后台任务具备原子去重机制。
6. 输入校验与脱敏留痕: 接口请求强制开启参数校验器；日志输出执行白名单脱敏。

后端交付差分验证指令:
- 单元测试与完整构建: 在 `backend/` 目录下执行 `./mvnw clean verify` (Windows 使用 `./mvnw.cmd clean verify`)
- 本地服务启动验证: 在 `backend/` 目录下执行 `./mvnw spring-boot:run` (Windows 使用 `./mvnw.cmd spring-boot:run`)
- 规范校验: `AIharness validate docs/BACKEND.md`

约束:
- 核心业务逻辑变更提供覆盖正常与边界分支的回归测试用例。
- 任务交付以 Maven 构建成功、测试套件全绿为准出凭证。
-->
