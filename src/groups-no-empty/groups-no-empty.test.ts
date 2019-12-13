import { resolve } from 'path'
import { invokeRule, createDummyConfig } from '@sketch-hq/sketch-lint-core'

import { ruleModule } from '.'
import { ruleSet } from '..'

test('Generates violations correctly', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/empty-group.sketch'),
    createDummyConfig({
      rules: {
        [ruleModule.name]: { active: true },
      },
    }),
    ruleSet,
    ruleModule,
  )
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected empty group",
    ]
  `)
})

test('Does not generate false negatives', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/empty.sketch'),
    createDummyConfig({
      rules: {
        [ruleModule.name]: { active: true },
      },
    }),
    ruleSet,
    ruleModule,
  )
  expect(violations).toHaveLength(0)
})
