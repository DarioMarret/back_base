import Sequelize from "sequelize"
import sequelize from "../../database/conexion_sequelize"

const Producto = sequelize.define("producto",{
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    id_categoria: {
        type: Sequelize.INTEGER,
        allowNull:false,
    },
    producto:{
        type: Sequelize.STRING(160),
        allowNull:false,
    },
    precio_venta:{
        type: Sequelize.DECIMAL(10,2),
        allowNull:false,
    },
    fecha_creacion:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    porcentaje_iva:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0,
    },
    empresa:{
        type: Sequelize.STRING(100),
        allowNull:false,
    },
    estado: {
      type: Sequelize.STRING(1),
      defaultValue: "A",
    },
  },
  {
    tableName:"producto" ,
    underscored:true,
    timestamps:false,
    schema:"esq_productos"
  }
);

module.exports = Producto;