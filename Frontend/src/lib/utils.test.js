import { describe, expect, it } from 'vitest'

import { cn } from './utils'

describe('cn', () => {
  it('combina classes e resolve conflitos do Tailwind', () => {
    expect(cn('px-2', 'px-4', { hidden: false, block: true })).toBe(
      'px-4 block',
    )
  })
})
