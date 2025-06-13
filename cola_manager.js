const Cola = require('./cola');

class Cola_manager{
    constructor(){
        this.cola_list = [];
        this.id_counter = 0;
        this.init();
    }
    init(){}
    add_cola(jugador, num_players, tipo_cola){
        let cola = new Cola(this.id_counter, Date.now(), jugador, num_players, tipo_cola);
        this.cola_list.push(cola);
        this.id_counter += 1;
        return cola.get_id();
    }
    remove_cola(id){
        this.cola_list = this.cola_list.filter(cola => cola.get_id()!=id);
        return true;
    }
    add_player(jugador, num_players, tipo_cola){
        // rechazar si el jugaor ya fue añadido a una cola
        let res = this.jugador_en_cola(jugador.get_id());
        if(res.state){
            return {state: false, id_cola: res.cola};
        }
        // crear nueva cola en caso que no haya ninguna
        if(this.cola_list.length==0){
            console.log("created first cola");
            let id_cola = this.add_cola(jugador, num_players, tipo_cola);
            return {state: true, id_cola: id_cola};
        }
        //buscar una cola con los parámetros indicados
        for(let cola of this.cola_list){
            if((cola.get_tipo_cola() == tipo_cola) && (cola.get_num_players()==num_players)){
                let result = cola.add_player(jugador);
                if(result.state){
                    return {state: true, id_cola: cola.get_id()};
                }
            }
        }
        //crear nueva cola en caso de no haber ninguna con los parámetros indicados
        let id_cola = this.add_cola(jugador, num_players, tipo_cola);
        return {state: true, id_cola: id_cola};
    }
    remove_player(id_player, id_cola){
        const data = this.get_cola(id_cola);
        if(!data.result){
            console.log(data);
            return false;
        }
        data.data.remove_player(id_player);
        if(data.data.get_size()<1){
            this.remove_cola(data.data.get_id())
        }
        return true;
    }
    get_cola(id){
        let cola_encontrada = this.cola_list.find(cola => cola.get_id()==id);
        if(cola_encontrada){
            return {result: true, data: cola_encontrada};
        }
        return {result: false, data: null};
    }
    jugador_en_cola(id_player){
        //implementar lógica de jugador ya está en cola
        return {state: false, cola: -1};
    }
    print_colas(){
        console.log("-----------------------------");
        this.cola_list.forEach(cola => {
            console.log(cola.cola_to_string());
        });
    }
    serialize(){
        let cm ={};
        this.cola_list.forEach(cola => {
            cm["cola"+cola.get_id()] = cola.serialize();
        });
        return cm;
    }
}
module.exports = Cola_manager;