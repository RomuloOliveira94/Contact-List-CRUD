const mongoose = require('mongoose'); //é feito pelo mongoose
const validator = require('validator')

//neste esquema os dados recebidos devem receber seguindo esse modelo
//utiliza a classe schema do mongoose
const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true  },
    sobrenome: { type: String, required: false , default:'' },
    email: { type: String, required: false, default:''  },
    telefone: { type: String, required: false, default:''  },
    criadoEm: { type: Date, default: Date.now  },
}) 

const ContatoModel = mongoose.model('Contato', ContatoSchema)

function Contato(body){
    this.body = body
    this.errors = [];
    this.user = null
}

//metodo estatico
Contato.buscaPorId = async function (id) {
    if(typeof id !== 'string') return;
    const contato = await ContatoModel.findById(id);
    return contato
}

Contato.buscaContatos = async function (id) {
    const contatos = await ContatoModel.find()
    .sort({criadoEm: -1});
    return contatos
}

Contato.delete = async function (id) {
    if(typeof id !== 'string') return;
    const contatos = await ContatoModel.findOneAndDelete({_id: id})
    return contatos
}

Contato.prototype.register = async function(){
    this.valida()
    if(this.errors.length > 0) return;
    this.contato = await ContatoModel.create(this.body)
}

Contato.prototype.valida = function() {
    this.cleanUp()
    //validação
    //o e-mail tem que ser valido
    if(this.body.email && !validator.isEmail(this.body.email)) {
        this.errors.push('E-mail inválido')
    }
    if(!this.body.nome) this.errors.push('Nome é um campo obrigatório')
    if(!this.body.email && !this.body.telefone) {
    this.errors.push('Pelos menos um contato precisa ser enviado, E-mail ou Telefone.')
}
}

Contato.prototype.cleanUp = function () {
    for (const key in this.body) {
        if(typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    this.body = {
        nome:this.body.nome,
        sobrenome:this.body.sobrenome,
        email:this.body.email,
        telefone:this.body.telefone,
    }
}

Contato.prototype.edit = async function (id) {
    if(typeof id !== 'string') return;
    this.valida()
    if(this.errors.length > 0) return
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true })
}



module.exports = Contato