// Spinner anzeigen
function showLocalLoading(container) {
    // Verhindere doppelte Spinner
    if (container.querySelector('.spinner')) return;

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    container.classList.add('spinner-container'); // Lokale Positionierung
    container.appendChild(spinner);
}

// Spinner verstecken
function hideLocalLoading(container) {
    const spinner = container.querySelector('.spinner');
    if (spinner) {
        spinner.remove(); // Entferne den Spinner
        container.classList.remove('spinner-container');
    }
}

// Fetch stats (inkl. Spinner)
async function fetchStats() {
    const playerId = document.getElementById('playerId').value.trim();
    const statsContainer = document.getElementById('stats');

    if (!playerId) {
        statsContainer.innerHTML = `
            <div class="stat-item error">❌ Bitte eine gültige Spieler-UUID oder einen Namen eingeben.</div>
        `;
        return;
    }

    showLocalLoading(statsContainer);

    try {
        const uuid = await getUUID(playerId);

        const hgResponse = await fetch(`https://api.hglabor.de/stats/ffa/${uuid}`);
        if (hgResponse.status === 404) {
            throw new Error("Spieler hat noch nicht gespielt.");
        }
        if (!hgResponse.ok) {
            throw new Error(`Fehler beim Abrufen: ${hgResponse.statusText}`);
        }

        const data = await hgResponse.json();
        if (!data || !data.playerId) throw new Error('Ungültige Daten von der API.');

        const playerName = await getPlayerName(uuid);

        // Daten anzeigen
        statsContainer.classList.add('fade-in');
        displayStats(data, statsContainer, playerName);
    } catch (error) {
        statsContainer.innerHTML = `
            <div class="stat-item error">❌ Fehler: ${error.message}</div>
        `;
    } finally {
        hideLocalLoading(statsContainer); // Spinner entfernen
    }
}

// Load leaderboard (inkl. Spinner)
async function loadTopTable(value) {
    const apiUrl = `https://api.hglabor.de/stats/ffa/top?sort=${value}&page=1`;
    const tableBody = document.getElementById("top");

    showLocalLoading(tableBody);

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Fehler beim Abrufen der Daten.");
        const data = await response.json();

        tableBody.innerHTML = ""; // Zurücksetzen der Tabelle

        const rows = await Promise.all(data.slice(0, 15).map((player, index) => createLeaderboardRow(player, index + 1)));
        tableBody.append(...rows);

        tableBody.classList.add('fade-in'); // Einfaden
    } catch (error) {
        console.error("Fehler:", error);
        tableBody.innerHTML = `<tr><td colspan="6">Fehler beim Laden der Daten: ${error.message}</td></tr>`;
    } finally {
        hideLocalLoading(tableBody); // Spinner entfernen
    }
}




// Get UUID from player name or return the input if it's already a UUID
async function getUUID(playerId) {
    const isUUID = /^[a-f0-9\-]{36}$/.test(playerId);
    if (isUUID) return playerId;

    const response = await fetch(`https://api.ashcon.app/mojang/v2/user/${playerId}`);
    if (!response.ok) throw new Error("Name konnte nicht in UUID umgewandelt werden.");
    const data = await response.json();
    return data.uuid;
}

// Get player name from UUID
async function getPlayerName(uuid) {
    const response = await fetch(`https://api.ashcon.app/mojang/v2/user/${uuid}`);
    if (!response.ok) throw new Error("UUID konnte nicht in Namen umgewandelt werden.");
    const data = await response.json();
    return data.username;
}

// Display stats
function displayStats(data, statsContainer, playerName) {
    document.getElementById("stats").parentElement.classList.remove("hidden");

    let statsHTML = `
        <h2>🎮 Stats für Spieler: <span class="highlight">${playerName}</span></h2>
        <div class="stat-item">🧩 <strong>XP:</strong> ${data.xp}</div>
        <div class="stat-item">⚔️ <strong>Kills:</strong> ${data.kills}</div>
        <div class="stat-item">💀 <strong>Deaths:</strong> ${data.deaths}</div>
        <div class="stat-item">🔥 <strong>Höchste Kill-Streak:</strong> ${data.highestKillStreak}</div>
        <div class="stat-item">⚡ <strong>Aktuelle Kill-Streak:</strong> ${data.currentKillStreak}</div>
    `;

    if (data.heroes) {
        statsHTML += generateHeroesStats(data.heroes);
    }

    statsContainer.innerHTML = statsHTML;
}

// Generate hero stats section
function generateHeroesStats(heroes) {
    let html = '<h3>🦸 Heldenfähigkeiten:</h3>';
    Object.entries(heroes).forEach(([hero, abilities]) => {
        let heroDetails = `
            <details>
                <summary>🦸 ${capitalize(hero)}</summary>
                <div>
        `;
        Object.entries(abilities).forEach(([ability, stats]) => {
            heroDetails += `
                <details>
                    <summary>⚙️ ${capitalize(ability)}</summary>
                    <div class="stat-item">${Object.entries(stats).map(
                        ([statName, value]) => `<div>${capitalize(statName)}: ${value.experiencePoints} XP</div>`
                    ).join('<br>')}</div>
                </details>
            `;
        });
        heroDetails += `</div></details>`;
        html += heroDetails;
    });
    return html;
}

// Toggle dark mode and store preference in a cookie
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    document.getElementById("dM").innerHTML = !isDarkMode ? '🌙 Dark Mode' : '☀️ White Mode'; 
    document.cookie = `darkMode=${isDarkMode};path=/;max-age=31536000`; // Store for 1 year
}

// Apply dark mode based on cookie
function applyDarkModePreference() {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
    }, {});
    if (cookies.darkMode === 'false') {
        document.body.classList.remove('dark');
        document.getElementById("dM").innerHTML = !document.body.classList.contains('dark') ? '🌙 Dark Mode' : '☀️ White Mode'; 
    } else document.getElementById("dM").innerHTML = !document.body.classList.contains('dark') ? '🌙 Dark Mode' : '☀️ White Mode'; 
}

// Capitalize first letter
function capitalize(string) {
    return string
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


// Create leaderboard row
async function createLeaderboardRow(player, rank) {
    const uuid = player.playerId;
    const playerName = await getPlayerName(uuid);
    const avatarUrl = `https://crafatar.com/avatars/${uuid}?size=50&overlay`;

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${rank}.</td>
        <td><img src="${avatarUrl}" alt="${playerName}" class="avatar"> ${playerName}</td>
        <td>${player.xp}</td>
        <td>${player.kills}</td>
        <td>${player.deaths}</td>
        <td>${player.currentKillStreak} / ${player.highestKillStreak}</td>
    `;
    return row;
}

// Add event listeners on page load
document.addEventListener('DOMContentLoaded', () => {
    applyDarkModePreference();
    loadTopTable("xp");

    const tableHeaders = document.getElementsByClassName("s");
    for (const tableHeader of tableHeaders) {
        tableHeader.addEventListener("click", () => {
            loadTopTable(tableHeader.innerHTML.trim().toLowerCase());
        });
    }
});