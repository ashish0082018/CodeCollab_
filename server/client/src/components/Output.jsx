import React, { useEffect, useState } from 'react'
import {  executeCode } from '../api.js';
import { toast } from 'react-toastify';

function Output({code,language,socket}) {

  
  const [output,setOutput]=useState("")
  const [error,setError]=useState("")
  const [loading,setloading]=useState(false)

  useEffect(()=>{
    socket.on("load-output",(out)=>{
      setOutput(out)
    })
    socket.on("load-error",(err)=>{
      setError(err)
    })
    socket.on("update-output",(out)=>{
      setOutput(out)
    })
    socket.on("update-error",(err)=>{
      setError(err)
    })
    return ()=>{
      socket.off("load-output");
      socket.off("load-error");
      socket.off("update-output");
      socket.off("update-error");
    
    }

  },[])



   const runCode=async()=>{
       if(!code) {
        return toast("Write some code", {
            position: "top-right",
            autoClose: 3000, // Closes after 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          });
       }
  try {
    setloading(true)
  
   const res= await executeCode(language,code)
   setOutput(res.run.output)
   socket.emit("update-output",res.run.output)
   setError(res.run.stderr)
   socket.emit("update-error",res.run.stderr)
   setloading(false)

  } catch (error) {
    console.log(error);
    
  }
    }
  return (
    <> 
     <div className='bg-zinc-900 md:h-72 h-80 flex flex-grow flex-col p-3 text-zinc-400 border  mt-3 rounded-md '>
     <div className='h-full overflow-auto'>

     {output ? <> {output} </>:<>Click "Run Code" to see the output here</>}

 {error}
     </div>

     <div className='w-10 mt-3'> <button onClick={runCode} className='bg-blue-600 px-2 py-1 rounded-lg font-semibold w-28 text-zinc-100 hover:scale-105 transition-all shadow-lg  '  >  {loading ? <span className="loading loading-spinner loading-xs "></span>:"Run code"} </button></div>

    </div>
    </>
    
   
  )
}

export default Output