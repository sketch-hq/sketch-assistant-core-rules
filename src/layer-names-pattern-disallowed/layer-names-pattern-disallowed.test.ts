import { resolve } from 'path'
import { invokeRule, createDummyConfig } from '@sketch-hq/sketch-lint-core'

import { ruleModule } from '.'
import { ruleSet } from '..'

test('Generates violations correctly', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/default-layer-names.sketch'),
    createDummyConfig({
      rules: {
        [ruleModule.name]: {
          active: true,
          patterns: ['^Type something$', '^Rectangle$'],
        },
      },
    }),
    ruleSet,
    ruleModule,
  )
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected layer name 'Rectangle'",
      "Unexpected layer name 'Type something'",
    ]
  `)
})
