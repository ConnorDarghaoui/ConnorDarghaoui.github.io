---
layout: project
title: "Motor de Colaboración en Tiempo Real"
short_title: "FULLSTACK SYNC"
image: "/assets/img/collaboration.png"
version: "v1.1.0"
status: "PLATAFORMA"
metric1_label: "Latencia Sync"
metric1_val: "< 30ms"
metric2_label: "Stack"
metric2_val: "WebSockets / CRDTs / Elixir"
align: left
lang: es
order: 2
---
Internet fue construido para documentos, pero lo estamos usando para construir realidades compartidas. El problema más difícil en un estado distribuido no es cómo almacenarlo, sino cómo fusionarlo cuando múltiples humanos tocan el mismo píxel al mismo tiempo. Este proyecto entregó un motor de colaboración de alto rendimiento utilizando Yjs y WebSockets, permitiendo la edición multiusuario en tiempo real con resolución de conflictos matemática (CRDTs) y una sincronización de estado de menos de 30ms. Es el motor detrás de espacios de trabajo compartidos y fluidos.
<!--more-->

### Introducción

La edición concurrente es un ejercicio de caos gestionado. Si dos usuarios editan la misma frase simultáneamente, el enfoque tradicional de "la última escritura gana" es un desastre para la experiencia del usuario.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

actor "Usuario A" as A
actor "Usuario B" as B
node "WebSocket Hub\n(Elixir / Phoenix)" as Hub
database "Memoria de Estado\n(Árbol CRDT Compartido)" as State

A --> Hub : Delta @ T1
B --> Hub : Delta @ T1.1
Hub <--> State : Operación Fusionada (Set LWW-Element)
Hub --> A : Estado Sincronizado
Hub --> B : Estado Sincronizado
@enduml
```

El sistema supera esto tratando el estado como un Tipo de Dato Replicado Libre de Conflictos (CRDT). Cada edición es una operación matemática que puede aplicarse en cualquier orden en diferentes nodos, convergiendo siempre a la misma "verdad" final.

### Desarrollo

El desafío central fue equilibrar la capacidad de respuesta local con la consistencia global. Implementamos una estrategia de actualización local optimista donde la interfaz de usuario reacciona instantáneamente, mientras un proceso en segundo plano gestiona la lógica compleja de fusión de deltas de documentos y posicionamiento de cursores.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Estado Interfaz Local" as UI
node "Algoritmo CRDT\n(Yjs)" as Yjs
node "Transporte Red\n(Binary Protobufs)" as Transport
node "Réplicas Remotas" as Remote

UI --> Yjs : Transacción Atómica
Yjs --> Transport : Flujo de Bytes Binario
Transport --> Remote : Difusión de Diferencias (Diff)
@enduml
```

Al codificar las actualizaciones como Protobufs binarios, minimizamos el ancho de banda y permitimos que el sistema maneje cientos de usuarios concurrentes en un solo espacio de trabajo sin una sobrecarga significativa de CPU o saltos visuales.

### Conclusión

Un motor de colaboración es más que una simple conexión; es una promesa de consistencia. Al pasar de simples llamadas a la API a una capa de sincronización continua y matemáticamente sólida, transformamos una aplicación estática en un espacio vivo y compartido para la cooperación humana.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "Ecosistema de Sincronización Real-time" {
  [Librería UI en Cliente] --> [Tipos Compartidos Yjs]
  [Tipos Compartidos Yjs] --> [Historial de Acciones (Undo/Redo)]
  [Tipos Compartidos Yjs] --> [Protocolo de Sincronización Binario]
  
  [Protocolo de Sincronización Binario] --> [Canales Phoenix (Websocket)]
  [Canales Phoenix (Websocket)] --> [Pub/Sub Distribuido]
  [Pub/Sub Distribuido] --> [Capa de Persistencia (Redis)]
  
  [Pub/Sub Distribuido] --> [Otros Clientes Conectados]
}
@enduml
```

Este proyecto se erige como un testimonio de la intersección entre las matemáticas avanzadas y la capacidad de respuesta del frontend, mostrando la habilidad de diseñar sistemas que manejen la realidad caótica de la colaboración humana a gran escala.
