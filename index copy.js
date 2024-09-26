const express = require('express');
const app = express();

const PORT = 80; 

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const client = new Client({
    authStrategy: new LocalAuth()
});


client.on('ready', () => {
    console.log('Client is ready!');
});

let qrCodeImage = null;

client.on('qr', qr => {
    console.log('Iniciando QR Code');
    qrcode.generate(qr, {small: true});
    console.log('QR RECEIVED', qr);
    qrCodeImage.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('Erro ao gerar QR Code: ', url);
        } else{
            qrCodeImage = url;
        }
    })
});

app.get('/', (req, res) => {
    const textParam = req.query.text; 
    if (client.isReady) {
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

client.on('message_create', message => {
    if (message.body === '?') {
        console.log(`message.id.remote: `, message.id.remote);
        console.log(`message.from: `, message.from);
        // console.log(`message.id(): ${message.id()}`);
    }
});

client.on('message_create', message => {
    console.log(message.from, message.author,`: `, message.body)
    // console.log(message.from,`: `, message.body)
	if (message.from === '!ping') {
		// send back "pong" to the chat the message was sent in
		client.sendMessage(message.from, 'pong');
	}
});

client.initialize();
