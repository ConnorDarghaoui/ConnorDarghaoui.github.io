---
layout: project
title: "Telegram NL2SQL Bot for Hardware Retail"
short_title: "NL2SQL, TELEGRAM BOT"
image: "/assets/img/llm-inventory.png"
version: "v1.2.0"
status: "DEPLOYED"
metric1_label: "NL2SQL Engine"
metric1_val: "DeepSeek / LangChain"
metric2_label: "Interface"
metric2_val: "Telegram API"
align: left
lang: en
order: 5
---
The inventory of a massive hardware supply chain doesn't speak SQL, but the owner checking his phone on a Sunday afternoon does. This system bridges that gap: a conversational Telegram bot where the business owner simply asks what they need to know, and an open-source DeepSeek-powered pipeline translates that intention into precise, executable SQL against their PostgreSQL database. Whether querying the average ticket size or identifying top buyers, it returns the truth in plain language within seconds. No dashboards to navigate. No queries to write. Just a chat, and an answer.
<!--more-->

### Introduction

When the owner messages their Telegram bot asking, "What was the average ticket today and who bought the most power tools?", they rely on shared context. A database has no context. The first challenge is capturing the user's intent and injecting the necessary architectural context so the LLM can construct a valid query.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

actor "Hardware Store Owner" as User
node "Telegram Bot" as Telegram
node "Intent Parser\n(LangChain + DeepSeek)" as Parser
database "Vector DB (pgvector)\n(Schema & Few-Shot)" as Vector

User -> Telegram : "Average ticket today?"
Telegram -> Parser
Parser <--> Vector : Retrieve Schema (DDL)\n& Similar Queries
Parser -> Parser : Inject Context
@enduml
```

Instead of relying on proprietary closed models, we deployed DeepSeek,a highly capable open-source model,to act as our translation engine. The system performs a semantic search against `pgvector` to pull the precise DDL schema of the hardware inventory tables, along with few-shot examples of similar successful queries. It is essentially teaching DeepSeek how the company stores its data in the span of a few milliseconds before generating the SQL.

### Development

An LLM is a powerful reasoning engine, but it is also unpredictable. Giving an AI direct access to production data is an unacceptable risk unless strict, unyielding software borders are enforced. 

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Generated SQL" as SQL
node "Regex Guardrail\n(AST Validator)" as Guardrail
database "Read-Only Replica\n(PostgreSQL)" as DB

SQL --> Guardrail
Guardrail --> Guardrail : Reject UPDATE/DROP/DELETE
Guardrail --> DB : Execute Clean Query
@enduml
```

Before any query touches the database, it must survive the Guardrail phase. This parses the SQL Abstract Syntax Tree (AST) to ensure absolute compliance with read-only operations. The system is permitted to ask anything, but it is physically incapable of altering reality.

### Conclusion

There is a hard architectural rule in this system: **LLMs are for querying history, not predicting the future.** 

When the owner asks for sales predictions or demand forecasts, DeepSeek does not hallucinate an answer. Instead, the pipeline detects the intent and routes the request to dedicated, deterministic Python forecasting modules. 

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "Hybrid Conversational Pipeline" {
  [Telegram API] --> [FastAPI Backend]
  
  [FastAPI Backend] --> [Intent Router]
  
  [Intent Router] --> [DeepSeek NL2SQL] : Historical Query\n(e.g., Average Ticket)
  [Intent Router] --> [Python Math Models] : Predictive Query\n(e.g., Next Month Forecast)
  
  [DeepSeek NL2SQL] --> [Read-Only Database]
  [Python Math Models] --> [Read-Only Database]
  
  [Read-Only Database] --> [Synthesis Engine] : Raw Data Arrays
  [Synthesis Engine] --> [Telegram API] : Formatted Answer
}
@enduml
```

By decoupling natural language extraction from mathematical forecasting, we achieved the best of both worlds. The Telegram bot feels like talking to a human, but the predictions are backed by rigid, scientifically sound Python models. It proves that the ultimate measure of an AI system isn't what it can guess, but knowing exactly which tool to use for the job.
