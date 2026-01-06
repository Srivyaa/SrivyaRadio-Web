/**
 * SrivyaRadio - Adaptive Radio Player
 * Enhanced with favorites, history, dark mode, and PWA features
 */

(function () {
    'use strict';

    // ==================== Configuration ====================
    const CONFIG = {
        BASE_URL: 'https://raw.githubusercontent.com/Srivyaa/RadioStations/main/data/',
        STORAGE_KEYS: {
            FAVORITES: 'srivya_favorites',
            HISTORY: 'srivya_history',
            THEME: 'srivya_theme',
            LAST_PLAYED: 'srivya_last_played',
            VOLUME: 'srivya_volume',
            PLAY_COUNTS: 'srivya_play_counts',
            CATEGORY_SORT: 'srivya_category_sort',
            STATION_SORT: 'srivya_station_sort'
        },
        MAX_HISTORY: 50,
        SEARCH_DEBOUNCE: 300,
        SORT_OPTIONS: {
            ALPHABETICAL: 'alpha',
            FAVORITES: 'favorites',
            PLAY_COUNT: 'playcount'
        }
    };

    // ==================== Category Mapping ====================
    const CATEGORIES = [
        { displayName: "All_India_Radios 🇮🇳", fileName: "india.json" },
        { displayName: "Actor_Radios 🎭", fileName: "actor.json" },
        { displayName: "Ajith_Radios 🎬", fileName: "ajith.json" },
        { displayName: "Amma_Radios 👵", fileName: "amma.json" },
        { displayName: "Appa_Radios 👨‍👧‍👦", fileName: "appa.json" },
        { displayName: "Arjun_Radios 🦁", fileName: "arjun.json" },
        { displayName: "Captain_Radios 🕶️", fileName: "captain.json" },
        { displayName: "Amman_Radio 🕉️", fileName: "amman.json" },
        { displayName: "Artist_Radios 🎤", fileName: "artist.json" },
        { displayName: "Christian_Radios ✝️", fileName: "CHRIST.json" },
        { displayName: "Community_Radios 🏘️", fileName: "community.json" },
        { displayName: "Classic_Radios 🎻", fileName: "classic.json" },
        { displayName: "Deva_Radios 🎵", fileName: "deva.json" },
        { displayName: "English_Radios 🇬🇧", fileName: "english.json" },
        { displayName: "Ganapathy_Radios 🐘", fileName: "ganapathy.json" },
        { displayName: "Hindu_Radio 🕉️", fileName: "hindu.json" },
        { displayName: "Hindi_Radios 🇮🇳", fileName: "hindi.json" },
        { displayName: "JR_Radios 🦸", fileName: "jr.json" },
        { displayName: "Islam_Radios ☪️", fileName: "islam.json" },
        { displayName: "Kamal_Radios 🎭", fileName: "kamal.json" },
        { displayName: "Kids_Radios 👶", fileName: "kids.json" },
        { displayName: "Kutties_Radios 👶", fileName: "kutties.json" },
        { displayName: "Local_Radios 📍", fileName: "local.json" },
        { displayName: "Local_TV ▶️", fileName: "localtv.json" },
        { displayName: "MP3 🎵", fileName: "mp3.json" },
        { displayName: "Music_Radio 🎵", fileName: "music.json" },
        { displayName: "Manisharma_Radios 🎶", fileName: "manisharma.json" },
        { displayName: "Mass_Radios 💥", fileName: "mass.json" },
        { displayName: "Mohan_Radios 🎤", fileName: "mohan.json" },
        { displayName: "Perumal_Songs 🕉️", fileName: "perumal.json" },
        { displayName: "Pongal_Specials 🎉", fileName: "pongal.json" },
        { displayName: "Prasanth_Radios 🎵", fileName: "prasanth.json" },
        { displayName: "Prithishaa_Radios 🌟", fileName: "prithishaa.json" },
        { displayName: "Rajini_Radios 👑", fileName: "rajini.json" },
        { displayName: "Ramarajan_Radios 🎤", fileName: "ramarajan.json" },
        { displayName: "SA_Rajkumar_Radios 🎭", fileName: "sarajkumar.json" },
        { displayName: "Sirpy_Radios 🎵", fileName: "sirpy.json" },
        { displayName: "SV_Sekar_Dramas 🎭", fileName: "svs.json" },
        { displayName: "Tamil_FM_Radios 🇮🇳", fileName: "tamilfm.json" },
        { displayName: "Tamil_TV_Channels 📺", fileName: "tamiltv.json" },
        { displayName: "Tamil_Talk_Radios 💬", fileName: "tamiltalk.json" },
        { displayName: "TMS_Murugan_Songs 🕉️", fileName: "tms.json" },
        { displayName: "TR_Hits_Radios 🔥", fileName: "trhits.json" },
        { displayName: "TV_Serials 🎵", fileName: "serials.json" },
        { displayName: "Unplugged_Radios 🎸", fileName: "unplugged.json" },
        { displayName: "Vikram_Radios 🦹", fileName: "vikram.json" },
        { displayName: "🏹 Mahabharat_Radios", fileName: "mahabharat.json" },
        { displayName: "▶️ YouTube", fileName: "youtube.json" },
        { displayName: "🇮🇳 India", fileName: "in.json" },
        { displayName: "🇮🇪 Ireland", fileName: "ie.json" }
    ];

    // ==================== State Management ====================
    const state = {
        categories: [],
        stations: [],
        allStations: [],
        globalStations: [],
        currentCategory: null,
        currentStation: null,
        audio: new Audio(),
        isPlaying: false,
        isShuffled: false,
        isLooped: false,
        isMuted: false,
        volume: 0.5,
        currentStationIndex: -1,
        searchQuery: '',
        isSearching: false,
        isGlobalSearch: false,
        showFavorites: false,
        favorites: [],
        history: [],
        historyIndex: -1,
        loadedCategories: new Set(),
        playCounts: {},
        categorySort: 'alpha',
        stationSort: 'alpha',
        categoriesWithFavorites: new Set()
    };

    // ==================== DOM Elements ====================
    const elements = {
        categoryList: document.getElementById('categoryList'),
        categoryCount: document.getElementById('categoryCount'),
        stationList: document.getElementById('stationList'),
        stationCount: document.getElementById('stationCount'),
        stationsTitle: document.getElementById('stationsTitle'),
        searchInput: document.getElementById('searchInput'),
        searchBtn: document.getElementById('searchBtn'),
        themeToggle: document.getElementById('themeToggle'),
        categorySortSelect: document.getElementById('categorySort'),
        stationSortSelect: document.getElementById('stationSort'),
        stationImage: document.getElementById('stationImage'),
        stationTitle: document.getElementById('stationTitle'),
        stationMeta: document.getElementById('stationMeta'),
        playPauseBtn: document.getElementById('playPauseBtn'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        shuffleBtn: document.getElementById('shuffleBtn'),
        loopBtn: document.getElementById('loopBtn'),
        favoriteBtn: document.getElementById('favoriteBtn'),
        volumeSlider: document.getElementById('volumeSlider'),
        volumeBtn: document.getElementById('volumeBtn'),
        progressBar: document.getElementById('progressBar'),
        progressFill: document.getElementById('progressFill'),
        favoritesBtn: document.getElementById('favoritesBtn'),
        audioPlayer: document.getElementById('audioPlayer'),
        loadingSkeleton: document.getElementById('loadingSkeleton')
    };

    // ==================== Utility Functions ====================
    function generateId(station) {
        return `${station.name}-${station.url || station.streamUrl}`.toLowerCase().replace(/\s+/g, '-');
    }

    function showLoadingSkeleton(count = 5) {
        elements.loadingSkeleton.classList.add('active');
        elements.loadingSkeleton.innerHTML = Array(count).fill('<div class="skeleton-item"></div>').join('');
        elements.stationList.classList.add('hidden');
    }

    function hideLoadingSkeleton() {
        elements.loadingSkeleton.classList.remove('active');
        elements.loadingSkeleton.innerHTML = '';
        elements.stationList.classList.remove('hidden');
    }

    function saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.warn('Storage not available:', e);
        }
    }

    function loadFromStorage(key, defaultValue = []) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.warn('Storage not available:', e);
            return defaultValue;
        }
    }

    // ==================== Sort Functions ====================
    function sortCategories(categories) {
        const sorted = [...categories];

        switch (state.categorySort) {
            case CONFIG.SORT_OPTIONS.FAVORITES:
                sorted.sort((a, b) => {
                    if (a.isGlobal) return -1;
                    if (b.isGlobal) return 1;
                    const aHasFav = state.categoriesWithFavorites.has(a.fileName);
                    const bHasFav = state.categoriesWithFavorites.has(b.fileName);
                    if (aHasFav && !bHasFav) return -1;
                    if (!aHasFav && bHasFav) return 1;
                    return a.name.localeCompare(b.name);
                });
                break;
            case CONFIG.SORT_OPTIONS.ALPHABETICAL:
            default:
                sorted.sort((a, b) => {
                    if (a.isGlobal) return -1;
                    if (b.isGlobal) return 1;
                    return a.name.localeCompare(b.name);
                });
                break;
        }

        return sorted;
    }

    function sortStations(stations) {
        const sorted = [...stations];

        switch (state.stationSort) {
            case CONFIG.SORT_OPTIONS.FAVORITES:
                sorted.sort((a, b) => {
                    const aIsFav = state.favorites.includes(generateId(a));
                    const bIsFav = state.favorites.includes(generateId(b));
                    if (aIsFav && !bIsFav) return -1;
                    if (!aIsFav && bIsFav) return 1;
                    return (a.name || '').localeCompare(b.name || '');
                });
                break;
            case CONFIG.SORT_OPTIONS.PLAY_COUNT:
                sorted.sort((a, b) => {
                    const aCount = state.playCounts[generateId(a)] || 0;
                    const bCount = state.playCounts[generateId(b)] || 0;
                    if (bCount !== aCount) return bCount - aCount;
                    return (a.name || '').localeCompare(b.name || '');
                });
                break;
            case CONFIG.SORT_OPTIONS.ALPHABETICAL:
            default:
                sorted.sort((a, b) => {
                    return (a.name || '').localeCompare(b.name || '');
                });
                break;
        }

        return sorted;
    }

    function changeCategorySort(sortBy) {
        state.categorySort = sortBy;
        saveToStorage(CONFIG.STORAGE_KEYS.CATEGORY_SORT, sortBy);
        state.categories = sortCategories(state.categories);
        renderCategories();
    }

    function changeStationSort(sortBy) {
        state.stationSort = sortBy;
        saveToStorage(CONFIG.STORAGE_KEYS.STATION_SORT, sortBy);
        state.stations = sortStations(state.stations);
        state.allStations = sortStations(state.allStations);
        renderStations();
    }

    // ==================== Play Count Functions ====================
    function incrementPlayCount(station) {
        const id = generateId(station);
        state.playCounts[id] = (state.playCounts[id] || 0) + 1;
        saveToStorage(CONFIG.STORAGE_KEYS.PLAY_COUNTS, state.playCounts);
    }

    function getPlayCount(station) {
        return state.playCounts[generateId(station)] || 0;
    }

    // ==================== Category Functions ====================
    function parseCategories() {
        const allStationsCategory = {
            name: 'All Stations',
            fileName: null,
            displayName: '🌍 All Stations',
            emoji: '🌍',
            isGlobal: true
        };

        const categories = CATEGORIES.map(cat => {
            const parts = cat.displayName.split(' ');
            const emoji = parts[parts.length - 1];
            const name = parts.slice(0, -1).join(' ') || cat.displayName;

            return {
                name,
                fileName: cat.fileName,
                displayName: cat.displayName,
                emoji,
                isGlobal: false
            };
        });

        const unsortedCategories = [allStationsCategory, ...categories];
        return sortCategories(unsortedCategories);
    }

    function renderCategories() {
        elements.categoryList.innerHTML = '';

        state.categories.forEach(category => {
            const li = document.createElement('li');
            li.className = 'category-item';
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', state.currentCategory?.name === category.name);

            if (state.currentCategory?.name === category.name) {
                li.classList.add('active');
            }

            if (category.emoji) {
                const emojiSpan = document.createElement('span');
                emojiSpan.className = 'category-emoji';
                emojiSpan.textContent = category.emoji;
                li.appendChild(emojiSpan);
            }

            const nameSpan = document.createElement('span');
            nameSpan.textContent = category.name;
            li.appendChild(nameSpan);

            // Show favorite indicator
            if (category.fileName && state.categoriesWithFavorites.has(category.fileName)) {
                const favIndicator = document.createElement('span');
                favIndicator.innerHTML = ' ❤️';
                favIndicator.style.color = 'var(--danger-color)';
                nameSpan.appendChild(favIndicator);
            }

            li.addEventListener('click', () => selectCategory(category));
            li.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectCategory(category);
                }
            });

            elements.categoryList.appendChild(li);
        });

        elements.categoryCount.textContent = state.categories.length;
    }

    async function selectCategory(category) {
        state.currentCategory = category;
        state.currentStation = null;
        state.currentStationIndex = -1;
        state.isSearching = false;
        state.searchQuery = '';
        state.showFavorites = false;
        state.isGlobalSearch = category.isGlobal;
        elements.searchInput.value = '';

        renderCategories();

        if (category.isGlobal) {
            await loadAllCategories();
        } else {
            showLoadingSkeleton();

            try {
                const response = await fetch(`${CONFIG.BASE_URL}${category.fileName}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                const stations = Array.isArray(data) ? data : (data.stations || []);
                state.stations = sortStations(stations);
                state.allStations = [...state.stations];
                state.loadedCategories.add(category.fileName);

                resetPlayer();
                renderStations();
                updateStationCount();
            } catch (error) {
                console.error(`Error loading stations for ${category.name}:`, error);
                elements.stationList.innerHTML = '<li class="error">Failed to load stations. Please try again.</li>';
                elements.stationCount.textContent = 'Error loading stations';
            } finally {
                hideLoadingSkeleton();
            }
        }
    }

    async function loadAllCategories() {
        showLoadingSkeleton();

        try {
            const loadPromises = state.categories
                .filter(cat => !cat.isGlobal)
                .map(async (cat) => {
                    try {
                        const response = await fetch(`${CONFIG.BASE_URL}${cat.fileName}`);
                        if (!response.ok) return [];
                        const data = await response.json();
                        const stations = Array.isArray(data) ? data : (data.stations || []);
                        return stations.map(s => ({ ...s, _category: cat.displayName, _fileName: cat.fileName }));
                    } catch (error) {
                        console.error(`Error loading ${cat.fileName}:`, error);
                        return [];
                    }
                });

            const results = await Promise.all(loadPromises);
            const allStations = results.flat();

            state.globalStations = sortStations(allStations);
            state.stations = [...state.globalStations];
            state.allStations = [...state.stations];

            // Update categories with favorites
            updateCategoriesWithFavorites();

            resetPlayer();
            renderStations();
            updateStationCount();
        } catch (error) {
            console.error('Error loading all categories:', error);
            elements.stationList.innerHTML = '<li class="error">Failed to load stations.</li>';
            elements.stationCount.textContent = 'Error loading stations';
        } finally {
            hideLoadingSkeleton();
        }
    }

    function updateCategoriesWithFavorites() {
        state.categoriesWithFavorites = new Set();
        state.favorites.forEach(favId => {
            // Check if any loaded station in a category is a favorite
            state.globalStations.forEach(station => {
                if (generateId(station) === favId && station._fileName) {
                    state.categoriesWithFavorites.add(station._fileName);
                }
            });
        });
    }

    // ==================== Station Functions ====================
    function renderStations() {
        elements.stationList.innerHTML = '';

        let stationsToRender = state.stations;

        if (state.showFavorites) {
            stationsToRender = state.stations.filter(s =>
                state.favorites.includes(generateId(s))
            );
        }

        if (stationsToRender.length === 0) {
            if (state.showFavorites) {
                elements.stationList.innerHTML = '<li class="no-results">No favorite stations yet. Add some from the list!</li>';
            } else if (state.isSearching) {
                elements.stationList.innerHTML = '<li class="no-results">No stations found for your search</li>';
            } else {
                elements.stationList.innerHTML = '<li class="error">No stations available</li>';
            }
            return;
        }

        stationsToRender.forEach((station, index) => {
            const actualIndex = state.stations.indexOf(station);
            const li = document.createElement('li');
            li.className = 'station-item';
            li.setAttribute('role', 'option');
            li.setAttribute('tabindex', '0');

            if (state.currentStation && state.currentStation.name === station.name) {
                li.classList.add('active');
                if (state.isPlaying) {
                    li.classList.add('playing');
                }
            }

            const stationInfo = document.createElement('div');
            stationInfo.className = 'station-info';

            const nameDiv = document.createElement('div');
            nameDiv.className = 'station-name';

            if (state.isSearching && state.searchQuery) {
                nameDiv.innerHTML = highlightSearchTerms(station.name, state.searchQuery);
            } else {
                nameDiv.textContent = station.name || 'Unknown Station';
            }

            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'station-tags';

            const tags = [];
            if (station.genre) tags.push(station.genre);
            if (station.language) tags.push(station.language);
            if (station.country) tags.push(station.country);
            if (station._category && state.isGlobalSearch) tags.push(station._category);

            // Add play count if sorting by play count
            if (state.stationSort === CONFIG.SORT_OPTIONS.PLAY_COUNT) {
                const playCount = getPlayCount(station);
                if (playCount > 0) {
                    tags.push(`🔊 ${playCount}`);
                }
            }

            if (state.isSearching && state.searchQuery) {
                tagsDiv.innerHTML = tags.map(tag => highlightSearchTerms(tag, state.searchQuery)).join(' • ');
            } else {
                tagsDiv.textContent = tags.join(' • ');
            }

            stationInfo.appendChild(nameDiv);
            stationInfo.appendChild(tagsDiv);

            const stationActions = document.createElement('div');
            stationActions.className = 'station-actions';

            const isFavorite = state.favorites.includes(generateId(station));
            const favBtn = document.createElement('button');
            favBtn.className = `station-action-btn favorite-toggle ${isFavorite ? 'favorited' : ''}`;
            favBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>`;
            favBtn.setAttribute('aria-label', isFavorite ? 'Remove from favorites' : 'Add to favorites');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(station);
            });

            stationActions.appendChild(favBtn);

            li.appendChild(stationInfo);
            li.appendChild(stationActions);

            li.addEventListener('click', () => selectStation(actualIndex));
            li.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectStation(actualIndex);
                }
            });

            elements.stationList.appendChild(li);
        });
    }

    function highlightSearchTerms(text, query) {
        if (!text || !query) return text;

        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function updateStationCount() {
        if (state.showFavorites) {
            const favCount = state.stations.filter(s => state.favorites.includes(generateId(s))).length;
            elements.stationCount.textContent = `${favCount} favorites`;
        } else if (state.isSearching) {
            elements.stationCount.textContent = `${state.stations.length} of ${state.isGlobalSearch ? state.globalStations.length : state.allStations.length} stations`;
        } else if (state.isGlobalSearch) {
            elements.stationCount.textContent = `${state.stations.length} stations from all categories`;
        } else {
            elements.stationCount.textContent = `${state.stations.length} stations`;
        }
    }

    // ==================== Search Functions ====================
    function performSearch(query) {
        state.searchQuery = query.trim();
        state.isSearching = state.searchQuery.length > 0;

        if (!state.isSearching) {
            if (state.isGlobalSearch) {
                state.stations = [...state.globalStations];
            } else {
                state.stations = [...state.allStations];
            }
        } else {
            const stationsToSearch = state.isGlobalSearch ? state.globalStations : state.allStations;

            // Use Fuse.js for fuzzy search
            const fuse = new Fuse(stationsToSearch, {
                keys: ['name', 'genre', 'language', 'country', '_category'],
                threshold: 0.3,
                includeScore: true,
                includeMatches: true,
                minMatchCharLength: 2
            });

            const results = fuse.search(state.searchQuery);
            state.stations = results.map(result => result.item);
        }

        renderStations();
        updateStationCount();
    }

    // ==================== Favorite Functions ====================
    function toggleFavorite(station) {
        const id = generateId(station);
        const index = state.favorites.indexOf(id);

        if (index === -1) {
            state.favorites.push(id);
        } else {
            state.favorites.splice(index, 1);
        }

        saveToStorage(CONFIG.STORAGE_KEYS.FAVORITES, state.favorites);

        // Update categories with favorites
        updateCategoriesWithFavorites();
        if (state.isGlobalSearch) {
            state.categories = sortCategories(state.categories);
            renderCategories();
        }

        renderStations();

        if (state.currentStation && generateId(state.currentStation) === id) {
            updateFavoriteButton();
        }
    }

    function isFavorite(station) {
        return state.favorites.includes(generateId(station));
    }

    function updateFavoriteButton() {
        const isFav = state.currentStation && isFavorite(state.currentStation);
        elements.favoriteBtn.classList.toggle('active', isFav);
        elements.favoriteBtn.setAttribute('aria-label', isFav ? 'Remove from favorites' : 'Add to favorites');
    }

    function showFavorites() {
        state.showFavorites = !state.showFavorites;
        elements.favoritesBtn.classList.toggle('active', state.showFavorites);

        if (state.showFavorites) {
            elements.stationsTitle.textContent = 'Favorites';
        } else {
            elements.stationsTitle.textContent = state.currentCategory ? state.currentCategory.name : 'Stations';
        }

        renderStations();
        updateStationCount();
    }

    // ==================== History Functions ====================
    function addToHistory(station) {
        const id = generateId(station);

        state.history = state.history.filter(s => generateId(s) !== id);
        state.history.unshift(station);

        if (state.history.length > CONFIG.MAX_HISTORY) {
            state.history = state.history.slice(0, CONFIG.MAX_HISTORY);
        }

        saveToStorage(CONFIG.STORAGE_KEYS.HISTORY, state.history);
    }

    // ==================== Playback Functions ====================
    function selectStation(index) {
        if (index < 0 || index >= state.stations.length) return;

        state.currentStationIndex = index;
        state.currentStation = state.stations[index];

        renderStations();
        updatePlayerUI();
        updateFavoriteButton();

        playStation();
        addToHistory(state.currentStation);
    }

    function playStation() {
        if (!state.currentStation) return;

        incrementPlayCount(state.currentStation);

        state.audio.pause();

        const streamUrl = state.currentStation.streamUrl || state.currentStation.url;
        if (!streamUrl) {
            console.error('No stream URL available for this station');
            return;
        }

        state.audio.src = streamUrl;
        state.audio.volume = state.isMuted ? 0 : state.volume;

        state.audio.play()
            .then(() => {
                state.isPlaying = true;
                updatePlayPauseButton();
                updateMediaSession();
                saveToStorage(CONFIG.STORAGE_KEYS.LAST_PLAYED, {
                    station: state.currentStation,
                    category: state.currentCategory
                });
            })
            .catch(error => {
                console.error('Error playing station:', error);
                state.isPlaying = false;
                updatePlayPauseButton();

                setTimeout(() => {
                    if (state.stations.length > 1) {
                        playNext();
                    }
                }, 2000);
            });
    }

    function pauseStation() {
        state.audio.pause();
        state.isPlaying = false;
        updatePlayPauseButton();
    }

    function playNext() {
        if (state.stations.length === 0) return;

        let nextIndex;
        if (state.isShuffled) {
            nextIndex = Math.floor(Math.random() * state.stations.length);
        } else {
            nextIndex = (state.currentStationIndex + 1) % state.stations.length;
        }

        selectStation(nextIndex);
    }

    function playPrevious() {
        if (state.stations.length === 0) return;

        if (state.audio.currentTime > 3) {
            state.audio.currentTime = 0;
            return;
        }

        let prevIndex;
        if (state.isShuffled) {
            prevIndex = Math.floor(Math.random() * state.stations.length);
        } else {
            prevIndex = state.currentStationIndex - 1;
            if (prevIndex < 0) prevIndex = state.stations.length - 1;
        }

        selectStation(prevIndex);
    }

    function toggleShuffle() {
        state.isShuffled = !state.isShuffled;
        elements.shuffleBtn.classList.toggle('active', state.isShuffled);
    }

    function toggleLoop() {
        state.isLooped = !state.isLooped;
        state.audio.loop = state.isLooped;
        elements.loopBtn.classList.toggle('active', state.isLooped);
    }

    function updateVolume() {
        state.volume = parseFloat(elements.volumeSlider.value) / 100;
        state.audio.volume = state.isMuted ? 0 : state.volume;
        saveToStorage(CONFIG.STORAGE_KEYS.VOLUME, state.volume);
    }

    function toggleMute() {
        state.isMuted = !state.isMuted;
        state.audio.volume = state.isMuted ? 0 : state.volume;

        const highIcon = elements.volumeBtn.querySelector('.icon-volume-high');
        const mutedIcon = elements.volumeBtn.querySelector('.icon-volume-muted');

        highIcon.style.display = state.isMuted ? 'none' : 'block';
        mutedIcon.style.display = state.isMuted ? 'block' : 'none';

        elements.volumeBtn.setAttribute('aria-label', state.isMuted ? 'Unmute' : 'Mute');
    }

    function seek(e) {
        const rect = elements.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        state.audio.currentTime = percent * state.audio.duration;
    }

    // ==================== UI Updates ====================
    function resetPlayer() {
        state.audio.pause();
        state.isPlaying = false;
        state.currentStation = null;
        state.currentStationIndex = -1;

        elements.stationImage.innerHTML = '<div class="placeholder-icon">📻</div>';
        elements.stationTitle.textContent = 'No station selected';
        elements.stationMeta.textContent = 'Select a station to start listening';

        updatePlayPauseButton();
    }

    function updatePlayerUI() {
        if (!state.currentStation) return;

        elements.stationTitle.textContent = state.currentStation.name || 'Unknown Station';
        elements.stationMeta.textContent = state.currentCategory ? state.currentCategory.displayName : 'Unknown Category';

        if (state.currentStation.favicon || state.currentStation.logo) {
            elements.stationImage.innerHTML = '';
            const img = document.createElement('img');
            img.src = state.currentStation.favicon || state.currentStation.logo;
            img.alt = state.currentStation.name;
            img.loading = 'lazy';
            img.onerror = () => {
                elements.stationImage.innerHTML = '<div class="placeholder-icon">📻</div>';
            };
            elements.stationImage.appendChild(img);
        } else {
            elements.stationImage.innerHTML = '<div class="placeholder-icon">📻</div>';
        }

        updatePlayPauseButton();
    }

    function updatePlayPauseButton() {
        const playIcon = elements.playPauseBtn.querySelector('.icon-play');
        const pauseIcon = elements.playPauseBtn.querySelector('.icon-pause');

        if (state.isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            elements.playPauseBtn.setAttribute('aria-label', 'Pause');
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            elements.playPauseBtn.setAttribute('aria-label', 'Play');
        }
    }

    // ==================== Theme Functions ====================
    function initTheme() {
        const savedTheme = loadFromStorage(CONFIG.STORAGE_KEYS.THEME, 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        saveToStorage(CONFIG.STORAGE_KEYS.THEME, newTheme);
    }

    // ==================== Media Session API ====================
    function updateMediaSession() {
        if ('mediaSession' in navigator && state.currentStation) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: state.currentStation.name,
                artist: state.currentCategory?.name || 'SrivyaRadio',
                artwork: state.currentStation.favicon ? [
                    { src: state.currentStation.favicon, sizes: '96x96', type: 'image/png' },
                    { src: state.currentStation.favicon, sizes: '128x128', type: 'image/png' },
                    { src: state.currentStation.favicon, sizes: '192x192', type: 'image/png' },
                    { src: state.currentStation.favicon, sizes: '256x256', type: 'image/png' }
                ] : []
            });

            navigator.mediaSession.setActionHandler('play', playStation);
            navigator.mediaSession.setActionHandler('pause', pauseStation);
            navigator.mediaSession.setActionHandler('previoustrack', playPrevious);
            navigator.mediaSession.setActionHandler('nexttrack', playNext);
        }
    }

    // ==================== Keyboard Shortcuts ====================
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;

            switch (e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    if (state.currentStation) {
                        state.isPlaying ? pauseStation() : playStation();
                    }
                    break;
                case 'arrowright':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        playNext();
                    }
                    break;
                case 'arrowleft':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        playPrevious();
                    }
                    break;
                case 's':
                    e.preventDefault();
                    elements.searchInput.focus();
                    break;
                case 'f':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        showFavorites();
                    }
                    break;
                case 'd':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        toggleTheme();
                    }
                    break;
                case 'm':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        toggleMute();
                    }
                    break;
                case 'l':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        toggleLoop();
                    }
                    break;
                case 'h':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        toggleShuffle();
                    }
                    break;
            }
        });
    }

    // ==================== Service Worker Registration ====================
    function initServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('service-worker.js')
                    .then(reg => console.log('Service Worker registered:', reg.scope))
                    .catch(err => console.error('Service Worker registration failed:', err));
            });
        }
    }

    // ==================== Event Listeners ====================
    function setupEventListeners() {
        elements.playPauseBtn.addEventListener('click', () => {
            if (!state.currentStation) return;
            state.isPlaying ? pauseStation() : playStation();
        });

        elements.prevBtn.addEventListener('click', playPrevious);
        elements.nextBtn.addEventListener('click', playNext);
        elements.shuffleBtn.addEventListener('click', toggleShuffle);
        elements.loopBtn.addEventListener('click', toggleLoop);
        elements.favoriteBtn.addEventListener('click', () => {
            if (state.currentStation) {
                toggleFavorite(state.currentStation);
            }
        });

        elements.volumeSlider.addEventListener('input', updateVolume);
        elements.volumeBtn.addEventListener('click', toggleMute);
        elements.progressBar.addEventListener('click', seek);

        elements.searchBtn.addEventListener('click', () => performSearch(elements.searchInput.value));
        elements.searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                performSearch(elements.searchInput.value);
            }
        });

        let searchTimeout;
        elements.searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(elements.searchInput.value);
            }, CONFIG.SEARCH_DEBOUNCE);
        });

        elements.favoritesBtn.addEventListener('click', showFavorites);
        elements.themeToggle.addEventListener('click', toggleTheme);

        // Sort listeners
        if (elements.categorySortSelect) {
            elements.categorySortSelect.addEventListener('change', (e) => {
                changeCategorySort(e.target.value);
            });
        }

        if (elements.stationSortSelect) {
            elements.stationSortSelect.addEventListener('change', (e) => {
                changeStationSort(e.target.value);
            });
        }

        state.audio.addEventListener('ended', () => {
            if (state.isLooped && state.currentStation) {
                playStation();
            } else {
                playNext();
            }
        });

        state.audio.addEventListener('error', () => {
            console.error('Audio playback error');
            state.isPlaying = false;
            updatePlayPauseButton();
        });

        state.audio.addEventListener('play', () => {
            state.isPlaying = true;
            updatePlayPauseButton();
        });

        state.audio.addEventListener('pause', () => {
            state.isPlaying = false;
            updatePlayPauseButton();
        });

        document.addEventListener('play', (e) => {
            if (e.target !== state.audio) {
                const players = document.querySelectorAll('audio, video');
                players.forEach(player => {
                    if (player !== e.target && !player.paused && !player.ended) {
                        player.pause();
                    }
                });
            }
        }, true);

        state.audio.addEventListener('play', () => {
            const otherAudio = document.querySelectorAll('audio:not(#audioPlayer)');
            otherAudio.forEach(audio => {
                if (audio !== state.audio && !audio.paused) {
                    audio.pause();
                }
            });
        });
    }

    // ==================== Initialization ====================
    async function init() {
        state.favorites = loadFromStorage(CONFIG.STORAGE_KEYS.FAVORITES, []);
        state.history = loadFromStorage(CONFIG.STORAGE_KEYS.HISTORY, []);
        state.volume = loadFromStorage(CONFIG.STORAGE_KEYS.VOLUME, 0.5);
        state.playCounts = loadFromStorage(CONFIG.STORAGE_KEYS.PLAY_COUNTS, {});
        state.categorySort = loadFromStorage(CONFIG.STORAGE_KEYS.CATEGORY_SORT, CONFIG.SORT_OPTIONS.ALPHABETICAL);
        state.stationSort = loadFromStorage(CONFIG.STORAGE_KEYS.STATION_SORT, CONFIG.SORT_OPTIONS.ALPHABETICAL);

        if (elements.categorySortSelect) {
            elements.categorySortSelect.value = state.categorySort;
        }
        if (elements.stationSortSelect) {
            elements.stationSortSelect.value = state.stationSort;
        }

        elements.volumeSlider.value = state.volume * 100;
        state.audio.volume = state.volume;

        initTheme();

        state.categories = parseCategories();
        renderCategories();

        setupEventListeners();
        initKeyboardShortcuts();
        initServiceWorker();

        const lastPlayed = loadFromStorage(CONFIG.STORAGE_KEYS.LAST_PLAYED);
        if (lastPlayed && lastPlayed.station) {
            console.log('Last played:', lastPlayed.station.name);
        }

        if (state.categories.length > 0) {
            selectCategory(state.categories[0]);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
