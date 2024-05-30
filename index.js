// Importieren von HTTPS, Express und dotenv
const https = require('https');
const express = require('express');
require('dotenv').config(); // Laden der Umgebungsvariablen aus der .env Datei

// Initialisieren der Express-Anwendung
const app = express();
const port = 3000;

// Optionen für die HTTPS-Anfrage
const options = {
  hostname: 'api.github.com', // Hostname der API
  path: '/orgs/codecentric/members', // Pfad zur Ressource
  method: 'GET', // HTTP-Methode
  headers: {
    'User-Agent': 'devskillfinder', // Erforderlich von der GitHub API
    'Authorization': `token ${process.env.GITHUB_TOKEN}` // GitHub-Token aus den Umgebungsvariablen laden
  }
};

// Funktion zum Abrufen von Daten von einer URL
function fetchData() {
  return new Promise((resolve, reject) => {
    // Erstellen der HTTPS-Anfrage
    const req = https.request(options, (res) => {
      let data = ''; // Variable zum Akkumulieren der Antwortdaten

      // Event-Listener für den Empfang von Datenstücken
      res.on('data', (chunk) => {
        data += chunk; // Jedes empfangene Datenstück hinzufügen
      });

      // Event-Listener für das Ende der Datenübertragung
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data); // Parsen der akkumulierten Daten als JSON
          resolve(parsedData); // Promise mit den geparsten Daten auflösen
        } catch (error) {
          reject(error); // Bei Fehlern beim Parsen das Promise ablehnen
        }
      });
    });

    // Event-Listener für Fehler bei der Anfrage
    req.on('error', (err) => {
      reject(err); // Promise bei einem Fehler ablehnen
    });

    req.end(); // Beenden der Anfrage
  });
}

// Definieren der Standardroute
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Starten des Servers
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
