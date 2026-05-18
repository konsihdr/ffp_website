function nextJugend() {
  // Element auswählen, in dem das Start Datum angezeigt wird
  const startDatumElement = document.getElementById("nj");
  if (!startDatumElement) return;

  // Fetch-Anfrage an die API senden
  window.ffpSupabase.request("ffp_events", {
    select: "summary,start",
    is_youth_event: "eq.true",
    start: `gte.${new Date().toISOString()}`,
    order: "start.asc",
    limit: "1",
  })
    .then((response) => response.json()) // Die Antwort als JSON interpretieren
    .then((events) => {
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
  // Element auswählen, in dem das Start Datum angezeigt wird
  const startDatumElement = document.getElementById("ne");
  if (!startDatumElement) return;

  // Fetch-Anfrage an die API senden
  window.ffpSupabase.request("ffp_events", {
    select: "summary,start",
    start: `gte.${new Date().toISOString()}`,
    order: "start.asc",
    limit: "1",
  })
    .then((response) => response.json()) // Die Antwort als JSON interpretieren
    .then((events) => {
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

function updateBBCountdown() {
  const targetDate = new Date('2026-06-03T00:00:00').getTime();
  const now = new Date().getTime();
  const distance = targetDate - now;

  const countdownElement = document.getElementById('bb-countdown');
  if (!countdownElement) return;

  if (distance < 0) {
    countdownElement.textContent = '00:00:00:00';
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const formattedCountdown =
    String(days).padStart(2, '0') + ':' +
    String(hours).padStart(2, '0') + ':' +
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0');

  countdownElement.textContent = formattedCountdown;
}

// Only run countdown if element exists
if (document.getElementById('bb-countdown')) {
  updateBBCountdown();
  setInterval(updateBBCountdown, 1000);
}
