import Sequelize from "sequelize"
import sequelize from "../../database/conexion_sequelize"

const Reporte = sequelize.define("reporte",{
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    secuencia:{
        type: Sequelize.STRING(160),
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
    cantidad:{
        type: Sequelize.INTEGER,
        allowNull:false,
    },
    fecha_creacion:{
        type: Sequelize.STRING,
        allowNull:false,
    },
    empresa:{
        type: Sequelize.STRING(100),
        allowNull:false,
    },
    estado: {
      type: Sequelize.STRING(20),
      defaultValue: "ACTIVO",
    },
  },
  {
    tableName:"reporte" ,
    underscored:true,
    timestamps:false,
    schema:"esq_reporte"
  }
);

export default Reporte;