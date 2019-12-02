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
  expect(violations).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "Expected 9 or less layers, found 10",
        "objectId": "9C2047B4-71D5-48C9-9DEE-34C0009FF5A9",
        "pointer": "/document/pages/0",
        "ruleModule": Object {
          "description": "Enable this rule to restrict layers to a maximum number of groups",
          "name": "groups-max-layers",
          "title": "Maximum layers in a group",
        },
        "ruleSet": Object {
          "description": "The core sketch-lint ruleset",
          "name": "@sketch-hq/sketch-lint-ruleset-core",
          "title": "Sketch Core",
        },
        "severity": 3,
      },
    ]
  `)
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
