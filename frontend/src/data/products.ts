export type Category = 'electronics' | 'fashion' | 'home' | 'sports' | 'books' | 'beauty';
export type Badge = 'bestSeller' | 'new' | 'sale' | null;

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviews: number;
  badge: Badge;
  iconKey: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
}

export const allProducts: Product[] = [
  // Electronics
  {
    id: '1', name: 'Pro Wireless Headphones', category: 'electronics',
    price: 79.99, originalPrice: 129.99, rating: 4.8, reviews: 234,
    badge: 'bestSeller', iconKey: 'headphones',
    description: 'Premium ANC sound with 30-hour battery life and foldable design. Engineered for audiophiles who demand clarity in every environment.',
    features: ['Active Noise Cancellation', '30-hour battery life', 'Foldable travel design', 'Premium 40mm neodymium drivers', 'USB-C fast charge (15 min = 3 h)', 'Multipoint Bluetooth 5.2'],
    specs: { 'Driver Size': '40 mm', 'Frequency Response': '20 Hz – 20 kHz', 'Battery Life': '30 h (ANC on)', 'Charging': 'USB-C', 'Weight': '250 g', 'Connectivity': 'Bluetooth 5.2' },
  },
  {
    id: '2', name: '4K Curved Monitor', category: 'electronics',
    price: 349.99, originalPrice: 499.99, rating: 4.6, reviews: 89,
    badge: 'sale', iconKey: 'monitor',
    description: 'Ultra-wide 34" curved display with HDR and 165 Hz refresh rate. Immersive visuals for work, gaming, and content creation.',
    features: ['34" ultra-wide 21:9 curved panel', '165 Hz refresh rate', 'HDR10 with 1000 nits peak', '1 ms response time (MPRT)', 'USB-C 90 W Power Delivery', 'Height & tilt adjustable stand'],
    specs: { 'Panel': 'VA, 34" curved', 'Resolution': '3440 × 1440 (UWQHD)', 'Refresh Rate': '165 Hz', 'Response Time': '1 ms (MPRT)', 'HDR': 'HDR10 / 1000 nits', 'Inputs': 'HDMI 2.1, DP 1.4, USB-C' },
  },
  {
    id: '3', name: 'Smart Bluetooth Speaker', category: 'electronics',
    price: 59.99, originalPrice: null, rating: 4.5, reviews: 312,
    badge: 'new', iconKey: 'speaker',
    description: '360° room-filling sound with built-in voice assistant and IPX7 waterproofing. Perfect for home, office, or outdoor adventures.',
    features: ['360° omnidirectional sound', 'IPX7 waterproof', 'Built-in voice assistant', '20-hour playtime', 'True wireless stereo pairing', 'USB-C charging'],
    specs: { 'Output Power': '20 W (2 × 10 W)', 'Battery Life': '20 h', 'Waterproof': 'IPX7', 'Connectivity': 'Bluetooth 5.3', 'Charging': 'USB-C', 'Weight': '540 g' },
  },
  // Fashion
  {
    id: '4', name: 'Slim Leather Wallet', category: 'fashion',
    price: 29.99, originalPrice: null, rating: 4.6, reviews: 156,
    badge: null, iconKey: 'wallet',
    description: 'Handcrafted genuine leather with RFID blocking and 8 card slots. Slim profile that slides easily into any pocket.',
    features: ['Full-grain genuine leather', 'RFID blocking liner', '8 card slots + 2 cash pockets', 'Slim profile (8 mm thin)', 'Burnished edge finish', 'Fits front or back pocket'],
    specs: { 'Material': 'Full-grain cowhide', 'Dimensions': '105 × 85 × 8 mm', 'Card Slots': '8', 'RFID': 'Blocking (13.56 MHz)', 'Stitching': 'Waxed thread', 'Colours': 'Black, Brown, Tan' },
  },
  {
    id: '5', name: 'Ultralight Running Shoes', category: 'fashion',
    price: 89.99, originalPrice: 119.99, rating: 4.9, reviews: 512,
    badge: 'new', iconKey: 'sneaker',
    description: 'Featherlight mesh upper with a responsive foam midsole. Built for speed with breathability you can feel from the first stride.',
    features: ['Engineered mesh upper', 'Responsive EVA foam midsole', 'Carbon-rubber outsole', 'Reflective detailing', 'Wide toe box', 'Machine washable'],
    specs: { 'Upper': 'Engineered mesh', 'Midsole': 'Responsive EVA foam', 'Outsole': 'Carbon rubber', 'Drop': '8 mm', 'Weight': '210 g (US 9)', 'Sizes': 'US 6–13 (half sizes)' },
  },
  {
    id: '6', name: 'Minimalist Steel Watch', category: 'fashion',
    price: 149.99, originalPrice: 199.99, rating: 4.7, reviews: 178,
    badge: 'sale', iconKey: 'watch',
    description: 'Swiss movement inside a brushed stainless steel case with sapphire crystal glass. Timeless design for every occasion.',
    features: ['Swiss quartz movement', 'Scratch-resistant sapphire crystal', 'Brushed 316L stainless steel case', '5 ATM water resistance', 'Quick-release leather strap', '2-year movement warranty'],
    specs: { 'Movement': 'Swiss quartz', 'Case': '316L stainless steel, 40 mm', 'Crystal': 'Sapphire', 'Water Resistance': '5 ATM (50 m)', 'Strap': 'Genuine leather, 20 mm lug', 'Battery': 'SR626SW (~3 years)' },
  },
  {
    id: '7', name: 'Classic Crew-neck Shirt', category: 'fashion',
    price: 34.99, originalPrice: null, rating: 4.4, reviews: 98,
    badge: null, iconKey: 'shirt',
    description: '100% organic cotton, pre-washed for softness, relaxed fit. The wardrobe essential that pairs with everything.',
    features: ['100% GOTS-certified organic cotton', 'Enzyme-washed for softness', 'Relaxed unisex fit', 'Ribbed crew neck', 'Double-needle hem', 'Fade-resistant dye'],
    specs: { 'Material': '100% organic cotton, 180 gsm', 'Fit': 'Relaxed', 'Neckline': 'Crew neck', 'Sizes': 'XS – 3XL', 'Care': 'Machine wash cold', 'Certification': 'GOTS organic' },
  },
  // Home
  {
    id: '8', name: 'Ceramic Pour-over Set', category: 'home',
    price: 39.99, originalPrice: null, rating: 4.8, reviews: 94,
    badge: null, iconKey: 'coffee',
    description: 'Handmade ceramic dripper with a walnut handle and matching carafe. Bring café-quality pour-over ritual into your kitchen.',
    features: ['Hand-thrown ceramic dripper', 'Matching 600 ml carafe', 'Sustainable walnut handle', 'Food-safe glaze', 'Compatible with paper or reusable filters', 'Dishwasher safe (carafe)'],
    specs: { 'Material': 'Stoneware ceramic', 'Carafe Capacity': '600 ml', 'Filter Size': '#2 cone', 'Dimensions': '14 × 12 × 20 cm', 'Handle': 'FSC walnut', 'Weight': '480 g' },
  },
  {
    id: '9', name: 'Nordic Desk Lamp', category: 'home',
    price: 69.99, originalPrice: 89.99, rating: 4.5, reviews: 67,
    badge: 'sale', iconKey: 'lamp',
    description: 'Adjustable LED with 5 colour temperatures and a touch dimmer. Scandinavian-inspired design that looks as good as it lights.',
    features: ['5 colour temperatures (2700–6500 K)', 'Touch-sensitive dimmer (3 levels)', 'Energy-efficient LED (9 W)', '360° rotatable arm', 'USB-A charging port', 'Memory function'],
    specs: { 'Light Source': 'LED, 9 W', 'Colour Temperature': '2700 – 6500 K', 'Brightness': '500 lm', 'CRI': '≥ 90', 'Arm Reach': '45 cm', 'Voltage': '100–240 V' },
  },
  {
    id: '10', name: 'Linen Throw Blanket', category: 'home',
    price: 49.99, originalPrice: null, rating: 4.7, reviews: 143,
    badge: 'bestSeller', iconKey: 'leaf',
    description: 'Stonewashed European linen, naturally breathable and durable. Gets softer with every wash for a lifetime of cosy evenings.',
    features: ['100% European stonewashed linen', 'Gets softer with every wash', 'Naturally temperature-regulating', 'Hypoallergenic & anti-static', 'Fringe tassel ends', 'OEKO-TEX® certified'],
    specs: { 'Material': '100% linen', 'Dimensions': '130 × 170 cm', 'Weight': '350 gsm', 'Care': 'Machine wash 40°C', 'Certification': 'OEKO-TEX® Standard 100', 'Origin': 'Portugal' },
  },
  // Sports
  {
    id: '11', name: 'Adjustable Dumbbell Set', category: 'sports',
    price: 129.99, originalPrice: 179.99, rating: 4.7, reviews: 203,
    badge: 'bestSeller', iconKey: 'dumbbell',
    description: 'Replaces 15 dumbbells with a quick-adjust dial from 5 to 52.5 lbs. Save space without sacrificing range.',
    features: ['Replaces 15 pairs of dumbbells', 'Quick-adjust dial system', 'Weight range: 5–52.5 lbs', 'Compact storage tray included', 'Ergonomic anti-roll handle', 'Secure locking mechanism'],
    specs: { 'Weight Range': '5 – 52.5 lbs (15 settings)', 'Adjustment': 'Dial selector', 'Handle Length': '35 cm', 'Material': 'Steel plates, ABS casing', 'Includes': '2 dumbbells + 2 trays', 'Warranty': '2 years' },
  },
  {
    id: '12', name: 'Insulated Water Bottle', category: 'sports',
    price: 34.99, originalPrice: null, rating: 4.6, reviews: 421,
    badge: null, iconKey: 'bottle',
    description: 'Triple-insulated stainless steel keeps drinks cold 24 h or hot 12 h. BPA-free, leak-proof, and built to last.',
    features: ['Triple-wall vacuum insulation', 'Cold 24 h / Hot 12 h', 'BPA-free 18/8 stainless steel', 'Leak-proof lid', 'Wide mouth (fits ice cubes)', 'Powder-coated grip finish'],
    specs: { 'Capacity': '750 ml', 'Material': '18/8 stainless steel', 'Insulation': 'Triple-wall vacuum', 'Mouth Width': '53 mm', 'Height': '26 cm', 'Weight': '320 g (empty)' },
  },
  {
    id: '13', name: 'Resistance Band Set', category: 'sports',
    price: 24.99, originalPrice: 39.99, rating: 4.5, reviews: 318,
    badge: 'sale', iconKey: 'bike',
    description: '5-level resistance set from 10–50 lbs. Includes carry bag and door anchor for full-body workouts anywhere.',
    features: ['5 resistance levels (10–50 lbs)', 'Snap-resistant natural latex', 'Door anchor included', 'Ankle straps included', 'Carry bag included', 'Suitable for all fitness levels'],
    specs: { 'Levels': '5 (Yellow, Red, Green, Blue, Black)', 'Resistance': '10 / 20 / 30 / 40 / 50 lbs', 'Material': 'Natural latex', 'Length': '120 cm per band', 'Accessories': 'Door anchor, ankle straps, bag', 'Warranty': '1 year' },
  },
  // Books
  {
    id: '14', name: 'Productivity Essentials Set', category: 'books',
    price: 44.99, originalPrice: 64.99, rating: 4.9, reviews: 88,
    badge: 'bestSeller', iconKey: 'book',
    description: 'Curated bundle of 4 bestselling books on focus, habits, and deep work. Read them once and change how you work forever.',
    features: ['4-book curated bundle', 'Covers focus, habits, deep work & time', 'Bestseller titles (NY Times / WSJ)', 'Perfect binding, lay-flat design', 'Includes reading guide booklet', 'Gift-ready box set'],
    specs: { 'Format': 'Paperback, 4 volumes', 'Pages': '~1200 total', 'Dimensions': '21 × 14 cm per book', 'Publisher': 'Various', 'Language': 'English', 'ISBN': 'Box set' },
  },
  {
    id: '15', name: 'Creative Writing Masterclass', category: 'books',
    price: 19.99, originalPrice: null, rating: 4.6, reviews: 55,
    badge: 'new', iconKey: 'book',
    description: 'Step-by-step guide from first outline to published manuscript. Includes 30 practical exercises and a submission tracker.',
    features: ['30 practical writing exercises', 'Chapter-by-chapter outline method', 'Querying & submission guide', 'Lay-flat paperback binding', 'Illustrated with examples', 'Includes submission tracker worksheet'],
    specs: { 'Format': 'Paperback', 'Pages': '320', 'Dimensions': '23 × 15 cm', 'Publisher': 'Craft Press', 'Language': 'English', 'Edition': '2nd edition' },
  },
  // Beauty
  {
    id: '16', name: 'Vitamin C Brightening Serum', category: 'beauty',
    price: 38.99, originalPrice: null, rating: 4.8, reviews: 267,
    badge: 'new', iconKey: 'sparkles',
    description: '15% stabilised Vitamin C with hyaluronic acid for radiant, even-toned skin. Absorbs in seconds, zero grease.',
    features: ['15% L-Ascorbic Acid (stabilised)', 'Hyaluronic acid for deep hydration', 'Brightens & evens skin tone', 'Fragrance-free formula', 'Dermatologist tested', 'Recyclable glass dropper bottle'],
    specs: { 'Active': '15% Vitamin C (L-AA)', 'Secondary Actives': 'Hyaluronic acid, Niacinamide 3%', 'Size': '30 ml', 'pH': '3.0 – 3.5', 'Fragrance': 'Fragrance-free', 'Packaging': 'Dark glass + dropper' },
  },
  {
    id: '17', name: 'Rose Clay Face Mask', category: 'beauty',
    price: 22.99, originalPrice: 29.99, rating: 4.5, reviews: 189,
    badge: 'sale', iconKey: 'flask',
    description: 'Deep pore cleansing with rose clay and green tea antioxidants. 10 minutes to visibly smaller-looking pores.',
    features: ['Rose kaolin clay base', 'Green tea antioxidant complex', 'Deep pore cleansing', 'Suitable for all skin types', 'Paraben & sulfate-free', '~30 uses per jar'],
    specs: { 'Key Ingredients': 'Rose kaolin clay, Green tea extract', 'Size': '100 g', 'Skin Type': 'All types', 'Usage': '10 min, 2× per week', 'Preservatives': 'Paraben-free', 'Packaging': 'Recyclable glass jar' },
  },
];

export const featuredIds = ['1', '4', '5', '6'];
