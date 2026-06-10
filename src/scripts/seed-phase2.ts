import { prisma } from '../lib/prisma'

async function main() {
  // 1. Create Companies
  const tcs = await prisma.clientCompany.upsert({
    where: { id: 'comp-1' },
    update: {},
    create: { id: 'comp-1', name: 'TCS IT Park', breakfastRate: 50, lunchRate: 120, dinnerRate: 120, teaRate: 20 },
  })
  
  const infosys = await prisma.clientCompany.upsert({
    where: { id: 'comp-2' },
    update: {},
    create: { id: 'comp-2', name: 'Infosys Campus', breakfastRate: 45, lunchRate: 110, dinnerRate: 110, teaRate: 15 },
  })

  // 2. Create Vendors
  const vegVendor = await prisma.vendor.upsert({
    where: { id: 'ven-1' },
    update: {},
    create: { id: 'ven-1', name: 'Fresh Farms Vegetables', category: 'Vegetables' },
  })

  const dairyVendor = await prisma.vendor.upsert({
    where: { id: 'ven-2' },
    update: {},
    create: { id: 'ven-2', name: 'Nandini Dairy', category: 'Dairy' },
  })

  const groceryVendor = await prisma.vendor.upsert({
    where: { id: 'ven-3' },
    update: {},
    create: { id: 'ven-3', name: 'Metro Cash & Carry', category: 'Groceries' },
  })

  // 3. Create Procurements for the last 7 days
  const today = new Date();
  for(let i=0; i<7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    await prisma.procurement.create({
      data: {
        vendorId: vegVendor.id,
        itemName: 'Mixed Vegetables',
        quantity: Math.floor(Math.random() * 50) + 50,
        totalCost: Math.floor(Math.random() * 2000) + 3000,
        date: d
      }
    });

    await prisma.procurement.create({
      data: {
        vendorId: groceryVendor.id,
        itemName: 'Rice & Dal',
        quantity: Math.floor(Math.random() * 100) + 100,
        totalCost: Math.floor(Math.random() * 5000) + 4000,
        date: d
      }
    });
  }

  // 4. Create Daily Orders for the last 7 days
  for(let i=0; i<7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    // TCS Orders
    const tcsB = Math.floor(Math.random() * 100) + 200;
    const tcsL = Math.floor(Math.random() * 150) + 300;
    const tcsD = Math.floor(Math.random() * 50) + 100;
    const tcsT = Math.floor(Math.random() * 200) + 400;
    const tcsRev = (tcsB * tcs.breakfastRate) + (tcsL * tcs.lunchRate) + (tcsD * tcs.dinnerRate) + (tcsT * tcs.teaRate);

    await prisma.dailyOrder.create({
      data: {
        companyId: tcs.id,
        date: d,
        breakfastCount: tcsB,
        lunchCount: tcsL,
        dinnerCount: tcsD,
        teaCount: tcsT,
        totalRevenue: tcsRev
      }
    });

    // Infosys Orders
    const infB = Math.floor(Math.random() * 80) + 150;
    const infL = Math.floor(Math.random() * 100) + 250;
    const infD = Math.floor(Math.random() * 40) + 80;
    const infT = Math.floor(Math.random() * 150) + 300;
    const infRev = (infB * infosys.breakfastRate) + (infL * infosys.lunchRate) + (infD * infosys.dinnerRate) + (infT * infosys.teaRate);

    await prisma.dailyOrder.create({
      data: {
        companyId: infosys.id,
        date: d,
        breakfastCount: infB,
        lunchCount: infL,
        dinnerCount: infD,
        teaCount: infT,
        totalRevenue: infRev
      }
    });
  }

  console.log("Mock data seeded successfully for Phase 2!");
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
