function nextJugend() {
  const apiUrl = "https://ffp.hdr-it.de/api/nj";

  // Element auswählen, in dem das Start Datum angezeigt wird
  const startDatumElement = document.getElementById("nj");

  // Fetch-Anfrage an die API senden
  fetch(apiUrl)
    .then((response) => response.json()) // Die Antwort als JSON interpretieren
    .then((data) => {
      // Zeitstempel in ein JavaScript Date-Objekt umwandeln
      const startDatum = new Date(data.start);

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
  const apiUrl = "https://ffp.hdr-it.de/api/ne";

  // Element auswählen, in dem das Start Datum angezeigt wird
  const startDatumElement = document.getElementById("ne");

  // Fetch-Anfrage an die API senden
  fetch(apiUrl)
    .then((response) => response.json()) // Die Antwort als JSON interpretieren
    .then((data) => {
      // Zeitstempel in ein JavaScript Date-Objekt umwandeln
      const startDatum = new Date(data.start);

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
      startDatumElement.textContent = `${data.summary} am ${formattedStartDatum}`;
    })
    .catch((error) => {
      console.error("Fehler beim Abrufen der Daten:", error);
      startDatumElement.textContent = "Fehler beim Abrufen der Daten";
    });
}
next();
