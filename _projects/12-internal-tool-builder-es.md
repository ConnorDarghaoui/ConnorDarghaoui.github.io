---
layout: project
title: "Constructor Dinámico de Herramientas Internas"
short_title: "FULLSTACK LOW-CODE"
image: "/assets/img/tool-builder.png"
version: "v1.0.0"
status: "PLATAFORMA"
metric1_label: "Velocidad Dev"
metric1_val: "+300%"
metric2_label: "Stack"
metric2_val: "React / Node.js / JSONB"
align: right
lang: es
order: 1
---
El tiempo de ingeniería es el recurso más caro de una empresa. Durante años, lo desperdiciamos construyendo interfaces CRUD casi idénticas para operaciones internas. Este proyecto rompió ese ciclo: un constructor de herramientas internas con estado completo que permite a los equipos no técnicos ensamblar sus propios tableros operativos y consolas de gestión utilizando una interfaz de arrastrar y soltar (drag-and-drop) y una capa de abstracción de consultas unificada. Movió la ingeniería de "construir herramientas" a "construir la plataforma que construye herramientas".
<!--more-->

### Introducción

El cuello de botella no era la falta de datos, sino la fricción de construir interfaces para gestionarlos. Cada nuevo requisito operativo significaba un nuevo despliegue de frontend, un nuevo punto final de API y otra semana de desarrollo.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

actor "Ops Manager" as User
node "Blueprint Builder\n(React + DnD)" as Builder
node "V8 Expression Parser" as Parser
database "PostgreSQL\n(Definiciones JSONB)" as DB

User --> Builder : Arrastrar componentes
Builder --> DB : Guardar esquema JSON
DB --> Parser : Evaluar lógica
@enduml
```

El sistema trata la interfaz de usuario como datos. Un motor de arrastrar y soltar basado en React genera un esquema JSON que define los diseños, las consultas y la lógica. Este esquema se almacena en PostgreSQL y se renderiza dinámicamente en tiempo de ejecución, lo que permite actualizaciones sin una sola línea de código nuevo.

### Desarrollo

El desafío más complejo fue la abstracción de las consultas. Construimos una capa intermedia segura que traduce las intenciones de los componentes de alto nivel en consultas de base de datos parametrizadas y seguras, al tiempo que permite expresiones complejas del lado del cliente para validación y campos calculados.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Formulario Dinámico" as Form
node "Motor de Consultas\n(Parametrizadas)" as Engine
node "Proxy de Permisos" as Proxy
database "Operational DB" as OpsDB

Form --> Engine : Solicitar datos
Engine --> Proxy : Validar alcance usuario
Proxy --> OpsDB : Ejecutar SQL seguro
OpsDB --> Form : Retornar dataset
@enduml
```

El resultado es un entorno seguro donde los equipos de operaciones pueden construir sus propias soluciones mientras la ingeniería mantiene un control estricto sobre la seguridad de los datos, el rendimiento y las pistas de auditoría.

### Conclusión

Al abstraer la capa de interfaz de usuario en una plataforma dinámica, no solo resolvimos un problema; resolvimos una clase entera de problemas. La plataforma ahora alberga docenas de herramientas internas críticas, todas construidas por las personas que las usan, mientras libera al equipo de ingeniería para que se concentre en el producto principal.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "Plataforma de Herramental Interno" {
  [Librería de Componentes UI] --> [Generador de Esquemas JSON]
  [Generador de Esquemas JSON] --> [Motor de Renderizado]
  [Motor de Renderizado] --> [Sandbox de Expresiones V8]
  
  [V8 Expression Sandbox] --> [Capa de Consulta Abstracta]
  [Capa de Consulta Abstracta] --> [Sumideros Relacionales / NoSQL]
  
  [Motor de Renderizado] --> [Interfaces Operativas]
}
@enduml
```

Este proyecto demuestra el poder del apalancamiento arquitectónico: construir sistemas que empoderen a otros para hacer su trabajo más rápido, más seguro y con más autonomía.
