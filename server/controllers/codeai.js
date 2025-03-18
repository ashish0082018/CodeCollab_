import axios from "axios"
import dotenv from "dotenv"
dotenv.config()
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;





export const askai=async(req, res)=> {
  try {
    const { prompt } = req.body;
   
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Call Gemini API
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: 
            
          `You are a code optimization assistant. Analyze the following code and perform the following tasks:

1. If the code contains errors, correct them and provide the fixed code.
2. If the code is correct, optimize it for readability, performance, or best practices.
3. Add concise and relevant comments to explain key parts of the code.
4. Do not include any additional explanations, language identification, or unrelated text. Only provide the corrected or optimized code with comments.

Here is the code:
"${prompt}"
          ` }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    // Extract response safely
    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  

    if (!rawText) {
      return res.status(500).json({ error: "Empty response from AI" });
    }

    // Send the AI response
    return res.status(200).json(rawText);

  } catch (error) {
    console.error("Error in ask-bot API:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json(
      { error: error.response?.data?.error?.message || "Internal Server Error" }
    );
  }
}

