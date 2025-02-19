// Fetch stats from API
async function fetchStats() {
    const playerId = document.getElementById('playerId').value.trim();
    const statsContainer = document.getElementById('stats');

    if (!playerId) {
        statsContainer.innerHTML = `
            <div class="stat-item error">❌ Bitte eine gültige Spieler-UUID oder einen Namen eingeben.</div>
        `;
        return;
    }

    try {
        // Prüfen, ob die Eingabe eine UUID ist
        const isUUID = /^[a-f0-9\-]{36}$/.test(playerId);
        let uuid = playerId;

        if (!isUUID) {
            const uuidResponse = await fetch(`https://api.ashcon.app/mojang/v2/user/${playerId}`);
            if (!uuidResponse.ok) throw new Error("Name konnte nicht in UUID umgewandelt werden.");
            const uuidData = await uuidResponse.json();
            uuid = uuidData.uuid; 
        }

        // Versuche, die hglabor.de API mit der UUID abzufragen
        const hgResponse = await fetch(`https://api.hglabor.de/stats/ffa/${uuid}`);
        if (hgResponse.status === 404) {
            throw new Error("Spieler hat noch nicht gespielt.");
        }
        if (!hgResponse.ok) {
            throw new Error(`Fehler beim Abrufen: ${hgResponse.statusText}`);
        }

        const data = await hgResponse.json();
        if (!data || !data.playerId) throw new Error('Ungültige Daten von der API.');

        // UUID in Namen umwandeln (für die Anzeige)
        const nameResponse = await fetch(`https://api.ashcon.app/mojang/v2/user/${uuid}`);
        if (!nameResponse.ok) throw new Error("UUID konnte nicht in Namen umgewandelt werden.");
        const nameData = await nameResponse.json();
        const playerName = nameData.username;

        // Daten anzeigen
        displayStats(data, statsContainer, playerName);
    } catch (error) {
        statsContainer.innerHTML = `
            <div class="stat-item error">❌ Fehler: ${error.message}</div>
        `;
    }
}

// Display stats
function displayStats(data, statsContainer, playerName) {
    let statsHTML = `
        <h2>🎮 Stats für Spieler: <span class="highlight">${playerName}</span></h2>
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