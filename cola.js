const Jugador = require('./player');
class Cola{
    static COLA_RANK = 0;
    static COLA_NORMAL = 1;
    constructor(id, start_time, jugador, num_players, tipo_cola){
        this.id = id;
        this.start_time = start_time;
        this.player_list = [];
        this.mmr_media = jugador.get_mmr();
        this.mmr_range = 5;
        this.num_players = num_players;
        this.add_player(jugador);
        this.tipo_cola = tipo_cola;
        this.tolerancia = 60*1000;
        this.calculate_mmr_range(start_time);
    }
    add_player(jugador){
        //comprobar si hay suficientes jugadors
        if(this.player_list.length>=this.num_players){
            return {state: false, jugadores: this.player_list.length};
        }
        //comprobar si el jugador ya está en la cola
        if(this.player_list.find(p=> p.get_id()==jugador.get_id())){
            return {state: false, jugadores: this.player_list.length};
        }
        //comprobar si el jugador se ajusta a la cola
        if(Math.abs(jugador.get_mmr()-this.mmr_media)>this.mmr_range){
            return {state: false, jugadores: this.player_list.length};
        }
        //añadir al jugador
        this.player_list.push(jugador);
        this.calculate_mmr_medio();
        return {state: true, jugadores: this.player_list.length}
    }
    remove_player(id_player){
        this.player_list = this.player_list.filter(p => p.get_id()!= id_player);
        this.calculate_mmr_medio();
        return true;
    }
    calculate_mmr_medio(){
        let sum = 0;
        this.player_list.forEach(jugador => {
            sum += jugador.get_mmr();
        });
        this.mmr_media = sum/this.player_list.length;
    }
    calculate_mmr_range(current_time){
        this.tolerancia;
        switch(this.tipo_cola){
            case Cola.COLA_RANK:
                if(this.tolerancia<(current_time-this.start_time)){
                    this.mmr_range += 5;
                    this.tolerancia += 12*1000*this.mmr_range;
                }
                break;
            case Cola.COLA_NORMAL:
                if(this.tolerancia<(current_time-this.start_time)){
                    this.mmr_range += 8;
                    this.tolerancia += 6*1000*this.mmr_range;
                }
                break;
            default:
                if(this.tolerancia<(current_time-this.start_time)){
                    this.mmr_range += 10;
                    this.tolerancia += 3*1000*this.mmr_range;
                }
                break;
        }
    }
    get_player(id){
        this.player_list.forEach(jugador => {
            if(jugador.get_id() == id){
                return {result: true, data: jugador};
            }
        });
        return {result: false, data: null};
    }
    get_tipo_cola(){
        return this.tipo_cola;
    }
    get_num_players(){
        return this.num_players;
    }
    get_id(){
        return this.id;
    }
    get_size(){
        return this.player_list.length;
    }
    ready(){
        return (this.player_list.length==this.num_players);
    }
    serialize(){
        return {
            id_cola : this.id,
            tipo_cola : this.tipo_cola,
            jugadores : this.get_serialized_player_list()
        };
    }
    get_serialized_player_list(){
        const sp = [];
        this.player_list.forEach(jugador => {
            sp.push(jugador.serialize());
        });
        return sp;
    }
    cola_to_string(){
        let players_string = "";
        this.player_list.forEach(jugador => {
            players_string += jugador.player_to_string()+'\n';
        });
        return `cola{
        id: ${this.id}, tipo: ${this.tipo_cola}, size: ${this.player_list.length}, max: ${this.num_players}, mmrm: ${this.mmr_media}\n}`+players_string;
    }
}
module.exports = Cola;