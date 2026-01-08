import { AuroraDSQLClient } from "@aws/aurora-dsql-node-postgres-connector";

let client;
let connected = false;
export default class CheckersRepository {

    constructor(){
        if (!client){ 
            client = new AuroraDSQLClient({
                host: process.env.CLUSTER_ENDPOINT,
                user: process.env.CLUSTER_USER
            })
        }
        this.client = client;
    }

    async connectDatabase(){
        if (!connected){ // fix for client has already been connected error, hope it works
            await this.client.connect();
            connected = true;
            console.log("thy portal has been opened");
        }
    }

    async createEntry(event) {
        try {
            await this.connectDatabase();

            const id = crypto.randomUUID();


            const board_state = JSON.stringify([
                [0, 2, 0, 2, 0, 2, 0, 2, 0, 2], // __
                [2, 0, 2, 0, 2, 0, 2, 0, 2, 0], // player (2)
                [0, 2, 0, 2, 0, 2, 0, 2, 0, 2], // one
                [2, 0, 2, 0, 2, 0, 2, 0, 2, 0], // __
                [0, 1, 0, 1, 0, 1, 0, 1, 0, 1], // middle
                [1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // zone
                [0, 3, 0, 3, 0, 3, 0, 3, 0, 3], // __
                [3, 0, 3, 0, 3, 0, 3, 0, 3, 0], // player (3)
                [0, 3, 0, 3, 0, 3, 0, 3, 0, 3], // two
                [3, 0, 3, 0, 3, 0, 3, 0, 3, 0], // __
                ])
            const player_state = JSON.stringify({
                some: "bs",
                value: "idk,"
            })


                
                
            await this.client.query(
                "INSERT INTO main.game (game_id, board_state, player_state, player_one_turn, status) VALUES ($1, $2, $3, $4, $5)",
                [id, board_state, player_state, "true", "started"]
            );

            return {
                statusCode: 200,
                message: id
            }
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                message: error
            }
        }
    }

    async getEntry(id) {
        try {
            await this.connectDatabase();
            console.log(id);
            const queryResponse = await this.client.query(
                "SELECT * FROM main.game WHERE game_id= $1",
                [id]
            );

            return queryResponse.rows;
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                message: error
            }
        }
    }

    async updateEntry(event) {
        try {
            await this.connectDatabase();

            console.log(event.game_id)
            const board_state = JSON.stringify([
                [6, 2, 0, 2, 0, 2, 0, 2, 0, 2], // __
                [2, 0, 2, 0, 2, 0, 2, 0, 2, 0], // player (2)
                [0, 2, 0, 2, 0, 2, 0, 2, 0, 2], // one
                [2, 0, 2, 0, 2, 0, 2, 0, 2, 0], // __
                [0, 1, 0, 1, 0, 1, 0, 1, 0, 1], // middle
                [1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // zone
                [0, 3, 0, 3, 0, 3, 0, 3, 0, 3], // __
                [3, 0, 3, 0, 3, 0, 3, 0, 3, 0], // player (3)
                [0, 3, 0, 3, 0, 3, 0, 3, 0, 3], // two
                [3, 0, 3, 0, 3, 0, 3, 0, 3, 0], // __
                ])
            const player_state = JSON.stringify({
                some: "bs",
                value: "idk,"
            })
                
            await this.client.query(
                "UPDATE main.game SET board_state = $2, player_state = $3, player_one_turn = $4, status = $5 WHERE game_id = $1",
                [event.game_id, event.board_state, event.player_state, "true", "saved"]
            );

            return {
                statusCode: 200,
                message: "patched!"
            }
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                message: error
            }
        }
    }

}