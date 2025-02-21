import React, { useState, useEffect, useCallback } from "react";

const App = () => {
  const [array, setArray] = useState([]);
  const [speed, setSpeed] = useState(100);
  const [isSorting, setIsSorting] = useState(false);
  const [status, setStatus] = useState("");

  // Generate a new random array
  const generateArray = useCallback(() => {
    if (isSorting) return; // Prevent generating a new array during sorting
    const newArray = Array.from({ length: 20 }, () =>
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setStatus(""); // Clear any status when generating a new array
  }, [isSorting]);

  // Bubble Sort Algorithm
  const bubbleSort = async () => {
    setIsSorting(true);
    setStatus("Sorting...");
    const arr = [...array];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        await animateComparison(j, j + 1); // Highlight bars being compared
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap elements
          setArray([...arr]); // Update array state to reflect the swap
          await animateSwap(j, j + 1); // Animate the swap
        }
      }
    }
    setArray([...arr]); // Explicitly set the final sorted state
    setStatus("Finished! Please wait for visual to reset.");
    await pauseAfterSorting();
    setStatus(""); // Clear status after the pause
    setIsSorting(false);
  };

  // Selection Sort Algorithm
  const selectionSort = async () => {
    setIsSorting(true);
    setStatus("Sorting...");
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        await animateComparison(minIndex, j);
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]; // Swap elements
        setArray([...arr]);
        await animateSwap(i, minIndex);
      }
    }
    setArray([...arr]);
    setStatus("Finished! Please wait for visual to reset.!");
    await pauseAfterSorting();
    setStatus("");
    setIsSorting(false);
  };

  // Merge Sort Algorithm
  const mergeSort = async () => {
    setIsSorting(true);
    setStatus("Sorting...");

    // Helper function to merge two subarrays
    const merge = async (arr, start, mid, end) => {
      const left = arr.slice(start, mid + 1);
      const right = arr.slice(mid + 1, end + 1);
      let i = 0,
        j = 0,
        k = start;

      while (i < left.length && j < right.length) {
        await animateComparison(k, k); // Highlight the merging process
        if (left[i] <= right[j]) {
          arr[k] = left[i];
          i++;
        } else {
          arr[k] = right[j];
          j++;
        }
        setArray([...arr]); // Update array state to reflect the merge
        k++;
        await delay();
      }

      // Copy any remaining elements of left
      while (i < left.length) {
        arr[k] = left[i];
        i++;
        k++;
        setArray([...arr]);
        await delay();
      }

      // Copy any remaining elements of right
      while (j < right.length) {
        arr[k] = right[j];
        j++;
        k++;
        setArray([...arr]);
        await delay();
      }
    };

    // Recursive Merge Sort function
    const mergeSortRecursive = async (arr, start, end) => {
      if (start >= end) return;

      const mid = Math.floor((start + end) / 2);

      await mergeSortRecursive(arr, start, mid);
      await mergeSortRecursive(arr, mid + 1, end);
      await merge(arr, start, mid, end);
    };

    const arr = [...array];
    await mergeSortRecursive(arr, 0, arr.length - 1);
    setArray([...arr]);
    setStatus("Finished! Please wait for visual to reset.!");
    await pauseAfterSorting();
    setStatus("");
    setIsSorting(false);
  };

  // Pause for 5 seconds after sorting is complete
  const pauseAfterSorting = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 5000); // Pause for 5000ms (5 seconds)
    });
  };

  // Delay function for animations
  const delay = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, (500 - speed) / 10);
    });
  };

  // Animate bar comparison (highlighting)
  const animateComparison = (i, j) => {
    return new Promise((resolve) => {
      const bars = document.querySelectorAll(".bar");
      bars[i].classList.remove("bg-blue-500");
      bars[j].classList.remove("bg-blue-500");
      bars[i].classList.add("bg-yellow-500"); // Highlight with yellow
      bars[j].classList.add("bg-yellow-500");
      setTimeout(() => {
        bars[i].classList.remove("bg-yellow-500");
        bars[j].classList.remove("bg-yellow-500");
        bars[i].classList.add("bg-blue-500"); // Revert to blue
        bars[j].classList.add("bg-blue-500");
        resolve();
      }, (500 - speed) / 10);
    });
  };

  // Animate bar swap
  const animateSwap = (i, j) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, (500 - speed) / 10); // Delay to match animation speed
    });
  };

  // Generate a random array only on the first mount
  useEffect(() => {
    generateArray(); // Only called once when the component mounts
  }, [generateArray]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-200 mb-4">Algorithm Visualizer</h1>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={generateArray}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isSorting}
        >
          Generate New Array
        </button>
        <button
          onClick={bubbleSort}
          className="px-4 py-2 bg-green-500 text-gray-200 rounded hover:bg-green-600"
          disabled={isSorting}
        >
          Bubble Sort
        </button>
        <button
          onClick={selectionSort}
          className="px-4 py-2 bg-purple-500 text-gray-200 rounded hover:bg-purple-600"
          disabled={isSorting}
        >
          Selection Sort
        </button>
        <button
          onClick={mergeSort}
          className="px-4 py-2 bg-red-500 text-gray-200 rounded hover:bg-red-600"
          disabled={isSorting}
        >
          Merge Sort
        </button>
      </div>
      <div className="flex w-full max-w-3xl h-64 items-end border-t bg-gray-800 shadow-md">
        {array.map((value, index) => (
          <div
            key={index}
            className="bar bg-blue-500 mx-1" // Default color is blue
            style={{
              height: `${value * 2}px`,
              width: `${100 / array.length - 1}%`,
            }}
          ></div>
        ))}
      </div>
      <div className="mt-4 flex flex-col items-center w-full max-w-sm">
        <div className="flex items-center w-full">
          <span className="text-gray-200 mr-3">Slower</span>
          <input
            id="speed"
            type="range"
            min="10"
            max="500"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="slider w-full"
          />
          <span className="text-gray-200 ml-3">Faster</span>
        </div>
        {status && (
          <p className="mt-2 text-sm font-semibold text-gray-400">{status}</p>
        )}
      </div>
    </div>
  );
};

export default App;