CREATE DATABASE IF NOT EXISTS tienda_peluches
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'proy2'@'%' IDENTIFIED BY 'secret';
ALTER USER 'proy2'@'%' IDENTIFIED BY 'secret';
GRANT ALL PRIVILEGES ON tienda_peluches.* TO 'proy2'@'%';
FLUSH PRIVILEGES;
