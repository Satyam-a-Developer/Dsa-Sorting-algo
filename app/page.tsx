'use client'
import React, { useEffect, useState } from "react";

export default function Page() {
  const [newArray, setNewArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState("  ");

  // Generate random numbers on the client side after the component mounts
  useEffect(() => {
    const generatedArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
    setNewArray(generatedArray);
  }, []);

  // Bubble Sort Function
  async function bubbleSortWithVisual(arr: number[]) {
    const sortedArr = [...arr];
    const n = sortedArr.length;

    setSorting(true);
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (sortedArr[j] > sortedArr[j + 1]) {
          const temp = sortedArr[j];
          sortedArr[j] = sortedArr[j + 1];
          sortedArr[j + 1] = temp;

          // Update the state for visualization
          setNewArray([...sortedArr]);
          await new Promise((resolve) => setTimeout(resolve, 300)); // Add delay for animation
        }
      }
    }
    setSorting(false);
  }

  // Insertion Sort Function
  // function insertionSort(arr: number[]): number[] {
  //   const sortedArr = [...arr]; // Avoid mutating the original array
  //   for (let i = 1; i < sortedArr.length; i++) {
  //     let current = sortedArr[i];
  //     let j = i - 1;
  //     while (j >= 0 && sortedArr[j] > current) {
  //       sortedArr[j + 1] = sortedArr[j];
  //       console.log(sortedArr, "arr[j]");
  //       j--;
  //     }
  //     sortedArr[j + 1] = current;
  //   }
  //   return sortedArr;
  // }

  // Quick Sort Function
  // function quickSort(arr: number[]): number[] {
  //   if (arr.length <= 1) return arr; // Base case

  //   const pivot = arr[arr.length - 1];
  //   const left: number[] = [];
  //   const right: number[] = [];
  //   for (let i = 0; i < arr.length - 1; i++) {
  //     if (arr[i] < pivot) {
  //       console.log(arr[i], "arr[i]", "left side push", "quicksort");
  //       left.push(arr[i]);
  //     } else {
  //       console.log(arr[i], "arr[i]", "right side push", "quicksort");
  //       right.push(arr[i]);
  //     }
  //   }
  //   return [...quickSort(left), pivot, ...quickSort(right)];
  // }

  // Merge Sort Function
  // function mergeSort(arr: number[]): number[] {
  //   if (arr.length <= 1) return arr; // Base case

  //   const mid = Math.floor(arr.length / 2);
  //   const left = arr.slice(0, mid);
  //   const right = arr.slice(mid);
  //   return merge(mergeSort(left), mergeSort(right));
  // }

  // function merge(left: number[], right: number[]): number[] {
  //   const result: number[] = [];
  //   let i = 0,
  //     j = 0;

  //   while (i < left.length && j < right.length) {
  //     if (left[i] < right[j]) {
  //       result.push(left[i]);
  //       console.log(left[i], "left[i]", "left side push", "merge");
  //       i++;
  //     } else {
  //       result.push(right[j]);
  //       console.log(right[j], "right[j]", "right side push", "merge");
  //       j++;
  //     }
  //   }

  //   return [...result, ...left.slice(i), ...right.slice(j)];
  // }

  // Example usage
  // const data: number[] = [-2, 45, 3, 11, -9];
  // console.log("Unsorted array:", data);
  // const sortedData = bubbleSort(data);
  // const sortedData2 = insertionSort(data);
  // const sortedData3 = quickSort(data);
  // const sortedData4 = mergeSort(data);

  // console.log("Sorted array:", sortedData, "bubblesort");
  // console.log("Sorted array:", sortedData2, "insertionsort");
  // console.log("Sorted array:", sortedData3, "quicksort");
  // console.log("Sorted array:", sortedData4, "mergesort");
  return (
    <div className="flex flex-col items-center gap-8 p-8 min-h-screen bg-gray-800">
      <select className="text-xl bg-white p-2 rounded-lg" onChange={(e) => setAlgorithm(e.target.value)}>
        <option value="bubble">Bubble Sort</option>
        <option value="insertion">Insertion Sort</option>
        <option value="quick">Quick_Sort</option>
        <option value="merge">Merge_Sort</option>
      </select>
    <h1 className="text-4xl font-bold text-red-600">{algorithm}</h1>
    <button
      onClick={() => bubbleSortWithVisual(newArray)}
      disabled={sorting}
      className={`px-6 py-3 rounded-lg text-white ${sorting ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} transition`}
    >
      {sorting ? "Sorting..." : "Sort Array"}
    </button>
    <div className="flex gap-2 mt-10">
      {newArray.map((value, index) => (
        <div
          key={index}
          className="w-10 bg-cyan-500 text-white text-center"
          style={{
            height: `${value * 5}px`,
            transition: "height 0.3s ease, transform 0.3s ease",
            transform: sorting ? "scale(1.1)" : "scale(1)",
            backgroundColor: sorting ? "red" : "purple",
          }}
        >
          {value}
        </div>
      ))}
    </div>
  </div>
  );
}
