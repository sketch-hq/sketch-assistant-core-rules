import { resolve } from 'path'
import { invokeRule, createDummyConfig } from '@sketch-hq/sketch-lint-core'

import { ruleModule } from '.'
import { ruleSet } from '..'

const { name } = ruleModule

const kebabCase = '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$'
const pascalCase = '^[A-Z][a-zA-Z0-9]+$'

test('Generates violations correctly', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/pascal-case-layer-names.sketch'),
    createDummyConfig({
      rules: {
        [name]: { active: true, patterns: [kebabCase] },
      },
    }),
    ruleSet,
    ruleModule,
  )
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected layer name \\"PageOne\\", does not match one of the allowable patterns",
      "Unexpected layer name \\"LayerTwo\\", does not match one of the allowable patterns",
      "Unexpected layer name \\"LayerOne\\", does not match one of the allowable patterns",
    ]
  `)
})

test('Does not generate false negatives', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/pascal-case-layer-names.sketch'),
    createDummyConfig({
      rules: {
        [name]: { active: true, patterns: [pascalCase, kebabCase] },
      },
    }),
    ruleSet,
    ruleModule,
  )
  expect(violations).toHaveLength(0)
})
