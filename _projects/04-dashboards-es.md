---
layout: project
title: "Dashboards de Datos Operativos"
short_title: "04 / AUTOMATIZACIÓN & BI"
image: "/assets/img/dashboards.png"
version: "v2.4.0"
status: "OPTIMIZADO"
metric1_label: "Automatización"
metric1_val: "Python / SQL"
metric2_label: "Reportes"
metric2_val: "Tableau Server"
align: right
lang: es
order: 4
---
Las decisiones tomadas sobre datos sucios no son decisiones, son apuestas. Este sistema enfrentó esa realidad de frente: pipelines automatizados en Python y SQL que limpian, normalizan y deduplican la información organizacional de manera implacable en el origen, mucho antes de que llegue a cualquier pantalla. Los dashboards de Tableau que emergieron de esa base no sólo muestran números, transmiten verdad operativa en tiempo real, dando a los stakeholders la claridad para actuar con convicción, en lugar de con instinto.
<!--more-->

### El Sistema de Filtración

Un dashboard es tan confiable como el pipeline que lo alimenta. Heredamos bases de datos fragmentadas donde los duplicados abundaban y la nomenclatura se imponía por opinión en lugar de por restricciones. El primer paso fue desplegar una capa ETL intransigente.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

collections "Fuentes Legadas\n(Excel, CSV, SQL)" as Sources
node "Worker Python\n(Pandas / SQLAlchemy)" as Python
database "Área Staging\n(PostgreSQL)" as Staging

Sources --> Python : Extracción
Python --> Python : Deduplicación y Tipado
Python --> Staging : Carga
@enduml
```

Los scripts de Python actúan como la membrana de filtración. Al aprovechar Pandas para una deduplicación eficiente en memoria, nos aseguramos de que los errores ortográficos, las violaciones de nulos y los espacios en blanco deshonestos se manejaran a la defensiva. Los datos defectuosos quedan atrapados y se registran; sólo los datos estandarizados logran pasar a staging.

### La Lente Semántica

Una vez que el dato está limpio, debe hablar el idioma del negocio. Una tabla plana de transacciones no significa nada para un ejecutivo. Estructuramos una Capa Semántica dentro del warehouse utilizando agregaciones SQL avanzadas, materializando la lógica compleja de las métricas para que la herramienta de BI no tenga que computarla al vuelo.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

database "Área Staging\n(PostgreSQL)" as Staging
node "Agregaciones SQL\n(Capa Semántica)" as SQL
artifact "Tableau Server\n(Visualizaciones)" as Tableau

Staging --> SQL : Batch Nocturno
SQL --> SQL : Cálculo de KPIs y Dimensiones
SQL --> Tableau : Extractos Optimizados
@enduml
```

Mover las matemáticas complejas hacia la capa de la base de datos significa que Tableau solo se enfoca en lo que hace mejor: renderizar el *insight* visual al instante. Dashboards que solían tardar 40 segundos en cargar ahora saltan a la vista en milisegundos.

### La Infraestructura Analítica Completa

Visto de forma holística, este no es solo un proyecto de reportes, es una fábrica automatizada que manufactura certeza. El sistema despierta, extrae el caos crudo, impone orden, calcula las métricas que importan, y las pinta sobre un lienzo antes de que el equipo ejecutivo tome su primera taza de café.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "Arquitectura de Business Intelligence" {
  [APIs Operativas] --> [DAGs de Python (Airflow)]
  [Archivos Planos] --> [DAGs de Python (Airflow)]
  
  [DAGs de Python (Airflow)] --> [Landing Zone DB] : Carga Cruda
  
  [Landing Zone DB] ..> [Normalización SQL] : Limpieza
  [Normalización SQL] --> [Data Warehouse] : Esquema Estrella
  
  [Data Warehouse] --> [Extractos Tableau]
  [Extractos Tableau] --> [Dashboards Ejecutivos]
  [Extractos Tableau] --> [Dashboards Operativos]
}
@enduml
```

El instinto es una herramienta poderosa en los negocios, pero no escala. Al automatizar el viaje desde el archivo crudo hasta la métrica visual, eliminamos el sesgo emocional de la cadena de reportes. Los datos hablan por sí solos, y ya no titubean.
