import { useState } from 'react'
import confetti from 'canvas-confetti'
import Square from './components/Square'
import WinnerModal from './components/WinnerModal'
import { initialBoard, TURNS} from './constants'
import {checkWinner, checkEndGame} from './logics/board'
import { resetGameStorage, saveGameToStorage } from './logics/storage/index'


function App() {
  const turnFromStorage = window.localStorage.getItem('turn')
  const [turn, setTurn] = useState(
    turnFromStorage ?? TURNS.X
  )
  const boardFromStorage = window.localStorage.getItem('board')
  const [board, setBoard] = useState(
      boardFromStorage ? JSON.parse(window.localStorage.getItem('board')) : initialBoard
    )
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(initialBoard)
    setTurn(TURNS.X)
    setWinner(null)

    // resetear juego
    resetGameStorage()
  }

  const updateBoard = (index) => {
    // update board
    if(board[index] || winner) return
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    // change turn
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    // save game
    saveGameToStorage({ board: newBoard, turn: newTurn })

    // check winner
    const newWinner = checkWinner(newBoard)
    if(newWinner) {
      confetti()
      setWinner(newWinner)
    } else if(checkEndGame(newBoard)){
      setWinner(false)
    }

  }

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={() => resetGame()}>Reset</button>
      <section className="game">
        {
          board.map((_,index) => {
            return (<Square key={index} index={index} updateBoard={() =>updateBoard(index)}>
              {board[index]}
            </Square>)
          })
        }
      </section>
      <section className="turn">
        <Square >
          <span>Turn</span>
          {turn === TURNS.X ? TURNS.X : TURNS.O}
        </Square>
      </section>
      <WinnerModal winner={winner} resetGame={resetGame}/>
    </main>
  )
}

export default App
