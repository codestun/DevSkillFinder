// Importieren von Express und dotenv
const express = require('express');
require('dotenv').config(); // Laden der Umgebungsvariablen aus der .env Datei

// Initialisieren der Express-Anwendung
const app = express();
const port = 3000;

// Definieren der Standardroute
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Starten des Servers
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
