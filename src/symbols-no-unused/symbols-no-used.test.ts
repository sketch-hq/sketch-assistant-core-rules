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
    resolve(__dirname, '../../fixtures/unused-symbol.sketch'),
    config,
    ruleSet,
    ruleModule,
  )
  expect(violations).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "Unexpected unused symbol",
        "objectId": "60445BBE-5020-4C88-B760-DC7B23328B2D",
        "pointer": "/document/pages/1/layers/0",
        "ruleModule": Object {
          "description": "Disallow symbols that have no corresponding usage anywhere in the document",
          "name": "symbols-no-unused",
          "title": "No Unused Symbols",
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
    resolve(__dirname, '../../fixtures/used-symbol.sketch'),
    config,
    ruleSet,
    ruleModule,
  )
  expect(violations).toHaveLength(0)
})
