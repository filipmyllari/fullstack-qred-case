import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create companies
  const companyAB = await prisma.company.create({
    data: {
      name: 'Company AB',
    },
  });

  const companyXYZ = await prisma.company.create({
    data: {
      name: 'Company XYZ',
    },
  });

  console.log('✅ Companies created');

  // Create cards
  await prisma.card.create({
    data: {
      companyId: companyAB.id,
      isActive: false,
      imageUrl: 'https://placeholdercard.com/300x180/2563eb/',
    },
  });

  await prisma.card.create({
    data: {
      companyId: companyXYZ.id,
      isActive: true,
      imageUrl: 'https://placeholdercard.com/300x180/16a34a/',
    },
  });

  console.log('✅ Cards created');

  // Create spending limits
  await prisma.spendingLimit.create({
    data: {
      companyId: companyAB.id,
      current: 5400,
      limit: 10000,
      currency: 'kr',
    },
  });

  await prisma.spendingLimit.create({
    data: {
      companyId: companyXYZ.id,
      current: 8200,
      limit: 15000,
      currency: 'kr',
    },
  });

  console.log('✅ Spending limits created');

  // Create invoices
  await prisma.invoice.create({
    data: {
      companyId: companyAB.id,
      isDue: true,
    },
  });

  await prisma.invoice.create({
    data: {
      companyId: companyXYZ.id,
      isDue: false,
    },
  });

  console.log('✅ Invoices created');

  // Create transactions for Company AB
  const companyABTransactions = [
    {
      description: 'Office supplies',
      dataPoints: 'Stockholm HQ',
      date: new Date('2024-01-15'),
    },
    {
      description: 'Marketing campaign',
      dataPoints: 'Google Ads',
      date: new Date('2024-01-14'),
    },
    {
      description: 'Software license',
      dataPoints: 'Adobe Creative',
      date: new Date('2024-01-13'),
    },
    // Additional transactions
    ...Array.from({ length: 54 }, (_, i) => ({
      description: `Business expense ${i + 4}`,
      dataPoints: `Location: Stockholm`,
      date: new Date(2024, 0, 12 - i),
    })),
  ];

  for (const transaction of companyABTransactions) {
    await prisma.transaction.create({
      data: {
        companyId: companyAB.id,
        ...transaction,
      },
    });
  }

  console.log('✅ Company AB transactions created');

  // Create transactions for Company XYZ
  const companyXYZTransactions = [
    {
      description: 'Business travel',
      dataPoints: 'SAS Airlines',
      date: new Date('2024-01-16'),
    },
    {
      description: 'Client dinner',
      dataPoints: 'Restaurant NK',
      date: new Date('2024-01-15'),
    },
    {
      description: 'Equipment purchase',
      dataPoints: 'Dell Computers',
      date: new Date('2024-01-14'),
    },
    // Additional transactions
    ...Array.from({ length: 42 }, (_, i) => ({
      description: `Company XYZ expense ${i + 7}`,
      dataPoints: `Location: Gothenburg`,
      date: new Date(2024, 0, 11 - i),
    })),
  ];

  for (const transaction of companyXYZTransactions) {
    await prisma.transaction.create({
      data: {
        companyId: companyXYZ.id,
        ...transaction,
      },
    });
  }

  console.log('✅ Company XYZ transactions created');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
