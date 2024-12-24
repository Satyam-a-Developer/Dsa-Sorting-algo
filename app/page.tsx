"use client";
import { useState, useEffect } from "react";
import { gsap } from "gsap";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [alphabet, setAlphabet] = useState(
    Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
  );

  const targetOrder = inputValue.toUpperCase().split("");

  const rearrangeAlphabet = () => {
    const sorted = [
      ...targetOrder,
      ...alphabet.filter((letter) => !targetOrder.includes(letter)),
    ];
    setAlphabet(sorted);
  };

  // Trigger animation when alphabet changes
  useEffect(() => {
    // Ensure animation is only triggered when alphabet updates
    if (alphabet.length > 0) {
      gsap.fromTo(
        ".alphabet-letter",
        { x: (index) => (index * 40) + "px", opacity: 0 }, // Starting position and opacity
        {
          x: (index) => (index * 50) + "px", // Ending position (same as starting for movement)
          opacity: 1, // Fade in to visible
          duration: 2, // Slow transition
          stagger: 0.1, // Slight stagger between letters
          ease: "power1.out", // Smooth ease
        }
      );
    }
  }, [alphabet]);

  return (
    <div className="flex flex-col items-center gap-8 p-5 min-h-screen">
      <nav className="flex flex-col gap-8 items-center sm:items-start text-red-500 ">
        <ul className="pl-5 list-none bg-blue-300 p-10 rounded-lg">
          <li>Sorting Algorithms</li>
          <li>Data Structures</li>
          <li>Algorithm Analysis</li>
          <li>Big O Notation</li>
        </ul>
      </nav>
      <input
        type="text"
        placeholder="Enter target order"
        className="px-4 py-2 bg-gray-900 text-white rounded w-full"
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        onClick={rearrangeAlphabet}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Rearrange Alphabet
      </button>
      <div className="relative" style={{ width: "100%", minHeight: "100px" }}>
        {alphabet.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className={`alphabet-letter absolute flex justify-center items-center text-lg font-bold h-[80vh] rounded-lg ${
              targetOrder.includes(letter) ? "bg-green-500 h-[30vh]" : "bg-red-500" 
            }`}
            style={{
              transform: `translateX(${index * 50}px)`, // Initial position for the letter
              width: "30px", // Reduced width
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
