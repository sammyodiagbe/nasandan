import Link from 'next/link';
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin, Car, ArrowRight } from 'lucide-react';
import { Container } from '@/components/shared/Container';
import { siteConfig, navigation } from '@/config/site';

export function Footer() {
  return (
    <footer className="bg-[#0c2340] text-white">
      {/* CTA Section */}
      <div className="border-b border-white/10 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c2340] via-transparent to-[#0c2340]" />

        <Container className="relative">
          <div className="py-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                Ready to hit the road?
              </h3>
              <p className="text-white/60 text-lg">
                Book your perfect rental car today and save up to 25%
              </p>
            </div>
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff6b5b] hover:bg-[#e85a4a] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#ff6b5b]/20"
            >
              Browse Vehicles
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </Container>
      </div>

      {/* Main Footer Content */}
      <Container>
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#ff6b5b] rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">Nasandan</span>
            </div>
            <p className="text-white/60 leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: siteConfig.social.facebook },
                { icon: Twitter, href: siteConfig.social.twitter },
                { icon: Instagram, href: siteConfig.social.instagram },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label={`Follow us`}
                >
                  <social.icon className="h-5 w-5 text-white/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Company</h4>
            <ul className="space-y-4">
              {navigation.footer.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-4">
              {navigation.footer.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-[#ff6b5b]" />
                <span className="text-white/60">
                  {siteConfig.address.street}<br />
                  {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zipCode}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-[#ff6b5b]" />
                <a href={`tel:${siteConfig.phone}`} className="text-white/60 hover:text-white transition-colors">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-[#ff6b5b]" />
                <a href={`mailto:${siteConfig.email}`} className="text-white/60 hover:text-white transition-colors">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {navigation.footer.legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
