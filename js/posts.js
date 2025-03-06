function formatISODate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("de-DE");
}

document.addEventListener("DOMContentLoaded", () => {
  const posts = document.getElementById("posts");

  // Funktion zum Abrufen der Daten
  function fetchPosts() {
    const apiUrl = `https://ffp.hdr-it.de/api/posts/all`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Daten in die Tabelle einfügen
        posts.innerHTML = "";

        data.forEach((item) => {
          const div = document.createElement("div");
          div.classList.add(
            "row",
            "gx-0",
            "mb-4",
            "mb-lg-5",
            "align-items-center"
          );
          div.innerHTML = `
            <div class="col-xl-8 col-lg-7">
                <img
                class="img-fluid mb-3 mb-lg-0"
                src="${item.displayUrl}"
                alt="${item.alt}"
                />
            </div>
            <div class="col-xl-4 col-lg-5">
                <div class="featured-text text-lg-left">
                <a href="${item.url}"><h4>${item.caption.split(" ")[1]}</h4></a>
                <p class="small">${formatISODate(item.timestamp)}</p>
                <p class="mb-0">${item.caption}</p>
                </div>
            </div>`;
          posts.appendChild(div);
        });
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der Daten:", error);
      });
  }

  // Initial die Daten laden, wenn die Seite geladen ist
  fetchPosts();
});
