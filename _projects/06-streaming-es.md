---
layout: project
title: "Motor de Anomalías en Tiempo Real"
short_title: "06 / STREAMING ANALYTICS"
image: "/assets/img/streaming.png"
version: "v2.1.0"
status: "ACTIVO"
metric1_label: "Latencia"
metric1_val: "< 50ms"
metric2_label: "Motor"
metric2_val: "Apache Flink / Kafka"
align: right
lang: es
order: 6
---
Los datos en reposo son historia, los datos en movimiento son el presente. Durante años, la organización dependió del procesamiento por lotes nocturno para identificar fallos operativos, lo que significaba que solo descubríamos la hemorragia mucho después de que el daño ya estaba hecho. Este sistema erradica la demora. Al aprovechar Apache Flink y Kafka, construimos un motor de streaming con estado capaz de ingerir miles de eventos por segundo, evaluar ventanas de tiempo deslizantes y disparar alertas críticas en menos de 50 milisegundos. No es una herramienta analítica, es un acto reflejo.
<!--more-->

### La Corriente Indomable

Cuando se trata de flujos de alta velocidad (telemetría IoT, libros transaccionales o clics web), las bases de datos tradicionales se asfixian. El primer imperativo arquitectónico fue tratar el dato no como una simple fila que se almacena, sino como un río infinito y continuo.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Microservicios / IoT" as Producers
queue "Apache Kafka\n(Bus de Eventos)" as Kafka
node "Ingesta Flink\n(Source Operator)" as Source

Producers --> Kafka : Flujo Crudo
Kafka --> Source : Consumo Particionado
@enduml
```

Apache Kafka actúa como un sistema nervioso indestructible. Absorbe picos de tráfico masivos y repentinos sin inmutarse, desacoplando la ruidosa y caótica realidad de la producción de los frágiles sistemas que intentan analizarla a posteriori.

### La Ventana con Estado

El paradigma de streaming no trata solo de mover datos rápido, trata de retener memoria en el caos. Si un mismo usuario falla un inicio de sesión tres veces en diez segundos, eso es una anomalía. Pero, ¿cómo recuerdas los primeros dos fallos mientras procesas 10,000 eventos simultáneos más?

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Operador 'Map' Flink" as Map
node "Ventana Temporal\n(Intervalos de 10s)" as Window
node "Memoria de Estado\n(RocksDB)" as RocksDB
node "Alerta de Anomalía" as Alert

Map --> Window : Flujos Agrupados (Keyed)
Window <--> RocksDB : Checkpoints
Window --> Alert : Umbral Superado
@enduml
```

Aquí brilla Apache Flink. Al usar RocksDB como backend de estado, el sistema mantiene el contexto exacto de cada transacción a lo largo de clústeres distribuidos. Calcula agregaciones sobre ventanas de tiempo rotativas (*tumbling*) y deslizantes (*sliding*) sin perder un solo contador durante una caída de nodo. Razona sobre el tiempo con rigor matemático.

### El Ecosistema "Reflejo"

Una verdadera arquitectura de análisis en streaming no termina con un hallazgo interesante, termina con una acción defensiva. Una vez que la anomalía es detectada en medio de la corriente, el sistema omite el Data Warehouse tradicional por completo, escribiendo directamente sobre una caché Redis de latencia ultrabaja desde donde los sistemas pueden leer la alerta casi al instante.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "Arquitectura de Streaming en Tiempo Real" {
  [Sistemas Operativos] --> [Bus de Eventos (Kafka)]
  
  package "Motor Apache Flink" {
    [Fuente Kafka] --> [Operador KeyBy()]
    [Operador KeyBy()] --> [Agregación TimeWindow()]
    [Agregación TimeWindow()] ..> [Checkpoints RocksDB] : Tolerancia a fallos
    [Agregación TimeWindow()] --> [Destino (Sink) de Alertas]
  }
  
  [Destino (Sink) de Alertas] --> [Caché Redis] : Lectura Rápida
  [Caché Redis] --> [APIs Mitigación Fraude] : Auto-Bloqueo
  [Destino (Sink) de Alertas] --> [Slack / PagerDuty] : Escalado Humano
}
@enduml
```

El procesamiento por lotes (*batch*) te dice por qué la empresa se estrelló ayer. El procesamiento en *streaming* toma el volante antes de que golpees el muro. Al dominar la memoria en movimiento, transformamos la arquitectura de un mero observador pasivo al guardián absoluto del negocio.
