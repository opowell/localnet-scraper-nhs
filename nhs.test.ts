import { afterEach, describe, expect, it } from 'vitest'
import { parserLoader, resetPage, visit } from '#scraper-test'

// The parser, evaluated with the helpers it is injected with, as a scrape runs it.
const load = parserLoader(__dirname)

afterEach(resetPage)

describe('reference sites', () => {
  it('reads an NHS page from its heading on, and an A to Z as a listing of its section\'s pages', () => {
    const { parseNHS } = load('nhs.js', ['parseNHS'])
    visit('https://www.nhs.uk/conditions/diabetes/', `<main><h1>Diabetes</h1><p>A condition.</p><article>
      <table><tr><th>Type</th><th>Who</th></tr><tr><td>Type 1</td><td>Children</td></tr></table></article></main>`)
    expect(parseNHS().content).toEqual(['A condition.', 'Type · Who', 'Type 1 · Children'])
    visit('https://www.nhs.uk/conditions/', '<main><a href="/conditions/acne/">Acne</a><a href="/conditions/">All</a><a href="/medicines/x/">X</a></main>')
    expect(parseNHS().links).toEqual([{ url: 'https://www.nhs.uk/conditions/acne/', score: 1 }])
  })
})
