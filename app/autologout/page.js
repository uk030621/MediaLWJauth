"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

const INACTIVITY_LIMIT = 10 * 60 * 1000; // Move outside the component

const AutoLogout = () => {
  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        alert("You will be logged out soon due to inactivity.");
        setTimeout(() => signOut(), 30000); // Logout after 30 seconds
      }, INACTIVITY_LIMIT - 30000);
    };
    const events = ["mousemove", "keydown", "scroll", "click"];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []); // No need for dependencies now

  return null;
};

export default AutoLogout;
