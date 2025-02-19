// Mojang API: Spielername -> UUID
/*async function fetchUUID() {
    const playerName = document.getElementById('playerName').value.trim();
    const uuidResult = document.getElementById('uuidResult');

    // Überprüfen, ob ein Spielername eingegeben wurde
    if (!playerName) {
        uuidResult.innerHTML = '<p>Bitte einen gültigen Spielernamen eingeben.</p>';
        return;
    }

    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${playerName}`);
    if (!response.ok) {
        throw new Error('Spieler nicht gefunden');
    }

    const data = await response.json();

    // UUID anzeigen
    uuidResult.innerHTML = `<p>Spielername: ${data.name} <br> UUID: ${data.id}</p>`;

    // Die UUID in das Eingabefeld für Stats setzen
    document.getElementById('playerId').value = data.id;
}*/

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

        // HTML-Inhalt für die Anzeige zusammenstellen
        const statsHTML = `
            <h2>Stats für Spieler: ${data.playerId}</h2>
            <div class="stat-item">XP: ${data.xp}</div>
            <div class="stat-item">Kills: ${data.kills}</div>
            <div class="stat-item">Deaths: ${data.deaths}</div>
            <div class="stat-item">Höchste Kill-Streak: ${data.highestKillStreak}</div>
            <div class="stat-item">Aktuelle Kill-Streak: ${data.currentKillStreak}</div>
        `;

        // HTML-Inhalt nur einmal setzen
        statsContainer.innerHTML = statsHTML;
        
    } catch (error) {
        statsContainer.innerHTML = `<p>Fehler: ${error.message}. Bitte überprüfe die UUID.</p>`;
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark');
}

toggleDarkMode();
