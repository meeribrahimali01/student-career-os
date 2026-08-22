/**
 * VIT Chennai Campus Location Dataset
 *
 * Source of truth: Official VIT Chennai Campus Layout & WayFinder (http://chennaiwayfinder.vit.ac.in/)
 * Location: Vandalur - Kelambakkam Road, Chennai, Tamil Nadu 600127
 */

export interface CampusLocation {
  id: string;
  name: string;
  shortName: string;
  category:
    | "Academic"
    | "Administration"
    | "Library"
    | "Hostels"
    | "Dining"
    | "Healthcare"
    | "Sports"
    | "Services"
    | "Entrance"
    | "Auditorium";
  description: string;
  position: { x: number; y: number }; // SVG Map Coordinates (0-1000 range)
  floors?: string[];
  facilities: string[];
  timings?: string;
  contact?: string;
  keywords: string[];
  aliases: string[];
  zone: "North Quad" | "Central Academic" | "South Entrance" | "East Hostels" | "West Sports" | "Residential";
  color: string;
}

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  // ─── ACADEMIC & LIBRARY ──────────────────────────────────────────
  {
    id: "ab1",
    name: "Academic Block 1 (AB-1)",
    shortName: "AB-1",
    category: "Academic",
    description:
      "Core academic complex housing Computing & Engineering classrooms, School of Computer Science & Engineering (SCOPE) faculty chambers, fundamental sciences laboratories, and Netaji Auditorium.",
    position: { x: 380, y: 380 },
    floors: [
      "Ground Floor: Dean SCOPE Office, Netaji Auditorium, Physics & Chemistry Labs",
      "1st Floor: Computing Laboratories (CL-01 to CL-06), SCOPE Faculty Cabins",
      "2nd Floor: Smart Classrooms (101-125), Seminar Halls, Student Discussion Pods",
      "3rd Floor: Advanced AI/ML & Cyber Security Labs, Research Scholar Cabins",
      "4th Floor: Postgraduate Computing Labs, Cloud Computing Testbed",
    ],
    facilities: ["High-speed Wi-Fi", "Elevators", "Wheelchair Accessible", "Restrooms", "RO Drinking Water", "Netaji Auditorium", "Smart Boards"],
    timings: "8:00 AM - 7:30 PM (Mon-Sat)",
    keywords: ["ab1", "ab-1", "academic block 1", "scope", "cse", "computer science", "classrooms", "netaji", "labs"],
    aliases: ["AB1", "AB-1", "Block 1", "Academic 1", "Old Academic Block"],
    zone: "Central Academic",
    color: "#4F46E5",
  },
  {
    id: "ab2",
    name: "Academic Block 2 (AB-2)",
    shortName: "AB-2",
    category: "Academic",
    description:
      "Engineering technology hub hosting School of Electronics Engineering (SENSE), School of Mechanical Engineering (SMEC), Civil Engineering labs, Robotics workshop, and CAD/CAM facilities.",
    position: { x: 550, y: 360 },
    floors: [
      "Ground Floor: Heavy Machines Lab, Civil Surveying Lab, Mechanical Fabrication Workshop",
      "1st Floor: Dean SENSE & SMEC Offices, Electronics & VLSI Testing Labs",
      "2nd Floor: Robotics & Automation Lab, IoT Development Lab, Embedded Systems Lab",
      "3rd Floor: Classrooms (201-225), Departmental Seminar Hall",
      "4th Floor: CAD/CAM Computing Suites, Aerospace & Simulation Labs",
    ],
    facilities: ["Wi-Fi", "Elevators", "Heavy Lab Access", "Restrooms", "RO Water", "Research Labs"],
    timings: "8:00 AM - 7:30 PM (Mon-Sat)",
    keywords: ["ab2", "ab-2", "academic block 2", "sense", "smec", "ece", "mechanical", "robotics", "civil", "vlsi"],
    aliases: ["AB2", "AB-2", "Block 2", "Academic 2"],
    zone: "Central Academic",
    color: "#4F46E5",
  },
  {
    id: "ab3",
    name: "Academic Block 3 (AB-3)",
    shortName: "AB-3",
    category: "Academic",
    description:
      "The state-of-the-art mega academic complex featuring tiered smart amphitheatre classrooms, School of Advanced Sciences (SAS), School of Social Sciences & Languages (SSL), Innovation & Incubation Centre, and cutting-edge data science labs.",
    position: { x: 460, y: 250 },
    floors: [
      "Ground Floor: Student Central Lounge, Dean SAS/SSL Offices, Innovation Hub, ATM",
      "1st Floor: Tiered Lecture Halls (301-315), International Relations Office",
      "2nd Floor: Data Science & AI Research Center, Multidisciplinary Computing Labs",
      "3rd Floor: Smart Multimedia Classrooms (316-335), Language Laboratories",
      "4th Floor: Start-up Incubation Studios, Executive Conference Suites",
    ],
    facilities: ["High-speed Wi-Fi", "Dual Elevators", "Central AC", "Wheelchair Ramps", "Cafeteria Kiosk", "RO Water"],
    timings: "8:00 AM - 8:30 PM (Mon-Sat)",
    keywords: ["ab3", "ab-3", "academic block 3", "mega block", "innovation", "sas", "ssl", "data science", "smart classroom"],
    aliases: ["AB3", "AB-3", "Block 3", "Academic 3", "New Academic Block"],
    zone: "Central Academic",
    color: "#4F46E5",
  },
  {
    id: "library",
    name: "Central Library",
    shortName: "Library",
    category: "Library",
    description:
      "World-class, automated 4-storey knowledge repository housing over 100,000 volumes, IEEE/ACM digital research portals, silent reading wings, discussion pods, and reprography services.",
    position: { x: 300, y: 350 },
    floors: [
      "Ground Floor: Circulation Desk, New Arrivals, OPAC Search Terminals, Newspaper Reading Lounge",
      "1st Floor: Core Engineering & Computer Science Reference Section, Bound Journals",
      "2nd Floor: Digital Library (120+ High-speed Terminals), IEEE/ScienceDirect Hub, Audio-Visual Room",
      "3rd Floor: Higher Studies (GRE/GATE/CAT) Section, Quiet Study Cubicles, Research Carrels",
    ],
    facilities: ["Digital OPAC Terminals", "RFID Book Drop", "High-speed Wi-Fi", "Central AC", "Discussion Rooms", "Reprography"],
    timings: "8:00 AM - 10:00 PM (All Days, Extended during Exam Weeks)",
    contact: "library.chennai@vit.ac.in",
    keywords: ["library", "central library", "books", "study", "digital library", "ieee", "gate", "reading room", "opac", "journals"],
    aliases: ["Library", "Central Library", "CL", "Book Bank"],
    zone: "Central Academic",
    color: "#059669",
  },

  // ─── ADMINISTRATION & AUDITORIUMS ────────────────────────────────
  {
    id: "admin",
    name: "Administrative Block",
    shortName: "Admin Block",
    category: "Administration",
    description:
      "Administrative headquarters of VIT Chennai housing the Pro-Vice Chancellor's Office, Registrar, Director of Student Welfare (DSW), Admissions, Finance & Accounts, and Examination Cell.",
    position: { x: 260, y: 460 },
    floors: [
      "Ground Floor: Admissions Office, Visitor Reception, Student Helpdesk, Cash Counter",
      "1st Floor: Office of Student Welfare (DSW), Scholarship & Financial Aid Desk",
      "2nd Floor: Office of the Pro-Vice Chancellor, Registrar Secretariat",
      "3rd Floor: Controller of Examinations (COE), Academic Affairs Cell",
    ],
    facilities: ["Visitor Lounge", "Token System", "Wheelchair Accessible", "Elevator", "Restrooms", "RO Water"],
    timings: "9:00 AM - 5:30 PM (Mon-Fri)",
    contact: "+91-44-3993 1555",
    keywords: ["admin", "admin block", "administration", "pvc", "dsw", "admissions", "fees", "registrar", "controller of examinations", "coe"],
    aliases: ["Admin", "Admin Block", "Administrative Building", "Main Office"],
    zone: "South Entrance",
    color: "#D97706",
  },
  {
    id: "mga",
    name: "Mahatma Gandhi Auditorium (MGA)",
    shortName: "MG Auditorium",
    category: "Auditorium",
    description:
      "Grand 2,000-seater air-conditioned acoustic auditorium host to University Convocations, TechnoVIT, Vibrance cultural festival, international symposiums, and celebrity keynote addresses.",
    position: { x: 340, y: 480 },
    floors: [
      "Ground Level: Main Auditorium Floor, Green Rooms, Sound Engineering Booth",
      "Balcony Level: Tiered Upper Seating, VIP Viewing Gallery",
    ],
    facilities: ["Central AC", "Professional Line Array Audio", "4K Projection Screen", "VIP Green Rooms", "Disability Seating"],
    timings: "Open during scheduled university events",
    keywords: ["mga", "auditorium", "mahatma gandhi", "events", "technovit", "vibrance", "convocation", "cultural", "seminar"],
    aliases: ["MGA", "Auditorium", "MG Auditorium", "Main Auditorium"],
    zone: "South Entrance",
    color: "#7C3AED",
  },

  // ─── HEALTHCARE & STUDENT SERVICES ──────────────────────────────
  {
    id: "health",
    name: "Health Centre & Medical Clinic",
    shortName: "Health Centre",
    category: "Healthcare",
    description:
      "24/7 round-the-clock emergency medical facility with resident doctors, nursing staff, observation beds, in-house pharmacy, and dedicated emergency ambulance stationed for hospital transfers.",
    position: { x: 670, y: 440 },
    floors: [
      "Ground Level: Doctor Consultation Chambers, Emergency Triage, 8-Bed Inpatient Ward, 24/7 Pharmacy, Nursing Station",
    ],
    facilities: ["24x7 Doctor On-duty", "Emergency Ambulance", "In-house Pharmacy", "Oxygen Supply", "ECG & Vital Monitoring"],
    timings: "24 Hours / 7 Days (Emergency Support)",
    contact: "Emergency: Extn 108 / +91-44-3993 1108",
    keywords: ["health", "hospital", "clinic", "health centre", "doctor", "medicine", "emergency", "ambulance", "pharmacy", "medical"],
    aliases: ["Health Centre", "Clinic", "Hospital", "Dispensary", "Medical Room"],
    zone: "Residential",
    color: "#DC2626",
  },
  {
    id: "vmart",
    name: "V-Mart & Shopping Complex",
    shortName: "V-Mart",
    category: "Services",
    description:
      "Convenient campus departmental store providing fresh groceries, personal toiletries, academic stationery, packaged snacks, electronics accessories, and print/binding services.",
    position: { x: 650, y: 520 },
    facilities: ["Supermarket", "Stationery Desk", "Xerox & Binding", "UPI / Card Accepted", "Packaged Snacks"],
    timings: "8:30 AM - 9:30 PM (Daily)",
    keywords: ["vmart", "v-mart", "store", "supermarket", "stationery", "print", "xerox", "groceries", "snacks", "shopping"],
    aliases: ["VMart", "V-Mart", "Supermarket", "Campus Store"],
    zone: "Residential",
    color: "#0284C7",
  },
  {
    id: "bank",
    name: "Indian Bank & 24/7 ATMs",
    shortName: "Bank & ATM",
    category: "Services",
    description:
      "Full-service on-campus Indian Bank branch for student account operations, DD issuances, and educational loan processing, complemented by 24/7 multi-bank ATMs.",
    position: { x: 230, y: 520 },
    facilities: ["Branch Banking Counter", "24/7 Cash Deposit & Withdrawal ATMs", "Passbook Kiosk"],
    timings: "Bank: 10:00 AM - 4:00 PM (Mon-Sat, 2nd & 4th Sat holiday) | ATMs: 24/7",
    keywords: ["bank", "indian bank", "atm", "cash", "money", "fee payment", "deposit", "finance"],
    aliases: ["Bank", "Indian Bank", "ATM", "Bank Counter"],
    zone: "South Entrance",
    color: "#0284C7",
  },

  // ─── FOOD & DINING ───────────────────────────────────────────────
  {
    id: "northsquare",
    name: "North Square Food Court",
    shortName: "North Square",
    category: "Dining",
    description:
      "Vibrant multi-cuisine campus dining hub featuring authentic South & North Indian meals, Chinese wok stations, Continental delis, fresh juice bars, and renowned franchise kiosks.",
    position: { x: 490, y: 460 },
    floors: [
      "Ground Level: Fast Food Kiosks, Fruit Juice & Shake Bar, Nescafe Corner, Ice Cream Parlour",
      "1st Floor: Multi-Cuisine Food Court Dining Hall, Special Thali Counters",
    ],
    facilities: ["Multi-Cuisine Stalls", "Outdoor Seating", "UPI Accepted", "RO Drinking Water", "Handwash Station"],
    timings: "8:00 AM - 10:30 PM (Daily)",
    keywords: ["food", "food court", "north square", "canteen", "lunch", "dinner", "juice", "nescafe", "coffee", "snacks", "dining"],
    aliases: ["North Square", "NS", "Food Court", "Central Canteen"],
    zone: "Central Academic",
    color: "#EA580C",
  },
  {
    id: "gazebo",
    name: "Gazebo & Discussion Pods",
    shortName: "Gazebo",
    category: "Dining",
    description:
      "Open-air shaded octagonal pavilions surrounded by lush greenery, perfect for informal group studies, hackathon team syncs, and evening snacks from adjoining kiosks.",
    position: { x: 420, y: 450 },
    facilities: ["Shaded Seating", "Ambient Lighting", "Adjoining Snack Kiosks", "Trash Receptacles"],
    timings: "6:00 AM - 10:00 PM (Daily)",
    keywords: ["gazebo", "discussion", "pod", "open air", "study area", "garden", "hangout"],
    aliases: ["Gazebo", "Discussion Area", "Open Pods"],
    zone: "Central Academic",
    color: "#EA580C",
  },

  // ─── HOSTELS & RESIDENCES ────────────────────────────────────────
  {
    id: "alpha_hostel",
    name: "Alpha Block (Men's Hostel)",
    shortName: "Alpha Hostel",
    category: "Hostels",
    description:
      "Multi-storey men's residential block featuring AC and Non-AC 2/3/4/6 bed accommodations, Wi-Fi connectivity, indoor recreation lounge, and dedicated mess halls.",
    position: { x: 730, y: 320 },
    facilities: ["High-speed Wi-Fi", "Elevators", "Mess Dining Hall", "Gym Room", "Table Tennis", "Laundry Services", "RO Water"],
    timings: "Hostel In-time: 9:00 PM (Standard University Regulations)",
    contact: "Warden Office: Extn 201",
    keywords: ["alpha", "alpha block", "mens hostel", "boys hostel", "hostel", "rooms", "residence"],
    aliases: ["Alpha", "Alpha Block", "MH Alpha", "Boys Hostel Alpha"],
    zone: "East Hostels",
    color: "#8B5CF6",
  },
  {
    id: "beta_hostel",
    name: "Beta Block (Men's Hostel)",
    shortName: "Beta Hostel",
    category: "Hostels",
    description:
      "Modern men's residential quarters equipped with furnished study rooms, biometric attendance turnstiles, high-speed fiber internet, and specialized mess facilities.",
    position: { x: 790, y: 390 },
    facilities: ["Biometric Access", "High-speed Wi-Fi", "Mess Dining", "Common TV Room", "Solar Water Heaters", "Night Canteen"],
    timings: "Hostel In-time: 9:00 PM",
    keywords: ["beta", "beta block", "mens hostel", "boys hostel", "hostel", "mh beta"],
    aliases: ["Beta", "Beta Block", "MH Beta"],
    zone: "East Hostels",
    color: "#8B5CF6",
  },
  {
    id: "delta_hostel",
    name: "Delta Block (D1 & D2 Hostels)",
    shortName: "Delta Hostel",
    category: "Hostels",
    description:
      "Expansive contemporary residential towers (D1 & D2) accommodating undergraduate and international scholars with attached bath options, study lounges, and modern dining halls.",
    position: { x: 770, y: 480 },
    facilities: ["High-speed Wi-Fi", "Elevators", "Attached Bath Rooms", "International Mess", "Study Lounges", "Security 24/7"],
    timings: "Hostel In-time: 9:00 PM",
    keywords: ["delta", "delta block", "d1", "d2", "hostel", "mens hostel", "international hostel"],
    aliases: ["Delta", "Delta Block", "D1", "D2", "Delta 1", "Delta 2"],
    zone: "East Hostels",
    color: "#8B5CF6",
  },
  {
    id: "jasmine_hostel",
    name: "Jasmine & Sarojini (Women's Hostels)",
    shortName: "Women's Hostels",
    category: "Hostels",
    description:
      "Dedicated, highly secure women's hostel enclave featuring landscaped inner courtyards, air-conditioned study halls, modern mess facilities, and on-premises fitness center.",
    position: { x: 700, y: 220 },
    facilities: ["24/7 Security & Wardens", "Wi-Fi", "Elevators", "Exclusive Gym", "Indoor Games", "Beauty Salon", "Dining Hall"],
    timings: "Hostel In-time: 8:30 PM",
    contact: "Ladies Hostel Warden Office: Extn 301",
    keywords: ["jasmine", "sarojini", "ladies hostel", "girls hostel", "womens hostel", "hostel", "lh"],
    aliases: ["Ladies Hostel", "Jasmine", "Sarojini", "LH", "Girls Hostel"],
    zone: "East Hostels",
    color: "#8B5CF6",
  },
  {
    id: "guesthouse",
    name: "University Guest House",
    shortName: "Guest House",
    category: "Services",
    description:
      "Executive hospitality residence offering comfortable suite accommodations for visiting university guests, guest lecturers, parents, and conference delegates.",
    position: { x: 610, y: 200 },
    facilities: ["AC Deluxe Suites", "VIP Dining Room", "Conference Lounge", "Room Service", "High-speed Wi-Fi"],
    timings: "Check-in: 12:00 PM | Check-out: 11:00 AM (Subject to Prior Booking)",
    keywords: ["guest house", "hotel", "parents stay", "visitors", "delegates", "accommodation"],
    aliases: ["Guest House", "VIP Guest House", "Faculty Residence"],
    zone: "Residential",
    color: "#0284C7",
  },

  // ─── SPORTS & ATHLETICS ──────────────────────────────────────────
  {
    id: "sports_ground",
    name: "Outdoor Sports Stadium & Athletic Track",
    shortName: "Sports Ground",
    category: "Sports",
    description:
      "Sprawling athletic facility encompassing a full-size cricket ground, FIFA-standard football pitch, 400m 8-lane running track, and spectator pavilion for Riviera and inter-collegiate tournaments.",
    position: { x: 190, y: 220 },
    facilities: ["Cricket Pitch & Nets", "Football Turf", "400m Running Track", "Floodlights", "Spectator Stands"],
    timings: "6:00 AM - 8:30 AM & 4:30 PM - 7:30 PM",
    keywords: ["sports", "ground", "cricket", "football", "running track", "athletics", "stadium", "tournament"],
    aliases: ["Sports Ground", "Cricket Ground", "Football Ground", "Main Ground"],
    zone: "West Sports",
    color: "#16A34A",
  },
  {
    id: "indoor_sports",
    name: "Indoor Sports Complex & Gymnasium",
    shortName: "Indoor Sports / Gym",
    category: "Sports",
    description:
      "Multi-level indoor athletic arena hosting wooden-floored badminton courts, international-standard table tennis arena, squash courts, and fully equipped modern fitness gymnasium.",
    position: { x: 180, y: 320 },
    floors: [
      "Ground Level: 4 Synthetic Badminton Courts, Table Tennis Arena, Reception",
      "1st Floor: Cardio & Strength Multi-Gymnasium with certified fitness trainers",
    ],
    facilities: ["Badminton Courts", "Table Tennis", "Weight Training", "Cardio Zone", "Locker Rooms", "Shower Facilities"],
    timings: "6:00 AM - 9:00 AM & 4:30 PM - 8:30 PM",
    keywords: ["gym", "gymnasium", "badminton", "indoor sports", "table tennis", "squash", "fitness", "workout"],
    aliases: ["Gym", "Indoor Stadium", "Indoor Sports", "Fitness Centre"],
    zone: "West Sports",
    color: "#16A34A",
  },
  {
    id: "swimming_pool",
    name: "Olympic Swimming Pool",
    shortName: "Swimming Pool",
    category: "Sports",
    description:
      "50-meter Olympic-dimension outdoor aquatic center with dedicated certified lifeguards, diving area, filtration system, and separate coaching slots for men and women.",
    position: { x: 140, y: 270 },
    facilities: ["50m Olympic Pool", "Certified Lifeguards", "Shower & Changing Rooms", "Spectator Bleachers"],
    timings: "6:00 AM - 8:30 AM & 4:30 PM - 7:00 PM (Separate Men/Women Slots)",
    keywords: ["swimming", "pool", "swimming pool", "aquatics", "water sports"],
    aliases: ["Pool", "Swimming Pool", "Aquatic Centre"],
    zone: "West Sports",
    color: "#16A34A",
  },
  {
    id: "courts",
    name: "Basketball & Tennis Courts",
    shortName: "Basketball Courts",
    category: "Sports",
    description:
      "Acrylic-surfaced floodlit outdoor sports courts for basketball, volleyball, and tennis, frequently active during evening recreational sessions and sports leagues.",
    position: { x: 230, y: 260 },
    facilities: ["2 Synthetic Basketball Courts", "Volleyball Courts", "Tennis Court", "LED Floodlights"],
    timings: "6:00 AM - 8:30 AM & 4:30 PM - 8:00 PM",
    keywords: ["basketball", "tennis", "volleyball", "court", "sports"],
    aliases: ["Basketball Court", "Tennis Court", "Volleyball Court"],
    zone: "West Sports",
    color: "#16A34A",
  },

  // ─── GATES & TRANSPORTATION ──────────────────────────────────────
  {
    id: "main_gate",
    name: "Main Entrance (Gate 1) & Security Post",
    shortName: "Main Gate (Gate 1)",
    category: "Entrance",
    description:
      "Primary grand architectural gateway along Vandalur-Kelambakkam Road with 24/7 security turnstiles, visitor vehicle registration, visitor pass issuance, and main drop-off bay.",
    position: { x: 300, y: 620 },
    facilities: ["24/7 Security Post", "Visitor Registration", "Boom Barriers", "Pedestrian Turnstiles", "CCTV Surveillance"],
    timings: "Open 24/7",
    keywords: ["main gate", "gate 1", "entry", "entrance", "security", "exit", "vandalur kelambakkam road", "reception"],
    aliases: ["Main Gate", "Gate 1", "Entry 1", "Main Entrance", "Security Gate"],
    zone: "South Entrance",
    color: "#64748B",
  },
  {
    id: "gate_2",
    name: "Gate 2 (Service & Hostel Entry)",
    shortName: "Gate 2",
    category: "Entrance",
    description:
      "Secondary access gate primarily dedicated to campus shuttle services, hostel goods transport, supply deliveries, and peak-hour student pedestrian movement.",
    position: { x: 620, y: 620 },
    facilities: ["Security Post", "Shuttle Access", "CCTV"],
    timings: "6:00 AM - 10:00 PM",
    keywords: ["gate 2", "entry 2", "service gate", "hostel gate", "entrance"],
    aliases: ["Gate 2", "Entry 2", "Service Gate"],
    zone: "South Entrance",
    color: "#64748B",
  },
  {
    id: "parking_west",
    name: "Student & Two-Wheeler Parking (West Lot)",
    shortName: "West Parking",
    category: "Services",
    description:
      "Dedicated shaded parking facility for student two-wheelers and day-scholar bicycles, equipped with security personnel and QR-based entry badges.",
    position: { x: 230, y: 580 },
    facilities: ["Shaded Parking Bays", "Security Guard", "Helmet Storage Shelves", "EV Charging Point"],
    timings: "7:30 AM - 8:30 PM",
    keywords: ["parking", "bike parking", "two wheeler", "vehicle", "scooter", "car park"],
    aliases: ["Student Parking", "West Parking", "Bike Parking"],
    zone: "South Entrance",
    color: "#64748B",
  },
  {
    id: "bus_bay",
    name: "Campus Bus Bay & Shuttle Terminus",
    shortName: "Bus Bay",
    category: "Services",
    description:
      "University transport terminus where day-scholar college buses from Chennai, Tambaram, Adyar, and Kelambakkam arrive and depart, plus internal campus EV shuttle stops.",
    position: { x: 380, y: 600 },
    facilities: ["College Bus Line-up", "EV Campus Shuttles", "Covered Waiting Shed", "Information Board"],
    timings: "Buses arrive 8:00 AM - 8:30 AM | Depart 5:00 PM - 5:30 PM",
    keywords: ["bus", "bus bay", "transport", "shuttle", "college bus", "tambaram bus", "chennai bus"],
    aliases: ["Bus Bay", "Shuttle Terminus", "Transport Hub"],
    zone: "South Entrance",
    color: "#64748B",
  },
];

// Quick Access destinations for fast 1-click navigation
export const QUICK_DESTINATIONS = [
  { id: "library", label: "Central Library", icon: "Library" },
  { id: "ab1", label: "Academic Block 1 (AB-1)", icon: "GraduationCap" },
  { id: "ab2", label: "Academic Block 2 (AB-2)", icon: "BookOpen" },
  { id: "ab3", label: "Academic Block 3 (AB-3)", icon: "Sparkles" },
  { id: "health", label: "Health Centre", icon: "HeartPulse" },
  { id: "northsquare", label: "North Square Food", icon: "Utensils" },
  { id: "mga", label: "MG Auditorium", icon: "Award" },
  { id: "sports_ground", label: "Sports Stadium", icon: "Trophy" },
  { id: "alpha_hostel", label: "Alpha Hostel", icon: "Home" },
  { id: "vmart", label: "V-Mart Store", icon: "ShoppingBag" },
  { id: "main_gate", label: "Main Gate (Gate 1)", icon: "Navigation" },
];

// Category metadata and themes
export const LOCATION_CATEGORIES = [
  { key: "All", label: "All Locations", count: CAMPUS_LOCATIONS.length, color: "#4F46E5" },
  { key: "Academic", label: "Academic Blocks", count: 3, color: "#4F46E5" },
  { key: "Library", label: "Central Library", count: 1, color: "#059669" },
  { key: "Administration", label: "Administration", count: 1, color: "#D97706" },
  { key: "Auditorium", label: "Auditoriums", count: 1, color: "#7C3AED" },
  { key: "Healthcare", label: "Healthcare", count: 1, color: "#DC2626" },
  { key: "Dining", label: "Dining & Cafeteria", count: 2, color: "#EA580C" },
  { key: "Hostels", label: "Hostel Blocks", count: 4, color: "#8B5CF6" },
  { key: "Sports", label: "Sports & Athletics", count: 4, color: "#16A34A" },
  { key: "Services", label: "Services & Banking", count: 4, color: "#0284C7" },
  { key: "Entrance", label: "Gates & Access", count: 2, color: "#64748B" },
];
