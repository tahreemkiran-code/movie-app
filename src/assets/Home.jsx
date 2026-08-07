import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Movie from "./Movie";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

function Home() {
  const API_KEY = "ccd26a30";
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("all");
  const [slideIndex, setSlideIndex] = useState(0);

  // Hero trailer modal state
  const [showHeroTrailer, setShowHeroTrailer] = useState(false);
  const [heroVideoId, setHeroVideoId] = useState(null);
  const [heroTrailerLoading, setHeroTrailerLoading] = useState(false);
  const [heroTrailerError, setHeroTrailerError] = useState(false);

  // Named rows, each with its own curated search terms
  const [rows, setRows] = useState({
    trending: [],
    comedy: [],
    topRated: [],
    series: [],
  });

  const categories = [
    { id: "all", label: "All" },
    { id: "movie", label: "Movies" },
    { id: "series", label: "Series" },
  ];

  const rowConfig = [
    { key: "trending", label: "🔥 Trending Now", terms: ["Avengers", "Batman", "Spider", "Squid Game"] },
    { key: "comedy", label: "😂 Comedy Picks", terms: ["Business Proposal", "Dhamaal", "Hangover", "Superbad"] },
    { key: "topRated", label: "⭐ Top Rated", terms: ["The Glory", "Titanic", "Goblin", "Harry Potter"] },
    { key: "series", label: "📺 Popular Series", terms: ["Wednesday", "Crash Landing on You", "True Beauty", "All of Us Are Dead"] },
  ];

  // Save a search term into localStorage history
  const saveSearchHistory = (term) => {
    if (!term.trim()) return;

    const existing = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const updated = [term, ...existing.filter((item) => item !== term)].slice(0, 20);

    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  // Search Function
  const fetchMovies = async (movieName) => {
    if (!movieName.trim()) return;

    setLoading(true);
    saveSearchHistory(movieName);

    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${movieName}`
    );

    const data = await response.json();

    if (data.Search) {
      setMovies(data.Search);
    } else {
      setMovies([]);
    }

    setLoading(false);
  };

  // Fetch one named row's movies
  const fetchRow = async (terms) => {
    let results = [];

    for (let name of terms) {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${name}`
      );
      const data = await response.json();

      if (data.Search) {
        results = [...results, ...data.Search];
      }
    }

    return results;
  };

  // Load all named rows on first render
  const loadRows = async () => {
    setLoading(true);

    const newRows = {};
    for (let row of rowConfig) {
      newRows[row.key] = await fetchRow(row.terms);
    }

    setRows(newRows);

    // Keep a combined list for the main category grid / carousel too
    const combined = Object.values(newRows).flat();
    setMovies(combined);

    setLoading(false);
  };

  useEffect(() => {
    loadRows();
  }, []);

  // OMDb posters are small Amazon thumbnails by default — this asks
  // Amazon's image server for a much larger version of the same image,
  // which fixes the blur when the poster is stretched into a big banner.
  const getHighResPoster = (url) => {
    if (!url || url === "N/A") return url;
    return url.replace(/_V1_.*\.jpg/, "_V1_SX1000.jpg");
  };

  // Filter movies based on selected category
  const filteredMovies =
    category === "all"
      ? movies
      : movies.filter((movie) => movie.Type === category);

  // Top 3 movies (with valid posters) for the auto-sliding carousel
  const slides = movies.filter((m) => m.Poster !== "N/A").slice(0, 3);

  // Auto-advance the carousel every 4 seconds
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setSlideIndex(index);
  };

  // Fetch and open the trailer for whichever movie is currently showing in the carousel
  const openHeroTrailer = async (movie) => {
    saveWatchHistoryForMovie(movie);
    setShowHeroTrailer(true);
    setHeroVideoId(null);
    setHeroTrailerLoading(true);
    setHeroTrailerError(false);

    try {
      const query = encodeURIComponent(`${movie.Title} ${movie.Year} official trailer`);

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&type=video&key=${YOUTUBE_API_KEY}`
      );

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        setHeroVideoId(data.items[0].id.videoId);
      } else {
        setHeroTrailerError(true);
      }
    } catch (err) {
      setHeroTrailerError(true);
    }

    setHeroTrailerLoading(false);
  };

  const saveWatchHistoryForMovie = (movie) => {
    const existing = JSON.parse(localStorage.getItem("watchHistory")) || [];
    const filtered = existing.filter((item) => item.imdbID !== movie.imdbID);
    const updated = [movie, ...filtered].slice(0, 20);

    localStorage.setItem("watchHistory", JSON.stringify(updated));
  };

  const closeHeroTrailer = () => {
    setShowHeroTrailer(false);
    setHeroVideoId(null);
  };

  return (
    <div style={styles.page}>

      {/* TOP NAVBAR */}
      <div style={styles.topBar}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          ⬅
        </button>

        <div style={styles.logo}>🎬</div>

        <div style={styles.searchWrap}>
          <input
            type="text"
            placeholder="Search movies, shows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
            onKeyDown={(e) => e.key === "Enter" && fetchMovies(search)}
          />
          <span style={styles.searchIcon} onClick={() => fetchMovies(search)}>
            🔍
          </span>
        </div>

        <button style={styles.profileButton} onClick={() => navigate("/profile")}>
          👤
        </button>
      </div>

      {/* CATEGORY TABS */}
      <div style={styles.navbar}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            style={{
              ...styles.navButton,
              ...(category === cat.id ? styles.navButtonActive : {}),
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <h2 style={styles.loading}>Loading...</h2>
      ) : (
        <>
          {/* AUTO-SLIDING HERO CAROUSEL */}
          {slides.length > 0 && (
            <div style={styles.carousel}>
              {slides.map((movie, index) => (
                <div
                  key={movie.imdbID}
                  style={{
                    ...styles.slide,
                    opacity: index === slideIndex ? 1 : 0,
                    zIndex: index === slideIndex ? 1 : 0,
                    backgroundImage: `linear-gradient(180deg, rgba(13,13,13,0.2) 0%, rgba(13,13,13,0.95) 100%), url(${getHighResPoster(movie.Poster)})`,
                  }}
                >
                  <h1 style={styles.heroTitle}>{movie.Title}</h1>

                  <div style={styles.heroCard}>
                    <img
                      src={getHighResPoster(movie.Poster)}
                      alt={movie.Title}
                      style={styles.heroPoster}
                    />
                    <div style={styles.heroInfo}>
                      <p style={styles.heroCardTitle}>{movie.Title}</p>
                      <p style={styles.heroCardSub}>
                        {movie.Year} · {movie.Type === "series" ? "Series" : "Movie"}
                      </p>
                    </div>
                    <button
                      style={styles.heroPlay}
                      onClick={() => openHeroTrailer(movie)}
                    >
                      ▶
                    </button>
                  </div>
                </div>
              ))}

              {/* Dot indicators */}
              <div style={styles.dots}>
                {slides.map((_, index) => (
                  <span
                    key={index}
                    onClick={() => goToSlide(index)}
                    style={{
                      ...styles.dot,
                      background: index === slideIndex ? "red" : "rgba(255,255,255,0.4)",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* CATEGORY PILLS */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Categories</h3>
            <div style={styles.pillRow}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  style={{
                    ...styles.pill,
                    ...(category === cat.id ? styles.pillActive : {}),
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* SEARCH / CATEGORY-FILTERED RESULTS (only shown when searching or filtering) */}
          {(search.trim().length > 0 || category !== "all") && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Results</h3>
              {filteredMovies.length === 0 ? (
                <h2 style={styles.loading}>No movies found 😕</h2>
              ) : (
                <div style={styles.grid}>
                  {filteredMovies.map((movie) => (
                    <Movie key={movie.imdbID} movie={movie} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* NAMED ROWS */}
          {rowConfig.map((row) => (
            <div style={styles.section} key={row.key}>
              <h3 style={styles.sectionTitle}>{row.label}</h3>
              <div style={styles.scrollRow}>
                {rows[row.key] && rows[row.key].length > 0 ? (
                  rows[row.key].map((movie) => (
                    <div style={styles.scrollItem} key={movie.imdbID}>
                      <Movie movie={movie} />
                    </div>
                  ))
                ) : (
                  <p style={styles.emptyText}>No items in this row.</p>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {/* HERO TRAILER MODAL */}
      {showHeroTrailer && (
        <div style={styles.modalBackdrop} onClick={closeHeroTrailer}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <p style={styles.modalTitle}>Trailer</p>
              <button style={styles.closeButton} onClick={closeHeroTrailer}>
                ✕
              </button>
            </div>

            <div style={styles.videoWrap}>
              {heroTrailerLoading && (
                <p style={styles.statusText}>Loading trailer...</p>
              )}

              {!heroTrailerLoading && heroTrailerError && (
                <p style={styles.statusText}>Trailer not found 😕</p>
              )}

              {!heroTrailerLoading && heroVideoId && (
                <iframe
                  style={styles.iframe}
                  src={`https://www.youtube.com/embed/${heroVideoId}?autoplay=1`}
                  title="Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    background: "#0d0d0d",
    minHeight: "100vh",
    color: "white",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },

  topBar: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "14px 20px",
    background: "#141414",
    position: "sticky",
    top: 0,
    zIndex: 10,
    borderBottom: "1px solid #222",
  },

  backButton: {
    background: "#1e1e1e",
    border: "1px solid #333",
    color: "white",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "15px",
    flexShrink: 0,
  },

  logo: {
    fontSize: "24px",
    flexShrink: 0,
  },

  searchWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    background: "#1e1e1e",
    border: "1px solid #333",
    borderRadius: "20px",
    padding: "8px 16px",
    gap: "8px",
    minWidth: 0,
  },

  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "white",
    fontSize: "14px",
    minWidth: 0,
  },

  searchIcon: {
    cursor: "pointer",
    fontSize: "14px",
  },

  profileButton: {
    background: "#1e1e1e",
    border: "1px solid #333",
    color: "white",
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "16px",
    flexShrink: 0,
  },

  navbar: {
    display: "flex",
    gap: "10px",
    padding: "14px 20px",
    overflowX: "auto",
    borderBottom: "1px solid #1a1a1a",
  },

  navButton: {
    background: "transparent",
    color: "#aaa",
    border: "1px solid #333",
    padding: "6px 18px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },

  navButtonActive: {
    background: "red",
    color: "white",
    borderColor: "red",
    fontWeight: "bold",
  },

  carousel: {
    position: "relative",
    minHeight: "520px",
    overflow: "hidden",
  },

  slide: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "24px 20px 40px 20px",
    transition: "opacity 0.8s ease-in-out",
  },

  heroTitle: {
    fontSize: "30px",
    fontWeight: "800",
    marginBottom: "20px",
    letterSpacing: "1px",
    textShadow: "0 2px 8px rgba(0,0,0,0.6)",
    textAlign: "left",
  },

  heroCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "rgba(20,20,20,0.9)",
    borderRadius: "10px",
    padding: "12px",
    maxWidth: "460px",
  },

  heroPoster: {
    width: "110px",
    height: "160px",
    objectFit: "cover",
    borderRadius: "8px",
    flexShrink: 0,
    imageRendering: "auto",
  },

  heroInfo: {
    flex: 1,
    textAlign: "left",
    overflow: "hidden",
  },

  heroCardTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  heroCardSub: {
    margin: "4px 0 0 0",
    fontSize: "12px",
    color: "#aaa",
  },

  heroPlay: {
    background: "#2ecc71",
    color: "white",
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    cursor: "pointer",
    border: "none",
    fontSize: "14px",
  },

  dots: {
    position: "absolute",
    bottom: "12px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "8px",
    zIndex: 2,
  },

  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },

  section: {
    padding: "20px 20px 4px 20px",
  },

  sectionTitle: {
    fontSize: "17px",
    margin: "0 0 14px 0",
    textAlign: "left",
  },

  pillRow: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
  },

  pill: {
    background: "#1e1e1e",
    color: "#ddd",
    border: "1px solid #333",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },

  pillActive: {
    background: "red",
    color: "white",
    borderColor: "red",
    fontWeight: "bold",
  },

  scrollRow: {
    display: "flex",
    gap: "14px",
    overflowX: "auto",
    paddingBottom: "8px",
  },

  scrollItem: {
    minWidth: "150px",
    maxWidth: "150px",
    flexShrink: 0,
  },

  loading: {
    color: "#888",
    textAlign: "center",
    padding: "40px 0",
  },

  emptyText: {
    color: "#666",
    fontSize: "13px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "18px",
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

export default Home;