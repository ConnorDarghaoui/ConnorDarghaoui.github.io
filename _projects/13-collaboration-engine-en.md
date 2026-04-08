---
layout: project
title: "Real-time Collaboration Engine"
short_title: "FULLSTACK SYNC"
image: "/assets/img/collaboration.png"
version: "v1.1.0"
status: "PLATFORM"
metric1_label: "Sync Latency"
metric1_val: "< 30ms"
metric2_label: "Stack"
metric2_val: "WebSockets / CRDTs / Elixir"
align: left
lang: en
order: 2
---
The internet was built for documents; we are using it for shared reality. The hardest problem in distributed state is not how to store it, but how to merge it when multiple humans touch the same pixel at the same time. This project delivered a high-performance collaboration engine using Yjs and WebSockets, enabling real-time multi-user editing with mathematical conflict resolution (CRDTs) and sub-30ms state synchronization. It is the engine behind seamless, buttery-smooth shared workspaces.
<!--more-->

### Introduction

Concurrent editing is an exercise in managed chaos. If two users edit the same sentence simultaneously, the traditional "last-write-wins" approach is a disaster for user experience. 

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

actor "User A" as A
actor "User B" as B
node "WebSocket Hub\n(Elixir / Phoenix)" as Hub
database "State Memory\n(Shared CRDT Tree)" as State

A --> Hub : Delta @ T1
B --> Hub : Delta @ T1.1
Hub <--> State : Merged Operation (LWW-Element Set)
Hub --> A : Sync State
Hub --> B : Sync State
@enduml
```

The system overcomes this by treating state as a Conflict-Free Replicated Data Type (CRDT). Every edit is a mathematical operation that can be applied in any order across different nodes while always converging to the same final "truth."

### Development

The core challenge was balancing local responsiveness with global consistency. We implemented an optimistic local update strategy where the UI reacts instantly, while a background process manages the complex merging logic of document deltas and cursor positioning.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Local UI State" as UI
node "CRDT Algorithm\n(Yjs)" as Yjs
node "Network Transport\n(Binary Protobufs)" as Transport
node "Remote Replicas" as Remote

UI --> Yjs : Atomic Transaction
Yjs --> Transport : Binary Byte-stream
Transport --> Remote : Diff Broadcast
@enduml
```

By encoding updates as binary Protobufs, we minimized bandwidth and allowed the system to handle hundreds of concurrent users in a single workspace without significant CPU overhead or visual stutter.

### Conclusion

A collaboration engine is more than just a connection; it is a promise of consistency. By moving from simple API calls to a continuous, mathematically-sound sync layer, we transformed a static application into a living, shared space for human cooperation.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "Real-time Sync Ecosystem" {
  [Client-side UI Library] --> [Yjs Shared Types]
  [Yjs Shared Types] --> [Action History (Undo/Redo)]
  [Yjs Shared Types] --> [Binary Sync Protocol]
  
  [Binary Sync Protocol] --> [Phoenix Channels (Websocket)]
  [Phoenix Channels (Websocket)] --> [Distributed Pub/Sub]
  [Distributed Pub/Sub] --> [Durability Layer (Redis)]
  
  [Distributed Pub/Sub] --> [Other Connected Clients]
}
@enduml
```

This project stands as a testament to the intersection of advanced mathematics and frontend responsiveness, showcasing the ability to engineer systems that handle the chaotic reality of human collaboration at scale.
