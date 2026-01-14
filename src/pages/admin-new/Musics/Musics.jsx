import { useState, useEffect, useContext } from "react";
import { FiEdit, FiTrash2, FiPlus, FiPlay, FiX, FiMusic, FiEye, FiShare2, FiBookmark, FiTrendingUp, FiHeadphones } from "react-icons/fi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useData } from "../../../context/useData";
import { DataContext } from "../../../context/DataContext";
import { mediaService, entertainmentService } from "../../../services/api";
import AnalyticsGrid from "../../../components/admin/analytics/AnalyticsGrid";
import TrendingChart from "../../../components/admin/analytics/TrendingChart";
import TrendingModal from "../../../components/admin/analytics/TrendingModal";

export default function Musics() {
  const { music, addMusic, deleteMusic, updateMusic } = useData();
  const { getModuleAnalytics, getTrendingContent } = useContext(DataContext);
  const [search, setSearch] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [trending, setTrending] = useState([]);
  const [showTrendingModal, setShowTrendingModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Genres State
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getModuleAnalytics('music');
        if (data) setAnalytics(data);

        const trendingData = await getTrendingContent('music', 10);
        if (trendingData) setTrending(trendingData);
      } catch (err) {
        console.error("Error fetching music analytics:", err);
      }
    };
    fetchAnalytics();

    // Fetch Genres
    const fetchGenres = async () => {
      try {
        const res = await entertainmentService.getMusicGenres();
        if (res.data.success) {
          setGenres(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch genres", err);
      }
    }
    fetchGenres();
  }, [getModuleAnalytics, getTrendingContent]);

  const openAddModal = () => {
    setEditData({
      title: "",
      artist: "",
      genre: "",
      duration: "",
      coverArt: "",
      audioUrl: "",
      status: "approved", // Default to approved for admin
      coverArtMode: "url",
      audioMode: "url",
    });
    setModalOpen(true);
  };

  const saveMusic = async () => {
    // Validate required fields
    if (!editData.title || !editData.artist || !editData.genre || !editData.duration || !editData.audioUrl) {
      toast.error("Please fill all required fields (Title, Artist, Genre, Duration, Audio URL)!");
      return;
    }

    try {
      // Backend expects 'genre' not 'category'. 
      // Clean payload: remove UI-only fields
      const { coverArtMode, audioMode, ...payload } = editData;

      let promise;
      if (payload.id) {
        promise = updateMusic(payload.id, payload);
      } else {
        promise = addMusic(payload);
      }

      await toast.promise(promise, {
        loading: payload.id ? 'Updating music...' : 'Adding music...',
        success: payload.id ? 'Music updated successfully!' : 'Music added successfully!',
        error: (err) => `Failed to save: ${err.response?.data?.message || err.message}`
      });

      setModalOpen(false);
    } catch (error) {
      console.error("Error saving music:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await deleteMusic(id);
        toast.success("Music deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting music:", error);
      toast.error("Failed to delete music");
    }
  };

  return (
    <div style={{ background: '#121212', minHeight: '100vh', padding: '24px' }}>
      {/* HEADER */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>Music Library</h2>

          <button
            onClick={openAddModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#1DB954',
              color: '#fff',
              border: 'none',
              borderRadius: '24px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <FiPlus size={18} /> Add Music
          </button>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search music..."
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '12px 16px',
            background: '#282828',
            border: 'none',
            borderRadius: '24px',
            color: '#fff',
            fontSize: '14px',
            marginBottom: '32px'
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Analytics Section */}
        <AnalyticsGrid
          metrics={[
            { title: 'Total Tracks', value: analytics?.totalItems || music.length, icon: FiMusic, color: 'indigo' },
            { title: 'Total Plays', value: analytics?.overview?.totalViews?.toLocaleString() || '12,850', icon: FiHeadphones, color: 'blue', trend: 'up', trendValue: 15 },
            { title: 'Total Shares', value: analytics?.overview?.totalShares?.toLocaleString() || '2,140', icon: FiShare2, color: 'green', trend: 'up', trendValue: 22 },
            { title: 'Total Bookmarks', value: analytics?.overview?.totalBookmarks?.toLocaleString() || '845', icon: FiBookmark, color: 'purple' }
          ]}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: '#181818', borderRadius: '12px', padding: '24px', border: '1px solid #282828' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Listen Trends</h3>
                <p style={{ color: '#b3b3b3', fontSize: '0.8rem', margin: '4px 0 0 0' }}>Engagement across top performing tracks</p>
              </div>
              <button
                onClick={() => setShowTrendingModal(true)}
                style={{ background: 'none', border: 'none', color: '#1DB954', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}
              >
                <FiTrendingUp /> View Top 50
              </button>
            </div>
            <TrendingChart data={trending.length > 0 ? trending : music.slice(0, 8)} />
          </div>

          <div style={{ background: 'linear-gradient(135deg, #1DB954 0%, #191414 100%)', borderRadius: '12px', padding: '24px', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 12px 0' }}>Curation Tip</h3>
            <p style={{ fontSize: '0.9rem', color: '#E5E7EB', lineHeight: 1.5, flex: 1 }}>
              Your "Deep Focus" meditation track has seen a spike in night-time listens. Consider adding more content to the "Tranquility" category.
            </p>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: '#b3b3b3' }}>Peak Time</span>
                <span style={{ fontWeight: 600 }}>9 PM - 11 PM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#b3b3b3' }}>Avg. Session</span>
                <span style={{ fontWeight: 600 }}>24 mins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MUSIC GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '24px'
      }}>
        {music
          .filter((m) =>
            m.title?.toLowerCase().includes(search.toLowerCase()) ||
            m.artist?.toLowerCase().includes(search.toLowerCase())
          )
          .map((musicItem) => (
            <div
              key={musicItem.id || musicItem.id}
              style={{
                background: '#181818',
                borderRadius: '8px',
                padding: '16px',
                transition: 'all 0.2s',
                cursor: 'pointer',
                position: 'relative'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#282828';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#181818';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* THUMBNAIL */}
              <div style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '100%',
                marginBottom: '16px',
                borderRadius: '4px',
                overflow: 'hidden',
                background: '#282828'
              }}>
                {musicItem.coverArt ? (
                  <img
                    src={musicItem.coverArt}
                    alt={musicItem.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)'
                  }}>
                    <FiMusic size={48} color="#fff" opacity={0.5} />
                  </div>
                )}

                {/* Play Button Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#1DB954',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                }}
                  className="play-button"
                >
                  <FiPlay size={20} color="#fff" />
                </div>
              </div>

              {/* CONTENT */}
              <h3 style={{
                color: '#fff',
                fontSize: '14px',
                fontWeight: 700,
                marginBottom: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {musicItem.title}
              </h3>

              <p style={{
                color: '#b3b3b3',
                fontSize: '13px',
                marginBottom: '8px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {musicItem.artist}
              </p>

              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '3px 10px',
                  background: '#282828',
                  color: '#1DB954',
                  fontSize: '11px',
                  borderRadius: '10px',
                  fontWeight: 500
                }}>
                  {musicItem.genre || musicItem.category}
                </span>

                {musicItem.duration && (
                  <span style={{
                    padding: '3px 10px',
                    background: '#282828',
                    color: '#b3b3b3',
                    fontSize: '11px',
                    borderRadius: '10px'
                  }}>
                    {musicItem.duration}
                  </span>
                )}
              </div>

              {/* ACTIONS */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const itemToEdit = { ...musicItem };
                    // Map backend genre to genre field if needed, or if stored as genre it's fine
                    if (itemToEdit.category && !itemToEdit.genre) itemToEdit.genre = itemToEdit.category;
                    setEditData(itemToEdit);
                    setModalOpen(true);
                  }}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: '#282828',
                    color: '#1DB954',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 500
                  }}
                >
                  <FiEdit size={14} /> Edit
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(musicItem.id);
                  }}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: '#282828',
                    color: '#f44336',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 500
                  }}
                >
                  <FiTrash2 size={14} /> Delete
                </button>
              </div>

              <style>{`
                div:hover .play-button {
                  opacity: 1 !important;
                }
              `}</style>
            </div>
          ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#282828',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                {editData?.id || editData?.id ? "Edit Music" : "Add Music"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#b3b3b3',
                  cursor: 'pointer'
                }}
              >
                <FiX size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Music Title"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#181818',
                    border: '1px solid #404040',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Artist *
                </label>
                <input
                  type="text"
                  placeholder="Artist Name"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#181818',
                    border: '1px solid #404040',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                  value={editData.artist}
                  onChange={(e) =>
                    setEditData({ ...editData, artist: e.target.value })
                  }
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                    Genre/Category *
                  </label>
                  <select
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#181818',
                      border: '1px solid #404040',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                    value={editData.genre || editData.category}
                    onChange={(e) =>
                      setEditData({ ...editData, genre: e.target.value })
                    }
                  >
                    <option value="">Select Genre</option>
                    {genres.map(g => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                    {/* Fallback if genres fail to load */}
                    {genres.length === 0 && (
                      <>
                        <option value="Devotional">Devotional</option>
                        <option value="Meditation">Meditation</option>
                        <option value="Mantra">Mantra</option>
                        <option value="Bhajan">Bhajan</option>
                        <option value="Classical">Classical</option>
                        <option value="Instrumental">Instrumental</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                    Duration *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5:30"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#181818',
                      border: '1px solid #404040',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                    value={editData.duration}
                    onChange={(e) =>
                      setEditData({ ...editData, duration: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* COVER ART SECTION */}
              <div>
                <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Cover Art
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <button
                    onClick={() => {
                      const newData = { ...editData };
                      if (!newData.coverArtMode) newData.coverArtMode = 'url';
                      setEditData({ ...newData, coverArtMode: 'url' });
                    }}
                    style={{
                      padding: '8px 16px',
                      background: editData.coverArtMode !== 'upload' ? '#1DB954' : '#181818',
                      color: '#fff',
                      border: editData.coverArtMode !== 'upload' ? 'none' : '1px solid #404040',
                      borderRadius: '16px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    URL
                  </button>
                  <button
                    onClick={() => setEditData({ ...editData, coverArtMode: 'upload' })}
                    style={{
                      padding: '8px 16px',
                      background: editData.coverArtMode === 'upload' ? '#1DB954' : '#181818',
                      color: '#fff',
                      border: editData.coverArtMode === 'upload' ? 'none' : '1px solid #404040',
                      borderRadius: '16px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Upload
                  </button>
                </div>

                {editData.coverArtMode === 'upload' ? (
                  <div style={{
                    border: '1px dashed #404040',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    background: '#181818'
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="cover-upload"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const response = await mediaService.uploadFile(file, 'music-covers');
                            if (response.success) {
                              setEditData({ ...editData, coverArt: response.media.url });
                            }
                          } catch (error) {
                            console.error("Cover upload failed", error);
                            alert("Failed to upload cover art. " + (error.response?.data?.message || error.message));
                          }
                        }
                      }}
                    />
                    <label htmlFor="cover-upload" style={{
                      cursor: 'pointer',
                      display: 'block',
                      color: '#b3b3b3',
                      fontSize: '14px'
                    }}>
                      {editData.coverArt ? 'Change Cover Image' : 'Click to Upload Cover Image'}
                    </label>
                    {editData.coverArt && (
                      <div style={{ marginTop: '10px' }}>
                        <img src={editData.coverArt} alt="Preview" style={{ height: '80px', borderRadius: '4px' }} />
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="https://example.com/cover.jpg"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#181818',
                      border: '1px solid #404040',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                    value={editData.coverArt || ''}
                    onChange={(e) =>
                      setEditData({ ...editData, coverArt: e.target.value })
                    }
                  />
                )}
              </div>

              {/* AUDIO SECTION */}
              <div>
                <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Audio Source *
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <button
                    onClick={() => {
                      const newData = { ...editData };
                      // Default to url if undefined
                      if (!newData.audioMode) newData.audioMode = 'url';
                      setEditData({ ...newData, audioMode: 'url' });
                    }}
                    style={{
                      padding: '8px 16px',
                      background: editData.audioMode !== 'upload' ? '#1DB954' : '#181818',
                      color: '#fff',
                      border: editData.audioMode !== 'upload' ? 'none' : '1px solid #404040',
                      borderRadius: '16px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    URL
                  </button>
                  <button
                    onClick={() => setEditData({ ...editData, audioMode: 'upload' })}
                    style={{
                      padding: '8px 16px',
                      background: editData.audioMode === 'upload' ? '#1DB954' : '#181818',
                      color: '#fff',
                      border: editData.audioMode === 'upload' ? 'none' : '1px solid #404040',
                      borderRadius: '16px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Upload
                  </button>
                </div>

                {editData.audioMode === 'upload' ? (
                  <div style={{
                    border: '1px dashed #404040',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    background: '#181818'
                  }}>
                    <input
                      type="file"
                      accept="audio/*"
                      style={{ display: 'none' }}
                      id="audio-upload"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const response = await mediaService.uploadFile(file, 'music-audio');
                            if (response.success) {
                              setEditData({ ...editData, audioUrl: response.media.url });
                            }
                          } catch (error) {
                            console.error("Audio upload failed", error);
                            alert("Failed to upload audio file. " + (error.response?.data?.message || error.message));
                          }
                        }
                      }}
                    />
                    <label htmlFor="audio-upload" style={{
                      cursor: 'pointer',
                      display: 'block',
                      color: '#b3b3b3',
                      fontSize: '14px'
                    }}>
                      {editData.audioUrl ? 'Change Audio File' : 'Click to Upload Audio File'}
                    </label>
                    {editData.audioUrl && (
                      <div style={{ marginTop: '10px', color: '#1DB954', fontSize: '12px' }}>
                        File Uploaded Successfully
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="https://example.com/audio.mp3"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#181818',
                      border: '1px solid #404040',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                    value={editData.audioUrl || ''}
                    onChange={(e) =>
                      setEditData({ ...editData, audioUrl: e.target.value })
                    }
                  />
                )}
              </div>

              <div>
                <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Status
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#181818',
                    border: '1px solid #404040',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                  value={editData.status}
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* BUTTONS */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  padding: '12px 24px',
                  background: '#181818',
                  color: '#fff',
                  border: '1px solid #404040',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>

              <button
                onClick={saveMusic}
                style={{
                  padding: '12px 24px',
                  background: '#1DB954',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}



      <TrendingModal
        isOpen={showTrendingModal}
        onClose={() => setShowTrendingModal(false)}
        title="Top Performing Tracks"
        data={trending.length > 0 ? trending : music}
      />
    </div>
  );
}
