import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Send, CheckCircle2, AlertTriangle, Loader2, Info, ShieldCheck } from 'lucide-react';

const CATEGORIES = [
  { value: 'signup_issue', label: '🔐 Signup or Login Problem' },
  { value: 'bug', label: '🐛 Bug or Glitch in the App' },
  { value: 'account', label: '👤 Account & Profile' },
  { value: 'billing', label: '💳 Subscription & Billing' },
  { value: 'feature_request', label: '💡 Feature Request / Feedback' },
  { value: 'other', label: '💬 General Inquiry / Other' }
];

export default function SupportForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'signup_issue',
    subject: '',
    message: '',
    deviceInfo: '',
    appVersion: '',
    honeypot: '' // Anti-bot trap
  });

  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-detect basic device / browser info for convenience
  useEffect(() => {
    try {
      const userAgent = navigator.userAgent;
      let detectedOS = 'Unknown Device';
      if (/iPhone|iPad|iPod/.test(userAgent)) detectedOS = 'iOS Device';
      else if (/Android/.test(userAgent)) detectedOS = 'Android Device';
      else if (/Macintosh|Mac OS X/.test(userAgent)) detectedOS = 'macOS';
      else if (/Windows/.test(userAgent)) detectedOS = 'Windows PC';
      else if (/Linux/.test(userAgent)) detectedOS = 'Linux';

      setFormData((prev) => ({
        ...prev,
        deviceInfo: detectedOS
      }));
    } catch {
      // Ignore if unavailable
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Honeypot check (bots fill hidden fields)
    if (formData.honeypot) {
      console.warn('Bot submission prevented.');
      setSubmittedTicket({ id: 'ref-verified' });
      return;
    }

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please provide a valid email address so we can reply.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        category: formData.category,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        device_info: formData.deviceInfo.trim() || null,
        app_version: formData.appVersion.trim() || null,
        status: 'open',
        priority: formData.category === 'signup_issue' || formData.category === 'bug' ? 'high' : 'normal'
      };

      const { data, error } = await supabase
        .from('support_tickets')
        .insert([payload])
        .select('id, created_at')
        .single();

      if (error) {
        throw error;
      }

      setSubmittedTicket(data || { id: 'submitted' });
    } catch (err) {
      console.error('Error submitting support ticket:', err);
      setErrorMessage(
        err.message || 'Something went wrong submitting your request. Please try again or check back shortly.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setFormData((prev) => ({
      ...prev,
      subject: '',
      message: '',
      appVersion: '',
      honeypot: ''
    }));
  };

  return (
    <section className="form-section" id="contact">
      <div className="form-container">
        {submittedTicket ? (
          <div className="success-card">
            <div className="success-icon-badge">
              <CheckCircle2 size={40} className="icon-success" />
            </div>
            <h2>We Received Your Request!</h2>
            <p className="success-subtext">
              Thank you for reaching out. We have logged your ticket and our team will get back to you at{' '}
              <strong>{formData.email}</strong> as soon as possible.
            </p>

            {submittedTicket.id && (
              <div className="ticket-ref-box">
                <span className="ref-label">Reference ID</span>
                <code className="ref-code">
                  {submittedTicket.id.length > 12
                    ? submittedTicket.id.substring(0, 13).toUpperCase()
                    : submittedTicket.id}
                </code>
              </div>
            )}

            <div className="success-guidance">
              <ShieldCheck size={18} />
              <span>Please keep an eye on your inbox (and spam folder) for our response.</span>
            </div>

            <button type="button" onClick={handleReset} className="btn-secondary">
              Submit Another Request
            </button>
          </div>
        ) : (
          <div className="form-card">
            <div className="form-header">
              <h2>Send us a Message</h2>
              <p>
                Having trouble signing up, found a bug, or have a question? Leave a message below and we’ll get back to you shortly.
              </p>
            </div>

            {errorMessage && (
              <div className="error-banner">
                <AlertTriangle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="support-form" noValidate>
              {/* Anti-spam honeypot (hidden from humans) */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input
                  type="text"
                  name="honeypot"
                  tabIndex="-1"
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    Your Name <span className="required-star">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. Alex Johnson"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Your Email <span className="required-star">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <span className="input-hint">We will send our reply to this address</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">
                    Issue Category <span className="required-star">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    Subject <span className="required-star">*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Brief summary of the issue"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  How can we help? (Detailed Description) <span className="required-star">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Please describe what happened, steps to reproduce, or what you need help with..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row optional-row">
                <div className="form-group">
                  <label htmlFor="deviceInfo">
                    Device / Platform <span className="optional-tag">(Optional)</span>
                  </label>
                  <input
                    id="deviceInfo"
                    name="deviceInfo"
                    type="text"
                    placeholder="e.g. iPhone 15 Pro, iOS 17.5"
                    value={formData.deviceInfo}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="appVersion">
                    Oruv App Version <span className="optional-tag">(Optional)</span>
                  </label>
                  <input
                    id="appVersion"
                    name="appVersion"
                    type="text"
                    placeholder="e.g. 1.2.0 (if known)"
                    value={formData.appVersion}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-footer">
                <div className="privacy-badge">
                  <Info size={14} />
                  <span>Your email is safe and will only be used to respond to this inquiry.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-submit"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="spinner" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
