# checkers-game
Implementation of the board game Checkers, made for a Bachelor Software Development Selection Test. Bit Academy project. 

- [checkers-game](#checkers-game)
  - [Requirements for the Game](#requirements-for-the-game)
    - [Functional Requirements](#functional-requirements)
    - [Technical Requirements](#technical-requirements)
  - [Project Approach](#project-approach)

## Requirements for the Game
### Functional Requirements

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
