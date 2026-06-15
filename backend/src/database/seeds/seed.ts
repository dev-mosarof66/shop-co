import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import AppDataSource from '../data-source';
import { Category } from '../entities/Category';
import { Product } from '../entities/Product';

const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', description: 'Gadgets, devices, and tech accessories' },
  { name: 'Fashion',     slug: 'fashion',     description: 'Clothing, shoes, and accessories' },
  { name: 'Home',        slug: 'home',        description: 'Home decor, furniture, and kitchen' },
  { name: 'Sports',      slug: 'sports',      description: 'Fitness equipment and sportswear' },
  { name: 'Books',       slug: 'books',       description: 'Books, guides, and learning resources' },
  { name: 'Beauty',      slug: 'beauty',      description: 'Skincare, makeup, and personal care' },
];

type ProductSeed = {
  name: string; categorySlug: string; sku: string;
  price: number; originalPrice: number | null;
  rating: number; reviewCount: number; stock: number;
  badge: string | null; iconKey: string; isFeatured: boolean;
  description: string; features: string[]; specs: Record<string, string>;
};

const PRODUCTS: ProductSeed[] = [

  // ─── Electronics (9) ───────────────────────────────────────────────────────
  {
    name: 'Pro Wireless Headphones', categorySlug: 'electronics', sku: 'ELEC-001',
    price: 79.99, originalPrice: 129.99, rating: 4.8, reviewCount: 2341, stock: 50,
    badge: 'bestSeller', iconKey: 'headphones', isFeatured: true,
    description: 'Premium ANC sound with 30-hour battery life and a foldable design engineered for audiophiles who demand clarity in every environment.',
    features: ['Active Noise Cancellation', '30-hour battery life', 'Foldable travel design', 'Premium 40 mm neodymium drivers', 'USB-C fast charge (15 min = 3 h)', 'Multipoint Bluetooth 5.2'],
    specs: { 'Driver Size': '40 mm', 'Frequency Response': '20 Hz – 20 kHz', 'Battery Life': '30 h (ANC on)', 'Charging': 'USB-C', 'Weight': '250 g', 'Connectivity': 'Bluetooth 5.2' },
  },
  {
    name: '4K Curved Monitor', categorySlug: 'electronics', sku: 'ELEC-002',
    price: 349.99, originalPrice: 499.99, rating: 4.6, reviewCount: 892, stock: 20,
    badge: 'sale', iconKey: 'monitor', isFeatured: false,
    description: 'Ultra-wide 34" curved UWQHD display with HDR10 and 165 Hz refresh rate for immersive work, gaming, and content creation.',
    features: ['34" ultra-wide 21:9 curved panel', '165 Hz refresh rate', 'HDR10 with 1 000 nits peak', '1 ms response time (MPRT)', 'USB-C 90 W Power Delivery', 'Height & tilt adjustable stand'],
    specs: { 'Panel': 'VA, 34" curved', 'Resolution': '3440 × 1440', 'Refresh Rate': '165 Hz', 'Response Time': '1 ms (MPRT)', 'HDR': 'HDR10 / 1 000 nits', 'Inputs': 'HDMI 2.1, DP 1.4, USB-C' },
  },
  {
    name: 'Smart Bluetooth Speaker', categorySlug: 'electronics', sku: 'ELEC-003',
    price: 59.99, originalPrice: null, rating: 4.5, reviewCount: 3127, stock: 75,
    badge: 'new', iconKey: 'speaker', isFeatured: false,
    description: '360° room-filling sound with built-in voice assistant and IPX7 waterproofing — perfect for home, office, or outdoor adventures.',
    features: ['360° omnidirectional sound', 'IPX7 waterproof', 'Built-in voice assistant', '20-hour playtime', 'True wireless stereo pairing', 'USB-C charging'],
    specs: { 'Output Power': '20 W (2 × 10 W)', 'Battery Life': '20 h', 'Waterproof': 'IPX7', 'Connectivity': 'Bluetooth 5.3', 'Charging': 'USB-C', 'Weight': '540 g' },
  },
  {
    name: 'Mechanical Gaming Keyboard', categorySlug: 'electronics', sku: 'ELEC-004',
    price: 119.99, originalPrice: 159.99, rating: 4.7, reviewCount: 1456, stock: 35,
    badge: 'sale', iconKey: 'keyboard', isFeatured: false,
    description: 'Tactile clicky switches with per-key RGB backlighting, aluminium frame, and detachable USB-C cable for serious gamers and typists.',
    features: ['Per-key RGB backlighting', 'Hot-swappable switches', 'Aluminium top plate', 'Detachable USB-C braided cable', 'N-key rollover', 'Software macro support'],
    specs: { 'Switch': 'Tactile (Brown)', 'Layout': 'TKL (87 key)', 'Polling Rate': '1 000 Hz', 'Backlight': 'RGB per-key', 'Cable': 'Detachable USB-C, 1.8 m', 'Weight': '820 g' },
  },
  {
    name: 'Wireless Charging Pad', categorySlug: 'electronics', sku: 'ELEC-005',
    price: 29.99, originalPrice: null, rating: 4.4, reviewCount: 678, stock: 100,
    badge: null, iconKey: 'zap', isFeatured: false,
    description: '15 W fast-wireless charging pad compatible with all Qi devices. Non-slip base, LED indicator, and ultra-slim profile.',
    features: ['15 W fast wireless charging', 'Qi universal compatibility', 'Non-slip silicone base', 'LED charging indicator', 'Foreign object detection', 'Ultra-slim 6 mm profile'],
    specs: { 'Output': '5 W / 10 W / 15 W', 'Input': 'USB-C, 5 V/3 A', 'Compatibility': 'Qi (all brands)', 'Diameter': '100 mm', 'Thickness': '6 mm', 'Cable': 'USB-C included' },
  },
  {
    name: 'Smart Home Hub', categorySlug: 'electronics', sku: 'ELEC-006',
    price: 89.99, originalPrice: 109.99, rating: 4.3, reviewCount: 412, stock: 40,
    badge: null, iconKey: 'plug', isFeatured: false,
    description: 'Connect and control 100+ smart devices with one hub. Works with Alexa, Google Home, and Apple HomeKit out of the box.',
    features: ['Supports 100+ device brands', 'Works with Alexa, Google & HomeKit', 'Zigbee + Z-Wave + Wi-Fi radios', 'Local processing (no cloud required)', 'Automation routines builder', 'OTA firmware updates'],
    specs: { 'Protocols': 'Zigbee 3.0, Z-Wave Plus, Wi-Fi, BT', 'Processor': 'Quad-core 1.4 GHz', 'RAM': '1 GB', 'Storage': '8 GB', 'Power': 'USB-C 5 V/3 A', 'Dimensions': '110 × 110 × 20 mm' },
  },
  {
    name: 'True Wireless Earbuds', categorySlug: 'electronics', sku: 'ELEC-007',
    price: 69.99, originalPrice: 99.99, rating: 4.6, reviewCount: 1893, stock: 60,
    badge: 'sale', iconKey: 'headphones', isFeatured: false,
    description: 'Hybrid ANC earbuds with 8-hour bud life + 32-hour case, IPX4 sweat resistance, and custom EQ via companion app.',
    features: ['Hybrid Active Noise Cancellation', '8 h buds + 32 h case', 'IPX4 sweat & splash resistant', 'Custom EQ via app', 'Touch controls', 'Wireless case charging'],
    specs: { 'Driver': '10 mm dynamic', 'ANC': 'Hybrid ANC (-35 dB)', 'Battery (Bud)': '8 h', 'Battery (Case)': '+32 h', 'Charging': 'USB-C + Qi wireless', 'Bluetooth': '5.3 / AAC, LDAC' },
  },
  {
    name: 'Portable Power Bank 26 800 mAh', categorySlug: 'electronics', sku: 'ELEC-008',
    price: 54.99, originalPrice: 74.99, rating: 4.7, reviewCount: 2241, stock: 80,
    badge: 'bestSeller', iconKey: 'battery', isFeatured: false,
    description: '26 800 mAh power bank with 65 W PD, charges a MacBook to 50% in under an hour. Three simultaneous outputs including USB-C and USB-A.',
    features: ['65 W USB-C Power Delivery', '3 simultaneous outputs', 'Charges MacBook to 50% in ~1 h', 'LCD battery percentage display', 'Pass-through charging', 'Aviation-grade lithium cells'],
    specs: { 'Capacity': '26 800 mAh / 96.5 Wh', 'USB-C Output': '65 W PD', 'USB-A Output': '22.5 W QC', 'Input': 'USB-C 65 W', 'Display': 'LCD %', 'Weight': '520 g' },
  },
  {
    name: 'USB-C Docking Station', categorySlug: 'electronics', sku: 'ELEC-009',
    price: 99.99, originalPrice: 139.99, rating: 4.5, reviewCount: 567, stock: 30,
    badge: null, iconKey: 'monitor', isFeatured: false,
    description: '12-in-1 docking station with dual 4K HDMI, 100 W pass-through charging, Ethernet, and SD card reader. One cable to rule your desk.',
    features: ['Dual 4K HDMI @ 60 Hz', '100 W USB-C pass-through', 'Gigabit Ethernet', 'SD & microSD card slots', '4× USB-A 3.0 ports', 'Plug-and-play, no drivers'],
    specs: { 'Video Out': '2× HDMI 4K@60 Hz', 'USB-C Power': '100 W PD', 'USB-A': '4× USB 3.0', 'Ethernet': 'Gigabit RJ-45', 'Card Reader': 'SD + microSD', 'Host': 'USB-C Thunderbolt 3/4' },
  },

  // ─── Fashion (9) ───────────────────────────────────────────────────────────
  {
    name: 'Slim Leather Wallet', categorySlug: 'fashion', sku: 'FASH-001',
    price: 29.99, originalPrice: null, rating: 4.6, reviewCount: 1560, stock: 100,
    badge: null, iconKey: 'wallet', isFeatured: true,
    description: 'Handcrafted full-grain leather with RFID blocking and 8 card slots. Slim 8 mm profile slides easily into any pocket.',
    features: ['Full-grain genuine leather', 'RFID blocking liner', '8 card slots + 2 cash pockets', 'Slim profile (8 mm thin)', 'Burnished edge finish', 'Fits front or back pocket'],
    specs: { 'Material': 'Full-grain cowhide', 'Dimensions': '105 × 85 × 8 mm', 'Card Slots': '8', 'RFID': 'Blocking (13.56 MHz)', 'Stitching': 'Waxed thread', 'Colours': 'Black, Brown, Tan' },
  },
  {
    name: 'Ultralight Running Shoes', categorySlug: 'fashion', sku: 'FASH-002',
    price: 89.99, originalPrice: 119.99, rating: 4.9, reviewCount: 5120, stock: 45,
    badge: 'new', iconKey: 'sneaker', isFeatured: true,
    description: 'Featherlight mesh upper with a responsive foam midsole. Built for speed with breathability you feel from the first stride.',
    features: ['Engineered mesh upper', 'Responsive EVA foam midsole', 'Carbon-rubber outsole', 'Reflective detailing', 'Wide toe box', 'Machine washable'],
    specs: { 'Upper': 'Engineered mesh', 'Midsole': 'Responsive EVA foam', 'Outsole': 'Carbon rubber', 'Drop': '8 mm', 'Weight': '210 g (US 9)', 'Sizes': 'US 6–13 (half sizes)' },
  },
  {
    name: 'Minimalist Steel Watch', categorySlug: 'fashion', sku: 'FASH-003',
    price: 149.99, originalPrice: 199.99, rating: 4.7, reviewCount: 1783, stock: 30,
    badge: 'sale', iconKey: 'watch', isFeatured: true,
    description: 'Swiss quartz movement in a brushed stainless steel case with sapphire crystal glass. Timeless design for every occasion.',
    features: ['Swiss quartz movement', 'Scratch-resistant sapphire crystal', 'Brushed 316L stainless steel case', '5 ATM water resistance', 'Quick-release leather strap', '2-year movement warranty'],
    specs: { 'Movement': 'Swiss quartz', 'Case': '316L stainless steel, 40 mm', 'Crystal': 'Sapphire', 'Water Resistance': '5 ATM (50 m)', 'Strap': 'Genuine leather, 20 mm lug', 'Battery': 'SR626SW (~3 years)' },
  },
  {
    name: 'Classic Crew-neck Shirt', categorySlug: 'fashion', sku: 'FASH-004',
    price: 34.99, originalPrice: null, rating: 4.4, reviewCount: 982, stock: 200,
    badge: null, iconKey: 'shirt', isFeatured: false,
    description: '100% organic cotton, pre-washed for softness, relaxed unisex fit. The wardrobe essential that pairs with everything.',
    features: ['100% GOTS-certified organic cotton', 'Enzyme-washed for softness', 'Relaxed unisex fit', 'Ribbed crew neck', 'Double-needle hem', 'Fade-resistant dye'],
    specs: { 'Material': '100% organic cotton, 180 gsm', 'Fit': 'Relaxed', 'Neckline': 'Crew neck', 'Sizes': 'XS – 3XL', 'Care': 'Machine wash cold', 'Certification': 'GOTS organic' },
  },
  {
    name: 'Merino Wool Hoodie', categorySlug: 'fashion', sku: 'FASH-005',
    price: 119.99, originalPrice: 159.99, rating: 4.8, reviewCount: 743, stock: 60,
    badge: 'sale', iconKey: 'shirt', isFeatured: false,
    description: '100% extra-fine merino wool. Naturally thermoregulating, odour-resistant, and soft enough to wear against bare skin all day.',
    features: ['100% extra-fine merino (17.5 µm)', 'Naturally odour-resistant', 'Temperature regulating', 'Kangaroo pocket', 'Flatlock seams (no chafing)', 'Machine washable'],
    specs: { 'Material': '100% merino wool, 220 gsm', 'Micron': '17.5 µm (extra-fine)', 'Fit': 'Regular', 'Sizes': 'XS – 2XL', 'Care': 'Machine wash cold, lay flat to dry', 'Origin': 'Merino wool from New Zealand' },
  },
  {
    name: 'Waxed Canvas Tote Bag', categorySlug: 'fashion', sku: 'FASH-006',
    price: 64.99, originalPrice: null, rating: 4.5, reviewCount: 389, stock: 70,
    badge: null, iconKey: 'bag', isFeatured: false,
    description: 'Water-resistant waxed canvas tote with full leather handles and interior zip pocket. Built to age beautifully for decades.',
    features: ['Waxed canvas outer', 'Full-grain leather handles', 'Interior zip pocket + 2 slip pockets', '15" laptop compartment', 'Magnetic clasp closure', 'Reinforced base'],
    specs: { 'Material': '12 oz waxed canvas + leather', 'Dimensions': '40 × 35 × 12 cm', 'Handle Drop': '28 cm', 'Laptop Fit': 'Up to 15"', 'Weight': '620 g', 'Colours': 'Olive, Navy, Black' },
  },
  {
    name: 'Polarized Aviator Sunglasses', categorySlug: 'fashion', sku: 'FASH-007',
    price: 79.99, originalPrice: 99.99, rating: 4.6, reviewCount: 612, stock: 85,
    badge: null, iconKey: 'sun', isFeatured: false,
    description: 'UV400 polarized lenses in a classic metal aviator frame. Eliminates glare for sharper, more comfortable vision in bright conditions.',
    features: ['UV400 polarized lenses', 'Anti-glare coating', 'Lightweight titanium frame', 'Spring hinge for fit', 'Microfibre pouch included', 'Unisex classic aviator shape'],
    specs: { 'Lens': 'Polycarbonate, polarized, UV400', 'Frame': 'Titanium alloy', 'Lens Width': '58 mm', 'Bridge': '14 mm', 'Temple Length': '145 mm', 'Weight': '22 g' },
  },
  {
    name: 'Full-Grain Leather Belt', categorySlug: 'fashion', sku: 'FASH-008',
    price: 44.99, originalPrice: null, rating: 4.7, reviewCount: 524, stock: 120,
    badge: null, iconKey: 'wallet', isFeatured: false,
    description: 'Single-piece full-grain leather belt with a solid brass buckle. Gets better looking with age — a lifetime accessory.',
    features: ['Single-piece full-grain leather', 'Solid brass roller buckle', '35 mm width (dress/casual)', '5 adjustment holes', 'Hand-burnished edges', 'Available in 30"–44"'],
    specs: { 'Material': 'Full-grain cowhide', 'Width': '35 mm', 'Buckle': 'Solid brass', 'Adjustment': '5 holes, 25 mm spacing', 'Sizes': '30" – 44"', 'Colours': 'Black, Dark Brown, Tan' },
  },
  {
    name: 'Cashmere Beanie', categorySlug: 'fashion', sku: 'FASH-009',
    price: 49.99, originalPrice: 69.99, rating: 4.8, reviewCount: 328, stock: 90,
    badge: 'sale', iconKey: 'shirt', isFeatured: false,
    description: '100% Grade-A cashmere from Inner Mongolia. Feather-light warmth with a classic ribbed turn-up cuff.',
    features: ['100% Grade-A cashmere', 'Ribbed turn-up cuff', 'Seamless knit construction', 'One size fits most', 'Hand wash or dry clean', 'Available in 8 colours'],
    specs: { 'Material': '100% cashmere, Grade A', 'Origin': 'Inner Mongolia', 'Weight': '55 g', 'Gauge': '14 gg fine knit', 'Care': 'Hand wash cold or dry clean', 'Colours': '8 seasonal shades' },
  },

  // ─── Home (9) ──────────────────────────────────────────────────────────────
  {
    name: 'Ceramic Pour-over Set', categorySlug: 'home', sku: 'HOME-001',
    price: 39.99, originalPrice: null, rating: 4.8, reviewCount: 941, stock: 60,
    badge: null, iconKey: 'coffee', isFeatured: false,
    description: 'Hand-thrown ceramic dripper with a walnut handle and matching carafe. Bring café-quality pour-over ritual into your kitchen.',
    features: ['Hand-thrown ceramic dripper', 'Matching 600 ml carafe', 'Sustainable walnut handle', 'Food-safe glaze', 'Paper or reusable filter compatible', 'Dishwasher-safe (carafe)'],
    specs: { 'Material': 'Stoneware ceramic', 'Carafe Capacity': '600 ml', 'Filter Size': '#2 cone', 'Dimensions': '14 × 12 × 20 cm', 'Handle': 'FSC walnut', 'Weight': '480 g' },
  },
  {
    name: 'Nordic Desk Lamp', categorySlug: 'home', sku: 'HOME-002',
    price: 69.99, originalPrice: 89.99, rating: 4.5, reviewCount: 672, stock: 40,
    badge: 'sale', iconKey: 'lamp', isFeatured: false,
    description: 'Adjustable LED with 5 colour temperatures and a touch dimmer. Scandinavian-inspired design that looks as good as it lights.',
    features: ['5 colour temperatures (2700–6500 K)', 'Touch-sensitive dimmer (3 levels)', 'Energy-efficient LED (9 W)', '360° rotatable arm', 'USB-A charging port on base', 'Memory function on last setting'],
    specs: { 'Light Source': 'LED, 9 W', 'Colour Temperature': '2700 – 6500 K', 'Brightness': '500 lm', 'CRI': '≥ 90', 'Arm Reach': '45 cm', 'Voltage': '100–240 V' },
  },
  {
    name: 'Linen Throw Blanket', categorySlug: 'home', sku: 'HOME-003',
    price: 49.99, originalPrice: null, rating: 4.7, reviewCount: 1432, stock: 80,
    badge: 'bestSeller', iconKey: 'leaf', isFeatured: false,
    description: 'Stonewashed European linen — naturally breathable and durable. Gets softer with every wash for a lifetime of cosy evenings.',
    features: ['100% European stonewashed linen', 'Gets softer with every wash', 'Naturally temperature-regulating', 'Hypoallergenic & anti-static', 'Fringe tassel ends', 'OEKO-TEX® certified'],
    specs: { 'Material': '100% linen', 'Dimensions': '130 × 170 cm', 'Weight': '350 gsm', 'Care': 'Machine wash 40°C', 'Certification': 'OEKO-TEX® Standard 100', 'Origin': 'Portugal' },
  },
  {
    name: 'Bamboo Cutting Board Set', categorySlug: 'home', sku: 'HOME-004',
    price: 44.99, originalPrice: 59.99, rating: 4.6, reviewCount: 818, stock: 55,
    badge: null, iconKey: 'leaf', isFeatured: false,
    description: 'Set of 3 organic bamboo boards with juice groove and non-slip feet. Naturally antibacterial — harder than maple but gentler on knives.',
    features: ['Set of 3 sizes (S, M, L)', 'Deep juice groove', 'Non-slip silicone feet', 'Naturally antibacterial bamboo', 'Knife-friendly surface', 'Hand wash recommended'],
    specs: { 'Material': 'Moso bamboo', 'Sizes': 'S: 25×18, M: 33×23, L: 40×28 cm', 'Thickness': '1.5 cm each', 'Surface': 'End-grain bamboo', 'Care': 'Hand wash, oil monthly', 'Certification': 'FSC organic bamboo' },
  },
  {
    name: 'Ultrasonic Aromatherapy Diffuser', categorySlug: 'home', sku: 'HOME-005',
    price: 34.99, originalPrice: null, rating: 4.6, reviewCount: 1124, stock: 65,
    badge: 'new', iconKey: 'wind', isFeatured: false,
    description: '500 ml ultrasonic diffuser with 7-colour ambient light, 4 mist modes, and auto shutoff. Whisper-quiet under 25 dB.',
    features: ['500 ml tank (up to 14 h mist)', '7-colour LED ambient light', '4 mist modes (including sleep)', 'Auto shutoff when empty', 'Whisper-quiet (< 25 dB)', 'BPA-free materials'],
    specs: { 'Capacity': '500 ml', 'Runtime': 'Up to 14 h (low mist)', 'Mist Output': '30–50 ml/h', 'Noise Level': '< 25 dB', 'Power': '24 W', 'Dimensions': 'Ø 140 × 135 mm' },
  },
  {
    name: 'Copper Moscow Mule Set', categorySlug: 'home', sku: 'HOME-006',
    price: 54.99, originalPrice: 74.99, rating: 4.8, reviewCount: 562, stock: 45,
    badge: null, iconKey: 'coffee', isFeatured: false,
    description: 'Set of 4 hand-hammered solid copper mugs with a cocktail recipe guide. 100% pure copper keeps drinks ice-cold for longer.',
    features: ['Set of 4 solid copper mugs', 'Hand-hammered texture', '100% pure copper (no alloys)', 'Lacquer-free interior', 'Riveted brass handle', 'Includes cocktail recipe booklet'],
    specs: { 'Material': '99.9% pure copper', 'Capacity': '480 ml each', 'Handle': 'Riveted brass', 'Finish': 'Hand-hammered', 'Care': 'Hand wash, dry immediately', 'Includes': '4 mugs + recipe guide' },
  },
  {
    name: 'Smart Plug 4-Pack', categorySlug: 'home', sku: 'HOME-007',
    price: 39.99, originalPrice: 49.99, rating: 4.5, reviewCount: 2087, stock: 100,
    badge: 'bestSeller', iconKey: 'plug', isFeatured: false,
    description: 'Wi-Fi smart plugs with energy monitoring, schedules, and voice control. No hub required — setup in under 2 minutes.',
    features: ['Energy monitoring (W & kWh)', 'Schedule & countdown timer', 'Works with Alexa & Google', 'No hub required', 'Compact design (side-by-side fit)', '2.4 GHz Wi-Fi'],
    specs: { 'Max Load': '15 A / 1 800 W', 'Voltage': '100–240 V', 'Wi-Fi': '2.4 GHz 802.11 b/g/n', 'Plug Type': 'US/EU (choose at checkout)', 'Pack': '4× plugs', 'Certifications': 'ETL, FCC, CE' },
  },
  {
    name: 'Beeswax Candle Collection', categorySlug: 'home', sku: 'HOME-008',
    price: 36.99, originalPrice: null, rating: 4.9, reviewCount: 743, stock: 70,
    badge: null, iconKey: 'flame', isFeatured: false,
    description: 'Set of 6 hand-poured 100% pure beeswax candles in amber glass. Purify air naturally, burn up to 50 h each, and scent subtly of pure honey.',
    features: ['100% pure beeswax, no additives', 'Set of 6 amber glass vessels', 'Up to 50 h burn time each', 'Cotton braided wick', 'Naturally air-purifying', 'Subtle pure honey scent'],
    specs: { 'Material': '100% pure beeswax', 'Vessels': '6× 200 ml amber glass', 'Wick': 'Cotton braided', 'Burn Time': '~50 h per candle', 'Scent': 'Natural honey (no fragrance oils)', 'Weight': '170 g per candle' },
  },
  {
    name: 'Modular Wall Planter Set', categorySlug: 'home', sku: 'HOME-009',
    price: 29.99, originalPrice: 39.99, rating: 4.4, reviewCount: 387, stock: 75,
    badge: 'sale', iconKey: 'leaf', isFeatured: false,
    description: 'Set of 3 interlocking magnetic wall planters in matte ceramic. Arrange freely, refresh daily with removable liners. Plants not included.',
    features: ['Set of 3 interlocking magnetic planters', 'Removable inner liner', 'Matte ceramic outer shell', 'Magnetic wall mounting', 'Minimalist flat-back design', 'Plants & soil not included'],
    specs: { 'Material': 'Ceramic + ABS magnetic back', 'Dimensions': '12 × 12 × 10 cm each', 'Liner': 'Removable plastic, 8 cm Ø', 'Mount': 'Adhesive magnetic strip', 'Weight (each)': '280 g', 'Colours': 'White, Sage, Terracotta' },
  },

  // ─── Sports (9) ────────────────────────────────────────────────────────────
  {
    name: 'Adjustable Dumbbell Set', categorySlug: 'sports', sku: 'SPRT-001',
    price: 129.99, originalPrice: 179.99, rating: 4.7, reviewCount: 2036, stock: 25,
    badge: 'bestSeller', iconKey: 'dumbbell', isFeatured: false,
    description: 'Replaces 15 dumbbells with a quick-adjust dial from 5 to 52.5 lbs. Save space without sacrificing range.',
    features: ['Replaces 15 pairs of dumbbells', 'Quick-adjust dial system', 'Weight range: 5–52.5 lbs', 'Compact storage tray included', 'Ergonomic anti-roll handle', 'Secure locking mechanism'],
    specs: { 'Weight Range': '5 – 52.5 lbs (15 settings)', 'Adjustment': 'Dial selector', 'Handle Length': '35 cm', 'Material': 'Steel plates, ABS casing', 'Includes': '2 dumbbells + 2 trays', 'Warranty': '2 years' },
  },
  {
    name: 'Insulated Water Bottle', categorySlug: 'sports', sku: 'SPRT-002',
    price: 34.99, originalPrice: null, rating: 4.6, reviewCount: 4213, stock: 120,
    badge: null, iconKey: 'bottle', isFeatured: false,
    description: 'Triple-insulated stainless steel keeps drinks cold 24 h or hot 12 h. BPA-free, leak-proof, and built to last.',
    features: ['Triple-wall vacuum insulation', 'Cold 24 h / Hot 12 h', 'BPA-free 18/8 stainless steel', 'Leak-proof lid', 'Wide mouth (fits ice cubes)', 'Powder-coated grip finish'],
    specs: { 'Capacity': '750 ml', 'Material': '18/8 stainless steel', 'Insulation': 'Triple-wall vacuum', 'Mouth Width': '53 mm', 'Height': '26 cm', 'Weight': '320 g (empty)' },
  },
  {
    name: 'Resistance Band Set', categorySlug: 'sports', sku: 'SPRT-003',
    price: 24.99, originalPrice: 39.99, rating: 4.5, reviewCount: 3184, stock: 150,
    badge: 'sale', iconKey: 'bike', isFeatured: false,
    description: '5-level resistance set from 10–50 lbs. Includes carry bag and door anchor for full-body workouts anywhere.',
    features: ['5 resistance levels (10–50 lbs)', 'Snap-resistant natural latex', 'Door anchor included', 'Ankle straps included', 'Carry bag included', 'Suitable for all fitness levels'],
    specs: { 'Levels': '5 (Yellow → Black)', 'Resistance': '10 / 20 / 30 / 40 / 50 lbs', 'Material': 'Natural latex', 'Length': '120 cm per band', 'Accessories': 'Door anchor, ankle straps, bag', 'Warranty': '1 year' },
  },
  {
    name: 'Pro Yoga Mat', categorySlug: 'sports', sku: 'SPRT-004',
    price: 59.99, originalPrice: 79.99, rating: 4.8, reviewCount: 1672, stock: 90,
    badge: null, iconKey: 'dumbbell', isFeatured: true,
    description: '6 mm natural rubber mat with alignment lines, microfibre non-slip surface, and a carry strap. Excellent grip — dry or sweaty.',
    features: ['Natural rubber base (eco-friendly)', '6 mm cushioning', 'Alignment line print', 'Microfibre non-slip top', 'Moisture-wicking surface', 'Includes carry strap'],
    specs: { 'Material': 'Natural rubber + microfibre', 'Dimensions': '183 × 61 cm', 'Thickness': '6 mm', 'Weight': '2.1 kg', 'Surface': 'Microfibre non-slip', 'Certifications': 'SGS non-toxic' },
  },
  {
    name: 'Speed Jump Rope', categorySlug: 'sports', sku: 'SPRT-005',
    price: 19.99, originalPrice: null, rating: 4.5, reviewCount: 891, stock: 200,
    badge: 'new', iconKey: 'bike', isFeatured: false,
    description: 'Ball-bearing speed rope with adjustable cable and ergonomic foam handles. Perfect for double-unders and cardio HIIT workouts.',
    features: ['Precision ball-bearing rotation', 'Adjustable steel cable (3 m)', 'Ergonomic anti-slip foam handles', 'Tangle-resistant PVC coating', 'Includes extra cable & bag', 'Suitable for all skill levels'],
    specs: { 'Cable': 'Steel, PVC coated, Ø 3 mm', 'Length': 'Adjustable up to 3 m', 'Handle': 'Ergonomic foam, 16 cm', 'Bearing': 'Ball bearing x2 per handle', 'Weight': '175 g', 'Includes': 'Extra cable + carry bag' },
  },
  {
    name: 'High-Density Foam Roller', categorySlug: 'sports', sku: 'SPRT-006',
    price: 29.99, originalPrice: 39.99, rating: 4.7, reviewCount: 1243, stock: 80,
    badge: null, iconKey: 'dumbbell', isFeatured: false,
    description: 'Extra-firm EVA foam roller for deep muscle recovery and myofascial release. Maintains shape under 300 lbs of pressure.',
    features: ['Extra-firm high-density EVA', 'Maintains shape up to 300 lbs', 'Textured surface for trigger points', 'Hollow core (lightweight)', 'Suitable for all body areas', '30 cm professional length'],
    specs: { 'Material': 'High-density EVA foam', 'Dimensions': '30 × 15 cm', 'Max Weight': '300 lbs (136 kg)', 'Density': 'Extra-firm', 'Weight': '400 g', 'Colours': 'Black, Blue, Pink' },
  },
  {
    name: 'Running Phone Armband', categorySlug: 'sports', sku: 'SPRT-007',
    price: 14.99, originalPrice: null, rating: 4.3, reviewCount: 567, stock: 180,
    badge: null, iconKey: 'watch', isFeatured: false,
    description: 'Universal armband for phones up to 7". Touch-screen compatible window, key pocket, reflective stripe, and adjustable arm strap.',
    features: ['Fits phones up to 7" screen', 'Touch-screen transparent window', 'Small key/card pocket', 'Reflective safety stripe', 'Adjustable stretch strap', 'Sweat-wicking neoprene'],
    specs: { 'Compatibility': 'Phones up to 7" / 180 mm wide', 'Material': 'Neoprene + TPU window', 'Pocket': 'Key/card slot', 'Reflective': 'Yes', 'Adjustable': 'Strap 25–42 cm', 'Weight': '65 g' },
  },
  {
    name: 'Smart Fitness Tracker', categorySlug: 'sports', sku: 'SPRT-008',
    price: 79.99, originalPrice: 109.99, rating: 4.4, reviewCount: 2341, stock: 55,
    badge: 'sale', iconKey: 'watch', isFeatured: false,
    description: '14-day battery fitness band with heart rate, SpO2, sleep tracking, and 50 m waterproofing. Works with iOS and Android.',
    features: ['14-day battery life', '24/7 heart rate + SpO2', 'Sleep stage analysis', '50 m waterproof (5 ATM)', '100+ workout modes', 'GPS route tracking (connected)'],
    specs: { 'Display': '1.47" AMOLED, 172 × 320', 'Battery': '14 days (typical use)', 'Sensors': 'HR, SpO2, accelerometer', 'Water Resistance': '5 ATM (50 m)', 'Connectivity': 'Bluetooth 5.0 + GPS (phone)', 'Compatibility': 'iOS 10+ / Android 7+' },
  },
  {
    name: 'Weightlifting Gloves', categorySlug: 'sports', sku: 'SPRT-009',
    price: 22.99, originalPrice: 29.99, rating: 4.5, reviewCount: 714, stock: 110,
    badge: null, iconKey: 'dumbbell', isFeatured: false,
    description: 'Full-palm silicone grip gloves with extended wrist wrap support. Padded palm protects against calluses without losing bar feel.',
    features: ['Full-palm silicone grip pattern', 'Extended wrist wrap support', '8 mm gel palm padding', 'Open-back for breathability', 'Adjustable velcro closure', 'Machine washable'],
    specs: { 'Material': 'Microfibre + silicone palm', 'Padding': '8 mm gel', 'Wrist Wrap': '20 cm extended', 'Closure': 'Velcro', 'Sizes': 'S, M, L, XL', 'Care': 'Machine wash cold' },
  },

  // ─── Books (7) ─────────────────────────────────────────────────────────────
  {
    name: 'Productivity Essentials Box Set', categorySlug: 'books', sku: 'BOOK-001',
    price: 44.99, originalPrice: 64.99, rating: 4.9, reviewCount: 882, stock: 90,
    badge: 'bestSeller', iconKey: 'book', isFeatured: false,
    description: 'Curated bundle of 4 bestselling books on focus, habits, and deep work. Read once and change how you work forever.',
    features: ['4-book curated bundle', 'Covers focus, habits, deep work & time', 'New York Times & WSJ bestsellers', 'Perfect binding lay-flat design', 'Includes reading guide booklet', 'Gift-ready box set'],
    specs: { 'Format': 'Paperback, 4 volumes', 'Pages': '~1 200 total', 'Dimensions': '21 × 14 cm per book', 'Publisher': 'Various', 'Language': 'English', 'ISBN': 'Box set edition' },
  },
  {
    name: 'Creative Writing Masterclass', categorySlug: 'books', sku: 'BOOK-002',
    price: 19.99, originalPrice: null, rating: 4.6, reviewCount: 554, stock: 110,
    badge: 'new', iconKey: 'book', isFeatured: false,
    description: 'Step-by-step guide from first outline to published manuscript. Includes 30 practical exercises and a submission tracker.',
    features: ['30 practical writing exercises', 'Chapter-by-chapter outline method', 'Querying & submission guide', 'Lay-flat paperback binding', 'Illustrated with real examples', 'Submission tracker worksheet'],
    specs: { 'Format': 'Paperback', 'Pages': '320', 'Dimensions': '23 × 15 cm', 'Publisher': 'Craft Press', 'Language': 'English', 'Edition': '2nd edition' },
  },
  {
    name: 'Mindfulness & Meditation Guide', categorySlug: 'books', sku: 'BOOK-003',
    price: 16.99, originalPrice: 22.99, rating: 4.7, reviewCount: 1231, stock: 130,
    badge: null, iconKey: 'book', isFeatured: false,
    description: 'Evidence-based 8-week mindfulness program with daily guided meditations. Reduce stress and improve focus through proven techniques.',
    features: ['8-week structured program', 'Daily guided meditation scripts', 'Science-backed MBSR techniques', 'Breathing & body scan exercises', 'Progress journal pages', 'Recommended by therapists'],
    specs: { 'Format': 'Paperback + downloadable audio', 'Pages': '256', 'Dimensions': '21 × 14 cm', 'Publisher': 'Calm Press', 'Language': 'English', 'Edition': '3rd edition' },
  },
  {
    name: "The Entrepreneur's Playbook", categorySlug: 'books', sku: 'BOOK-004',
    price: 24.99, originalPrice: null, rating: 4.8, reviewCount: 678, stock: 95,
    badge: null, iconKey: 'book', isFeatured: false,
    description: 'Practical framework for validating ideas, finding customers, and scaling fast. Real case studies from 50 founders who built $10M+ businesses.',
    features: ['50 real founder case studies', 'Idea validation framework', 'Customer discovery scripts', 'Fundraising pitch templates', 'Growth metrics cheatsheet', 'Foreword by a YC partner'],
    specs: { 'Format': 'Hardcover', 'Pages': '380', 'Dimensions': '24 × 16 cm', 'Publisher': 'Venture Books', 'Language': 'English', 'Edition': '1st edition' },
  },
  {
    name: 'Data Science for Beginners', categorySlug: 'books', sku: 'BOOK-005',
    price: 29.99, originalPrice: 39.99, rating: 4.5, reviewCount: 432, stock: 80,
    badge: 'sale', iconKey: 'book', isFeatured: false,
    description: 'Hands-on introduction to Python, pandas, and machine learning with real datasets. Goes from zero to building your first ML model.',
    features: ['No prior coding required', 'Python & pandas crash course', '10 real-world dataset projects', 'Machine learning fundamentals', 'Download code & data files', 'Practice quiz per chapter'],
    specs: { 'Format': 'Paperback + digital code bundle', 'Pages': '440', 'Dimensions': '23 × 18 cm', 'Publisher': 'Tech Publish', 'Language': 'English', 'Edition': '4th edition, 2024' },
  },
  {
    name: 'Plant-Based Cooking Bible', categorySlug: 'books', sku: 'BOOK-006',
    price: 32.99, originalPrice: null, rating: 4.8, reviewCount: 921, stock: 75,
    badge: 'bestSeller', iconKey: 'book', isFeatured: false,
    description: '300 whole-food plant-based recipes from quick weeknight dinners to showstopper feasts. Includes meal prep plans and nutrition tables.',
    features: ['300 tested plant-based recipes', '4-week meal prep calendar', 'Nutrition info per serving', 'Full-colour photography', 'Gluten-free & nut-free options flagged', 'Seasonal ingredient guide'],
    specs: { 'Format': 'Hardcover, full colour', 'Pages': '512', 'Dimensions': '26 × 21 cm', 'Publisher': 'Green Table Press', 'Language': 'English', 'Photos': '300+ full-colour' },
  },
  {
    name: 'Design Thinking Handbook', categorySlug: 'books', sku: 'BOOK-007',
    price: 27.99, originalPrice: 34.99, rating: 4.6, reviewCount: 345, stock: 70,
    badge: null, iconKey: 'book', isFeatured: false,
    description: 'Practical guide to the five-stage design thinking process with 40 facilitated workshop exercises for teams and solo practitioners.',
    features: ['5-stage DT process explained', '40 facilitated workshop exercises', 'Downloadable workshop templates', 'Case studies from IDEO & Stanford', 'Remote-friendly exercise variants', 'Index of methods & tools'],
    specs: { 'Format': 'Spiral-bound softcover', 'Pages': '292', 'Dimensions': '24 × 19 cm', 'Publisher': 'UX Studio Press', 'Language': 'English', 'Extras': 'Download code for templates' },
  },

  // ─── Beauty (7) ────────────────────────────────────────────────────────────
  {
    name: 'Vitamin C Brightening Serum', categorySlug: 'beauty', sku: 'BEAU-001',
    price: 38.99, originalPrice: null, rating: 4.8, reviewCount: 2672, stock: 85,
    badge: 'bestSeller', iconKey: 'sparkles', isFeatured: true,
    description: '15% stabilised Vitamin C with hyaluronic acid for radiant, even-toned skin. Absorbs in seconds — zero grease.',
    features: ['15% L-Ascorbic Acid (stabilised)', 'Hyaluronic acid for deep hydration', 'Brightens & evens skin tone', 'Fragrance-free formula', 'Dermatologist tested', 'Recyclable glass dropper bottle'],
    specs: { 'Active': '15% Vitamin C (L-AA)', 'Secondary Actives': 'Hyaluronic acid, Niacinamide 3%', 'Size': '30 ml', 'pH': '3.0 – 3.5', 'Fragrance': 'Fragrance-free', 'Packaging': 'Dark glass + dropper' },
  },
  {
    name: 'Rose Clay Face Mask', categorySlug: 'beauty', sku: 'BEAU-002',
    price: 22.99, originalPrice: 29.99, rating: 4.5, reviewCount: 1891, stock: 95,
    badge: 'sale', iconKey: 'flask', isFeatured: false,
    description: 'Deep pore cleansing with rose clay and green tea antioxidants. 10 minutes to visibly smaller-looking pores.',
    features: ['Rose kaolin clay base', 'Green tea antioxidant complex', 'Deep pore cleansing', 'Suitable for all skin types', 'Paraben & sulfate-free', '~30 uses per jar'],
    specs: { 'Key Ingredients': 'Rose kaolin clay, Green tea extract', 'Size': '100 g', 'Skin Type': 'All types', 'Usage': '10 min, 2× per week', 'Preservatives': 'Paraben-free', 'Packaging': 'Recyclable glass jar' },
  },
  {
    name: 'Natural Beard Oil', categorySlug: 'beauty', sku: 'BEAU-003',
    price: 18.99, originalPrice: null, rating: 4.7, reviewCount: 823, stock: 110,
    badge: 'new', iconKey: 'droplets', isFeatured: false,
    description: 'Blend of jojoba, argan, and sweet almond oil with cedarwood and sandalwood. Softens beard, conditions skin, and eliminates itchiness.',
    features: ['Jojoba, argan & sweet almond base', 'Cedarwood + sandalwood scent', 'Eliminates beard itch', 'Softens coarse hair', 'Non-greasy formula', '30 ml precision dropper'],
    specs: { 'Base Oils': 'Jojoba, argan, sweet almond', 'Scent': 'Cedarwood & sandalwood', 'Size': '30 ml', 'Finish': 'Non-greasy', 'Skin Type': 'All skin types', 'Free From': 'Parabens, sulfates, silicones' },
  },
  {
    name: 'Bamboo Charcoal Toothbrush Set', categorySlug: 'beauty', sku: 'BEAU-004',
    price: 14.99, originalPrice: null, rating: 4.5, reviewCount: 1123, stock: 200,
    badge: null, iconKey: 'leaf', isFeatured: false,
    description: 'Set of 4 biodegradable bamboo toothbrushes with activated charcoal infused nylon bristles. Plastic-free, dentist-soft, and compostable handle.',
    features: ['100% biodegradable bamboo handle', 'Activated charcoal BPA-free nylon bristles', 'Dentist-recommended soft bristles', 'Compostable handle', 'Set of 4 (3-month supply)', 'Minimal recyclable packaging'],
    specs: { 'Handle': '100% Moso bamboo', 'Bristles': 'Charcoal nylon (BPA-free)', 'Bristle Hardness': 'Soft', 'Pack': '4 toothbrushes', 'Disposal': 'Compostable handle', 'Packaging': 'Recyclable cardboard' },
  },
  {
    name: 'Coffee & Sugar Body Scrub', categorySlug: 'beauty', sku: 'BEAU-005',
    price: 24.99, originalPrice: 32.99, rating: 4.6, reviewCount: 987, stock: 90,
    badge: 'sale', iconKey: 'sparkles', isFeatured: false,
    description: 'Energising arabica coffee and brown sugar scrub with coconut oil. Buffs away dead skin, reduces appearance of cellulite, and smells incredible.',
    features: ['Ground arabica coffee exfoliant', 'Brown sugar for gentle buffing', 'Coconut + vitamin E moisturise', 'Reduces cellulite appearance', 'Cellulite & stretch mark safe', 'Paraben-free, vegan'],
    specs: { 'Key Ingredients': 'Arabica coffee, brown sugar, coconut oil', 'Size': '300 g', 'Skin Type': 'All types', 'Usage': '2–3× per week in shower', 'Preservatives': 'Paraben-free', 'Vegan': 'Yes' },
  },
  {
    name: 'Hyaluronic Acid Night Cream', categorySlug: 'beauty', sku: 'BEAU-006',
    price: 44.99, originalPrice: 59.99, rating: 4.8, reviewCount: 1456, stock: 75,
    badge: null, iconKey: 'flask', isFeatured: false,
    description: 'Triple-weight hyaluronic acid plus retinol 0.1% for overnight skin renewal. Wake up to visibly plumper, smoother skin after just 2 weeks.',
    features: ['Triple-weight hyaluronic acid', 'Retinol 0.1% for cell renewal', 'Peptide complex for firmness', 'Fragrance-free', 'Suitable for sensitive skin', 'Dermatologist tested & approved'],
    specs: { 'Key Actives': 'Hyaluronic acid (3 weights), Retinol 0.1%', 'Size': '50 ml', 'Skin Type': 'All, inc. sensitive', 'Usage': 'Nightly, after toner', 'pH': '6.0 – 6.5', 'Free From': 'Fragrance, parabens, mineral oil' },
  },
  {
    name: 'Micellar Cleansing Water', categorySlug: 'beauty', sku: 'BEAU-007',
    price: 12.99, originalPrice: null, rating: 4.4, reviewCount: 2134, stock: 160,
    badge: null, iconKey: 'droplets', isFeatured: false,
    description: '400 ml no-rinse micellar water with aloe vera and panthenol. Removes makeup, cleanses, and soothes — without stripping the skin barrier.',
    features: ['No-rinse formula (cotton pad only)', 'Removes waterproof makeup', 'Aloe vera + panthenol soothing', 'Fragrance & alcohol-free', 'No rinse required', 'Tested on sensitive & reactive skin'],
    specs: { 'Key Actives': 'Micelles, aloe vera, panthenol', 'Size': '400 ml', 'Skin Type': 'All, inc. sensitive', 'Usage': 'Saturate cotton pad, sweep over face', 'Free From': 'Alcohol, fragrance, parabens', 'pH': '5.5' },
  },
];

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ Database connected\n');

  const categoryRepo = AppDataSource.getRepository(Category);
  const productRepo  = AppDataSource.getRepository(Product);

  // ── Wipe existing data (products first to avoid FK constraint issues) ──────
  await productRepo.createQueryBuilder().delete().execute();
  console.log('🗑  Deleted all products');
  await categoryRepo.createQueryBuilder().delete().execute();
  console.log('🗑  Deleted all categories\n');

  // ── Seed categories ───────────────────────────────────────────────────────
  const categoryMap = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const created = await categoryRepo.save(
      categoryRepo.create({ ...cat, isActive: true }),
    );
    categoryMap.set(cat.slug, created.id);
    console.log(`✅ Category: ${cat.name}`);
  }

  console.log('');

  // ── Seed products ─────────────────────────────────────────────────────────
  let count = 0;
  for (const p of PRODUCTS) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) {
      console.warn(`⚠  Category not found: ${p.categorySlug}`);
      continue;
    }
    await productRepo.save(productRepo.create({
      name:              p.name,
      description:       p.description,
      price:             p.price,
      originalPrice:     p.originalPrice ?? undefined,
      sku:               p.sku,
      stock:             p.stock,
      lowStockThreshold: 5,
      rating:            p.rating,
      reviewCount:       p.reviewCount,
      badge:             p.badge ?? undefined,
      iconKey:           p.iconKey,
      isFeatured:        p.isFeatured,
      features:          p.features,
      specs:             p.specs,
      isActive:          true,
      categoryId,
    }));
    count++;
    console.log(`✅ [${String(count).padStart(2, '0')}/50] ${p.name}`);
  }

  console.log(`\n🎉 Seed complete — ${CATEGORIES.length} categories, ${count} products`);
  await AppDataSource.destroy();
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
