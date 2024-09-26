const express = require('express');
const app = express();
const PORT = 80;

let ready = false;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const qrcode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});


client.on('ready', () => {
    console.log('Client is ready!');
    ready = true;
});

let qrCodeImage = null;
client.on('qr', qr => {
    console.log('Iniciando QR Code');
    qrcode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('Erro ao gerar QR Code: ', err);
        } else {
            qrCodeImage = url;
        }
    });
});

app.get('/', (req, res) => {
    const textParam = req.query.text; 
    if (ready===true) {
        if (textParam) {
            console.log(`Mensagem recebida: ${textParam}`); 
            client.sendMessage('120363336822323234@g.us', textParam)
            return res.send(`${textParam}`);
        } else {
            return res.send('Mensagem não informada.');
        }
    } else {
        if (qrCodeImage) {
            console.log(`QR Code gerado: ${qrCodeImage}`);
            return res.send(`<img src="${qrCodeImage}" />`);
        } else {
            return res.send('QR Code não foi gerado ainda. Bot não iniciado ainda.');
        }
    }
});
// app.get('/', (req, res) => {
//   const textParam = req.query.text; 
//   console.log(`Mensagem recebida: ${textParam}`); 
//   res.send(`${textParam}`);
//   client.sendMessage('120363336822323234@g.us', textParam)
// });

// client.on('message_create', message => {
//     if (message.body === '?') {
//         console.log(`message.id.remote: `, message.id.remote);
//         console.log(`message.from: `, message.from);
//         // console.log(`message.id(): ${message.id()}`);
//     }
// });

// client.on('message_create', message => {
//     console.log(message.from, message.author,`: `, message.body)
//     // console.log(message.from,`: `, message.body)
// 	if (message.from === '!ping') {
// 		// send back "pong" to the chat the message was sent in
// 		client.sendMessage(message.from, 'pong');
// 	}
// });

client.initialize();
