"use client";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

const INACTIVITY_LIMIT = 20 * 60 * 1000; // 20 minutes

const AutoLogout = () => {
  const timeoutRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setShowModal(true); // Show custom logout modal
    }, INACTIVITY_LIMIT - 30000); // Trigger 30 seconds before logout
  };

  const handleStayLoggedIn = () => {
    setShowModal(false);
    resetTimer(); // Restart timer
  };

  const handleLogOut = () => {
    setShowModal(false);
    setTimeout(() => signOut(), 30000); // Final 30-second delay before logout
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeoutRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">
              You will be logged out due to inactivity.
            </p>
            <p className="text-gray-600 mb-4">
              Select an option below to continue:
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleStayLoggedIn}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                ✅ Remain Logged-in
              </button>
              <button
                onClick={handleLogOut}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                ❌ Continue to Log-out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AutoLogout;
