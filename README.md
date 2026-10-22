# Agent 實驗室

用互動網頁理解 AI Agent 與 LLM API 的運作：**左邊改輸入，右邊看實際送出的 request、模型回傳的 response、token 與費用**。

線上版：https://yw-chan.github.io/ai-agent-lab/

## 內容

| 模組 | 頁面 |
|---|---|
| 模型基礎 | Token 組成、Reasoning Effort、Prompt Cache、Context Window |
| Agent 機制 | Tool／MCP／Skill、長任務記憶、Subagent、模型路由 |
| 工程實踐 | 需求拆解、Code Review Skill、測試有效性、開發習慣 |

## 說明

- 純靜態 HTML／CSS／JavaScript，不需要建置，直接用瀏覽器打開 `index.html` 也可以。
- 所有 token、費用、延遲都是教學用的估算，不是真實的 tokenizer 或價目表；API 欄位以官方文件為準。
