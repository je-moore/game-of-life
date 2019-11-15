import React, { useState, useCallback, useRef } from 'react'
import produce from 'immer'

const numRows = 124
const numCols = 200
const cellSize = 100 / numCols + 'vw'
const rate = 1
const density = 0.7

const neighborOffsets = [
  -1,
  1,
  numCols - 1,
  numCols,
  numCols + 1,
  -numCols - 1,
  -numCols,
  -numCols + 1,
]

const generateEmptyGrid = () => Array(numCols * numRows).fill(0)

const generateRandomGrid = () =>
  Array.from(Array(numCols * numRows), () => (Math.random() > density ? 1 : 0))

const updateGrid = grid => {
  let newGrid = generateEmptyGrid()
  for (let i = 0; i < numRows * numCols; i++) {
    let neighbors = 0
    neighborOffsets.forEach(x => {
      const neighborIndex = i + x
      if (neighborIndex >= 0 && neighborIndex < numRows * numCols) {
        neighbors += grid[neighborIndex]
      }
    })

    if (grid[i] === 1 && (neighbors === 3 || neighbors === 2)) {
      newGrid[i] = 1
    } else if (grid[i] === 0 && neighbors === 3) {
      newGrid[i] = 1
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
        {grid.map((rows, i) => (
          <div
            key={i}
            onClick={() => {
              const newGrid = produce(grid, gridCopy => {
                gridCopy[i] = grid[i] ? 0 : 1
              })
              setGrid(newGrid)
            }}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: grid[i] ? 'black' : 'white',
            }}
          />
        ))}
      </div>
    </>
  )
}

export default App
