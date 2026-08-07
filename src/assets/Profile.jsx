import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("account");
  const [language, setLanguage] = useState(
    localStorage.getItem("appLanguage") || "English"
  );
  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") !== "false"
  );
  const [autoplay, setAutoplay] = useState(
    localStorage.getItem("autoplay") === "true"
  );

  const [searchHistory, setSearchHistory] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);

  const userEmail = localStorage.getItem("userEmail") || "admin@gmail.com";
  const userName = localStorage.getItem("userName") || "Movie Flix";

  useEffect(() => {
    const savedSearch = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const savedWatch = JSON.parse(localStorage.getItem("watchHistory")) || [];
    setSearchHistory(savedSearch);
    setWatchHistory(savedWatch);
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("appLanguage", lang);
  };

  const toggleNotifications = () => {
    const updated = !notifications;
    setNotifications(updated);
    localStorage.setItem("notifications", updated);
  };

  const toggleAutoplay = () => {
    const updated = !autoplay;
    setAutoplay(updated);
    localStorage.setItem("autoplay", updated);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const clearWatchHistory = () => {
    setWatchHistory([]);
    localStorage.removeItem("watchHistory");
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("isLoggedIn");
      navigate("/login");
    }
  };

  const tabs = [
    { id: "account", label: "Account" },
    { id: "settings", label: "Settings" },
    { id: "search", label: "Search History" },
    { id: "watch", label: "Watch History" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.avatar}>{userName.charAt(0).toUpperCase()}</div>
        <div>
          <h2 style={styles.name}>{userName}</h2>
          <p style={styles.email}>{userEmail}</p>
        </div>
      </div>

      <div style={styles.tabBar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab.id ? styles.tabButtonActive : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {/* ACCOUNT TAB */}
        {activeTab === "account" && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Account Details</h3>
            <div style={styles.row}>
              <span style={styles.rowLabel}>Name</span>
              <span style={styles.rowValue}>{userName}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.rowLabel}>Email</span>
              <span style={styles.rowValue}>{userEmail}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.rowLabel}>Member Since</span>
              <span style={styles.rowValue}>2026</span>
            </div>

            <button style={styles.logoutButton} onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Preferences</h3>

            <div style={styles.settingRow}>
              <div>
                <p style={styles.settingLabel}>Language</p>
                <p style={styles.settingSub}>Choose your app language</p>
              </div>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                style={styles.select}
              >
                <option value="English">English</option>
                <option value="Urdu">اردو</option>
                <option value="Hindi">हिन्दी</option>
                <option value="Arabic">العربية</option>
              </select>
            </div>

            <div style={styles.settingRow}>
              <div>
                <p style={styles.settingLabel}>Notifications</p>
                <p style={styles.settingSub}>Get updates on new releases</p>
              </div>
              <label style={styles.switch}>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={toggleNotifications}
                  style={{ display: "none" }}
                />
                <span
                  style={{
                    ...styles.switchTrack,
                    background: notifications ? "red" : "#444",
                  }}
                >
                  <span
                    style={{
                      ...styles.switchThumb,
                      transform: notifications
                        ? "translateX(20px)"
                        : "translateX(0px)",
                    }}
                  />
                </span>
              </label>
            </div>

            <div style={styles.settingRow}>
              <div>
                <p style={styles.settingLabel}>Autoplay Trailers</p>
                <p style={styles.settingSub}>Play trailers automatically</p>
              </div>
              <label style={styles.switch}>
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={toggleAutoplay}
                  style={{ display: "none" }}
                />
                <span
                  style={{
                    ...styles.switchTrack,
                    background: autoplay ? "red" : "#444",
                  }}
                >
                  <span
                    style={{
                      ...styles.switchThumb,
                      transform: autoplay ? "translateX(20px)" : "translateX(0px)",
                    }}
                  />
                </span>
              </label>
            </div>
          </div>
        )}

        {/* SEARCH HISTORY TAB */}
        {activeTab === "search" && (
          <div style={styles.card}>
            <div style={styles.cardHeaderRow}>
              <h3 style={styles.cardTitle}>Search History</h3>
              {searchHistory.length > 0 && (
                <button style={styles.clearButton} onClick={clearSearchHistory}>
                  Clear All
                </button>
              )}
            </div>

            {searchHistory.length === 0 ? (
              <p style={styles.emptyText}>No search history yet.</p>
            ) : (
              <ul style={styles.historyList}>
                {searchHistory.map((item, index) => (
                  <li key={index} style={styles.historyItem}>
                    🔍 {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* WATCH HISTORY TAB */}
        {activeTab === "watch" && (
          <div style={styles.card}>
            <div style={styles.cardHeaderRow}>
              <h3 style={styles.cardTitle}>Watch History</h3>
              {watchHistory.length > 0 && (
                <button style={styles.clearButton} onClick={clearWatchHistory}>
                  Clear All
                </button>
              )}
            </div>

            {watchHistory.length === 0 ? (
              <p style={styles.emptyText}>No watch history yet.</p>
            ) : (
              <div style={styles.watchGrid}>
                {watchHistory.map((movie, index) => (
                  <div key={index} style={styles.watchCard}>
                    <img
                      src={
                        movie.Poster !== "N/A"
                          ? movie.Poster
                          : "https://via.placeholder.com/150x220?text=No+Image"
                      }
                      alt={movie.Title}
                      style={styles.watchPoster}
                    />
                    <p style={styles.watchTitle}>{movie.Title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(180deg, #0d0d0d 0%, #1a1a1a 100%)",
    minHeight: "100vh",
    padding: "40px 20px",
    color: "white",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "30px",
  },

  avatar: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold",
    flexShrink: 0,
  },

  name: {
    margin: 0,
    fontSize: "22px",
  },

  email: {
    margin: 0,
    color: "#aaa",
    fontSize: "14px",
  },

  tabBar: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    flexWrap: "wrap",
    borderBottom: "1px solid #2a2a2a",
    paddingBottom: "12px",
  },

  tabButton: {
    background: "transparent",
    color: "#aaa",
    border: "1px solid #333",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
  },

  tabButtonActive: {
    background: "red",
    color: "white",
    borderColor: "red",
    fontWeight: "bold",
  },

  content: {
    minHeight: "300px",
  },

  card: {
    background: "#1e1e1e",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #2a2a2a",
  },

  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  cardTitle: {
    margin: "0 0 16px 0",
    fontSize: "18px",
    color: "white",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #2a2a2a",
  },

  rowLabel: {
    color: "#aaa",
  },

  rowValue: {
    color: "white",
    fontWeight: "500",
  },

  logoutButton: {
    marginTop: "24px",
    width: "100%",
    padding: "12px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  settingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    borderBottom: "1px solid #2a2a2a",
  },

  settingLabel: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "500",
  },

  settingSub: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "#888",
  },

  select: {
    background: "#111",
    color: "white",
    border: "1px solid #333",
    borderRadius: "6px",
    padding: "8px 12px",
    fontSize: "14px",
    cursor: "pointer",
  },

  switch: {
    cursor: "pointer",
  },

  switchTrack: {
    display: "inline-block",
    width: "44px",
    height: "24px",
    borderRadius: "12px",
    position: "relative",
    transition: "background 0.2s ease",
  },

  switchThumb: {
    position: "absolute",
    top: "2px",
    left: "2px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "white",
    transition: "transform 0.2s ease",
  },

  clearButton: {
    background: "transparent",
    color: "#ff6b6b",
    border: "1px solid #ff6b6b",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },

  emptyText: {
    color: "#888",
    textAlign: "center",
    padding: "30px 0",
  },

  historyList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },

  historyItem: {
    padding: "10px 0",
    borderBottom: "1px solid #2a2a2a",
    color: "#ddd",
  },

  watchGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "16px",
  },

  watchCard: {
    textAlign: "center",
  },

  watchPoster: {
    width: "100%",
    borderRadius: "8px",
    marginBottom: "6px",
  },

  watchTitle: {
    fontSize: "12px",
    color: "#ccc",
    margin: 0,
  },
};

export default Profile;