const apiUrl = 'https://ffp-api-7qumc7rb4q-ey.a.run.app/api/nj';

// Element auswählen, in dem das Start Datum angezeigt wird
const startDatumElement = document.getElementById('startDatum');

// Fetch-Anfrage an die API senden
fetch(apiUrl)
    .then(response => response.json()) // Die Antwort als JSON interpretieren
    .then(data => {
        // Zeitstempel in ein JavaScript Date-Objekt umwandeln
        const startDatum = new Date(data.start);
        
        // Datum in lesbarer Form anzeigen
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
        const formattedStartDatum = startDatum.toLocaleDateString('de-DE', options);

        // Anzeige aktualisieren
        startDatumElement.textContent = `${formattedStartDatum}`;
    })
    .catch(error => {
        console.error('Fehler beim Abrufen der Daten:', error);
        startDatumElement.textContent = 'Fehler beim Abrufen der Daten';
    });