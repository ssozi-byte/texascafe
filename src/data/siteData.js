// Shared fallback data for the cafe website. This keeps the frontend working even if the Flask
// backend is temporarily unavailable and ensures the same content is reused across pages.
export const business = {
  name: 'Kim’s Texas Caffe',
  shortName: 'Texas Caffe',
  phone: '+254 796 999547',
  phoneHref: 'tel:+254796999547',
  whatsappHref: 'https://wa.me/254796999547',
  address: 'Next to Magunas, Ndenderu, Kiambu County, Kenya',
  description:
    'A casual neighbourhood café serving fresh coffee, iconic comfort meals and easy family-friendly dining in Ndenderu.',
  hours: 'Mon - Sun • 8:00 AM - 11:00 PM',
};

export const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'About', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Offers', to: '/offers' },
  { label: 'Contact', to: '/contact' },
  { label: 'Dashboard', to: '/admin' },
];

export const heroSlides = [
  {
    title: 'Good Food. Great Moments.',
    subtitle: 'Fresh coffee, hearty meals and laid-back vibes in the heart of Ndenderu.',
    image:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Brewed for busy mornings.',
    subtitle:
      'Start strong with smooth espresso, creamy cappuccinos and breakfast favourites made for everyday routines.',
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Comfort food that feels like home.',
    subtitle:
      'From juicy burgers to loaded shawarma, every plate is crafted to satisfy cravings and spark conversations.',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
  },
];

export const categories = [
  'Coffee & Hot Drinks',
  'Fresh Juices & Cold Drinks',
  'Burgers & Quick Bites',
  'Main Meals',
  'Pizza & Grills',
  'Desserts & Treats',
];

export const menuItems = [
  { id: 1, name: 'Cappuccino', category: 'Coffee & Hot Drinks', price: 'KSh 420', description: 'A rich espresso-based coffee with velvety foam and a smooth finish.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80', featured: true },
  { id: 2, name: 'Mango Burst', category: 'Fresh Juices & Cold Drinks', price: 'KSh 350', description: 'Fresh mango juice blended with a citrus twist for a vibrant, refreshing sip.', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80', featured: true },
  { id: 3, name: 'Texas Burger', category: 'Burgers & Quick Bites', price: 'KSh 680', description: 'Juicy beef patty, crisp lettuce, tomato and signature sauce in a toasted bun.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80', featured: true },
  { id: 4, name: 'Chicken Shawarma', category: 'Main Meals', price: 'KSh 520', description: 'Loaded with grilled chicken, fresh veg and a creamy garlic sauce wrapped to perfection.', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=80', featured: false },
  { id: 5, name: 'Beef Pizza', category: 'Pizza & Grills', price: 'KSh 1,250', description: 'Stone-baked pizza with mozzarella, beef slices and a rich tomato base.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80', featured: true },
  { id: 6, name: 'Mixed Grill Platter', category: 'Pizza & Grills', price: 'KSh 1,700', description: 'A hearty platter with grilled chicken, beef, chips and a side of fresh salad.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80', featured: false },
  { id: 7, name: 'Vanilla Cheesecake', category: 'Desserts & Treats', price: 'KSh 430', description: 'Smooth, creamy and indulgent with a wafer crumb base and silky vanilla finish.', image: 'https://images.unsplash.com/photo-1533134242443-d6adb086179d?auto=format&fit=crop&w=900&q=80', featured: false },
  { id: 8, name: 'Lemonade Spritz', category: 'Fresh Juices & Cold Drinks', price: 'KSh 300', description: 'House-made lemonade with a bright citrus kick and a refreshing finish.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f2b0c1d4?auto=format&fit=crop&w=900&q=80', featured: false },
];

export const offers = [
  { title: 'Midweek Coffee Combo', description: 'Any cappuccino or latte with a slice of cake for KSh 700.', valid: 'Valid until 30 Nov 2026' },
  { title: 'Family Meal Deal', description: 'Two burgers, fries and two soft drinks for KSh 1,500.', valid: 'Valid until 15 Dec 2026' },
  { title: 'Fresh Juice Happy Hour', description: 'Buy two fruit blends and enjoy a 15% discount after 4 PM.', valid: 'Available weekdays only' },
];

export const galleryImages = [
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
];
