export type Locale = 'en' | 'bn' | 'es' | 'hi';

export interface Translation {
  nav: {
    categories: string; products: string; about: string;
    signIn: string; signOut: string; getStarted: string; greeting: string;
  };
  hero: {
    badge: string; headline: string; headlineMuted: string; sub: string;
    cta1: string; cta2: string; trust1: string; trust2: string; trust3: string;
  };
  values: {
    shipping: { title: string; desc: string };
    secure:   { title: string; desc: string };
    returns:  { title: string; desc: string };
    support:  { title: string; desc: string };
  };
  categories: {
    eyebrow: string; title: string; viewAll: string;
    electronics: string; fashion: string; home: string;
    sports: string; books: string; beauty: string;
  };
  products: {
    eyebrow: string; title: string; viewAll: string;
    bestSeller: string; new: string; sale: string;
  };
  stats: { customers: string; products: string; satisfaction: string; support: string };
  testimonials: { eyebrow: string; title: string; role: string };
  newsletter: { title: string; desc: string; placeholder: string; cta: string; disclaimer: string };
  footer: {
    tagline: string; shop: string; company: string; support: string; legal: string;
    newArrivals: string; bestSellers: string; sale: string; allProducts: string;
    about: string; careers: string; blog: string; press: string;
    helpCenter: string; returns: string; shipping: string; trackOrder: string;
    privacy: string; terms: string; cookies: string;
    copyright: string; crafted: string;
  };
  login: {
    title: string; sub: string; email: string; password: string;
    submit: string; loading: string; noAccount: string; register: string;
  };
  register: {
    title: string; sub: string; firstName: string; lastName: string;
    email: string; password: string; submit: string; loading: string;
    hasAccount: string; signIn: string;
  };
  cart: {
    title: string; empty: string; emptyDesc: string;
    continueShopping: string; clearCart: string;
    subtotal: string; shippingNote: string; checkout: string;
  };
}

const en: Translation = {
  nav: {
    categories: 'Categories', products: 'Products', about: 'About',
    signIn: 'Sign in', signOut: 'Sign out', getStarted: 'Get started', greeting: 'Hi, {{name}}',
  },
  hero: {
    badge: 'New arrivals every week',
    headline: 'Shop smarter.', headlineMuted: 'Live better.',
    sub: 'Thousands of products across every category — delivered fast, priced right, and backed by a no-hassle returns policy.',
    cta1: 'Shop now', cta2: 'Browse categories',
    trust1: 'Free shipping over $50', trust2: '30-day returns', trust3: 'Secure checkout',
  },
  values: {
    shipping: { title: 'Free Shipping',    desc: 'On orders over $50. Fast delivery to your door.' },
    secure:   { title: 'Secure Payments',  desc: 'Your payment info is always safe with us.' },
    returns:  { title: '30-Day Returns',   desc: 'Changed your mind? No problem at all.' },
    support:  { title: '24/7 Support',     desc: 'Our team is always here to help you.' },
  },
  categories: {
    eyebrow: 'Browse', title: 'Shop by category', viewAll: 'View all',
    electronics: 'Electronics', fashion: 'Fashion', home: 'Home & Living',
    sports: 'Sports', books: 'Books', beauty: 'Beauty',
  },
  products: {
    eyebrow: 'Trending', title: 'Featured products', viewAll: 'View all',
    bestSeller: 'Best Seller', new: 'New', sale: 'Sale',
  },
  stats: { customers: 'Happy Customers', products: 'Products', satisfaction: 'Satisfaction Rate', support: 'Support' },
  testimonials: { eyebrow: 'Reviews', title: 'What customers say', role: 'Verified Buyer' },
  newsletter: {
    title: 'Stay in the loop',
    desc: 'Get weekly updates on new arrivals, exclusive deals, and member-only offers.',
    placeholder: 'Enter your email address', cta: 'Subscribe',
    disclaimer: 'No spam, ever. Unsubscribe any time.',
  },
  footer: {
    tagline: 'Your one-stop destination for quality products at unbeatable prices.',
    shop: 'Shop', company: 'Company', support: 'Support', legal: 'Legal',
    newArrivals: 'New Arrivals', bestSellers: 'Best Sellers', sale: 'Sale', allProducts: 'All Products',
    about: 'About Us', careers: 'Careers', blog: 'Blog', press: 'Press',
    helpCenter: 'Help Center', returns: 'Returns', shipping: 'Shipping Info', trackOrder: 'Track Order',
    privacy: 'Privacy Policy', terms: 'Terms of Service', cookies: 'Cookie Policy',
    copyright: '© {{year}} ShopCo. All rights reserved.',
    crafted: 'Crafted with care for great shopping experiences.',
  },
  login: {
    title: 'Sign in', sub: 'Enter your credentials to continue',
    email: 'Email', password: 'Password',
    submit: 'Sign in', loading: 'Signing in…',
    noAccount: "Don't have an account?", register: 'Register',
  },
  register: {
    title: 'Create account', sub: 'Fill in your details to get started',
    firstName: 'First name', lastName: 'Last name', email: 'Email', password: 'Password',
    submit: 'Create account', loading: 'Creating account…',
    hasAccount: 'Already have an account?', signIn: 'Sign in',
  },
  cart: {
    title: 'Cart', empty: 'Your cart is empty',
    emptyDesc: 'Add some products to get started',
    continueShopping: 'Continue shopping', clearCart: 'Clear cart',
    subtotal: 'Subtotal', shippingNote: 'Shipping and taxes calculated at checkout.',
    checkout: 'Checkout',
  },
};

const bn: Translation = {
  nav: {
    categories: 'বিভাগ', products: 'পণ্য', about: 'আমাদের সম্পর্কে',
    signIn: 'সাইন ইন', signOut: 'সাইন আউট', getStarted: 'শুরু করুন', greeting: 'হ্যালো, {{name}}',
  },
  hero: {
    badge: 'প্রতি সপ্তাহে নতুন পণ্য',
    headline: 'বুদ্ধিমানভাবে কিনুন।', headlineMuted: 'ভালো থাকুন।',
    sub: 'প্রতিটি বিভাগে হাজার হাজার পণ্য — দ্রুত ডেলিভারি, সঠিক মূল্য এবং ঝামেলামুক্ত রিটার্ন নীতি সহ।',
    cta1: 'এখনই কিনুন', cta2: 'বিভাগ দেখুন',
    trust1: '$৫০-এর উপরে বিনামূল্যে শিপিং', trust2: '৩০ দিনের রিটার্ন', trust3: 'নিরাপদ চেকআউট',
  },
  values: {
    shipping: { title: 'বিনামূল্যে শিপিং',  desc: '$৫০-এর উপরে অর্ডারে। দ্রুত ডেলিভারি।' },
    secure:   { title: 'নিরাপদ পেমেন্ট',    desc: 'আপনার পেমেন্ট তথ্য সর্বদা নিরাপদ।' },
    returns:  { title: '৩০ দিনের রিটার্ন',  desc: 'মন পরিবর্তন করেছেন? কোনো সমস্যা নেই।' },
    support:  { title: '২৪/৭ সাপোর্ট',      desc: 'আমাদের দল সবসময় আপনাকে সাহায্য করতে প্রস্তুত।' },
  },
  categories: {
    eyebrow: 'ব্রাউজ করুন', title: 'বিভাগ অনুযায়ী কিনুন', viewAll: 'সব দেখুন',
    electronics: 'ইলেকট্রনিক্স', fashion: 'ফ্যাশন', home: 'গৃহস্থালি',
    sports: 'খেলাধুলা', books: 'বই', beauty: 'সৌন্দর্য',
  },
  products: {
    eyebrow: 'ট্রেন্ডিং', title: 'বিশেষ পণ্যসমূহ', viewAll: 'সব দেখুন',
    bestSeller: 'বেস্ট সেলার', new: 'নতুন', sale: 'সেল',
  },
  stats: { customers: 'সন্তুষ্ট গ্রাহক', products: 'পণ্য', satisfaction: 'সন্তুষ্টির হার', support: 'সাপোর্ট' },
  testimonials: { eyebrow: 'পর্যালোচনা', title: 'গ্রাহকরা কী বলেন', role: 'যাচাইকৃত ক্রেতা' },
  newsletter: {
    title: 'আপডেটে থাকুন',
    desc: 'নতুন পণ্য, এক্সক্লুসিভ ডিল এবং সদস্য অফার সম্পর্কে সাপ্তাহিক আপডেট পান।',
    placeholder: 'আপনার ইমেইল ঠিকানা দিন', cta: 'সাবস্ক্রাইব করুন',
    disclaimer: 'কোনো স্প্যাম নেই। যেকোনো সময় আনসাবস্ক্রাইব করুন।',
  },
  footer: {
    tagline: 'সর্বোত্তম মানের পণ্য সাশ্রয়ী মূল্যে পাওয়ার আপনার একমাত্র গন্তব্য।',
    shop: 'কেনাকাটা', company: 'কোম্পানি', support: 'সাপোর্ট', legal: 'আইনি',
    newArrivals: 'নতুন পণ্য', bestSellers: 'বেস্ট সেলার', sale: 'সেল', allProducts: 'সব পণ্য',
    about: 'আমাদের সম্পর্কে', careers: 'ক্যারিয়ার', blog: 'ব্লগ', press: 'প্রেস',
    helpCenter: 'সহায়তা কেন্দ্র', returns: 'রিটার্ন', shipping: 'শিপিং তথ্য', trackOrder: 'অর্ডার ট্র্যাক করুন',
    privacy: 'গোপনীয়তা নীতি', terms: 'সেবার শর্ত', cookies: 'কুকি নীতি',
    copyright: '© {{year}} ShopCo. সর্বস্বত্ব সংরক্ষিত।',
    crafted: 'দুর্দান্ত শপিং অভিজ্ঞতার জন্য যত্নের সাথে তৈরি।',
  },
  login: {
    title: 'সাইন ইন করুন', sub: 'চালিয়ে যেতে আপনার তথ্য দিন',
    email: 'ইমেইল', password: 'পাসওয়ার্ড',
    submit: 'সাইন ইন', loading: 'সাইন ইন হচ্ছে…',
    noAccount: 'অ্যাকাউন্ট নেই?', register: 'নিবন্ধন করুন',
  },
  register: {
    title: 'অ্যাকাউন্ট তৈরি করুন', sub: 'শুরু করতে আপনার তথ্য পূরণ করুন',
    firstName: 'প্রথম নাম', lastName: 'শেষ নাম', email: 'ইমেইল', password: 'পাসওয়ার্ড',
    submit: 'অ্যাকাউন্ট তৈরি করুন', loading: 'অ্যাকাউন্ট তৈরি হচ্ছে…',
    hasAccount: 'ইতোমধ্যে অ্যাকাউন্ট আছে?', signIn: 'সাইন ইন করুন',
  },
  cart: {
    title: 'কার্ট', empty: 'আপনার কার্ট খালি',
    emptyDesc: 'শুরু করতে কিছু পণ্য যোগ করুন',
    continueShopping: 'কেনাকাটা চালিয়ে যান', clearCart: 'কার্ট পরিষ্কার করুন',
    subtotal: 'সাবটোটাল', shippingNote: 'চেকআউটে শিপিং ও কর গণনা হবে।',
    checkout: 'চেকআউট',
  },
};

const es: Translation = {
  nav: {
    categories: 'Categorías', products: 'Productos', about: 'Nosotros',
    signIn: 'Iniciar sesión', signOut: 'Cerrar sesión', getStarted: 'Comenzar', greeting: 'Hola, {{name}}',
  },
  hero: {
    badge: 'Nuevos productos cada semana',
    headline: 'Compra más inteligente.', headlineMuted: 'Vive mejor.',
    sub: 'Miles de productos en cada categoría — entrega rápida, precios correctos y con política de devoluciones sin complicaciones.',
    cta1: 'Comprar ahora', cta2: 'Ver categorías',
    trust1: 'Envío gratis en pedidos sobre $50', trust2: 'Devoluciones en 30 días', trust3: 'Pago seguro',
  },
  values: {
    shipping: { title: 'Envío Gratis',          desc: 'En pedidos sobre $50. Entrega rápida a tu puerta.' },
    secure:   { title: 'Pagos Seguros',          desc: 'Tu información de pago siempre está protegida.' },
    returns:  { title: 'Devoluciones en 30 días', desc: '¿Cambiaste de opinión? Sin problemas.' },
    support:  { title: 'Soporte 24/7',           desc: 'Nuestro equipo siempre está aquí para ayudarte.' },
  },
  categories: {
    eyebrow: 'Explorar', title: 'Comprar por categoría', viewAll: 'Ver todo',
    electronics: 'Electrónica', fashion: 'Moda', home: 'Hogar y Vida',
    sports: 'Deportes', books: 'Libros', beauty: 'Belleza',
  },
  products: {
    eyebrow: 'Tendencias', title: 'Productos destacados', viewAll: 'Ver todo',
    bestSeller: 'Más Vendido', new: 'Nuevo', sale: 'Oferta',
  },
  stats: { customers: 'Clientes Felices', products: 'Productos', satisfaction: 'Tasa de Satisfacción', support: 'Soporte' },
  testimonials: { eyebrow: 'Reseñas', title: 'Lo que dicen los clientes', role: 'Comprador Verificado' },
  newsletter: {
    title: 'Mantente al día',
    desc: 'Recibe actualizaciones semanales sobre nuevos productos, ofertas exclusivas y ofertas solo para miembros.',
    placeholder: 'Ingresa tu dirección de correo', cta: 'Suscribirse',
    disclaimer: 'Sin spam, nunca. Cancela cuando quieras.',
  },
  footer: {
    tagline: 'Tu destino único para productos de calidad a precios imbatibles.',
    shop: 'Tienda', company: 'Empresa', support: 'Soporte', legal: 'Legal',
    newArrivals: 'Novedades', bestSellers: 'Más Vendidos', sale: 'Ofertas', allProducts: 'Todos los Productos',
    about: 'Sobre Nosotros', careers: 'Empleos', blog: 'Blog', press: 'Prensa',
    helpCenter: 'Centro de Ayuda', returns: 'Devoluciones', shipping: 'Info de Envío', trackOrder: 'Rastrear Pedido',
    privacy: 'Política de Privacidad', terms: 'Términos de Servicio', cookies: 'Política de Cookies',
    copyright: '© {{year}} ShopCo. Todos los derechos reservados.',
    crafted: 'Creado con cuidado para experiencias de compra increíbles.',
  },
  login: {
    title: 'Iniciar sesión', sub: 'Ingresa tus credenciales para continuar',
    email: 'Correo electrónico', password: 'Contraseña',
    submit: 'Iniciar sesión', loading: 'Iniciando sesión…',
    noAccount: '¿No tienes cuenta?', register: 'Registrarse',
  },
  register: {
    title: 'Crear cuenta', sub: 'Completa tus datos para comenzar',
    firstName: 'Nombre', lastName: 'Apellido', email: 'Correo electrónico', password: 'Contraseña',
    submit: 'Crear cuenta', loading: 'Creando cuenta…',
    hasAccount: '¿Ya tienes una cuenta?', signIn: 'Iniciar sesión',
  },
  cart: {
    title: 'Carrito', empty: 'Tu carrito está vacío',
    emptyDesc: 'Agrega algunos productos para empezar',
    continueShopping: 'Seguir comprando', clearCart: 'Vaciar carrito',
    subtotal: 'Subtotal', shippingNote: 'El envío y los impuestos se calculan en el pago.',
    checkout: 'Pagar',
  },
};

const hi: Translation = {
  nav: {
    categories: 'श्रेणियां', products: 'उत्पाद', about: 'हमारे बारे में',
    signIn: 'साइन इन', signOut: 'साइन आउट', getStarted: 'शुरू करें', greeting: 'नमस्ते, {{name}}',
  },
  hero: {
    badge: 'हर हफ्ते नए उत्पाद',
    headline: 'समझदारी से खरीदें।', headlineMuted: 'बेहतर जीएं।',
    sub: 'हर श्रेणी में हजारों उत्पाद — तेज़ डिलीवरी, सही कीमत और बिना झंझट रिटर्न पॉलिसी के साथ।',
    cta1: 'अभी खरीदें', cta2: 'श्रेणियां देखें',
    trust1: '$50 से ऊपर मुफ्त शिपिंग', trust2: '30 दिन का रिटर्न', trust3: 'सुरक्षित चेकआउट',
  },
  values: {
    shipping: { title: 'मुफ्त शिपिंग',    desc: '$50 से ऊपर के ऑर्डर पर। तेज़ डिलीवरी।' },
    secure:   { title: 'सुरक्षित भुगतान', desc: 'आपकी भुगतान जानकारी हमेशा सुरक्षित है।' },
    returns:  { title: '30 दिन का रिटर्न', desc: 'मन बदल गया? कोई बात नहीं।' },
    support:  { title: '24/7 सहायता',      desc: 'हमारी टीम हमेशा आपकी मदद के लिए तैयार है।' },
  },
  categories: {
    eyebrow: 'ब्राउज़ करें', title: 'श्रेणी के अनुसार खरीदें', viewAll: 'सब देखें',
    electronics: 'इलेक्ट्रॉनिक्स', fashion: 'फैशन', home: 'घर और जीवन',
    sports: 'खेल', books: 'किताबें', beauty: 'सौंदर्य',
  },
  products: {
    eyebrow: 'ट्रेंडिंग', title: 'विशेष उत्पाद', viewAll: 'सब देखें',
    bestSeller: 'बेस्ट सेलर', new: 'नया', sale: 'सेल',
  },
  stats: { customers: 'खुश ग्राहक', products: 'उत्पाद', satisfaction: 'संतुष्टि दर', support: 'सहायता' },
  testimonials: { eyebrow: 'समीक्षाएं', title: 'ग्राहक क्या कहते हैं', role: 'सत्यापित खरीदार' },
  newsletter: {
    title: 'अपडेट में रहें',
    desc: 'नए उत्पादों, विशेष ऑफर और सदस्य-केवल ऑफर पर साप्ताहिक अपडेट पाएं।',
    placeholder: 'अपना ईमेल पता दर्ज करें', cta: 'सब्सक्राइब करें',
    disclaimer: 'कोई स्पैम नहीं। कभी भी अनसब्सक्राइब करें।',
  },
  footer: {
    tagline: 'बेहतरीन कीमतों पर गुणवत्तापूर्ण उत्पादों के लिए आपका एकमात्र गंतव्य।',
    shop: 'खरीदारी', company: 'कंपनी', support: 'सहायता', legal: 'कानूनी',
    newArrivals: 'नए उत्पाद', bestSellers: 'बेस्ट सेलर', sale: 'सेल', allProducts: 'सभी उत्पाद',
    about: 'हमारे बारे में', careers: 'करियर', blog: 'ब्लॉग', press: 'प्रेस',
    helpCenter: 'सहायता केंद्र', returns: 'रिटर्न', shipping: 'शिपिंग जानकारी', trackOrder: 'ऑर्डर ट्रैक करें',
    privacy: 'गोपनीयता नीति', terms: 'सेवा की शर्तें', cookies: 'कुकी नीति',
    copyright: '© {{year}} ShopCo. सर्वाधिकार सुरक्षित।',
    crafted: 'बेहतरीन खरीदारी अनुभव के लिए बनाया गया।',
  },
  login: {
    title: 'साइन इन करें', sub: 'जारी रखने के लिए अपनी जानकारी दर्ज करें',
    email: 'ईमेल', password: 'पासवर्ड',
    submit: 'साइन इन', loading: 'साइन इन हो रहा है…',
    noAccount: 'खाता नहीं है?', register: 'रजिस्टर करें',
  },
  register: {
    title: 'खाता बनाएं', sub: 'शुरू करने के लिए अपनी जानकारी भरें',
    firstName: 'पहला नाम', lastName: 'अंतिम नाम', email: 'ईमेल', password: 'पासवर्ड',
    submit: 'खाता बनाएं', loading: 'खाता बनाया जा रहा है…',
    hasAccount: 'पहले से खाता है?', signIn: 'साइन इन करें',
  },
  cart: {
    title: 'कार्ट', empty: 'आपकी कार्ट खाली है',
    emptyDesc: 'शुरू करने के लिए कुछ उत्पाद जोड़ें',
    continueShopping: 'खरीदारी जारी रखें', clearCart: 'कार्ट साफ़ करें',
    subtotal: 'उप-कुल', shippingNote: 'चेकआउट पर शिपिंग और कर की गणना की जाएगी।',
    checkout: 'चेकआउट',
  },
};

export const translations: Record<Locale, Translation> = { en, bn, es, hi };

export const localeLabels: Record<Locale, { label: string; code: string }> = {
  en: { label: 'English',  code: 'EN' },
  bn: { label: 'বাংলা',    code: 'BN' },
  es: { label: 'Español',  code: 'ES' },
  hi: { label: 'हिन्दी',   code: 'HI' },
};
