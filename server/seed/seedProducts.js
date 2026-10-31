const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from server root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const Product = require('../models/Product');

const products = [
  // --- MEN (7 products) ---
  {
    name: 'Classic Linen Button-Down Shirt',
    description: 'Breathable, relaxed-fit linen shirt tailored for effortless style and all-day comfort in warm climates.',
    price: 2499,
    category: 'Men',
    brand: 'Nordic Thread',
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: 'S', color: 'White', stock: 15 },
      { size: 'M', color: 'White', stock: 25 },
      { size: 'L', color: 'Light Blue', stock: 20 },
      { size: 'XL', color: 'Olive', stock: 10 },
    ],
  },
  {
    name: 'Slim Tapered Stretch Denim Jeans',
    description: 'Modern slim tapered jeans crafted from premium stretch indigo denim for maximum mobility.',
    price: 3299,
    category: 'Men',
    brand: 'Urban Nomad',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: '30', color: 'Dark Indigo', stock: 12 },
      { size: '32', color: 'Dark Indigo', stock: 18 },
      { size: '34', color: 'Washed Black', stock: 14 },
      { size: '36', color: 'Washed Black', stock: 8 },
    ],
  },
  {
    name: 'Merino Wool Crewneck Sweater',
    description: 'Ultra-fine 100% Merino wool sweater offering lightweight thermal warmth and a refined silhouette.',
    price: 4499,
    category: 'Men',
    brand: 'Aura Studio',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: 'S', color: 'Charcoal', stock: 10 },
      { size: 'M', color: 'Charcoal', stock: 20 },
      { size: 'L', color: 'Navy', stock: 18 },
      { size: 'XL', color: 'Burgundy', stock: 12 },
    ],
  },
  {
    name: 'Minimalist Utility Bomber Jacket',
    description: 'Sleek water-resistant flight bomber with ribbed knit trims and secure interior media pockets.',
    price: 5499,
    category: 'Men',
    brand: 'Urban Nomad',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: 'M', color: 'Black', stock: 14 },
      { size: 'L', color: 'Black', stock: 22 },
      { size: 'L', color: 'Olive Green', stock: 16 },
      { size: 'XL', color: 'Olive Green', stock: 10 },
    ],
  },
  {
    name: 'Tailored Everyday Chino Trousers',
    description: 'Versatile stretch cotton twill chinos designed to seamlessly transition from office to weekend.',
    price: 2799,
    category: 'Men',
    brand: 'Nordic Thread',
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: 'S', color: 'Khaki', stock: 20 },
      { size: 'M', color: 'Khaki', stock: 30 },
      { size: 'M', color: 'Navy', stock: 25 },
      { size: 'L', color: 'Navy', stock: 15 },
    ],
  },
  {
    name: 'Heavyweight Cotton Oversized Tee',
    description: 'Boxy drop-shoulder tee knit from durable 260 GSM combed organic cotton with reinforced collar.',
    price: 1499,
    category: 'Men',
    brand: 'Urban Nomad',
    rating: 4.4,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: 'S', color: 'Off-White', stock: 25 },
      { size: 'M', color: 'Off-White', stock: 40 },
      { size: 'L', color: 'Washed Black', stock: 35 },
      { size: 'XL', color: 'Washed Black', stock: 20 },
    ],
  },
  {
    name: 'All-Weather Technical Hooded Parka',
    description: 'Windproof and insulated outerwear designed for urban commuters tackling cold city rains.',
    price: 7999,
    category: 'Men',
    brand: 'Aura Studio',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: 'M', color: 'Matte Black', stock: 8 },
      { size: 'L', color: 'Matte Black', stock: 12 },
      { size: 'XL', color: 'Slate Grey', stock: 6 },
    ],
  },

  // --- WOMEN (7 products) ---
  {
    name: 'Silk Blend Floral Wrap Midi Dress',
    description: 'Flattering A-line wrap dress featuring subtle botanic motifs, flowing flutter sleeves, and waist tie.',
    price: 4999,
    category: 'Women',
    brand: 'Velvet & Oak',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: 'XS', color: 'Sage Green', stock: 10 },
      { size: 'S', color: 'Sage Green', stock: 20 },
      { size: 'M', color: 'Floral Navy', stock: 18 },
      { size: 'L', color: 'Floral Navy', stock: 12 },
    ],
  },
  {
    name: 'High-Rise Pleated Wide Leg Trousers',
    description: 'Architectural silhouette with tailored front pleats, slant pockets, and an elegant fluid drape.',
    price: 3499,
    category: 'Women',
    brand: 'Aura Studio',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: 'XS', color: 'Cream', stock: 14 },
      { size: 'S', color: 'Cream', stock: 22 },
      { size: 'M', color: 'Camel', stock: 19 },
      { size: 'L', color: 'Black', stock: 15 },
    ],
  },
  {
    name: 'Cashmere Ribbed Open-Front Cardigan',
    description: 'Sumptuous 100% grade-A Mongolian cashmere knit designed with ribbed cuffs and cocoon drape.',
    price: 6499,
    category: 'Women',
    brand: 'Velvet & Oak',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: 'S', color: 'Oatmeal', stock: 8 },
      { size: 'M', color: 'Oatmeal', stock: 15 },
      { size: 'L', color: 'Dusty Rose', stock: 10 },
      { size: 'XL', color: 'Dusty Rose', stock: 6 },
    ],
  },
  {
    name: 'Double-Breasted Classic Trench Coat',
    description: 'Timeless storm-shield trench coat tailored in weatherproof gabardine with horn buttons.',
    price: 7499,
    category: 'Women',
    brand: 'Aura Studio',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: 'S', color: 'Classic Honey', stock: 12 },
      { size: 'M', color: 'Classic Honey', stock: 18 },
      { size: 'L', color: 'Black', stock: 14 },
    ],
  },
  {
    name: 'Ribbed Knit Scoop-Neck Midi Dress',
    description: 'Body-contouring stretch ribbed knit dress with an effortless scoop neck and subtle side slit.',
    price: 2999,
    category: 'Women',
    brand: 'Velvet & Oak',
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: 'XS', color: 'Chocolate', stock: 15 },
      { size: 'S', color: 'Chocolate', stock: 25 },
      { size: 'M', color: 'Terracotta', stock: 20 },
      { size: 'L', color: 'Black', stock: 12 },
    ],
  },
  {
    name: 'Oversized Wool Blend Blazer',
    description: 'Structured boyfriend blazer with padded shoulders, notched lapels, and smooth cupro lining.',
    price: 5999,
    category: 'Women',
    brand: 'Aura Studio',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: 'S', color: 'Houndstooth', stock: 10 },
      { size: 'M', color: 'Houndstooth', stock: 16 },
      { size: 'L', color: 'Charcoal Grey', stock: 14 },
    ],
  },
  {
    name: 'Bohemian Puff Sleeve Linen Blouse',
    description: 'Romantic vintage-inspired peasant top detailed with gathered cuffs and embroidered neckline.',
    price: 2499,
    category: 'Women',
    brand: 'Velvet & Oak',
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: 'S', color: 'Ivory', stock: 18 },
      { size: 'M', color: 'Ivory', stock: 24 },
      { size: 'L', color: 'Blush Pink', stock: 16 },
    ],
  },

  // --- KIDS (6 products) ---
  {
    name: 'Organic Cotton Baby & Toddler Romper',
    description: 'Ultra-gentle GOTS certified organic cotton one-piece with easy-access snap buttons for diaper changes.',
    price: 999,
    category: 'Kids',
    brand: 'Little Explorer',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: '0-3M', color: 'Mustard Yellow', stock: 20 },
      { size: '3-6M', color: 'Mustard Yellow', stock: 25 },
      { size: '6-12M', color: 'Sage Green', stock: 22 },
      { size: '12-18M', color: 'Sage Green', stock: 15 },
    ],
  },
  {
    name: 'Adventure Dinosaur Fleece Sweatshirt',
    description: 'Plush brushed cotton sweatshirt with playful embroidered dinosaur badges and cozy ribbed hems.',
    price: 1299,
    category: 'Kids',
    brand: 'Little Explorer',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: '2T', color: 'Forest Green', stock: 18 },
      { size: '3T', color: 'Forest Green', stock: 22 },
      { size: '4T', color: 'Navy', stock: 20 },
      { size: '5T', color: 'Navy', stock: 14 },
    ],
  },
  {
    name: 'Adjustable Strap Denim Overalls',
    description: 'Hard-wearing pre-washed denim dungarees with brass buckles, roomy chest pocket, and rolled cuffs.',
    price: 1699,
    category: 'Kids',
    brand: 'Little Explorer',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: '2T', color: 'Medium Wash', stock: 15 },
      { size: '3T', color: 'Medium Wash', stock: 20 },
      { size: '4T', color: 'Medium Wash', stock: 18 },
      { size: '5T', color: 'Washed Black', stock: 12 },
    ],
  },
  {
    name: 'Cozy Colorblock Full-Zip Sherpa Jacket',
    description: 'High-pile thermal fleece outerwear with colorful windproof pockets and a chin guard zipper.',
    price: 1999,
    category: 'Kids',
    brand: 'Little Explorer',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: '3T', color: 'Teal/Mustard', stock: 12 },
      { size: '4T', color: 'Teal/Mustard', stock: 16 },
      { size: '5T', color: 'Navy/Rust', stock: 14 },
    ],
  },
  {
    name: 'Twirl Rainbow Stripe Cotton Sundress',
    description: 'Vibrant sleeveless skater dress featuring colorful pastel stripes and an elasticized comfy waist.',
    price: 1199,
    category: 'Kids',
    brand: 'Little Explorer',
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: '2T', color: 'Pastel Rainbow', stock: 15 },
      { size: '3T', color: 'Pastel Rainbow', stock: 20 },
      { size: '4T', color: 'Pastel Rainbow', stock: 18 },
      { size: '5T', color: 'Sunflower Print', stock: 14 },
    ],
  },
  {
    name: 'Reinforced Knee Cargo Play Pants',
    description: 'Tough ripstop stretch cotton trousers engineered with double-layer knees for limitless playground fun.',
    price: 1499,
    category: 'Kids',
    brand: 'Little Explorer',
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: '3T', color: 'Khaki', stock: 18 },
      { size: '4T', color: 'Khaki', stock: 24 },
      { size: '5T', color: 'Olive Green', stock: 20 },
    ],
  },

  // --- ACCESSORIES (5 products) ---
  {
    name: 'Handcrafted Italian Leather Bifold Wallet',
    description: 'Full-grain vegetable-tanned cowhide wallet with 8 card slots, RFID blocking layer, and cash pocket.',
    price: 2499,
    category: 'Accessories',
    brand: 'Terra Crafts',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: 'Free Size', color: 'Cognac Brown', stock: 35 },
      { size: 'Free Size', color: 'Midnight Black', stock: 40 },
      { size: 'Free Size', color: 'Espresso', stock: 25 },
    ],
  },
  {
    name: 'Polarized Aviator Sunglasses with Gold Frame',
    description: 'UV400 polarized mirrored lenses in a lightweight stainless steel frame with silicone comfort nose pads.',
    price: 3299,
    category: 'Accessories',
    brand: 'Terra Crafts',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: 'Free Size', color: 'Gold / Green Lens', stock: 30 },
      { size: 'Free Size', color: 'Silver / Smoke Lens', stock: 28 },
      { size: 'Free Size', color: 'Matte Black', stock: 22 },
    ],
  },
  {
    name: 'Waxed Canvas & Leather Weekend Duffle',
    description: 'Heavy 18oz water-repellent waxed canvas travel bag with full-grain leather straps and brass hardware.',
    price: 5999,
    category: 'Accessories',
    brand: 'Urban Nomad',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: '45L', color: 'Field Tan', stock: 15 },
      { size: '45L', color: 'Army Olive', stock: 20 },
      { size: '45L', color: 'Charcoal Grey', stock: 12 },
    ],
  },
  {
    name: 'Pure Lambswool Tartan Blanket Scarf',
    description: 'Soft Scottish lambswool oversized scarf designed with classic heritage plaid and rolled fringe edges.',
    price: 1999,
    category: 'Accessories',
    brand: 'Nordic Thread',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: 'Free Size', color: 'Heritage Camel', stock: 25 },
      { size: 'Free Size', color: 'Blackwatch Tartan', stock: 30 },
      { size: 'Free Size', color: 'Cranberry Plaid', stock: 18 },
    ],
  },
  {
    name: 'Minimalist Bauhaus Automatic Watch',
    description: 'Sapphire crystal glass dial with exhibition caseback, Japanese automatic movement, and genuine Horween strap.',
    price: 8999,
    category: 'Accessories',
    brand: 'Terra Crafts',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { size: '40mm', color: 'Silver / Tan Leather', stock: 14 },
      { size: '40mm', color: 'Black / Black Leather', stock: 16 },
      { size: '36mm', color: 'Rose Gold / Grey Leather', stock: 10 },
    ],
  },
];

const seedProducts = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing products collection...');
    await Product.deleteMany({});

    console.log(`[Seed] Inserting ${products.length} fashion products in INR...`);
    const inserted = await Product.insertMany(products);

    console.log(`[Seed] Successfully inserted ${inserted.length} products with INR pricing!`);

    await mongoose.connection.close();
    console.log('[Seed] Database connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed products: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();
