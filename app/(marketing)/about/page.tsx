import { Container } from '@/components/shared';
import { Users, Award, MapPin, Clock, Heart, Shield, Zap, Car, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us - Nasandan Rentals',
  description: 'Learn about Nasandan Rentals, your trusted partner for quality car rentals.',
};

export default function AboutPage() {
  const stats = [
    { value: '15+', label: 'Years Experience' },
    { value: '50+', label: 'Vehicles in Fleet' },
    { value: '10K+', label: 'Happy Customers' },
    { value: '4', label: 'Locations' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction is our top priority. We go above and beyond to meet your needs.',
    },
    {
      icon: Shield,
      title: 'Quality Fleet',
      description: 'Every vehicle in our fleet is regularly maintained and inspected for your safety.',
    },
    {
      icon: MapPin,
      title: 'Local Presence',
      description: "With multiple locations, we're always nearby when you need us.",
    },
    {
      icon: Zap,
      title: '24/7 Support',
      description: 'Our support team is available around the clock to assist you.',
    },
  ];

  const timeline = [
    { year: '2010', title: 'The Beginning', description: 'Started with just 5 vehicles and a dream to serve our community.' },
    { year: '2014', title: 'First Expansion', description: 'Opened our second location and grew our fleet to 20 vehicles.' },
    { year: '2018', title: 'Going Digital', description: 'Launched online booking system, making rentals easier than ever.' },
    { year: '2024', title: 'Industry Leader', description: '50+ vehicles, 4 locations, and thousands of happy customers.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-[72px] relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1449965408869-euj1f85aefbf?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c2340]/95 via-[#0c2340]/90 to-[#0c2340]/80" />

        <Container className="relative">
          <div className="py-20 md:py-28 max-w-3xl">
            <p className="text-[#ff6b5b] font-semibold text-sm uppercase tracking-wide mb-3">
              About us
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Driving your journey forward since 2010
            </h1>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed">
              We&apos;ve been providing quality car rentals to our community for over 15 years.
              Our mission is to make car rental simple, affordable, and reliable.
            </p>
          </div>
        </Container>
      </div>

      {/* Stats Section */}
      <section className="py-16 border-b border-slate-200">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold text-[#ff6b5b] mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Content */}
            <div>
              <p className="text-[#ff6b5b] font-semibold text-sm uppercase tracking-wide mb-3">
                Our Story
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0c2340] mb-6">
                Building trust, one rental at a time
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Nasandan Rentals was founded with a simple goal: to provide our community with
                  reliable, affordable car rentals without the hassle. What started as a small
                  family business has grown into a trusted name in the car rental industry.
                </p>
                <p>
                  Today, we maintain a diverse fleet of well-maintained vehicles ranging from
                  economy cars to luxury SUVs. Our commitment to quality, transparency, and
                  customer service has earned us thousands of loyal customers.
                </p>
                <p>
                  We believe in treating every customer like family. That means no hidden fees,
                  no surprise charges, and always going the extra mile to ensure your rental
                  experience is smooth from start to finish.
                </p>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="bg-[#f7f5f2] rounded-3xl p-10 lg:p-12">
              <div className="w-16 h-16 bg-[#0c2340] rounded-2xl flex items-center justify-center mb-8">
                <Car className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#0c2340] mb-4">
                Family Owned & Operated
              </h3>
              <p className="text-slate-600 leading-relaxed mb-8">
                What started as a small family business with just five vehicles has grown into a trusted name in the car rental industry. We still maintain those family values in everything we do.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-[#0c2340] border-2 border-white flex items-center justify-center"
                    >
                      <Users className="w-4 h-4 text-white" />
                    </div>
                  ))}
                </div>
                <span className="text-slate-500 text-sm">Join 10,000+ happy customers</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Timeline Section */}
      <section className="py-20 md:py-28 bg-[#f7f5f2]">
        <Container>
          <div className="text-center mb-14">
            <p className="text-[#ff6b5b] font-semibold text-sm uppercase tracking-wide mb-3">
              Our Journey
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0c2340]">
              Milestones along the way
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((item, index) => (
              <div
                key={item.year}
                className="bg-white rounded-2xl p-8 border border-slate-200 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="font-display text-3xl font-bold text-[#ff6b5b] mb-3">
                  {item.year}
                </div>
                <h3 className="font-display text-lg font-bold text-[#0c2340] mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="text-center mb-14">
            <p className="text-[#ff6b5b] font-semibold text-sm uppercase tracking-wide mb-3">
              What we stand for
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0c2340]">
              Our core values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-[#0c2340] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#ff6b5b] transition-colors">
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#0c2340] mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-[#0c2340]/90" />

        <Container className="relative">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to experience the difference?
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Join thousands of satisfied customers who trust us with their journeys.
            </p>
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff6b5b] hover:bg-[#e85a4a] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#ff6b5b]/20"
            >
              Browse Our Fleet
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
