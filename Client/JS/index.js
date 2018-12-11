var MQTT = require("async-mqtt");

var client = MQTT.connect("mqtt://192.168.0.103:1883");

var myPosition = 11;
var currentCar = 0;
var requestedCar = 0;

var currentPallet = 0;
var requestedPallet = 0;

// eixo_bruto, eixo_usinado, engrenagem_bruta, 
// engrenagem_usinada, conjunto, carcaca_bruta,
// carcaca_usinada, caixa_pronta, descarte_geral

// abordagem 1

/*var estoque = {
    'eixo_bruto': [
        {
            "index": 1,
            "xxx": "algo"
        },
        {
            "index": 2,
            "xxx": "algo"
        }
    ], // 1: 1 - 10
    'eixo_usinado': [], // 2: 11 - 20
    'engrenagem_bruta': [], // 3:  21 - 30
    'engrenagem_usinada': [], //4:  31 - 40
    'conjunto': [], //5:  41 - 50
    'carcaca_bruta': [], //6:  51 - 60
    'carcaca_usinada': [], //7:  61 - 70
    'caixa_pronta': [], //8:  71 - 80
    'descarte_geral': [] //9:  81 - 90
};*/


// Abordagem 2

var estoque = {
    'eixo_bruto': [], // 0: 1 - 10
    'eixo_usinado': [], // 1: 11 - 20
    'engrenagem_bruta': [], // 2:  21 - 30
    'engrenagem_usinada': [], //3:  31 - 40
    'conjunto': [], //4:  41 - 50
    'carcaca_bruta': [], //7:  51 - 60
    'carcaca_usinada': [], //6:  61 - 70
    'caixa_pronta': [], //7:  71 - 80
    'descarte_geral': [] //8:  81 - 90
};

client.on("connect", onConnect);
client.on("message", onMessage);

// 
// onMessag e
// 
// Funcao quando o Client recebe uma nova mensagem do Broker
// 
async function onMessage(topic, message) {
    var json = message.toString();
    console.log("\n");
    console.log("Mensagem recebida no tópico: ", topic);
    console.log("Mensagem: ", json);

    console.log("Verificando se a mensagem é válida...");
    
    if (!isValidJSON(json)) {
        console.log("Mensagem inválida!")
        return;
    }
    console.log("Mensagem válida!\n")
    
    obj = JSON.parse(message.toString());

    if (obj.est == null || obj.entidade == null) {
        return;
    }

    var ent = obj.entidade;
    var est = obj.est;

    if (estoque[ent] == null) {
        console.log('Entidade não existe no estoque!');
        return;
    }

    if (estoque[ent].length == 0) {
        console.log("Estoque para entidade \"" + ent + "\" esta vazio.");

        var index = Object.keys(estoque).indexOf(ent);
        var pallet = (index * 10) + 1;
        console.log('Mandando objeto no primeiro pallet disponível: ', pallet);
        estoque[ent].push('x')

        console.log(estoque);
    } else {
        var availablePallets = 10 - estoque[ent].length;
        console.log("Estoque para entidade \"" + ent + "\" contem " + availablePallets + " pallets disponíveis!");

        var index = Object.keys(estoque).indexOf(ent);
        var pallet = (index * 10) + estoque[ent].length + 1;
        console.log('Mandando objeto no pallet: ', pallet);
        
        estoque[ent].push('x')
        console.log(estoque);
    }
}

// 
// onConnect 
// 
// Funcao quando o Client se conecta no Broker
// 
async function onConnect() {
    console.log("Iniciando...");
    console.log("Assinando o topico:");
    console.log("--------");
    console.log("asrs/pedidos");
    console.log("asrs/carros");
    console.log("--------");
    try {
        await client.subscribe("asrs/pedidos");
        await client.subscribe("asrs/carros");
    } catch (e) {
        // Do something about it!
        console.log(e.stack);
        process.exit();
    }
}

// Helpers 
function isValidJSON(jsonString) {
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return false;
};

/*
####ASRS####

MANAGER MANDA PEDIDO PRO ASRS:
tópico: 'asrs/pedidos'
json: {"est": x,"entidade":entidade requerida}

Resposta do ASRS:
tópico: 'asrs/responde'
json: {'entidade':entidade_x,'carro':carro_n,'pallet':pallet_n,'est':estação}
*/

'eixo_bruto','eixo_usinado',
'engrenagem_bruta','engrenagem_usinada',
'conjunto','carcaca_bruta','carcaca_usinada', 
'caixa_pronta', 'descarte_geral'