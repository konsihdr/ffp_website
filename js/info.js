function formatISODate(isoDate) {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Monate sind nullbasiert
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year}`;
}

function formatISODateTime(isoDate) {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Monate sind nullbasiert
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}

function formatDayName(isoDate) {
    const date = new Date(isoDate);
    const options = { weekday: 'long' };
    const formattedDate = date.toLocaleDateString('de-DE', options);

    return formattedDate;
}

document.addEventListener('DOMContentLoaded', () => {
    const dataTableBody = document.querySelector('#dataTable tbody');

    // Funktion zum Abrufen der Daten
    function fetchData() {
        const apiUrl = `https://ffp.hdr-it.de/api/ne?c=12`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Daten in die Tabelle einfügen
                dataTableBody.innerHTML = ''; // Tabelle leeren

                data.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${formatDayName(item.start)} ${formatISODate(item.start)}</td>
                        <td>${item.summary}</td>
                        <td>${formatISODateTime(item.start)} Uhr</td>
                    `;
                    dataTableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Fehler beim Abrufen der Daten:', error);
            });
    }

    // Initial die Daten laden, wenn die Seite geladen ist
    fetchData();
});
