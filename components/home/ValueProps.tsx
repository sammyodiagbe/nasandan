import { Shield, Clock, DollarSign, Headphones, Zap, Award } from 'lucide-react';
import { Container } from '@/components/shared';

const valueProps = [
  {
    icon: DollarSign,
    title: 'Best Price Guarantee',
    description: 'Found a lower price? We\'ll match it and give you 10% off.',
  },
  {
    icon: Shield,
    title: 'Full Insurance Included',
    description: 'Drive worry-free with comprehensive coverage on every rental.',
  },
  {
    icon: Clock,
    title: '24/7 Customer Support',
    description: 'Our team is available around the clock to assist you.',
  },
  {
    icon: Zap,
    title: 'Instant Confirmation',
    description: 'Book in seconds and receive immediate confirmation.',
  },
  {
    icon: Award,
    title: 'Quality Fleet',
    description: 'Well-maintained, late-model vehicles you can rely on.',
  },
  {
    icon: Headphones,
    title: 'Free Cancellation',
    description: 'Plans changed? Cancel for free up to 24 hours before pickup.',
  },
];

export function ValueProps() {
  return (
    <section className="py-20 md:py-28 bg-[#f7f5f2]">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[#E8AC41] font-semibold text-sm uppercase tracking-wide mb-2">
            Why choose us
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0c2340] mb-4">
            The better way to rent a car
          </h2>
          <p className="text-slate-600 text-lg">
            We make renting a car simple, transparent, and hassle-free.
          </p>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valueProps.map((prop, index) => (
            <div
              key={prop.title}
              className="group bg-white rounded-2xl p-8 border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-[#0c2340] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#E8AC41] transition-colors">
                <prop.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#0c2340] mb-2">
                {prop.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
