---
layout: project
title: "Demand Forecasting Engine"
short_title: "PREDICTIVE MODELING"
image: "/assets/img/demand.png"
version: "v1.8.9"
status: "RUNNING"
metric1_label: "Data Volume"
metric1_val: "~50M Records"
metric2_label: "Engine"
metric2_val: "PyMC / BigQuery"
align: left
lang: en
order: 11
---
Fifty million records don't lie, but without the right frame, they say nothing. This engine transforms raw transactional history into probabilistic foresight, modeling inventory demand through a Bayesian lens built on PyMC and orchestrated with MLflow. Where other systems guess linearly, this one reasons: it quantifies uncertainty, surfaces confidence intervals, and hands planners a number they can trust, not just believe.
<!--more-->

### Introduction

Foresight cannot be generated from fragmented history. The first architectural mandate was to consolidate over 50 million disparate transactional records sitting across multiple enterprise systems.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

database "ERP (Transactions)" as ERP
database "CRM (Sales)" as CRM
node "Data pipeline" as ELT
database "Google BigQuery\n(Feature Store)" as BQ

ERP --> ELT
CRM --> ELT
ELT --> BQ : Aggregated Features (Lag, Seasonality)
@enduml
```

Google BigQuery acts as the immutable foundation,the Feature Store. Here, raw events are aggregated into structured time-series data: rolling windows, lag variables, and seasonality coefficients. The model doesn't just look at what sold; it looks at *how* it sold over time.

### Development

Traditional machine learning produces point estimates,a single, rigid prediction. But reality is not rigid. A business doesn't just need to know that "we will sell 100 units"; it needs to know that "there is a 95% probability we will sell between 85 and 115 units." 

This is why we deployed PyMC.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam defaultFontName "Inter"

node "Priors\n(Known beliefs)" as Priors
node "Observed Data\n(Feature Store)" as Data
node "MCMC Sampling\n(PyMC)" as MCMC
node "Posteriors\n(Forecasts & Uncertainty)" as Posteriors

Priors --> MCMC
Data --> MCMC
MCMC --> Posteriors
@enduml
```

$$
P(\text{Demand}_t | X_t) \sim \mathcal{N}(\mu_t, \sigma^2)
$$

By treating demand as a probability distribution rather than a deterministic outcome, the system acknowledges the inherent chaos of the market. It calculates the *High Density Intervals (HDI)*, allowing planners to balance holding costs against stock-out risks mathematically, rather than emotionally.

### Conclusion

A model that lives on a data scientist's laptop is an academic exercise. A model that automatically retrains, versions itself, and deploys its predictions to production is an engineering asset.

```plantuml
@startuml
!option handwritten true
skinparam backgroundColor transparent
skinparam componentStyle rectangle

package "Predictive Ecosystem" {
  [Google BigQuery] --> [Feature Extraction]
  
  package "MLflow Orchestration" {
    [Feature Extraction] --> [Model Training (PyMC)]
    [Model Training (PyMC)] --> [Model Registry]
    note right of [Model Registry] : Artifact tracking\nand hyperparameter logging
  }
  
  [Model Registry] --> [Batch Inference]
  [Batch Inference] --> [PostgreSQL (Serving)]
  [PostgreSQL (Serving)] --> [Inventory Planning Dashboard]
}
@enduml
```

MLflow acts as the central nervous system. It strictly versions every training run, logs hyperparameters, and ensures reproducibility. The predictions are then written back into a serving layer, where the inventory systems digest them seamlessly. It is no longer a human forecasting the future; it is the infrastructure itself breathing predictability into the business.
