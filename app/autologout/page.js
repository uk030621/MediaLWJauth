"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

const INACTIVITY_LIMIT = 20 * 60 * 1000; // 10 minutes

const AutoLogout = () => {
  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const stayLoggedIn = confirm(
          "You will be logged out soon due to inactivity. Do you want to stay logged in?"
        );

        if (stayLoggedIn) {
          resetTimer(); // Restart the timer if the user chooses to stay
        } else {
          setTimeout(() => signOut(), 30000); // Logout after 30 seconds
        }
      }, INACTIVITY_LIMIT - 30000);
    };

    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return null;
};

export default AutoLogout;
