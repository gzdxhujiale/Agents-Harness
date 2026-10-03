---
name: manage-docs
description: Orchestrate evidence-based authoring, updating, and validation for all Harness documents (AGENTS.md, ARCHITECTURE.md, docs/FRONTEND.md, docs/BACKEND.md) or full-repo bootstrap.
---
# Manage Harness Documents

## Purpose

Authoritatively create, update, and validate the repository's 4 core managed documents, or bootstrap the entire documentation suite according to verified repository facts and strict schema contracts.

---

## Operating Modes

### Mode 1: Single Document Workflow

When tasked with creating or updating a specific document (`AGENTS.md`, `ARCHITECTURE.md`, `docs/FRONTEND.md`, or `docs/BACKEND.md`):

1. **Inspect Evidence**:
   - Run `AIharness inspect` and `AIharness status`.
   - Run the domain context command:
     - For `ARCHITECTURE.md`: `AIharness context architecture`
     - For `docs/FRONTEND.md`: `AIharness context frontend`
     - For `docs/BACKEND.md`: `AIharness context backend`
     - For `AGENTS.md`: Read package manifests, lockfiles, `.agents/skills/`, and project scripts.
2. **Consult Domain Matrix**:
   - Populate every applicable schema section using verified evidence from the codebase.
   - Never invent nonexistent services, packages, directories, or endpoints.
3. **Validate & Repair Loop**:
   - Run `AIharness validate <file> --json`.
   - Fix all reported actionable errors (missing sections, invalid levels, remaining placeholders, unverified paths, etc.).
   - Repeat until the document is completely `valid`.

---

### Mode 2: Full-Repo Bootstrap & Repair Workflow

When tasked with bootstrapping or auditing the repository documentation suite:

1. **Check Status**:
   - Run `AIharness inspect` and parse `AIharness status --json`.
   - Identify all documents where `applicability` is `required` or `recommended`, and `readiness` is `pending` or `invalid`.
2. **Sequential Authoring**:
   - Process documents in topological order:
     1. `AGENTS.md` (Repo baseline, redlines, commands, routing)
     2. `ARCHITECTURE.md` (System topology, repository boundaries, dependency flow)
     3. `docs/FRONTEND.md` (If frontend capability detected)
     4. `docs/BACKEND.md` (If server/worker/queue capability detected)
   - For each applicable document, execute the Single Document Workflow.
3. **Final Gate**:
   - Run `AIharness status`.
   - Confirm all applicable required documents have `readiness: valid`.

---

## Domain Routing & Authoring Matrix

### 1. AGENTS.md
- **Role**: Operational entry point, operating redlines, commands, task routing, and human escalation criteria.
- **Required Sections**:
  1. `Project` (项目概述与技术基线)
  2. `Operating Redlines` (操作红线与工程铁律)
  3. `Task Routing` (任务路由与事实来源)
  4. `Commands` (高频指令集)
  5. `Completion Criteria` (任务准出与交付标准)
  6. `Ask for Human Judgment When` (人工介入条件)
- **Key Redlines**: Prohibit audit theater, enforce minimal causal changes, prohibit hallucination, verify diffs.

### 2. ARCHITECTURE.md
- **Role**: System-level structural skeleton, boundaries, contracts, and flow.
- **Required Sections**:
  1. `System Topology & Overview` (系统全局拓扑与职责边界)
  2. `Repository Boundaries` (顶层资产与仓库边界)
  3. `Dependency Flow & Architecture Invariants` (单向依赖流向与架构铁律)
  4. `Cross-Boundary Contracts` (跨端通信契约与协议规范)
  5. `Shared Data Architecture` (全局数据模型与多租户隔离原则)
  6. `Architectural Decisions & Evolution` (核心架构决策与演进指引)
- **Conditional Rule**: When backend capabilities (`server_api`, `background_jobs`, `queue`) exist, under section 2 `Repository Boundaries`, include:
  - `### Backend Structure` with verified directory entries in `- `path/` — responsibility` format.
  - `#### Dependency Boundaries` defining allowed/forbidden dependency directions.

### 3. docs/FRONTEND.md
- **Role**: Frontend implementation standards, styling system, state classification, and interaction feedback.
- **Required Sections**:
  1. `Baseline & Tech Stack` (技术栈基线与严格模式)
  2. `Source Structure & Ownership` (源码分层与所有权边界)
  3. `UI System & Styling Ownership` (组件库与样式所有权分工)
  4. `State Classification & Data Fetching` (5类状态划分与远端缓存)
  5. `Routing & Data Lifecycle` (路由架构与数据生命周期)
  6. `Interactive States & Feedback` (异步状态与统一交互反馈)
  7. `Frontend Invariants & Verification` (前端代码红线与验证准出)

### 4. docs/BACKEND.md
- **Role**: Backend vertical layering, isolation, persistence, reliability, and security operations.
- **Required Sections**:
  1. `Baseline & Runtime` (运行时基线与工程管理)
  2. `Package & Layering Boundaries` (包结构垂直分层与边界)
  3. `Configuration & Security Operations` (配置隔离、安全与数据脱敏)
  4. `Persistence & Data Isolation` (数据持久化与多租户隔离)
  5. `Concurrency, Queue & Reliability` (并发流控、队列与可靠性)
  6. `Backend Invariants & Verification` (后端代码红线与验证准出)

---

## Evidence & Completion Invariants

1. **No Hallucination**: Every path, command, and framework version must exist in the repo.
2. **Replace All Placeholders**: Initialization comments containing `harness:placeholder` must be fully replaced by verified content.
3. **Deterministic Verification**: Never claim a document is finished without executing `AIharness validate <file> --json` with 0 errors.
