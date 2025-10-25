const categories = [
    { key: 'actor', name: 'Actors', file: 'actor.json' },
    { key: 'classic', name: 'Classic', file: 'classic.json' },
    { key: 'artist', name: 'Artists', file: 'artist.json' },
    { key: 'community', name: 'Community', file: 'community.json' },
    { key: 'india', name: 'India FM', file: 'india.json' },
    { key: 'hindu', name: 'Hindu', file: 'hindu.json' },
    { key: 'tamiltv', name: 'Tamil TV', file: 'tamiltv.json' },
    { key: 'tamiltalk', name: 'Tamil Talk', file: 'tamiltalk.json' },
    { key: 'music', name: 'Music', file: 'music.json' },
    { key: 'tamilfm', name: 'Tamil FM', file: 'tamilfm.json' }
];

const app = document.getElementById('app');
const searchInput = document.getElementById('search');
const filtersContainer = document.getElementById('category-filters');
const filterToggle = document.querySelector('.filter-toggle');
const filters = document.querySelector('.filters');

let allSections = {};

async function loadCategory(cat) {
    try {
        const response = await fetch(cat.file, { cache: 'force-cache' });
        const stations = await response.json();
        const section = renderCategory(cat.key, cat.name, stations);
        allSections[cat.key] = section;
        app.appendChild(section);
    } catch (error) {
        console.error(`Error loading ${cat.file}:`, error);
    }
}

function renderCategory(key, name, stations) {
    const section = document.createElement('section');
    section.className = 'category';
    section.dataset.category = key;
    section.innerHTML = `<h2>${name} (${stations.length})</h2>
                         <div class="stations-grid"></div>`;

    const grid = section.querySelector('.stations-grid');

    stations.forEach(station => {
        const card = document.createElement('div');
        card.className = 'station-card';
        card.tabIndex = 0;
        const isTV = key === 'tamiltv';
        const mediaType = isTV ? 'video' : 'audio';
        const controls = mediaType === 'video' ? 'controls' : 'controls preload="none"';

        card.innerHTML = `
            <div class="station-header">
                ${station.favicon ? `<img src="${station.favicon}" alt="${station.name}" class="station-favicon" loading="lazy" onerror="this.style.display='none'">` : ''}
                <h3 class="station-name">${station.name}</h3>
            </div>
            <div class="player-container">
                <${mediaType} ${controls}>
                    <source src="${station.url_resolved || station.url}" type="${station.codec === 'HLS' ? 'application/x-mpegURL' : (station.codec === 'MP3' ? 'audio/mpeg' : '')}">
                    Your browser does not support the ${mediaType} element.
                </${mediaType}>
            </div>
            ${station.tags ? `<p class="station-tags">Tags: ${station.tags}</p>` : ''}
        `;

        grid.appendChild(card);
    });

    return section;
}

function initFilters() {
    categories.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'filter-checkbox';
        div.innerHTML = `
            <input type="checkbox" id="filter-${cat.key}" checked data-category="${cat.key}">
            <label for="filter-${cat.key}">${cat.name}</label>
        `;
        filtersContainer.appendChild(div);
    });
}

function applyFilters() {
    Object.keys(allSections).forEach(key => {
        const checkbox = document.querySelector(`input[data-category="${key}"]`);
        const section = allSections[key];
        if (checkbox.checked) {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });
    applySearch();
}

function applySearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.station-card');
    cards.forEach(card => {
        const name = card.querySelector('.station-name').textContent.toLowerCase();
        const section = card.closest('.category');
        if (name.includes(searchTerm) && !section.classList.contains('hidden')) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });

    const sections = document.querySelectorAll('.category');
    sections.forEach(section => {
        const visibleCards = section.querySelectorAll('.station-card:not(.hidden)');
        if (visibleCards.length === 0 && !section.classList.contains('hidden')) {
            section.classList.add('hidden');
        } else if (visibleCards.length > 0 && !section.classList.contains('hidden')) {
            section.classList.remove('hidden');
        }
    });
}

async function init() {
    app.innerHTML = '<div class="loading">Loading...</div>';
    await Promise.all(categories.map(cat => loadCategory(cat)));
    app.querySelector('.loading')?.remove();
    initFilters();
    applyFilters();

    searchInput.addEventListener('input', applySearch);
    filtersContainer.addEventListener('change', applyFilters);
    filterToggle.addEventListener('click', () => {
        filters.classList.toggle('hidden');
    });

    document.addEventListener('play', (e) => {
        const players = document.querySelectorAll('audio, video');
        players.forEach(player => {
            if (player !== e.target && !player.paused && !player.ended) {
                player.pause();
            }
        });
    }, true);

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js')
                .then(reg => console.log('Service Worker registered', reg))
                .catch(err => console.error('Service Worker registration failed', err));
        });
    }
}

init();