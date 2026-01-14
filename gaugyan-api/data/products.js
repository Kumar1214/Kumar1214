const products = [
    {
        name: 'Organic Turmeric Powder',
        description: 'Pure organic turmeric powder from certified farms',
        category: 'Ayurvedic Products',
        price: 299,
        originalPrice: 399,
        discount: 25,
        images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5'],
        vendorName: 'Organic Farms India',
        stock: 150,
        sku: 'TUR-ORG-500',
        weight: '500g',
        rating: 4.7,
        soldCount: 320,
        status: 'active',
        tags: ['organic', 'ayurveda', 'spices']
    },
    {
        name: 'Cow Ghee - Pure A2',
        description: 'Traditional bilona method cow ghee from desi cows',
        category: 'Cow Products',
        price: 899,
        originalPrice: 1099,
        discount: 18,
        images: ['https://images.unsplash.com/photo-1628088062854-d1870b4553da'],
        vendorName: 'Organic Farms India',
        stock: 80,
        sku: 'GHEE-A2-500',
        weight: '500ml',
        rating: 4.9,
        soldCount: 450,
        featured: true,
        status: 'active',
        tags: ['ghee', 'cow products', 'organic']
    },
    {
        name: 'Yoga Mat - Eco Friendly',
        description: 'Natural rubber yoga mat for perfect grip',
        category: 'Other', // Mapping to 'Other' as 'Yoga Equipment' is not in enum, or need to update enum. Enum: ['Puja Items', 'Books', 'Ayurvedic Products', 'Organic Food', 'Clothing', 'Handicrafts', 'Cow Products', 'Other']
        price: 1299,
        originalPrice: 1599,
        discount: 18,
        images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f'],
        vendorName: 'Yoga Essentials',
        stock: 50,
        sku: 'YOGA-MAT-001',
        weight: '2kg',
        rating: 4.6,
        soldCount: 120,
        status: 'active',
        tags: ['yoga', 'fitness', 'eco-friendly']
    }
];

// Generate more products to reach 50+
const categories = ['Puja Items', 'Books', 'Ayurvedic Products', 'Organic Food', 'Clothing', 'Handicrafts', 'Cow Products', 'Other'];
const vendors = ['Organic Farms India', 'Yoga Essentials', 'Vedic Books Store', 'Temple Crafts'];

for (let i = 4; i <= 55; i++) {
    products.push({
        name: `Product ${i} - Premium Quality`,
        description: 'High quality product sourced from the best artisans and farmers.',
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.floor(Math.random() * 2000) + 100,
        originalPrice: Math.floor(Math.random() * 2500) + 200,
        discount: Math.floor(Math.random() * 30),
        images: [`https://images.unsplash.com/photo-${1500000000000 + i}`],
        vendorName: vendors[Math.floor(Math.random() * vendors.length)],
        stock: Math.floor(Math.random() * 100),
        sku: `SKU-${i}-${Math.floor(Math.random() * 1000)}`,
        weight: `${Math.floor(Math.random() * 1000)}g`,
        rating: (Math.random() * 2 + 3).toFixed(1),
        soldCount: Math.floor(Math.random() * 500),
        status: Math.random() > 0.1 ? 'active' : 'pending_approval',
        tags: ['quality', 'premium', 'best-seller']
    });
}

module.exports = products;
