import React, { useState, useCallback, useRef } from 'react'
import produce from 'immer'

const numRows = 100
const numCols = 162
const cellSize = 100 / numCols + 'vw'
const rate = 1
const density = 0.7

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
]

const generateEmptyGrid = () => {
  const rows = []
  for (let i = 0; i < numRows; i++) {
    rows.push(Array(numCols).fill(0))
  }

  return rows
}

const generateRandomGrid = () => {
  const rows = []
  for (let i = 0; i < numRows; i++) {
    rows.push(
      Array.from(Array(numCols), () => (Math.random() > density ? 1 : 0))
    )
  }

  return rows
}

const updateGrid = grid => {
  let newGrid = generateEmptyGrid()
  for (let i = 0; i < numRows; i++) {
    for (let k = 0; k < numCols; k++) {
      let neighbors = 0
      operations.forEach(([x, y]) => {
        const newI = i + x
        const newK = k + y
        if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
          neighbors += grid[newI][newK]
        }
      })

      if (grid[i][k] === 1 && (neighbors === 3 || neighbors === 2)) {
        newGrid[i][k] = 1
      } else if (grid[i][k] === 0 && neighbors === 3) {
        newGrid[i][k] = 1
      }
    }
  }
  return newGrid
}

const App = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid()
  })

  const [running, setRunning] = useState(false)

  const runningRef = useRef(running)
  runningRef.current = running

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return
    }

    setGrid(g => updateGrid(g))
    setTimeout(runSimulation, rate)
  }, [])

  return (
    <>
      <button
        onClick={() => {
          setRunning(!running)
          if (!running) {
            runningRef.current = true
            runSimulation()
          }
        }}
      >
        {running ? 'stop' : 'start'}
      </button>
      <button
        onClick={() => {
          setGrid(generateRandomGrid())
        }}
      >
        random
      </button>
      <button
        onClick={() => {
          setGrid(generateEmptyGrid())
        }}
      >
        clear
      </button>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, ${cellSize})`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1
                })
                setGrid(newGrid)
              }}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: grid[i][k] ? 'black' : 'white',
              }}
            />
          ))
        )}
      </div>
    </>
  )
}

export default App
