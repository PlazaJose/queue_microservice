class Jugador{
    constructor(id, name, mmr){
        this.id = id;
        this.name = name;
        this.mmr = mmr;
    }
    get_id() {
        return this.id;
    }
    get_name(){
        return this.name;
    }
    get_mmr(){
        return this.mmr;
    }
    set_id(id) {
        this.id = id;
    }
    set_name(name){
        this.name = name;
    }
    set_mmr(mmr){
        this.mmr = mmr;
    }
    player_to_string(){
        return `jugador {id: ${this.id}, name: ${this.name}, mmr: ${this.mmr}}`;
    }
    serialize(){
        return {
            id:this.id, name:this.name, mmr:this.mmr
        };
    }
}

module.exports = Jugador;