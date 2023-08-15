const apiUrl = 'https://ffp.hdr-it.de/api/nj';

// Element auswählen, in dem das Start Datum angezeigt wird
const startDatumElement = document.getElementById('startDatum');

// Fetch-Anfrage an die API senden
fetch(apiUrl)
    .then(response => response.json()) // Die Antwort als JSON interpretieren
    .then(data => {
        // Daten verarbeiten
        const startDatum = data.startDatum; // Annahme: Die API gibt das Start Datum im 'startDatum' Feld zurück
        startDatumElement.textContent = `Start Datum: ${startDatum}`;
    })
    .catch(error => {
        console.error('Fehler beim Abrufen der Daten:', error);
        startDatumElement.textContent = 'Fehler beim Abrufen der Daten';
    });