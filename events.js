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

async function start_match(q_data) {
    console.log("starting match...");
    console.log("Sending request with:", JSON.stringify(q_data, null, 2));
    try {
        const response = await fetch('https://match-microservice.vercel.app/match/create_match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(q_data)
        });
        console.log("Request sent. Awaiting response...");

        const data = await response.json();
        
        if (response.ok) {
            console.log("match created successfully:", data);
        } else {
            console.error("Error creating match:", data);
        }

        console.log(data);
    } catch (error) {
        console.error("Failed to connect to match service:", error);
        throw error;
    }
}

module.exports = { sendEvent, start_match };