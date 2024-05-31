// Importieren von HTTPS, Express und dotenv
const https = require('https');
const express = require('express');
require('dotenv').config(); // Laden der Umgebungsvariablen aus der .env Datei

// Initialisieren der Express-Anwendung
const app = express();
const port = 3000; // Definieren des Ports, auf dem der Server Anfragen annimmt

// Optionen für die HTTPS-Anfrage
const options = {
  hostname: 'api.github.com', // Hostname der API
  method: 'GET', // HTTP-Methode
  headers: {
    'User-Agent': 'devskillfinder', // Erforderlich von der GitHub API
    'Authorization': `token ${process.env.GITHUB_TOKEN}` // GitHub-Token aus den Umgebungsvariablen laden
  }
};

// Funktion zum Abrufen von Daten von einer URL
function fetchData(url) {
  return new Promise((resolve, reject) => {
    // Erstellen der HTTPS-Anfrage
    const req = https.request(url, options, (res) => {
      let data = ''; // Variable zum Akkumulieren der Antwortdaten

      // Event-Listener für den Empfang von Datenstücken
      res.on('data', (chunk) => {
        data += chunk; // Jedes empfangene Datenstück hinzufügen
      });

      // Event-Listener für das Ende der Datenübertragungs
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

// Funktion zum Abrufen der Mitglieder der codecentric-Organisation
async function fetchOrganizationMembers() {
  const membersUrl = 'https://api.github.com/orgs/codecentric/members';
  return fetchData(membersUrl); // Verwenden der fetchData Funktion, um die Mitglieder abzurufen
}

// Funktion zum Abrufen der Repositories eines spezifischen Nutzers
async function fetchUserRepositories(login) {
  const repositoriesUrl = `https://api.github.com/users/${login}/repos`;
  return fetchData(repositoriesUrl); // Verwenden der fetchData Funktion, um die Repositories abzurufen
}

// Funktion zum Abrufen der Programmiersprachen eines spezifischen Repositories
async function fetchRepositoryLanguages(login, repo) {
  const repositoriesUrl = `https://api.github.com/repos/${login}/${repo}`;
  const repositoryData = await fetchData(repositoriesUrl);
  const languagesUrl = repositoryData.languages_url;
  return fetchData(languagesUrl); // Verwenden der fetchData Funktion, um die Programmiersprachen abzurufen
}

// Definieren der Route für die Mitglieder der Organisation
app.get('/members', async (req, res) => {
  try {
    const members = await fetchOrganizationMembers();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Definieren der Route für die Repositories eines Nutzers
app.get('/repos/:login', async (req, res) => {
  try {
    const repos = await fetchUserRepositories(req.params.login);
    res.json(repos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Definieren der Route für die Programmiersprachen eines Repositories
app.get('/languages/:login/:repo', async (req, res) => {
  try {
    const languages = await fetchRepositoryLanguages(req.params.login, req.params.repo);
    res.json(languages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Starten des Servers
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
