---
layout: project
title: "Torre de Control SRE y Observabilidad"
short_title: "SRE & OBSERVABILIDAD"
image: "/assets/img/sre-observability.png"
version: "v1.0.0"
status: "ROBUSTO"
metric1_label: "Confiabilidad"
metric1_val: "99.95% SLO"
metric2_label: "Stack"
metric2_val: "OpenTelemetry / Prometheus"
align: right
lang: es
order: 6
---
Sin observabilidad, la confiabilidad es una suposición. Esta plataforma transformó logs fragmentados y alertas improvisadas en una torre de control SRE disciplinada: telemetría unificada, objetivos de nivel de servicio y flujos de incidentes que priorizan el impacto real al cliente por encima del ruido operativo. El resultado fue detección más rápida, escalamiento más preciso y una organización capaz de defender el uptime con evidencia.
<!--more-->

### Introducción

El problema no era la ausencia de monitoreo, sino la sobrecarga de señales inconexas. Cada equipo tenía dashboards, umbrales y criterios distintos sobre qué significaba "estar sano". En incidentes críticos, los primeros minutos se perdían alineando la realidad.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Servicios\n(API, Workers, ETL)" as Services
node "Colectores OTel" as OTel
database "Almacén de Métricas\n(Prometheus)" as Prom
database "Almacén de Logs\n(Loki/ELK)" as Logs

Services --> OTel : Trazas + Métricas + Logs
OTel --> Prom : Métricas time-series
OTel --> Logs : Logs estructurados
@enduml
```

Al estandarizar la instrumentación con OpenTelemetry, todos los servicios comenzaron a hablar un mismo idioma de telemetría. Latencia, tasa de error, saturación y contexto distribuido pasaron a ser elementos nativos de la plataforma.

### Desarrollo

La observabilidad solo genera valor cuando está conectada a promesas claras de confiabilidad. Definimos contratos SLI/SLO por cada recorrido crítico de usuario e implementamos alertas de burn-rate en múltiples ventanas para reducir falsos positivos sin sacrificar velocidad de respuesta.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Pipelines SLI" as SLI
node "Evaluador SLO\n(Error Budget)" as SLO
node "Alert Manager" as Alert
node "Rotación On-Call" as OnCall

SLI --> SLO : Disponibilidad / Latencia
SLO --> Alert : Brecha de burn-rate
Alert --> OnCall : Incidentes enrutados
@enduml
```

Cada alerta de alta severidad se vinculó a un runbook operativo. En lugar de depender de mensajes genéricos y memoria tribal, los incidentes llegaban al responsable correcto con pasos de diagnóstico, rutas de rollback y patrones de falla conocidos.

### Conclusión

La ganancia real no fue la herramienta, fue el comportamiento operativo. Los equipos dejaron de reaccionar a métricas de vanidad y empezaron a gestionar error budgets como una restricción de producto. La confiabilidad se convirtió en un compromiso explícito y medible.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "Plataforma SRE de Observabilidad" {
  [Servicios de Aplicación] --> [Instrumentación OpenTelemetry]
  [Instrumentación OpenTelemetry] --> [Prometheus + Logs + Trazas]

  [Prometheus + Logs + Trazas] --> [Dashboard de SLO]
  [Dashboard de SLO] --> [Política de Error Budget]
  [Política de Error Budget] --> [Alertmanager]

  [Alertmanager] --> [PagerDuty / Slack]
  [PagerDuty / Slack] --> [Runbooks de Incidente]
  [Runbooks de Incidente] --> [Postmortem + Acciones]
}
@enduml
```

Con un modelo común de confiabilidad y telemetría accionable, la respuesta a incidentes dejó de ser improvisación y pasó a ser ejecución controlada. El uptime dejó de ser una sorpresa trimestral y pasó a ser un resultado administrado.
