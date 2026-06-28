<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BGMI Vault Profile</title>
    <style>
        /* --- GLOBAL THEME & RESET --- */
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

        /* Mobile Viewport Container */
        .app-container {
            width: 100%;
            max-width: 480px;
            min-height: 100vh;
            padding: 15px 15px 90px 15px; /* Bottom padding for fixed nav */
            overflow-x: hidden;
        }

        /* --- TOP HEADER --- */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .header-icon {
            width: 35px;
            height: 35px;
            border-radius: 8px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            cursor: pointer;
        }
        .logo {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 800;
            font-size: 1.2rem;
            color: var(--text-main);
            letter-spacing: 1px;
        }
        .logo span { color: var(--cyan); }

        /* --- HERO PROFILE SECTION --- */
        .hero-section {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            background: url('https://i.imgur.com/QXb6bZy.jpeg') center/cover;
            border-radius: var(--border-radius);
            padding: 15px;
            position: relative;
            box-shadow: inset 0 0 50px rgba(0,0,0,0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .hero-section::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(90deg, rgba(6,8,13,0.9) 0%, rgba(6,8,13,0.4) 100%);
            border-radius: var(--border-radius);
            z-index: 0;
        }
        .avatar-box {
            position: relative;
            z-index: 1;
            width: 130px;
            text-align: center;
        }
        .avatar-frame {
            width: 110px;
            height: 110px;
            border: 3px solid var(--gold);
            border-radius: 10px;
            position: relative;
            margin: 0 auto;
        }
        .avatar-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 6px;
        }
        .online-badge {
            position: absolute;
            top: -10px;
            left: 5px;
            background: var(--green);
            color: #000;
            font-size: 10px;
            font-weight: bold;
            padding: 2px 8px;
            border-radius: 4px;
        }
        .level-badge {
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            background: #222;
            border: 2px solid var(--gold);
            padding: 2px 10px;
            border-radius: 15px;
            font-weight: bold;
            font-size: 14px;
        }
        .hero-details {
            position: relative;
            z-index: 1;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .hero-details h1 {
            font-size: 1.4rem;
            margin-bottom: 2px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .verified-tick { color: var(--cyan); font-size: 1rem; }
        .real-name { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px; }
        .id-location { font-size: 0.8rem; margin-bottom: 10px; }
        .id-text { color: var(--cyan); font-weight: bold; }
        
        .badges {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        .badge {
            font-size: 0.65rem;
            padding: 3px 8px;
            border-radius: 4px;
            border: 1px solid;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .badge-verified { color: var(--cyan); border-color: rgba(0, 217, 255, 0.3); }
        .badge-elite { color: var(--gold); border-color: rgba(255, 193, 7, 0.3); }
        .badge-conqueror { color: var(--orange); border-color: rgba(255, 152, 0, 0.3); }
        .badge-mythic { color: var(--purple); border-color: rgba(179, 0, 255, 0.3); }

        /* --- STATS GRID ROW 1 --- */
        .stats-row {
            display: flex;
            justify-content: space-between;
            background: var(--card-bg);
            border-radius: var(--border-radius);
            padding: 15px;
            margin-bottom: 15px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            flex: 1;
            text-align: center;
        }
        .stat-icon { font-size: 1.2rem; }
        .stat-title { font-size: 0.55rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-value { font-size: 1.1rem; font-weight: bold; }
        
        .val-kd { color: var(--cyan); }
        .val-win { color: var(--gold); }
        .val-hs { color: var(--pink); }
        .val-dmg { color: var(--orange); }

        /* --- GAMING PARTNER --- */
        .partner-card {
            background: var(--card-bg);
            border-radius: var(--border-radius);
            padding: 15px;
            margin-bottom: 15px;
            border: 1px solid rgba(255, 42, 122, 0.2);
            position: relative;
            overflow: hidden;
        }
        .partner-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .partner-title {
            color: var(--pink);
            font-size: 0.85rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .partner-badge {
            background: rgba(255, 193, 7, 0.1);
            color: var(--gold);
            border: 1px solid rgba(255, 193, 7, 0.3);
            font-size: 0.65rem;
            padding: 3px 8px;
            border-radius: 12px;
        }
        .partner-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .partner-avatar {
            width: 65px;
            height: 65px;
            border-radius: 50%;
            border: 2px solid var(--pink);
            position: relative;
        }
        .partner-avatar img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }
        .partner-online {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 12px;
            height: 12px;
            background: var(--green);
            border-radius: 50%;
            border: 2px solid var(--card-bg);
        }
        .partner-info h3 { font-size: 1.2rem; margin-bottom: 2px; }
        .partner-info p { font-size: 0.7rem; color: var(--text-muted); margin-bottom: 5px; }
        .lover-tag {
            background: rgba(255, 42, 122, 0.1);
            color: var(--pink);
            border: 1px solid rgba(255, 42, 122, 0.3);
            font-size: 0.6rem;
            padding: 2px 8px;
            border-radius: 10px;
        }
        .partner-stats {
            margin-left: auto;
            display: flex;
            gap: 15px;
            text-align: center;
        }
        .p-stat {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
        .p-stat span { font-size: 0.6rem; color: var(--text-muted); }
        .p-stat strong { font-size: 0.9rem; color: var(--pink); }
        .p-stat strong.cyan-text { color: var(--cyan); }

        /* --- MIDDLE STATS (3 Columns) --- */
        .grid-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 10px;
        }
        .stat-box {
            background: var(--card-bg);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: var(--border-radius);
            padding: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .stat-box .icon { font-size: 1.2rem; }
        .stat-box-info p { font-size: 0.55rem; color: var(--text-muted); margin-bottom: 2px; text-transform: uppercase;}
        .stat-box-info strong { font-size: 0.9rem; }

        /* --- MIDDLE STATS (4 Columns) --- */
        .grid-4 {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 15px;
        }
        .grid-4 .stat-box {
            flex-direction: column;
            text-align: center;
            gap: 5px;
            padding: 10px;
        }
        
        /* --- PROFILE DETAILS SECTION --- */
        .details-card {
            background: var(--card-bg);
            border-radius: var(--border-radius);
            padding: 15px;
            margin-bottom: 15px;
            border: 1px solid rgba(179, 0, 255, 0.2);
        }
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            font-size: 0.85rem;
            font-weight: bold;
        }
        .details-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px 5px;
        }
        .detail-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .detail-item span { font-size: 0.55rem; color: var(--text-muted); text-transform: uppercase; }
        .detail-item strong { font-size: 0.8rem; }
        .tier-text { color: var(--gold); }

        /* --- ACHIEVEMENTS --- */
        .achievements-card {
            background: var(--card-bg);
            border-radius: var(--border-radius);
            padding: 15px;
            margin-bottom: 15px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .ach-grid {
            display: flex;
            justify-content: space-between;
            text-align: center;
        }
        .ach-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
        }
        .ach-icon {
            width: 45px;
            height: 45px;
            background: rgba(255,255,255,0.05);
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.2rem;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .ach-item span { font-size: 0.55rem; text-transform: uppercase; }
        .ach-score { font-size: 0.65rem; }

        /* --- BOTTOM GRIDS (Quick Actions & Friends) --- */
        .bottom-split {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .half-card {
            background: var(--card-bg);
            border-radius: var(--border-radius);
            padding: 15px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .quick-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        .action-btn {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 12px 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            font-size: 0.65rem;
            color: var(--text-main);
            text-decoration: none;
        }
        .action-btn i { font-size: 1.2rem; }
        
        .friend-list {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
        }
        .add-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 1px dashed var(--text-muted);
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--text-muted);
            font-size: 1.2rem;
        }

        /* --- GALLERY PREVIEW --- */
        .gallery-preview {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            overflow-x: auto;
            padding-bottom: 5px;
        }
        .gallery-preview::-webkit-scrollbar { display: none; }
        .gallery-img {
            min-width: 80px;
            height: 50px;
            border-radius: 6px;
            background: #222;
            object-fit: cover;
        }

        /* --- BOTTOM NAVIGATION --- */
        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #06080d;
            border-top: 1px solid rgba(255,255,255,0.05);
            display: flex;
            justify-content: space-around;
            padding: 12px 0 20px 0;
            z-index: 100;
        }
        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            color: var(--text-muted);
            font-size: 0.65rem;
            text-decoration: none;
        }
        .nav-item.active {
            color: var(--cyan);
        }
        .nav-icon {
            font-size: 1.3rem;
        }
        
        /* Helper Classes */
        .text-cyan { color: var(--cyan); }
        .text-pink { color: var(--pink); }
        .text-gold { color: var(--gold); }
        .text-link { color: var(--cyan); font-size: 0.7rem; text-decoration: none; }
    </style>
</head>
<body>

<div class="app-container">

    <!-- Header -->
    <header class="header">
        <div class="header-icon">≡</div>
        <div class="logo">🛡️ BGMI <span>VAULT</span></div>
        <div class="header-icon">➦</div>
    </header>

    <!-- Hero Profile Section -->
    <section class="hero-section">
        <div class="avatar-box">
            <span class="online-badge">ONLINE</span>
            <div class="avatar-frame">
                <!-- Admin can change this image URL -->
                <img src="https://i.imgur.com/QXb6bZy.jpeg" alt="Player Avatar">
            </div>
            <div class="level-badge">80</div>
        </div>
        <div class="hero-details">
            <h1>D3xSHUBHAM <span class="verified-tick">✔</span></h1>
            <p class="real-name">SHUBHAM KUMAR NAGVANSHI</p>
            <p class="id-location">ID: <span class="id-text">5305051851</span> &nbsp; 📍 INDIA</p>
            <div class="badges">
                <span class="badge badge-verified">✔ Verified Player</span>
                <span class="badge badge-elite">👑 Elite Player</span>
                <span class="badge badge-conqueror">🎯 Conqueror</span>
                <span class="badge badge-mythic">💎 Mythic Fashion</span>
            </div>
            <!-- Absolute Rank Badge on Right -->
            <div style="position: absolute; right: -5px; top: 10px; text-align: center;">
                <div style="font-size: 2rem;">🌟</div>
                <div class="text-gold" style="font-size: 0.65rem; font-weight: bold; margin-top: 5px;">ACE DOMINATOR</div>
                <div style="font-size: 0.8rem; margin-top: 2px;">⭐ 22</div>
            </div>
        </div>
    </section>

    <!-- Top Stats Grid -->
    <div class="stats-row">
        <div class="stat-item">
            <span class="stat-icon text-cyan">🎯</span>
            <span class="stat-title">K/D Ratio</span>
            <span class="stat-value val-kd">5.24</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon text-gold">🏆</span>
            <span class="stat-title">Win Rate</span>
            <span class="stat-value val-win">63.2%</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon text-pink">🔫</span>
            <span class="stat-title">Headshot %</span>
            <span class="stat-value val-hs">19.8%</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon text-orange">💥</span>
            <span class="stat-title">Avg Damage</span>
            <span class="stat-value val-dmg">842.6</span>
        </div>
    </div>

    <!-- Gaming Partner Section -->
    <div class="partner-card">
        <div class="partner-header">
            <div class="partner-title">❤️ GAMING PARTNER</div>
            <div class="partner-badge">👑 Elite Partner</div>
        </div>
        <div class="partner-content">
            <div class="partner-avatar">
                <img src="https://i.imgur.com/QXb6bZy.jpeg" alt="Partner">
                <span class="partner-online"></span>
            </div>
            <div class="partner-info">
                <h3>As</h3>
                <p>UID: 123456</p>
                <span class="lover-tag">Lover</span>
            </div>
            <div class="partner-stats">
                <div class="p-stat">
                    <span>❤️ KD</span>
                    <strong>10.00+</strong>
                </div>
                <div class="p-stat">
                    <span>🔗 SYNERGY</span>
                    <strong class="cyan-text">100000+</strong>
                </div>
                <div class="p-stat">
                    <span>PLAYING TOGETHER</span>
                    <strong style="color: #fff; font-size: 0.75rem;">2Y 5M 12D</strong>
                </div>
            </div>
        </div>
    </div>

    <!-- Middle Stats Row 1 -->
    <div class="grid-3">
        <div class="stat-box">
            <div class="icon text-cyan">👥</div>
            <div class="stat-box-info">
                <p>Friends</p>
                <strong>1+</strong>
            </div>
        </div>
        <div class="stat-box">
            <div class="icon text-pink">❤️</div>
            <div class="stat-box-info">
                <p>Total Synergy</p>
                <strong>4,499+</strong>
            </div>
        </div>
        <div class="stat-box">
            <div class="icon text-gold">🏅</div>
            <div class="stat-box-info">
                <p>Avg Synergy</p>
                <strong>4,499+</strong>
            </div>
        </div>
    </div>
    <!-- Middle Stats Row 2 -->
    <div class="grid-4">
        <div class="stat-box">
            <div class="icon text-purple">🎯</div>
            <div class="stat-box-info">
                <p>Collection</p>
                <strong>71+</strong>
            </div>
        </div>
        <div class="stat-box">
            <div class="icon text-orange">🔥</div>
            <div class="stat-box-info">
                <p>Popularity</p>
                <strong>226874+</strong>
            </div>
        </div>
        <div class="stat-box">
            <div class="icon text-green">🖼️</div>
            <div class="stat-box-info">
                <p>Memories</p>
                <strong>0+</strong>
            </div>
        </div>
        <div class="stat-box">
            <div class="icon text-cyan">🏆</div>
            <div class="stat-box-info">
                <p>High Synergy</p>
                <strong>4,499+</strong>
            </div>
        </div>
    </div>

    <!-- Profile Details Card -->
    <div class="details-card">
        <div class="section-header">
            <span>⚔️ PROFILE DETAILS</span>
        </div>
        <div class="details-grid">
            <div class="detail-item">
                <span>Collection Level</span>
                <strong>71+</strong>
            </div>
            <div class="detail-item">
                <span>Account Level</span>
                <strong>91+</strong>
            </div>
            <div class="detail-item">
                <span>Current Tier</span>
                <strong class="tier-text">Ace Dominator</strong>
            </div>
            <div class="detail-item">
                <span>State</span>
                <strong>BIHAR</strong>
            </div>
            
            <div class="detail-item" style="margin-top: 10px;">
                <span>Popularity</span>
                <strong>2267874+</strong>
            </div>
            <div class="detail-item" style="margin-top: 10px;">
                <span>Likes</span>
                <strong>26868+</strong>
            </div>
            <div class="detail-item" style="margin-top: 10px;">
                <span>Highest Tier</span>
                <strong class="tier-text">Ace Dominator</strong>
            </div>
            <div class="detail-item" style="margin-top: 10px;">
                <span>Country</span>
                <strong>INDIA</strong>
            </div>

            <div class="detail-item" style="margin-top: 10px;">
                <span>Matches</span>
                <strong>0+</strong>
            </div>
            <div class="detail-item" style="margin-top: 10px;">
                <span>Achievement Pts</span>
                <strong>0+</strong>
            </div>
            <div class="detail-item" style="margin-top: 10px;">
                <span>Playing Since</span>
                <strong>8 YEARS</strong>
            </div>
        </div>
    </div>

    <!-- Achievements Card -->
    <div class="achievements-card">
        <div class="section-header">
            <span>ACHIEVEMENTS</span>
            <a href="#" class="text-link">View All ></a>
        </div>
        <div class="ach-grid">
            <div class="ach-item">
                <div class="ach-icon text-pink">💗</div>
                <span>Well-Liked</span>
                <span class="ach-score text-pink">1000</span>
            </div>
            <div class="ach-item">
                <div class="ach-icon text-gold">⭐</div>
                <span>Battle-Hard</span>
                <span class="ach-score text-green">500</span>
            </div>
            <div class="ach-item">
                <div class="ach-icon text-orange">⚔️</div>
                <span>Wpn Master</span>
                <span class="ach-score" style="color: #d81b60;">200</span>
            </div>
            <div class="ach-item">
                <div class="ach-icon text-cyan">💀</div>
                <span>HS Master</span>
                <span class="ach-score text-cyan">300</span>
            </div>
            <div class="ach-item">
                <div class="ach-icon text-green">🐔</div>
                <span>Chicken Exp</span>
                <span class="ach-score text-pink">100</span>
            </div>
        </div>
    </div>

    <!-- Bottom Split Section (Quick Actions & Friends) -->
    <div class="bottom-split">
        <!-- Quick Actions -->
        <div class="half-card">
            <div class="section-header" style="margin-bottom: 10px;">
                <span>QUICK ACTIONS</span>
            </div>
            <div class="quick-actions">
                <a href="#" class="action-btn">
                    <i class="text-cyan">👥</i> All Friends
                </a>
                <a href="#" class="action-btn">
                    <i class="text-gold">🏆</i> Top 10
                </a>
                <a href="#" class="action-btn">
                    <i class="text-pink">🖼️</i> Gallery
                </a>
                <a href="#" class="action-btn">
                    <i class="text-purple">📊</i> Statistics
                </a>
            </div>
        </div>

        <!-- Featured Friends -->
        <div class="half-card">
            <div class="section-header" style="margin-bottom: 10px;">
                <span>FEATURED FRIENDS</span>
                <a href="#" class="text-link">View All</a>
            </div>
            <div class="friend-list">
                <div style="text-align: center;">
                    <div class="partner-avatar" style="width: 50px; height: 50px; border-color: var(--cyan); margin: 0 auto;">
                        <img src="https://i.imgur.com/QXb6bZy.jpeg" alt="Friend">
                        <span class="partner-online"></span>
                    </div>
                    <div style="font-size: 0.75rem; margin-top: 5px; font-weight: bold;">Jdn</div>
                    <div style="font-size: 0.55rem; color: var(--green);">0.00+ KD</div>
                </div>
                <div style="text-align: center; margin-left: 10px;">
                    <div class="add-btn">+</div>
                    <div style="font-size: 0.6rem; color: var(--text-muted); margin-top: 5px;">View All</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Gallery Preview -->
    <div style="margin-top: 15px;">
        <div class="section-header">
            <span>GALLERY PREVIEW</span>
            <a href="#" class="text-link">Open Gallery</a>
        </div>
        <div class="gallery-preview">
            <img src="https://i.imgur.com/QXb6bZy.jpeg" class="gallery-img">
            <img src="https://i.imgur.com/QXb6bZy.jpeg" class="gallery-img">
            <img src="https://i.imgur.com/QXb6bZy.jpeg" class="gallery-img">
            <img src="https://i.imgur.com/QXb6bZy.jpeg" class="gallery-img">
        </div>
    </div>
              <!-- Fixed Bottom Navigation -->
<nav class="bottom-nav">
    <a href="#" class="nav-item active">
        <span class="nav-icon">🏠</span>
        <span>Home</span>
    </a>
    <a href="#" class="nav-item">
        <span class="nav-icon">👥</span>
        <span>Friends</span>
    </a>
    <a href="#" class="nav-item">
        <span class="nav-icon">🏆</span>
        <span>Leaderboard</span>
    </a>
    <a href="#" class="nav-item">
        <span class="nav-icon">🖼️</span>
        <span>Gallery</span>
    </a>
    <a href="#" class="nav-item">
        <span class="nav-icon">⚙️</span>
        <span>Admin</span>
    </a>
</nav>

</body>
</html>
