import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LeaveButton = ({ leaveRoom }) => {
  const dialogRef = useRef(null);
const navigate=useNavigate()
  const handleOpenDialog = () => {
    dialogRef.current.showModal();
  };

  const handleCloseDialog = () => {
    dialogRef.current.close();
  };

  const handleConfirmLeave = () => {
   navigate("/")
  };

  return (
    <div>
      {/* Leave Button */}
      <motion.button
        onClick={handleOpenDialog}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 ease-in-out dark:bg-red-700 dark:hover:bg-red-800"
      >
        Leave
      </motion.button>

      {/* Dialog Container */}
      <dialog
        ref={dialogRef}
        className="backdrop:bg-black/50 p-0 border-none rounded-lg shadow-lg w-[90%] max-w-md overflow-hidden backdrop:backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === dialogRef.current) handleCloseDialog();
        }}
      >
        {/* Framer Motion Wrapper for Animation */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white dark:bg-zinc-800 p-6 rounded-lg transition-all duration-300 ease-in-out"
          >
            {/* Dialog Title */}
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Confirm Leave
            </h2>
            {/* Dialog Description */}
            <p className="text-zinc-600 dark:text-zinc-300 mt-2">
              Are you sure you want to leave the room?
            </p>
            {/* Action Buttons */}
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 bg-zinc-200 text-zinc-800 rounded-md hover:bg-zinc-300 transition-all duration-300 ease-in-out dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLeave}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300 ease-in-out dark:bg-red-700 dark:hover:bg-red-800"
              >
                Leave
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </dialog>
    </div>
  );
};

export default LeaveButton;