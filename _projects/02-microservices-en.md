---
layout: project
title: "B2B Marketplace Portal"
short_title: "02 / MICROSERVICES"
image: "/assets/img/microservices.png"
version: "v4.0.2"
status: "LIVE"
metric1_label: "Response Time"
metric1_val: "-25% Latency"
metric2_label: "Backend"
metric2_val: "Quarkus / Vue 3"
align: right
lang: en
order: 2
---
A monolith is a single point of pride, until it becomes a single point of failure. This migration dismantled a legacy Spring Boot system piece by piece, replacing its rigid seams with Quarkus microservices that could breathe, scale, and fail independently of each other. The result was a 25% reduction in response latency, not as an accident of optimization, but as the natural consequence of building something architecturally honest from the ground up.
<!--more-->

### The Oppressive Bottleneck

The legacy system was a victim of its own success. What began as a cohesive Spring Boot application had grown into a tangled web of interdependent domains. A surge in order processing would starve the inventory catalog of CPU cycles. A minor memory leak in the billing module would bring the entire marketplace down. 

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Legacy Spring Boot Monolith" {
  [Order Manager] <--> [Inventory]
  [Inventory] <--> [Billing]
  [Billing] <--> [User Auth]
}
database "Monolithic DB" as DB

[Order Manager] --> DB
[Inventory] --> DB
[Billing] --> DB
@enduml
```

The data was coupled. The compute was shared. The deployment process was an exercise in terror. We didn't need to refactor the code; we needed to shatter the paradigm.

### The Liberation

The first step was to introduce an API Gateway,a protective shield that allowed us to strangle the monolith. By routing traffic intelligently, we could hollow out the legacy system entirely, migrating isolated business domains onto modern, lightweight Quarkus runtimes. 

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

cloud "Client Applications" as Client
node "API Gateway\n(Kong)" as Gateway
node "Legacy Monolith" as Legacy
node "Quarkus Service\n(Order Domain)" as Orders
node "Quarkus Service\n(Auth Domain)" as Auth

Client -> Gateway
Gateway --> Legacy : Legacy Traffic
Gateway --> Orders : Order API Route
Gateway --> Auth : Auth API Route
@enduml
```

Quarkus was not chosen on a whim. Its compile-time boot mechanics and low memory footprint (optimized for Kubernetes) meant our new services didn't just scale,they reacted instantly to demand.

### The Event-Driven Choreography

A true microservices architecture isn't just about splitting code; it's about shifting communication from synchronous blocking calls to asynchronous choreography. We introduced an Event Broker, ensuring that services no longer demanded immediate attention from one another. They simply announced what had happened, trusting the ecosystem to react.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "The B2B Marketplace Ecosystem" {
  [Frontend (Vue 3)] --> [API Gateway]
  
  [API Gateway] --> [Auth Microservice]
  [API Gateway] --> [Catalog Microservice]
  [API Gateway] --> [Order Microservice]
  
  queue "Event Bus (RabbitMQ)" as Bus
  
  [Order Microservice] --> Bus : "OrderCreated" event
  Bus --> [Inventory Microservice] : Consume & Reserve
  Bus --> [Billing Microservice] : Consume & Invoice
  
  database "Domain DB 1" as DB1
  database "Domain DB 2" as DB2
  
  [Catalog Microservice] --> DB1
  [Order Microservice] --> DB2
}
@enduml
```

This decoupled design is what ultimately granted us the 25% drop in latency. When structural resistance is removed, speed ceases to be a feature; it becomes the natural state of the system. The monolith is dead. The ecosystem thrives.
