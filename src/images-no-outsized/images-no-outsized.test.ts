import { resolve } from 'path'
import { invokeRule, createDummyConfig } from '@sketch-hq/sketch-lint-core'

import { ruleModule } from './'
import { ruleSet } from '../'

const { name } = ruleModule

const config = createDummyConfig({
  rules: {
    [`${ruleSet.name}/${name}`]: { active: true, maxRatio: 2 },
  },
})

test('Generates violations correctly', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/outsized-image.sketch'),
    config,
    ruleSet,
    ruleModule,
  )
  expect(violations).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "Unexpected x2 oversized image",
        "objectId": "64BBDE2F-D786-4078-B332-97D777E9D07B",
        "pointer": "/document/pages/0/layers/0",
        "ruleModule": Object {
          "description": "Enable this rule to disallow images that are larger than their frame",
          "name": "images-no-outsized",
          "title": "No outsized images",
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

test('Skip images used correctly elsewhere', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/multiuse-outsized-image.sketch'),
    config,
    ruleSet,
    ruleModule,
  )
  expect(violations).toHaveLength(0)
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
