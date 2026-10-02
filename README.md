<h1 align="center">
  <img src="./checkers_banner_image.png" alt="checkers-game banner" width="400" />
</h1>

# checkers-game

International checkers (10x10) for two players on one screen, with games you can save and load by id. The frontend is React and TypeScript. The backend is a Node.js REST API on AWS Lambda behind API Gateway, with a PostgreSQL-compatible database (Aurora DSQL).

I built this between December 2025 and January 2026 as the selection test for the HBO Software Development bachelor at Bit Academy.


## What it does

- Full rules of international checkers: 10x10 board, 20 pieces per player, light moves first.
- Capturing is mandatory, forwards and backwards, including multiple captures in one turn.
- Pieces are crowned on the last row. Kings move and capture over any distance on a diagonal.
- Local multiplayer: two players take turns on the same screen.
- Save a game and get a game id back. Enter the id later to continue where you left off.

## Architecture

```
React frontend  -->  API Gateway  -->  Lambda (Node.js)  -->  Aurora DSQL (PostgreSQL)
```

The backend is split into three layers, so each file has one job:

| Layer | File | Responsibility |
| --- | --- | --- |
| Entry point | `backend/index.mjs` | Routes the request to the controller by HTTP method |
| Controller | `backend/business/controller/checkersController.mjs` | Turns results and errors into HTTP responses (status code, CORS headers, body) |
| Service | `backend/business/checkersService.mjs` | Checks the request and decides what should happen |
| Repository | `backend/data/checkersRepository.mjs` | The only place that talks to the database |

I chose this split because I used the same structure in the reservation system I worked on during my internship. Swapping the database or adding an endpoint only touches one layer.

Other choices:

- All SQL uses parameterized queries (`$1`, `$2`), so user input never ends up inside a query string.
- The database connection is created once and reused between Lambda invocations.
- Aurora DSQL authenticates with IAM, so there is no database password in the code or in the environment.
- Custom exception classes in `backend/util/exception` carry their own status code.

## API

Base path is the API Gateway stage URL.

| Method | Parameters | Result |
| --- | --- | --- |
| `POST` | none | Creates a new game with the starting board and returns the new `game_id` |
| `GET` | `game_id` | Returns the saved game |
| `PATCH` | `game_id`, `board_state`, `player_state`, `player_one_turn` | Saves the current state of a game |

## Database

One table. The board is stored as JSON text, because the frontend already works with a 10x10 array and the board is always read and written as a whole.

```sql
CREATE SCHEMA IF NOT EXISTS main;

CREATE TABLE IF NOT EXISTS main.game (
    game_id VARCHAR(255) PRIMARY KEY,
    board_state TEXT NOT NULL,
    player_state TEXT NOT NULL,
    player_one_turn BOOL NOT NULL,
    status VARCHAR(20) NOT NULL
);
```

Values in `board_state`:

| Value | Meaning |
| --- | --- |
| 0 | Empty brown square |
| 1 | Empty white square |
| 2 / 3 | White piece / black piece |
| 4 | Square the selected piece can move to |
| 5 / 6 | White / black piece that can be captured |
| 7 / 8 | White king / black king |

## Run it locally

```bash
git clone https://github.com/rsinghSD/checkers-game
cd checkers-game/checkers-game
npm install
npm run dev
```

Then open the localhost address that Vite prints. The frontend talks to the deployed API, so you do not need to run the backend yourself. The Lambda code is in `/backend` if you want to read it.

## What I would improve

I ran out of time on these, and I would rather list them than hide them:

- `PATCH` sends the game state as query parameters. It should be a JSON body.
- `GET` with an unknown id returns an empty list with status 200. The frontend handles that, but the API should return 404.
- The input validation in `checkersModel.mjs` is written but not connected yet.
- There are no automated tests. The CI workflow only builds the frontend. The move and capture logic is the first thing I would cover.
- `ChessBoard.tsx` holds all the game rules in one component. I would move the rules into plain functions so they can be tested without React.

## Tech stack

Frontend: React 19, TypeScript, Vite
Backend: Node.js, AWS Lambda, API Gateway
Database: Aurora DSQL (PostgreSQL-compatible)
CI: GitHub Actions

## License

MIT
