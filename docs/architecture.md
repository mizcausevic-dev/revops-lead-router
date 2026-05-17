# Architecture

## Overview

`revops-lead-router` is a lightweight TypeScript + Express control surface for modeling the operational layer between inbound demand and CRM ownership.

## Surfaces

- `overview`
  - queue volume
  - speed-to-lead posture
  - critical routing lanes
- `queue`
  - lead-by-lead routing state
  - owner and next action
- `routing-rules`
  - why a lead enters a queue
  - which motion should receive it
- `bottlenecks`
  - policy defects
  - enrichment defects
  - ownership defects
- `verification`
  - what the repo proves about GTM systems

## Data Model

- `LeadRecord`
  - source, segment, score, fit band, owner, latency, route reason
- `RouteRule`
  - trigger, queue target, success rate, median latency
- `Bottleneck`
  - impact, blocked lead count, recommendation

## Design Principle

Routing should be inspectable by revenue teams. The system should explain:
- why a lead is here
- why this owner got it
- why latency is acceptable or not
- what policy should change next
