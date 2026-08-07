import React, { useState } from "react";

// YouTube API key comes from your .env file (see setup note below the code)
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

function Movie({ movie }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [trailerError, setTrailerError] = useState(false);

  // Save this movie into watch history when opened
  const saveWatchHistory = () => {
    const existing = JSON.parse(localStorage.getItem("watchHistory")) || [];
    const filtered = existing.filter((item) => item.imdbID !== movie.imdbID);
    const updated = [movie, ...filtered].slice(0, 20);

    localStorage.setItem("watchHistory", JSON.stringify(updated));
  };

  // Ask YouTube for the actual trailer video and grab its ID
  const fetchTrailer = async () => {
    setTrailerLoading(true);
    setTrailerError(false);

    try {
      const query = encodeURIComponent(`${movie.Title} ${movie.Year} official trailer`);

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&type=video&key=${YOUTUBE_API_KEY}`
      );

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        setVideoId(data.items[0].id.videoId);
      } else {
        setTrailerError(true);
      }
    } catch (err) {
      setTrailerError(true);
    }

    setTrailerLoading(false);
  };

  const openTrailer = () => {
    saveWatchHistory();
    setShowTrailer(true);
    fetchTrailer();
  };

  const closeTrailer = () => {
    setShowTrailer(false);
    setVideoId(null);
  };

  return (
    <>
      <div style={styles.card} onClick={openTrailer}>
        <div style={styles.posterWrap}>
          <img
            src={
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/220x330?text=No+Image"
            }
            alt={movie.Title}
            style={styles.poster}
          />
          <div style={styles.playOverlay}>
            <span style={styles.playIcon}>▶</span>
          </div>
        </div>

        <div style={styles.info}>
          <h3 style={styles.title}>{movie.Title}</h3>
          <p style={styles.year}>{movie.Year}</p>
        </div>
      </div>

      {showTrailer && (
        <div style={styles.modalBackdrop} onClick={closeTrailer}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <p style={styles.modalTitle}>{movie.Title}</p>
              <button style={styles.closeButton} onClick={closeTrailer}>
                ✕
              </button>
            </div>

            <div style={styles.videoWrap}>
              {trailerLoading && (
                <p style={styles.statusText}>Loading trailer...</p>
              )}

              {!trailerLoading && trailerError && (
                <p style={styles.statusText}>Trailer not found 😕</p>
              )}

              {!trailerLoading && videoId && (
                <iframe
                  style={styles.iframe}
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title={`${movie.Title} trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  card: {
    background: "#1e1e1e",
    borderRadius: "10px",
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid #2a2a2a",
    textAlign: "left",
  },

  posterWrap: {
    position: "relative",
  },

  poster: {
    width: "100%",
    height: "330px",
    objectFit: "cover",
    display: "block",
  },

  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.2s ease",
  },

  playIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "red",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  info: {
    padding: "12px",
  },

  title: {
    margin: 0,
    fontSize: "15px",
    color: "white",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  year: {
    margin: "6px 0 0 0",
    fontSize: "13px",
    color: "#888",
  },

  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "20px",
  },

  modalBox: {
    background: "#111",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "800px",
    overflow: "hidden",
    border: "1px solid #2a2a2a",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 18px",
    borderBottom: "1px solid #2a2a2a",
  },

  modalTitle: {
    margin: 0,
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
  },

  closeButton: {
    background: "#1e1e1e",
    border: "1px solid #333",
    color: "white",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "14px",
  },

  videoWrap: {
    position: "relative",
    paddingBottom: "56.25%",
    height: 0,
    background: "#000",
  },

  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },

  statusText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#888",
    fontSize: "14px",
  },
};

export default Movie;