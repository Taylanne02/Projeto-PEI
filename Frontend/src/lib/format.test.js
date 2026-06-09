import { describe, expect, it } from 'vitest'

import { formatSales } from './format'

describe('formatSales', () => {
  it('usa singular para uma venda', () => {
    expect(formatSales(1)).toBe('1 venda')
  })

  it('usa plural para zero ou várias vendas', () => {
    expect(formatSales(0)).toBe('0 vendas')
    expect(formatSales(3)).toBe('3 vendas')
  })
})
