import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Footer } from './Home';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Create() {
  const [username, setusername] = useState('');
  const [room, setroom] = useState('');
  const navigate = useNavigate();

  const handlesubmit = (e) => {
    e.preventDefault();
    if (username === '') {
      toast.warn('Please enter your username!', { autoClose: 2000 });
      return;
    }
    if (room === '') {
      toast.warn('Please enter a room name!', { autoClose: 2000 });
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
      <div className="flex flex-1 items-center justify-center px-4  py-3">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-800 rounded-lg shadow-lg w-full max-w-md px-6 py-3 "
        >
          <div className="flex justify-center mb-4 ">
            <motion.img
              src="/favicon.ico" // Replace with your logo path
              alt="Logo"
              className="w-14 h-14 shadow-2xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          </div>
          <h2 className="text-2xl font-bold text-center p-4">Start Collaborating</h2>
          <p className="text-center text-zinc-300 mb-6">
            Create or join a room to collaborate in real-time. Share ideas, code, and grow together!
          </p>
          <form onSubmit={handlesubmit}>
            <div className="flex flex-col gap-2 p-3">
              <label className="text-lg font-semibold tracking-tighter">Room Name</label>
              <motion.input
                value={room}
                onChange={(e) => setroom(e.target.value)}
                type="text"
                placeholder="e.g., Project-Alpha"
                className="text-lg tracking-tighter outline-none px-3 py-2 rounded-md bg-zinc-700 w-full"
                whileFocus={{ scale: 1.02 }}
              />
              <p className="text-sm text-zinc-400 mt-1">
                Choose a unique name for your room. This will be the space where you collaborate.
              </p>
            </div>
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
              Create or Join Room
            </motion.button>
          </form>
          <p className="text-center text-zinc-400 mt-4">
            Already have a room? Just enter the name and join the fun!
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Create;