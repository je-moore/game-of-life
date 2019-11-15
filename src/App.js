import React, { useState, useCallback, useRef } from 'react'
import produce from 'immer'

const numRows = 120
const numCols = 200
const numCells = numCols * numRows
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

const generateEmptyGrid = () => Array(numCells).fill(0)

const generateRandomGrid = () =>
  Array.from(Array(numCells), () => (Math.random() > density ? 1 : 0))

const updateGrid = grid => {
  return grid.map((cell, cellIndex, grid) => {
    const numNeighbors = neighborOffsets.reduce((accumulator, offset) => {
      const neighborIndex = offset + cellIndex
      return neighborIndex >= 0 &&
        neighborIndex < numCells &&
        !(
          cellIndex % numCols === 0 && neighborIndex % numCols === numCols - 1
        ) &&
        !(cellIndex % numCols === numCols - 1 && neighborIndex % numCols === 0)
        ? accumulator + grid[neighborIndex]
        : accumulator
    }, 0)
    return (grid[cellIndex] === 0 && numNeighbors === 3) ||
      (grid[cellIndex] === 1 && (numNeighbors === 3 || numNeighbors === 2))
      ? 1
      : 0
  })
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
      <button
        onClick={() => {
          setGrid(() => updateGrid(grid))
        }}
      >
        update
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
