import { testRule } from '../../../test-helpers'

describe('layer-names-pattern-disallowed', () => {
  test('no violations when no layer names are blacklisted', async (): Promise<void> => {
    expect.assertions(2)
    const { violations, errors } = await testRule(
      __dirname,
      './layer-names.sketch',
      'layer-names-pattern-disallowed',
      {
        active: true,
        patterns: [],
      },
    )
    expect(violations).toHaveLength(0)
    expect(errors).toHaveLength(0)
  })

  test('finds violations for blacklisted layer names', async (): Promise<void> => {
    expect.assertions(2)
    const { violations, errors } = await testRule(
      __dirname,
      './layer-names.sketch',
      'layer-names-pattern-disallowed',
      {
        active: true,
        patterns: ['Artboard'],
      },
    )
    expect(violations).toHaveLength(1)
    expect(errors).toHaveLength(0)
  })
})
