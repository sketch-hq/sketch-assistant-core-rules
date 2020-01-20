import { Rule, RuleModule } from '@sketch-hq/sketch-lint-core'
import { t } from '@lingui/macro'
import { _ } from '../i18n'

const rule: Rule = (): void => {}

const ruleModule: RuleModule = {
  rule,
  name: 'debug-all-options',
  title: _(t`All Options`),
  description: _(
    t`Internal debug rule that defines examples of all available option schema types`,
  ),
  getOptions(helpers) {
    return [
      helpers.numberOption({
        name: 'numberOption',
        title: _(t`Number Option`),
        defaultValue: 1.5,
        description: _(t`A number option`),
        minimum: 0,
        maximum: 100,
      }),
      helpers.integerOption({
        name: 'integerOption',
        title: _(t`Integer Option`),
        defaultValue: 1,
        description: _(t`An integer option`),
        minimum: 0,
        maximum: 100,
      }),
      helpers.stringOption({
        name: 'stringOption',
        title: _(t`String Option`),
        description: _(t`A string option`),
        pattern: '^[A-Za-z\\s]*$',
        defaultValue: _(t`Default value`),
        minLength: 5,
        maxLength: 20,
      }),
      helpers.booleanOption({
        name: 'booleanOption',
        title: _(t`Boolean Option`),
        description: _(t`A boolean option`),
        defaultValue: true,
      }),
      helpers.stringEnumOption({
        name: 'stringEnumOption',
        title: _(t`String Enum Option`),
        description: _(t`A string enum option`),
        defaultValue: 'foo',
        values: ['foo', 'bar', 'baz'],
        valueTitles: ['Foo', 'Bar', 'Baz'],
      }),
      helpers.stringArrayOption({
        name: 'stringArrayOption',
        title: _(t`String Array Option`),
        description: _(t`A string array option`),
        defaultValue: ['foo'],
        pattern: '^[A-Za-z\\s]*$',
        minLength: 5,
        maxLength: 20,
      }),
      helpers.objectArrayOption({
        name: 'objectArrayOption',
        title: _(t`Object Array Option`),
        description: _(t`A object array option`),
        props: [
          helpers.numberOption({
            name: 'objectArrayNumberOption',
            title: _(t`Object Array Number Option`),
            description: _(t`A object array number option`),
          }),
        ],
      }),
    ]
  },
  debug: true,
}

export { ruleModule }
