import { resolve } from 'path'
import { invokeRule, createDummyConfig } from '@sketch-hq/sketch-lint-core'

import { ruleModule } from '.'
import { ruleSet } from '..'

const { name } = ruleModule

test('Generates violations correctly', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/10-layers.sketch'),
    createDummyConfig({
      rules: {
        [`${ruleSet.name}/${name}`]: { active: true, maxLayers: 9 },
      },
    }),
    ruleSet,
    ruleModule,
  )
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Expected 9 or less layers on group, found 10",
    ]
  `)
})

test('Skips shape groups', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/10-layer-shape-group.sketch'),
    createDummyConfig({
      rules: {
        [`${ruleSet.name}/${name}`]: { active: true, maxLayers: 9 },
      },
    }),
    ruleSet,
    ruleModule,
  )
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('Does not generate false negatives', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/10-layers.sketch'),
    createDummyConfig({
      rules: {
        [`${ruleSet.name}/${name}`]: { active: true, maxLayers: 10 },
      },
    }),
    ruleSet,
    ruleModule,
  )
  expect(violations).toMatchInlineSnapshot(`Array []`)
})
