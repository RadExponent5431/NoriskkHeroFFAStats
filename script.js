// Fetch stats from API
async function fetchStats() {
    const playerId = document.getElementById('playerId').value.trim();
    const statsContainer = document.getElementById('stats');

    if (!playerId || !/^[a-f0-9\-]{36}$/.test(playerId)) {
        statsContainer.innerHTML = `
            <div class="stat-item error">❌ Bitte eine gültige Spieler-UUID eingeben.</div>
        `;
        return;
    }

    try {
        const response = await fetch(`https://api.hglabor.de/stats/ffa/${playerId}`);
        if (!response.ok) throw new Error(`Fehler beim Abrufen: ${response.statusText}`);

        const data = await response.json();
        if (!data || !data.playerId) throw new Error('Ungültige Daten von der API.');

        displayStats(data, statsContainer);
    } catch (error) {
        statsContainer.innerHTML = `
            <div class="stat-item error">❌ Fehler: ${error.message}</div>
        `;
    }
}

// Display stats
function displayStats(data, statsContainer) {
    let statsHTML = `
        <h2>🎮 Stats für Spieler: <span class="highlight">${data.playerId}</span></h2>
        <div class="stat-item">🧩 <strong>XP:</strong> ${data.xp}</div>
        <div class="stat-item">⚔️ <strong>Kills:</strong> ${data.kills}</div>
        <div class="stat-item">💀 <strong>Deaths:</strong> ${data.deaths}</div>
        <div class="stat-item">🔥 <strong>Höchste Kill-Streak:</strong> ${data.highestKillStreak}</div>
        <div class="stat-item">⚡ <strong>Aktuelle Kill-Streak:</strong> ${data.currentKillStreak}</div>
    `;

    if (data.heroes) {
        statsHTML += '<h3>🦸 Heldenfähigkeiten:</h3>';
        Object.entries(data.heroes).forEach(([hero, abilities]) => {
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
            statsHTML += heroDetails;
        });
    }

    statsContainer.innerHTML = statsHTML;
}

// Toggle dark mode and store preference in a cookie
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    document.cookie = `darkMode=${isDarkMode};path=/;max-age=31536000`; // Store for 1 year
}

// Apply dark mode based on cookie
function applyDarkModePreference() {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
    }, {});
    if (cookies.darkMode === 'true') {
        document.body.classList.add('dark');
    }
}

// Capitalize first letter
function capitalize(string) {
    // Ersetze alle Unterstriche mit Leerzeichen
    string = string.replace(/_/g, ' ');

    // Splitte die Zeichenkette in Wörter, dann jedes Wort mit einem Großbuchstaben beginnen
    string = string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return string;
}

// Apply dark mode preference on page load
document.addEventListener('DOMContentLoaded', applyDarkModePreference);
