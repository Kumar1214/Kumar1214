const gaushala = [
    {
        name: 'Kamdhenu',
        breed: 'Gir',
        age: 5,
        gender: 'Female',
        color: 'White with brown patches',
        image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a',
        description: 'Gentle and calm cow, excellent milk producer',
        healthStatus: 'Excellent',
        currentLocation: 'Gaugyan Gaushala, Vrindavan',
        adoptionStatus: 'available',
        monthlyCost: 3000,
        gaushalaName: 'Gaugyan Gaushala',
        gaushalaLocation: 'Vrindavan, UP',
        milkProduction: '12 liters/day',
        temperament: 'Calm',
        vaccinated: true,
        featured: true
    },
    {
        name: 'Nandi',
        breed: 'Sahiwal',
        age: 3,
        gender: 'Male',
        color: 'Brown',
        image: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0',
        description: 'Strong and healthy bull',
        healthStatus: 'Good',
        currentLocation: 'Gaugyan Gaushala, Vrindavan',
        adoptionStatus: 'available',
        monthlyCost: 2500,
        gaushalaName: 'Gaugyan Gaushala',
        gaushalaLocation: 'Vrindavan, UP',
        temperament: 'Active',
        vaccinated: true
    },
    {
        name: 'Gauri',
        breed: 'Tharparkar',
        age: 4,
        gender: 'Female',
        color: 'White',
        image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53',
        description: 'Beautiful white cow, very friendly',
        healthStatus: 'Good',
        currentLocation: 'Gaugyan Gaushala, Vrindavan',
        adoptionStatus: 'adopted',
        monthlyCost: 2800,
        gaushalaName: 'Gaugyan Gaushala',
        gaushalaLocation: 'Vrindavan, UP',
        milkProduction: '10 liters/day',
        temperament: 'Friendly',
        vaccinated: true
    }
];

// Generate more cows to reach 10+
const breeds = ['Gir', 'Sahiwal', 'Red Sindhi', 'Tharparkar', 'Rathi', 'Hariana', 'Ongole', 'Kankrej'];
const temperaments = ['Calm', 'Active', 'Friendly', 'Shy'];

for (let i = 4; i <= 15; i++) {
    gaushala.push({
        name: `Cow ${i}`,
        breed: breeds[Math.floor(Math.random() * breeds.length)],
        age: Math.floor(Math.random() * 10) + 1,
        gender: Math.random() > 0.3 ? 'Female' : 'Male',
        color: 'Mixed',
        image: `https://images.unsplash.com/photo-${1500000000000 + i}`,
        description: 'A lovely cow needing care and support.',
        healthStatus: 'Good',
        currentLocation: 'Gaugyan Gaushala, Vrindavan',
        adoptionStatus: Math.random() > 0.5 ? 'available' : 'sponsored',
        monthlyCost: Math.floor(Math.random() * 2000) + 1500,
        gaushalaName: 'Gaugyan Gaushala',
        gaushalaLocation: 'Vrindavan, UP',
        temperament: temperaments[Math.floor(Math.random() * temperaments.length)],
        vaccinated: true
    });
}

module.exports = gaushala;
