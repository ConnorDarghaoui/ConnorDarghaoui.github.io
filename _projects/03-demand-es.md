---
layout: project
title: "Motor de Pronóstico de Demanda"
short_title: "MODELADO PREDICTIVO"
image: "/assets/img/demand.png"
version: "v1.8.9"
status: "EJECUTÁNDOSE"
metric1_label: "Volumen Datos"
metric1_val: "~50M Registros"
metric2_label: "Motor"
metric2_val: "PyMC / BigQuery"
align: left
lang: es
order: 11
---
Cincuenta millones de registros no mienten, pero sin el marco correcto, no dicen nada. Este motor convierte el historial transaccional en previsión probabilística, modelando la demanda de inventario con una óptica Bayesiana construida sobre PyMC y orquestada con MLflow. Donde otros sistemas adivinan en línea recta, este razona: cuantifica la incertidumbre, devela intervalos de confianza, y entrega a los planificadores un número que pueden confiar, no sólo creer.
<!--more-->

### Introducción

La previsión no puede generarse a partir de una historia fragmentada. El primer mandato arquitectónico fue consolidar más de 50 millones de registros transaccionales dispares que residían en múltiples sistemas corporativos.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

database "ERP (Transacciones)" as ERP
database "CRM (Ventas)" as CRM
node "Pipeline ELT" as ELT
database "Google BigQuery\n(Feature Store)" as BQ

ERP --> ELT
CRM --> ELT
ELT --> BQ : Variables (Lag, Estacionalidad)
@enduml
```

Google BigQuery actúa como la base inmutable, el Feature Store. Aquí, los eventos crudos se agregan en datos estructurados de series temporales: ventanas móviles, variables de rezago y coeficientes de estacionalidad. El modelo no solo observa qué se vendió; examina *cómo* se vendió a lo largo del tiempo.

### Desarrollo

El machine learning tradicional produce estimaciones puntuales, una predicción única y rígida. Pero la realidad no es rígida. Un negocio no solo necesita saber que "venderemos 100 unidades"; necesita saber que "hay una probabilidad del 95% de que venderemos entre 85 y 115 unidades."

Por eso desplegamos PyMC.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Priors\n(Creencias previas)" as Priors
node "Datos Observados\n(Feature Store)" as Data
node "Muestreo MCMC\n(PyMC)" as MCMC
node "Posteriors\n(Pronósticos e Incertidumbre)" as Posteriors

Priors --> MCMC
Data --> MCMC
MCMC --> Posteriors
@enduml
```

$$
P(\text{Demanda}_t | X_t) \sim \mathcal{N}(\mu_t, \sigma^2)
$$

Al tratar la demanda como una distribución de probabilidad en lugar de un resultado determinista, el sistema reconoce el caos inherente del mercado. Calcula los *Intervalos de Alta Densidad (HDI)*, permitiendo a los planificadores equilibrar los costos de almacenamiento frente a los riesgos de desabastecimiento de forma matemática, en lugar de emocional.

### Conclusión

Un modelo que vive en la laptop de un científico de datos es un ejercicio académico. Un modelo que se re-entrena automáticamente, versiona sus artefactos y despliega sus predicciones en producción es un activo de ingeniería.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "Ecosistema Predictivo" {
  [Google BigQuery] --> [Extracción de Features]
  
  package "Orquestación MLflow" {
    [Extracción de Features] --> [Entrenamiento (PyMC)]
    [Entrenamiento (PyMC)] --> [Registro de Modelos]
    note right of [Registro de Modelos] : Trazabilidad de hiperparámetros\ny artefactos
  }
  
  [Registro de Modelos] --> [Inferencia Batch]
  [Inferencia Batch] --> [PostgreSQL (Capa de Servicio)]
  [PostgreSQL (Capa de Servicio)] --> [Dashboard de Planificación]
}
@enduml
```

MLflow actúa como el sistema nervioso central. Versiona estrictamente cada ejecución de entrenamiento, registra hiperparámetros y garantiza la reproducibilidad. Las predicciones luego se escriben en una capa de servicio, donde los sistemas de inventario las digieren de manera transparente. Ya no es un humano pronosticando el futuro; es la infraestructura misma inyectando previsibilidad al negocio.
