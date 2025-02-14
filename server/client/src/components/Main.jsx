import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { IoMdMenu } from "react-icons/io";
import Editor from "@monaco-editor/react";
import Output from "./Output";
import { toast } from "react-toastify";
import { Navbar } from "./Home";
import { motion } from "framer-motion";
const socket = io("http://localhost:3000");

function Main() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const [users, setUsers] = useState([]);
  const [text, setText] = useState("Write your code");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [language, setLanguage] = useState("cpp");
  const [slide, setslide] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    if (!state) return navigate(`/share/${roomId}`);
  }, []);


  const [visibleSection, setVisibleSection] = useState('chat'); // State to manage visibility

  const toggleSection = () => {
    setVisibleSection(prevSection => (prevSection === 'chat' ? 'code' : 'chat'));
  };
  const chatScrollRef = useRef();
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    if (!state?.username) return;

    socket.emit("user", { username: state.username, roomName: roomId });

    socket.on("sendtoall", (userList) => {
      setUsers(userList);
    });

    socket.on("user-joined", ({ username }) => {
      const joinAudio=new Audio("/join.wav");
      joinAudio.play()
      toast(
        <span>
          <span className="font-bold text-xl text-blue-600 ">{username}</span>{" "}
          joined the room!
        </span>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        }
      );
    });

    socket.on("load-text", (texts) => {
      setText(texts);
    });

    socket.on("update-text", (newText) => {
      setText(newText);
    });

    socket.on("send-message", (newMessage) => {
      setChat((prev) => [...prev, newMessage]);
    });

    socket.on("load-message", (messages) => {
      setChat(messages);
    });
socket.on("load-language",(lan)=>{
  setLanguage(lan);
})
socket.on("set-language",(lan)=>{
  setLanguage(lan);
})
    socket.on("user-left", ({ socketId, username }) => {
      const leaveRoom=new Audio("/disconnect.wav");
      leaveRoom.play()
      toast(
        <span>
          <span className="font-bold text-xl text-red-600 ">{username}</span>{" "}
          left the room!
        </span>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        }
      );

      setUsers((prev) => prev.filter((client) => client.socketId !== socketId));
    });

    return () => {
      socket.off("sendtoall");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("send-message");
      socket.off("load-message");
      socket.off("update-text");
      socket.off("set-language");
      socket.off("load-language");
      socket.disconnect();
    };
  }, []);

  const handleText = (newValue) => {
    setText(newValue);
    socket.emit("update-text", newValue);
  };

  const handleLanguage=(e)=>{
       setLanguage(e.target.value)
       socket.emit("set-language",e.target.value)
  }

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMessage = { username: state.username, message: message };
    setChat((prev) => [...prev, newMessage]);
    socket.emit("send-message", newMessage);
    setMessage("");
  };

  const leaveRoom = () => {
    socket.disconnect();
    return navigate("/", { state: null });
  };

  const handleShare = (roomId) => {
    const roomLink = `http://localhost:5173/share/${roomId}`;
    const message = ` Join me on CodeCollab to collaborate on some code! Here’s the link to our room: ${roomLink}\n\nLet’s get started!`;
  
    navigator.clipboard.writeText(message).then(() => {
      toast("Link copied!", {
        theme: "dark",
      });
    });
  };

  

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100">
   <nav className="flex justify-between items-center p-4 bg-zinc-900 text-white">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold cursor-pointer"
      >
        CodeCollab
      </motion.div>
      <motion.button
      onClick={leaveRoom}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
      >
        Leave
       
      </motion.button>
    </nav>
      
      <div className="flex items-center gap-5  ">
        <button onClick={() => setslide(!slide)} className="">
          {" "}
          <IoMdMenu className="w-10 h-10 " />
        </button>
{
  state &&         <div className="text-center p-3 bg-gray-800 rounded-lg shadow-md w-56 md:w-1/3 md:my-3">
  <p className="text-sm  md:text-xl text-white">
    Hey <span className="text-blue-400 font-bold">{state.username}</span>, welcome to{" "}
    <span className="text-blue-400 font-bold">{roomId}</span>! Let’s code together! 💻✨
  </p>

</div>
}
<button
        onClick={toggleSection}
        className="md:hidden right-4 bg-blue-700 text-white px-4 py-2 rounded-lg z-50"
      >
        {visibleSection === 'chat' ? 'Show Code' : 'Show Chat'}
      </button>
        {/* <span className="text-blue-600 font-bold text-xl">Hey {state.username}, welcome to {roomId}! Great things happen when we code together. Let’s get started! 💻✨ </span> */}
      </div>

      <div className="w-full h-24 md:h-screen flex flex-col md:flex-row ">
        {/* Connected users left side */}
        <div
          className={`flex flex-col bg-zinc-800 transition-all duration-300 ease-in-out ${
            slide
              ? "max-w-0 opacity-0 overflow-hidden"
              : "max-w-full md:max-w-[20%] opacity-100"
          }`}
          style={{
            width: slide ? "0px" : "100%",
            minWidth: slide ? "0px" : "250px",
          }}
        >
          <div className="w-full bg-zinc-800 px-2 flex flex-col h-full">
            <h3 className="font-semibold text-xl tracking-tight p-2">
              Connected Users
            </h3>
            <div className="p-2 flex flex-col gap-2 overflow-auto flex-grow scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-zinc-800">
             {state && <> <div
                  className="avatar flex items-center gap-3 bg-zinc-700 rounded-lg shadow-2xl p-2 hover:cursor-pointer"
                >
                  <div className="w-14 rounded-full">
                    <img
                      src={`https://avatar.iran.liara.run/public/${Math.random()+Math.random()}?random=${Math.random()}`}
                      alt="User Avatar"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{state.username} (You) </h3>
                </div></>}
             <div className="border-b"></div>
              {users.filter((elem,key)=>elem.username!==state.username).map((elem, index) => (
                <div
                  key={index}
                  className="avatar flex items-center gap-3 bg-zinc-700 rounded-lg shadow-2xl p-2 hover:cursor-pointer"
                >
                  <div className="w-14 rounded-full">
                    <img
                      src={`https://avatar.iran.liara.run/public/${index}?random=${Math.random()}`}
                      alt="User Avatar"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{elem.username} </h3>
                </div>
              ))}
            </div>
            <button onClick={() => handleShare(roomId)} className="m-2 bg-blue-700 px-3 py-2 rounded-lg font-semibold  focus:outline-none focus:ring-2 focus:ring-blue-300  ">
              Share 
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className={`flex flex-col md:flex-row justify-between transition-all duration-300 ease-in-out ${slide ? "w-full" : "w-full md:w-4/5"}`}>
      {/* Toggle Button for Mobile View */}


      {/* Chat Section */}
      <div className={`bg-zinc-900 w-full md:w-96 m-2 rounded-xl shadow-lg flex flex-col h-[calc(100vh-8rem)] md:h-screen ${visibleSection === 'chat' ? 'block' : 'hidden md:block'}`}>
        {/* Chat Messages */}
        <div className="overflow-auto flex-grow p-2 scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-zinc-800">
          {chat.length<1 ? <div className="h-full flex items-center justify-center">
        <p className="text-zinc-400 text-lg text-center">
          No messages yet. Start the conversation!
        </p>
      </div>:  chat.map((elem, index) => (
            <div
              ref={chatScrollRef}
              key={index}
              className={`chat ${elem.username === state.username ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-header">{elem.username}</div>
              <div className="chat-bubble">{elem.message}</div>
            </div>
          ))}
        </div>

        {/* Send Message Input Box */}
        <div className="p-3 bg-zinc-800 flex gap-2 mt-auto">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-4/5 text-lg tracking-tighter outline-none px-2 py-1 rounded-md bg-zinc-700"
            placeholder="Type your message..."
            type="text"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-700 text-lg tracking-tighter px-3 py-1 rounded-lg font-semibold"
          >
            Send
          </button>
        </div>
      </div>

      {/* Code Editor Section */}
      <div className={`bg-zinc-800 w-full md:w-3/4 p-2 flex justify-center transition-all duration-300 ${visibleSection === 'code' ? 'block' : 'hidden md:block'}`}>
        <div className="w-full">
          <select
            style={{
              marginBottom: "10px",
              padding: "8px",
              borderRadius: "5px",
            }}
            value={language}
            onChange={ handleLanguage}
          >
            <option value="cpp">C++</option>
            <option value="javascript">JavaScript</option>
          </select>

          <Editor
            height="400px"
            width="100%"
            language={language}
            value={text}
            onChange={(value) => handleText(value || "")}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              quickSuggestions: {
                other: true,
                comments: true,
                strings: true,
              },
              suggestOnTriggerCharacters: true,
              wordBasedSuggestions: true,
            }}
          />

          <div>
            <Output code={text} language={language} socket={socket}/>
          </div>
        </div>
      </div>
    </div>
  
      </div>
   
    </div>
  );
}

export default Main;

// main code
// import React, { useEffect, useRef, useState } from 'react';
// import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
// import { io } from "socket.io-client";

// import { IoMdMenu } from "react-icons/io";
// import Editor from "@monaco-editor/react";
// import Output from './Output';
// import { toast } from 'react-toastify';
// const socket = io("http://localhost:3000");
// function Main() {
//   const { roomId } = useParams();
//   const { state } = useLocation();
//   const [users, setUsers] = useState([]);
//   const [text, setText] = useState("Write your code");
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);
//   const [language, setLanguage] = useState("cpp");
//   const [slide,setslide]=useState(false)

//   const navigate=useNavigate()
//   useEffect(() => {
//     if(!state) return navigate("/")
//   }, [])

//     const scroll=useRef()
//     useEffect(()=>{
//         scroll.current?.scrollIntoView({behavior:"smooth"});
//     },[chat]);

//     useEffect(() => {
//       if (!state?.username) return;

//       socket.emit("user", { username: state.username, roomName: roomId });

//       socket.on("sendtoall", (userList) => {
//           setUsers(userList);
//       });

//       socket.on("user-joined", ({ username }) => {
//         toast(  <span>
//           <span className="font-bold text-xl text-blue-600 ">{username}</span> joined the room!
//         </span>,{
//           position: "top-right",
//           autoClose: 3000, // Closes after 3 seconds
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           theme: "dark",
//         })
//       });

//       socket.on("load-text", (texts) => {
//           setText(texts);
//       });

//       socket.on("update-text", (newText) => {
//           setText(newText);
//       });

//       socket.on("send-message", (newMessage) => {
//           setChat((prev) => [...prev, newMessage]);
//       });

//       socket.on("load-message", (messages) => {
//           setChat(messages);
//       });

//       socket.on("user-left", ({ socketId, username }) => {
//          toast( <span>
//           <span className="font-bold text-xl text-red-600 ">{username}</span>left the room!
//         </span>,{
//           position: "top-right",
//           autoClose: 3000, // Closes after 3 seconds
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           theme: "dark",
//         })

//           setUsers((prev) => prev.filter((client) => client.socketId !== socketId));
//       });

//       return () => {
//           socket.off("sendtoall");
//           socket.off("user-joined");
//           socket.off("user-left");
//           socket.off("send-message");
//           socket.off("load-message");
//           socket.off("update-text");
//           socket.disconnect();
//       };
//   }, []);

//   const handleText = (newValue) => {
//     setText(newValue); // Directly set the new value
//     socket.emit("update-text", newValue); // Emit the updated text
// };

//       // ✅ Fix: Send only the new message
//       const sendMessage = () => {
//         if (!message.trim()) return;

//         const newMessage = { username: state.username, message: message };

//         setChat((prev) => [...prev, newMessage]); // Update local chat state

//         socket.emit("send-message", newMessage); // Emit only the new message

//         setMessage(""); // Clear input after sending
//       };

// const leaveRoom=()=>{
// socket.disconnect()
// return navigate("/",{ state: null } );
// }

// const handleShare = (roomId) => {
//   navigator.clipboard.writeText(roomId).then(() => {
//    toast("Room ID copied!",{
//     theme:"dark"
//    });
//   });
// };

// console.log(state);

//     return (
//         <div className='min-h-screen w-full bg-zinc-950 text-zinc-100'>
//             <div className='flex justify-between px-4 py-2 bg-zinc-800'>
//                 <div className='text-2xl font-bold'>LiveCode</div>
//                 <button onClick={leaveRoom} className='bg-red-700 px-2 py-1 rounded-full'>
//                   Leave
//                    </button>
//             </div>
//     <div className='flex  items-center gap-5'>
//     <button onClick={()=>setslide(!slide)} className=''> <IoMdMenu className='w-10 h-10 ' />
//     </button>
//     <span className='text-blue-600 font-bold text-xl'>Room: {roomId} </span>
//     </div>

//             <div   className='w-full h-screen flex  '>
//                 {/* Connected users left side */}

//                 <div
//   className={`flex flex-col bg-zinc-800 transition-all duration-300 ease-in-out ${
//     slide ? "max-w-0 opacity-0 overflow-hidden" : "max-w-[20%] opacity-100"
//   }`}
//   style={{ width: slide ? "0px" : "20%", minWidth: slide ? "0px" : "250px" }}
// >

//                     <div className='w-full bg-zinc-800 px-2 flex flex-col h-full'>
//                         <h3 className='font-semibold text-xl tracking-tight p-2'>Connected Users</h3>
//                         {/* User list with overflow */}
//                         <div ref={scroll} className='p-2 flex flex-col gap-2 overflow-auto flex-grow scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-zinc-800'>
//                             {users.map((elem, index) => (
//                                 <div key={index} className="avatar flex items-center gap-3 bg-zinc-700 rounded-lg shadow-2xl p-2 hover:cursor-pointer">
//                                     <div className="w-14 rounded-full">
//                                     <img
//                 src={`https://avatar.iran.liara.run/public/${index}?random=${Math.random()}`}
//                 alt="User Avatar"
//             />
//                                     </div>
//                                     <h3 className='font-semibold text-lg'>{elem.username} </h3>
//                                 </div>
//                             ))}
//                         </div>
//                         <button onClick={() => handleShare(roomId)} className='m-2 bg-blue-700 px-3 py-2 rounded-lg font-semibold'>Share</button>
//                     </div>
//                 </div>

//                 {/* Right side */}
//                 <div
//   className={`flex justify-between transition-all duration-300 ease-in-out ${
//     slide ? "w-full" : "w-4/5"
//   }`}
// >

//                     <div className='bg-zinc-900 w-96 m-4 rounded-xl shadow-lg flex flex-col'>

//                     <div className='overflow-auto flex-grow p-2 scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-zinc-800'>
//     {chat.map((elem, index) => (
//         <div ref={scroll} key={index} className={`chat ${elem.username === state.username ? "chat-end" : "chat-start"}`}>
//             <div className='chat-header'>{elem.username}</div>
//             <div className='chat-bubble'>{elem.message}</div>
//         </div>
//     ))}
//     {/* Add this extra div at the bottom to help with scrolling */}
//     {/* <div ref={scroll}></div> */}
// </div>
//                         <div className='p-3 bg-zinc-800 flex gap-2'>
//                             <input value={message} onChange={(e)=>setMessage(e.target.value)} className='w-4/5 text-lg tracking-tighter outline-none px-2 py-1 rounded-md bg-zinc-700' placeholder='Type your message...' type='text' />
//                             <button onClick={sendMessage} className='bg-blue-700 text-lg tracking-tighter px-3 py-1 rounded-lg font-semibold'>Send</button>
//                         </div>
//                     </div>

//                     <div className={`bg-zinc-800 w-3/4 p-2 flex justify-center transition-all duration-300`}>
//                     {/* <textarea value={text} onChange={handleText} className='w-full h-1/2 p-4 '></textarea> */}
//                     {/* <CodeEditor code={text} change={handleText}  /> */}
//                     <div >
//       {/* Language Selector */}
//       <select
//         style={{ marginBottom: "10px", padding: "8px", borderRadius: "5px" }}
//         value={language}
//         onChange={(e) => setLanguage(e.target.value)}
//       >
//         <option value="cpp">C++</option>
//         <option value="javascript">JavaScript</option>
//       </select>

//       {/* Monaco Editor */}
//       <Editor
//         height="350px"
//         width={slide ? "1000px" : "700px"}

//         language={language}
//         value={text}
//         onChange={(value) => handleText(value || "")}
//         theme="vs-dark"
//         options={{
//           fontSize: 14,
//           minimap: { enabled: false },
//           quickSuggestions: { other: true, comments: true, strings: true },
//           suggestOnTriggerCharacters: true,
//           wordBasedSuggestions: true,
//         }}
//       />

//      <div> <Output code={text}  language={language} /> </div>
//     </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Main;
