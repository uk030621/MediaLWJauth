"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

const INACTIVITY_LIMIT = 20 * 60 * 1000; // 20 minutes

const AutoLogout = () => {
  const timeoutRef = useRef(null); // Main inactivity timer
  const modalTimerRef = useRef(null); // Modal auto-logout timer
  const [showModal, setShowModal] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    const resetTimer = () => {
      if (videoPlaying) return;

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowModal(true);
      }, INACTIVITY_LIMIT - 30000); // Show modal 30s before logout
    };

    const handleUserActivity = () => {
      if (showModal) setShowModal(false);
      clearTimeout(modalTimerRef.current); // Cancel modal logout if any
      resetTimer();
    };

    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) =>
      window.addEventListener(event, handleUserActivity)
    );

    resetTimer();

    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(modalTimerRef.current);
      events.forEach((event) =>
        window.removeEventListener(event, handleUserActivity)
      );
    };
  }, [videoPlaying, showModal]);

  useEffect(() => {
    if (showModal) {
      // Start 30-second countdown once modal shows
      modalTimerRef.current = setTimeout(() => {
        signOut(); // Auto-logout if no response
      }, 30000);
    } else {
      clearTimeout(modalTimerRef.current); // Cancel on modal close
    }
  }, [showModal]);

  const handleStayLoggedIn = () => {
    setShowModal(false);
    clearTimeout(modalTimerRef.current);
  };

  const handleLogOut = () => {
    setShowModal(false);
    clearTimeout(modalTimerRef.current);
    signOut(); // Immediate logout
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
              You’ve been inactive. Do you want to stay logged in?
            </p>
            <p className="text-sm text-gray-500 mb-4">
              You’ll be logged out automatically in 30 seconds.
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
                ❌ Log-out Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AutoLogout;
