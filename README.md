# ASRS-ufpel
automated storage and retrieval system using mqtt for message

# **Broker** (servidor)

## Instalação
---

## NodeJS
Primeiro tem que ter instalado Node e NPM na máquina, pra rodar tudo corretamente. Aqui tem um tutorial bem explicativo, só seguir os passos.
### Windows
https://nodesource.com/blog/installing-nodejs-tutorial-windows/

### Linux

https://medium.com/collabcode/como-instalar-node-js-no-linux-corretamente-ubuntu-debian-elementary-os-729fb4c92f2d

Faça um `git clone` deste repositorio (caso saiba usar) ou baixe o zip 

Na pasta onde estão os arquivos `package.json` e `broker.js` e execute `npm install` no terminal para instalar todos os pacotes

## Uso
---

Após a instalação, na mesma pasta execute no terminal:
```bash
node broker.js
``` 

você vera algo como:
```bash
Broker funcionando na porta 1883
Para acessar, configure o host do seu cliente para:
Host: 192.168.0.14
Porta: 1883
```

Agora só configurar seu cliente para esse host e porta e fazer seus testes.

<!-- ## Python -->

# **Client**

## Python 

Neste link tem um tutorial bem completo de como utilizar o client com python 

http://www.steves-internet-guide.com/into-mqtt-python-client/