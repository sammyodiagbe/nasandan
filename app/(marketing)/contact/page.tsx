'use client';

import { useState } from 'react';
import { Container } from '@/components/shared';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useToast } from '@/lib/context';

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      content: `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.state} ${siteConfig.address.zipCode}`,
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: siteConfig.phone,
      href: `tel:${siteConfig.phone}`,
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: `Mon-Fri: ${siteConfig.hours.weekday} | Sat-Sun: ${siteConfig.hours.weekend}`,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-[72px] relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c2340]/95 via-[#0c2340]/90 to-[#0c2340]/80" />

        <Container className="relative">
          <div className="py-20 md:py-28 max-w-3xl">
            <p className="text-[#ff6b5b] font-semibold text-sm uppercase tracking-wide mb-3">
              Contact us
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Get in touch
            </h1>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed">
              Have questions about our vehicles or services? Our team is ready to help you find the perfect rental for your journey.
            </p>
          </div>
        </Container>
      </div>

      {/* Contact Info Cards */}
      <section className="py-16 border-b border-slate-200">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="bg-[#f7f5f2] rounded-2xl p-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-[#0c2340] rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display font-bold text-[#0c2340] mb-2">{item.title}</h3>
                {item.href ? (
                  <a href={item.href} className="text-slate-600 hover:text-[#ff6b5b] transition-colors text-sm">
                    {item.content}
                  </a>
                ) : (
                  <p className="text-slate-600 text-sm">{item.content}</p>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left - Info */}
            <div>
              <p className="text-[#ff6b5b] font-semibold text-sm uppercase tracking-wide mb-3">
                Let&apos;s talk
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0c2340] mb-6">
                We&apos;d love to hear from you
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                Whether you&apos;re planning a weekend getaway, a business trip, or need a reliable vehicle for any occasion, we&apos;re here to make your experience seamless.
              </p>

              <div className="bg-[#0c2340] rounded-2xl p-8">
                <h3 className="font-display text-xl font-bold text-white mb-6">
                  Quick contact
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#ff6b5b]" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Call us anytime</p>
                      <a href={`tel:${siteConfig.phone}`} className="text-white font-semibold hover:text-[#ff6b5b] transition-colors">
                        {siteConfig.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#ff6b5b]" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Email us at</p>
                      <a href={`mailto:${siteConfig.email}`} className="text-white font-semibold hover:text-[#ff6b5b] transition-colors">
                        {siteConfig.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#ff6b5b]" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Visit our office</p>
                      <p className="text-white font-semibold">{siteConfig.address.street}</p>
                      <p className="text-white/60 text-sm">{siteConfig.address.city}, {siteConfig.address.state}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div>
              <div className="bg-[#f7f5f2] rounded-2xl p-8 lg:p-10">
                <h3 className="font-display text-xl font-bold text-[#0c2340] mb-2">
                  Send us a message
                </h3>
                <p className="text-slate-600 text-sm mb-8">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-[#0c2340] mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-[#0c2340] focus:ring-4 focus:ring-[#0c2340]/5 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#0c2340] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-[#0c2340] focus:ring-4 focus:ring-[#0c2340]/5 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-[#0c2340] mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-[#0c2340] focus:ring-4 focus:ring-[#0c2340]/5 outline-none transition-all"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#0c2340] mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-[#0c2340] focus:ring-4 focus:ring-[#0c2340]/5 outline-none transition-all"
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#0c2340] mb-2">
                      Your Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-[#0c2340] focus:ring-4 focus:ring-[#0c2340]/5 outline-none transition-all resize-none"
                      placeholder="Tell us more about what you need..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-4 bg-[#ff6b5b] hover:bg-[#e85a4a] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#ff6b5b]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
