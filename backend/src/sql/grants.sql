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
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'proy3'@'%';
GRANT 'rol_administrador' TO 'proy3'@'%';
SET DEFAULT ROLE 'rol_administrador' TO 'proy3'@'%';
FLUSH PRIVILEGES;
