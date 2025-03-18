import axios from "axios";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async (language, sourceCode) => {
  let version;

  if (language === "javascript") {
    version = "18.15.0";
  } else if (language === "cpp" || language === "c++") {
    language = "cpp"; // Ensuring it's recognized by the API
    version = "10.2.0";
  } else {
    throw new Error("Unsupported language");
  }

  try {
    const response = await API.post("/execute", {
      language,
      version,
      files: [{ content: sourceCode }],
    });

    return response.data;
  } catch (error) {
    console.error("Code execution failed:", error);
    return { error: "Execution failed. Please check your code and try again." };
  }
};


// import axios from "axios";

// const API = axios.create({
//   baseURL: "https://emkc.org/api/v2/piston",
// });

// // Function to get available languages and their versions
// export const getAvailableLanguages = async () => {
//   const response = await API.get("/runtimes");
//   return response.data; // This contains all available languages and versions
// };

// // Example usage:
// getAvailableLanguages().then((data) => console.log(data));