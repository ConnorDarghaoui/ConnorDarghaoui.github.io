---
layout: project
title: "Plataforma Fullstack de Experimentación"
short_title: "A/B TESTING PLATFORM"
image: "/assets/img/experimentation.png"
version: "v1.9.0"
status: "OPTIMIZADO"
metric1_label: "Experimentos"
metric1_val: "85+ / Trimestre"
metric2_label: "Engine"
metric2_val: "Feature Flags / Bayesian Stats"
align: left
lang: es
order: 13
---
Las decisiones de producto fallan cuando no se puede experimentar de forma segura y escalable. Esta plataforma incorporó un stack end-to-end de experimentación: entrega por feature flags, asignación determinística de usuarios, trazabilidad de eventos y análisis estadístico sólido en un flujo fullstack único. El equipo pasó de releases por opinión a decisiones respaldadas por evidencia.
<!--more-->

### Introducción

Antes de este sistema, los experimentos eran manuales, inconsistentes y difíciles de validar. Distintos equipos usaban métricas y lógicas de asignación diferentes, con validaciones en hojas de cálculo aisladas.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

actor "Equipo de Producto" as Team
node "Consola de Experimentos\n(React)" as Console
node "API de Feature Flags" as Flags
node "SDKs Cliente" as SDK

Team --> Console : Configura variantes
Console --> Flags : Publica experimento
Flags --> SDK : Evaluación runtime
@enduml
```

El plano de control centraliza configuración, split de tráfico, reglas de targeting y ventanas de rollout con trazabilidad completa.

### Desarrollo

La experimentación correcta depende de asignación estable y medición confiable. Implementamos bucketing consistente, esquemas de eventos y pipelines de métricas con guardrails de conversión, tasa de error y latencia.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Request de Usuario" as Req
node "Motor de Bucketing" as Bucket
node "Colector de Eventos" as Events
node "Motor Estadístico\n(Bayesiano + Frecuentista)" as Stats
node "Dashboard de Decisión" as Dash

Req --> Bucket : Variante determinística
Bucket --> Events : Evento de exposición
Events --> Stats : Flujos KPI
Stats --> Dash : Lift + confianza + guardrails
@enduml
```

Si un guardrail se degrada, la plataforma puede pausar automáticamente el experimento y alertar a los responsables.

### Conclusión

La capa de experimentación se volvió parte del ciclo diario de entrega. Producto, diseño e ingeniería pudieron lanzar hipótesis con seguridad, leer resultados rápidamente y escalar cambios exitosos con confianza.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "Sistema de Entrega de Experimentación" {
  [Consola de Experimentos] --> [API de Gestión de Flags]
  [API de Gestión de Flags] --> [Evaluador SDK]
  [Evaluador SDK] --> [Eventos de Exposición + Resultado]
  [Eventos de Exposición + Resultado] --> [Data Warehouse Analítico]
  [Data Warehouse Analítico] --> [Motor Estadístico]
  [Motor Estadístico] --> [Dashboard de Decisión]
  [Dashboard de Decisión] --> [Auto Rollout / Auto Stop]
}
@enduml
```

Al unificar entrega, medición y lógica de decisión, la plataforma transformó la experimentación de un proceso lateral a una capacidad fullstack central del producto.
