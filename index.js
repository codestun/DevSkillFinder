// Importieren von Express
const express = require('express');

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
