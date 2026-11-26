# Aurelia Hotel Management

Aurelia Hotel Management is a web-based hotel management system designed for a luxury hotel in Ha Long.

## Main Features

- Room search and booking
- Customer management
- Check-in / Check-out
- Room status management
- Housekeeping management
- Equipment and maintenance tracking
- Payment management
- Staff and role management
- Monitoring and system logs

## Tech Stack

- React
- Java Spring Boot
- MySQL
- Redis
- Kafka
- MinIO
- Nginx
- Docker
- Docker Compose local development

## System Structure

```text
Customer Web / Staff Web → Nginx → API Gateway → domain services
                                                    ├── MySQL (database per service)
                                                    ├── Redis
                                                    ├── MinIO
                                                    └── Kafka (KRaft)

## Local Docker development

The Compose topology includes runnable Spring Boot/Actuator and React/Vite scaffolds.
Replace each scaffold with that service's business source, keeping its `pom.xml`, `src/`
and Docker build contract intact.

For `http://localhost/staff/`, configure the staff Vite project with
`base: process.env.VITE_BASE_PATH || '/'`; Compose supplies `/staff/` at build time.

```bash
cp .env.example .env
docker compose up -d --build
docker compose ps
docker compose logs -f api-gateway
```

Open `http://localhost`, `http://localhost/staff/`, and `http://localhost/api/`.
For virtual hosts add `127.0.0.1 hotel.local staff.hotel.local api.hotel.local` to
`/etc/hosts`. MinIO's console is `http://localhost:9001`.

Stop containers with `docker compose down`; named volumes persist. To intentionally
erase all local infrastructure data, use `docker compose down -v`.
