function nextJugend() {
  const apiUrl = "https://base.hdr-it.de/api/collections/ffp_events/records?filter=(is_youth_event%3Dtrue%20%26%26%20start%3E%3D%40now)&sort=start&perPage=1";

  // Element auswählen, in dem das Start Datum angezeigt wird
  const startDatumElement = document.getElementById("nj");

  // Fetch-Anfrage an die API senden
  fetch(apiUrl)
    .then((response) => response.json()) // Die Antwort als JSON interpretieren
    .then((data) => {
      // PocketBase returns data in a 'items' array
      const events = data.items || [];
      if (events.length === 0) {
        startDatumElement.textContent = "Keine anstehenden Jugendveranstaltungen";
        return;
      }
      
      // Zeitstempel in ein JavaScript Date-Objekt umwandeln
      const startDatum = new Date(events[0].start);

      // Datum in lesbarer Form anzeigen
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      const formattedStartDatum = startDatum.toLocaleDateString(
        "de-DE",
        options
      );

      // Anzeige aktualisieren
      startDatumElement.textContent = `${formattedStartDatum}`;
    })
    .catch((error) => {
      console.error("Fehler beim Abrufen der Daten:", error);
      startDatumElement.textContent = "Fehler beim Abrufen der Daten";
    });
}
nextJugend();

function next() {
  const apiUrl = "https://base.hdr-it.de/api/collections/ffp_events/records?filter=(start>=@now)&sort=start&perPage=1";

  // Element auswählen, in dem das Start Datum angezeigt wird
  const startDatumElement = document.getElementById("ne");

  // Fetch-Anfrage an die API senden
  fetch(apiUrl)
    .then((response) => response.json()) // Die Antwort als JSON interpretieren
    .then((data) => {
      // PocketBase returns data in a 'items' array
      const events = data.items || [];
      if (events.length === 0) {
        startDatumElement.textContent = "Keine anstehenden Veranstaltungen";
        return;
      }
      
      // Zeitstempel in ein JavaScript Date-Objekt umwandeln
      const startDatum = new Date(events[0].start);

      // Datum in lesbarer Form anzeigen
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      const formattedStartDatum = startDatum.toLocaleDateString(
        "de-DE",
        options
      );

      // Anzeige aktualisieren
      startDatumElement.textContent = `${events[0].summary} am ${formattedStartDatum}`;
    })
    .catch((error) => {
      console.error("Fehler beim Abrufen der Daten:", error);
      startDatumElement.textContent = "Fehler beim Abrufen der Daten";
    });
}
next();
