import { resolve } from 'path'
import { invokeRule } from '@sketch-hq/sketch-lint-core'

import { ruleModule } from '.'
import { ruleSet } from '..'

const { name } = ruleModule

test('Generates violations correctly', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/10-layers.sketch'),
    {
      rules: {
        [`${ruleSet.name}/${name}`]: { active: true, maxLayers: 9 },
      },
    },
    ruleSet,
    ruleModule,
  )
  expect(violations).toMatchInlineSnapshot(`
    Array [
      Object {
        "context": Object {
          "objectId": "9C2047B4-71D5-48C9-9DEE-34C0009FF5A9",
          "pointer": "/document/pages/0",
        },
        "message": "Expected 9 or less layers, found 10",
        "ruleName": "groups-max-layers",
        "ruleSetName": "@sketch-hq/sketch-lint-ruleset-core",
        "severity": 3,
      },
    ]
  `)
})

test('Does not generate false negatives', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/10-layers.sketch'),
    {
      rules: {
        [`${ruleSet.name}/${name}`]: { active: true, maxLayers: 10 },
      },
    },
    ruleSet,
    ruleModule,
  )
  expect(violations).toMatchInlineSnapshot(`Array []`)
})
