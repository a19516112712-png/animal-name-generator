/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://animalnamegen.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/404"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
    ],
  },
  transform: async (config, path) => {
    let priority = config.priority;
    let changefreq = config.changefreq;
    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    } else if (path.startsWith("/animal/")) {
      priority = 0.9;
    }
    return { loc: path, changefreq, priority, lastmod: new Date().toISOString() };
  },
};
