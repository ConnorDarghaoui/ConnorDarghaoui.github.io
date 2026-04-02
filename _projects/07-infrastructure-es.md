---
layout: project
title: "Infraestructura Cloud GitOps"
short_title: "07 / CLOUD & GITOPS"
image: "/assets/img/infrastructure.png"
version: "v3.0.0"
status: "INMUTABLE"
metric1_label: "Disponibilidad"
metric1_val: "99.99% (Multi-AZ)"
metric2_label: "Automatización"
metric2_val: "Terraform / Kubernetes"
align: left
lang: es
order: 7
---
La nube no es algo a lo que se le hace clic; es algo que se programa. Antes de esta iniciativa, los despliegues eran un ritual humano aterrador que involucraba llaves SSH, archivos de configuración ocultos y el miedo constante al tiempo de inactividad. Este proyecto erradicó el "servidor copo de nieve". Al declarar toda nuestra infraestructura como código con Terraform y entregar la autoridad de despliegue a un estricto ciclo GitOps, eliminamos por completo el factor humano de los entornos de producción. No solo construimos servidores más rápidos; le inyectamos precisión matemática e inmutabilidad a nuestra arquitectura.
<!--more-->

### El Plano Inmutable

Crear un servidor manualmente garantiza que, con el tiempo, nadie sepa exactamente cómo fue construido. Este fenómeno, conocido como "deriva de configuración" (*configuration drift*), es el asesino silencioso de la arquitectura moderna. El primer paso fue encerrar las llaves del reino dentro de un repositorio Git.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Repositorio Git\n(Infraestructura)" as Git
node "CLI de Terraform\n(Pipeline CI/CD)" as TF
cloud "Proveedor Cloud\n(AWS / GCP)" as Cloud

Git --> TF : 'terraform apply'
TF --> Cloud : Aprovisiona VPC, RDS, EKS
@enduml
```

Usando Terraform, cada Red Privada Virtual, cada balanceador de carga y cada rol de seguridad IAM está explícitamente definido en lenguaje HCL. Si un ingeniero necesita abrir un puerto en el firewall, no toca la consola de AWS; envía un Pull Request. La infraestructura ya no es una entidad física; es un artefacto de software compilado.

### El Controlador de Despliegue

Aprovisionar el hardware es solo la mitad de la batalla. ¿Cómo despliegas los microservicios en ese hardware sin tumbar el sistema? La respuesta es GitOps.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Repositorio Git\n(Manifiestos App)" as Repo
node "ArgoCD / Flux\n(Controlador GitOps)" as GitOps
node "Clúster Kubernetes" as K8s

Repo <-- GitOps : Lee estado deseado
GitOps --> K8s : Aplica estado actual
GitOps --> GitOps : Reconciliación continua
@enduml
```

En lugar de tener un pipeline de CI empujando código agresivamente hacia el clúster (y rezando para que funcione), invertimos el paradigma. Un controlador GitOps, posicionado *dentro* del clúster de Kubernetes, observa continuamente el repositorio Git. Si el repositorio cambia, el controlador descarga automáticamente la nueva imagen y orquesta un *Rolling Update* milimétrico. Si las pruebas de salud fallan, revierte los cambios casi instantáneamente.

### El Ecosistema Maestro de Automatización

Cuando combinas la Infraestructura como Código (IaC) con GitOps, creas un entorno que se cura a sí mismo. Puedes eliminar un clúster entero de Kubernetes de forma maliciosa y, con solo apuntar Terraform y ArgoCD al repositorio maestro de Git, la empresa entera se reconstruirá de forma autónoma en cuestión de minutos.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "Ecosistema Cloud Cero-Downtime" {
  [Desarrollador / Arquitecto] --> [GitHub Pull Request]
  
  package "Integración Continua (CI)" {
    [GitHub Pull Request] --> [Pruebas Unitarias]
    [Pruebas Unitarias] --> [Construir Imagen Docker]
    [Construir Imagen Docker] --> [Registry de Imágenes]
  }
  
  package "Plano de Datos Kubernetes" {
    [Controlador GitOps] ..> [GitHub Pull Request] : Detecta nuevo Manifiesto
    [Controlador GitOps] --> [Deployment K8s] : Sincroniza Estado
    [Deployment K8s] ..> [Registry de Imágenes] : Descarga nueva Imagen
    [Deployment K8s] --> [Réplicas (Pods)] : Actualización Gradual (Rolling Update)
  }
}
@enduml
```

Eliminamos por completo la figura de "Los Viernes de Despliegue". Las actualizaciones a producción ahora ocurren docenas de veces al día, en silencio, de forma autónoma, y sin fanfarrias. Al tratar a la infraestructura como software, no solo mejoramos la eficiencia operativa; eliminamos el miedo sistémico a romper producción.
