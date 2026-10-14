import React from 'react'
import { render } from '@testing-library/react'
import { HeroGeometric } from '../HeroGeometric'

describe('HeroGeometric', () => {
  it('renders the five code lines without a pulse animation', () => {
    const { container } = render(<HeroGeometric />)
    const text = container.textContent ?? ''

    expect(text).toContain('from rest_framework.decorators import api_view')
    expect(text).toContain('from rest_framework.response import Response')
    expect(text).toContain('@api_view(["GET"])')
    expect(text).toContain('def health(request):')
    expect(text).toContain('return Response({"ok": True})  # IAM')

    expect(container.innerHTML).not.toContain('animate-pulse')
    expect(container.querySelector('.hero-caret')).toBeTruthy()
  })
})
