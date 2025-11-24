#!/usr/bin/env node

/**
 * Generate sitemap.xml for SEO
 */

const fs = require('fs');
const path = require('path');

const baseURL = 'https://mahdiarts.ir';
const publicDir = path.join(__dirname, '../public');

const articles = [
  { loc: '/articles/uiux.html', priority: '1.0', changefreq: 'monthly' },
  { loc: '/articles/seo-performance.html', priority: '1.0', changefreq: 'monthly' },
  { loc: '/articles/security-stability.html', priority: '1.0', changefreq: 'monthly' },
  { loc: '/articles/responsive-web.html', priority: '1.0', changefreq: 'monthly' },
  { loc: '/articles/android-native.html', priority: '1.0', changefreq: 'monthly' },
  { loc: '/articles/support-maintenance.html', priority: '1.0', changefreq: 'monthly' }
];

const generateSitemap = () => {
  const lastmod = new Date().toISOString().split('T')[0];
  
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Homepage
  sitemap += '  <url>\n';
  sitemap += `    <loc>${baseURL}/</loc>\n`;
  sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
  sitemap += '    <priority>1.0</priority>\n';
  sitemap += '    <changefreq>weekly</changefreq>\n';
  sitemap += '  </url>\n';
  
  // Articles
  articles.forEach(article => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseURL}${article.loc}</loc>\n`;
    sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
    sitemap += `    <priority>${article.priority}</priority>\n`;
    sitemap += `    <changefreq>${article.changefreq}</changefreq>\n`;
    sitemap += '  </url>\n';
  });
  
  sitemap += '</urlset>';
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap generated successfully!');
  
  // Generate robots.txt
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${baseURL}/sitemap.xml`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
  console.log('✅ robots.txt generated successfully!');
};

try {
  generateSitemap();
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}