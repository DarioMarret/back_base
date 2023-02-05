import Sequelize from "sequelize"
import sequelize from "../../database/conexion_sequelize"

const Movimiento = sequelize.define("movimiento",{
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    detalle:{
        type: Sequelize.STRING(160),
        defaultValue: Sequelize.NOW
    },
    usuario:{
        type: Sequelize.STRING(160),
        allowNull:false,
    },
    ingreso:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0.0
    },
    salida:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0.0
    },
    empresa:{
        type: Sequelize.STRING(100),
        allowNull:false,
    },
    fecha:{
        type: Sequelize.STRING(160),
        defaultValue: Sequelize.NOW
    },
    estado: {
      type: Sequelize.STRING(20),
      defaultValue: "ACTIVO",
    },
  },
  {
    tableName:"movimiento" ,
    underscored:true,
    timestamps:false,
    schema:"esq_reporte"
  }
);

export default Movimiento;