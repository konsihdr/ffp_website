(function () {
  const container = document.getElementById('beitrag');
  if (!container) return;

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

  function getPostCode() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('id');
    return code && /^[A-Za-z0-9_-]+$/.test(code) ? code : null;
  }

  function renderEmpty(message) {
    container.innerHTML = `
      <div class="section post-detail-empty">
        <p></p>
        <a class="btn btn-secondary" href="/aktuelles/">Zurück zu Aktuelles</a>
      </div>
    `;
    container.querySelector('.post-detail-empty p').textContent = message;
  }

  function renderPost(item) {
    const isVideo = item.media_type === 'video';
    const mediaUrl = item.display_url || item.media_url || '/assets/img/placeholder.jpeg';
    const dateText = formatISODate(item.post_date);
    const caption = item.caption || 'Kein Text vorhanden.';

    const titleSource = item.caption ? item.caption.split('\n')[0] : 'Beitrag';
    const pageTitle = (titleSource.length > 70 ? titleSource.slice(0, 70) + '…' : titleSource) + ' | Aktuelles | Feuerwehr Poettmes';
    document.title = pageTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', caption.slice(0, 160));
    }

    container.innerHTML = `
      <div class="desktop-row">
        <article class="section post-detail-media-card">
          ${isVideo
            ? `<video class="post-detail-media" controls playsinline><source src="${mediaUrl}" type="video/mp4"></video>`
            : `<a class="post-media-link" href="${mediaUrl}" target="_blank" rel="noopener noreferrer"><img class="post-detail-media" src="${mediaUrl}" alt=""></a>`}
        </article>
        <div class="section post-detail-text-card">
          ${dateText ? `<div class="post-date"></div>` : ''}
          <p class="post-detail-caption"></p>
          <div class="actions">
            ${item.url ? `<a class="btn btn-secondary" href="${item.url}" target="_blank" rel="noopener noreferrer">Original auf Instagram ansehen</a>` : ''}
            <a class="btn btn-secondary" href="/aktuelles/">Zurück zu Aktuelles</a>
          </div>
        </div>
      </div>
    `;

    const dateEl = container.querySelector('.post-date');
    if (dateEl) dateEl.textContent = dateText;
    container.querySelector('.post-detail-caption').textContent = caption;
    const imgEl = container.querySelector('img.post-detail-media');
    if (imgEl) imgEl.alt = item.alt || 'Beitragsbild';
  }

  async function loadPost() {
    const code = getPostCode();
    if (!code) {
      renderEmpty('Kein gültiger Beitrag angegeben.');
      return;
    }

    container.innerHTML = '<div class="section post-detail-empty"><p>Beitrag wird geladen ...</p></div>';

    try {
      const response = await window.ffpSupabase.request('ffp_posts', {
        select: 'alt,caption,url,display_url,media_url,media_type,post_date',
        short_code: `eq.${code}`,
        limit: '1'
      });
      if (!response.ok) throw new Error('API request failed');
      const posts = await response.json();

      if (!posts.length) {
        renderEmpty('Dieser Beitrag wurde nicht gefunden.');
        return;
      }

      renderPost(posts[0]);
    } catch (e) {
      renderEmpty('Beitrag konnte nicht geladen werden. Bitte später erneut versuchen.');
    }
  }

  loadPost();
})();
