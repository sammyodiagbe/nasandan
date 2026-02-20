export const siteConfig = {
  name: 'Nasandan Rentals',
  description: 'Your trusted partner for quality car rentals. Affordable rates, reliable vehicles, and exceptional service.',
  url: 'https://nasandanrentals.com',
  phone: '1-800-NAS-RENT',
  email: 'info@nasandanrentals.com',
  address: {
    street: '123 Downtown Ave',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
  },
  hours: {
    weekday: '8:00 AM - 6:00 PM',
    weekend: '9:00 AM - 5:00 PM',
  },
  social: {
    facebook: 'https://facebook.com/nasandanrentals',
    twitter: 'https://twitter.com/nasandanrentals',
    instagram: 'https://instagram.com/nasandanrentals',
  },
};

export const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'Vehicles', href: '/vehicles' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  account: [
    { name: 'My Account', href: '/account' },
    { name: 'My Bookings', href: '/account/bookings' },
    { name: 'Look Up Booking', href: '/booking/lookup' },
  ],
  admin: [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Vehicles', href: '/admin/vehicles' },
    { name: 'Bookings', href: '/admin/bookings' },
  ],
  footer: {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Locations', href: '/locations' },
    ],
    support: [
      { name: 'FAQs', href: '/faq' },
      { name: 'Booking Help', href: '/help' },
      { name: 'Look Up Booking', href: '/booking/lookup' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Rental Agreement', href: '/agreement' },
    ],
  },
};
