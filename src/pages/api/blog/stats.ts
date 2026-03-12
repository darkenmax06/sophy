import type { APIRoute } from 'astro';
import prisma from '../../../lib/prisma';
import { isAuthenticated } from '../../../lib/auth';

export const GET: APIRoute = async ({ request, url }) => {
  const user = isAuthenticated(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  const days = parseInt(url.searchParams.get('days') || '30');
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [
    totalPageVisits,
    totalBlogVisits,
    blogVisitsByPost,
    recentPageVisits,
    recentBlogVisits,
    totalSubscribers,
    totalPosts,
    publishedPosts,
  ] = await Promise.all([
    prisma.pageVisit.count({ where: { createdAt: { gte: since } } }),
    prisma.blogVisit.count({ where: { createdAt: { gte: since } } }),
    prisma.blogVisit.groupBy({
      by: ['postId'],
      _count: { id: true },
      where: { createdAt: { gte: since } },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
    // Daily page visits
    prisma.$queryRaw`
      SELECT DATE(\"createdAt\") as date, COUNT(*)::int as count
      FROM "PageVisit"
      WHERE "createdAt" >= ${since}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    ` as Promise<{ date: string; count: number }[]>,
    // Daily blog visits
    prisma.$queryRaw`
      SELECT DATE(\"createdAt\") as date, COUNT(*)::int as count
      FROM "BlogVisit"
      WHERE "createdAt" >= ${since}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    ` as Promise<{ date: string; count: number }[]>,
    prisma.blogSubscriber.count({ where: { unsubscribedAt: null } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
  ]);

  // Resolve post titles for top posts
  const postIds = blogVisitsByPost.map((v) => v.postId);
  const posts = await prisma.blogPost.findMany({
    where: { id: { in: postIds } },
    include: { translations: { where: { lang: 'es' } } },
  });
  const postMap = new Map(posts.map((p) => [p.id, p]));

  const topPosts = blogVisitsByPost.map((v) => ({
    postId: v.postId,
    visits: v._count.id,
    title: postMap.get(v.postId)?.translations[0]?.title || 'Sin título',
    slug: postMap.get(v.postId)?.slug || '',
  }));

  return new Response(
    JSON.stringify({
      totalPageVisits,
      totalBlogVisits,
      topPosts,
      recentPageVisits,
      recentBlogVisits,
      totalSubscribers,
      totalPosts,
      publishedPosts,
      period: days,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
