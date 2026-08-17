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

    const isVideo = item.media_type === 'video';
    const mediaUrl = item.display_url || item.media_url || '/assets/img/placeholder.jpeg';
    const dateText = formatISODate(item.post_date);
    const fullCaption = item.caption || 'Kein Text vorhanden.';
    const words = fullCaption.split(' ');
    const shortCaption = words.slice(0, 40).join(' ') + (words.length > 40 ? '...' : '');
    const titleText = words.slice(0, 4).join(' ') || 'Aktueller Beitrag';
    const detailUrl = `/aktuelles/beitrag/?id=${encodeURIComponent(item.short_code)}`;

    card.innerHTML = `
      <a class="post-media-link" href="${detailUrl}" aria-hidden="true" tabindex="-1">
        ${isVideo
          ? `<video class="post-media" preload="auto" muted playsinline webkit-playsinline><source src="${mediaUrl}" type="video/mp4"></video>`
          : `<img class="post-media" src="${mediaUrl}" alt="Post" loading="lazy">`}
      </a>
      <div class="post-body">
        <h3 class="post-title"><a href="${detailUrl}">${titleText}</a></h3>
        <p class="post-text">${shortCaption}</p>
        ${dateText ? `<div class="post-date">${dateText}</div>` : ''}
      </div>
    `;

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

  async function loadPosts() {
    postsContainer.innerHTML = '<article class="post-card"><div class="post-body"><p class="post-text">Lade aktuelle Beitraege ...</p></div></article>';
    try {
      const response = await window.ffpSupabase.request('ffp_posts', {
        select: 'short_code,caption,url,display_url,media_url,media_type,post_date',
        order: 'post_date.desc',
        limit: '8'
      });
      if (!response.ok) throw new Error('API request failed');
      const posts = await response.json();

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
