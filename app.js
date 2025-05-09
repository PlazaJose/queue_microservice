const express = require('express');
const Cola_manager = require('./cola_manager');
const Jugador = require('./player');
const Cola = require('./cola');
const {sendEvent} = require('./events');
const app = express();
const port = 5103;

// Middleware to parse JSON
app.use(express.json());

//manejo de colas
const cola_manager = new Cola_manager();

//aquí debería consultar otro microservicio que devuelva los datos necesarios del jugador :v?
function get_player_data(id_player){
    data = {name:"guest-"+id_player, mmr: Math.floor(Math.random() * 30)};
    const jugador = new Jugador(id_player, data.name, data.mmr);
    return jugador;
}
//aquí se intenta iniciar la partida, comprobando si la cola está llena
function intentar_partida(id_cola){
    const data = cola_manager.get_cola(id_cola);
    if(data.result){
        const cola = data.data;
        if(cola.ready()){
            sendEvent('game_start', cola.serialize());
        }
    }
}

app.post('/cola/unirse', (req, res)=>{
    const { player_data, num_players, tipo_cola } = req.body;
    const id_player = player_data.id_player;
    const jugador = new Jugador(id_player, player_data.name, parseInt(player_data.mmr));//get_player_data(id_player);
    const adicion = cola_manager.add_player(jugador, num_players, tipo_cola);
    cola_manager.print_colas();//debug para mirar el estado de las colas
    if(!adicion.state){
        return res.status(400).json({message: 'Ya está en una cola', id_cola: adicion.id_cola});
    }
    intentar_partida(adicion.id_cola);
    return res.json({message:`Jugador añadido a la cola: ${adicion.id_cola}`, id_cola: adicion.id_cola});
});

app.post('/cola/abandonar', (req, res)=>{
    const {id_player, id_cola} = req.body;
    const resultado = cola_manager.remove_player(id_player, id_cola);
    return res.json({message:`Jugador ${id_player} ha abandonado la cola ${id_cola}`});
});

app.get('/cola/status/:id_cola', (req, res) =>{
    const id_cola = req.params.id_cola;
    const data = cola_manager.get_cola(id_cola);
    if(!data.result){
        return res.json({ready: false, message: "cola no encontrada"});
    }
    const cola = data.data;
    res.json({ready: cola.ready(), message: cola.cola_to_string()});
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });