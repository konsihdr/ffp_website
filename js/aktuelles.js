(function () {
  const postsContainer = document.getElementById('posts');
  if (!postsContainer) return;

  function formatISODate(isoDate) {
    if (!isoDate) return '';
    try {
      return new Date(isoDate).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return '';
    }
  }

  function toPostCard(item) {
    const card = document.createElement('article');
    card.className = 'post-card';

    const isVideo = item.video && item.video.length > 0;
    const mediaUrl = item.displayUrl || '/assets/img/placeholder.jpeg';
    const dateText = formatISODate(item.postDate);
    const fullCaption = item.caption || 'Kein Text vorhanden.';
    const words = fullCaption.split(' ');
    const shortCaption = words.slice(0, 40).join(' ') + (words.length > 40 ? '...' : '');
    const titleText = words.slice(0, 4).join(' ') || 'Aktueller Beitrag';
    const postUrl = item.url || '';

    card.innerHTML = `
      ${isVideo
        ? `<video class="post-media" preload="auto" muted playsinline webkit-playsinline><source src="${mediaUrl}" type="video/mp4"></video>`
        : `<img class="post-media" src="${mediaUrl}" alt="Post" loading="lazy">`}
      <div class="post-body">
        <h3 class="post-title">${postUrl ? `<a href="${postUrl}" target="_blank" rel="noopener noreferrer">${titleText}</a>` : titleText}</h3>
        <p class="post-text">${shortCaption}</p>
        ${dateText ? `<div class="post-date">${dateText}</div>` : ''}
      </div>
    `;

    const mediaEl = card.querySelector('.post-media');
    if (mediaEl) {
      mediaEl.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        pauseInlineVideos();
        showLightbox(mediaUrl, isVideo ? 'video' : 'image', fullCaption);
      });
    }

    if (isVideo) {
      const inlineVideo = card.querySelector('video.post-media');
      if (inlineVideo) {
        // Force preload on mobile so the card has media content without prior user interaction.
        inlineVideo.muted = true;
        inlineVideo.playsInline = true;
        inlineVideo.load();
      }
    }

    return card;
  }

  function pauseInlineVideos() {
    document.querySelectorAll('#posts video.post-media').forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });
  }

  function showLightbox(mediaUrl, mediaType, caption) {
    const existing = document.getElementById('media-lightbox');
    if (existing) {
      const existingVideo = existing.querySelector('video');
      if (existingVideo) {
        existingVideo.pause();
        existingVideo.currentTime = 0;
      }
      existing.remove();
    }

    const lightbox = document.createElement('div');
    lightbox.id = 'media-lightbox';
    lightbox.className = 'media-lightbox';

    const mediaMarkup = mediaType === 'video'
      ? `<video controls autoplay class="lightbox-media"><source src="${mediaUrl}" type="video/mp4"></video>`
      : `<img src="${mediaUrl}" class="lightbox-media" alt="Post media">`;

    lightbox.innerHTML = `
      <div class="lightbox-content">
        <span class="lightbox-close">&times;</span>
        ${mediaMarkup}
        ${caption ? `<p class="lightbox-caption">${caption}</p>` : ''}
      </div>
    `;

    document.body.appendChild(lightbox);

    const closeLightbox = () => {
      const lightboxVideo = lightbox.querySelector('video');
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
      }
      document.removeEventListener('keydown', escHandler);
      lightbox.remove();
    };

    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.onclick = closeLightbox;
    lightbox.onclick = (e) => {
      if (e.target === lightbox) closeLightbox();
    };

    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  async function loadPosts() {
    postsContainer.innerHTML = '<article class="post-card"><div class="post-body"><p class="post-text">Lade aktuelle Beitraege ...</p></div></article>';
    try {
      const apiUrl = 'https://base.hdr-it.de/api/collections/ffp_posts/records?sort=-postDate&perPage=8';
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      const posts = data.items || [];

      postsContainer.innerHTML = '';

      if (!posts.length) {
        postsContainer.innerHTML = '<article class="post-card"><div class="post-body"><p class="post-text">Keine Beitraege gefunden.</p></div></article>';
        return;
      }

      posts.forEach((item) => postsContainer.appendChild(toPostCard(item)));
    } catch (e) {
      postsContainer.innerHTML = '<article class="post-card"><div class="post-body"><p class="post-text">Beitraege konnten nicht geladen werden. Bitte spaeter erneut versuchen.</p></div></article>';
    }
  }

  loadPosts();
})();
