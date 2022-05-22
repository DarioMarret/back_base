import sequelize from "../../database/conexion_sequelize"

const schema = [
    // {"esquema":"esq_usuario"},
    // {"esquema":"esq_productos"},
    {"esquema":"esq_reporte"},
  ];

  for (var index = 0; index < schema.length; index++) {
    sequelize.createSchema(schema[index].esquema).then(()=>{
      if (index == schema.length) {
        sequelize.sync({force:false}).then(() => {
          console.log("Esquema creado ")
        }).catch((err) => console.log("response:  ", err.original));
      }
    }).catch((err) => {
      if (err){
        sequelize.sync({force:false}).then(() => {
        }).catch((err) => console.log("response:  ", err.original));
      }
    });
  }
