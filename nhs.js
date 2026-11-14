// A page about a condition, a medicine or how to live well (/conditions/diabetes/) reads as its title (<h1>) and the
// paragraphs, headings, list items and table rows of its main part, without the date it was reviewed and the pages
// listed beside it, linking with weight 0.1 to each page it links to. An A to Z (/conditions/, /medicines/, one part
// deep) is a listing of each of its section's pages it lists.
function parseNHS(_profileId) {
  if (location.hostname !== 'www.nhs.uk') {
    return null
  }
  const section = /^\/([a-z-]+)\/$/.exec(location.pathname)?.[1]
  if (section) {
    return listingOf(linkUrls(`main a[href^="/${section}/"], main a[href^="https://www.nhs.uk/${section}/"]`)
      .map(url => url.split(/[?#]/)[0])
      .filter(url => new RegExp(`^/${section}/[^/]+/$`).test(new URL(url).pathname))) ?? { listing: true }
  }
  const article = document.querySelector('main')
  const title = article?.querySelector('h1')?.innerText.trim()
  const skip = 'h1, .nhsuk-review-date, .nhsuk-related-nav, .nhsuk-contents-list, .nhsuk-pagination, .nhsuk-back-link, [hidden]'
  const content = article ? textBlocks(article, { lists: true, tables: true, skip }) : []
  if (!title || !content.length) {
    return null
  }
  return { title, content, links: contentLinks(article, { skip }) }
}

// The parser a scrape calls.
registerParser(parseNHS)
