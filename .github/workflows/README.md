# CI / CD — Workflows

Los workflows de GitHub Actions se crearán en fases posteriores del proyecto.

## Previsto para la Fase 6 (scripts npm e infraestructura)

- `ci.yml` — lint + tests en cada push y pull request
- `deploy-staging.yml` — despliegue automático a staging en merge a `main`
- `deploy-production.yml` — despliegue a producción (manual o por tag)

## Por ahora

No hay automatización activa. El despliegue se realiza manualmente siguiendo `infra/plesk/README.md`.
