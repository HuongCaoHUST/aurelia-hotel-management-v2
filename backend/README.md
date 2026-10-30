# Hotel Manager Backend

Spring Boot backend for Aurelia Hotel Manager.

The first implementation contains only the JPA model module. Application
logic is intentionally not added yet.

## Model package

`com.aurelia.hotelmanager.model`

- Access: `User`, `Role`, `Permission`, `AccountStatus`
- Guest: `Guest`
- Hotel catalog: `RoomType`, `Room`, `AmenityGroup`, `Amenity`
- Reservations: `Reservation`, `ReservationRoom`, `ReservationStatus`
- Billing: `Payment`, `PaymentMethod`, `PaymentStatus`
- Shared: `BaseEntity`

Repositories, services, DTOs, mappers and controllers will be added in the
next modules.

## Local database

MySQL is provided by the root `docker-compose.yml`. The container listens on
port `3306` internally and is exposed as host port `3307` because host port
`3306` is already in use.

```bash
docker compose up -d mysql
```

The backend can connect using the values in `.env` or the defaults in
`src/main/resources/application.properties`.
