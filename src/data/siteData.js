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
];

export const heroSlides = [
  {
    title: 'Good Food. Great Moments.',
    subtitle: 'Fresh coffee, hearty meals and laid-back vibes in the heart of Ndenderu.',
    image: '/images/main-dishes.jpeg',
  },
  {
    title: 'Brewed for busy mornings.',
    subtitle:
      'Start strong with smooth espresso, creamy cappuccinos and breakfast favourites made for everyday routines.',
    image: '/images/drinks-menu.jpeg',
  },
  {
    title: 'Comfort food that feels like home.',
    subtitle:
      'From juicy burgers to loaded shawarma, every plate is crafted to satisfy cravings and spark conversations.',
    image: '/images/pizza-burgers-shawarma.jpeg',
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
  {
    id: 1,
    name: 'Cappuccino',
    category: 'Coffee & Hot Drinks',
    price: 'KSh 420',
    description: 'A rich espresso-based coffee with velvety foam and a smooth finish.',
    image: '/images/drinks-menu.jpeg',
    featured: true,
  },
  {
    id: 2,
    name: 'Mango Burst',
    category: 'Fresh Juices & Cold Drinks',
    price: 'KSh 350',
    description: 'Fresh mango juice blended with a citrus twist for a vibrant, refreshing sip.',
    image: '/images/beverage-selection.jpeg',
    featured: true,
  },
  {
    id: 3,
    name: 'Texas Burger',
    category: 'Burgers & Quick Bites',
    price: 'KSh 680',
    description: 'Juicy beef patty, crisp lettuce, tomato and signature sauce in a toasted bun.',
    image: '/images/pizza-burgers-shawarma.jpeg',
    featured: true,
  },
  {
    id: 4,
    name: 'Chicken Shawarma',
    category: 'Main Meals',
    price: 'KSh 520',
    description: 'Loaded with grilled chicken, fresh veg and a creamy garlic sauce wrapped to perfection.',
    image: '/images/pizza-burgers-shawarma.jpeg',
    featured: false,
  },
  {
    id: 5,
    name: 'Beef Pizza',
    category: 'Pizza & Grills',
    price: 'KSh 1,250',
    description: 'Stone-baked pizza with mozzarella, beef slices and a rich tomato base.',
    image: '/images/pizza-burgers-shawarma.jpeg',
    featured: true,
  },
  {
    id: 6,
    name: 'Mixed Grill Platter',
    category: 'Pizza & Grills',
    price: 'KSh 1,700',
    description: 'A hearty platter with grilled chicken, beef, chips and a side of fresh salad.',
    image: '/images/main-dishes.jpeg',
    featured: false,
  },
  {
    id: 7,
    name: 'Vanilla Cheesecake',
    category: 'Desserts & Treats',
    price: 'KSh 430',
    description: 'Smooth, creamy and indulgent with a wafer crumb base and silky vanilla finish.',
    image: '/images/food-platter.jpeg',
    featured: false,
  },
  {
    id: 8,
    name: 'Lemonade Spritz',
    category: 'Fresh Juices & Cold Drinks',
    price: 'KSh 300',
    description: 'House-made lemonade with a bright citrus kick and a refreshing finish.',
    image: '/images/beverage-selection.jpeg',
    featured: false,
  },
];

export const offers = [
  { title: 'Midweek Coffee Combo', description: 'Any cappuccino or latte with a slice of cake for KSh 700.', valid: 'Valid until 30 Nov 2026' },
  { title: 'Family Meal Deal', description: 'Two burgers, fries and two soft drinks for KSh 1,500.', valid: 'Valid until 15 Dec 2026' },
  { title: 'Fresh Juice Happy Hour', description: 'Buy two fruit blends and enjoy a 15% discount after 4 PM.', valid: 'Available weekdays only' },
];

export const galleryImages = [
  '/images/main-dishes.jpeg',
  '/images/drinks-menu.jpeg',
  '/images/pizza-burgers-shawarma.jpeg',
  '/images/beverage-selection.jpeg',
  '/images/food-platter.jpeg',
  '/images/grilled-bites.jpeg',
];