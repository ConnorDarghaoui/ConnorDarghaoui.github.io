---
layout: project
title: "Bot Telegram NL2SQL para Cadena de Herramientas"
short_title: "05 / NL2SQL, TELEGRAM BOT"
image: "/assets/img/llm-inventory.png"
version: "v1.2.0"
status: "DESPLEGADO"
metric1_label: "Motor NL2SQL"
metric1_val: "DeepSeek / LangChain"
metric2_label: "Interfaz"
metric2_val: "API de Telegram"
align: left
lang: es
order: 5
---
El inventario de una inmensa cadena de herramientas no habla en SQL, pero el dueño revisando su teléfono un domingo por la tarde sí habla en preguntas. Este sistema tiende ese puente: un bot conversacional en Telegram donde el empresario simplemente pregunta lo que necesita saber, y un pipeline impulsado por el modelo de código abierto DeepSeek traduce silenciosamente esa intención en SQL preciso sobre su base de datos PostgreSQL. Ya sea consultando el ticket promedio o a quién se le vendió más, devuelve la verdad en lenguaje natural en segundos. Sin dashboards que navegar. Sin queries que escribir. Solo un chat, y una respuesta.
<!--more-->

### El Intérprete: Del Mensaje a la Consulta

Cuando el dueño escribe en Telegram preguntando, "¿Cuál fue el ticket promedio hoy y quién compró más taladros?", se apoya en un contexto compartido. Una base de datos no tiene contexto. El primer desafío es capturar la intención del usuario e inyectar el contexto arquitectónico necesario para que el LLM pueda construir una consulta válida.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

actor "Dueño de Cadena" as User
node "Bot de Telegram" as Telegram
node "Parser de Intención\n(LangChain + DeepSeek)" as Parser
database "Vector DB (pgvector)\n(Esquema y Ejemplos)" as Vector

User -> Telegram : "¿Ticket promedio hoy?"
Telegram -> Parser
Parser <--> Vector : Recupera Esquema (DDL)\ny Consultas Similares
Parser -> Parser : Inyecta Contexto
@enduml
```

En lugar de depender de modelos propietarios cerrados (como el equivalente occidental a "Claude"), desplegamos **DeepSeek** ,un modelo de código abierto de altísima capacidad, para actuar como nuestro motor de traducción. El sistema realiza una búsqueda semántica contra `pgvector` para extraer el esquema correcto de las herramientas, junto con ejemplos *few-shot* de consultas anteriores. Esencialmente, educa al modelo sobre cómo la empresa almacena sus datos milisegundos antes de que genere el SQL.

### Las Barreras de Contención: Limitando la Máquina

Un LLM es un motor de razonamiento formidable, pero también es impredecible. Darle a una IA acceso directo a datos de producción es un riesgo inaceptable a menos que se impongan fronteras estrictas e inquebrantables.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "SQL Generado" as SQL
node "Guardrail (Validador)\nRegex / AST" as Guardrail
database "Réplica de Solo Lectura\n(PostgreSQL)" as DB

SQL --> Guardrail
Guardrail --> Guardrail : Rechaza UPDATE/DROP/DELETE
Guardrail --> DB : Ejecuta Consulta Limpia
@enduml
```

Antes de que cualquier consulta toque la base de datos, debe sobrevivir a la fase de Guardrail. Esto analiza el Árbol de Sintaxis Abstracta (AST) del SQL para asegurar un cumplimiento absoluto con operaciones de solo lectura. Al sistema se le permite preguntar cualquier cosa, pero es físicamente incapaz de alterar la realidad.

### La Frontera Matemática: Hechos vs. Predicciones

Hay una regla arquitectónica innegociable en este sistema: **Los LLMs son para consultar la historia, no para predecir el futuro.**

Cuando el dueño pide predicciones de ventas o proyecciones de demanda, DeepSeek no alucina una respuesta. En su lugar, el pipeline detecta la intención predictiva y enruta la solicitud hacia módulos matemáticos en Python estrictamente deterministas.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "Pipeline Conversacional Híbrido" {
  [API de Telegram] --> [Backend FastAPI]
  
  [Backend FastAPI] --> [Enrutador de Intención]
  
  [Enrutador de Intención] --> [NL2SQL DeepSeek] : Consulta Histórica\n(Ej. Ticket Promedio)
  [Enrutador de Intención] --> [Modelos Matemáticos (Python)] : Consulta Predictiva\n(Ej. Pronóstico)
  
  [NL2SQL DeepSeek] --> [DB Solo Lectura]
  [Modelos Matemáticos (Python)] --> [DB Solo Lectura]
  
  [DB Solo Lectura] --> [Motor de Síntesis] : Vectores de Datos Crudos
  [Motor de Síntesis] --> [API de Telegram] : Respuesta Formateada
}
@enduml
```

Al desacoplar la extracción por lenguaje natural de la predicción matemática, logramos lo mejor de dos mundos. El bot de Telegram se siente como hablar con un humano, pero las predicciones están respaldadas por modelos matemáticos científicamente rigurosos en Python. Demuestra que la verdadera medida de un sistema de IA no es lo que puede adivinar, sino saber exactamente qué herramienta usar para cada trabajo.
