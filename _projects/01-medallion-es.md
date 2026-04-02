---
layout: project
title: "Arquitectura de Datos Medallion"
short_title: "01 / INFRAESTRUCTURA DE DATOS"
image: "/assets/img/medallion.png"
version: "v3.1.0"
status: "ACTIVO"
metric1_label: "Stack"
metric1_val: "Snowflake / dbt / Spark"
metric2_label: "Framework"
metric2_val: "Arquitectura Medallion"
align: left
lang: es
order: 1
---
El dato crudo no es más que ruido hasta que alguien decide escucharlo con rigor. Este sistema convierte ese ruido en señal, construyendo un lago de datos en tres capas (Bronce, Plata y Oro) donde cada registro atraviesa una cadena estricta de refinamiento antes de poder informar una decisión real. Diseñado con Kafka para la ingesta continua, Spark para la transformación distribuida y dbt para la lógica de negocio declarativa, la arquitectura se convirtió en la base compartida que múltiples equipos de producto adoptaron, y sobre la que construyeron, con plena confianza.
<!--more-->

### El Peso de la Verdad

Antes de esta arquitectura, la verdad no era un estado de los datos; era una negociación dolorosa entre dashboards conflictivos. El problema rara vez era la falta de datos, sino la falta de certeza. Cuando decisiones organizacionales de inmensa gravedad descansan sobre tablas desconectadas, la vacilación se convierte en la postura por defecto.

Esta iniciativa arrancó de raíz los pipelines improvisados y los reemplazó con una metodología rígida e ineludible: La Arquitectura Medallion.

### La Fundición: De Bronce a Plata

Los eventos crudos son erráticos. Llegan fuera de orden, corruptos o duplicados. La primera etapa de nuestro pipeline no hace un intento por arreglarlos, sólo los atrapa intactos.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

queue "Kafka Streams" as Kafka
database "Capa Bronce\n(Crudos)" as Bronze
node "Motor Spark\n(Validación)" as Spark
database "Capa Plata\n(Limpios)" as Silver

Kafka --> Bronze : Ingesta sin Filtros
Bronze --> Spark : Imposición de Esquema
Spark --> Silver : Deduplicados y Validados
@enduml
```

La transición de Bronce a Plata es donde mueren las anomalías. Apache Spark impone los esquemas sin piedad. Si un registro viola el contrato principal de la empresa, es puesto en cuarentena. Lo que emerge en la capa Plata es información prístina, histórica y estandarizada. Todavía no está lista para que el negocio la consuma, pero por primera vez, es completamente honesta.

### Forjando la Señal: De Plata a Oro

Una vez limpios, a los datos hay que darles un propósito. Aquí es donde dbt (data build tool) asume el control, orquestando transformaciones puramente declarativas dentro de Snowflake.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

database "Capa Plata\n(Limpios)" as Silver
node "dbt\n(Lógica de Negocio)" as dbt
database "Capa Oro\n(Agregaciones)" as Gold
cloud "Analítica de Producto" as Analytics

Silver --> dbt : SQL Declarativo
dbt --> Gold : Vistas Materializadas
Gold --> Analytics : Métricas Gobernadas
@enduml
```

El SQL ya no se trata como un mero lenguaje de consulta, sino como ingeniería de software. Cada métrica de negocio tiene control de versiones, pruebas unitarias y documentación generada. La capa Oro no presenta tablas sueltas; presenta la *perspectiva oficial* y unificada de toda la organización.

### El Ecosistema Completo

Al dar un paso atrás, la coreografía entera revela su verdadero propósito. Es un sistema inmunológico contra los malos datos. Al dividir las responsabilidades en almacenamiento inmutable, computación distribuida y modelado declarativo, desacoplamos la fragilidad operativa del análisis de alto nivel.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "Bóveda de Infraestructura de Datos" {
  [SAP y Microservicios] -> [Bus de Eventos Kafka]
  [Bus de Eventos Kafka] --> [Capa Bronce (S3/ADLS)]
  
  [Capa Bronce (S3/ADLS)] ..> [Clúster Spark] : Validación
  [Clúster Spark] --> [Capa Plata (Snowflake)] : Datos Limpios
  
  [Capa Plata (Snowflake)] ..> [dbt Core] : Transformaciones
  [dbt Core] --> [Capa Oro (Snowflake)] : Métricas de Negocio
  
  [Capa Oro (Snowflake)] --> [IA Ejecutiva / Tableau]
}
@enduml
```

Las decisiones que se toman sobre esta base ya no son apuestas. Son golpes precisos y calculados, respaldados por datos que han sobrevivido a un crisol de control de calidad implacable. La confianza, después de todo, también debe ser programada.
