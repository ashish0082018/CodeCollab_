import React from "react";
import { motion } from "framer-motion";
import { SparklesCore } from "../components/ui/sparkles";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center"
      >
        <h1 className="md:text-7xl text-4xl lg:text-9xl font-bold text-center text-white relative z-20">
          CodeCollab
        </h1>
        <div className="w-full md:w-[40rem] h-40 relative">
          {/* Gradients */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

          {/* Core component */}
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={window.innerWidth < 768 ? 800 : 1200} // Adjust density for mobile
            className="w-full h-full"
            particleColor="#FFFFFF"
          />

          {/* Radial Gradient to prevent sharp edges */}
          <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)] md:[mask-image:radial-gradient(500px_300px_at_top,transparent_20%,white)]"></div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-xl text-gray-400 mb-8 text-center px-4"
      >
        A live code editor with real-time collaboration and chat.
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-lg text-gray-400 mb-8 text-center max-w-2xl px-4"
      >
        CodeCollab is the ultimate platform for developers to work together in real-time. Write, compile, and debug code seamlessly while chatting with your team. Whether you're working on a project, teaching, or learning, CodeCollab makes collaboration effortless.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="flex gap-4"
      >
        <Link to={"/create"}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default HeroSection;