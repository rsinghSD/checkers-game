export default async function CreateNewGame(){
        const url = `https://mi58k79ihi.execute-api.us-east-1.amazonaws.com/develop?`
        const response = await fetch (url, {
            method: "POST",
        })
        if(!response.ok) {
            throw new Error(`Request for creating gameID failed, status: ${response.status}`);
        }

        const result = await response.json();
        return result;
}

