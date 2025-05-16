<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Microservicio de Pagos

Este es un microservicio de pagos construido con NestJS que forma parte de una arquitectura de microservicios.

## Descripción

El microservicio de pagos maneja todas las operaciones relacionadas con pagos en el sistema, incluyendo:
- Procesamiento de pagos
- Gestión de transacciones
- Integración con pasarelas de pago
- Historial de pagos

## Instalación

```bash
$ pnpm install
```
Clonar el archivo `.env.template` 

## Ejecución de la aplicación

```bash
# modo observador
$ pnpm run start:dev
```

## Tecnologías utilizadas

- NestJS
- TypeScript
- Docker
- PostgreSQL
- NATS (para comunicación entre microservicios)

## Estructura del proyecto

```
src/
├── main.ts
├── app.module.ts
├── payments/
│   ├── controllers/
│   ├── services/
│   ├── dto/
│   └── entities/
└── common/
    ├── decorators/
    └── filters/
```
