---
layout: project
title: "Dynamic Internal Tool Builder"
short_title: "FULLSTACK LOW-CODE"
image: "/assets/img/tool-builder.png"
version: "v1.0.0"
status: "PLATFORM"
metric1_label: "Dev Velocity"
metric1_val: "+300%"
metric2_label: "Stack"
metric2_val: "React / Node.js / JSONB"
align: right
lang: en
order: 1
---
Engineering time is the most expensive resource in a company. For years, we wasted it building nearly identical CRUD interfaces for internal operations. This project broke that cycle: a fullstack internal tool builder that allows non-technical stakeholders to assemble their own operational dashboards and management consoles using a drag-and-drop interface and a unified query abstraction layer. It moved engineering from building tools to building the platform that builds tools.
<!--more-->

### Introduction

The bottleneck wasn't a lack of data, but the friction of building interfaces to manage it. Every new operational requirement meant a new frontend deployment, a new API endpoint, and another week of development.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

actor "Ops Manager" as User
node "Blueprint Builder\n(React + DnD)" as Builder
node "V8 Expression Parser" as Parser
database "PostgreSQL\n(JSONB Definitions)" as DB

User --> Builder : Drag components
Builder --> DB : Save JSON layout
DB --> Parser : Evaluate logic
@enduml
```

The system treats UI as data. A React-based drag-and-drop engine generates a JSON schema defining layouts, queries, and logic. This schema is stored in PostgreSQL and rendered dynamically at runtime, allowing updates without a single line of new code.

### Development

The most complex challenge was the query abstraction. We built a secure middle-layer that translates high-level component intentions into safe, parameterized database queries while allowing for complex client-side expressions for validation and calculated fields.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Dynamic Form" as Form
node "Query Engine\n(Parameterized)" as Engine
node "Permission Proxy" as Proxy
database "Operational DB" as OpsDB

Form --> Engine : Request data
Engine --> Proxy : Validate user scope
Proxy --> OpsDB : Execute safe SQL
OpsDB --> Form : Return dataset
@enduml
```

The result is a sandbox where operations teams can build their own solutions while engineering maintains strict control over data security, performance, and audit trails.

### Conclusion

By abstracting the UI layer into a dynamic platform, we didn't just solve one problem; we solved an entire class of problems. The platform now hosts dozens of mission-critical internal tools, all built by the people who use them, while freeing the engineering team to focus on the core product.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "Internal Tooling Platform" {
  [UI Component Library] --> [JSON Schema Generator]
  [JSON Schema Generator] --> [Renderer Engine]
  [Renderer Engine] --> [V8 Expression Sandbox]
  
  [V8 Expression Sandbox] --> [Abstract Query Layer]
  [Abstract Query Layer] --> [Relational / NoSQL Sinks]
  
  [Renderer Engine] --> [Operational Interfaces]
}
@enduml
```

This project demonstrates the power of architectural leverage: building systems that empower others to do their work faster, safer, and with more autonomy.
