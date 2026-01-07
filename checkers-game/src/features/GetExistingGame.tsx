export default async function GetExistingGame(game_id: string){
        const url = `https://mi58k79ihi.execute-api.us-east-1.amazonaws.com/develop?game_id=${game_id}`
        const response = await fetch (url, {
            method: "GET",
        })
        if(!response.ok) {
            throw new Error(`Request for creating gameID failed, status: ${response.status}`);
        }

        const result = await response.json();
        return result;
}

