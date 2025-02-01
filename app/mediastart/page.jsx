"use client";

import styles from "@/styles/Home.module.css"; // Import the CSS module
import YouTube from "react-youtube"; // Import the YouTube component
//import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const videos = [
    /*{ id: "sRxrwjOtIag", title: "Sample Video 1" },*/
    { id: "eUDVUZZyA0M", title: "Ludovico Einaudi - Experience" },
  ];

  const { data: session } = useSession();
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const now = new Date();
    setDateTime(now); // Set initial consistent value
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="background-container">
      {/* Video Background */}
      {/* Uncomment if needed
      <video autoPlay muted loop playsInline className="background-video">
        <source src="/clouds.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>*/}

      <div className="flex flex-col items-left">
        <div className={styles.homeContainer}>
          <div className="flex  flex-col justify-center mr-5">
            <p className="font-thin ml-1 text-sm">{session?.user?.email}</p>
            <div className="flex justify-center gap-2 mt-2 mb-1">
              {dateTime ? (
                <>
                  <p className=" text-sm font-thin text-black">
                    {dateTime.toLocaleDateString()}
                  </p>
                  <p className=" text-sm font-thin text-black">
                    {dateTime.toLocaleTimeString()}
                  </p>
                </>
              ) : (
                <p className="text-sm text-black">Loading time...</p>
              )}
            </div>
          </div>

          <h1 className={styles.gradientText}>
            Welcome{" "}
            <span className="font-bold">
              {session?.user?.name?.split(" ")[0]}
            </span>{" "}
            To Your Media Library
          </h1>
          <p className={styles.description}>
            Keep your most important media in a personal repository for easy
            reference.
          </p>
          {/*<div className="flex justify-center mt-2">
            <div>
              Owner: <span className="font-bold">{session?.user?.name}</span>
              Owner:{" "}
              <span className="font-bold">
                {session?.user?.name?.split(" ")[0]}
              </span>
            </div>
            <div className="ml-4">
              Email: <span className="font-bold">{session?.user?.email}</span>
            </div>
          </div>*/}

          <div className="flex justify-center items-center">
            <ul className="text-left ml-8 mt-8 text-slate-800">
              <li className="text-base font-thin">
                ❤️ Add your favourite YouTube videos.
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    marginTop: "10px",
                  }}
                >
                  {videos.map((video, index) => (
                    <div
                      key={index}
                      style={{
                        margin: "0 10px",
                        marginRight: "80px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <YouTube
                        videoId={video.id}
                        opts={{
                          width: "250", // Adjust for responsiveness
                          height: "150",
                          playerVars: {
                            autoplay: 0,
                            modestbranding: 1,
                            rel: 0,
                          },
                        }}
                      />
                      <p
                        style={{
                          marginTop: "5px",
                          fontSize: "12px",
                          color: "gray",
                        }}
                      >
                        {video.title}
                      </p>
                    </div>
                  ))}
                </div>
              </li>
              <li className="mt-8 text-base font-thin">
                ➕ Add URLs for quick reference.
              </li>
              <li className="mt-8 text-base font-thin">
                🔍 Easily search your library.
              </li>
              <li className="mt-8 text-base font-thin">
                🏠 Centralise your media links.
              </li>
              {/*<li className="mt-6">🏆 Bonus applications included.</li>*/}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
