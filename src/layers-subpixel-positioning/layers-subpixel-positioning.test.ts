import { resolve } from 'path'
import { invokeRule, createDummyConfig } from '@sketch-hq/sketch-lint-core'

import { ruleModule } from '.'
import { ruleSet } from '..'

const { name } = ruleModule

test('Generates violations correctly', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/subpixel-positioning.sketch'),
    createDummyConfig({
      rules: {
        [name]: { active: true, scaleFactors: ['@1x'] },
      },
    }),
    ruleSet,
    ruleModule,
  )
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected subpixel positioning (0.5,200)",
      "Unexpected subpixel positioning (200,0.33)",
    ]
  `)
})

test('Generates violations correctly', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/subpixel-positioning.sketch'),
    createDummyConfig({
      rules: {
        [name]: { active: true, scaleFactors: ['@1x', '@2x'] },
      },
    }),
    ruleSet,
    ruleModule,
  )
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected subpixel positioning (200,0.33)",
    ]
  `)
})

test('Generates violations correctly', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await invokeRule(
    resolve(__dirname, '../../fixtures/subpixel-positioning.sketch'),
    createDummyConfig({
      rules: {
        [name]: { active: true, scaleFactors: ['@1x', '@2x', '@3x'] },
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
    resolve(__dirname, '../../fixtures/empty.sketch'),
    createDummyConfig({
      rules: {
        [name]: { active: true, scaleFactors: ['@1x'] },
      },
    }),
    ruleSet,
    ruleModule,
  )
  expect(violations).toHaveLength(0)
})
