"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import he from "he"; // Import he to decode HTML entities

const YouTubeSearch = () => {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [maxResults, setMaxResults] = useState(10);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query) return;

    try {
      const response = await fetch(
        `/api/youtube?q=${query}&maxResults=${maxResults}`
      );
      const data = await response.json();

      if (response.ok) {
        setVideos(data.items);
        setError(null);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Something went wrong");
    }
  };

  const handleClear = () => {
    setQuery("");
    setMaxResults(10);
    setVideos([]);
    setError(null);
  };

  const handleAddMedia = async (videoId, title) => {
    if (!session?.user?.id) {
      console.error("User not authenticated");
      alert("You must be logged in to add media.");
      return;
    }

    try {
      const postData = {
        url: videoId,
        title: title,
        userId: session.user.id,
      };

      const response = await fetch("/api/urlhtml", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to add video to the library.");
      }

      console.log("Successfully added video:", title);
      window.location.href = "/enhanced";
    } catch (error) {
      console.error("Error adding video to the library:", error);
      alert("Failed to add video to the library.");
    }
  };

  const handleCopyVideoID = async (videoId, title) => {
    const retryLimit = 3; // Maximum number of retries
    let retryCount = 0;
    let success = false;

    while (retryCount < retryLimit && !success) {
      try {
        await navigator.clipboard.writeText(videoId);
        alert("Video ID copied to clipboard and added to the library!");
        await handleAddMedia(videoId, title);
        success = true; // Mark as successful
      } catch (err) {
        retryCount++;
        console.error(
          `Attempt ${retryCount} - Failed to copy the video ID:`,
          err
        );

        if (retryCount < retryLimit) {
          console.log("Retrying...");
        } else {
          console.error("All retry attempts failed.");
          alert("Failed to copy the video ID after several attempts.");
        }
      }
    }
  };

  // Function to sanitize and decode text
  const sanitizeText = (text, length = 100) => {
    const cleanText = he
      .decode(text) // Decode HTML entities
      .replace(/https?:\/\/[^\s]+/g, "") // Remove URLs
      .replace(/[&<>]/g, "") // Remove symbols like &, <, >
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim();

    return cleanText.length > length
      ? `${cleanText.substring(0, length)}...`
      : cleanText;
  };

  return (
    <div className="bg-background background-container ">
      <div className="container mx-auto px-4 ">
        <h1 className="text-2xl font-bold mt-4 text-left">
          YouTube Video Search
        </h1>

        <div className="flex justify-between items-center mt-4">
          <button
            className="bg-black text-white p-2 rounded-md"
            onClick={() => router.back()}
          >
            ⬅️ Back
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center mt-4 space-y-3 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search YouTube"
            className="border p-2 w-full sm:w-auto rounded-md"
          />
          <div className="flex gap-4">
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white p-2 rounded-md w-full sm:w-auto"
            >
              Search
            </button>
            <button
              onClick={handleClear}
              className="bg-black text-white p-2 rounded-md w-full sm:w-auto"
            >
              Clear/Reset
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-2">
          <label htmlFor="maxResults" className="text-sm font-semibold">
            Max Results:
          </label>
          <select
            id="maxResults"
            value={maxResults}
            onChange={(e) => setMaxResults(Number(e.target.value))}
            className="border p-2 rounded-md"
          >
            {[5, 10, 20, 30, 40, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video.id.videoId}
              className="border p-4 flex flex-col rounded-md bg-white shadow-md"
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full h-auto rounded-md"
              />
              <div className="mt-3">
                <h3 className="font-bold text-lg">
                  {he.decode(video.snippet.title)}
                </h3>
                <p className="text-sm text-gray-700">
                  {sanitizeText(video.snippet.description)}
                </p>
                <button
                  className="bg-green-500 text-white p-2 mt-2 rounded-md w-full"
                  onClick={() =>
                    handleCopyVideoID(video.id.videoId, video.snippet.title)
                  }
                >
                  Add to Library
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YouTubeSearch;
