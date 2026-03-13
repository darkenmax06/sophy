import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@sophymusic.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { password: hash },
    create: {
      email,
      password: hash,
      name: 'Admin',
    },
  });

  console.log(`Admin user created/updated: ${email}`);

  // Create default categories
  const categories = [
    { slug: 'music-distribution', names: { es: 'Distribución Musical', en: 'Music Distribution', fr: 'Distribution Musicale', pt: 'Distribuição Musical' } },
    { slug: 'artist-tips', names: { es: 'Tips para Artistas', en: 'Artist Tips', fr: "Conseils d'Artistes", pt: 'Dicas para Artistas' } },
    { slug: 'industry-news', names: { es: 'Noticias de la Industria', en: 'Industry News', fr: "Nouvelles de l'Industrie", pt: 'Notícias da Indústria' } },
    { slug: 'marketing', names: { es: 'Marketing Musical', en: 'Music Marketing', fr: 'Marketing Musical', pt: 'Marketing Musical' } },
  ];

  for (const cat of categories) {
    const existing = await prisma.blogCategory.findUnique({ where: { slug: cat.slug } });
    if (!existing) {
      const created = await prisma.blogCategory.create({
        data: { slug: cat.slug },
      });
      for (const [lang, name] of Object.entries(cat.names)) {
        await prisma.blogCategoryTranslation.create({
          data: { categoryId: created.id, lang, name },
        });
      }
      console.log(`Category created: ${cat.slug}`);
    }
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
