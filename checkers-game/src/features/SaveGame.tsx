export default async function SaveGame(body: { game_id: string; board_state: number[][]; player_state: { prev_player_pos: { bI: number; rI: number; }; valid_moves: { bI: number; rI: number; }[]; prev_enemy_pos: { bI: number; rI: number; }; valid_capture_points: { bI: number; rI: number; }[]; can_move: boolean; must_kill: boolean; player_one_turn: boolean; captured_white_pieces: number; captured_black_pieces: number; }; player_one_turn: boolean }){
        const url = `https://mi58k79ihi.execute-api.us-east-1.amazonaws.com/develop`
        const board_state = encodeURIComponent(JSON.stringify(body.board_state));
        const player_state = encodeURIComponent(JSON.stringify(body.player_state));

        const response = await fetch (`${url}?game_id=${body.game_id}&board_state=${board_state}&player_state=${player_state}&player_one_turn=${body.player_one_turn}`, {
            method: "PATCH",
        })
        if(!response.ok) {
            throw new Error(`Request for creating gameID failed, status: ${response.status}`);
        }

        const result = await response.json();
        return result;
}

