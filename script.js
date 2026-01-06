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
            LANGUAGE: 'srivya_language',
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

    // ==================== Translations ====================
    const TRANSLATIONS = {
        en: {
            // Header
            headerDescription: 'Browse and listen to radio stations from around the world',

            // Categories
            categoriesTitle: 'Categories',
            sortCategoryLabel: 'Sort:',

            // Stations
            stationsTitle: 'Stations',
            stationCountSelect: 'Select a category',
            stationCountFavorites: 'favorites',
            stationCountSearching: 'of stations',
            stationCountAll: 'stations from all categories',
            stationCount: 'stations',
            noFavorites: 'No favorite stations yet. Add some from the list!',
            noResults: 'No stations found for your search',
            noStations: 'No stations available',

            // Player
            noStationSelected: 'No station selected',
            selectStation: 'Select a station to start listening',

            // Footer
            footerText: 'Radio data sourced from',

            // Search
            searchPlaceholder: 'Search stations...',

            // Sort options
            sortAZ: 'A-Z',
            sortFavorites: '❤️ Favorites',
            sortMostPlayed: '🔊 Most Played',

            // Station info
            unknownStation: 'Unknown Station',
            unknownCategory: 'Unknown Category',
            selectCategory: 'Select a category',

            // Accessibility
            ariaPlay: 'Play',
            ariaPause: 'Pause',
            ariaPrevious: 'Previous',
            ariaNext: 'Next',
            ariaShuffle: 'Shuffle',
            ariaLoop: 'Loop',
            ariaAddFavorites: 'Add to favorites',
            ariaRemoveFavorites: 'Remove from favorites',
            ariaSearch: 'Search',
            ariaToggleDarkMode: 'Toggle dark mode',
            ariaVolume: 'Volume',
            ariaMute: 'Mute',
            ariaUnmute: 'Unmute',
            ariaShowFavorites: 'Show favorites',
            ariaRadioCategories: 'Radio categories',
            ariaRadioStations: 'Radio stations',
            ariaSelectLanguage: 'Select language'
        },
        ta: {
            // Header
            headerDescription: 'உலகம் முழுவதிலிருந்தும் வானொலி நிலையங்களை உலாவி கேளுங்கள்',

            // Categories
            categoriesTitle: 'பகுப்புகள்',
            sortCategoryLabel: 'வரிசை:',

            // Stations
            stationsTitle: 'நிலையங்கள்',
            stationCountSelect: 'ஒரு பகுப்பைத் தேர்ந்தெடுக்கவும்',
            stationCountFavorites: 'பிடித்தவை',
            stationCountSearching: 'நிலையங்களில்',
            stationCountAll: 'எல்லா பகுப்புகளிலிருந்தும் நிலையங்கள்',
            stationCount: 'நிலையங்கள்',
            noFavorites: 'இன்னும் எந்த பிடித்த நிலையங்களும் இல்லை. பட்டியலிலிருந்து சேர்க்கவும்!',
            noResults: 'உங்கள் தேடலுக்கு எந்த நிலையங்களும் கிடைக்கவில்லை',
            noStations: 'எந்த நிலையங்களும் இல்லை',

            // Player
            noStationSelected: 'நிலையம் தேர்ந்தெடுக்கப்படவில்லை',
            selectStation: 'கேட்க ஒரு நிலையத்தைத் தேர்ந்தெடுக்கவும்',

            // Footer
            footerText: 'வானொலி தரவு இங்கிருந்து பெறப்பட்டது',

            // Search
            searchPlaceholder: 'நிலையங்களைத் தேடு...',

            // Sort options
            sortAZ: 'அ-ஆ',
            sortFavorites: '❤️ பிடித்தவை',
            sortMostPlayed: '🔊 அதிகம் கேட்கப்பட்டவை',

            // Station info
            unknownStation: 'தெரியாத நிலையம்',
            unknownCategory: 'தெரியாத பகுப்பு',
            selectCategory: 'ஒரு பகுப்பைத் தேர்ந்தெடுக்கவும்',

            // Accessibility
            ariaPlay: 'இசைக்க',
            ariaPause: 'நிறுத்து',
            ariaPrevious: 'முந்தைய',
            ariaNext: 'அடுத்த',
            ariaShuffle: 'கலக்கு',
            ariaLoop: 'மீண்டும்',
            ariaAddFavorites: 'பிடித்தவைக்கு சேர்',
            ariaRemoveFavorites: 'பிடித்தவைகளிலிருந்து நீக்கு',
            ariaSearch: 'தேடு',
            ariaToggleDarkMode: 'இருள் பயன்முறையை மாற்று',
            ariaVolume: 'ஒலியளவு',
            ariaMute: 'ஒலியை நிறுத்து',
            ariaUnmute: 'ஒலியை இயக்கு',
            ariaShowFavorites: 'பிடித்தவைகளைக் காட்டு',
            ariaRadioCategories: 'வானொலி பகுப்புகள்',
            ariaRadioStations: 'வானொலி நிலையங்கள்',
            ariaSelectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்'
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
        categoriesWithFavorites: new Set(),
        currentLanguage: 'en',
        visualizerEnabled: false,
        audioContext: null,
        analyser: null,
        dataArray: null,
        source: null,
        animationId: null
    };

    // ==================== DOM Elements ====================
    const elements = {
        categoryList: document.getElementById('categoryList'),
        categoryDropdown: document.getElementById('categoryDropdown'),
        categoryCount: document.getElementById('categoryCount'),
        stationList: document.getElementById('stationList'),
        stationCount: document.getElementById('stationCount'),
        stationsTitle: document.getElementById('stationsTitle'),
        searchInput: document.getElementById('searchInput'),
        searchBtn: document.getElementById('searchBtn'),
        themeToggle: document.getElementById('themeToggle'),
        categorySortSelect: document.getElementById('categorySort'),
        stationSortSelect: document.getElementById('stationSort'),
        languageSelect: document.getElementById('languageSelect'),
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
        seekbarContainer: document.getElementById('seekbarContainer'),
        seekbar: document.getElementById('seekbar'),
        seekbarProgress: document.getElementById('seekbarProgress'),
        seekbarThumb: document.getElementById('seekbarThumb'),
        currentTimeEl: document.getElementById('currentTime'),
        durationEl: document.getElementById('duration'),
        favoritesBtn: document.getElementById('favoritesBtn'),
        audioPlayer: document.getElementById('audioPlayer'),
        loadingSkeleton: document.getElementById('loadingSkeleton'),
        headerDescription: document.getElementById('headerDescription'),
        categoriesTitle: document.getElementById('categoriesTitle'),
        sortCategoryLabel: document.getElementById('sortCategoryLabel'),
        footerText: document.getElementById('footerText'),
        favoritesAccordion: document.getElementById('favoritesAccordion'),
        favoritesHeader: document.getElementById('favoritesHeader'),
        favoritesToggle: document.getElementById('favoritesToggle'),
        favoritesContent: document.getElementById('favoritesContent'),
        favoritesCount: document.getElementById('favoritesCount'),
        favoritesTitle: document.getElementById('favoritesTitle'),
        visualizerOverlay: document.getElementById('visualizerOverlay'),
        visualizerCanvas: document.getElementById('visualizerCanvas'),
        visualizerToggleBtn: document.getElementById('visualizerToggleBtn'),
        visualizerStyle: document.getElementById('visualizerStyle'),
        visualizerCloseBtn: document.getElementById('visualizerCloseBtn')
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

    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // ==================== Language Functions ====================
    function t(key) {
        const translations = TRANSLATIONS[state.currentLanguage] || TRANSLATIONS.en;
        return translations[key] || key;
    }

    function changeLanguage(lang) {
        if (!TRANSLATIONS[lang]) {
            console.warn(`Language '${lang}' not supported, falling back to English`);
            lang = 'en';
        }

        state.currentLanguage = lang;
        saveToStorage(CONFIG.STORAGE_KEYS.LANGUAGE, lang);
        applyTranslations();
    }

    function applyTranslations() {
        // Header
        elements.headerDescription.textContent = t('headerDescription');
        elements.categoriesTitle.textContent = t('categoriesTitle');
        elements.sortCategoryLabel.textContent = t('sortCategoryLabel');

        // Stations title
        elements.stationsTitle.textContent = t('stationsTitle');

        // Search placeholder
        elements.searchInput.placeholder = t('searchPlaceholder');

        // Player
        if (!state.currentStation) {
            elements.stationTitle.textContent = t('noStationSelected');
            elements.stationMeta.textContent = t('selectStation');
        }

        // Footer
        elements.footerText.innerHTML = `${t('footerText')} <a href="https://github.com/Srivyaa/RadioStations" target="_blank" rel="noopener">Srivyaa/RadioStations</a>`;

        // Sort options
        if (elements.categorySortSelect) {
            elements.categorySortSelect.options[0].text = t('sortAZ');
            elements.categorySortSelect.options[1].text = t('sortFavorites');
        }
        if (elements.stationSortSelect) {
            elements.stationSortSelect.options[0].text = t('sortAZ');
            elements.stationSortSelect.options[1].text = t('sortFavorites');
            elements.stationSortSelect.options[2].text = t('sortMostPlayed');
        }

        // Update station count text
        updateStationCount();

        // Update accessibility labels
        elements.playPauseBtn.setAttribute('aria-label', t(state.isPlaying ? 'ariaPause' : 'ariaPlay'));
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
        elements.categoryDropdown.innerHTML = '';

        state.categories.forEach(category => {
            // Render list item
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

            // Render dropdown option
            const option = document.createElement('option');
            option.value = category.fileName || 'all';
            option.textContent = category.displayName;
            if (state.currentCategory?.name === category.name) {
                option.selected = true;
            }
            elements.categoryDropdown.appendChild(option);
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
                elements.stationList.innerHTML = `<li class="error">${t('noStations')}</li>`;
                elements.stationCount.textContent = t('noStations');
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
            renderFavorites(); // Update favorites accordion
            updateStationCount();
        } catch (error) {
            console.error('Error loading all categories:', error);
            elements.stationList.innerHTML = `<li class="error">${t('noStations')}</li>`;
            elements.stationCount.textContent = t('noStations');
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
                elements.stationList.innerHTML = `<li class="no-results">${t('noFavorites')}</li>`;
            } else if (state.isSearching) {
                elements.stationList.innerHTML = `<li class="no-results">${t('noResults')}</li>`;
            } else {
                elements.stationList.innerHTML = `<li class="error">${t('noStations')}</li>`;
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
                nameDiv.textContent = station.name || t('unknownStation');
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
            favBtn.setAttribute('aria-label', isFavorite ? t('ariaRemoveFavorites') : t('ariaAddFavorites'));
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
            elements.stationCount.textContent = `${favCount} ${t('stationCountFavorites')}`;
        } else if (state.isSearching) {
            elements.stationCount.textContent = `${state.stations.length} ${t('stationCountSearching')} ${state.isGlobalSearch ? state.globalStations.length : state.allStations.length} ${t('stationCount')}`;
        } else if (state.isGlobalSearch) {
            elements.stationCount.textContent = `${state.stations.length} ${t('stationCountAll')}`;
        } else {
            elements.stationCount.textContent = `${state.stations.length} ${t('stationCount')}`;
        }
    }

    // ==================== Search Functions ====================
    async function performSearch(query) {
        state.searchQuery = query.trim();
        state.isSearching = state.searchQuery.length > 0;

        if (!state.isSearching) {
            if (state.isGlobalSearch) {
                state.stations = [...state.globalStations];
            } else {
                state.stations = [...state.allStations];
            }
        } else {
            // Always search globally across all stations when searching
            await loadAllCategoriesForSearch();

            // Use Fuse.js for fuzzy search
            const fuse = new Fuse(state.globalStations, {
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

    async function loadAllCategoriesForSearch() {
        // Load all categories if not already loaded
        if (state.globalStations.length === 0 || state.loadedCategories.size < state.categories.length - 1) {
            try {
                const loadPromises = state.categories
                    .filter(cat => !cat.isGlobal)
                    .map(async (cat) => {
                        if (state.loadedCategories.has(cat.fileName)) {
                            // Return stations from globalStations that belong to this category
                            return state.globalStations.filter(s => s._fileName === cat.fileName);
                        }
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
                state.allStations = [...state.stations]; // Keep current category stations

                // Update categories with favorites
                updateCategoriesWithFavorites();
            } catch (error) {
                console.error('Error loading all categories for search:', error);
            }
        }
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
        renderFavorites();

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
        elements.favoriteBtn.setAttribute('aria-label', isFav ? t('ariaRemoveFavorites') : t('ariaAddFavorites'));
    }

    function showFavorites() {
        state.showFavorites = !state.showFavorites;
        elements.favoritesBtn.classList.toggle('active', state.showFavorites);

        if (state.showFavorites) {
            elements.stationsTitle.textContent = t('sortFavorites').replace('❤️ ', '');
        } else {
            elements.stationsTitle.textContent = state.currentCategory ? state.currentCategory.name : t('stationsTitle');
        }

        renderStations();
        updateStationCount();
    }

    // ==================== Favorites Accordion Functions ====================
    function renderFavorites() {
        const allFavStations = getAllFavoriteStations();

        // Hide accordion if no favorites
        if (allFavStations.length === 0) {
            elements.favoritesAccordion.classList.add('hidden');
            return;
        }

        elements.favoritesAccordion.classList.remove('hidden');

        // Update count
        elements.favoritesCount.textContent = allFavStations.length;

        // Clear content
        elements.favoritesContent.innerHTML = '';

        // Group favorites by category
        const favoritesByCategory = {};
        allFavStations.forEach(station => {
            const category = station._category || 'Unknown';
            if (!favoritesByCategory[category]) {
                favoritesByCategory[category] = [];
            }
            favoritesByCategory[category].push(station);
        });

        // Render grouped favorites
        Object.keys(favoritesByCategory).forEach(category => {
            const categoryStations = favoritesByCategory[category];

            // Create category section
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'favorites-category';
            categoryDiv.style.marginBottom = '0.5rem';

            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'favorites-category-header';
            categoryHeader.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--bg-secondary); border-radius: var(--radius-sm); cursor: pointer;';
            categoryHeader.innerHTML = `<span style="font-size: 0.85rem; font-weight: 600;">${category}</span><span style="font-size: 0.75rem; color: var(--text-secondary);">${categoryStations.length} stations</span>`;

            const categoryContent = document.createElement('div');
            categoryContent.className = 'favorites-category-content';
            categoryContent.style.cssText = 'display: block; padding: 0.25rem 0;';

            // Initially expand if few categories
            const isExpanded = Object.keys(favoritesByCategory).length <= 3;
            categoryContent.style.display = isExpanded ? 'block' : 'none';

            // Toggle on header click
            categoryHeader.addEventListener('click', () => {
                categoryContent.style.display = categoryContent.style.display === 'none' ? 'block' : 'none';
            });

            categoryStations.forEach(station => {
                const item = createFavoriteStationItem(station);
                categoryContent.appendChild(item);
            });

            categoryDiv.appendChild(categoryHeader);
            categoryDiv.appendChild(categoryContent);
            elements.favoritesContent.appendChild(categoryDiv);
        });
    }

    function getAllFavoriteStations() {
        const favStations = [];

        // Check global stations
        state.globalStations.forEach(station => {
            if (state.favorites.includes(generateId(station))) {
                favStations.push(station);
            }
        });

        // Check current stations if not all loaded
        state.allStations.forEach(station => {
            if (state.favorites.includes(generateId(station)) && !favStations.find(s => generateId(s) === generateId(station))) {
                favStations.push(station);
            }
        });

        return favStations;
    }

    function createFavoriteStationItem(station) {
        const item = document.createElement('div');
        item.className = 'favorite-station-item';

        if (state.currentStation && generateId(state.currentStation) === generateId(station)) {
            item.classList.add('active');
        }

        const info = document.createElement('div');
        info.className = 'favorite-station-info';

        const name = document.createElement('div');
        name.className = 'favorite-station-name';
        name.textContent = station.name || t('unknownStation');

        const category = document.createElement('div');
        category.className = 'favorite-station-category';
        category.textContent = station._category || '';

        info.appendChild(name);
        info.appendChild(category);

        const actions = document.createElement('div');
        actions.className = 'favorite-actions';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'favorite-action-btn remove-fav';
        removeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`;
        removeBtn.setAttribute('aria-label', 'Remove from favorites');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(station);
        });

        const playBtn = document.createElement('button');
        playBtn.className = 'favorite-action-btn';
        playBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>`;
        playBtn.setAttribute('aria-label', 'Play station');
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Find station in global stations and play
            const globalIndex = state.globalStations.findIndex(s => generateId(s) === generateId(station));
            if (globalIndex !== -1) {
                selectStation(globalIndex);
            } else {
                // Add to allStations and play
                state.allStations.push(station);
                const newIndex = state.allStations.length - 1;
                selectStation(newIndex);
            }
        });

        actions.appendChild(playBtn);
        actions.appendChild(removeBtn);

        item.appendChild(info);
        item.appendChild(actions);

        item.addEventListener('click', () => {
            const globalIndex = state.globalStations.findIndex(s => generateId(s) === generateId(station));
            if (globalIndex !== -1) {
                selectStation(globalIndex);
            } else {
                state.allStations.push(station);
                const newIndex = state.allStations.length - 1;
                selectStation(newIndex);
            }
        });

        return item;
    }

    function toggleFavoritesAccordion() {
        const isExpanded = elements.favoritesContent.classList.toggle('expanded');
        elements.favoritesToggle.classList.toggle('expanded', isExpanded);
    }

    // ==================== Audio Visualizer Functions ====================
    function initVisualizer() {
        try {
            state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            state.analyser = state.audioContext.createAnalyser();
            state.analyser.fftSize = 256;
            state.analyser.smoothingTimeConstant = 0.8;
            state.dataArray = new Uint8Array(state.analyser.frequencyBinCount);

            // Connect audio element to analyser
            state.source = state.audioContext.createMediaElementSource(state.audio);
            state.source.connect(state.analyser);
            state.analyser.connect(state.audioContext.destination);

            return true;
        } catch (error) {
            console.error('Visualizer initialization failed:', error);
            return false;
        }
    }

    function startVisualizer() {
        if (!state.visualizerEnabled) return;

        if (!state.audioContext) {
            if (!initVisualizer()) return;
        }

        if (state.audioContext.state === 'suspended') {
            state.audioContext.resume();
        }

        elements.visualizerCanvas.width = elements.visualizerCanvas.offsetWidth;
        elements.visualizerCanvas.height = elements.visualizerCanvas.offsetHeight;

        const ctx = elements.visualizerCanvas.getContext('2d');
        const style = elements.visualizerStyle.value;

        function animate() {
            if (!state.visualizerEnabled) return;

            state.animationId = requestAnimationFrame(animate);

            state.analyser.getByteFrequencyData(state.dataArray);

            // Clear canvas with gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, elements.visualizerCanvas.height);
            gradient.addColorStop(0, '#0f0c29');
            gradient.addColorStop(0.5, '#302b63');
            gradient.addColorStop(1, '#24243e');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, elements.visualizerCanvas.width, elements.visualizerCanvas.height);

            switch (style) {
                case 'bars':
                    drawBars(ctx);
                    break;
                case 'wave':
                    drawWave(ctx);
                    break;
                case 'circular':
                    drawCircular(ctx);
                    break;
                case 'radial':
                    drawRadial(ctx);
                    break;
                case 'particles':
                    drawParticles(ctx);
                    break;
                default:
                    drawBars(ctx);
            }
        }

        animate();
    }

    function stopVisualizer() {
        if (state.animationId) {
            cancelAnimationFrame(state.animationId);
            state.animationId = null;
        }
    }

    function drawBars(ctx) {
        const bufferLength = state.analyser.frequencyBinCount;
        const width = elements.visualizerCanvas.width;
        const height = elements.visualizerCanvas.height;
        const barWidth = (width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = (state.dataArray[i] / 255) * height * 0.8;

            const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    function drawWave(ctx) {
        const bufferLength = state.analyser.frequencyBinCount;
        const width = elements.visualizerCanvas.width;
        const height = elements.visualizerCanvas.height;

        ctx.beginPath();
        ctx.moveTo(0, height / 2);

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = state.dataArray[i] / 128.0;
            const y = v * height / 2;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Mirror wave
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = state.dataArray[i] / 128.0;
            const y = height - v * height / 2;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.strokeStyle = '#764ba2';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function drawCircular(ctx) {
        const bufferLength = state.analyser.frequencyBinCount;
        const centerX = elements.visualizerCanvas.width / 2;
        const centerY = elements.visualizerCanvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.4;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = (state.dataArray[i] / 255) * radius * 0.8;
            const angle = (i / bufferLength) * Math.PI * 2;

            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + barHeight);
            const y2 = centerY + Math.sin(angle) * (radius + barHeight);

            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    function drawRadial(ctx) {
        const bufferLength = state.analyser.frequencyBinCount;
        const centerX = elements.visualizerCanvas.width / 2;
        const centerY = elements.visualizerCanvas.height / 2;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = (state.dataArray[i] / 255) * 150 + 20;
            const angle = (i / bufferLength) * Math.PI * 2;

            const x = centerX + Math.cos(angle) * barHeight;
            const y = centerY + Math.sin(angle) * barHeight;

            ctx.fillStyle = `hsla(${(i / bufferLength) * 360}, 70%, 60%, 0.8)`;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Particle system for particles visualizer
    const particles = [];
    const maxParticles = 100;

    function initParticles() {
        particles.length = 0;
        for (let i = 0; i < maxParticles; i++) {
            particles.push({
                x: Math.random() * elements.visualizerCanvas.width,
                y: Math.random() * elements.visualizerCanvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                hue: Math.random() * 360
            });
        }
    }

    function drawParticles(ctx) {
        const bufferLength = state.analyser.frequencyBinCount;
        const avgFrequency = state.dataArray.reduce((a, b) => a + b, 0) / bufferLength;

        if (particles.length === 0) {
            initParticles();
        }

        particles.forEach((p, i) => {
            // Update particle position
            p.x += p.vx * (1 + avgFrequency / 50);
            p.y += p.vy * (1 + avgFrequency / 50);

            // Bounce off walls
            if (p.x < 0 || p.x > elements.visualizerCanvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > elements.visualizerCanvas.height) p.vy *= -1;

            // Size based on frequency
            const freqIndex = Math.floor((i / maxParticles) * bufferLength);
            const freqValue = state.dataArray[freqIndex] || 0;
            const size = p.size * (1 + freqValue / 100);

            ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, 0.8)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Connect particles with lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const freqIndex = Math.floor((i / maxParticles) * bufferLength);
                    const freqValue = state.dataArray[freqIndex] || 0;
                    ctx.strokeStyle = `hsla(${particles[i].hue}, 70%, 60%, ${1 - distance / 100})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function toggleVisualizer() {
        state.visualizerEnabled = !state.visualizerEnabled;
        elements.visualizerToggleBtn.classList.toggle('active', state.visualizerEnabled);

        if (state.visualizerEnabled) {
            elements.visualizerOverlay.classList.add('active');
            // Wait for layout to complete before sizing canvas
            setTimeout(() => {
                elements.visualizerCanvas.width = elements.visualizerCanvas.offsetWidth;
                elements.visualizerCanvas.height = elements.visualizerCanvas.offsetHeight;
            }, 10);
            if (state.isPlaying) {
                startVisualizer();
            }
        } else {
            elements.visualizerOverlay.classList.remove('active');
            stopVisualizer();
        }
    }

    function closeVisualizer() {
        state.visualizerEnabled = false;
        elements.visualizerOverlay.classList.remove('active');
        elements.visualizerToggleBtn.classList.remove('active');
        stopVisualizer();
    }

    function handleVisualizerResize() {
        if (state.visualizerEnabled) {
            elements.visualizerCanvas.width = elements.visualizerCanvas.offsetWidth;
            elements.visualizerCanvas.height = elements.visualizerCanvas.offsetHeight;
        }
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

    // ==================== Seekbar Functions ====================
    function updateSeekbar() {
        const { duration, currentTime } = state.audio;

        if (!duration || !isFinite(duration) || isNaN(duration)) {
            // Hide seekbar for live streams
            elements.seekbarContainer.style.display = 'none';
            return;
        }

        // Show seekbar for seekable media
        elements.seekbarContainer.style.display = 'flex';

        const progress = (currentTime / duration) * 100;
        elements.seekbarProgress.style.width = `${progress}%`;

        const thumbPosition = (currentTime / duration) * elements.seekbar.offsetWidth;
        elements.seekbarThumb.style.left = `${thumbPosition}px`;

        elements.currentTimeEl.textContent = formatTime(currentTime);
        elements.durationEl.textContent = formatTime(duration);
    }

    function handleSeek(e) {
        const rect = elements.seekbar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * state.audio.duration;

        if (!isNaN(newTime) && isFinite(newTime)) {
            state.audio.currentTime = newTime;
        }
    }

    function checkMediaSeekable() {
        const { duration } = state.audio;

        if (!duration || !isFinite(duration) || isNaN(duration)) {
            // Hide seekbar for live streams
            elements.seekbarContainer.style.display = 'none';
        } else {
            // Show seekbar for seekable media
            elements.seekbarContainer.style.display = 'flex';
        }
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
                checkMediaSeekable();
                if (state.visualizerEnabled) {
                    startVisualizer();
                }
                saveToStorage(CONFIG.STORAGE_KEYS.LAST_PLAYED, {
                    station: state.currentStation,
                    category: state.currentCategory
                });
            })
            .catch(error => {
                console.error('Error playing station:', error);
                state.isPlaying = false;
                updatePlayPauseButton();
                elements.seekbarContainer.style.display = 'none';

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
        stopVisualizer();
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

        elements.volumeBtn.setAttribute('aria-label', state.isMuted ? t('ariaUnmute') : t('ariaMute'));
    }

    // ==================== UI Updates ====================
    function resetPlayer() {
        state.audio.pause();
        state.isPlaying = false;
        state.currentStation = null;
        state.currentStationIndex = -1;

        elements.stationImage.innerHTML = '<div class="placeholder-icon">📻</div>';
        elements.stationTitle.textContent = t('noStationSelected');
        elements.stationMeta.textContent = t('selectStation');

        elements.seekbarContainer.style.display = 'none';
        elements.seekbarProgress.style.width = '0%';
        elements.currentTimeEl.textContent = '0:00';
        elements.durationEl.textContent = '0:00';

        updatePlayPauseButton();
    }

    function updatePlayerUI() {
        if (!state.currentStation) return;

        elements.stationTitle.textContent = state.currentStation.name || t('unknownStation');
        elements.stationMeta.textContent = state.currentCategory ? state.currentCategory.displayName : t('unknownCategory');

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
            elements.playPauseBtn.setAttribute('aria-label', t('ariaPause'));
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            elements.playPauseBtn.setAttribute('aria-label', t('ariaPlay'));
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
        elements.seekbar.addEventListener('click', handleSeek);

        // Language selector
        elements.languageSelect.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });

        elements.searchBtn.addEventListener('click', async () => {
            await performSearch(elements.searchInput.value);
        });
        elements.searchInput.addEventListener('keyup', async (e) => {
            if (e.key === 'Enter') {
                await performSearch(elements.searchInput.value);
            }
        });

        let searchTimeout;
        elements.searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                await performSearch(elements.searchInput.value);
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

        // Category dropdown listener for mobile
        if (elements.categoryDropdown) {
            elements.categoryDropdown.addEventListener('change', (e) => {
                const selectedFileName = e.target.value;
                let category;
                if (selectedFileName === 'all') {
                    category = state.categories.find(c => c.isGlobal);
                } else {
                    category = state.categories.find(c => c.fileName === selectedFileName);
                }
                if (category) {
                    selectCategory(category);
                }
            });
        }

        // Favorites accordion toggle
        if (elements.favoritesHeader) {
            elements.favoritesHeader.addEventListener('click', toggleFavoritesAccordion);
        }

        // Visualizer controls
        if (elements.visualizerToggleBtn) {
            elements.visualizerToggleBtn.addEventListener('click', toggleVisualizer);
        }

        if (elements.visualizerCloseBtn) {
            elements.visualizerCloseBtn.addEventListener('click', closeVisualizer);
        }

        if (elements.visualizerStyle) {
            elements.visualizerStyle.addEventListener('change', () => {
                // Restart visualizer with new style
                if (state.visualizerEnabled && state.isPlaying) {
                    stopVisualizer();
                    startVisualizer();
                }
            });
        }

        // Handle visualizer resize
        window.addEventListener('resize', handleVisualizerResize);

        // Audio event listeners
        state.audio.addEventListener('timeupdate', updateSeekbar);
        state.audio.addEventListener('loadedmetadata', checkMediaSeekable);
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
            elements.seekbarContainer.style.display = 'none';
            stopVisualizer();
        });

        state.audio.addEventListener('play', () => {
            state.isPlaying = true;
            updatePlayPauseButton();
            checkMediaSeekable();
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

        // Load saved language or default to English
        const savedLanguage = loadFromStorage(CONFIG.STORAGE_KEYS.LANGUAGE, 'en');
        state.currentLanguage = savedLanguage;
        elements.languageSelect.value = savedLanguage;

        if (elements.categorySortSelect) {
            elements.categorySortSelect.value = state.categorySort;
        }
        if (elements.stationSortSelect) {
            elements.stationSortSelect.value = state.stationSort;
        }

        elements.volumeSlider.value = state.volume * 100;
        state.audio.volume = state.volume;

        initTheme();

        // Apply translations
        applyTranslations();

        state.categories = parseCategories();
        renderCategories();
        renderFavorites(); // Initialize favorites accordion

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
