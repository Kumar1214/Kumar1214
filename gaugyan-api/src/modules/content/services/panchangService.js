/**
 * Service to fetch daily Panchang data.
 * Initially mocks the data using basic astronomical calculations or static fallback.
 * Future: Integrate with Prokerala or other Vedic API.
 */

const getDailyPanchang = async (date, latitude, longitude) => {
    // TODO: Integrate real API
    // For Phase 1, return calculated/mock data based on date

    const day = new Date(date).getDay();
    const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'];
    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];

    // Pseudo-random but deterministic for the same date
    const dayIndex = new Date(date).getDate();

    return {
        date: date,
        location: { latitude, longitude },
        tithi: {
            name: tithis[dayIndex % 15],
            endTime: '20:45'
        },
        nakshatra: {
            name: nakshatras[dayIndex % 27],
            endTime: '14:20'
        },
        yoga: {
            name: 'Siddha',
            endTime: '11:10'
        },
        karana: {
            name: 'Bava',
            endTime: '09:30'
        },
        sunrise: '06:15 AM',
        sunset: '06:45 PM',
        auspicious: {
            abhijitMuhuarta: '11:45 AM - 12:30 PM'
        },
        inauspicious: {
            rahuKalam: '09:00 AM - 10:30 AM',
            yamaganda: '01:30 PM - 03:00 PM'
        }
    };
};

module.exports = {
    getDailyPanchang
};
