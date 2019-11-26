import { resolve } from 'path'
import { Config, invokeRule } from '@sketch-hq/sketch-lint-core'

import { ruleModule } from './'
import { ruleSet } from '../'

const { name } = ruleModule

const config: Config = {
  rules: {
    [name]: { active: true },
  },
}

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
        "context": Object {
          "objectId": "D1BE0048-A6FC-4A8F-8BC7-A46BE3925F18",
          "pointer": "/document/pages/0/layers/0",
        },
        "message": "Unexpected hidden layer",
        "ruleName": "layers-no-hidden",
        "ruleSetName": "@sketch-hq/sketch-lint-ruleset-core",
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
