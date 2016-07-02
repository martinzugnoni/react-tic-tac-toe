import React from 'react';
import _ from 'lodash';


class GameButton extends React.Component {
    render() {
        let buttonValue = this.props.value === null
            ? "?"
            : this.props.value;
        let buttonClasses = {
            null: "btn-default",
            "X": "btn-success",
            "O": "btn-info"
        }
        return <div className="col-xs-4 game-cell">
          <button
            className={"btn " + buttonClasses[this.props.value]}
            rowNum={this.props.rowNum}
            colNum={this.props.colNum}
            type="submit"
            disabled={this.props.value !== null || this.props.gameOver}
            onClick={() => {
                this.props.onButtonClick(this.props.rowNum, this.props.colNum);
            }}
          >
          {buttonValue}
          </button>
        </div>
    }
}


class GameRow extends React.Component {
    render() {
        let gameButtons = [0, 1, 2].map((val) => {
            return <GameButton
                     rowNum={this.props.rowNum}
                     colNum={val}
                     value={this.props.boardRow[val]}
                     gameOver={this.props.gameOver}
                     onButtonClick={this.props.onButtonClick}
                     key={val}
                   />
        });
        return <div className="row">
            {gameButtons}
        </div>
    }
}


class GameStatus extends React.Component {
    render() {
        if (this.props.gameOver) {
            if (this.props.winner) {
                return <p>Game Over: <span>{this.props.winner} wins!</span></p>
            } else {
                return <p>Game Over: <span>Game is tied!</span></p>
            }
        }
        return <p>Next player: <span>{this.props.nextPlayer}</span></p>
    }
}


class TicTacToeGame extends React.Component {
    constructor() {
        super();
        this.state = {
            board: [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ],
            nextPlayer: "X",
            winner: null,
            gameOver: false,
        }
    }
    isWinningCombination(combinationValues) {
        /*
        Returns true if given combinationValues
        is ["X", "X", "X"] or ["O", "O", "O"], or false otherwise.
        */
        let xWins = !_.without(combinationValues, "X").length;
        let oWins = !_.without(combinationValues, "O").length;
        return xWins || oWins;
    }
    checkWinningCombinations() {
        /*
        Checks all valid winning combinations to see if any of them is
        fulfilled by the current player.
        */
        let combinations = [
            // horizontals
            [[0,0], [0,1], [0,2]],
            [[1,0], [1,1], [1,2]],
            [[2,0], [2,1], [2,2]],

            // verticals
            [[0,0], [1,0], [2,0]],
            [[0,1], [1,1], [2,1]],
            [[0,2], [1,2], [2,2]],

            // diagonals
            [[0,0], [1,1], [2,2]],
            [[0,2], [1,1], [2,0]]
        ]

        let foundWinningCombination = false;
        _.forEach(combinations, (combination) => {
            let combinationValues = [];
            _.forEach(combination, (position) => {
                let row = position[0];
                let col = position[1];
                combinationValues.push(this.state.board[row][col]);
            });
            if (this.isWinningCombination(combinationValues)) {
                foundWinningCombination = true;
            }
        });
        return foundWinningCombination;
    }
    checkBoardIsFull() {
        /*
        Returns true if all positions in the board are already fulfilled
        with a value different to null, or false otherwise.
        */
        let isFull = true;
        [0, 1, 2].map((row) => {
            [0, 1, 2].map((col) => {
                if (this.state.board[row][col] === null) {
                    isFull = false;
                }
            })
        })
        return isFull;
    }
    checkGameOver() {
        /*
        Evaluates if game is over after the last movement, and returns the
        winner if there's any.

        Possible returning values:
            false: the game is still not over
            "X": game is over and "X" is the winner
            "O": game is over and "O" is the winner
            null: game is over and tied
        */
        if (this.checkWinningCombinations()) {
            return this.state.nextPlayer;
        }
        if (this.checkBoardIsFull()) {
            return null;
        }
        return false;
    }
    onButtonClick(row, col) {
        let board = this.state.board;
        board[row][col] = this.state.nextPlayer;

        let winner;
        let gameOver;
        let result = this.checkGameOver();
        if (result === false) {
            winner = null;
            gameOver = false;
        } else {
            winner = result;
            gameOver = true;
        }

        this.setState({
            board: board,
            nextPlayer: this.state.nextPlayer == "X" ? "O" : "X",
            winner: winner,
            gameOver: gameOver
        });
    }
    render() {
        let gameRows = [0, 1, 2].map((val) => {
            return <GameRow
                    rowNum={val}
                    boardRow={this.state.board[val]}
                    gameOver={this.state.gameOver}
                    onButtonClick={this.onButtonClick.bind(this)}
                    key={val}
                   />
        })
        return <div className="center-block game-container">
          <div className="row">
            <div className="col-xs-12 text-center">
              <h1>React - Tic Tac Toe</h1>
            </div>
          </div>
          <div className="row board-container">
            <div className="col-xs-12">
                {gameRows}
            </div>
          </div>
          <div className="row text-center player-info">
            <GameStatus
              nextPlayer={this.state.nextPlayer}
              gameOver={this.state.gameOver}
              winner={this.state.winner}
            />
          </div>
        </div>
    }
}

export default TicTacToeGame;
