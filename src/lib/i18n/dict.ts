export const locales = ['en', 'de', 'es'] as const;
export type Locale = (typeof locales)[number];

const dict = {
	en: {
		nav: {
			home: 'Home',
			categories: 'Categories',
			products: 'Products',
			about: 'About',
			cart: 'Cart',
			profile: 'Profile'
		},
		home: {
			hero_title_1: 'Discover',
			hero_title_2: 'Native Craft',
			hero_subtitle: 'A curated collection of unique products, built with passion and precision.',
			browse: 'Browse Products',
			featured: 'Featured Products',
			view_all: 'View all'
		},
		product: {
			add_to_cart: 'Add',
			add_cart_full: 'Add to Cart',
			back: 'Back to Products',
			not_found: 'Product not found.',
			quantity: 'Quantity',
			load_more: 'Load More',
			loading: 'Loading...',
			no_products: 'No products found.',
			all_products: 'All Products',
			browse_collection: 'Browse our curated collection'
		},
		category: {
			all: 'All Categories',
			explore: 'Explore our curated collections',
			no_products: 'No products in this category yet.'
		},
		cart: {
			title: 'Shopping Cart',
			empty: 'Your cart is empty',
			empty_desc: 'Discover amazing products and add them to your cart.',
			summary: 'Order Summary',
			items: 'Items',
			shipping: 'Shipping',
			free: 'Free',
			total: 'Total',
			checkout: 'Checkout',
			clear: 'Clear Cart'
		},
		profile: {
			guest: 'Guest User',
			welcome: 'Welcome to obraNativa',
			cart_items: 'Cart Items',
			cart_total: 'Cart Total',
			orders: 'Orders',
			view_cart: 'View Cart',
			contact_us: 'Contact Us'
		},
		contact: {
			title: 'Contact Us',
			subtitle: "We'd love to hear from you",
			email: 'Email',
			live_chat: 'Live Chat',
			live_chat_desc: 'Use the chat widget in the bottom-right corner for instant support.',
			faq: 'FAQ',
			faq_desc: 'Check our FAQ page for common questions.',
			send_message: 'Send us a message',
			loading_form: 'Loading contact form...'
		},
		footer: {
			tagline: 'Curated products, native craft.',
			shop: 'Shop',
			all_products: 'All Products',
			company: 'Company',
			contact: 'Contact',
			impressum: 'Impressum',
			rights: 'All rights reserved.'
		},
		theme: {
			light: 'Switch to light mode',
			dark: 'Switch to dark mode'
		}
	},
	de: {
		nav: {
			home: 'Startseite',
			categories: 'Kategorien',
			products: 'Produkte',
			about: 'Über uns',
			cart: 'Warenkorb',
			profile: 'Profil'
		},
		home: {
			hero_title_1: 'Entdecke',
			hero_title_2: 'Native Handwerkskunst',
			hero_subtitle:
				'Eine kuratierte Sammlung einzigartiger Produkte, mit Leidenschaft und Präzision gefertigt.',
			browse: 'Produkte durchstöbern',
			featured: 'Ausgewählte Produkte',
			view_all: 'Alle ansehen'
		},
		product: {
			add_to_cart: 'Hinzufügen',
			add_cart_full: 'In den Warenkorb',
			back: 'Zurück zu Produkte',
			not_found: 'Produkt nicht gefunden.',
			quantity: 'Menge',
			load_more: 'Mehr laden',
			loading: 'Laden...',
			no_products: 'Keine Produkte gefunden.',
			all_products: 'Alle Produkte',
			browse_collection: 'Durchstöbere unsere kuratierte Sammlung'
		},
		category: {
			all: 'Alle Kategorien',
			explore: 'Entdecke unsere kuratierten Sammlungen',
			no_products: 'Noch keine Produkte in dieser Kategorie.'
		},
		cart: {
			title: 'Warenkorb',
			empty: 'Dein Warenkorb ist leer',
			empty_desc: 'Entdecke tolle Produkte und füge sie hinzu.',
			summary: 'Bestellübersicht',
			items: 'Artikel',
			shipping: 'Versand',
			free: 'Kostenlos',
			total: 'Gesamt',
			checkout: 'Zur Kasse',
			clear: 'Warenkorb leeren'
		},
		profile: {
			guest: 'Gastbenutzer',
			welcome: 'Willkommen bei obraNativa',
			cart_items: 'Warenkorb',
			cart_total: 'Gesamtsumme',
			orders: 'Bestellungen',
			view_cart: 'Warenkorb ansehen',
			contact_us: 'Kontakt'
		},
		contact: {
			title: 'Kontakt',
			subtitle: 'Wir freuen uns auf Ihre Nachricht',
			email: 'E-Mail',
			live_chat: 'Live-Chat',
			live_chat_desc: 'Nutzen Sie das Chat-Widget unten rechts für sofortige Hilfe.',
			faq: 'FAQ',
			faq_desc: 'Besuchen Sie unsere FAQ-Seite für häufige Fragen.',
			send_message: 'Schreiben Sie uns',
			loading_form: 'Kontaktformular wird geladen...'
		},
		footer: {
			tagline: 'Kuratierte Produkte, native Handwerkskunst.',
			shop: 'Shop',
			all_products: 'Alle Produkte',
			company: 'Unternehmen',
			contact: 'Kontakt',
			impressum: 'Impressum',
			rights: 'Alle Rechte vorbehalten.'
		},
		theme: {
			light: 'Zum hellen Modus wechseln',
			dark: 'Zum dunklen Modus wechseln'
		}
	},
	es: {
		nav: {
			home: 'Inicio',
			categories: 'Categorías',
			products: 'Productos',
			about: 'Acerca de',
			cart: 'Carrito',
			profile: 'Perfil'
		},
		home: {
			hero_title_1: 'Descubre',
			hero_title_2: 'Arte Nativo',
			hero_subtitle:
				'Una colección curada de productos únicos, construidos con pasión y precisión.',
			browse: 'Ver Productos',
			featured: 'Productos Destacados',
			view_all: 'Ver todos'
		},
		product: {
			add_to_cart: 'Agregar',
			add_cart_full: 'Agregar al carrito',
			back: 'Volver a Productos',
			not_found: 'Producto no encontrado.',
			quantity: 'Cantidad',
			load_more: 'Cargar más',
			loading: 'Cargando...',
			no_products: 'No se encontraron productos.',
			all_products: 'Todos los Productos',
			browse_collection: 'Explora nuestra colección curada'
		},
		category: {
			all: 'Todas las Categorías',
			explore: 'Explora nuestras colecciones curadas',
			no_products: 'Aún no hay productos en esta categoría.'
		},
		cart: {
			title: 'Carrito de Compras',
			empty: 'Tu carrito está vacío',
			empty_desc: 'Descubre productos increíbles y agrégalos a tu carrito.',
			summary: 'Resumen del Pedido',
			items: 'Artículos',
			shipping: 'Envío',
			free: 'Gratis',
			total: 'Total',
			checkout: 'Pagar',
			clear: 'Vaciar Carrito'
		},
		profile: {
			guest: 'Usuario Invitado',
			welcome: 'Bienvenido a obraNativa',
			cart_items: 'En el Carrito',
			cart_total: 'Total del Carrito',
			orders: 'Pedidos',
			view_cart: 'Ver Carrito',
			contact_us: 'Contáctanos'
		},
		contact: {
			title: 'Contáctanos',
			subtitle: 'Nos encantaría saber de ti',
			email: 'Correo',
			live_chat: 'Chat en Vivo',
			live_chat_desc: 'Usa el widget de chat en la esquina inferior derecha.',
			faq: 'FAQ',
			faq_desc: 'Consulta nuestra página de preguntas frecuentes.',
			send_message: 'Envíanos un mensaje',
			loading_form: 'Cargando formulario...'
		},
		footer: {
			tagline: 'Productos curados, arte nativo.',
			shop: 'Tienda',
			all_products: 'Todos los Productos',
			company: 'Empresa',
			contact: 'Contacto',
			impressum: 'Aviso Legal',
			rights: 'Todos los derechos reservados.'
		},
		theme: {
			light: 'Cambiar a modo claro',
			dark: 'Cambiar a modo oscuro'
		}
	}
} as const;

export type Dict = (typeof dict)['en'];
export default dict;
