const amqp = require('amqplib');

async function sendEvent(eventType, eventData) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    await channel.assertExchange('game_events', 'fanout', { durable: false });
    
    const message = JSON.stringify({ type: eventType, data: eventData });
    channel.publish('game_events', '', Buffer.from(message));
    
    console.log('Evento enviado:', message);
    await channel.close();
    await connection.close();
}

module.exports = { sendEvent };