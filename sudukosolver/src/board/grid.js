import React, { useState } from "react";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

const SudokuBoard = () => {
  const [board, setBoard] = useState(
    Array(9)
      .fill()
      .map(() => Array(9).fill(0))
  );

  const handleChange = (row, col, value) => {
    const newBoard = board.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? value : cell))
    );
    setBoard(newBoard);
  };
  // Check if placing `num` at (row, col) is valid
  const isValid = (board, row, col, num) => {
    // Check the row
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
    }

    // Check the column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }

    // Check the 3x3 sub-grid
    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;
    for (let i = boxRowStart; i < boxRowStart + 3; i++) {
      for (let j = boxColStart; j < boxColStart + 3; j++) {
        if (board[i][j] === num) return false;
      }
    }

    return true;
  };

  // Backtracking function to solve Sudoku
  const solveSudoku = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          // Empty cell
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num; // Place the number

              if (solveSudoku(board)) return true; // Recur

              board[row][col] = 0; // Backtrack
            }
          }

          return false; // Trigger backtracking if no number fits
        }
      }
    }
    return true; // Solved
  };

  const handleSubmit = () => {
    const boardCopy = board.map((row) => [...row]); // Create a copy of the board to avoid mutating state

    if (solveSudoku(boardCopy)) {
      setBoard(boardCopy); // Update the state with the solved board
      handleSuccess("Sudoku Solved!");
    } else {
      handleError("This Sudoku cannot be solved.");
    }
  };

  const handleReset = () => {
    setBoard(
      Array(9)
        .fill()
        .map(() => Array(9).fill(0))
    );
  };

  return (
    <>
      <h1>Suduko Solver</h1>
      <div class="grid-container">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              value={cell === 0 ? "" : cell}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                handleChange(rowIndex, colIndex, val);
              }}
            />
          ))
        )}
      </div>
      <div>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <ToastContainer />
    </>
  );
};

export default SudokuBoard;
