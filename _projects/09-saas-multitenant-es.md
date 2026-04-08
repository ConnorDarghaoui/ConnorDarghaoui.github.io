---
layout: project
title: "Plataforma SaaS B2B Multi-tenant"
short_title: "FULLSTACK SAAS"
image: "/assets/img/saas-multitenant.png"
version: "v2.0.0"
status: "LIVE"
metric1_label: "Tenants"
metric1_val: "120+ Activos"
metric2_label: "Backend"
metric2_val: "Node.js / PostgreSQL"
align: left
lang: es
order: 3
---
Una plataforma SaaS solo escala cuando la arquitectura impone límites claros. Este proyecto entregó una solución fullstack B2B multi-tenant con aislamiento estricto por cliente, control de acceso por roles, billing por suscripción y consola administrativa operativa. Permitió incorporar cuentas enterprise rápidamente sin comprometer seguridad de datos, trazabilidad ni rendimiento.
<!--more-->

### Introducción

El primer desafío fue el aislamiento. El crecimiento convirtió los límites de datos entre clientes en una necesidad crítica del negocio, no en una preferencia técnica. Un solo filtro mal aplicado podía convertirse en un incidente cross-tenant.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

actor "Usuario Tenant" as User
node "Web App\n(React)" as Web
node "API Gateway" as API
node "Tenant Resolver\n(JWT + Contexto Org)" as Resolver
database "PostgreSQL\n(Row-Level Security)" as DB

User --> Web
Web --> API
API --> Resolver
Resolver --> DB : Consultas con scope
@enduml
```

La identidad del tenant se resuelve en cada request y se propaga en todo el backend. Combinado con políticas RLS en PostgreSQL, cada lectura y escritura queda restringida por defecto al ámbito correcto.

### Desarrollo

Además del aislamiento, un SaaS B2B necesita capacidades de negocio: RBAC, billing y gobernanza operativa. Implementamos jerarquías de roles, planes de suscripción y ciclo de vida de facturas manteniendo una experiencia de uso clara para operadores y clientes.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Auth Service" as Auth
node "Motor RBAC" as RBAC
node "Billing Service\n(Planes, Facturas)" as Billing
node "Portal Admin" as Admin

Auth --> RBAC : Evalúa permisos
RBAC --> Admin : Matriz de acceso
Billing --> Admin : Uso + estado de suscripción
@enduml
```

El frontend expone configuraciones por tenant, gestión de usuarios y controles de consumo sin filtrar complejidad de infraestructura a negocio.

### Conclusión

La plataforma dejó de ser un producto puntual y se convirtió en una base SaaS reutilizable. El onboarding de nuevos tenants pasó de depender de trabajo técnico ad-hoc a un flujo operativo controlado con políticas y automatización.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "Plano de Control SaaS B2B" {
  [Cliente Web] --> [Capa API]
  [Capa API] --> [Servicio de Contexto Tenant]
  [Capa API] --> [RBAC + Auth]
  [Capa API] --> [Billing + Suscripciones]
  [Capa API] --> [Servicio de Auditoría]

  [Servicio de Contexto Tenant] --> [PostgreSQL RLS]
  [RBAC + Auth] --> [Consola Admin]
  [Billing + Suscripciones] --> [Reportes Financieros]
}
@enduml
```

Al unificar tenancy, control de acceso y lógica comercial en una arquitectura fullstack, el sistema escaló clientes, equipos e ingresos sin multiplicar el riesgo operativo.
