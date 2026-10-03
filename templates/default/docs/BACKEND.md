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
- 仅记录仓库中已真实引入的技术栈，严禁为尚未启用的数据库或中间件预留占位配置。
-->


## Package & Layering Boundaries (包结构垂直分层与边界)

<!-- harness:placeholder
用途:
规范服务端代码包组织模型，坚决贯彻按业务能力纵向切分与内聚，消灭全局横向大杂烩。

包含内容:
- 业务能力垂直分包 (Capability-based Packaging)
- 领域内部的四层架构职责:
  - `api` — 负责 HTTP/REST 传输协议、入参校验与 DTO 转换，严禁包含业务规则
  - `application` — 负责用例编排、事务边界控制与领域端口协调，不直接依赖具体数据库或 HTTP 细节
  - `domain` — 纯净的领域模型与核心业务规则，不依赖 Spring MVC、数据库驱动或缓存客户端
  - `infrastructure` — 实现数据库持久化 (Mapper/Repository)、分布式队列与外部第三方客户端端口
  - `shared` — 仅容纳全系统通用的稳定技术基础设施，业务 DTO、实体与规则绝对禁止混入

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

协作铁律:
- 业务能力之间协作必须通过明确的应用端口 (Service Interface)，绝对禁止跨能力直接调用或注入对方的数据库适配器 (Mapper/DAO)。

约束:
- 严禁采用全局共享的 `controller/`、`service/`、`dao/` 顶层大杂烩结构。
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
1. 凭据注入铁律:
   - 数据库密码、Redis 授权、第三方 API Key、JWT 签名私钥必须通过运行环境环境变量注入，绝对禁止硬编码提交到代码库。
   - `application.yml` 仅允许存放非敏感的通用默认值。

2. 全链路可观测性与 Trace 贯穿:
   - 全链路显式贯穿 Trace ID 与 Span 上下文 (如集成 OpenTelemetry 与 Micrometer)，确保异步任务、模型调用与接口请求拥有规范的父子关联。

3. 日志与指标白名单脱敏:
   - 对日志输出、Span 属性和查询明细严格执行白名单脱敏机制。
   - 严禁将用户明文密码、银行卡号、证件号、原始凭据、模型输入全文打入日志或指标标签中。

约束:
- 生产配置与密钥严禁进入版本控制。
- 严禁在异常处理中向客户端原样暴露后端未处理的堆栈信息 (Stack Trace) 或底层 SQL 报错。
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
   - 核心业务表必须包含 `tenant_id` (或 `workspace_id`)。
   - 持久层通过自动拦截器 (如 MyBatis-Plus TenantLineHandler) 全局统一追加租户过滤条件，严禁产生跨租户越权查询。
   - 租户上下文必须由当前验签通过的 Session 注入，严禁信任客户端请求体上传的伪造租户 ID。

2. 短事务控制底线:
   - 数据库事务保持高内聚、短平快；严禁在 `@Transactional` 数据库事务范围内执行耗时的大模型调用、文件大对象上传或慢速第三方 HTTP 请求。

3. 规范化审计字段:
   - 核心业务表统一维护 `id`, `tenant_id`, `created_at`, `updated_at`, `created_by`, `deleted` 字段；统一使用逻辑删除。

约束:
- 严禁在持久层直接拼接未经转义的动态 SQL，防范 SQL 注入风险。
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
   - 高频资源竞争或防并发冲突必须使用分布式锁或 CAS 乐观锁版本号校验。
   - 耗时任务（如批量生成、长耗时导出）必须采用分布式队列削峰填谷，并严格配置信号量并发上限。

2. 异步消费幂等防重:
   - 所有后台定时任务与消息队列消费者，必须基于唯一请求/任务 ID (`requestId` / `taskId`) 实现原子防重，确保网络重试或重复消费不会导致数据重复写入。

3. 异常退避与调用准入:
   - 依赖外部不稳定服务时，显式配置超时阈值、指数退避重试 (Exponential Backoff) 及必要的服务熔断。

约束:
- 严禁无上限地创建并发线程或无控发起并发远程请求。
- 异步任务执行失败时必须记录明确的错误上下文并持久化终态，严禁吞掉异常伪造成功。
-->


## Backend Invariants & Verification (后端代码红线与验证准出)

<!-- harness:placeholder
用途:
定义后端开发必须永久坚守的硬性架构红线，并列出提测准出前必须执行的确定性验证指令。

后端架构红线清单:
1. 能力垂直自治: 业务能力之间严禁跨包私自穿透数据库访问层；能力协作仅通过明确的应用端口。
2. 零敏感数据硬编码: 生产密钥、数据库密码和 Token 必须由环境注入。
3. 严格多租户隔离: 数据库查询必须受租户上下文强约束，严禁越权。
4. 事务与外部 IO 严格隔离: 严禁在数据库事务内部包裹大模型调用或第三方外部网络请求。
5. 异步消息必须幂等: 队列消费与定时任务必须设计幂等防重保障。
6. 严格输入校验与脱敏: 接口强制开启 JSR-303 / 校验器；日志与 Trace 严禁泄露明文私密信息。

后端交付差分验证指令:
- 单元测试与完整构建: 在 `backend/` 目录下执行 `./mvnw clean verify` (Windows 使用 `./mvnw.cmd clean verify`)
- 本地服务启动验证: 在 `backend/` 目录下执行 `./mvnw spring-boot:run` (Windows 使用 `./mvnw.cmd spring-boot:run`)
- 规范校验: `AIharness validate docs/BACKEND.md`

约束:
- 变更范围内的核心业务分支必须补充回归测试用例。
- 严禁在构建或测试失败时宣称任务完成。
-->
