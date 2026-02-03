const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agt",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

// Generate 24 months: Jan 2024 - Des 2025
const generatePeriods = () => {
  const periods = [];
  // Jan 2024 - Dec 2024 (12 bulan)
  for (let i = 0; i < 12; i++) {
    periods.push({ month: months[i], year: 2024 });
  }
  // Jan 2025 - Dec 2025 (12 bulan)
  for (let i = 0; i < 12; i++) {
    periods.push({ month: months[i], year: 2025 });
  }
  return periods;
};

const getRandomDemand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

async function main() {
  console.log("--- Memulai Seeding Data Saputra Jaya ---");

  // 1. Buat User Admin Default
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Administrator Saputra",
      role: "owner",
    },
  });

  // Create all suppliers
  const suppliersData = [
    {
      name: "CV Hana Centea",
      address: "Bandung, Jawa Barat",
      contact: "Bpk. Hana",
      phone: "022-7301234",
      email: "hana.centea@gmail.com",
    },
    {
      name: "PT Mayora Indah Tbk",
      address: "Tangerang, Banten",
      contact: "Ibu Sari",
      phone: "021-5401234",
      email: "sales@mayora.co.id",
    },
    {
      name: "PT Indofood CBP Sukses Makmur Tbk",
      address: "Jakarta Selatan, DKI Jakarta",
      contact: "Bpk. Andi",
      phone: "021-78001234",
      email: "corporate@indofood.co.id",
    },
    {
      name: "PT Mitra Priangan",
      address: "Bandung, Jawa Barat",
      contact: "Ibu Dewi",
      phone: "022-7205678",
      email: "mitra.priangan@gmail.com",
    },
    {
      name: "PT Makmur Mandiri Pratama",
      address: "Bandung, Jawa Barat",
      contact: "Bpk. Joko",
      phone: "022-7309876",
      email: "makmur.mandiri@yahoo.com",
    },
    {
      name: "PT Sayap Mas Utama",
      address: "Surabaya, Jawa Timur",
      contact: "Bpk. Rudi",
      phone: "031-8401234",
      email: "sayapmas@wings.co.id",
    },
    {
      name: "PT Unilever Indonesia Tbk",
      address: "Tangerang, Banten",
      contact: "Ibu Maya",
      phone: "021-5261234",
      email: "customer.care@unilever.com",
    },
    {
      name: "PT Wings Group",
      address: "Jakarta Barat, DKI Jakarta",
      contact: "Bpk. Herman",
      phone: "021-5601234",
      email: "info@wings.co.id",
    },
    {
      name: "PT Heinz ABC Indonesia",
      address: "Jakarta Timur, DKI Jakarta",
      contact: "Ibu Rina",
      phone: "021-8401234",
      email: "abc.indonesia@kraftheinz.com",
    },
    {
      name: "PT Multi Indomandiri",
      address: "Bandung, Jawa Barat",
      contact: "Bpk. Agus",
      phone: "022-7501234",
      email: "multi.indomandiri@gmail.com",
    },
    {
      name: "PT Mandiri Investama Sejati",
      address: "Jakarta Pusat, DKI Jakarta",
      contact: "Ibu Linda",
      phone: "021-3901234",
      email: "mandiri.investama@yahoo.com",
    },
    {
      name: "PT Uni-Charm Indonesia Tbk",
      address: "Jakarta Selatan, DKI Jakarta",
      contact: "Bpk. Bambang",
      phone: "021-7801234",
      email: "info@unicharm.co.id",
    },
    {
      name: "PT Pabrik Kertas Tjiwi Kimia Tbk",
      address: "Sidoarjo, Jawa Timur",
      contact: "Ibu Wati",
      phone: "031-8901234",
      email: "tjiwi@sinarmas.com",
    },
    {
      name: "PT Sasa Inti",
      address: "Jakarta Barat, DKI Jakarta",
      contact: "Bpk. Dedi",
      phone: "021-5801234",
      email: "info@sasainti.co.id",
    },
    {
      name: "PT Lion Wings",
      address: "Jakarta Barat, DKI Jakarta",
      contact: "Ibu Sinta",
      phone: "021-5651234",
      email: "lionwings@lionwings.com",
    },
    {
      name: "PT Wings Care",
      address: "Jakarta Barat, DKI Jakarta",
      contact: "Bpk. Eko",
      phone: "021-5671234",
      email: "wingscare@wings.co.id",
    },
    {
      name: "PT Sinar Sosro Gunung Slamat",
      address: "Jakarta Selatan, DKI Jakarta",
      contact: "Ibu Ratna",
      phone: "021-7851234",
      email: "info@sinarsosro.co.id",
    },
    {
      name: "PT Kino Indonesia Tbk",
      address: "Tangerang, Banten",
      contact: "Bpk. Hendra",
      phone: "021-5471234",
      email: "sales@kfrgroup.com",
    },
    {
      name: "PT Godrej Consumer Products Indonesia",
      address: "Jakarta Timur, DKI Jakarta",
      contact: "Ibu Yuni",
      phone: "021-8451234",
      email: "info@godrej.co.id",
    },
    {
      name: "PT Madurasa Unggulan Nusantara",
      address: "Wonogiri, Jawa Tengah",
      contact: "Bpk. Sugeng",
      phone: "0273-321234",
      email: "madurasa@gmail.com",
    },
    {
      name: "PT Beiersdorf Indonesia",
      address: "Jakarta Selatan, DKI Jakarta",
      contact: "Ibu Lia",
      phone: "021-7891234",
      email: "info@beiersdorf.co.id",
    },
    {
      name: "PT International Chemical Industry",
      address: "Jakarta Barat, DKI Jakarta",
      contact: "Bpk. Irwan",
      phone: "021-5691234",
      email: "ici@interchem.co.id",
    },
    {
      name: "PT Saka Farma Laboratories",
      address: "Yogyakarta",
      contact: "Ibu Nurul",
      phone: "0274-561234",
      email: "saka.farma@gmail.com",
    },
    {
      name: "PT Hisamitsu Pharma Indonesia",
      address: "Bekasi, Jawa Barat",
      contact: "Bpk. Wawan",
      phone: "021-8801234",
      email: "hisamitsu@hisamitsu.co.id",
    },
    {
      name: "PT Konimex",
      address: "Sukoharjo, Jawa Tengah",
      contact: "Ibu Tutik",
      phone: "0271-591234",
      email: "info@konimex.com",
    },
    {
      name: "PT Tempo Scan Pacific Tbk",
      address: "Jakarta Selatan, DKI Jakarta",
      contact: "Bpk. Arief",
      phone: "021-7901234",
      email: "corporate@temposcan.co.id",
    },
    {
      name: "PT Supra Ferbindo",
      address: "Bandung, Jawa Barat",
      contact: "Ibu Siti",
      phone: "022-7601234",
      email: "supra.ferbindo@gmail.com",
    },
    {
      name: "PT Kalbe Farma Tbk",
      address: "Jakarta Timur, DKI Jakarta",
      contact: "Bpk. Tono",
      phone: "021-8491234",
      email: "corporate@kalbe.co.id",
    },
    {
      name: "PT Tokai Dharma Indonesia",
      address: "Karawang, Jawa Barat",
      contact: "Ibu Fitri",
      phone: "0267-401234",
      email: "tokai.dharma@gmail.com",
    },
    {
      name: "PT Henson Farma",
      address: "Bandung, Jawa Barat",
      contact: "Bpk. Dadan",
      phone: "022-7701234",
      email: "henson.farma@yahoo.com",
    },
    {
      name: "PT Nutrifood Indonesia",
      address: "Jakarta Selatan, DKI Jakarta",
      contact: "Ibu Dian",
      phone: "021-7821234",
      email: "info@nutrifood.co.id",
    },
    {
      name: "PT Bina Karya Prima",
      address: "Jakarta Barat, DKI Jakarta",
      contact: "Bpk. Faisal",
      phone: "021-5711234",
      email: "bkp@binakarya.co.id",
    },
    {
      name: "PT Herlina Indah",
      address: "Bandung, Jawa Barat",
      contact: "Ibu Herlina",
      phone: "022-7801234",
      email: "herlina.indah@gmail.com",
    },
    {
      name: "PT Eagle Indo Pharma",
      address: "Bandung, Jawa Barat",
      contact: "Bpk. Nana",
      phone: "022-7851234",
      email: "eagle.indo@gmail.com",
    },
    {
      name: "PT Sunreno",
      address: "Bandung, Jawa Barat",
      contact: "Ibu Rosa",
      phone: "022-7901234",
      email: "sunreno@gmail.com",
    },
    {
      name: "PT Mayora Indah",
      address: "Tangerang, Banten",
      contact: "Bpk. Rizki",
      phone: "021-5421234",
      email: "distribusi@mayora.co.id",
    },
    {
      name: "PT Santos Jaya Abadi",
      address: "Jakarta Barat, DKI Jakarta",
      contact: "Ibu Nita",
      phone: "021-5731234",
      email: "kapalapi@kapalapi.co.id",
    },
    {
      name: "PT Java Prima Abadi",
      address: "Bandung, Jawa Barat",
      contact: "Bpk. Udin",
      phone: "022-7951234",
      email: "java.prima@gmail.com",
    },
    {
      name: "PT Sari Incofood Corporation",
      address: "Jakarta Barat, DKI Jakarta",
      contact: "Ibu Erni",
      phone: "021-5751234",
      email: "info@incofood.co.id",
    },
    {
      name: "PT Gudang Garam Tbk",
      address: "Kediri, Jawa Timur",
      contact: "Bpk. Wahyu",
      phone: "0354-681234",
      email: "sales@gudanggaram.com",
    },
    {
      name: "PT HM Sampoerna Tbk",
      address: "Surabaya, Jawa Timur",
      contact: "Ibu Mega",
      phone: "031-8431234",
      email: "corporate@sampoerna.com",
    },
    {
      name: "PT Karyadibya JT International",
      address: "Bandung, Jawa Barat",
      contact: "Bpk. Asep",
      phone: "022-7101234",
      email: "karyadibya@gmail.com",
    },
    {
      name: "PT NSTI Kudus",
      address: "Kudus, Jawa Tengah",
      contact: "Ibu Sri",
      phone: "0291-431234",
      email: "nsti.kudus@gmail.com",
    },
    {
      name: "PT Djarum Kudus",
      address: "Kudus, Jawa Tengah",
      contact: "Bpk. Gunawan",
      phone: "0291-441234",
      email: "sales@djarum.com",
    },
    {
      name: "PT Berdikari Inti Gemilang",
      address: "Bandung, Jawa Barat",
      contact: "Ibu Tuti",
      phone: "022-7151234",
      email: "berdikari.inti@gmail.com",
    },
    {
      name: "PT Nugraha Indah Citarasa Indonesia",
      address: "Bandung, Jawa Barat",
      contact: "Bpk. Cecep",
      phone: "022-7201234",
      email: "nugraha.indah@gmail.com",
    },
    {
      name: "PT Ajinomoto Indonesia",
      address: "Jakarta Timur, DKI Jakarta",
      contact: "Ibu Keiko",
      phone: "021-8501234",
      email: "info@ajinomoto.co.id",
    },
    {
      name: "PT Byonn",
      address: "Bandung, Jawa Barat",
      contact: "Bpk. Budi",
      phone: "022-7251234",
      email: "byonn@gmail.com",
    },
    {
      name: "PT Motasa Indonesia",
      address: "Mojokerto, Jawa Timur",
      contact: "Ibu Endah",
      phone: "0321-391234",
      email: "motasa@masako.co.id",
    },
    {
      name: "PT Sasana Megah Agung",
      address: "Bandung, Jawa Barat",
      contact: "Bpk. Ridwan",
      phone: "022-7351234",
      email: "sasana.megah@gmail.com",
    },
    {
      name: "Toko Bobi",
      address: "Bandung, Jawa Barat",
      contact: "Bpk. Bobi",
      phone: "022-7401234",
      email: "toko.bobi@gmail.com",
    },
  ];

  console.log("Menambahkan suppliers...");
  const createdSuppliers = [];
  for (const supplierData of suppliersData) {
    const supplier = await prisma.supplier.create({
      data: supplierData,
    });
    createdSuppliers.push(supplier);
  }
  console.log(`${createdSuppliers.length} suppliers berhasil ditambahkan.`);

  // For backward compatibility, reference first two suppliers
  const supplier1 = createdSuppliers[0];
  const supplier2 = createdSuppliers[1];

  const productList = [
    // Mie Instan
    {
      name: "Indomie Goreng 85 gr",
      unit: "Dus",
      current: 80,
      baseDemand: 120,
      price: 115000,
      cost: 105000,
    },
    {
      name: "Indomie Soto 70 gr",
      unit: "Dus",
      current: 65,
      baseDemand: 90,
      price: 110000,
      cost: 100000,
    },
    {
      name: "Indomie Ayam Bawang 72 gr",
      unit: "Dus",
      current: 80,
      baseDemand: 100,
      price: 110000,
      cost: 100000,
    },
    {
      name: "Indomie Rendang 80 gr",
      unit: "Dus",
      current: 60,
      baseDemand: 70,
      price: 120000,
      cost: 110000,
    },
    {
      name: "Indomie Kari Ayam 72 gr",
      unit: "Dus",
      current: 10,
      baseDemand: 60,
      price: 110000,
      cost: 100000,
    },
    {
      name: "Pop Mie Ayam 75 gr",
      unit: "Dus",
      current: 10,
      baseDemand: 40,
      price: 145000,
      cost: 135000,
    },
    {
      name: "Pop Mie Soto 75 gr",
      unit: "Dus",
      current: 10,
      baseDemand: 35,
      price: 145000,
      cost: 135000,
    },
    {
      name: "Supermi Ayam 75 gr",
      unit: "Dus",
      current: 5,
      baseDemand: 25,
      price: 95000,
      cost: 85000,
    },
    {
      name: "Supermi Soto 75 gr",
      unit: "Dus",
      current: 5,
      baseDemand: 20,
      price: 95000,
      cost: 85000,
    },
    {
      name: "Sarimi Isi 2 Ayam 120 gr",
      unit: "Dus",
      current: 20,
      baseDemand: 30,
      price: 125000,
      cost: 115000,
    },
    {
      name: "Mie Sedaap Goreng 90 gr",
      unit: "Dus",
      current: 50,
      baseDemand: 80,
      price: 118000,
      cost: 108000,
    },
    {
      name: "Mie Sedaap Soto 75 gr",
      unit: "Dus",
      current: 50,
      baseDemand: 70,
      price: 115000,
      cost: 105000,
    },

    // Makanan & Minuman
    {
      name: "Kopi Torabika Sachet 25 gr",
      unit: "Dus",
      current: 12,
      baseDemand: 50,
      price: 85000,
      cost: 75000,
    },
    {
      name: "Kopi Good Day Cappuccino 25 gr",
      unit: "Dus",
      current: 29,
      baseDemand: 60,
      price: 95000,
      cost: 85000,
    },
    {
      name: "Roma Marie Gold 120 gr",
      unit: "Dus",
      current: 7,
      baseDemand: 25,
      price: 72000,
      cost: 65000,
    },
    {
      name: "Roma Kelapa 300 gr",
      unit: "Dus",
      current: 14,
      baseDemand: 30,
      price: 85000,
      cost: 78000,
    },
    {
      name: "Beng-Beng Cokelat 20 gr",
      unit: "Dus",
      current: 6,
      baseDemand: 40,
      price: 125000,
      cost: 115000,
    },
    {
      name: "Energen Cokelat 30 gr",
      unit: "Dus",
      current: 40,
      baseDemand: 55,
      price: 95000,
      cost: 88000,
    },
    {
      name: "Energen Kacang Hijau 30 gr",
      unit: "Dus",
      current: 23,
      baseDemand: 40,
      price: 95000,
      cost: 88000,
    },
    {
      name: "Slai Olai Blueberry 120 gr",
      unit: "Dus",
      current: 10,
      baseDemand: 20,
      price: 78000,
      cost: 70000,
    },
    {
      name: "Better Wafer Chocolate 30 gr",
      unit: "Dus",
      current: 10,
      baseDemand: 25,
      price: 65000,
      cost: 58000,
    },
    {
      name: "Astor Wafer Cokelat 40 gr",
      unit: "Dus",
      current: 4,
      baseDemand: 20,
      price: 88000,
      cost: 80000,
    },
    {
      name: "Top Coffee Gula Aren 25 gr",
      unit: "Dus",
      current: 13,
      baseDemand: 35,
      price: 92000,
      cost: 84000,
    },
    {
      name: "Floridina Orange 360 ml",
      unit: "Dus",
      current: 13,
      baseDemand: 30,
      price: 78000,
      cost: 70000,
    },

    // Kebutuhan Rumah Tangga
    {
      name: "Rinso Bubuk 800 gr",
      unit: "Dus",
      current: 30,
      baseDemand: 45,
      price: 185000,
      cost: 170000,
    },
    {
      name: "Rinso Cair 900 ml",
      unit: "Dus",
      current: 30,
      baseDemand: 40,
      price: 195000,
      cost: 180000,
    },
    {
      name: "Molto Pewangi 700 ml",
      unit: "Dus",
      current: 30,
      baseDemand: 35,
      price: 165000,
      cost: 150000,
    },
    {
      name: "Sunlight Lemon 800 ml",
      unit: "Dus",
      current: 14,
      baseDemand: 50,
      price: 145000,
      cost: 132000,
    },
    {
      name: "Lifebuoy Sabun 85 gr",
      unit: "Dus",
      current: 14,
      baseDemand: 40,
      price: 95000,
      cost: 85000,
    },
    {
      name: "Pepsodent Herbal 190 gr",
      unit: "Dus",
      current: 15,
      baseDemand: 35,
      price: 125000,
      cost: 115000,
    },
    {
      name: "Clear Shampoo 170 ml",
      unit: "Dus",
      current: 13,
      baseDemand: 30,
      price: 185000,
      cost: 170000,
    },
    {
      name: "Sunsilk Black 170 ml",
      unit: "Dus",
      current: 13,
      baseDemand: 28,
      price: 175000,
      cost: 160000,
    },
    {
      name: "Rexona Roll On 40 ml",
      unit: "Pcs",
      current: 20,
      baseDemand: 25,
      price: 18000,
      cost: 15000,
    },
    {
      name: "Dove Sabun 90 gr",
      unit: "Dus",
      current: 4,
      baseDemand: 20,
      price: 145000,
      cost: 132000,
    },
    {
      name: "So Klin Bubuk 800 gr",
      unit: "Dus",
      current: 30,
      baseDemand: 40,
      price: 165000,
      cost: 150000,
    },
    {
      name: "Daia Bubuk 900 gr",
      unit: "Dus",
      current: 30,
      baseDemand: 38,
      price: 155000,
      cost: 142000,
    },
    {
      name: "Attack Easy 900 gr",
      unit: "Dus",
      current: 30,
      baseDemand: 35,
      price: 175000,
      cost: 160000,
    },
    {
      name: "Emeron Shampoo 170 ml",
      unit: "Dus",
      current: 6,
      baseDemand: 18,
      price: 125000,
      cost: 115000,
    },
    {
      name: "Ciptadent Pasta Gigi 190 gr",
      unit: "Dus",
      current: 9,
      baseDemand: 22,
      price: 85000,
      cost: 75000,
    },
    {
      name: "Giv Sabun 80 gr",
      unit: "Dus",
      current: 11,
      baseDemand: 25,
      price: 78000,
      cost: 70000,
    },

    // Obat & Suplemen
    {
      name: "Mixagrip Flu",
      unit: "Box",
      current: 7,
      baseDemand: 15,
      price: 45000,
      cost: 38000,
    },
    {
      name: "Mixagrip Flu & Batuk",
      unit: "Box",
      current: 7,
      baseDemand: 12,
      price: 48000,
      cost: 40000,
    },
    {
      name: "Promag Tablet",
      unit: "Box",
      current: 7,
      baseDemand: 18,
      price: 55000,
      cost: 48000,
    },
    {
      name: "OBH Combi Dewasa",
      unit: "Box",
      current: 7,
      baseDemand: 14,
      price: 65000,
      cost: 55000,
    },
    {
      name: "OBH Combi Anak",
      unit: "Box",
      current: 12,
      baseDemand: 16,
      price: 62000,
      cost: 52000,
    },

    // Sembako
    {
      name: "Minyak Goreng 1 Liter",
      unit: "Dus",
      current: 10,
      baseDemand: 60,
      price: 185000,
      cost: 172000,
    },
    {
      name: "Minyak Goreng 2 Liter",
      unit: "Dus",
      current: 10,
      baseDemand: 45,
      price: 365000,
      cost: 340000,
    },
    {
      name: "Gula Pasir 1 Kg",
      unit: "Pcs",
      current: 20,
      baseDemand: 80,
      price: 18000,
      cost: 16000,
    },
    {
      name: "Tepung Terigu 250 gr",
      unit: "Pcs",
      current: 120,
      baseDemand: 100,
      price: 6500,
      cost: 5500,
    },
    {
      name: "Garam Dapur 500 gr",
      unit: "Pcs",
      current: 50,
      baseDemand: 60,
      price: 5000,
      cost: 4000,
    },
    {
      name: "Telur Ayam Negeri 250 gr",
      unit: "Pcs",
      current: 40,
      baseDemand: 90,
      price: 8500,
      cost: 7500,
    },
    {
      name: "Mi Telur 200 gr",
      unit: "Pcs",
      current: 5,
      baseDemand: 20,
      price: 7500,
      cost: 6500,
    },
    {
      name: "Bihunku 200 gr",
      unit: "Pcs",
      current: 5,
      baseDemand: 18,
      price: 8000,
      cost: 7000,
    },

    // Bumbu
    {
      name: "Ajinomoto MSG 1 kg",
      unit: "Dus",
      current: 5,
      baseDemand: 25,
      price: 245000,
      cost: 228000,
    },
    {
      name: "Ajinomoto MSG 250 gr",
      unit: "Dus",
      current: 5,
      baseDemand: 35,
      price: 125000,
      cost: 115000,
    },
    {
      name: "Masako Ayam 11 gr",
      unit: "Dus",
      current: 10,
      baseDemand: 50,
      price: 95000,
      cost: 85000,
    },
    {
      name: "Masako Sapi 11 gr",
      unit: "Dus",
      current: 10,
      baseDemand: 40,
      price: 95000,
      cost: 85000,
    },
    {
      name: "Sajiku Tepung Serbaguna 80 gr",
      unit: "Dus",
      current: 5,
      baseDemand: 30,
      price: 72000,
      cost: 65000,
    },
    {
      name: "Sajiku Bumbu Nasi Goreng 20 gr",
      unit: "Dus",
      current: 5,
      baseDemand: 35,
      price: 68000,
      cost: 60000,
    },
    {
      name: "Saori Saus Tiram 135 ml",
      unit: "Dus",
      current: 5,
      baseDemand: 22,
      price: 85000,
      cost: 76000,
    },
    {
      name: "Mayumi Mayonnaise 100 gr",
      unit: "Dus",
      current: 5,
      baseDemand: 18,
      price: 78000,
      cost: 70000,
    },
    {
      name: "Masako Refill 500 gr",
      unit: "Dus",
      current: 1,
      baseDemand: 15,
      price: 145000,
      cost: 132000,
    },
    {
      name: "Ajinomoto Refill 500 gr",
      unit: "Dus",
      current: 1,
      baseDemand: 12,
      price: 155000,
      cost: 142000,
    },

    // Rokok
    {
      name: "Gudang Garam Surya 16",
      unit: "Slop",
      current: 2,
      baseDemand: 30,
      price: 285000,
      cost: 265000,
    },
    {
      name: "Gudang Garam Filter 12",
      unit: "Slop",
      current: 10,
      baseDemand: 45,
      price: 245000,
      cost: 228000,
    },
    {
      name: "Gudang Garam International",
      unit: "Slop",
      current: 8,
      baseDemand: 35,
      price: 295000,
      cost: 275000,
    },
    {
      name: "Gudang Garam Signature",
      unit: "Slop",
      current: 5,
      baseDemand: 25,
      price: 315000,
      cost: 295000,
    },
    {
      name: "Gudang Garam Merah",
      unit: "Slop",
      current: 4,
      baseDemand: 28,
      price: 195000,
      cost: 180000,
    },
    {
      name: "Sampoerna A Mild 16",
      unit: "Slop",
      current: 10,
      baseDemand: 55,
      price: 325000,
      cost: 305000,
    },
    {
      name: "Sampoerna A Mild 12",
      unit: "Slop",
      current: 3,
      baseDemand: 40,
      price: 265000,
      cost: 248000,
    },
    {
      name: "Sampoerna Kretek",
      unit: "Slop",
      current: 15,
      baseDemand: 50,
      price: 215000,
      cost: 198000,
    },
    {
      name: "Sampoerna U Mild",
      unit: "Slop",
      current: 1,
      baseDemand: 20,
      price: 245000,
      cost: 228000,
    },
    {
      name: "Sampoerna Hijau",
      unit: "Slop",
      current: 5,
      baseDemand: 30,
      price: 185000,
      cost: 170000,
    },
    {
      name: "Djarum Super 12",
      unit: "Slop",
      current: 15,
      baseDemand: 45,
      price: 255000,
      cost: 238000,
    },
    {
      name: "Djarum Super 16",
      unit: "Slop",
      current: 5,
      baseDemand: 35,
      price: 295000,
      cost: 275000,
    },
    {
      name: "Djarum Black",
      unit: "Slop",
      current: 1,
      baseDemand: 22,
      price: 285000,
      cost: 265000,
    },
    {
      name: "Djarum Coklat",
      unit: "Slop",
      current: 40,
      baseDemand: 60,
      price: 195000,
      cost: 180000,
    },
    {
      name: "Djarum 76",
      unit: "Slop",
      current: 5,
      baseDemand: 38,
      price: 175000,
      cost: 162000,
    },
  ];

  // Get random supplier for product assignment
  const getRandomSupplier = () =>
    createdSuppliers[Math.floor(Math.random() * createdSuppliers.length)];
  const periods = generatePeriods();
  const createdProducts = [];

  for (const p of productList) {
    console.log(`Menambahkan produk: ${p.name}`);

    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        unit: p.unit,
        price: p.price,
        cost: p.cost,
        currentStock: p.current,
        safetyStock: Math.ceil(p.baseDemand * 0.2), // Safety stock = 20% of base demand
        bestN: [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)],
        supplier: {
          connect: { id: getRandomSupplier().id },
        },
      },
    });

    // Store product for transaction generation
    createdProducts.push({
      product: createdProduct,
      baseDemand: p.baseDemand,
      price: p.price,
    });

    // Generate 24 months of historical data (keep for reference but frontend uses transactions)
    const historicalEntries = [];
    for (const period of periods) {
      const seasonalBoost =
        period.month === "Apr" || period.month === "Des" ? 1.3 : 1.0;
      const randomFluc = Math.random() * 0.4 + 0.8;
      const demand = Math.round(p.baseDemand * seasonalBoost * randomFluc);

      historicalEntries.push({
        productId: createdProduct.id,
        month: period.month,
        year: period.year,
        demand,
        periodLabel: `${period.month}-${period.year.toString().slice(-2)}`,
      });
    }

    await prisma.historicalData.createMany({
      data: historicalEntries,
    });
  }

  // Generate transactions for 24 months - SEMUA PRODUK HARUS ADA TRANSAKSI
  console.log("Menambahkan transaksi 24 bulan...");

  const monthToNumber = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    Mei: 4,
    Jun: 5,
    Jul: 6,
    Agt: 7,
    Sep: 8,
    Okt: 9,
    Nov: 10,
    Des: 11,
  };

  for (const period of periods) {
    const monthNum = monthToNumber[period.month];
    let transactionCount = 0;

    // SETIAP PRODUK harus ada transaksi di setiap bulan
    for (const { product, baseDemand, price } of createdProducts) {
      // Generate 1-3 transaksi per produk per bulan
      const numTransactionsForProduct = Math.floor(Math.random() * 3) + 1;

      for (let t = 0; t < numTransactionsForProduct; t++) {
        // Random day of month (1-28 to be safe)
        const day = Math.floor(Math.random() * 28) + 1;
        const transactionDate = new Date(
          period.year,
          monthNum,
          day,
          Math.floor(Math.random() * 12) + 8, // Random hour 8-20
          Math.floor(Math.random() * 60), // Random minute
        );

        const transactionId =
          "trx" +
          Math.random().toString(36).substring(2, 9) +
          Date.now().toString(36) +
          t;

        // Random quantity based on base demand
        const seasonalBoost =
          period.month === "Apr" || period.month === "Des" ? 1.3 : 1.0;
        const maxQty = Math.max(
          Math.ceil((baseDemand * seasonalBoost) / 10),
          2,
        );
        const quantity = Math.floor(Math.random() * maxQty) + 1;
        const subtotal = quantity * price;

        // Create transaction with this product
        await prisma.transaction.create({
          data: {
            id: transactionId,
            date: transactionDate,
            totalAmount: subtotal,
            note: `Transaksi ${product.name.substring(0, 20)} - ${period.month} ${period.year}`,
            items: {
              create: {
                id:
                  "ti" +
                  Math.random().toString(36).substring(2, 9) +
                  Date.now().toString(36) +
                  t,
                productId: product.id,
                quantity,
                price,
                subtotal,
              },
            },
          },
        });

        transactionCount++;
      }
    }

    console.log(
      `  - ${period.month} ${period.year}: ${transactionCount} transaksi (${createdProducts.length} produk)`,
    );
  }

  console.log("--- Seeding Selesai ---");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
