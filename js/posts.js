/**
 * Formats an ISO date string into a German locale date string.
 * @param {string} isoDate - The ISO date string (e.g., "2023-10-27T10:00:00Z").
 * @returns {string} The formatted date string (e.g., "27. Oktober 2023") or an empty string if input is invalid.
 */
function formatISODate(isoDate) {
  if (!isoDate) {
    return "";
  }

  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", isoDate, e);
    return isoDate;
  }
}

/**
 * Creates and shows a lightbox modal for images and videos
 * @param {string} mediaUrl - The URL of the media to display
 * @param {string} mediaType - Either 'image' or 'video'
 * @param {string} caption - The caption/description
 */
function showLightbox(mediaUrl, mediaType, caption) {
  // Remove existing lightbox if any
  const existingLightbox = document.getElementById('media-lightbox');
  if (existingLightbox) {
    existingLightbox.remove();
  }

  // Create lightbox container
  const lightbox = document.createElement('div');
  lightbox.id = 'media-lightbox';
  lightbox.className = 'media-lightbox';

  let mediaElement;
  if (mediaType === 'video') {
    mediaElement = `
      <video controls autoplay class="lightbox-media">
        <source src="${mediaUrl}" type="video/mp4">
        Ihr Browser unterstützt das Video-Tag nicht.
      </video>
    `;
  } else {
    mediaElement = `<img src="${mediaUrl}" class="lightbox-media" alt="Post media">`;
  }

  lightbox.innerHTML = `
    <div class="lightbox-content">
      <span class="lightbox-close">&times;</span>
      ${mediaElement}
      ${caption ? `<p class="lightbox-caption">${caption}</p>` : ''}
    </div>
  `;

  document.body.appendChild(lightbox);

  // Close handlers
  const closeBtn = lightbox.querySelector('.lightbox-close');
  closeBtn.onclick = () => lightbox.remove();
  lightbox.onclick = (e) => {
    if (e.target === lightbox) {
      lightbox.remove();
    }
  };

  // ESC key to close
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      lightbox.remove();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
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
    // Indicate loading state (optional)
    // postsContainer.innerHTML = '<div class="col-12 text-center"><p>Loading posts...</p></div>';

    window.ffpSupabase.request("ffp_posts", {
      select: "alt,caption,url,display_url,media_url,media_type,post_date",
      order: "post_date.desc",
      limit: "12",
    })
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

        const posts = data || [];

        // Check if there are any posts
        if (posts.length === 0) {
          postsContainer.innerHTML =
            "<div class='col-12'><p>No posts found.</p></div>";
          return;
        }

        // Iterate and create cards
        posts.forEach((item) => {
          // 1. Create column wrapper div
          const columnDiv = document.createElement("div");
          columnDiv.classList.add(
            "col-lg-4",
            "col-md-6",
            "mb-4",
            "justify-content-center",
            "align-items-center"
          );

          // 2. Create the main card element
          const cardDiv = document.createElement("div");
          cardDiv.classList.add("card", "h-150");

          // Determine media type and URL
          const isVideo = item.media_type === "video";
          const mediaUrl = item.display_url || item.media_url || "assets/img/placeholder.png";
          const imageAlt = item.alt || "Post media";
          const postUrl = item.url || "#";
          const fullCaption = item.caption || "No caption available.";
          const potentialTitle = item.caption
            ? item.caption.split(" ")[1]
            : "Untitled Post";
          const formattedDate = formatISODate(item.post_date);
          const words = fullCaption.split(" ");
          let truncatedCaption = words.slice(0, 50).join(" ");
          let readMoreLink = "";

          if (words.length > 50) {
            readMoreLink = `<a href="#" class="read-more" data-full-caption="${encodeURIComponent(
              fullCaption
            )}">Weiterlesen</a>`;
            truncatedCaption += "... ";
          }

          // 3. Construct card inner HTML with proper media element
          let mediaElement;
          if (isVideo) {
            mediaElement = `
              <div class="card-media-wrapper" style="position: relative; cursor: pointer;">
                <video
                  class="card-img-top"
                  style="object-fit: cover; height: 300px; width: 100%;"
                  muted
                  loop
                  playsinline
                >
                  <source src="${mediaUrl}" type="video/mp4">
                  Ihr Browser unterstützt das Video-Tag nicht.
                </video>
                <div class="play-overlay">
                  <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 512 512" fill="currentColor"><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/></svg>
                </div>
              </div>
            `;
          } else {
            mediaElement = `
              <img
                src="${mediaUrl}"
                class="card-img-top"
                alt="${imageAlt}"
                style="object-fit: cover; height: 300px; width: 100%; cursor: pointer;"
                onerror="this.onerror=null; this.src='assets/img/placeholder.png';"
              />
            `;
          }

          cardDiv.innerHTML = `
            ${mediaElement}
            <hr class="my-4 mx-auto" />
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

          // 3.1 Add click event to open lightbox
          const mediaContainer = cardDiv.querySelector(isVideo ? '.card-media-wrapper' : '.card-img-top');
          mediaContainer.addEventListener("click", () => {
            showLightbox(mediaUrl, isVideo ? 'video' : 'image', fullCaption);
          });

          // 3.2 Hover effect for video preview
          if (isVideo) {
            const video = cardDiv.querySelector('video');
            mediaContainer.addEventListener('mouseenter', () => {
              video.play();
            });
            mediaContainer.addEventListener('mouseleave', () => {
              video.pause();
              video.currentTime = 0;
            });
          }

          // 3.3 Add click event to read more link
          const readMoreBtn = cardDiv.querySelector('.read-more');
          if (readMoreBtn) {
            readMoreBtn.addEventListener("click", (event) => {
              event.preventDefault();
              const fullCaption = decodeURIComponent(
                event.target.dataset.fullCaption
              );
              const captionParagraph = event.target.parentElement;
              captionParagraph.textContent = fullCaption;
            });
          }

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
