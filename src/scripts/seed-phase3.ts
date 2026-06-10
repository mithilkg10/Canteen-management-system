import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Phase 3: Inventory, Attendance, and Audit Logs...');

  // 1. Seed Inventory
  console.log('Seeding Inventory...');
  const inventoryItems = [
    { itemName: 'Rice (Sona Masuri)', quantity: 250, pricePerUnit: 55, totalPrice: 13750 },
    { itemName: 'Toor Dal', quantity: 50, pricePerUnit: 120, totalPrice: 6000 },
    { itemName: 'Sunflower Oil (1L)', quantity: 45, pricePerUnit: 115, totalPrice: 5175 },
    { itemName: 'Nandini Milk (1L)', quantity: 5, pricePerUnit: 44, totalPrice: 220 }, // Low stock!
    { itemName: 'Wheat Flour (Aashirvaad)', quantity: 100, pricePerUnit: 48, totalPrice: 4800 },
    { itemName: 'Onions', quantity: 80, pricePerUnit: 35, totalPrice: 2800 },
    { itemName: 'Tomatoes', quantity: 8, pricePerUnit: 40, totalPrice: 320 }, // Low stock!
    { itemName: 'Sugar', quantity: 60, pricePerUnit: 42, totalPrice: 2520 },
    { itemName: 'Tea Powder (Tata Gold)', quantity: 15, pricePerUnit: 450, totalPrice: 6750 },
    { itemName: 'Salt (Tata)', quantity: 40, pricePerUnit: 25, totalPrice: 1000 },
  ];

  for (const item of inventoryItems) {
    await prisma.canteenInventory.create({ data: item });
  }

  // 2. Seed Attendance
  console.log('Seeding Attendance...');
  const user = await prisma.user.findFirst({ where: { username: 'admin' } });
  if (user) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date(today);
    dayBefore.setDate(dayBefore.getDate() - 2);

    await prisma.employeeAttendance.createMany({
      data: [
        {
          userId: user.id,
          date: today,
          checkInTime: new Date(today.setHours(8, 30, 0, 0)),
          checkOutTime: null, // Still active
        },
        {
          userId: user.id,
          date: yesterday,
          checkInTime: new Date(yesterday.setHours(8, 15, 0, 0)),
          checkOutTime: new Date(yesterday.setHours(17, 45, 0, 0)),
        },
        {
          userId: user.id,
          date: dayBefore,
          checkInTime: new Date(dayBefore.setHours(8, 45, 0, 0)),
          checkOutTime: new Date(dayBefore.setHours(18, 10, 0, 0)),
        }
      ]
    });
  }

  // 3. Seed Audit Logs
  console.log('Seeding Audit Logs...');
  const now = new Date();
  const tenMinsAgo = new Date(now.getTime() - 10 * 60000);
  const oneHourAgo = new Date(now.getTime() - 60 * 60000);
  const twoHoursAgo = new Date(now.getTime() - 120 * 60000);

  await prisma.auditLog.createMany({
    data: [
      { username: 'admin', action: 'User logged in successfully', timestamp: tenMinsAgo },
      { username: 'admin', action: 'Created new Vendor record: "Fresh Farms"', timestamp: oneHourAgo },
      { username: 'system', action: 'FAILED LOGIN ATTEMPT from IP 192.168.1.45', timestamp: twoHoursAgo },
      { username: 'admin', action: 'Updated meal rates for Client: "Infosys Phase 2"', timestamp: new Date(now.getTime() - 180 * 60000) },
      { username: 'admin', action: 'DELETED Order record #ORD-0921', timestamp: new Date(now.getTime() - 240 * 60000) },
    ]
  });

  console.log('Phase 3 Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
