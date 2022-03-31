const mongoose = require('mongoose'); //é feito pelo mongoose

//neste esquema os dados recebidos devem receber seguindo esse modelo
//utiliza a classe schema do mongoose
const HomeSchema = new mongoose.Schema({
    titulo: { type: String, required: true  }, //nesse caso o titulo tem que ser string e deve ser requerido
    descricao: String
}) 

const HomeModel = mongoose.model('Home', HomeSchema)

class Home{

}

module.exports = Home