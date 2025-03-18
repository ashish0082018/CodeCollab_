import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroSection from "./Landing";


export const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-zinc-900 text-white px-8">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold cursor-pointer"
      >
        CodeCollab
      </motion.div>
      <Link to={"/create"}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      > Create
        
      </motion.button>  </Link>
    </nav>
  );
};



const FeaturesSection = () => {
  const features = [
    {
      title: "Real-Time Collaboration",
      description: "Work on code with your team in real-time. See changes instantly.",
      icon: "👥",
    },
    {
      title: "Live Code Compilation",
      description: "Compile and run your code directly in the editor.",
      icon: "💻",
    },
    {
      title: "Integrated Chat",
      description: "Communicate with your team without leaving the editor.",
      icon: "💬",
    },
  ];

  return (
    <div className="py-16 bg-zinc-900">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center text-white mb-12"
      >
        Features
      </motion.h2>
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-zinc-800 p-6 rounded-lg shadow-lg text-center"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export  const Footer = () => {
    return (
      <footer className="bg-zinc-950 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} CodeCollab. All rights reserved.
          </p>
          <p className="text-gray-400 mt-2">
            Made by {" "}
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Ashish Verma
            </a>
            – turning ideas into reality
          </p>
        </div>
      </footer>
    );
  };
const HomePage = () => {
  return (
    <div className="min-h-screen bg-zinc-900">
  
      <Navbar />
      <HeroSection />
      
   
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default HomePage;