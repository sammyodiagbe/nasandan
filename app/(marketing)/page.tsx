import { Hero, FeaturedVehicles, ValueProps } from '@/components/home';
import { Container } from '@/components/shared';
import { Star, Quote } from 'lucide-react';

export default function HomePage() {
  const testimonials = [
    {
      name: 'Sarah M.',
      location: 'Los Angeles',
      text: 'Best car rental experience I\'ve ever had. The booking was seamless and the car was in perfect condition.',
      rating: 5,
    },
    {
      name: 'James K.',
      location: 'San Francisco',
      text: 'Great prices and excellent customer service. Will definitely be using Nasandan for all my future rentals.',
      rating: 5,
    },
    {
      name: 'Emily R.',
      location: 'San Diego',
      text: 'The whole process was so easy. Pick up and drop off took less than 10 minutes each. Highly recommend!',
      rating: 5,
    },
  ];

  return (
    <>
      <Hero />
      <FeaturedVehicles />
      <ValueProps />

      {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[#ff6b5b] font-semibold text-sm uppercase tracking-wide mb-2">
              Customer reviews
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0c2340]">
              What our customers say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#f7f5f2] rounded-2xl p-8 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Quote icon */}
                <div className="w-10 h-10 bg-[#ff6b5b]/10 rounded-xl flex items-center justify-center mb-6">
                  <Quote className="h-5 w-5 text-[#ff6b5b]" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-slate-600 leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div>
                  <p className="font-display font-semibold text-[#0c2340]">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-[#0c2340]/90" />

        <Container className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '100+', label: 'Vehicles Available' },
              { value: '15+', label: 'Years Experience' },
              { value: '4.9', label: 'Average Rating' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="font-display text-4xl md:text-5xl font-bold text-[#ff6b5b] mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
