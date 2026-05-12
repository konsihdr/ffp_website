(function () {
  const SUPABASE_URL = 'https://koiiyudncovsnxikerpe.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvaWl5dWRuY292c254aWtlcnBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjk5MTksImV4cCI6MjA4OTYwNTkxOX0.tpCgwr8-feRMeQ6B0pUxUUm_wWyr6Kup9W9f3N_cgNs';

  window.ffpSupabase = {
    request(table, params) {
      const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
      Object.entries(params || {}).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });

      return fetch(url.toString(), {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
    }
  };
})();
