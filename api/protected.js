export default async function handler(req, res) {
  const slug = req.query.s;
  if (!slug) return res.status(400).send('Invalid');

  let base64 = slug.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';

  let originalUrl;
  try {
    originalUrl = decodeURIComponent(atob(base64));
  } catch {
    return res.status(400).send('Invalid URL');
  }

  const ua = req.headers['user-agent'] || '';
  const isRoblox = /Roblox|RobloxStudio|rbx/i.test(ua);

  if (isRoblox) {
    try {
      const response = await fetch(originalUrl);
      if (!response.ok) throw new Error();
      const text = await response.text();
      res.setHeader('Content-Type', 'text/plain;charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).send(text);
    } catch {
      res.status(500).send('Failed to load script');
    }
  } else {
    // ACCESS DENIED EN INGLÉS (bonito como en tu imagen)
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.status(403).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Access Denied - Bx</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body class="bg-zinc-950 text-zinc-200 min-h-screen flex items-center justify-center">
  <div class="max-w-md text-center px-6">
    <div class="flex justify-center mb-8">
      <div class="w-24 h-24 bg-red-600/10 border border-red-500/30 rounded-3xl flex items-center justify-center">
        <i class="fas fa-lock text-red-500 text-7xl"></i>
      </div>
    </div>
    <h1 class="text-6xl font-bold tracking-tighter mb-2 text-red-500">ACCESS DENIED</h1>
    <div class="inline-flex items-center gap-3 bg-zinc-900 border border-red-500/30 px-6 py-3 rounded-3xl mb-8">
      <i class="fas fa-shield-halved text-red-500"></i>
      <p class="text-xl font-semibold">Script protected by <span class="text-red-500">Bx</span></p>
    </div>
    <p class="text-zinc-400 text-lg mb-10">This link only works in Roblox executors.<br>Use the protected loadstring from the Bx Protector page.</p>
    <a href="/" class="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 px-10 py-5 rounded-3xl text-lg font-semibold"><i class="fas fa-home"></i> Go to Bx Protector</a>
  </div>
</body>
</html>`);
  }
}
