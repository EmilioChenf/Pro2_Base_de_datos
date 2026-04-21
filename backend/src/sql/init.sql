CREATE DATABASE IF NOT EXISTS plushstore_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE plushstore_db;

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS proveedores (
  id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL UNIQUE,
  correo VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(30) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS marcas (
  id_marca INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS roles (
  id_rol INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NULL,
  id_rol INT NOT NULL,
  google_id VARCHAR(255) NULL UNIQUE,
  CONSTRAINT fk_usuarios_roles
    FOREIGN KEY (id_rol) REFERENCES roles (id_rol)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS clientes (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(30) NOT NULL,
  id_usuario INT NOT NULL UNIQUE,
  CONSTRAINT fk_clientes_usuarios
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS metodos_pago (
  id_metodo_pago INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS productos (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(180) NOT NULL,
  descripcion TEXT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  imagen VARCHAR(500) NOT NULL,
  id_categoria INT NOT NULL,
  id_proveedor INT NOT NULL,
  id_marca INT NOT NULL,
  CONSTRAINT fk_productos_categorias
    FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_productos_proveedores
    FOREIGN KEY (id_proveedor) REFERENCES proveedores (id_proveedor)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_productos_marcas
    FOREIGN KEY (id_marca) REFERENCES marcas (id_marca)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ventas (
  id_venta INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT NOT NULL,
  id_usuario INT NOT NULL,
  id_metodo_pago INT NOT NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_ventas_clientes
    FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_ventas_usuarios
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_ventas_metodos_pago
    FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pago (id_metodo_pago)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS detalle_venta (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_venta INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_detalle_venta_ventas
    FOREIGN KEY (id_venta) REFERENCES ventas (id_venta)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_detalle_venta_productos
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_usuarios_correo ON usuarios (correo);
CREATE INDEX idx_productos_nombre ON productos (nombre);
CREATE INDEX idx_ventas_fecha ON ventas (fecha);
CREATE INDEX idx_detalle_venta_producto ON detalle_venta (id_producto);

INSERT INTO roles (id_rol, nombre)
VALUES
  (1, 'ADMIN'),
  (2, 'CLIENTE')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO metodos_pago (id_metodo_pago, nombre)
VALUES
  (1, 'Efectivo'),
  (2, 'Tarjeta'),
  (3, 'Transferencia')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO categorias (id_categoria, nombre)
VALUES
  (1, 'Peluches'),
  (2, 'Accesorios'),
  (3, 'Ropa'),
  (4, 'Sets')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO marcas (id_marca, nombre)
VALUES
  (1, 'Escandalosos'),
  (2, 'Snoopy'),
  (3, 'PlushStore')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO proveedores (id_proveedor, nombre, correo, telefono)
VALUES
  (1, 'Distribuidora ABC', 'ventas@abcdist.com', '555-0101'),
  (2, 'Peanuts Imports', 'contacto@peanuts.com', '555-0202'),
  (3, 'Merchandising Plus', 'info@merchplus.com', '555-0303')
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  correo = VALUES(correo),
  telefono = VALUES(telefono);

INSERT INTO usuarios (id_usuario, nombre, correo, password, id_rol, google_id)
VALUES
  (1, 'Administrador Principal', 'admin@plushstore.com', '$2b$10$H4PTG0Rh1O0c2DX3Lu5nTuDeL0I7y.Lm319nakozw/D/W6UIoPvI2', 1, NULL),
  (2, 'Maria Gonzalez', 'maria@cliente.com', '$2b$10$zikQ6fj8DNSmQmvYbItr/uSD9qYNX0hJX3p1iHyT0olxRaQWJn2GK', 2, NULL),
  (3, 'Carlos Ruiz', 'carlos@cliente.com', '$2b$10$zikQ6fj8DNSmQmvYbItr/uSD9qYNX0hJX3p1iHyT0olxRaQWJn2GK', 2, NULL),
  (4, 'Ana Lopez', 'ana@cliente.com', '$2b$10$zikQ6fj8DNSmQmvYbItr/uSD9qYNX0hJX3p1iHyT0olxRaQWJn2GK', 2, NULL)
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  correo = VALUES(correo),
  password = VALUES(password),
  id_rol = VALUES(id_rol),
  google_id = VALUES(google_id);

INSERT INTO clientes (id_cliente, nombre, correo, telefono, id_usuario)
VALUES
  (1, 'Maria Gonzalez', 'maria@cliente.com', '555-1001', 2),
  (2, 'Carlos Ruiz', 'carlos@cliente.com', '555-1002', 3),
  (3, 'Ana Lopez', 'ana@cliente.com', '555-1003', 4)
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  correo = VALUES(correo),
  telefono = VALUES(telefono),
  id_usuario = VALUES(id_usuario);

INSERT INTO productos (
  id_producto, nombre, descripcion, precio, stock, imagen, id_categoria, id_proveedor, id_marca
)
VALUES
  (1, 'Peluche Panda', 'Peluche oficial de Panda de Escandalosos, suave y coleccionable.', 450.00, 18, 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=500&h=500&fit=crop', 1, 1, 1),
  (2, 'Peluche Polar', 'Peluche oficial de Polar, ideal para regalo.', 450.00, 9, 'https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=500&h=500&fit=crop', 1, 1, 1),
  (3, 'Peluche Pardo', 'Peluche oficial de Pardo en tamano grande.', 450.00, 14, 'https://images.unsplash.com/photo-1551051088-b0eb4c491fdb?w=500&h=500&fit=crop', 1, 1, 1),
  (4, 'Snoopy Clasico', 'Peluche clasico de Snoopy con licencia oficial.', 699.00, 20, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop', 1, 2, 2),
  (5, 'Snoopy Aviador', 'Edicion especial de Snoopy con traje de aviador.', 749.00, 8, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', 1, 2, 2),
  (6, 'Taza Escandalosos', 'Taza ceramica con ilustracion de los tres osos.', 199.00, 30, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop', 2, 3, 1),
  (7, 'Llavero Snoopy', 'Llavero de goma resistente con diseno de Snoopy.', 149.00, 50, 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&h=500&fit=crop', 2, 3, 2),
  (8, 'Sudadera Snoopy Flying Ace', 'Sudadera con capucha inspirada en Flying Ace.', 499.00, 16, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop', 3, 2, 2)
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  descripcion = VALUES(descripcion),
  precio = VALUES(precio),
  stock = VALUES(stock),
  imagen = VALUES(imagen),
  id_categoria = VALUES(id_categoria),
  id_proveedor = VALUES(id_proveedor),
  id_marca = VALUES(id_marca);

INSERT INTO ventas (id_venta, id_cliente, id_usuario, id_metodo_pago, fecha, total)
VALUES
  (1, 1, 1, 2, DATE_SUB(NOW(), INTERVAL 2 DAY), 848.00),
  (2, 2, 1, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 997.00),
  (3, 3, 1, 3, DATE_SUB(NOW(), INTERVAL 5 DAY), 1199.00),
  (4, 1, 1, 2, DATE_SUB(NOW(), INTERVAL 35 DAY), 1049.00),
  (5, 2, 1, 1, DATE_SUB(NOW(), INTERVAL 65 DAY), 898.00),
  (6, 3, 1, 3, DATE_SUB(NOW(), INTERVAL 95 DAY), 1498.00),
  (7, 1, 1, 2, DATE_SUB(NOW(), INTERVAL 125 DAY), 1399.00),
  (8, 2, 1, 1, DATE_SUB(NOW(), INTERVAL 155 DAY), 646.00)
ON DUPLICATE KEY UPDATE
  id_cliente = VALUES(id_cliente),
  id_usuario = VALUES(id_usuario),
  id_metodo_pago = VALUES(id_metodo_pago),
  fecha = VALUES(fecha),
  total = VALUES(total);

INSERT INTO detalle_venta (id_detalle, id_venta, id_producto, cantidad, precio_unitario, subtotal)
VALUES
  (1, 1, 1, 1, 450.00, 450.00),
  (2, 1, 6, 2, 199.00, 398.00),
  (3, 2, 4, 1, 699.00, 699.00),
  (4, 2, 7, 2, 149.00, 298.00),
  (5, 3, 2, 1, 450.00, 450.00),
  (6, 3, 5, 1, 749.00, 749.00),
  (7, 4, 3, 2, 450.00, 900.00),
  (8, 4, 7, 1, 149.00, 149.00),
  (9, 5, 4, 1, 699.00, 699.00),
  (10, 5, 6, 1, 199.00, 199.00),
  (11, 6, 5, 2, 749.00, 1498.00),
  (12, 7, 1, 2, 450.00, 900.00),
  (13, 7, 8, 1, 499.00, 499.00),
  (14, 8, 6, 1, 199.00, 199.00),
  (15, 8, 7, 3, 149.00, 447.00)
ON DUPLICATE KEY UPDATE
  id_venta = VALUES(id_venta),
  id_producto = VALUES(id_producto),
  cantidad = VALUES(cantidad),
  precio_unitario = VALUES(precio_unitario),
  subtotal = VALUES(subtotal);
