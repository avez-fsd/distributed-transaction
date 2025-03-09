import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import Food from './models/food.model'
import Packet from './models/packet.model'

const paymentDb: SequelizeOptions = {
    dialect: 'mysql',
    port: (process.env.DB_PORT || 3306) as number,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    benchmark: process.env.NODE_ENV === 'local',
    logging: process.env.NODE_ENV === 'local' ? console.log : false,
    dialectOptions: {
      decimalNumbers: true
    },
    models: [__dirname + `/*.model.ts`],
    modelMatch: (filename, member) => {
      return (
        filename.substring(0, filename.indexOf('.model.ts')) ===
        member.toLowerCase()
      )
    }
  }
  
  const dbConnection = new Sequelize(paymentDb)
  dbConnection.addModels([Food,Packet])

  export default dbConnection;