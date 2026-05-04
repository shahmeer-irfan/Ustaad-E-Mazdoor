import {
  Zap, Droplets, Snowflake, HardHat, Sparkles, Scissors,
  PaintBucket, Car, Hammer, Flame, Leaf, Wrench,
  type LucideIcon,
} from "lucide-react";

export type Category = {
  icon: LucideIcon;
  nameUr: string;
  nameEn: string;
  color: string;
  jobs: number;
};

export const categories: Category[] = [
  { icon: Zap,         nameUr: "بجلی کا کام", nameEn: "Electrician",   color: "#f59e0b", jobs: 142 },
  { icon: Droplets,    nameUr: "پلمبنگ",      nameEn: "Plumbing",      color: "#3b82f6", jobs: 98  },
  { icon: Snowflake,   nameUr: "اے سی",       nameEn: "AC & Cooling",  color: "#06b6d4", jobs: 76  },
  { icon: HardHat,     nameUr: "تعمیر",       nameEn: "Construction",  color: "#a8a29e", jobs: 54  },
  { icon: Sparkles,    nameUr: "صفائی",       nameEn: "Cleaning",      color: "#10b981", jobs: 184 },
  { icon: Scissors,    nameUr: "سلائی",       nameEn: "Tailoring",     color: "#ec4899", jobs: 41  },
  { icon: PaintBucket, nameUr: "پینٹنگ",      nameEn: "Painting",      color: "#8b5cf6", jobs: 67  },
  { icon: Car,         nameUr: "گاڑی مکینک",  nameEn: "Auto Mechanic", color: "#f97316", jobs: 92  },
  { icon: Hammer,      nameUr: "بڑھئی",       nameEn: "Carpentry",     color: "#a16207", jobs: 58  },
  { icon: Flame,       nameUr: "ویلڈنگ",      nameEn: "Welding",       color: "#ef4444", jobs: 33  },
  { icon: Leaf,        nameUr: "باغبانی",     nameEn: "Gardening",     color: "#16a34a", jobs: 28  },
  { icon: Wrench,      nameUr: "آلات مرمت",   nameEn: "Appliances",    color: "#6366f1", jobs: 71  },
];

export type Job = {
  title: string;
  category: string;
  categoryColor: string;
  location: string;
  posted: string;
  budget: string;
  budgetType: "fixed" | "hourly";
  description: string;
  tags: string[];
  urgent: boolean;
  applicants: number;
};

export const jobs: Job[] = [
  {
    title: "Ghar ki 3 Kamron ki Wiring Repair",
    category: "Electrician",
    categoryColor: "#f59e0b",
    location: "DHA Phase 5, Karachi",
    posted: "2 ghante pehle",
    budget: "PKR 3,500",
    budgetType: "fixed",
    description:
      "Teen kamron mein purani wiring replace karni hai. Short circuit ki wajah se kuch switch kaam nahi kar rahe. Experienced electrician chahiye jo usi din kaam kar sake.",
    tags: ["Wiring", "Switch Repair", "Same Day"],
    urgent: true,
    applicants: 4,
  },
  {
    title: "Kitchen aur Bathroom Plumbing Fix",
    category: "Plumbing",
    categoryColor: "#3b82f6",
    location: "Gulberg, Lahore",
    posted: "5 ghante pehle",
    budget: "PKR 2,000/hr",
    budgetType: "hourly",
    description:
      "Kitchen ka sink slow drain ho raha hai, bathroom mein ek tap leak kar raha hai. Permanent fix chahiye — temporary nahi.",
    tags: ["Pipe Fitting", "Leak Repair"],
    urgent: false,
    applicants: 7,
  },
  {
    title: "2 Kamre aur Drawing Room Paint",
    category: "Painting",
    categoryColor: "#8b5cf6",
    location: "F-10, Islamabad",
    posted: "1 din pehle",
    budget: "PKR 18,000",
    budgetType: "fixed",
    description:
      "Naya ghar hai, sirf painting chahiye. Wall putty already ho chuki hai. 3 rooms ka total area 800 sqft hai. Paint client provide karega.",
    tags: ["Interior Paint", "Roller Finish"],
    urgent: false,
    applicants: 12,
  },
  {
    title: "Split AC 1.5 Ton Service aur Gas Fill",
    category: "AC & Cooling",
    categoryColor: "#06b6d4",
    location: "North Nazimabad, Karachi",
    posted: "3 ghante pehle",
    budget: "PKR 4,500",
    budgetType: "fixed",
    description:
      "2 AC units ki annual service chahiye, ek mein thodi cooling bhi kam ho gayi hai. Gas refill bhi shayad chahiye. Experience certificate zaroori hai.",
    tags: ["AC Service", "Gas Refill", "Inverter"],
    urgent: true,
    applicants: 3,
  },
  {
    title: "Wardrobe aur Wooden Shelf Installation",
    category: "Carpentry",
    categoryColor: "#a16207",
    location: "Bahria Town, Rawalpindi",
    posted: "2 din pehle",
    budget: "PKR 1,800/hr",
    budgetType: "hourly",
    description:
      "Ready-made wardrobe ka assembly aur wall mounting. Plus ek drawing room shelf banana hai — design hum denge. Good finishing wala kaam chahiye.",
    tags: ["Wood Work", "Assembly", "Wall Mount"],
    urgent: false,
    applicants: 5,
  },
  {
    title: "Office ki Deep Cleaning — 3000 sqft",
    category: "Cleaning",
    categoryColor: "#10b981",
    location: "Blue Area, Islamabad",
    posted: "6 ghante pehle",
    budget: "PKR 12,000",
    budgetType: "fixed",
    description:
      "Office relocation ke baad deep cleaning chahiye. Floors, windows, washrooms, kitchen area — sab shaamil hai. Weekend mein kaam hoga, team chahiye.",
    tags: ["Deep Clean", "Commercial", "Weekend"],
    urgent: true,
    applicants: 9,
  },
];

export type Freelancer = {
  initials: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  reviews: number;
  completedJobs: number;
  responseTime: string;
  skills: string[];
  rate: string;
  verified: boolean;
  badge: string | null;
  accent: string;
};

export const freelancers: Freelancer[] = [
  {
    initials: "AR", name: "Ahmed Raza", role: "Master Electrician",
    location: "Lahore", rating: 4.9, reviews: 178, completedJobs: 312,
    responseTime: "1 ghante mein jawab",
    skills: ["Wiring", "Maintenance", "Solar"],
    rate: "PKR 2,500/hr", verified: true, badge: "Top Rated",
    accent: "#f59e0b",
  },
  {
    initials: "BK", name: "Bilal Khan", role: "Plumbing Specialist",
    location: "Islamabad", rating: 4.9, reviews: 214, completedJobs: 401,
    responseTime: "30 min mein jawab",
    skills: ["Repairs", "Fittings", "Leak Fix"],
    rate: "PKR 2,800/hr", verified: true, badge: "Top Rated",
    accent: "#3b82f6",
  },
  {
    initials: "ST", name: "Sana Tariq", role: "Interior Painter",
    location: "Karachi", rating: 4.8, reviews: 126, completedJobs: 198,
    responseTime: "2 ghante mein jawab",
    skills: ["Wall Finish", "Texture", "Color Match"],
    rate: "PKR 2,000/hr", verified: true, badge: "Rising Star",
    accent: "#8b5cf6",
  },
  {
    initials: "MF", name: "Muhammad Farooq", role: "AC Technician",
    location: "Karachi", rating: 4.7, reviews: 89, completedJobs: 156,
    responseTime: "1 ghante mein jawab",
    skills: ["AC Service", "Gas Fill", "Inverter"],
    rate: "PKR 3,200/hr", verified: true, badge: null,
    accent: "#06b6d4",
  },
  {
    initials: "ZA", name: "Zahoor Ahmed", role: "Carpenter & Woodwork",
    location: "Faisalabad", rating: 4.8, reviews: 143, completedJobs: 267,
    responseTime: "3 ghante mein jawab",
    skills: ["Furniture", "Cabinets", "Wood Polish"],
    rate: "PKR 2,200/hr", verified: true, badge: "Expert",
    accent: "#a16207",
  },
];

export type Step = {
  num: string;
  title: string;
  desc: string;
};

export const workerSteps: Step[] = [
  { num: "01", title: "Profile Banao", desc: "Free mein sign up karo. Skills, area, aur experience add karo. Verification 24 ghante mein hoti hai." },
  { num: "02", title: "Kaam Dhundo",   desc: "Apni category aur shehar filter karo. Seedha jobs dekho jo aapke skill se match karein." },
  { num: "03", title: "Paise Kamao",   desc: "Client se baat karo, rate tay karo, kaam karo. Weekly secure payment, no waiting." },
];

export const clientSteps: Step[] = [
  { num: "01", title: "Kaam Post Karo",   desc: "Apni zaroorat describe karo. Budget, area, aur deadline batao. 2 minute lagengay." },
  { num: "02", title: "Proposals Dekho",  desc: "Verified workers ke quotes aayenge. Rating, reviews, aur profile dekh ke chunein." },
  { num: "03", title: "Kaam Karwao",      desc: "Kaam complete hone ke baad review do. Payment escrow se release hogi — 100% safe." },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  city: string;
  initials: string;
  accent: string;
};

export const testimonials: Testimonial[] = [
  {
    quote: "Pehle electrician dhundne ke liye purey mohalle se poochhna parta tha. Ustaad pe 30 minute mein verified banda mil gaya — kaam bhi top class.",
    name: "Fatima Iqbal", role: "Homeowner", city: "Karachi",
    initials: "FI", accent: "#f59e0b",
  },
  {
    quote: "5 saal se freelance plumbing kar raha hoon. Ustaad ne mujhe pure shehar ke clients tak pohncha diya. Income double ho gayi.",
    name: "Asif Mehmood", role: "Plumber", city: "Lahore",
    initials: "AM", accent: "#3b82f6",
  },
  {
    quote: "Office relocate kar rahe thay, deep cleaning ki team chahiye thi same day. 2 ghante mein 6 log aa gaye, kaam phir bhi excellent.",
    name: "Hassan Sheikh", role: "Operations Lead", city: "Islamabad",
    initials: "HS", accent: "#10b981",
  },
  {
    quote: "Mere paas certificate to nahi tha lekin tajurba 12 saal ka. Ustaad ne skill test ke baad verified kar diya — ab regular orders milte hain.",
    name: "Naeem Akhtar", role: "AC Technician", city: "Faisalabad",
    initials: "NA", accent: "#06b6d4",
  },
  {
    quote: "Beginning mein dar tha online platform pe paisa phasega. Lekin escrow system bilkul transparent hai — payment time pe milti hai.",
    name: "Sana Yousaf", role: "Interior Painter", city: "Rawalpindi",
    initials: "SY", accent: "#8b5cf6",
  },
];

export const cities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan",
  "Peshawar", "Quetta", "Hyderabad", "Sialkot", "Gujranwala", "Bahawalpur",
];
