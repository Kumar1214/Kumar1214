const { connectDB } = require('./src/shared/config/database');
const Cow = require('./src/modules/marketplace/Cow');
const VendorProfile = require('./src/modules/marketplace/VendorProfile');
const ContactMessage = require('./src/modules/marketplace/ContactMessage'); // Just to check if it loads

const verifyData = async () => {
    try {
        await connectDB();
        const cowCount = await Cow.count();
        const vendorCount = await VendorProfile.count();
        console.log(`Cows: ${cowCount}`);
        console.log(`Vendors: ${vendorCount}`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifyData();
