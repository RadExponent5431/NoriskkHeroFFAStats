# 🎮 Hero FFA Stats Website

Hey! 👋  
Ich habe dieses Projekt im Rahmen der **Community Coding Aufgabe** entwickelt, die im [HGLabor Discord](https://discord.gg/wDEKjSWz36) gestartet wurde. Die Aufgabe war es, eine Stats-Website für den neuen **Hero FFA Modus** zu designen und zu programmieren. 🚀  

Ich bin super stolz auf das Ergebnis und freue mich, es mit euch zu teilen! 🙌 
Viel Spaß beim Anschauen,
Ben (aka. RadExponent5431)

---

## 🌟 Über das Projekt

Die Website ermöglicht es, Statistiken von Minecraft-Spielern abzurufen, die den Hero FFA Modus gespielt haben. Du kannst entweder die **UUID** oder den **Namen** des Spielers eingeben, und die Website zeigt dir die folgenden Statistiken an:

- **XP**: Die gesammelten Erfahrungspunkte.
- **Kills**: Die Anzahl der erzielten Kills.
- **Deaths**: Die Anzahl der Tode.
- **Kill-Streaks**: Die höchste und aktuelle Kill-Streak.
- **Heldenfähigkeiten**: Detaillierte Statistiken zu den Fähigkeiten der Helden.

Falls der Spieler noch nicht gespielt hat, wird eine klare Fehlermeldung angezeigt: **"Spieler hat noch nicht gespielt."**

---

## 🛠️ Technische Details

### 🔧 Funktionsweise
1. **Eingabe**: Der Benutzer gibt entweder eine UUID oder einen Namen ein.
2. **UUID-Konvertierung**: Falls ein Name eingegeben wird, wird dieser mithilfe der [Ashcon Mojang API](https://api.ashcon.app/mojang/v2) in eine UUID umgewandelt.
3. **Datenabfrage**: Die UUID wird verwendet, um die Statistiken von der [hglabor.de API](https://api.hglabor.de/swagger) abzurufen.
4. **Anzeige**: Die Statistiken werden in einer benutzerfreundlichen Oberfläche angezeigt.

### 🛠️ Verwendete Technologien
- **HTML/CSS**: Für das Design und die Struktur der Website.
- **JavaScript**: Für die Logik und die API-Abfragen.
- **hglabor.de API**: Zum Abrufen der Spielerstatistiken.
- **Ashcon Mojang API**: Zum Konvertieren von Spielernamen in UUIDs.

---

## 🚀 Wie verwende ich die Website?

1. **Eingabe**: Gib die UUID oder den Namen des Spielers in das Eingabefeld ein.
2. **Klicken**: Drücke auf "Konvertieren" oder "Statistiken abrufen".
3. **Ergebnis**: Die Statistiken werden angezeigt. Falls der Spieler nicht gefunden wird, erhältst du eine entsprechende Fehlermeldung.

---



## 🎨 Design

Das Design der Website ist einfach und benutzerfreundlich gehalten. Es unterstützt **Dark Mode** 🌙, der über einen Button aktiviert werden kann. Die Einstellung wird in einem Cookie gespeichert, sodass sie beim nächsten Besuch erhalten bleibt.

---


## 🔗 Links

- **API-Dokumentation**: [hglabor.de API](https://api.hglabor.de/swagger)
- **Beispiel-API-Aufruf**: [Beispiel-Statistiken](https://api.hglabor.de/stats/ffa/26a4fcde-de39-4ff0-8ea1-786582b7d8ee)
- **Discord**: [HGLabor Discord](https://discord.gg/wDEKjSWz36)

---

## 💡 Feedback

Ich freue mich über Feedback und Verbesserungsvorschläge! Schickt mir gerne eine Nachricht auf Discord (radexponent5431) oder öffnet ein Issue hier auf GitHub. 😊

---

Viel Spaß mit der Website! 🚀  
– Ben