"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

const INACTIVITY_LIMIT = 20 * 60 * 1000; // 20 minutes

const AutoLogout = () => {
  const timeoutRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    const resetTimer = () => {
      if (videoPlaying) return; // Don't reset timer if video is playing

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowModal(true); // Show logout modal
      }, INACTIVITY_LIMIT - 30000); // Trigger 30 sec before logout
    };

    const handleUserActivity = () => {
      if (showModal) setShowModal(false); // Close modal on interaction
      resetTimer();
    };

    // Event listeners for activity detection
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) =>
      window.addEventListener(event, handleUserActivity)
    );

    resetTimer();

    return () => {
      clearTimeout(timeoutRef.current);
      events.forEach((event) =>
        window.removeEventListener(event, handleUserActivity)
      );
    };
  }, [videoPlaying, showModal]);

  const handleStayLoggedIn = () => {
    setShowModal(false);
    clearTimeout(timeoutRef.current);
  };

  const handleLogOut = () => {
    setShowModal(false);
    setTimeout(() => signOut(), 30000);
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center relative">
            <h2 className="text-xl font-semibold mb-4">
              Inactivity Logout Warning
            </h2>
            <p className="text-gray-600 mb-4">
              Do you want to remain logged in?
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
