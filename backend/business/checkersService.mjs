import CheckersRepository from "../data/checkersRepository.mjs";
import CheckersModel from "./model/checkersModel.mjs";
import NotFoundException from "../util/exception/NotFoundException.mjs"
import { AuroraDSQLClient } from "@aws/aurora-dsql-node-postgres-connector";

export default class CheckersController {
    constructor(){
        this.repository = new CheckersRepository();
        this.model = new CheckersModel();
    }
    async makeDatabaseEntry(event) {
        try {
            if (typeof event === 'string') {
                event = JSON.parse(event);
            }
            console.log(event);
           // await this.model.verifyData(event.queryStringParameters);
            const response = await this.repository.createEntry(event.queryStringParameters);
            return {
                statusCode : response.statusCode,
                message: response.message
            }
        } catch (error) {
            console.error(error);
            return {
                statusCode: error.statusCode || 500,
                message: error.message || "Something unexpected happenend!"
            }
        }

    }

    async getDatabaseEntry(event) {
        try {
            if (typeof event === 'string'){
                event = JSON.parse(event);
            }
            if (!event.queryStringParameters?.game_id){
                throw new NotFoundException("game_id was not given.")
            }
            const response = await this.repository.getEntry(event.queryStringParameters.game_id);
            return {
                statusCode : 200,
                message: response
            }
        } catch (error) {
            console.error(error);
            return {
                statusCode: error.statusCode || 500,
                message: error.message || "Something unexpected happenend!"
            }
        }
    }

    async updateDatabaseEntry(event) {
        try {
            if (typeof event === 'string') {
                event = JSON.parse(event);
            }
            const response = await this.repository.updateEntry(event.queryStringParameters);
            return {
                statusCode: 200,
                message: response
            }
        } catch (error) {
            console.error(error);
            return {
                statusCode: error.statusCode || 500,
                message: error.message || "Something unexpected happenend!"
            }
        }
    
    }
}
