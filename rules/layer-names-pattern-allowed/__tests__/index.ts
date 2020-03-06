import { testRule } from '../../../test-helpers'

describe('layer-names-pattern-allowed', () => {
  test('no violations when all layer names are whitelisted', async (): Promise<void> => {
    expect.assertions(2)
    const { violations, errors } = await testRule(
      __dirname,
      './layer-names.sketch',
      'layer-names-pattern-allowed',
      {
        active: true,
        patterns: ['Page 1', 'Artboard', 'Group', 'Type something', 'Oval', 'Rectangle'],
      },
    )
    expect(violations).toHaveLength(0)
    expect(errors).toHaveLength(0)
  })

  test('finds violations when layer names are not whitelisted', async (): Promise<void> => {
    expect.assertions(2)
    const { violations, errors } = await testRule(
      __dirname,
      './layer-names.sketch',
      'layer-names-pattern-allowed',
      {
        active: true,
        patterns: [],
      },
    )
    expect(violations.length).toBe(6)
    expect(errors).toHaveLength(0)
  })
})
