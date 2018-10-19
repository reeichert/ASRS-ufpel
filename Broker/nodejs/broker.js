'use strict'

var aedes = require('aedes')()
var ip = require('ip')
var server = require('net').createServer(aedes.handle)
var httpServer = require('http').createServer()
var ws = require('websocket-stream')
var port = 1883
var wsPort = 8888

ws.createServer({
    server: httpServer
}, aedes.handle)


httpServer.listen(wsPort, function () {
    console.log('websocket server listening on port', wsPort)
})

// Executa o servidor para funcionar na porta determinada
server.listen(port, function () {
    console.log('Broker funcionando na porta %d', port);
    console.log('Para acessar, configure o host do seu cliente para:');
    console.log('Host:', ip.address());
    console.log('Porta:', port);
    console.log('Obs: Não é preciso nenhum tipo de autenticação');
    console.log('\nQuando você conectar no broker, enviar mensagem ou se inscrever em algum tópico, ira aparecer aqui!');
    console.log('Aguardando conexão...');
})

// Caso de algum erro no cliente
aedes.on('clientError', function (client, err) {
    console.log('\n');
    console.log('ERROR - Ocorreu o seguinte erro  :(');
    console.log('client error', client.id, err.message, err.stack)
})

// Caso tenha algum erro de conexão
aedes.on('connectionError', function (client, err) {
    console.log('\n');
    console.log('ERROR - Ocorreu o seguinte erro  :(');
    console.log('client error', client, err.message, err.stack)
})

// Função chamada quando qualquer cliente envia uma mensagem
// para qualquer tópico
aedes.on('publish', function (packet, client) {
    if (client) {
        var messageFromClient = Buffer.from(packet.payload).toString('utf8');
        console.log('Cliente "%s" enviou a mensagem "%s" para o tópico "%s"', client.id, messageFromClient, packet.topic);
    }
})

// Função chamada quando um cliente assina algum tópico
aedes.on('subscribe', function (subscriptions, client) {
    if (client) {
        subscriptions.forEach((item) => {
            console.log('Cliente com id "%s" se inscreveu no tópico "%s"', client.id, item.topic);
        })
    }
})

// Quando um cliente novo se conecta
aedes.on('client', function (client) {
    console.log('Novo cliente conectado com o id:', client.id)
})

aedes.on('clientDisconnect', function (client) {
    console.log('Cliente desconectado com o id:', client.id)
})