CREATE DATABASE IF NOT EXISTS tienda_peluches
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'proy3'@'%' IDENTIFIED BY 'secret';
ALTER USER 'proy3'@'%' IDENTIFIED BY 'secret';

CREATE ROLE IF NOT EXISTS
  'rol_administrador',
  'rol_gerente',
  'rol_vendedor',
  'rol_inventario',
  'rol_cliente';

REVOKE ALL PRIVILEGES, GRANT OPTION FROM
  'rol_administrador',
  'rol_gerente',
  'rol_vendedor',
  'rol_inventario',
  'rol_cliente';

CREATE USER IF NOT EXISTS 'db_admin_demo'@'%' IDENTIFIED BY 'secret';
CREATE USER IF NOT EXISTS 'db_gerente_demo'@'%' IDENTIFIED BY 'secret';
CREATE USER IF NOT EXISTS 'db_vendedor_demo'@'%' IDENTIFIED BY 'secret';
CREATE USER IF NOT EXISTS 'db_inventario_demo'@'%' IDENTIFIED BY 'secret';
CREATE USER IF NOT EXISTS 'db_cliente_demo'@'%' IDENTIFIED BY 'secret';
GRANT 'rol_administrador' TO 'proy3'@'%';
GRANT 'rol_administrador' TO 'db_admin_demo'@'%';
GRANT 'rol_gerente' TO 'db_gerente_demo'@'%';
GRANT 'rol_vendedor' TO 'db_vendedor_demo'@'%';
GRANT 'rol_inventario' TO 'db_inventario_demo'@'%';
GRANT 'rol_cliente' TO 'db_cliente_demo'@'%';
SET DEFAULT ROLE 'rol_administrador' TO 'proy3'@'%';
SET DEFAULT ROLE 'rol_administrador' TO 'db_admin_demo'@'%';
SET DEFAULT ROLE 'rol_gerente' TO 'db_gerente_demo'@'%';
SET DEFAULT ROLE 'rol_vendedor' TO 'db_vendedor_demo'@'%';
SET DEFAULT ROLE 'rol_inventario' TO 'db_inventario_demo'@'%';
SET DEFAULT ROLE 'rol_cliente' TO 'db_cliente_demo'@'%';
FLUSH PRIVILEGES;

USE tienda_peluches;

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
  (2, 'GERENTE'),
  (3, 'VENDEDOR'),
  (4, 'INVENTARIO'),
  (5, 'CLIENTE')
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
  (2, 'Llaveros'),
  (3, 'Tazas'),
  (4, 'Playeras'),
  (5, 'Sudaderas'),
  (6, 'Mochilas'),
  (7, 'Stickers'),
  (8, 'Termos'),
  (9, 'Gorras'),
  (10, 'Libretas'),
  (11, 'Mousepads'),
  (12, 'Figuras')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO marcas (id_marca, nombre)
VALUES
  (1, 'Escandalosos'),
  (2, 'Snoopy')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO proveedores (id_proveedor, nombre, correo, telefono)
VALUES
  (1, 'Distribuidora Escandalosos GT', 'ventas@escandalososgt.com', '555-0101'),
  (2, 'Peanuts Imports Guatemala', 'contacto@peanutsgt.com', '555-0202'),
  (3, 'Merchandising Plus Guatemala', 'info@merchplusgt.com', '555-0303')
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  correo = VALUES(correo),
  telefono = VALUES(telefono);

INSERT INTO usuarios (id_usuario, nombre, correo, password, id_rol, google_id)
VALUES
  (1, 'Administrador Principal', 'admin@tienda.com', '$2b$10$0Q9aYFnQ8n1HqpNwHewtyeTlBsmGSc2QpORIyoJN/R4dT6o6zUb.i', 1, NULL),
  (2, 'Gerente Demo', 'gerente@tienda.com', '$2b$10$0Q9aYFnQ8n1HqpNwHewtyeTlBsmGSc2QpORIyoJN/R4dT6o6zUb.i', 2, NULL),
  (3, 'Vendedor Demo', 'vendedor@tienda.com', '$2b$10$0Q9aYFnQ8n1HqpNwHewtyeTlBsmGSc2QpORIyoJN/R4dT6o6zUb.i', 3, NULL),
  (4, 'Inventario Demo', 'inventario@tienda.com', '$2b$10$0Q9aYFnQ8n1HqpNwHewtyeTlBsmGSc2QpORIyoJN/R4dT6o6zUb.i', 4, NULL),
  (5, 'Cliente Demo', 'cliente@tienda.com', '$2b$10$9cc.dO93t.niu7UMalJ/NeZqnmuXpdRpmWix8kFeOcVrCvEyfGMcq', 5, NULL),
  (6, 'Carlos Ruiz', 'carlos@cliente.com', '$2b$10$9cc.dO93t.niu7UMalJ/NeZqnmuXpdRpmWix8kFeOcVrCvEyfGMcq', 5, NULL),
  (7, 'Ana Lopez', 'ana@cliente.com', '$2b$10$9cc.dO93t.niu7UMalJ/NeZqnmuXpdRpmWix8kFeOcVrCvEyfGMcq', 5, NULL)
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  correo = VALUES(correo),
  password = VALUES(password),
  id_rol = VALUES(id_rol),
  google_id = VALUES(google_id);

INSERT INTO clientes (id_cliente, nombre, correo, telefono, id_usuario)
VALUES
  (1, 'Cliente Demo', 'cliente@tienda.com', '555-1001', 5),
  (2, 'Carlos Ruiz', 'carlos@cliente.com', '555-1002', 6),
  (3, 'Ana Lopez', 'ana@cliente.com', '555-1003', 7)
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  correo = VALUES(correo),
  telefono = VALUES(telefono),
  id_usuario = VALUES(id_usuario);

INSERT INTO productos (
  id_producto, nombre, descripcion, precio, stock, imagen, id_categoria, id_proveedor, id_marca
)
VALUES
  (1, 'Peluche Panda Escandalosos', 'Peluche suave de Panda de Escandalosos, ideal para coleccionistas y regalos.', 189.90, 24, '/images/productos/peluche-panda-escandalosos.jpg', 1, 1, 1),
  (2, 'Peluche Polar Escandalosos', 'Peluche de Polar con acabado premium y textura extra suave.', 189.90, 18, '/images/productos/peluche-polar-escandalosos.jpg', 1, 1, 1),
  (3, 'Peluche Pardo Escandalosos', 'Peluche de Pardo de Escandalosos, abrazable y resistente para uso diario.', 189.90, 20, '/images/productos/peluche-pardo-escandalosos.jpg', 1, 1, 1),
  (4, 'Llavero Escandalosos', 'Llavero compacto con diseno de los tres osos, perfecto para mochila o llaves.', 34.90, 60, '/images/productos/llavero-escandalosos.jpg', 2, 3, 1),
  (5, 'Taza Escandalosos', 'Taza de ceramica con arte de Escandalosos, capacidad aproximada de 350 ml.', 59.90, 45, '/images/productos/taza-escandalosos.jpg', 3, 3, 1),
  (6, 'Playera Escandalosos', 'Playera casual de algodon con estampado frontal de Escandalosos.', 99.90, 35, '/images/productos/playera-escandalosos.jpg', 4, 3, 1),
  (7, 'Sudadera Escandalosos', 'Sudadera con capucha y estampado de los osos, comoda para clima fresco.', 219.90, 8, '/images/productos/sudadera-escandalosos.jpg', 5, 3, 1),
  (8, 'Mochila Escandalosos', 'Mochila con compartimentos amplios y diseno inspirado en Escandalosos.', 199.90, 7, '/images/productos/mochila-escandalosos.jpg', 6, 3, 1),
  (9, 'Sticker Pack Escandalosos', 'Paquete de stickers decorativos de Escandalosos para laptop, libreta o botella.', 24.90, 80, '/images/productos/stickers-escandalosos.jpg', 7, 3, 1),
  (10, 'Termo Escandalosos', 'Termo reutilizable con ilustracion de Escandalosos y tapa de seguridad.', 129.90, 28, '/images/productos/termo-escandalosos.jpg', 8, 3, 1),
  (11, 'Peluche Snoopy Clasico', 'Peluche clasico de Snoopy con detalles bordados y textura suave.', 179.90, 22, '/images/productos/peluche-snoopy-clasico.jpg', 1, 2, 2),
  (12, 'Llavero Snoopy', 'Llavero de Snoopy en goma flexible, ligero y resistente.', 34.90, 70, '/images/productos/llavero-snoopy.jpg', 2, 2, 2),
  (13, 'Taza Snoopy', 'Taza de ceramica con ilustracion de Snoopy, ideal para cafe o chocolate.', 59.90, 42, '/images/productos/taza-snoopy.jpg', 3, 2, 2),
  (14, 'Playera Snoopy', 'Playera de algodon con grafico minimalista de Snoopy.', 99.90, 36, '/images/productos/playera-snoopy.jpg', 4, 2, 2),
  (15, 'Sudadera Snoopy', 'Sudadera comoda con capucha y estampado de Snoopy.', 229.90, 6, '/images/productos/sudadera-snoopy.jpg', 5, 2, 2),
  (16, 'Gorra Snoopy', 'Gorra ajustable con bordado frontal de Snoopy.', 89.90, 33, '/images/productos/gorra-snoopy.jpg', 9, 2, 2),
  (17, 'Mochila Snoopy', 'Mochila practica con diseno de Snoopy y bolsillo frontal.', 199.90, 9, '/images/productos/mochila-snoopy.jpg', 6, 2, 2),
  (18, 'Libreta Snoopy', 'Libreta rayada con portada de Snoopy, ideal para escuela u oficina.', 44.90, 55, '/images/productos/libreta-snoopy.jpg', 10, 2, 2),
  (19, 'Mousepad Snoopy', 'Mousepad suave con base antideslizante y arte de Snoopy.', 49.90, 48, '/images/productos/mousepad-snoopy.jpg', 11, 2, 2),
  (20, 'Figura Snoopy', 'Figura coleccionable de Snoopy para escritorio o vitrina.', 149.90, 5, '/images/productos/figura-snoopy.jpg', 12, 2, 2)
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
  (1, 1, 1, 2, DATE_SUB(NOW(), INTERVAL 2 DAY), 389.70),
  (2, 2, 1, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 474.70),
  (3, 3, 1, 3, DATE_SUB(NOW(), INTERVAL 5 DAY), 249.80),
  (4, 1, 1, 2, DATE_SUB(NOW(), INTERVAL 35 DAY), 599.70),
  (5, 2, 1, 1, DATE_SUB(NOW(), INTERVAL 65 DAY), 134.80),
  (6, 3, 1, 3, DATE_SUB(NOW(), INTERVAL 95 DAY), 119.80),
  (7, 1, 1, 2, DATE_SUB(NOW(), INTERVAL 125 DAY), 579.70),
  (8, 2, 1, 1, DATE_SUB(NOW(), INTERVAL 155 DAY), 759.60)
ON DUPLICATE KEY UPDATE
  id_cliente = VALUES(id_cliente),
  id_usuario = VALUES(id_usuario),
  id_metodo_pago = VALUES(id_metodo_pago),
  fecha = VALUES(fecha),
  total = VALUES(total);

INSERT INTO detalle_venta (id_detalle, id_venta, id_producto, cantidad, precio_unitario, subtotal)
VALUES
  (1, 1, 1, 1, 189.90, 189.90),
  (2, 1, 6, 2, 99.90, 199.80),
  (3, 2, 4, 1, 34.90, 34.90),
  (4, 2, 7, 2, 219.90, 439.80),
  (5, 3, 2, 1, 189.90, 189.90),
  (6, 3, 5, 1, 59.90, 59.90),
  (7, 4, 3, 2, 189.90, 379.80),
  (8, 4, 7, 1, 219.90, 219.90),
  (9, 5, 4, 1, 34.90, 34.90),
  (10, 5, 6, 1, 99.90, 99.90),
  (11, 6, 5, 2, 59.90, 119.80),
  (12, 7, 1, 2, 189.90, 379.80),
  (13, 7, 8, 1, 199.90, 199.90),
  (14, 8, 6, 1, 99.90, 99.90),
  (15, 8, 7, 3, 219.90, 659.70)
ON DUPLICATE KEY UPDATE
  id_venta = VALUES(id_venta),
  id_producto = VALUES(id_producto),
  cantidad = VALUES(cantidad),
  precio_unitario = VALUES(precio_unitario),
  subtotal = VALUES(subtotal);

DROP VIEW IF EXISTS vista_resumen_ventas;

CREATE VIEW vista_resumen_ventas AS
SELECT
  v.id_venta,
  v.fecha,
  c.nombre AS cliente,
  u.nombre AS usuario,
  mp.nombre AS metodo_pago,
  v.total
FROM ventas v
INNER JOIN clientes c ON c.id_cliente = v.id_cliente
INNER JOIN usuarios u ON u.id_usuario = v.id_usuario
INNER JOIN metodos_pago mp ON mp.id_metodo_pago = v.id_metodo_pago;

DELIMITER //

DROP PROCEDURE IF EXISTS sp_registrar_proveedor//
CREATE PROCEDURE sp_registrar_proveedor(
  IN p_nombre VARCHAR(150),
  IN p_correo VARCHAR(150),
  IN p_telefono VARCHAR(30),
  OUT p_id_proveedor INT
)
BEGIN
  INSERT INTO proveedores (nombre, correo, telefono)
  VALUES (TRIM(p_nombre), TRIM(p_correo), TRIM(p_telefono));

  SET p_id_proveedor = LAST_INSERT_ID();
END//

DROP PROCEDURE IF EXISTS sp_actualizar_stock_producto//
CREATE PROCEDURE sp_actualizar_stock_producto(
  IN p_id_producto INT,
  IN p_stock INT,
  OUT p_stock_final INT
)
BEGIN
  IF p_stock < 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'El stock no puede ser negativo.';
  END IF;

  UPDATE productos
  SET stock = p_stock
  WHERE id_producto = p_id_producto;

  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'El producto no existe.';
  END IF;

  SELECT stock INTO p_stock_final
  FROM productos
  WHERE id_producto = p_id_producto;
END//

DROP PROCEDURE IF EXISTS sp_reporte_ventas_mensuales//
CREATE PROCEDURE sp_reporte_ventas_mensuales(IN p_meses INT)
BEGIN
  SELECT
    YEAR(fecha) AS anio,
    MONTH(fecha) AS mes_numero,
    COALESCE(SUM(total), 0) AS ventas
  FROM ventas
  WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL p_meses MONTH)
  GROUP BY YEAR(fecha), MONTH(fecha)
  ORDER BY anio ASC, mes_numero ASC;
END//

DROP PROCEDURE IF EXISTS sp_productos_bajo_stock//
CREATE PROCEDURE sp_productos_bajo_stock(IN p_stock_minimo INT)
BEGIN
  SELECT
    id_producto,
    nombre,
    stock,
    p_stock_minimo AS stock_minimo,
    GREATEST(p_stock_minimo - stock, 0) + p_stock_minimo AS reorden_sugerido
  FROM productos
  WHERE stock < p_stock_minimo
  ORDER BY stock ASC, nombre ASC;
END//

DROP PROCEDURE IF EXISTS sp_registrar_venta_completa//
CREATE PROCEDURE sp_registrar_venta_completa(
  IN p_id_cliente INT,
  IN p_id_usuario INT,
  IN p_id_metodo_pago INT,
  IN p_items JSON,
  OUT p_id_venta INT
)
BEGIN
  DECLARE v_total DECIMAL(10, 2) DEFAULT 0;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  IF JSON_LENGTH(p_items) IS NULL OR JSON_LENGTH(p_items) = 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'La venta debe incluir al menos un producto.';
  END IF;

  IF (
    SELECT COUNT(*)
    FROM JSON_TABLE(
      p_items,
      '$[*]' COLUMNS (
        id_producto INT PATH '$.id_producto',
        cantidad INT PATH '$.cantidad'
      )
    ) AS jt
    LEFT JOIN productos p ON p.id_producto = jt.id_producto
    WHERE jt.cantidad <= 0 OR p.id_producto IS NULL OR p.stock < jt.cantidad
  ) > 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Producto invalido o stock insuficiente.';
  END IF;

  SELECT COALESCE(SUM(p.precio * jt.cantidad), 0)
    INTO v_total
  FROM JSON_TABLE(
    p_items,
    '$[*]' COLUMNS (
      id_producto INT PATH '$.id_producto',
      cantidad INT PATH '$.cantidad'
    )
  ) AS jt
  INNER JOIN productos p ON p.id_producto = jt.id_producto
  WHERE jt.cantidad > 0;

  INSERT INTO ventas (id_cliente, id_usuario, id_metodo_pago, fecha, total)
  VALUES (p_id_cliente, p_id_usuario, p_id_metodo_pago, NOW(), v_total);

  SET p_id_venta = LAST_INSERT_ID();

  INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
  SELECT
    p_id_venta,
    p.id_producto,
    jt.cantidad,
    p.precio,
    p.precio * jt.cantidad
  FROM JSON_TABLE(
    p_items,
    '$[*]' COLUMNS (
      id_producto INT PATH '$.id_producto',
      cantidad INT PATH '$.cantidad'
    )
  ) AS jt
  INNER JOIN productos p ON p.id_producto = jt.id_producto;

  UPDATE productos p
  INNER JOIN JSON_TABLE(
    p_items,
    '$[*]' COLUMNS (
      id_producto INT PATH '$.id_producto',
      cantidad INT PATH '$.cantidad'
    )
  ) AS jt ON jt.id_producto = p.id_producto
  SET p.stock = p.stock - jt.cantidad;

  COMMIT;
END//

DELIMITER ;

GRANT ALL PRIVILEGES ON tienda_peluches.* TO 'rol_administrador';
GRANT SELECT ON tienda_peluches.vista_resumen_ventas TO 'rol_gerente';
GRANT SELECT ON tienda_peluches.productos TO 'rol_gerente';
GRANT SELECT ON tienda_peluches.categorias TO 'rol_gerente';
GRANT SELECT ON tienda_peluches.proveedores TO 'rol_gerente';
GRANT SELECT ON tienda_peluches.marcas TO 'rol_gerente';
GRANT SELECT ON tienda_peluches.clientes TO 'rol_gerente';
GRANT SELECT ON tienda_peluches.usuarios TO 'rol_gerente';
GRANT SELECT ON tienda_peluches.metodos_pago TO 'rol_gerente';
GRANT SELECT, INSERT ON tienda_peluches.ventas TO 'rol_gerente';
GRANT SELECT, INSERT ON tienda_peluches.detalle_venta TO 'rol_gerente';
GRANT EXECUTE ON tienda_peluches.* TO 'rol_gerente';
GRANT SELECT ON tienda_peluches.productos TO 'rol_vendedor';
GRANT SELECT ON tienda_peluches.clientes TO 'rol_vendedor';
GRANT SELECT ON tienda_peluches.usuarios TO 'rol_vendedor';
GRANT SELECT, INSERT ON tienda_peluches.ventas TO 'rol_vendedor';
GRANT SELECT, INSERT ON tienda_peluches.detalle_venta TO 'rol_vendedor';
GRANT SELECT ON tienda_peluches.metodos_pago TO 'rol_vendedor';
GRANT EXECUTE ON tienda_peluches.* TO 'rol_vendedor';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_peluches.productos TO 'rol_inventario';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_peluches.categorias TO 'rol_inventario';
GRANT SELECT, INSERT, UPDATE, DELETE ON tienda_peluches.proveedores TO 'rol_inventario';
GRANT SELECT ON tienda_peluches.marcas TO 'rol_inventario';
GRANT EXECUTE ON tienda_peluches.* TO 'rol_inventario';
GRANT SELECT ON tienda_peluches.productos TO 'rol_cliente';
GRANT SELECT ON tienda_peluches.categorias TO 'rol_cliente';
GRANT SELECT ON tienda_peluches.marcas TO 'rol_cliente';
GRANT SELECT ON tienda_peluches.metodos_pago TO 'rol_cliente';
GRANT SELECT, INSERT, UPDATE ON tienda_peluches.clientes TO 'rol_cliente';
GRANT SELECT, INSERT ON tienda_peluches.ventas TO 'rol_cliente';
GRANT SELECT, INSERT ON tienda_peluches.detalle_venta TO 'rol_cliente';
GRANT EXECUTE ON tienda_peluches.* TO 'rol_cliente';
FLUSH PRIVILEGES;
