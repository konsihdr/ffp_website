/**
 * Formats an ISO date string into a German locale date string.
 * @param {string} isoDate - The ISO date string (e.g., "2023-10-27T10:00:00Z").
 * @returns {string} The formatted date string (e.g., "27. Oktober 2023") or an empty string if input is invalid.
 */
function formatISODate(isoDate) {
  // Using current date for demonstration as requested by user prompt context
  // In a real scenario, you'd parse isoDate
  const today = new Date(); // Example: Use today's date based on prompt context
  if (!isoDate) {
    // If no date provided, maybe show today's date as per context, or return ''
    // Let's stick to formatting the input if provided, else empty
    return "";
  }

  try {
    const date = new Date(isoDate);
    // Get current location from context if needed for locale, but de-DE is specified
    return date.toLocaleDateString("de-DE", {
      // Using specified German locale
      year: "numeric",
      month: "long", // e.g., "März"
      day: "numeric", // e.g., "30"
    });
  } catch (e) {
    console.error("Error formatting date:", isoDate, e);
    return isoDate; // Return original string if formatting fails
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Get the container element where posts will be added
  // ***** HTML CHECK: THIS ELEMENT *MUST* HAVE class="row" *****
  // Example HTML: <div id="posts" class="row"></div>
  const postsContainer = document.getElementById("posts");

  // Check if the container element exists
  if (!postsContainer) {
    console.error(
      "CRITICAL: Could not find the posts container element with id='posts'."
    );
    return; // Stop execution if the container is missing
  }

  // **NEW**: Add a warning if the 'row' class is missing in the HTML
  if (!postsContainer.classList.contains("row")) {
    console.warn(
      "WARNING: The element with id='posts' is missing the 'row' class. Cards will likely stack vertically. Please add class='row' to your <div id='posts'> in the HTML file for correct grid layout."
    );
    // You could force it here, but it's better practice to fix the HTML:
    // postsContainer.classList.add('row');
  }

  /**
   * Fetches posts from the API and renders them as cards in the postsContainer.
   */
  function fetchPosts() {
    const apiUrl = `https://ffp.hdr-it.de/api/posts/all`;

    // Indicate loading state (optional)
    // postsContainer.innerHTML = '<div class="col-12 text-center"><p>Loading posts...</p></div>';

    fetch(apiUrl)
      .then((response) => {
        // Check for HTTP errors
        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        // Clear existing posts/loading indicator
        postsContainer.innerHTML = "";

        // Check if the received data is an array
        if (!Array.isArray(data)) {
          console.error("Error: Fetched data is not an array.", data);
          postsContainer.innerHTML =
            "<div class='col-12'><p class='text-warning'>Could not load posts (invalid data format).</p></div>";
          return;
        }

        // Check if there are any posts
        if (data.length === 0) {
          postsContainer.innerHTML =
            "<div class='col-12'><p>No posts found.</p></div>";
          return;
        }

        // Iterate and create cards
        data.forEach((item) => {
          // 1. Create column wrapper div
          const columnDiv = document.createElement("div");
          // These classes ensure 3 cards/row (lg), 2 (md), 1 (sm/xs)
          columnDiv.classList.add(
            "col-lg-4",
            "col-md-6",
            "mb-4",
            "justify-content-center",
            "align-items-center"
          ); // <--- This defines the grid behavior

          // 2. Create the main card element
          const cardDiv = document.createElement("div");
          cardDiv.classList.add("card", "h-150");

          // Prepare data with fallbacks
          const imageUrl =
            item.displayUrl || "path/to/your/placeholder-image.jpg";
          const imageAlt = item.alt || "Post image";
          const postUrl = item.url || "#";
          const fullCaption = item.caption || "No caption available.";
          const potentialTitle = item.caption
            ? item.caption.split(" ")[1]
            : "Untitled Post";
          const formattedDate = formatISODate(item.timestamp);
          const words = fullCaption.split(" ");
          let truncatedCaption = words.slice(0, 50).join(" ");
          let readMoreLink = "";

          if (words.length > 50) {
            readMoreLink = `<a href="#" class="read-more" data-full-caption="${encodeURIComponent(
              fullCaption
            )}">Read More</a>`;
            truncatedCaption += "... ";
          }

          // 3. Construct card inner HTML
          cardDiv.innerHTML = `
            <img
              src="${imageUrl}"
              class="card-img-top"
              alt="${imageAlt}"
              style="object-fit: cover; height: 300px; width: 100%;"
              onerror="this.onerror=null; this.src='path/to/your/placeholder-image.jpg';"
            />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">
                <a href="${postUrl}" ${
            postUrl !== "#" ? 'target="_blank" rel="noopener noreferrer"' : ""
          }>${potentialTitle}</a>
              </h5>
              <p class="card-text mb-auto">${truncatedCaption}${readMoreLink}</p>
            </div>
            ${
              formattedDate
                ? `
            <div class="card-footer">
              <small class="text-muted">${formattedDate}</small>
            </div>`
                : ""
            }
          `;
          // 3.1 Add click event to open post URL in new tab
          const cardImage = cardDiv.querySelector(".card-img-top");
          cardImage.addEventListener("click", () => {
            window.open(cardImage.src, "_blank");
          });

          // 3.2 Add click event to read more link
          document.addEventListener("click", (event) => {
            if (event.target.classList.contains("read-more")) {
              event.preventDefault(); // Prevent default link behavior
              const fullCaption = decodeURIComponent(
                event.target.dataset.fullCaption
              );
              const captionParagraph = event.target.parentElement;
              captionParagraph.textContent = fullCaption; // Replace truncated caption
            }
          });

          // 4. Append card to column, column to container
          columnDiv.appendChild(cardDiv);
          postsContainer.appendChild(columnDiv);
        });
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen oder Verarbeiten der Daten:", error);
        postsContainer.innerHTML = `<div class="col-12"><p class="alert alert-danger">Leider konnten die Beiträge nicht geladen werden. Bitte versuchen Sie es später erneut. (${error.message})</p></div>`;
      });
  }

  // Initial call to load posts
  fetchPosts();
});
