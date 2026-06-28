import React, { useState } from 'react';

const HomePage = () => {
  // YAHAN SE ADMIN SARA DATA CONTROL KAREGA (Database API ke through)
  const [profileData, setProfileData] = useState({
    user: {
      name: "D3xSHUBHAM",
      fullName: "SHUBHAM KUMAR NAGVANSHI",
      id: "5305051851",
      location: "INDIA",
      level: 80,
      tier: "ACE DOMINATOR",
      stars: 22,
      avatarUrl: "https://ui-avatars.com/api/?name=D3&background=ffc107&color=000&size=150",
      bgUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
      badges: [
        { id: 1, text: "✔ Verified Player", type: "verified" },
        { id: 2, text: "👑 Elite Player", type: "elite" },
        { id: 3, text: "🎯 Conqueror", type: "conqueror" },
        { id: 4, text: "💎 Mythic Fashion", type: "mythic" }
      ]
    },
    achievements: [
      { id: 1, icon: "💗", name: "Well-Liked", score: "1000", color: "text-pink" },
      { id: 2, icon: "⭐", name: "Battle-Hard", score: "500", color: "text-gold" },
      { id: 3, icon: "⚔️", name: "Wpn Master", score: "200", color: "text-orange" },
      { id: 4, icon: "💀", name: "HS Master", score: "300", color: "text-cyan" },
      { id: 5, icon: "🐔", name: "Chicken Exp", score: "100", color: "text-green" }
    ],
    partner: {
      name: "As",
      uid: "123456",
      avatarUrl: "https://ui-avatars.com/api/?name=As&background=ff2a7a&color=fff",
    },
    gallery: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1519068737630-e5bf02f424ec?auto=format&fit=crop&q=80&w=200"
    ]
  });

  const handleActionClick = (actionName: string, e: React.MouseEvent) => {
    e.preventDefault();
    alert(`${actionName} clicked! Admin can attach links here later.`);
  };

  return (
    <>
      <style>
        {`
          :root {
              --bg-color: #06080d;
              --card-bg: #0f121a;
              --text-main: #ffffff;
              --text-muted: #8b92a5;
              --cyan: #00d9ff;
              --gold: #ffc107;
              --pink: #ff2a7a;
              --orange: #ff9800;
              --green: #00e676;
              --purple: #b300ff;
              --border-radius: 12px;
              --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }

          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: var(--font-family);
              -webkit-tap-highlight-color: transparent;
          }

          body {
              background-color: var(--bg-color);
              color: var(--text-main);
              display: flex;
              justify-content: center;
          }

          .app-container {
              width: 100%;
              max-width: 480px;
              min-height: 100vh;
              padding: 15px 15px 90px 15px;
              overflow-x: hidden;
              background-color: var(--bg-color);
          }

          /* General Layout Helpers */
          .flex-between { display: flex; justify-content: space-between; align-items: center; }
          .flex-center { display: flex; justify-content: center; align-items: center; }
          .flex-col { display: flex; flex-direction: column; }

          /* Header */
          .header { margin-bottom: 20px; }
          .header-icon {
              width: 35px; height: 35px; border-radius: 8px;
              background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
              cursor: pointer;
          }
          .logo { font-weight: 800; font-size: 1.2rem; letter-spacing: 1px; }
          .logo span { color: var(--cyan); }

          /* Hero Section Fixes */
          .hero-section {
              display: flex; gap: 15px; margin-bottom: 20px;
              background-color: #1a1e29;
              background-size: cover; background-position: center;
              border-radius: var(--border-radius); padding: 15px;
              position: relative; border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .hero-section::before {
              content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
              background: linear-gradient(90deg, rgba(6,8,13,0.95) 0%, rgba(6,8,13,0.6) 100%);
              border-radius: var(--border-radius); z-index: 0;
          }
          .avatar-box { position: relative; z-index: 1; width: 100px; text-align: center; flex-shrink: 0; }
          .avatar-frame {
              width: 90px; height: 90px; border: 3px solid var(--gold);
              border-radius: 10px; margin: 0 auto; background: #000;
          }
          .avatar-frame img { width: 100%; height: 100%; object-fit: cover; border-radius: 6px; }
          .online-badge {
              position: absolute; top: -8px; left: 0; background: var(--green);
              color: #000; font-size: 9px; font-weight: bold; padding: 2px 6px; border-radius: 4px;
          }
          .level-badge {
              position: absolute; bottom: -12px; left: 50%; transform: translateX(-50%);
              background: #222; border: 2px solid var(--gold); padding: 2px 8px;
              border-radius: 15px; font-weight: bold; font-size: 12px;
          }
          
          /* Fixed Hero Details for no overlap */
          .hero-details-container { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
          .hero-top-row { display: flex; justify-content: space-between; align-items: flex-start; }
          .hero-text-area { flex: 1; min-width: 0; }
          
          .hero-text-area h1 { font-size: 1.2rem; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .verified-tick { color: var(--cyan); font-size: 1rem; margin-left: 4px; }
          .real-name { font-size: 0.7rem; color: var(--text-muted); margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
          .id-location { font-size: 0.75rem; margin-bottom: 10px; }
          .id-text { color: var(--cyan); font-weight: bold; }
          
          .rank-display { text-align: right; flex-shrink: 0; margin-left: 10px; }
          .rank-display .star-icon { font-size: 1.5rem; }
          .rank-text { color: var(--gold); font-size: 0.6rem; font-weight: bold; margin-top: 2px; text-transform: uppercase; }
          .rank-score { font-size: 0.75rem; margin-top: 2px; }

          .badges { display: flex; flex-wrap: wrap; gap: 5px; }
          .badge {
              font-size: 0.6rem; padding: 3px 6px; border-radius: 4px;
              border: 1px solid; background: rgba(0,0,0,0.5); white-space: nowrap;
          }
          .badge-verified { color: var(--cyan); border-color: rgba(0, 217, 255, 0.3); }
          .badge-elite { color: var(--gold); border-color: rgba(255, 193, 7, 0.3); }
          .badge-conqueror { color: var(--orange); border-color: rgba(255, 152, 0, 0.3); }
          .badge-mythic { color: var(--purple); border-color: rgba(179, 0, 255, 0.3); }

          /* Stats Grid */
          .stats-row { background: var(--card-bg); border-radius: var(--border-radius); padding: 15px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.05); }
          .stat-item { flex: 1; text-align: center; }
          .stat-icon { font-size: 1.2rem; margin-bottom: 4px; display: block; }
          .stat-title { font-size: 0.55rem; color: var(--text-muted); text-transform: uppercase; }
          .stat-value { font-size: 1rem; font-weight: bold; margin-top: 2px; display: block; }
          
          /* Cards */
          .base-card { background: var(--card-bg); border-radius: var(--border-radius); padding: 15px; margin-bottom: 15px; }
          .partner-card { border: 1px solid rgba(255, 42, 122, 0.2); }
          
          .partner-avatar { width: 60px; height: 60px; border-radius: 50%; border: 2px solid var(--pink); position: relative; flex-shrink: 0; }
          .partner-avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
          .partner-online { position: absolute; bottom: 2px; right: 2px; width: 12px; height: 12px; background: var(--green); border-radius: 50%; border: 2px solid var(--card-bg); }
          .lover-tag { background: rgba(255, 42, 122, 0.1); color: var(--pink); border: 1px solid rgba(255, 42, 122, 0.3); font-size: 0.6rem; padding: 2px 8px; border-radius: 10px; display: inline-block; margin-top: 4px; }
          
          /* Grids */
          .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 10px; }
          .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 15px; }
          .stat-box { background: var(--card-bg); border: 1px solid rgba(255,255,255,0.05); border-radius: var(--border-radius); padding: 10px; display: flex; align-items: center; gap: 8px; }
          .grid-4 .stat-box { flex-direction: column; text-align: center; gap: 4px; }
          .stat-box-info p { font-size: 0.55rem; color: var(--text-muted); margin-bottom: 2px; text-transform: uppercase;}
          .stat-box-info strong { font-size: 0.85rem; }

          /* Details */
          .details-card { border: 1px solid rgba(179, 0, 255, 0.2); }
          .details-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px 5px; }
          .detail-item span { font-size: 0.55rem; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 2px; }
          .detail-item strong { font-size: 0.75rem; }

          /* Achievements */
          .ach-grid { display: flex; justify-content: space-between; text-align: center; overflow-x: auto; padding-bottom: 5px;}
          .ach-grid::-webkit-scrollbar { display: none; }
          .ach-item { min-width: 60px; display: flex; flex-direction: column; align-items: center; gap: 5px; }
          .ach-icon { width: 40px; height: 40px; background: rgba(255,255,255,0.05); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); display: flex; justify-content: center; align-items: center; font-size: 1.1rem; border: 1px solid rgba(255,255,255,0.1); }
          .ach-item span { font-size: 0.55rem; text-transform: uppercase; }

          /* Bottom Split */
          .bottom-split { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .quick-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          .action-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 5px; display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 0.65rem; color: var(--text-main); text-decoration: none; cursor: pointer; transition: 0.2s; }
          .action-btn:active { background: rgba(255,255,255,0.1); }
          .action-btn i { font-size: 1.2rem; font-style: normal; }
          
          .add-btn { width: 45px; height: 45px; border-radius: 50%; border: 1px dashed var(--text-muted); display: flex; justify-content: center; align-items: center; color: var(--text-muted); font-size: 1.2rem; cursor: pointer; }

          /* Gallery */
          .gallery-preview { display: flex; gap: 10px; margin-top: 15px; overflow-x: auto; padding-bottom: 5px; }
          .gallery-preview::-webkit-scrollbar { display: none; }
          .gallery-img { min-width: 80px; height: 50px; border-radius: 6px; background: #222; object-fit: cover; border: 1px solid rgba(255,255,255,0.1); }

          /* Nav */
          .bottom-nav { position: fixed; bottom: 0; left: 0; width: 100%; background: #06080d; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-around; padding: 12px 0 20px 0; z-index: 100; }
          .nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--text-muted); font-size: 0.65rem; text-decoration: none; cursor: pointer;}
          .nav-item.active { color: var(--cyan); }
          
          /* Colors */
          .text-cyan { color: var(--cyan); } .text-pink { color: var(--pink); }
          .text-gold { color: var(--gold); } .text-orange { color: var(--orange); }
          .text-green { color: var(--green); } .text-purple { color: var(--purple); }
          .text-link { color: var(--cyan); font-size: 0.7rem; text-decoration: none; cursor: pointer; }
        `}
      </style>

      <div className="app-container">
        
        {/* Header */}
        <header className="header flex-between">
          <div className="header-icon flex-center" onClick={(e) => handleActionClick('Menu', e)}>≡</div>
          <div className="logo">🛡️ BGMI <span>VAULT</span></div>
          <div className="header-icon flex-center" onClick={(e) => handleActionClick('Share', e)}>➦</div>
        </header>

        {/* Hero Profile Section */}
        <section className="hero-section" style={{ backgroundImage: `url(${profileData.user.bgUrl})` }}>
          <div className="avatar-box">
            <span className="online-badge">ONLINE</span>
            <div className="avatar-frame">
              <img src={profileData.user.avatarUrl} alt="Avatar" />
            </div>
            <div className="level-badge">{profileData.user.level}</div>
          </div>
          
          <div className="hero-details-container">
            <div className="hero-top-row">
              <div className="hero-text-area">
                <h1>{profileData.user.name} <span className="verified-tick">✔</span></h1>
                <p className="real-name">{profileData.user.fullName}</p>
                <p className="id-location">ID: <span className="id-text">{profileData.user.id}</span> &nbsp; 📍 {profileData.user.location}</p>
              </div>
              <div className="rank-display">
                <div className="star-icon">🌟</div>
                <div className="rank-text">{profileData.user.tier}</div>
                <div className="rank-score">⭐ {profileData.user.stars}</div>
              </div>
            </div>
            
            <div className="badges">
              {profileData.user.badges.map(badge => (
                <span key={badge.id} className={`badge badge-${badge.type}`}>{badge.text}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="stats-row flex-between">
          <div className="stat-item">
            <span className="stat-icon text-cyan">🎯</span>
            <span className="stat-title">K/D Ratio</span>
            <span className="stat-value text-cyan">5.24</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon text-gold">🏆</span>
            <span className="stat-title">Win Rate</span>
            <span className="stat-value text-gold">63.2%</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon text-pink">🔫</span>
            <span className="stat-title">Headshot %</span>
            <span className="stat-value text-pink">19.8%</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon text-orange">💥</span>
            <span className="stat-title">Avg Damage</span>
            <span className="stat-value text-orange">842.6</span>
          </div>
        </div>

        {/* Gaming Partner */}
        <div className="base-card partner-card">
          <div className="flex-between" style={{ marginBottom: '15px' }}>
            <div className="text-pink" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>❤️ GAMING PARTNER</div>
            <div style={{ background: 'rgba(255,193,7,0.1)', color: 'var(--gold)', border: '1px solid rgba(255,193,7,0.3)', padding: '3px 8px', borderRadius: '12px', fontSize: '0.65rem' }}>👑 Elite Partner</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="partner-avatar">
              <img src={profileData.partner.avatarUrl} alt="Partner" />
              <span className="partner-online"></span>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem' }}>{profileData.partner.name}</h3>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>UID: {profileData.partner.uid}</p>
              <span className="lover-tag">Lover</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', textAlign: 'center' }}>
              <div className="flex-col">
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>❤️ KD</span>
                <strong className="text-pink" style={{ fontSize: '0.85rem' }}>10.00+</strong>
              </div>
              <div className="flex-col">
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>🔗 SYNERGY</span>
                <strong className="text-cyan" style={{ fontSize: '0.85rem' }}>100000+</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Stats Row 1 */}
        <div className="grid-3">
          <div className="stat-box">
            <div className="text-cyan" style={{ fontSize: '1.2rem' }}>👥</div>
            <div className="stat-box-info"><p>Friends</p><strong>1+</strong></div>
          </div>
          <div className="stat-box">
            <div className="text-pink" style={{ fontSize: '1.2rem' }}>❤️</div>
            <div className="stat-box-info"><p>Total Synergy</p><strong>4,499+</strong></div>
          </div>
          <div className="stat-box">
            <div className="text-gold" style={{ fontSize: '1.2rem' }}>🏅</div>
            <div className="stat-box-info"><p>Avg Synergy</p><strong>4,499+</strong></div>
          </div>
        </div>

        {/* Middle Stats Row 2 */}
        <div className="grid-4">
          <div className="stat-box">
            <div className="text-purple" style={{ fontSize: '1.2rem' }}>🎯</div>
            <div className="stat-box-info"><p>Collection</p><strong>71+</strong></div>
          </div>
          <div className="stat-box">
            <div className="text-orange" style={{ fontSize: '1.2rem' }}>🔥</div>
            <div className="stat-box-info"><p>Popularity</p><strong>226874+</strong></div>
          </div>
          <div className="stat-box">
            <div className="text-green" style={{ fontSize: '1.2rem' }}>🖼️</div>
            <div className="stat-box-info"><p>Memories</p><strong>0+</strong></div>
          </div>
          <div className="stat-box">
            <div className="text-cyan" style={{ fontSize: '1.2rem' }}>🏆</div>
            <div className="stat-box-info"><p>High Synergy</p><strong>4,499+</strong></div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="base-card details-card">
          <div className="flex-between" style={{ marginBottom: '15px', fontWeight: 'bold', fontSize: '0.85rem' }}>
            <span>⚔️ PROFILE DETAILS</span>
          </div>
          <div className="details-grid">
            <div className="detail-item"><span>Collection Level</span><strong>71+</strong></div>
            <div className="detail-item"><span>Account Level</span><strong>91+</strong></div>
            <div className="detail-item"><span>Current Tier</span><strong className="text-gold">Ace Dominator</strong></div>
            <div className="detail-item"><span>State</span><strong>BIHAR</strong></div>
            
            <div className="detail-item"><span>Popularity</span><strong>2267874+</strong></div>
            <div className="detail-item"><span>Likes</span><strong>26868+</strong></div>
            <div className="detail-item"><span>Highest Tier</span><strong className="text-gold">Ace Dominator</strong></div>
            <div className="detail-item"><span>Country</span><strong>INDIA</strong></div>

            <div className="detail-item"><span>Matches</span><strong>0+</strong></div>
            <div className="detail-item"><span>Achievement Pts</span><strong>0+</strong></div>
            <div className="detail-item"><span>Playing Since</span><strong>8 YEARS</strong></div>
          </div>
        </div>

        {/* Dynamic Achievements from State */}
        <div className="base-card">
          <div className="flex-between" style={{ marginBottom: '15px', fontWeight: 'bold', fontSize: '0.85rem' }}>
            <span>ACHIEVEMENTS</span>
            <span className="text-link" onClick={(e) => handleActionClick('View Achievements', e)}>View All {'>'}</span>
          </div>
          <div className="ach-grid">
            {profileData.achievements.map((ach) => (
              <div key={ach.id} className="ach-item">
                <div className={`ach-icon ${ach.color}`}>{ach.icon}</div>
                <span>{ach.name}</span>
                <span style={{ fontSize: '0.65rem' }} className={ach.color}>{ach.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Split */}
        <div className="bottom-split">
          <div className="base-card" style={{ marginBottom: 0 }}>
            <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '0.8rem' }}>QUICK ACTIONS</div>
            <div className="quick-actions">
              <div className="action-btn" onClick={(e) => handleActionClick('All Friends', e)}>
                <i className="text-cyan">👥</i> All Friends
              </div>
              <div className="action-btn" onClick={(e) => handleActionClick('Top 10', e)}>
                <i className="text-gold">🏆</i> Top 10
              </div>
              <div className="action-btn" onClick={(e) => handleActionClick('Gallery', e)}>
                <i className="text-pink">🖼️</i> Gallery
              </div>
              <div className="action-btn" onClick={(e) => handleActionClick('Statistics', e)}>
                <i className="text-purple">📊</i> Statistics
              </div>
            </div>
          </div>

          <div className="base-card" style={{ marginBottom: 0 }}>
            <div className="flex-between" style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '0.8rem' }}>
              <span>FEATURED FRIENDS</span>
              <span className="text-link" onClick={(e) => handleActionClick('View Featured Friends', e)}>View All</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="partner-avatar" style={{ width: '45px', height: '45px', borderColor: 'var(--cyan)', margin: '0 auto' }}>
                  <img src="https://ui-avatars.com/api/?name=Jdn&background=00d9ff&color=fff" alt="Friend" />
                  <span className="partner-online" style={{ width: '10px', height: '10px' }}></span>
                </div>
                <div style={{ fontSize: '0.7rem', marginTop: '5px', fontWeight: 'bold' }}>Jdn</div>
                <div style={{ fontSize: '0.5rem', color: 'var(--green)' }}>0.00+ KD</div>
              </div>
              <div style={{ textAlign: 'center', marginLeft: 'auto', marginRight: '10px' }}>
                <div className="add-btn" onClick={(e) => handleActionClick('Add Friend', e)}>+</div>
                <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: '5px' }}>View All</div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div style={{ marginTop: '15px' }}>
          <div className="flex-between" style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
            <span>GALLERY PREVIEW</span>
            <span className="text-link" onClick={(e) => handleActionClick('Open Full Gallery', e)}>Open Gallery</span>
          </div>
          <div className="gallery-preview">
            {profileData.gallery.map((img, index) => (
              <img key={index} src={img} className="gallery-img" alt={`Gallery ${index + 1}`} />
            ))}
          </div>
        </div>

      </div>

      {/* Nav */}
      <nav className="bottom-nav">
        <div className="nav-item active" onClick={(e) => handleActionClick('Home', e)}><span style={{ fontSize: '1.2rem' }}>🏠</span><span>Home</span></div>
        <div className="nav-item" onClick={(e) => handleActionClick('Friends', e)}><span style={{ fontSize: '1.2rem' }}>👥</span><span>Friends</span></div>
        <div className="nav-item" onClick={(e) => handleActionClick('Leaderboard', e)}><span style={{ fontSize: '1.2rem' }}>🏆</span><span>Leaderboard</span></div>
        <div className="nav-item" onClick={(e) => handleActionClick('Gallery', e)}><span style={{ fontSize: '1.2rem' }}>🖼️</span><span>Gallery</span></div>
        <div className="nav-item" onClick={(e) => handleActionClick('Admin', e)}><span style={{ fontSize: '1.2rem' }}>⚙️</span><span>Admin</span></div>
      </nav>
    </>
  );
};

export default HomePage;
