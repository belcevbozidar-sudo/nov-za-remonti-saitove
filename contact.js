export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, business } = req.body;

  if (!phone || !business) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const now = new Date().toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' });
  const text =
    `🔨 <b>Ново запитване – МайсторСайт</b>\n\n` +
    `📞 <b>Телефон:</b> ${phone}\n` +
    `💼 <b>Бизнес:</b> ${business}\n` +
    `🕐 <b>Час:</b> ${now}`;

  const tgRes = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    }
  );

  if (!tgRes.ok) {
    const err = await tgRes.text();
    return res.status(500).json({ error: 'Telegram error', detail: err });
  }

  return res.status(200).json({ ok: true });
}
