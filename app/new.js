'use client'
import { useState, useEffect } from "react";

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAlgorithm, setActiveAlgorithm] = useState("bubble");

  // Generate random array of letters
  const generateArray = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const newArray = Array.from({ length: 3 }, () => 
      alphabet[Math.floor(Math.random() * alphabet.length)]
    );
    setArray(newArray);
    setCurrentStep(0);
    setSteps([]);
    setIsPlaying(false);
  };

  // Bubble Sort Implementation
  const getBubbleSortSteps = (arr) => {
    const steps = [];
    const tempArray = [...arr];
    
    for (let i = 0; i < tempArray.length; i++) {
      for (let j = 0; j < tempArray.length - i - 1; j++) {
        steps.push({
          array: [...tempArray],
          comparing: [j, j + 1],
          sorted: tempArray.length - i
        });
        
        if (tempArray[j] > tempArray[j + 1]) {
          [tempArray[j], tempArray[j + 1]] = [tempArray[j + 1], tempArray[j]];
          steps.push({
            array: [...tempArray],
            swapped: [j, j + 1],
            sorted: tempArray.length - i
          });
        }
      }
    }
    return steps;
  };

  // Selection Sort Implementation
  const getSelectionSortSteps = (arr) => {
    const steps = [];
    const tempArray = [...arr];
    
    for (let i = 0; i < tempArray.length; i++) {
      let minIdx = i;
      steps.push({
        array: [...tempArray],
        current: i,
        sorted: i
      });
      
      for (let j = i + 1; j < tempArray.length; j++) {
        steps.push({
          array: [...tempArray],
          comparing: [minIdx, j],
          current: i,
          sorted: i
        });
        
        if (tempArray[j] < tempArray[minIdx]) {
          minIdx = j;
        }
      }
      
      if (minIdx !== i) {
        [tempArray[i], tempArray[minIdx]] = [tempArray[minIdx], tempArray[i]];
        steps.push({
          array: [...tempArray],
          swapped: [i, minIdx],
          sorted: i
        });
      }
    }
    return steps;
  };

  // Quick Sort Implementation
  const getQuickSortSteps = (arr) => {
    const steps = [];
    const tempArray = [...arr];
    
    const partition = (low, high) => {
      const pivot = tempArray[high];
      let i = low - 1;
      
      steps.push({
        array: [...tempArray],
        pivot: high,
        range: [low, high]
      });
      
      for (let j = low; j < high; j++) {
        steps.push({
          array: [...tempArray],
          comparing: [j, high],
          pivot: high,
          range: [low, high]
        });
        
        if (tempArray[j] <= pivot) {
          i++;
          [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
          if (i !== j) {
            steps.push({
              array: [...tempArray],
              swapped: [i, j],
              pivot: high,
              range: [low, high]
            });
          }
        }
      }
      
      [tempArray[i + 1], tempArray[high]] = [tempArray[high], tempArray[i + 1]];
      steps.push({
        array: [...tempArray],
        swapped: [i + 1, high],
        pivot: i + 1,
        range: [low, high]
      });
      
      return i + 1;
    };
    
    const quickSort = (low, high) => {
      if (low < high) {
        const pi = partition(low, high);
        quickSort(low, pi - 1);
        quickSort(pi + 1, high);
      }
    };
    
    quickSort(0, tempArray.length - 1);
    return steps;
  };

  const startSorting = (algorithm) => {
    setActiveAlgorithm(algorithm);
    setCurrentStep(0);
    setIsPlaying(false);
    
    let sortingSteps;
    switch(algorithm) {
      case 'bubble':
        sortingSteps = getBubbleSortSteps([...array]);
        break;
      case 'selection':
        sortingSteps = getSelectionSortSteps([...array]);
        break;
      case 'quick':
        sortingSteps = getQuickSortSteps([...array]);
        break;
      case 'merge':
        sortingSteps = getMergeSortSteps([...array]);
        break;
      default:
        sortingSteps = getBubbleSortSteps([...array]);
    }
    setSteps(sortingSteps);
  };

  // Play animation automatically
  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < steps.length) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length, speed]);

  useEffect(() => {
    generateArray();
  }, []);

  const getLetterStyle = (index) => {
    const step = steps[currentStep];
    let backgroundColor = 'bg-blue-500';
    
    if (step) {
      if (step.comparing?.includes(index)) {
        backgroundColor = 'bg-yellow-500';
      }
      if (step.swapped?.includes(index)) {
        backgroundColor = 'bg-green-500';
      }
      if (step.pivot === index) {
        backgroundColor = 'bg-purple-500';
      }
      if (typeof step.sorted === 'number' && index >= array.length - step.sorted) {
        backgroundColor = 'bg-green-300';
      }
    }
    
    return backgroundColor;
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Sorting Algorithms Visualizer</h1>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={generateArray}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Generate New Letters
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={steps.length === 0}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <input
            type="range"
            min="100"
            max="2000"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            className="w-48"
          />
          <span>Speed: {speed}ms</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => startSorting('bubble')}
            className={`p-4 rounded ${activeAlgorithm === 'bubble' ? 'bg-blue-600 text-white' : 'bg-blue-100'}`}
          >
            Bubble Sort
          </button>
          <button
            onClick={() => startSorting('selection')}
            className={`p-4 rounded ${activeAlgorithm === 'selection' ? 'bg-blue-600 text-white' : 'bg-blue-100'}`}
          >
            Selection Sort
          </button>
          <button
            onClick={() => startSorting('quick')}
            className={`p-4 rounded ${activeAlgorithm === 'quick' ? 'bg-blue-600 text-white' : 'bg-blue-100'}`}
          >
            Quick Sort
          </button>
          <button
            onClick={() => startSorting('merge')}
            className={`p-4 rounded ${activeAlgorithm === 'merge' ? 'bg-blue-600 text-white' : 'bg-blue-100'}`}
          >
            Merge Sort
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-center h-32">
            {(currentStep >= 0 && steps[currentStep]?.array || array).map((letter, index) => (
              <div
                key={index}
                className={`${getLetterStyle(index)} w-16 h-16 m-1 flex items-center justify-center text-2xl font-bold text-white rounded-lg transform transition-all duration-500 ease-in-out`}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Swapping</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span>Pivot (Quick Sort)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-300 rounded"></div>
            <span>Sorted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Unsorted</span>
          </div>
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Current Progress</h2>
          <div className="text-gray-700">
            Algorithm: {activeAlgorithm.charAt(0).toUpperCase() + activeAlgorithm.slice(1)} Sort
            <br />
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;