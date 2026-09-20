# Search and AI discovery

The README begins with a direct definition, runnable setup and links to all 50 folders. Every demo has a unique title, description, static H1, visible source links, plain-language task explanation, limitations and adjacent-demo navigation. Content is readable before JavaScript runs.

The site emits CollectionPage / ItemList schema for the gallery and TechArticle schema for each demo. `llms.txt` links the full collection and methodology. Open Graph titles and descriptions are present. Metadata describes the actual visible content and makes no invented benchmark or ranking claims.

To generate canonical URLs and a sitemap for a real hosting destination:

```bash
SITE_URL=https://your-real-domain.example/demos/ npm run build
```

Replace the example with your actual public base URL, including a repository subpath if needed. Publish the resulting `dist/` directory using your static host. It contains preview assets only, never the server, keys or provider adapter. Live API comparisons remain local with `npm start`.

Without `SITE_URL`, the build deliberately omits canonical URLs and a sitemap; it does not invent a deployed domain. `robots.txt` permits crawlers. `llms.txt` is a discovery aid, not a standardized promise of inclusion in AI answers. This repository does not guarantee indexing, rich results or ranking improvements.
