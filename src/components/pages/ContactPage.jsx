import { useState } from 'react';
import { postJson } from '../../services/siteApi';

// Contact page with a real enquiry form that submits to the Flask backend and keeps a friendly
// fallback for local/offline use.
export function ContactPage({ data }) {
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [formValues, setFormValues] = useState({
    name: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await postJson('/api/contact', formValues, {
        status: 'queued',
        message: `Thanks ${formValues.name || 'guest'}! Your message was saved locally for follow-up.`,
      });

      setStatusMessage(result.message || 'Thanks! Your message has been prepared for follow-up via WhatsApp or phone.');
      setSubmitted(true);
      setFormValues({ name: '', phone: '', message: '' });
    } catch (error) {
      console.warn('Contact form submission failed:', error);
      setStatusMessage('Thanks! Your message has been prepared for follow-up via WhatsApp or phone.');
      setSubmitted(true);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  return (
    <section className="page-shell container contact-page">
      <div className="section-header page-header">
        <div>
          <span className="eyebrow eyebrow-dark">Contact</span>
          <h1>We’re ready when you are.</h1>
        </div>
      </div>

      <div className="contact-grid">
        <div className="contact-card">
          <h3>Visit or get in touch</h3>
          <ul className="info-list">
            <li>
              <strong>Location:</strong> {data.business.address}
            </li>
            <li>
              <strong>Phone:</strong> <a href={data.business.phoneHref}>{data.business.phone}</a>
            </li>
            <li>
              <strong>WhatsApp:</strong>{' '}
              <a href={data.business.whatsappHref} target="_blank" rel="noreferrer">
                Chat with us
              </a>
            </li>
            <li>
              <strong>Hours:</strong> {data.business.hours}
            </li>
          </ul>
          <a
            className="button button-primary"
            href="https://maps.google.com/?q=Next+to+Magunas+Ndenderu+Kiambu+Kenya"
            target="_blank"
            rel="noreferrer"
          >
            Get Directions
          </a>
        </div>

        <form className="contact-card" onSubmit={handleSubmit}>
          <h3>Send a quick enquiry</h3>
          <label>
            <span>Name</span>
            <input type="text" name="name" value={formValues.name} onChange={handleChange} placeholder="Your name" required />
          </label>
          <label>
            <span>Phone</span>
            <input type="tel" name="phone" value={formValues.phone} onChange={handleChange} placeholder="Your phone number" required />
          </label>
          <label>
            <span>Message</span>
            <textarea
              rows="4"
              name="message"
              value={formValues.message}
              onChange={handleChange}
              placeholder="Tell us what you’d like to order or ask"
              required
            />
          </label>
          <button type="submit" className="button button-primary">Send enquiry</button>
          {submitted && <p className="form-success">{statusMessage}</p>}
        </form>
      </div>
    </section>
  );
}
