#!/bin/sh
set -eu

mysql_exec() {
  mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" --protocol=socket -e "$1"
}

create_database_and_user() {
  database="$1"
  username="$2"
  password="$3"
  mysql_exec "CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
  mysql_exec "CREATE USER IF NOT EXISTS '${username}'@'%' IDENTIFIED BY '${password}';"
  mysql_exec "ALTER USER '${username}'@'%' IDENTIFIED BY '${password}';"
  mysql_exec "GRANT ALL PRIVILEGES ON \`${database}\`.* TO '${username}'@'%';"
}

create_database_and_user auth_db auth_user "${AUTH_DB_PASSWORD}"
create_database_and_user booking_db booking_user "${BOOKING_DB_PASSWORD}"
create_database_and_user room_db room_user "${ROOM_DB_PASSWORD}"
create_database_and_user housekeeping_db housekeeping_user "${HOUSEKEEPING_DB_PASSWORD}"
create_database_and_user maintenance_db maintenance_user "${MAINTENANCE_DB_PASSWORD}"
create_database_and_user notification_db notification_user "${NOTIFICATION_DB_PASSWORD}"
mysql_exec "FLUSH PRIVILEGES;"
