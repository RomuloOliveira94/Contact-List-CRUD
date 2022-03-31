//aqui no server chamamos os comandos necessários para nossa aplicação.
require('dotenv').config() //aqui chamamos o dot env, que vai guardar nossa senha do banco de dados, variaveis de ambiente, coisas confidenciais, deve ser ignorado pelo git.
const express = require('express'); //chamando o modulo express
const app = express(); //aqui ligado o express
const mongoose = require('mongoose') //chamando o mongoose, que modela nossa base de dados.
//conexao com o banco de dados mongodb e retorna promises
mongoose.connect(process.env.CONNECTIONSTRING)
.then(()=>{
    console.log('conectado a base de dados');
    app.emit('Pronto')
})
.catch(e => console.log(e))
const session = require('express-session')//salva id de sessoes, onde salva os dados de cookies
const MongoStore = require('connect-mongo') //informamos que a sessao sao salvas na base de dados
const flash = require('connect-flash') //as flash messages sao mensagens auto destrutivas, elas aparecem e depois somem, para erros de login, sucesso etc
const routes = require('./routes') //chamando as rotas para o servidor, rotas(paginas da sessao)
const path = require('path') //para conseguirmos navegação com mais facilidade
//const helmet = require('helmet') //chamando o helmet para deixar a aplicação mais segura
const csrf = require('csurf'); //tokens para nosso site ficar seguro e nao conseguirem postar nada de fora na nossa aplicação.
const  { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware') //são as funções que sao executadas no meio das rotas, no meio do caminho ou depois.

//app.use(helmet()) //
app.use(express.urlencoded({extended: true})) //aqui é a funão que deixa usarmos formularios par dentro aplicação
app.use(express.json()) //aqui faz o parse de jason para a aplicação
app.use(express.static('./public')) //chamando nosso arquivos estaticos, que nao mechem em nada, css, imagens etc

//aqui sao configurações de sessão
const sessionOptions = session({
    secret: 'akasdfj0út23453456+54qt23qv()',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true
    }
  });
   
//aqui estamos salvando os cookies, seguindo essas infos
app.use(sessionOptions)//chamando as opções
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views') ) //aqui buscamos o nosso view, que vai ser o nosso front end, para usarmos nossa aplicação, o caminho pode ser o comun tambem.
app.set('view engine', 'ejs') //aqui buscamos o renderizador. que vai renderizar nosso front a partir daqui do nosso backend, que no caso é o ejs

app.use(csrf());   
//os middlewares, aqui estamos chamando as funções
app.use(middlewareGlobal)
app.use(checkCsrfError)
app.use(csrfMiddleware)


app.use(routes); //fazendo o express monitorar as rotas
app.on('Pronto', () => {
    //aqui esta a funçao de ''abertura'' do servidor, ele vai ficar ouvindo o que o cliente solicitar.
app.listen(3000, () => { //3000 é a porta de abertura do servidor
    console.log('Acessar http://localhost:3000') //aqui são mensagens que sera exibidas no prompt quando o servidor for aberto
    console.log('Servidor executando na porta 3000')
})
})


//obs trabalharemos com o crud (create. read. update. delete) respectivamente post, get, put, delete, esses serao os métodos que utilizaremos no express.

//PADRÃO DE PROJETO MVC - models, views, controllers

//o trabalho do controller é escolher o model e o views que sera utilizado

// o model é que controla os dados, base de dados.

// e o view é o que o usuário vai ver