'use client';
import { ChangeEvent } from "react";
import { useState } from "react";

let initial = [
  [-1, 5, -1, 9, -1, -1, -1, -1, -1],
  [8, -1, -1, -1, 4, -1, 3, -1, 7],
  [-1, -1, -1, 2, 8, -1, 1, 9, -1],
  [5, 3, 8, 6, -1, 7, 9, 4, -1],
  [-1, 2, -1, 3, -1, 1, -1, -1, -1],
  [1, -1, 9, 8, -1, 4, 6, 2, 3],
  [9, -1, 7, 4, -1, -1, -1, -1, -1],
  [-1, 4, 5, -1, -1, -1, 2, -1, 9],
  [-1, -1, -1, -1, 3, -1, -1, 7, -1]
];

//la funcion getDeepCopy, realiza lo que se conoce como "copia profunda", a diferencia de realizar una copia con el spread operator, que se realizara una "copia superficial".Una copia superficial significa que se crea una nueva estructura de datos que contiene referencias a los mismos elementos que la estructura original. En otras palabras, la nueva estructura apunta a los mismos objetos o elementos que la original, en lugar de crear copias independientes de ellos.


export default function Home() {
  
  const getDeepCopy = (arr: any) => {
    return JSON.parse(JSON.stringify(arr))
  };

  const [sudokuArr, setSudokuArr] = useState(getDeepCopy(initial));
  
  const onInputChange = (e:ChangeEvent<HTMLInputElement>, row:number, col:number) => {
    e.preventDefault();
    let val = parseInt(e.target.value) || -1
    let grid = getDeepCopy(sudokuArr);
    //input value should range 1-9 and for empty cell should be -1
    if (val === -1 || val >= 1 && val <= 9) {
      grid[row][col] = val
    }
    setSudokuArr(grid);
  };

  const compareSudokus = (currentSudoku:any, solvedSudoku:any) => {
    let res = {
      isComplete: true,
      isSolvable: true
    };
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentSudoku[i][j] !== solvedSudoku[i][j]) {
          if (currentSudoku[i][j] !== -1) {
            res.isSolvable = false
          }
          res.isComplete = false
        }
      }
    }
    return res;
  };

  //function to check sudoku
  const checkSudoku = () => {
    let sudoku = getDeepCopy(initial);
    solver(sudoku);
    let compare = compareSudokus(sudokuArr, sudoku);
    if (compare.isComplete) {
      alert('Felicidades resolviste el sudoku');
    } else if (compare.isSolvable) {
      alert('Continua!');
    } else {
      alert('Intentalo de nuevo');
    }
  };


  //checkRow
  const checkRow = (grid:any, row:any, num:any) => {
    return grid[row].indexOf(num) === -1;
  }
  //checkCol
  const checkCol = (grid:any, col:any, num:any) => {
    return grid.map((row:any) => row[col]).indexOf(num) === -1;
  }
  //checkBox
  const checkBox = (grid:any, row:any, col:any, num:any) => {
    let boxArr = [];
    let rowStart = row - (row % 3);
    let colStart = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // get all the cell numbers and push to boxArr
        boxArr.push(grid[rowStart + i][colStart + j])
       }
    }
    return boxArr.indexOf(num) === -1;
  }
  //
  const checkValid = (grid: any, row: any, col: any, num: any) => {
    //num must be unique in row, col and square 3x3
    if (checkRow(grid, row, num) && checkCol(grid, col, num) && checkBox(grid, row, col, num)) {
      return true
    };
    return false;
  };

  //getNext
  const getNext = (row: number, col: number) => {
    //if col reaches 8, increase row number
    //if row reaches 8 and and col reach 8, next will be [0,0]
    //if col doesn't reach 8, increase col number
    return col !== 8 ? [row, col + 1] : row !==8 ? [row + 1, 0] : [0,0]
  }

  //recursive function to solve sudoku
  const solver = (grid: any, row = 0, col = 0):any => {
    //if the current cell is already filled, move to next cell
    if (grid[row][col] !== -1) {
      //for last cel dont solve it
      let isLast = row >= 8 && col >= 8;
      if (!isLast) {
        let [newRow, newCol] = getNext(row, col)
        return solver(grid, newRow, newCol)
      }
    }
    for (let num = 1; num <= 9; num++) {
      //check if this num is satisfying sudoku contraints
      if (checkValid(grid, row, col, num)) {
        //fill the num in that cell
        grid[row][col] = num;
        //get next cell and repeat function
        let [newRow, newCol] = getNext(row, col);

        if (!newRow && !newCol) {
          return true;
        }

        if (solver(grid, newRow, newCol)) {
          return true;
        }
      }
    }
    //if it is an in valid fill whit -1
    grid[row][col] = -1;
    return false
  };

  //function to solve sudoku by navigatin for each cell
  const solveSudoku = () => {
    let sudoku = getDeepCopy(initial);
    solver(sudoku);
    setSudokuArr(sudoku);
  };

  //function to restart sudoku
  const restartSudoku = () => {
    let sudoku = getDeepCopy(initial);
    setSudokuArr(sudoku);
  };

  return (
    <main className="flex flex-col bg-gray-800 h-screen w-screen justify-start sm:justify-center items-center text-white text-2xl">
      <h1 className="m-2">SUDOKU</h1>
      <table className="border-collapse bg-gray-400">
        <tbody>
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) => {
              return (
                <tr key={rIndex}
                className={`${((row+1)%3===0) ? 'border-b-4 border-black' : ''}`}
                >
                  {
                    [0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => {
                      return (
                        <td
                          key={rIndex + cIndex}
                          className={`${((col+1)%3===0) ? 'border-r-4 border-black' : ''} p-0`}
                        >
                          <input
                            onChange={(e) => onInputChange(e, row, col)}
                            value={sudokuArr[row][col] === -1 ? '' : sudokuArr[row][col] }
                            maxLength={1}
                            type="text"
                            disabled={initial[row][col] !== -1}
                            className="w-10 sm:w-14 h-10 sm:h-14 text-xl text-black text-center p-0 border-solid border-2 rounded-sm"
                          />
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
      <div className="flex w-full justify-between sm:justify-center ">
        <button 
        onClick={checkSudoku}
        className="bg-orange-500 rounded-md border-none font-bold p-2 m-2">Check</button>
        <button 
        onClick={solveSudoku}
        className="bg-orange-500 rounded-md border-none font-bold p-2 m-2">Solve</button>
        <button 
        onClick={restartSudoku}
        className="bg-orange-500 rounded-md border-none font-bold p-2 m-2">Restart</button>
      </div>
      <footer>
        <span className="text-sm">
          Powered by <a href="https://portfolio-andres-medina-arg.vercel.app/" target="_blanck">Andres Medina</a>
        </span>
      </footer>
    </main>
  )
};