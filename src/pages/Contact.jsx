import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CONTACT_ITEMS = [
  { icon: MapPin, label: 'Address', value: 'Vanguard Stadium, 1 Club Road\nFC City, FC 12345' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 000-1234' },
  { icon: Mail, label: 'Email', value: 'info@fcvanguard.com' },
  { icon: Clock, label: 'Office Hours', value: 'Mon–Fri: 9am – 5pm\nMatchdays: 8am – 10pm' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (WEB3FORMS_ACCESS_KEY) {
        const payload = {
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: form.subject || 'Contact Form Submission',
          name: form.name,
          email: form.email,
          message: form.message,
          data: { source: 'Football Club Website' },
        };

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        if (res.ok && json.success) {
          toast.success('Message sent successfully!');
          setSent(true);
          setForm({ name: '', email: '', subject: '', message: '' });
        } else {
          throw new Error(json.message || 'Submission failed.');
        }
      } else {
        await api.post('/contact', form);
        toast.success('Message sent successfully!');
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative h-52 md:h-64 bg-navy-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=60')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative text-center">
          <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-2">Get In Touch</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white uppercase tracking-wide">Contact Us</h1>
        </div>
      </div>

      <section className="py-16 bg-white dark:bg-navy-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: info */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="section-title mb-2">We'd Love to <span className="section-title-accent">Hear</span> From You</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Whether it's about tickets, partnerships, or just to say hello – our team is ready for you.</p>

              <div className="space-y-5 mb-10">
                {CONTACT_ITEMS.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-gold-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-gold-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">{label}</p>
                      <p className="text-gray-700 dark:text-gray-200 text-sm whitespace-pre-line">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="rounded-xl overflow-hidden h-56 bg-gray-100 dark:bg-navy-800 shadow-lg">
                <iframe
                  title="Club Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-0.1746%2C51.4975%2C-0.1506%2C51.5115&layer=mapnik"
                  allowFullScreen
                />
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
              {sent ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-16">
                  <CheckCircle size={56} className="text-green-500" />
                  <h3 className="font-heading text-2xl text-navy-900 dark:text-white">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn-primary mt-2">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-heading text-2xl text-navy-900 dark:text-white uppercase mb-6">Send a Message</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Your Name</label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="John Smith" className="admin-input" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="john@example.com" className="admin-input" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Subject</label>
                    <input name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" className="admin-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={6} placeholder="Your message here..." className="admin-input resize-none" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                    {loading ? <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" /> : <Send size={16} />}
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
