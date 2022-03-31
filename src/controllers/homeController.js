const Contato = require('../models/ContatoModel')

exports.index = async function (req, res) {
    const contatos = await Contato.buscaContatos()
    res.render('index', {contatos})
}

