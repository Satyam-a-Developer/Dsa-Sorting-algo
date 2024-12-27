"use client";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [newArray, setNewArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [stageText, setStageText] = useState("");

  function generateNewArray() {
    const generatedArray = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 100)
    );
    setNewArray(generatedArray);
  }

  useEffect(() => {
    generateNewArray();
  }, []);

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
          setStageText(`Comparing ${sortedArr[j]} with ${sortedArr[j + 1]}`);
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

  return (
    <div className="flex flex-col items-center gap-8 p-8 min-h-screen bg-gray-800">
      <div className="text-[30px] text-slate-200">{stageText}</div>
      <select
        className="text-xl bg-white p-2 rounded-lg"
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
      >
        {Object.entries(algorithmNames).map(([key, name]) => (
          <option key={key} value={key}>
            {name}
          </option>
        ))}
      </select>

      <h1 className="text-4xl font-bold text-red-600">
        {algorithmNames[algorithm as keyof typeof algorithmNames]}
      </h1>

      <button
        onClick={handleSort}
        disabled={sorting}
        className={`px-6 py-3 rounded-lg text-white ${
          sorting ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        } transition`}
      >
        {sorting ? "Sorting..." : "Sort Array"}
      </button>

      <button
        onClick={generateNewArray}
        disabled={sorting}
        className="px-6 py-3 rounded-lg text-white bg-blue-700 hover:bg-blue-800 transition"
      >
        Generate New Array
      </button>

      <div className="flex gap-2 mt-10">
        {newArray.map((value, index) => (
          <div
            key={index}
            className="w-10 text-white text-center transition-all duration-300"
            style={{
              height: `${value * 5}px`,
              transform: activeIndices.includes(index) ? "scale(1.1)" : "scale(1)",
              backgroundColor: activeIndices.includes(index)
                ? "#EF4444"
                : "#3B82F6",
            }}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
}