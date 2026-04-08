---
layout: project
title: "Portal B2B Marketplace"
short_title: "MICROSERVICIOS"
image: "/assets/img/microservices.png"
version: "v4.0.2"
status: "LIVE"
metric1_label: "Tiempo de Respuesta"
metric1_val: "-25% Latencia"
metric2_label: "Backend"
metric2_val: "Quarkus / Vue 3"
align: right
lang: es
order: 10
---
Un monolito es un punto de orgullo, hasta que se convierte en un punto único de fallo. Esta migración desmanteló un sistema Spring Boot heredado pieza por pieza, reemplazando sus costuras rígidas con microservicios Quarkus capaces de respirar, escalar y fallar de forma independiente entre sí. El resultado fue una reducción del 25% en la latencia de respuesta, no como un accidente de optimización, sino como la consecuencia natural de construir algo arquitectónicamente honesto desde sus cimientos.
<!--more-->

### Introducción

El sistema heredado fue víctima de su propio éxito. Lo que comenzó como una aplicación Spring Boot cohesiva había crecido hasta convertirse en una red enmarañada de dominios interdependientes. Una oleada en el procesamiento de pedidos asfixiaba al catálogo de inventario, robándole ciclos de CPU. Una pequeña fuga de memoria en el módulo de facturación derribaba todo el marketplace.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Monolito Heredado (Spring Boot)" {
  [Gestor Pedidos] <--> [Inventario]
  [Inventario] <--> [Facturación]
  [Facturación] <--> [Autenticación]
}
database "BD Monolítica" as DB

[Gestor Pedidos] --> DB
[Inventario] --> DB
[Facturación] --> DB
@enduml
```

Los datos estaban acoplados. La computación era compartida. El proceso de despliegue se había vuelto un ejercicio de terror puro. No necesitábamos refactorizar el código; necesitábamos destrozar el paradigma.

### Desarrollo

El primer paso fue introducir un API Gateway, un escudo protector que nos permitiera estrangular al monolito paulatinamente. Al enrutar el tráfico de manera inteligente, pudimos vaciar el sistema heredado, migrando dominios de negocio aislados hacia runtimes Quarkus modernos y ligeros.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

cloud "Aplicaciones Cliente" as Client
node "API Gateway\n(Kong)" as Gateway
node "Monolito Legacy" as Legacy
node "Servicio Quarkus\n(Dominio Pedidos)" as Orders
node "Servicio Quarkus\n(Dominio Auth)" as Auth

Client -> Gateway
Gateway --> Legacy : Tráfico Residual
Gateway --> Orders : Ruta API Pedidos
Gateway --> Auth : Ruta API Auth
@enduml
```

Quarkus no fue elegido por capricho. Sus mecánicas de arranque en tiempo de compilación y su insignificante consumo de memoria (diseñado orgánicamente para Kubernetes) significaban que nuestros nuevos servicios no solo escalaban, reaccionaban ante la demanda al instante.

### Conclusión

Una verdadera arquitectura de microservicios no trata solo de dividir código; trata de cambiar la comunicación de llamadas síncronas bloqueantes a una coreografía asíncrona fluida. Introdujimos un Broker de Eventos, asegurándonos de que los servicios ya no demandaran atención inmediata de sus pares. Simplemente anunciaban lo que había ocurrido, confiando en que el ecosistema reaccionaría en consecuencia.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "El Ecosistema del Marketplace B2B" {
  [Frontend (Vue 3)] --> [API Gateway]
  
  [API Gateway] --> [Servicio Auth]
  [API Gateway] --> [Servicio Catálogo]
  [API Gateway] --> [Servicio Pedidos]
  
  queue "Bus de Eventos (RabbitMQ)" as Bus
  
  [Servicio Pedidos] --> Bus : Evento "PedidoCreado"
  Bus --> [Servicio Inventario] : Consume & Reserva
  Bus --> [Servicio Facturación] : Consume & Factura
  
  database "DB Dominio 1" as DB1
  database "DB Dominio 2" as DB2
  
  [Servicio Catálogo] --> DB1
  [Servicio Pedidos] --> DB2
}
@enduml
```

Este diseño desacoplado es lo que finalmente nos otorgó la caída del 25% en latencia. Cuando se elimina la resistencia estructural, la velocidad deja de ser una característica para convertirse en el estado natural del sistema. El monolito ha muerto. El ecosistema florece.
