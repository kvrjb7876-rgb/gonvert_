const { titles: REQUEST_TITLES, values: REQUEST_VALUES } = require('../assets/js/inquiry-options.js');

const clean = (value, max = 4000) => String(value || '').trim().slice(0, max);
const escapeHtml = value => clean(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' });
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (clean(body.website, 200)) return res.status(200).json({ ok: true });

  const sector = body.sector === 'Pharma' ? 'Pharma' : body.sector === 'Energy' ? 'Energy' : '';
  const email = clean(body.email, 254);
  const company = clean(body.company, 180);
  const name = clean(body.name, 180) || 'Not provided';
  const message = clean(body.message, 5000);
  const interest = clean(body.interest, 120);
  const formContext = clean(body.formContext, 40);
  const allowed = REQUEST_VALUES[sector];
  if (!sector || !allowed.has(interest)) return res.status(400).json({ message: 'Please choose a valid request type.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Please enter a valid email address.' });
  if (sector === 'Pharma' && formContext !== 'Corporate' && !company) return res.status(400).json({ message: 'Please enter your company.' });
  if (message.length < 10) return res.status(400).json({ message: 'Please provide a project description of at least 10 characters.' });

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM_EMAIL) {
    return res.status(503).json({ message: 'Online delivery is being configured. Please email info@gonvert.com directly.' });
  }

  const selected = REQUEST_TITLES[interest] || 'General Project Inquiry';
  const subjectCompany = sector === 'Pharma' && company ? ` — ${company}` : '';
  const subjectPrefix = formContext === 'Corporate' ? `GONVERT Corporate Inquiry — ${sector}` : `GONVERT ${sector} Inquiry`;
  const subject = `[${subjectPrefix}] ${selected}${subjectCompany}`;
  const rows = [
    ['Sector', sector], ['Name', name], ...(sector === 'Pharma' || formContext === 'Corporate' ? [['Company', company || 'Not provided']] : []),
    ['Visitor email', email], ['Selected request', selected], ['Source page', clean(body.source, 240)],
    ['Request category', clean(body.category, 80)], ['CTA origin', clean(body.origin, 80)], ['Message', message]
  ];
  const html = `<h2>${escapeHtml(subject)}</h2>${rows.map(([label,value]) => `<p><strong>${escapeHtml(label)}:</strong><br>${escapeHtml(value).replace(/\n/g,'<br>')}</p>`).join('')}`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL || 'info@gonvert.com',
      reply_to: email,
      subject,
      html
    })
  });
  if (!response.ok) return res.status(502).json({ message: 'Delivery failed. Please email info@gonvert.com directly.' });
  return res.status(200).json({ ok: true });
};
