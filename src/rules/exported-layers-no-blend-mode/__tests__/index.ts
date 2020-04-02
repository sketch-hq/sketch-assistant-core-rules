import { testRule } from '../../../test-helpers'

describe('exported-layers-no-blend-mode', () => {
  test('no violations for exported layers without blend modes', async (): Promise<void> => {
    expect.assertions(2)
    const { violations, errors } = await testRule(
      __dirname,
      './exported-layer.sketch',
      'exported-layers-no-blend-mode',
    )
    expect(violations).toHaveLength(0)
    expect(errors).toHaveLength(0)
  })

  test('finds violations for exported layers with blend modes', async (): Promise<void> => {
    expect.assertions(2)
    const { violations, errors } = await testRule(
      __dirname,
      './blended-exported-layer.sketch',
      'exported-layers-no-blend-mode',
    )
    expect(violations).toHaveLength(1)
    expect(errors).toHaveLength(0)
  })
})
