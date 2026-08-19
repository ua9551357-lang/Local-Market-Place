import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const categoryNames = ['Plumbing', 'Electrician', 'Tutoring', 'Cleaning', 'Carpentry'];
const cities = ['Rawalpindi', 'Islamabad', 'Lahore', 'Karachi'];

// Split by gender so we can assign a matching random portrait photo
const maleFirstNames = ['Ali', 'Hassan', 'Ahmed', 'Bilal', 'Zain', 'Usman'];
const femaleFirstNames = ['Sara', 'Ayesha', 'Fatima', 'Hira'];
const lastNames = ['Khan', 'Malik', 'Rashid', 'Iqbal', 'Sheikh', 'Raza', 'Farooq', 'Butt'];
const bios = [
  'Professional service with years of hands-on experience.',
  'Reliable, punctual, and quality-focused.',
  'Trusted by hundreds of happy customers.',
  '24/7 emergency service available.',
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// randomuser.me hosts 100 static portrait photos per gender (0-99), no API key needed
function randomAvatarUrl(gender: 'men' | 'women'): string {
  const index = Math.floor(Math.random() * 100);
  return `https://randomuser.me/api/portraits/${gender}/${index}.jpg`;
}

function randomPerson(): { firstName: string; lastName: string; gender: 'men' | 'women' } {
  const gender: 'men' | 'women' = Math.random() > 0.5 ? 'men' : 'women';
  const firstName = gender === 'men' ? randomFrom(maleFirstNames) : randomFrom(femaleFirstNames);
  const lastName = randomFrom(lastNames);
  return { firstName, lastName, gender };
}

async function main() {
  // Categories
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const passwordHash = await bcrypt.hash('password123', 10);

  // Demo customer
  await prisma.user.upsert({
    where: { email: 'customer@demo.com' },
    update: { avatarUrl: randomAvatarUrl('men') },
    create: {
      name: 'Umair Customer',
      email: 'customer@demo.com',
      passwordHash,
      role: 'customer',
      city: 'Rawalpindi',
      avatarUrl: randomAvatarUrl('men'),
    },
  });

  // Demo admin
  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: { avatarUrl: randomAvatarUrl('men') },
    create: {
      name: 'Admin User',
      email: 'admin@demo.com',
      passwordHash,
      role: 'admin',
      city: 'Rawalpindi',
      avatarUrl: randomAvatarUrl('men'),
    },
  });

  // 50+ providers
  for (let i = 0; i < 55; i++) {
    const { firstName, lastName, gender } = randomPerson();
    const email = `provider${i}@demo.com`;
    const category = randomFrom(categories);
    const avatarUrl = randomAvatarUrl(gender);

    const user = await prisma.user.upsert({
      where: { email },
      // Existing rows (from a previous seed run) get an avatar too, not just new ones
      update: { avatarUrl },
      create: {
        name: `${firstName} ${lastName}`,
        email,
        passwordHash,
        role: 'provider',
        city: randomFrom(cities),
        avatarUrl,
      },
    });

    const providerProfile = await prisma.providerProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        categoryId: category.id,
        bio: randomFrom(bios),
        experienceYears: Math.floor(Math.random() * 10) + 1,
        rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 200),
        priceFrom: Math.floor(Math.random() * 4000) + 500,
        verified: Math.random() > 0.3,
        status: 'approved', // seeded providers are pre-approved
        location: `${randomFrom(cities)}, Pakistan`,
      },
    });

    // 1-3 services per provider
    const serviceCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < serviceCount; j++) {
      await prisma.service.create({
        data: {
          providerId: providerProfile.id,
          categoryId: category.id,
          title: `${category.name} Service ${j + 1}`,
          description: `Quality ${category.name.toLowerCase()} service.`,
          price: Math.floor(Math.random() * 4000) + 500,
          durationMins: 60,
        },
      });
    }
  }

  console.log('✅ Seed complete: 5 categories, 55 providers with services and avatar photos');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });