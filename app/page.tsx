"use client";
import React, { useEffect, useState, useRef } from "react";

export default function Page() {
  const [newArray, setNewArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [stageText, setStageText] = useState("");
  const [arraySize, setArraySize] = useState(50); // Default size reduced for mobile
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to generate array based on container width
  function generateNewArray() {
    // Calculate how many bars can fit based on container width
    let size = arraySize;
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      // Adjust size based on screen width
      if (containerWidth < 640) { // sm breakpoint
        size = Math.min(30, arraySize); // Max 30 items on small screens
      } else if (containerWidth < 768) { // md breakpoint
        size = Math.min(50, arraySize); // Max 50 items on medium screens
      }
    }

    const generatedArray = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 100)
    );
    setNewArray(generatedArray);
  }

  // Generate new array when component mounts or screen resizes
  useEffect(() => {
    generateNewArray();

    // Add resize event listener
    const handleResize = () => {
      generateNewArray();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [arraySize]);

  async function mergeSort(arr: number[]): Promise<number[]> {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    setStageText(`Splitting array at index ${mid}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const leftSorted = await mergeSort(left);
    const rightSorted = await mergeSort(right);
    return merge(leftSorted, rightSorted);
  }

  async function merge(left: number[], right: number[]): Promise<number[]> {
    const result: number[] = [];
    let i = 0, j = 0;
    const totalArray = [...newArray];
    const leftStart = newArray.indexOf(left[0]);

    while (i < left.length && j < right.length) {
      setActiveIndices([leftStart + i, leftStart + left.length + j]);
      setStageText(`Comparing ${left[i]} with ${right[j]}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (left[i] < right[j]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }

      const mergedPart = [...result, ...left.slice(i), ...right.slice(j)];
      totalArray.splice(leftStart, mergedPart.length, ...mergedPart);
      setNewArray([...totalArray]);
    }

    const finalResult = [...result, ...left.slice(i), ...right.slice(j)];
    return finalResult;
  }

  async function bubbleSort(arr: number[]) {
    const sortedArr = [...arr];
    const n = sortedArr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (sortedArr[j] > sortedArr[j + 1]) {
          const temp = sortedArr[j];
          sortedArr[j] = sortedArr[j + 1];
          sortedArr[j + 1] = temp;
          setActiveIndices([j, j + 1]);
          setStageText(`Swapping ${sortedArr[j]} with ${sortedArr[j + 1]}`);
          setNewArray([...sortedArr]);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
  }

  async function quickSort(arr: number[], start = 0, end = arr.length - 1) {
    if (start >= end) return;

    const pivot = arr[end];
    let pivotIndex = start;

    setActiveIndices([end]);
    setStageText(`Pivot: ${pivot}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    for (let i = start; i < end; i++) {
      if (arr[i] <= pivot) {
        const temp = arr[i];
        arr[i] = arr[pivotIndex];
        arr[pivotIndex] = temp;
        setActiveIndices([i, pivotIndex]);
        setStageText(`Swapping ${arr[i]} with ${arr[pivotIndex]}`);
        setNewArray([...arr]);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        pivotIndex++;
      }
    }

    arr[end] = arr[pivotIndex];
    arr[pivotIndex] = pivot;
    setNewArray([...arr]);
    await new Promise((resolve) => setTimeout(resolve, 700));

    await quickSort(arr, start, pivotIndex - 1);
    await quickSort(arr, pivotIndex + 1, end);
  }

  async function insertionSort(arr: number[]) {
    const sortedArr = [...arr];
    for (let i = 1; i < sortedArr.length; i++) {
      const current = sortedArr[i];
      let j = i - 1;

      setActiveIndices([i]);
      setStageText(`Current element: ${current}`);
      await new Promise((resolve) => setTimeout(resolve, 700));

      while (j >= 0 && sortedArr[j] > current) {
        sortedArr[j + 1] = sortedArr[j];
        setActiveIndices([j, j + 1]);
        setStageText(`Moving ${sortedArr[j]} right`);
        setNewArray([...sortedArr]);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        j--;
      }
      sortedArr[j + 1] = current;
      setNewArray([...sortedArr]);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setActiveIndices([]);
  }

  async function handleSort() {
    setSorting(true);
    try {
      if (algorithm === "bubble") {
        await bubbleSort(newArray);
      } else if (algorithm === "insertion") {
        await insertionSort(newArray);
      } else if (algorithm === "quick") {
        const arrCopy = [...newArray];
        await quickSort(arrCopy);
        setNewArray(arrCopy);
      } else if (algorithm === "merge") {
        const sorted = await mergeSort([...newArray]);
        setNewArray(sorted);
      }
    } finally {
      setActiveIndices([]);
      setStageText("");
      setSorting(false);
    }
  }

  const algorithmNames = {
    bubble: "Bubble Sort",
    insertion: "Insertion Sort",
    quick: "Quick Sort",
    merge: "Merge Sort",
  };

  // Calculate bar width based on container width and array size
  const getBarWidth = () => {
    if (!containerRef.current) return 10;
    const containerWidth = containerRef.current.clientWidth;
    const barWidth = Math.max(5, Math.floor(containerWidth / newArray.length) - 2);
    return barWidth;
  };

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4 md:p-8 min-h-screen bg-gray-800">
      <div className="text-lg sm:text-xl md:text-2xl text-slate-200 text-center h-12 md:h-16">
        {stageText}
      </div>

      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 w-full">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full justify-center items-center">
          <select
            className="text-base sm:text-lg md:text-xl bg-white p-1 sm:p-2 rounded-lg w-full sm:w-auto"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            {Object.entries(algorithmNames).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <label className="text-white text-sm sm:text-base">
              Array Size:
            </label>
            <input
              type="range"
              min="10"
              max="120"
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              disabled={sorting}
              className="w-full sm:w-32 md:w-48"
            />
            <span className="text-white text-sm">{arraySize}</span>
          </div>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mt-2 mb-4 text-center">
        {algorithmNames[algorithm as keyof typeof algorithmNames]}
      </h1>

      <div className="flex flex-wrap justify-center gap-2 w-full">
        <button
          onClick={handleSort}
          disabled={sorting}
          className={`px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg text-white text-sm sm:text-base md:text-lg ${
            sorting ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          } transition`}
        >
          {sorting ? "Sorting..." : "Sort Array"}
        </button>

        <button
          onClick={generateNewArray}
          disabled={sorting}
          className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg text-white text-sm sm:text-base md:text-lg bg-blue-700 hover:bg-blue-800 transition"
        >
          Generate New Array
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex justify-center items-end w-full h-64 sm:h-80 md:h-96 mt-4 sm:mt-6 overflow-x-hidden p-2 bg-gray-900 rounded-lg"
      >
        {newArray.map((value, index) => {
          const barWidth = getBarWidth();

          return (
            <div
              key={index}
              className="relative flex items-end justify-center transition-all duration-300"
              style={{
                height: `${Math.max(value * 2, 4)}px`,
                width: `${barWidth}px`,
                marginRight: '1px',
                transform: activeIndices.includes(index) ? "scale(1.05)" : "scale(1)",
                backgroundColor: activeIndices.includes(index)
                  ? "#10B981" // Changed from red (#EF4444) to green (#10B981)
                  : "#3B82F6",
              }}
            >
              {/* Always show number, handle different displays based on bar width */}
              {barWidth >= 15 ? (
                // For larger bars, show number inside vertically
                <span className="text-white text-xs sm:text-sm font-bold rotate-180 absolute bottom-1"
                      style={{writingMode: 'vertical-rl'}}>
                  {value}
                </span>
              ) : (
                // For smaller bars, show number above the bar
                <span className="text-white text-xs absolute -top-4 left-0 right-0 text-center"
                      style={{fontSize: Math.max(8, Math.min(10, barWidth - 2)) + 'px'}}>
                  {value}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
