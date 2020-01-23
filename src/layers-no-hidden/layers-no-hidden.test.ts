import { resolve } from 'path'
import {
  Config,
  invokeRule,
  createDummyConfig,
} from '@sketch-hq/sketch-lint-core'

import { ruleModule } from './'
import { ruleSet } from '../'

const { name } = ruleModule

const config: Config = createDummyConfig({
  rules: {
    [name]: { active: true },
  },
})

test('Generates violations correctly', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/hidden-layer.sketch'),
    config,
    ruleSet,
    ruleModule,
  )
  expect(violations).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "Unexpected hidden layer",
        "objectId": "D1BE0048-A6FC-4A8F-8BC7-A46BE3925F18",
        "pointer": "/document/pages/0/layers/0",
        "ruleModule": Object {
          "description": "Disallow layers visually hidden in the layers list UI",
          "name": "layers-no-hidden",
          "title": "No Hidden Layers",
        },
        "ruleSet": Object {
          "description": "The core sketch-lint ruleset",
          "name": "@sketch-hq/sketch-lint-ruleset-core",
          "title": "Core Ruleset",
        },
        "severity": 3,
      },
    ]
  `)
})

test('Does not generate false negatives', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/empty.sketch'),
    config,
    ruleSet,
    ruleModule,
  )
  expect(violations).toMatchInlineSnapshot(`Array []`)
})
