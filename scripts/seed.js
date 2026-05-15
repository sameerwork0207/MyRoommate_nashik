import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const listingSchema = new mongoose.Schema({}, { strict: false });
const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const sampleListings = [
        {
            title: "Comfort Boys PG - Gangapur Road",
            type: "pg",
            rent: 6500,
            location: "Gangapur Road",
            city: "Nashik",
            description: "A comfortable, fully furnished boys PG with meals included. 5 minutes from major colleges. Zero brokerage, highly secure environment with CCTV coverage.",
            amenities: ["High-Speed WiFi", "3 Meals Included", "Daily Housekeeping", "24/7 Security", "Power Backup"],
            audienceTags: ["Boys Only"],
            furnished: "Fully Furnished",
            isPremium: false,
            status: "approved",
            images: ["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80"],
            nearbyPlaces: [
                { name: "KK Wagh Engineering College", distance: "0.8 km", time: "7 mins" },
                { name: "KTHM College", distance: "2.5 km", time: "15 mins" }
            ],
            rules: [
                { title: "Gate Timings", description: "Entry restricted after 10:30 PM." },
                { title: "No Smoking/Drinking", description: "Strictly prohibited inside premises." }
            ],
            managerInfo: { name: "Rahul Desai", phone: "9876543210" }
        },
        {
            title: "SafeHaven Girls Hostel - College Road",
            type: "hostel",
            rent: 7000,
            location: "College Road",
            city: "Nashik",
            description: "Premium girls hostel with highest security standards. Female staff on duty 24/7. Homely environment with nutritious food.",
            amenities: ["24/7 Security", "AC Rooms", "CCTV", "WiFi", "Meals Included"],
            audienceTags: ["Girls Only"],
            furnished: "Fully Furnished",
            isPremium: false,
            status: "approved",
            images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80"],
            nearbyPlaces: [
                { name: "Sandip University", distance: "1.2 km", time: "10 mins" },
                { name: "Pune-Nashik Highway", distance: "0.5 km", time: "5 mins" }
            ],
            rules: [
                { title: "Gate Timings", description: "Entry restricted after 9:00 PM." },
                { title: "Visitor Policy", description: "No male visitors allowed inside." }
            ],
            managerInfo: { name: "Priya Sharma", phone: "9765432100" }
        },
        {
            title: "Modern 1BHK Bachelor Flat - Indira Nagar",
            type: "flat",
            rent: 11000,
            location: "Indira Nagar",
            city: "Nashik",
            description: "Fully furnished 1BHK ideal for working professionals and final year students. Private kitchen, attached bathroom. No broker, direct from owner.",
            amenities: ["Private Kitchen", "Attached Bathroom", "WiFi", "2-Wheeler Parking", "Power Backup"],
            audienceTags: ["Boys Only", "Co-Living"],
            furnished: "Fully Furnished",
            isPremium: false,
            status: "approved",
            images: ["https://images.unsplash.com/photo-1502672260266-1c1de2d96674?w=800&q=80"],
            nearbyPlaces: [
                { name: "KK Wagh Engineering College", distance: "3.0 km", time: "20 mins" }
            ],
            rules: [
                { title: "Lock-in Period", description: "Minimum 6 months stay required." },
                { title: "No Parties", description: "Please maintain decorum and respect neighbors." }
            ],
            managerInfo: { name: "Amit Joshi", phone: "9898989898" }
        },
        {
            title: "The Apex Co-Living & Boys PG",
            type: "pg",
            rent: 8500,
            location: "College Road",
            city: "Nashik",
            description: "Exclusive premium co-living PG for students. Spacious AC rooms with dedicated study tables, high-speed Wi-Fi, and premium mattresses. All-inclusive rent.",
            amenities: ["High-Speed WiFi (100Mbps)", "3 Meals Included", "24/7 CCTV Security", "AC Rooms", "Study Table & Chair", "Daily Housekeeping", "Laundry Service"],
            audienceTags: ["Boys Only"],
            furnished: "Fully Furnished",
            isPremium: true,
            status: "approved",
            images: [
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1de2d96674?w=800&q=80",
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80"
            ],
            nearbyPlaces: [
                { name: "Sandip University", distance: "1.2 km", time: "10 mins" },
                { name: "KTHM College", distance: "2.5 km", time: "15 mins" },
                { name: "KK Wagh Engineering", distance: "4.0 km", time: "20 mins" }
            ],
            rules: [
                { title: "Gate Timings", description: "Entry restricted after 10:30 PM. Keys not provided for main gate." },
                { title: "No Smoking/Drinking", description: "Strictly prohibited inside the premises to maintain student decorum." },
                { title: "Visitor Policy", description: "Outside visitors not allowed in rooms. Lobby access till 8:00 PM only." },
                { title: "Lock-in Period", description: "Minimum 6 months stay required. 1-month notice period before vacating." }
            ],
            managerInfo: { name: "Rahul Desai", phone: "9876543210" }
        },
        {
            title: "Elite Studios AC - Premium Stay",
            type: "hostel",
            rent: 15000,
            location: "Gangapur Road",
            city: "Nashik",
            description: "Luxurious studio stays for discerning students. Private AC studio with attached bathroom, smart TV, dedicated high-speed internet, and premium meals.",
            amenities: ["AC Studio", "Attached Bathroom", "Smart TV", "Dedicated 50Mbps WiFi", "Premium Meals", "Weekly Housekeeping", "Gym Access"],
            audienceTags: ["Boys Only", "Girls Only"],
            furnished: "Fully Furnished",
            isPremium: true,
            status: "approved",
            images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"],
            nearbyPlaces: [
                { name: "Sandip University", distance: "2.0 km", time: "15 mins" }
            ],
            rules: [
                { title: "Gate Timings", description: "24/7 access with biometric card." },
                { title: "No Smoking", description: "Strictly smoke-free property." }
            ],
            managerInfo: { name: "Vikram Patil", phone: "9011223344" }
        }
    ];

    await Listing.deleteMany({});
    const result = await Listing.insertMany(sampleListings);
    console.log(`✅ Seeded ${result.length} listings successfully!`);
    result.forEach(l => console.log(`  - [${l.type}] ${l.title} | ₹${l.rent} | premium: ${l.isPremium}`));

    await mongoose.disconnect();
    console.log("Done.");
}

seed().catch(err => {
    console.error("Seed failed:", err.message);
    process.exit(1);
});
