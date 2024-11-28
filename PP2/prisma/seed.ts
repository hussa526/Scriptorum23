import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const user = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john.doe@example.com',
      password: 'securepassword', // In real apps, hash the password
      role: 'user',
      avatar: 'avatar.png',
    },
  });

  // Create tags
  const tag = await prisma.tags.create({
    data: { tag: 'Technology' },
  });

  // Create a blog post
  const blogpost = await prisma.blogpost.create({
    data: {
      title: 'Introduction to Prisma',
      content: 'Prisma makes working with databases easy.',
      userId: user.id,
      tags: { connect: [{ id: tag.id }] },
    },
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });