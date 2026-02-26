export default async function handler(req, res) {
  const originalUrl = req.query.url;
  if (!originalUrl || !originalUrl.startsWith('http')) {
    return res.status(400).send('URL inválida');
  }

  try {
    const response = await fetch(originalUrl, {
      headers: { 'User-Agent': 'Bx-Protector' }
    });
    if (!response.ok) throw new Error('Error HTTP');
    const text = await response.text();
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.status(200).send(text);
  } catch (e) {
    res.status(500).send('Error al cargar el script');
  }
}
