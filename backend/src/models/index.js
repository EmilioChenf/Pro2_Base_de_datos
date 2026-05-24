import { DataTypes } from 'sequelize';

import { sequelize } from '../db/sequelize.js';

export const Role = sequelize.define('roles', {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
});

export const Category = sequelize.define('categorias', {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true,
  },
});

export const Supplier = sequelize.define('proveedores', {
  id_proveedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  correo: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
});

export const Brand = sequelize.define('marcas', {
  id_marca: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true,
  },
});

export const PaymentMethod = sequelize.define('metodos_pago', {
  id_metodo_pago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
});

export const Product = sequelize.define('productos', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(180),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imagen: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_proveedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_marca: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export const User = sequelize.define('usuarios', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  google_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
  },
});

export const Customer = sequelize.define('clientes', {
  id_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
});

Category.hasMany(Product, { foreignKey: 'id_categoria' });
Product.belongsTo(Category, { foreignKey: 'id_categoria' });
Supplier.hasMany(Product, { foreignKey: 'id_proveedor' });
Product.belongsTo(Supplier, { foreignKey: 'id_proveedor' });
Brand.hasMany(Product, { foreignKey: 'id_marca' });
Product.belongsTo(Brand, { foreignKey: 'id_marca' });
Role.hasMany(User, { foreignKey: 'id_rol' });
User.belongsTo(Role, { foreignKey: 'id_rol' });
User.hasOne(Customer, { foreignKey: 'id_usuario' });
Customer.belongsTo(User, { foreignKey: 'id_usuario' });
