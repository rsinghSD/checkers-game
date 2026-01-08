import CheckersService from "../checkersService.mjs";
import responsejson from "../../util/const/responseheader.json" with { type: 'json'};

// const responseHeader = responsejson; if response is freaking out, uncomment.
export default class CheckersController {
    constructor(){
        this.service = new CheckersService();
    }

    async create(event) {
        try {
            const createdInfo = await this.service.makeDatabaseEntry(event);
            return {
                statusCode: createdInfo?.statusCode,
                headers: responsejson,
                response: createdInfo.message
            }
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                headers: responsejson,
                response: error
            }
        }
    }

    async get(event) {
        try {
            const entryInfo = await this.service.getDatabaseEntry(event);
            return {
                statusCode: entryInfo?.statusCode || 500,
                headers: responsejson,
                response: entryInfo
            }
        } catch (error) {
            return {
                statusCode: error?.statusCode || 500,
                headers: responsejson,
                response: error.message || "Something unexpected happenend in the intern system! Check the logs."
            }
        }
    }

    async patch(event) {
        try {
            const patchedInfo = await this.service.updateDatabaseEntry(event);
            return {
                statusCode: patchedInfo?.statusCode || 500,
                headers: responsejson,
                response: patchedInfo
            }
        } catch (error) {
            return {
                statusCode: error.statusCode || 500,
                headers: responsejson,
                response: error.message || "Something unexpected happenend in the intern system! Check the logs."
            }
        }
    }
}
