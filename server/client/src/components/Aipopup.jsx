import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

const AIPopup = ({ code }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [data, setData] = useState("");
  const [isAnimating, setIsAnimating] = useState(false); // For smooth transition
  const prevCodeRef = useRef(); // To store the previous code value

  const togglePopup = async () => {
    if (!isPopupOpen) {
      setIsPopupOpen(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsPopupOpen(false), 300); // Wait for animation to complete
    }

    // Check if the code has changed
    if (code === prevCodeRef.current) {
      console.log("Code state unchanged. Skipping API call.");
      return;
    }

    // Update the previous code reference
    prevCodeRef.current = code;

    setLoad(true);
    try {
      const response = await axios.post("https://codecollab-s62f.onrender.com/api/v1/ai/askai", { prompt: code });

      // Set the AI response
      setData(response.data);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setData("// Error fetching AI response. Please try again.");
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10">
      {/* Circular AI Button */}
      <div
        className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-600 transition-colors"
        onClick={togglePopup}
      >
        <span className="text-white text-2xl">🤖</span> {/* AI Symbol */}
      </div>

      {/* Popup on the Right Side */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
          <div
            className={`bg-zinc-700 h-full w-full md:w-96 p-6 shadow-lg overflow-y-auto flex flex-col transform transition-transform duration-300 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"}`}
          >
            <h2 className="text-xl font-bold mb-4 text-white">AI Solution</h2>
            <div className="text-gray-700 flex-1">
              {load ? (
                // Beautiful Loader
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="h-[70vh] rounded-xl">
                  <Editor
                    height="100%"
                    width="100%"
                    defaultLanguage="javascript" // Set default language
                    value={data}
                    theme="vs-dark"
                    options={{
                      readOnly: true, // Make the editor read-only
                      wordWrap: "on", // Enable word wrap
                      minimap: { enabled: false }, // Disable minimap
                      scrollBeyondLastLine: false, // Disable scrolling beyond the last line
                      fontSize: 14, // Set font size
                      fontFamily: "monospace", // Use monospace font
                      lineNumbers: "on", // Show line numbers
                    }}
                  />
                </div>
              )}
            </div>
            {/* Close Button at the End */}
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors self-end"
              onClick={togglePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPopup;