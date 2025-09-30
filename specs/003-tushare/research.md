# Research: 接入tushare财务数据

**Feature**: 003-tushare | **Date**: 2025-09-30

## 研究目标

基于 Clarifications 中的明确需求,研究实现 Tushare 财务数据接口的最佳实践和技术决策。

## 关键技术决策

### 1. Tushare 财务数据接口调研

**决策**: 接入以下 4 个 Tushare Pro 财务数据接口

**接口清单**:
1. `income` - 利润表数据
2. `balancesheet` - 资产负债表数据
3. `cashflow` - 现金流量表数据
4. `fina_indicator` - 主要财务指标数据

**调用方式**:
- 所有接口通过统一的 HTTP POST 方法调用
- 请求格式: `{ api_name: 'income', token: 'xxx', params: {...}, fields: [...] }`
- 响应格式: `{ code: 0, msg: 'success', data: { fields: [...], items: [[...]] } }`

**参考文档**:
- Tushare Pro 官方文档: https://tushare.pro/document/2
- 财务数据接口文档: https://tushare.pro/document/2?doc_id=33

### 2. 数据模型设计

**决策**: 为每张财务报表创建独立的 TypeScript 接口

**理由**:
- 三张报表结构差异较大,分离设计更清晰
- 遵循单一职责原则
- 便于类型推导和 IDE 支持

**核心字段映射** (基于 Tushare API 文档):

**利润表 (Income Statement)**:
- `ts_code`: 股票代码
- `end_date`: 报告期
- `ann_date`: 公告日期
- `report_type`: 报告类型(1=合并报表)
- `total_revenue`: 营业总收入
- `revenue`: 营业收入
- `operate_profit`: 营业利润
- `total_profit`: 利润总额
- `n_income`: 净利润
- `n_income_attr_p`: 归属于母公司所有者的净利润

**资产负债表 (Balance Sheet)**:
- `ts_code`: 股票代码
- `end_date`: 报告期
- `ann_date`: 公告日期
- `report_type`: 报告类型
- `total_assets`: 资产总计
- `total_liab`: 负债合计
- `total_hldr_eqy_exc_min_int`: 股东权益合计(不含少数股东权益)
- `total_hldr_eqy_inc_min_int`: 股东权益合计(含少数股东权益)

**现金流量表 (Cash Flow Statement)**:
- `ts_code`: 股票代码
- `end_date`: 报告期
- `ann_date`: 公告日期
- `report_type`: 报告类型
- `n_cashflow_act`: 经营活动产生的现金流量净额
- `n_cashflow_inv_act`: 投资活动产生的现金流量净额
- `n_cash_flows_fnc_act`: 筹资活动产生的现金流量净额
- `c_cash_equ_end_period`: 期末现金及现金等价物余额

**财务指标 (Financial Indicators)**:
- `ts_code`: 股票代码
- `end_date`: 报告期
- `ann_date`: 公告日期
- `roe`: 净资产收益率
- `roe_waa`: 加权平均净资产收益率
- `grossprofit_margin`: 销售毛利率
- `netprofit_margin`: 销售净利率
- `debt_to_assets`: 资产负债率
- `current_ratio`: 流动比率
- `quick_ratio`: 速动比率

### 3. 缓存机制设计

**决策**: 提供可选的内存缓存和持久化缓存接口,由用户决定是否启用

**设计方案**:
```typescript
interface CacheConfig {
  enabled: boolean;
  ttl?: number; // 缓存过期时间(秒)
  storage?: CacheStorage; // 可选的自定义存储实现
}

interface CacheStorage {
  get(key: string): Promise<any | null>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

**内置实现**:
- 默认提供简单的内存缓存实现
- 用户可通过实现 `CacheStorage` 接口来提供自定义存储(如 Redis、文件系统等)

**理由**:
- 符合 Clarifications 中"由用户自行决定是否启用缓存"的要求
- 接口设计灵活,支持多种存储后端
- 不强制依赖外部存储,保持 SDK 轻量

### 4. 错误处理策略

**决策**: 定义明确的错误类型,区分不同的失败场景

**错误分类**:
1. **认证错误** (`AuthenticationError`): token 无效或过期
2. **限流错误** (`RateLimitError`): 超出 API 调用频率限制
3. **请求错误** (`RequestError`): 请求参数无效
4. **响应错误** (`ResponseError`): API 返回错误响应
5. **网络错误** (`NetworkError`): 网络连接失败
6. **数据未披露** (`DataNotDisclosedError`): 请求的报告期数据未披露

**实现方式**:
- 继承现有的 `TushareError` 基类
- 每种错误类型包含特定的错误码和描述
- 限流错误包含建议的重试时间(如果 API 返回)

**理由**:
- 符合 Clarifications 中"直接返回错误,由用户处理重试逻辑"的要求
- 明确的错误类型便于用户实现针对性的错误处理
- 支持 Clarifications 中"返回特殊状态标识"的未披露数据场景

### 5. 单股票查询限制

**决策**: 每个 API 方法只接受单个股票代码参数

**API 签名示例**:
```typescript
class TushareClient {
  async getIncomeStatement(
    tsCode: string,
    params?: { startDate?: string; endDate?: string; period?: string }
  ): Promise<IncomeStatement[]>;

  async getBalanceSheet(
    tsCode: string,
    params?: { startDate?: string; endDate?: string; period?: string }
  ): Promise<BalanceSheet[]>;
}
```

**批量查询实现**:
- 用户如需查询多只股票,需多次调用 API
- SDK 不提供批量查询包装方法,避免隐藏频率限制风险
- 用户可自行实现批量查询逻辑(如使用 `Promise.all` 或控制并发)

**理由**:
- 符合 Clarifications 中"单次查询单只股票"的要求
- 简化 API 设计,避免复杂的批量错误处理
- 将并发控制责任交给用户,更灵活

### 6. 测试策略

**决策**: 使用 MSW (Mock Service Worker) 模拟 Tushare API 响应

**契约测试覆盖**:
- 每个财务数据接口至少 3 个测试用例:
  1. 成功响应(正常数据)
  2. 错误响应(如 token 无效)
  3. 限流响应(触发频率限制)

**集成测试覆盖**:
- 用户场景:查询指定股票的完整财务数据(三张报表 + 指标)
- 缓存机制:启用缓存后的数据读取和过期
- 错误处理:各类错误的捕获和处理

**单元测试覆盖**:
- 数据模型的验证逻辑
- 缓存工具的存取逻辑
- 错误类型的属性和方法

**理由**:
- 遵循宪章中的"测试优先"和"契约测试"原则
- MSW 可在 Node.js 环境中拦截 HTTP 请求,无需真实 API 调用
- 测试覆盖率目标 ≥ 90%

## 技术风险评估

### 风险 1: Tushare API 响应格式变更

**影响**: 中
**缓解措施**:
- 契约测试覆盖所有接口,API 变更时快速发现
- 类型定义与 API 文档保持同步
- 在 README 中明确支持的 Tushare API 版本

### 风险 2: 财务数据字段众多,类型定义工作量大

**影响**: 中
**缓解措施**:
- 第一版仅定义核心字段(按 Clarifications 中的需求)
- 使用可选属性 (`?:`) 支持未来扩展
- 考虑后续版本提供字段映射配置

### 风险 3: 缓存实现增加复杂度

**影响**: 低
**缓解措施**:
- 第一版提供简单的内存缓存实现
- 通过接口设计支持未来的扩展存储
- 缓存功能默认禁用,不影响核心功能

## 依赖关系

### 新增运行时依赖
- **无** (保持零运行时依赖)

### 新增开发依赖
- **无** (复用现有的 vitest, msw, typescript 等)

## 性能考虑

### API 响应时间
- 目标: < 5秒(含网络延迟)
- 实际取决于 Tushare API 服务端性能和网络状况
- 建议用户实现超时控制

### 包体积
- 预计新增代码约 2000 行
- 类型定义占主要部分,编译后体积增加 < 10KB
- 符合宪章中"压缩后 < 100KB"的要求

### 内存占用
- 内存缓存:每个缓存项约 1-5KB,用户可配置 TTL 控制内存使用
- 无内存泄漏风险(使用 Map 数据结构,支持自动过期清理)

## 总结

本次研究明确了财务数据接口的实现方案:
1. 接入 4 个 Tushare 财务数据接口
2. 为每张报表设计独立的 TypeScript 类型
3. 提供可选的缓存机制
4. 定义明确的错误类型
5. 遵循 TDD 流程,契约测试先行
6. 保持零运行时依赖,维持 SDK 轻量

所有技术决策已考虑宪章要求和 Clarifications 中的澄清结果,无技术阻塞风险。

---
**状态**: ✅ 完成 | **下一步**: Phase 1 设计与契约