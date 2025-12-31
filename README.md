<h1 align="center">
  <img src="./checkers_banner_image.png" alt="checkers-game banner" width="400" length="700" />
</h1> 
<!-- HTML support in Markdown is pretty epic :) -->

# checkers-game
Implementation of the board game Checkers, made for a Bachelor Software Development Selection Test. Bit Academy project.  

- [checkers-game](#checkers-game)
  - [Requirements for the Game](#requirements-for-the-game)
    - [Functional Requirements](#functional-requirements)
    - [Technical Requirements](#technical-requirements)
  - [Project Approach](#project-approach)
  - [Database Schema Design](#database-schema-design)
    - [Backlogging](#backlogging)

## Requirements for the Game
### Functional Requirements

International Draughts rules?

1. Game Board & Setup
   * Board contains of 10x10 squares with alternating dark and light colors.
    Lower-left square must be dark.
   * Each player starts with 20 pieces
   * Pieces are placed the first four rows closest to each player, leaving the two central rows empty.
   * The placer with the light-colored pieces moves first, with turns alternating thereafter
2. Piece Movement & Capturing
   * Ordinary Pieces
     * Move one square diagonally forward into an unoccupied square
   * Capturing
     * If an enemy piece is adjacent, it can-and must-be captured by jumping over it to an unoccupied square directly beyond.
     * The capture move can be executed forward or backward.
     * If a capture is available, it must be taken, even if it puts the player at a disadvantage.
     * Captured pieces are removed from the board at the end of the turn
3. Crowning (Kinging)
   * A piece is crowned when it ends its turn on the farthest row of the board
   * Crowned pieces (kings) gain enhanced movement:
     * They can move multiple squares diagonally in any direction.
     * They may jump over and capture an opponnent's piece from a distance, with the freedom to choose their landing square beyond the jumped piece
4. Win Condition:
   * A player loses if they have no valid moves remaining. This situation arises if:
     * The player has no remaining pieces
     * All pieces are blocked by the opponents pieces and cannot move.

### Technical Requirements

1. User Interaction:
    * Player clicks on a piece to select it.
    * Method for moving the piece once selected is whatever you want
2. Local Multiplayer:
    * The game supports two players on one PC. No need for extra fancy stuff.
3. Game Persistance:
    * Saving:
      * Provide a option for player to save current game state
      * Upon saving, game state stored in DB. Unique gameId displayed.
    * Loading:
      * Allow players to resume a saved game by entering corrosponding gameId. Loads and retrieves selected game state
      * Unknown gameId entered, proper error (404) displayed
4. Communication & API:
    * Communication between frontend and backend uses RESTful API
5. Version Control:
    * Use Git for version managemtn
    * Repo must be private. Use GitHub or GitLab.

## Project Approach
Always a good idea to draw the architecture before attempting something.

Sketch Tech Requirements: https://excalidraw.com/#json=0ZG0RR9ANdlzGIymjwLD0,XhrgQ8V7cHVPS7CvC3an0Q

**Tech Stack:**  
Frontend: Vite + React + Node  
Backend: Node.JS, AWS (Lambda, API Gateway)  


Checklist:  
- [x] Get to know how to play checkers and how it works
- [x] Database Schema Design (ERD?)
- [x] Stack-preparation/database-create
- [x] Basic Board made
- [ ] Pieces made using components (when stuck, think about tictactoe example in react docs)
- [ ] Pieces movement
- [ ] Switching players every play (local multiplayer)
- [ ] Implement Capturing
- [ ] Implement Crowning
- [ ] Add win conditions
- [ ] Use RESTful API's to communicate and send POST/GET requests. Eventually link to game to be able to save/load board/game state.
- [ ] Celebrate! (Maybe add some sound effects...)

## Database Schema Design
https://dbdiagram.io/d/Chess-Game-ERD-Diagram-6939cacde877c63074578dde

<iframe width="560" height="315" src='https://dbdiagram.io/e/6939cacde877c63074578dde/693b03c9e877c630747f6dc0'> </iframe>


![database_schema_design](./docs/images/readme/chess_game_erd_diagram.png)

### Backlogging
The repo also includes a /docs/backlog folder with backlog markdown files. Those are personal backlogs to kind of keep track of what I did. These are includes, may you be interested and/or curious to see.