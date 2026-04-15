export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'x-affinity-key, Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const apiKey = req.headers['x-affinity-key'];
  if (!apiKey) { res.status(400).json({ error: 'Missing key' }); return; }

  const qs = Object.entries(req.query)
    .filter(([k]) => k !== 'slug')
    .map(([k,v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  const slug = Array.isArray(req.query.slug) ? req.query.slug.join('/') : req.query.slug || '';
  const url = `https://api.affinity.co/${slug}${qs ? '?' + qs : ''}`;

  try {
    const r = await fetch(url, {
      headers: { 'Authorization': 'Bearer ' + apiKey }
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
