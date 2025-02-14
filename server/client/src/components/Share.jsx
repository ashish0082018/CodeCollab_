import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Footer } from './Home';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function JoinRoom() {
  const { room } = useParams();
  const [username, setusername] = useState('');
  const navigate = useNavigate();

  const handlesubmit = (e) => {
    e.preventDefault();
    if (username === '') {
      toast.warn('Please enter your username!', { autoClose: 2000 });
      return;
    }
    navigate(`/room/${room}`, { state: { username } });
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col">
      {/* Navbar */}
      <div>
        <nav className="flex justify-between items-center p-4 bg-zinc-950 text-white">
          <div className="text-2xl font-bold">
            <Link to={"/"}>CodeCollab</Link>
          </div>
        </nav>
      </div>

      {/* Body section */}
      <div className="flex flex-1 items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-800 rounded-lg shadow-lg w-full max-w-md px-6 py-5"
        >
          <div className="flex justify-center mb-4">
            <motion.img
              src="/favicon.ico" // Replace with your logo path
              alt="Logo"
              className="w-14 h-14"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          </div>
          <h2 className="text-2xl font-bold text-center p-4">
            Join the Room: <span className="text-3xl text-blue-700 shadow-xl hover:underline hover:cursor-pointer">{room}</span>
          </h2>
          <p className="text-center text-zinc-300 mb-6">
            Welcome to the room! Enter your username to join the collaboration.
          </p>
          <form onSubmit={handlesubmit}>
            <div className="flex flex-col gap-2 p-3">
              <label className="text-lg font-semibold tracking-tighter">Your Username</label>
              <motion.input
                value={username}
                onChange={(e) => setusername(e.target.value)}
                type="text"
                placeholder="e.g., Alex123"
                className="text-lg tracking-tighter outline-none px-3 py-2 rounded-md bg-zinc-700 w-full"
                whileFocus={{ scale: 1.02 }}
              />
              <p className="text-sm text-zinc-400 mt-1">
                Pick a username to identify yourself in the room. Make it fun and memorable!
              </p>
            </div>
            <motion.button
              type="submit"
              className="bg-zinc-500 px-4 py-2 rounded-lg shadow-lg mt-3 hover:bg-zinc-600 transition text-lg font-semibold w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Room
            </motion.button>
          </form>
          <div className="p-3 text-center hover:underline cursor-pointer hover:text-blue-600">
            <Link to={"/create"}>Create a New Room</Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default JoinRoom;