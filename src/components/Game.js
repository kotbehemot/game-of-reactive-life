import React from 'react';

import '../assets/styles/Game.scss';

import CellGrid from './CellGrid.js'

const CELL_SIZE = 20;

class Game extends React.Component {

  constructor(props) {
    super(props);

    // board setup
    this.height      = document.documentElement.clientHeight - CELL_SIZE;
    this.width       = document.documentElement.clientWidth  - CELL_SIZE;
    this.rows        = this.height / CELL_SIZE - 1;
    this.cols        = this.width  / CELL_SIZE - 1;
    this.board       = this.makeEmptyBoard();
    this.trail_board = this.makeEmptyBoard();

    // bindings
    this.handleClick = this.handleClick.bind(this);
    this.runGame     = this.runGame.bind(this);
    this.stopGame    = this.stopGame.bind(this);
    this.calculateNeighbors = this.calculateNeighbors.bind(this);

    this.state = {
      cells:     [],
      trails:    [],
      isRunning: false
    }
  }

  runGame() {
    this.setState({ isRunning: true });
    this.runIteration();
  }

  stopGame() {
    this.setState({ isRunning: false });
    if (this.timeoutHandler) {
      window.clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  }

  runIteration() {
    let newBoard = this.makeEmptyBoard();
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let neighbors = this.calculateNeighbors(this.board, x, y);
        if (this.board[y][x]) {
          if (neighbors === 2 || neighbors === 3) {
            newBoard[y][x] = neighbors;
            this.trail_board[y][x] = true;
          } else {
            newBoard[y][x] = false;
          }
        } else {
          if (neighbors === 3) {
            newBoard[y][x] = neighbors;
            this.trail_board[y][x] = true;
          }
        }
      }
    }
    this.board = newBoard;
    this.setState({ cells:  this.makeCells() });
    this.setState({ trails: this.makeTrails() });
    this.timeoutHandler = window.setTimeout(() => {
      this.runIteration();
    }, 250);
  }

  // Create an empty board
  makeEmptyBoard() {
    let board = [];
    for (let y = 0; y < this.rows; y++) {
      board[y] = [];
      for (let x = 0; x < this.cols; x++) {
        board[y][x] = false;
      }
    }
    return board;
  }

  makeCells() {
    let cells = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let crowd = this.board[y][x]
        if (crowd) {
          cells.push({ x, y, crowd });
        }
      }
    }
    return cells;
  }

  makeTrails() {
    let trails = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.trail_board[y][x]) {
          trails.push({ x, y });
        }
      }
    }
    return trails;
  }

  getElementOffset() {
    const rect = this.boardRef.getBoundingClientRect();
    const doc = document.documentElement;
    return {
      x: (rect.left + window.pageXOffset) - doc.clientLeft,
      y: (rect.top  + window.pageYOffset) - doc.clientTop,
    };
  }

  handleClick(event) {
    const elemOffset = this.getElementOffset();
    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;

    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);
    if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
      this.board[y][x] = !this.board[y][x];
      this.trail_board[y][x] = true;
    }
    this.setState({ cells: this.makeCells() });
  }

  calculateNeighbors(board, x, y) {
    let neighbors = 0;
    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i];
      let y1 = y + direction[0];
      let x1 = x + direction[1];

      if (x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
        neighbors++;
      }
    }
    return neighbors;
  }

  render() {
    const { cells, trails, isRunning } = this.state;
    return (
      <game>
        {isRunning ?
          <button className="control-button button"
            onClick={this.stopGame}>X</button> :
          <button className="control-button button"
            onClick={this.runGame}>></button>
        }

        <board
          style={{ width: this.width, height: this.height, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px` }}
          onClick={this.handleClick}
          ref={(n) => { this.boardRef = n; }}>

          <CellGrid source={cells} cellType="live" />

          <CellGrid source={trails} cellType="trail" />
        </board>
      </game>
    );
  }
}
export default Game;
