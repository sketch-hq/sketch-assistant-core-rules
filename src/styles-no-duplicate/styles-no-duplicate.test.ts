import { resolve } from 'path'
import {
  Config,
  invokeRule,
  createDummyConfig,
} from '@sketch-hq/sketch-lint-core'

import { ruleModule } from '.'
import { ruleSet } from '..'

const { name } = ruleModule

const config: Config = createDummyConfig({
  rules: {
    [name]: { active: true },
  },
})

test('Generates violations correctly', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/duplicate-styles.sketch'),
    config,
    ruleSet,
    ruleModule,
  )
  expect(violations).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "Unexpected duplicate style",
        "objectId": "DBB809DA-D807-47AC-A558-732705BD9674",
        "pointer": "/document/pages/0/layers/2",
        "ruleModule": Object {
          "description": "Enable this rule to disallow duplicate styles",
          "name": "styles-no-duplicate",
          "title": "No duplicate styles",
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
    resolve(__dirname, '../../fixtures/empty.sketch'),
    config,
    ruleSet,
    ruleModule,
  )
  expect(violations).toHaveLength(0)
})
