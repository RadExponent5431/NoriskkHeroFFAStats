// HGLabor API: Stats abrufen
async function fetchStats() {
    const playerId = document.getElementById('playerId').value.trim();
    const statsContainer = document.getElementById('stats');

    // Überprüfen, ob eine gültige UUID eingegeben wurde
    if (!playerId || !/^[a-f0-9\-]{36}$/.test(playerId)) {
        statsContainer.innerHTML = '<p>Bitte eine gültige Spieler-UUID eingeben.</p>';
        return;
    }

    try {
        const response = await fetch(`https://api.hglabor.de/stats/ffa/${playerId}`);

        // Prüfen, ob die Antwort ok ist
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Daten: ${response.statusText}`);
        }

        const data = await response.json();

        // Überprüfen, ob die Antwort die erwarteten Daten enthält
        if (!data || !data.playerId) {
            throw new Error('Ungültige Daten von der API');
        }

        // Stats anzeigen
        displayStats(data, statsContainer);

    } catch (error) {
        statsContainer.innerHTML = `<p>Fehler: ${error.message}. Bitte überprüfe die UUID.</p>`;
    }
}

// Anzeige der allgemeinen Stats und der Helden
function displayStats(data, statsContainer) {
    // HTML für allgemeine Stats
    let statsHTML = `
        <h2>Stats für Spieler: ${data.playerId}</h2>
        <div class="stat-item">XP: ${data.xp}</div>
        <div class="stat-item">Kills: ${data.kills}</div>
        <div class="stat-item">Deaths: ${data.deaths}</div>
        <div class="stat-item">Höchste Kill-Streak: ${data.highestKillStreak}</div>
        <div class="stat-item">Aktuelle Kill-Streak: ${data.currentKillStreak}</div>
    `;

    // Helden-Daten dynamisch einfügen
    if (data.heroes) {
        statsHTML += '<h3>Heldenfähigkeiten:</h3>';
        Object.entries(data.heroes).forEach(([hero, abilities]) => {
            statsHTML += `<h4>${capitalize(hero)}</h4>`;
            Object.entries(abilities).forEach(([ability, stats]) => {
                statsHTML += `<p><strong>${capitalize(ability)}:</strong></p>`;
                Object.entries(stats).forEach(([statName, value]) => {
                    statsHTML += `
                        <div class="stat-item">
                            ${capitalize(statName)}: ${value.experiencePoints} XP
                        </div>
                    `;
                });
            });
        });
    }

    // HTML-Inhalt nur einmal setzen
    statsContainer.innerHTML = statsHTML;
}

// Dark-Mode umschalten
function toggleDarkMode() {
    document.body.classList.toggle('dark');
}

// Hilfsfunktion zum Großschreiben der ersten Buchstaben
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Dark Mode direkt aktivieren
toggleDarkMode();
