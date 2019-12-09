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
  expect(violations).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "Unexpected layer name \\"PageOne\\"",
        "objectId": "4BF05675-220F-49DC-BE27-5802D5C9C914",
        "pointer": "/document/pages/0",
        "ruleModule": Object {
          "description": "Enable this rule to enforce a naming pattern for layers",
          "name": "layer-names-pattern-allowed",
          "title": "Allowed layer names",
        },
        "ruleSet": Object {
          "description": "The core sketch-lint ruleset",
          "name": "@sketch-hq/sketch-lint-ruleset-core",
          "title": "Sketch Core",
        },
        "severity": 3,
      },
      Object {
        "message": "Unexpected layer name \\"LayerTwo\\"",
        "objectId": "9FF2E54F-C524-4EED-9C5A-7C1383FC0D24",
        "pointer": "/document/pages/0/layers/0",
        "ruleModule": Object {
          "description": "Enable this rule to enforce a naming pattern for layers",
          "name": "layer-names-pattern-allowed",
          "title": "Allowed layer names",
        },
        "ruleSet": Object {
          "description": "The core sketch-lint ruleset",
          "name": "@sketch-hq/sketch-lint-ruleset-core",
          "title": "Sketch Core",
        },
        "severity": 3,
      },
      Object {
        "message": "Unexpected layer name \\"LayerOne\\"",
        "objectId": "F0143962-96D9-49F6-8797-EC6AB0033A01",
        "pointer": "/document/pages/0/layers/1",
        "ruleModule": Object {
          "description": "Enable this rule to enforce a naming pattern for layers",
          "name": "layer-names-pattern-allowed",
          "title": "Allowed layer names",
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
