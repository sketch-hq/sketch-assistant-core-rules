import {
  buildRuleOptionSchema,
  numberOption,
  stringOption,
  integerOption,
  booleanOption,
  stringEnumOption,
  stringArrayOption,
  Rule,
  RuleModule,
} from '@sketch-hq/sketch-lint-core'

const optionSchema = buildRuleOptionSchema(
  numberOption({
    name: 'numberOption',
    title: 'Number Option',
    defaultValue: 1.5,
    description: 'A number option',
    minimum: 0,
    maximum: 100,
  }),
  integerOption({
    name: 'integerOption',
    title: 'Integer Option',
    defaultValue: 1,
    description: 'An integer option',
    minimum: 0,
    maximum: 100,
  }),
  stringOption({
    name: 'stringOption',
    title: 'String Option',
    description: 'A string option',
    pattern: '^[A-Za-z\\s]*$',
    defaultValue: 'Default value',
    minLength: 5,
    maxLength: 20,
  }),
  booleanOption({
    name: 'booleanOption',
    title: 'Boolean Option',
    description: 'A string option',
    defaultValue: true,
  }),
  stringEnumOption({
    name: 'stringEnumOption',
    title: 'String Enum Option',
    description: 'A string enum option',
    defaultValue: 'foo',
    values: ['foo', 'bar', 'baz'],
    valueTitles: ['Foo', 'Bar', 'Baz'],
  }),
  stringArrayOption({
    name: 'stringArrayOption',
    title: 'String Array Option',
    description: 'A string array option',
    defaultValue: ['foo'],
    pattern: '^[A-Za-z\\s]*$',
    minLength: 5,
    maxLength: 20,
  }),
)

const rule: Rule = (): void => {}

const ruleModule: RuleModule = {
  rule,
  name: 'debug-all-options',
  title: 'All options',
  description:
    'This rule exports examples of all available option schema types',
  optionSchema,
  debug: true,
}

export { ruleModule }
