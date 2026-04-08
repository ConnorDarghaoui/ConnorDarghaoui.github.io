---
layout: project
title: "Consola de Soporte al Cliente con IA"
short_title: "FULLSTACK AI SUPPORT"
image: "/assets/img/ai-support.png"
version: "v1.6.0"
status: "DEPLOYED"
metric1_label: "Primera Respuesta"
metric1_val: "-42% Tiempo"
metric2_label: "Stack"
metric2_val: "FastAPI / React / RAG"
align: right
lang: es
order: 4
---
La calidad de soporte se rompe cuando el contexto está disperso entre chats, tickets y documentación interna. Esta consola fullstack unificó conversaciones, recuperación de conocimiento y flujo operativo de agentes en una sola superficie. La IA asumió el triage repetitivo y borradores de respuesta, mientras los humanos conservaron el control de resolución final y escalamiento.
<!--more-->

### Introducción

Los agentes invertían más tiempo recolectando contexto que resolviendo incidentes. La misma consulta llegaba por chat, correo o formulario, cada canal con metadatos distintos y sin una línea de tiempo compartida.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

actor "Cliente" as Customer
node "Ingesta Omnicanal" as Ingestion
node "Orquestador de Tickets" as Tickets
node "Workspace de Agente\n(React)" as Workspace

Customer --> Ingestion : Chat / Email / Formulario
Ingestion --> Tickets : Flujo unificado de tickets
Tickets --> Workspace : Cola priorizada
@enduml
```

La plataforma normalizó todos los canales a una línea de tiempo única por ticket, con SLA, urgencia y estado de ownership.

### Desarrollo

El soporte con IA solo funciona cuando está restringido por contexto confiable. Construimos un pipeline RAG sobre documentación interna y resoluciones históricas, combinado con umbrales de confianza y aprobación humana antes de responder al cliente.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Pregunta del Usuario" as Q
node "Retriever\n(Búsqueda Vectorial)" as Retriever
node "Borrador de Respuesta LLM" as LLM
node "Puerta de Aprobación del Agente" as Gate
node "Response API" as API

Q --> Retriever : Docs relevantes + tickets previos
Retriever --> LLM : Contexto aterrizado
LLM --> Gate : Respuesta propuesta + citas
Gate --> API : Respuesta aprobada
@enduml
```

Las respuestas de baja confianza se enrutan automáticamente a agentes humanos con acciones sugeridas, sin envío automático al cliente.

### Conclusión

La consola se convirtió en una capa de decisión operativa, no solo en una interfaz de chat. El equipo obtuvo mejoras medibles en primera respuesta, consistencia de resolución y calidad del handoff IA-humano.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "Consola Operativa de Soporte con IA" {
  [Ingesta Omnicanal] --> [Core de Ticketing]
  [Core de Ticketing] --> [Motor RAG]
  [Motor RAG] --> [Borradores LLM]
  [Borradores LLM] --> [Revisión de Agente]
  [Revisión de Agente] --> [Respuesta al Cliente]
  [Core de Ticketing] --> [Dashboard SLA]
  [Dashboard SLA] --> [Líderes de Soporte]
}
@enduml
```

Al combinar automatización con supervisión humana controlada, el sistema aceleró soporte sin sacrificar confianza, tono ni responsabilidad operativa.
