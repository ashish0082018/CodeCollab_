import axios from 'axios'

const API=axios.create({
    baseURL:"https://emkc.org/api/v2/piston"
})

export const executeCode=async(language,sourceCode)=>{
    let version;
    if(language==="javascript"){
        version="18.15.0"
    }
    else if(language==="cpp"){
        version="10.2.0"
    }
 const response=await API.post("/execute",{
    

  "language": language,
  "version": version,
  "files": [
    {
     
      "content": sourceCode
    }
  ],
 })
 return response.data
}

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