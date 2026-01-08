import TypeException from "../../util/exception/TypeException.mjs";

export default class CheckersController {
    verifyData(event){

        if(typeof event.turn_counter !== 'number' && !event.turn_counter){
            throw new TypeException("Invalid/Missing turn_counter type. It must be a number.");
        }
        if(typeof event.player_one_turn !== 'boolean' && !event.player_one_turn){
            throw new TypeException("Invalid/Missing player_one_turn type. It must be a bool.");
        }
        if(typeof event.status !== 'string' && !event.status){
            throw new TypeException("Invalid/Missing status type. It must be a string.");
        }

    }
}
