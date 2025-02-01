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

  const handleCopyVideoID = (videoId, title) => {
    navigator.clipboard
      .writeText(videoId)
      .then(async () => {
        alert("Video ID copied to clipboard and added to the library!");
        await handleAddMedia(videoId, title);
      })
      .catch((err) => {
        console.error("Failed to copy the video ID:", err);
      });
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
    <div className="container mx-auto background-container">
      <h1 className="text-2xl font-bold mt-4">YouTube Video Search</h1>
      <button
        className="bg-black text-white p-2 ml-2 rounded-md"
        onClick={() => router.back()}
      >
        ⬅️ Back
      </button>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search YouTube"
          className="border p-2 w-full sm:w-auto rounded-md mb-3 mt-4"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 ml-2 rounded-md"
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className="bg-black text-white p-2 ml-2 rounded-md"
        >
          Clear/Reset
        </button>
      </div>

      <div className="mt-4">
        <label htmlFor="maxResults" className="mr-2">
          Max Results:
        </label>
        <select
          id="maxResults"
          value={maxResults}
          onChange={(e) => setMaxResults(Number(e.target.value))}
          className="border p-2 rounded-md"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div
            key={video.id.videoId}
            className="border p-4 flex flex-col sm:flex-row items-center rounded-md"
          >
            <img
              src={video.snippet.thumbnails.default.url}
              alt={video.snippet.title}
              className="w-full sm:w-1/3 h-auto mb-4 sm:mb-0 sm:mr-4 rounded-md"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg">
                {he.decode(video.snippet.title)}
              </h3>
              <p className="text-sm text-gray-700">
                {sanitizeText(video.snippet.description)}
              </p>
              <button
                className="bg-green-500 text-white p-2 mt-2 rounded-md"
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
  );
};

export default YouTubeSearch;
