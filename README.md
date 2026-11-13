# Aurelia Hotel Management System (v2)

A modern hotel management platform built with the Aurelia frontend framework and a Java backend. This project provides separate interfaces for customers and staff, along with a RESTful API for managing reservations, rooms, users, and more.

## Quick Start with Docker Compose

The project is fully containerized. You can start all services in one command:

```bash
docker-compose up -d
```

This will launch:

- **MySQL** – relational database (port 3306)
- **Minio** – object storage for photos and files (ports 9000/9001)
- **Backend** – Java SpringBoot API (port 8080)
- **Customer UI** – Aurelia customer-facing interface (via Nginx)
- **Staff UI** – Aurelia staff interface (via Nginx)
- **Nginx** – reverse proxy on port 80

### Environment Variables

Copy `.env` from the root and adjust values as needed:

```bash
cp .env.example .env
# edit .env to set DB credentials, JWT secrets, Minio credentials, etc.
```

### Services Details

| Service | Description | Ports |
|---------|-------------|-------|
| `mysql` | MySQL 8.4 database | 3306 |
| `minio` | Object storage | 9000 (API), 9001 (Console) |
| `backend` | SpringBoot API | 8080 |
| `customer` | Aurelia customer UI | served by Nginx |
| `staff` | Aurelia staff UI | served by Nginx |
| `nginx` | Reverse proxy & static serving | 80 |

### Stopping

```bash
docker-compose down
```

## Development

- Backend: see `backend/` for source and Maven/Gradle commands.
- Frontend (customer): see `frontend-customer/` for Aurelia CLI build.
- Frontend (staff): see `frontend-staff/` for Aurelia build.