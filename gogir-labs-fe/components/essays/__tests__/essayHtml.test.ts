import { enhanceEssayHtml, markerKeywordForHeading, slugifyHeading } from '../essayHtml'

describe('essayHtml', () => {
  it('slugifies headings', () => {
    expect(slugifyHeading('The Problem')).toBe('the-problem')
  })

  it('uses short marker keywords instead of echoing the full heading', () => {
    expect(markerKeywordForHeading('The principles that shaped the design')).toBe('principles')
    expect(markerKeywordForHeading('Appendix: technical report')).toBe('appendix')
    expect(
      markerKeywordForHeading("The technical half is provable. The human half isn't yet.")
    ).toBe('thesis')
  })

  it('strips a duplicated body byline that matches EssayPost chrome', () => {
    const { html } = enhanceEssayHtml(
      '<p><i>By gogira-station_chief · October 2026 · Tags: Django · About 10 minutes to read</i></p><p>Body</p><h2>How it works</h2>'
    )
    expect(html).not.toMatch(/By gogira-station_chief/i)
    expect(html).toContain('Body')
    expect(html).toContain('0x01 // architecture')
  })

  it('adds markers, ids, and wraps wide architecture images', () => {
    const { html, headings } = enhanceEssayHtml(
      [
        '<h2>The principles that shaped the design</h2><p>Intro</p>',
        '<h2>How it works</h2>',
        '<img src="/media/blog/essays/tr_bot/architecture.png" width="5835" alt="architecture diagram" />',
        '<details><summary>Appendix</summary><p>Notes</p></details>',
      ].join('')
    )

    expect(headings).toHaveLength(2)
    expect(headings[0].id).toBe('the-principles-that-shaped-the-design')
    expect(html).toContain('data-essay-marker')
    expect(html).toContain('0x01 // principles')
    expect(html).toContain('0x02 // architecture')
    expect(html).not.toContain('0x01 // the principles that shaped the design')
    expect(html).toContain('essay-figure-wide')
    expect(html).toContain('essay-img')
    expect(html).toContain('<details>')
    expect(html).toContain('<summary>')
  })
})
