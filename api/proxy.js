export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const affinityUrl = 'https://api.affinity.co' + req.url.replace('/api/proxy', '');
  const apiKey = req.headers['x-affinity-key'];

  const response = await fetch(affinityUrl, {
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
