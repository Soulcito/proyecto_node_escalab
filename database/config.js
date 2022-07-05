const mongoose = require('mongoose');

const  MONGODB_CNN  = process.env.MONGODB_CNN;

const dbConnection = async() => {

  try {

    await mongoose.connect(MONGODB_CNN);

    console.log('Base de datos online');
    
  } catch (error) {
    console.log(error);
    throw new Error('Error a la hora de iniciar la base de datos');
  }

}



module.exports = {
  dbConnection
}