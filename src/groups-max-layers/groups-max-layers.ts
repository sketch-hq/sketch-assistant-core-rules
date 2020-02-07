import {
  Rule,
  RuleModule,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'
import FileFormat from '@sketch-hq/sketch-file-format-ts'
import { t } from '@lingui/macro'
import { _ } from '../i18n'

function assertMaxLayers(maxLayers: unknown): asserts maxLayers is number {
  if (typeof maxLayers !== 'number') throw new Error()
}

function assertSkipClasses(
  skipClasses: unknown,
): asserts skipClasses is string[] {
  if (!Array.isArray(skipClasses)) throw new Error()
  for (const el of skipClasses) {
    if (typeof el !== 'string') throw new Error()
  }
}

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context

  const maxLayers = utils.getOption('maxLayers')
  const skipClasses = utils.getOption('skipClasses')
  assertMaxLayers(maxLayers)
  assertSkipClasses(skipClasses)

  await utils.iterateCache({
    $groups(node): void {
      const group = utils.nodeToObject<FileFormat.AnyGroup>(node)
      if (group._class === 'shapeGroup') return // Do not consider shape groups, its common/expected for these to have many layers
      const numLayers = group.layers.filter(
        layer => !skipClasses.includes(layer._class),
      ).length
      if (numLayers > maxLayers) {
        utils.report({
          node,
          message: _(
            t`Expected ${maxLayers} or less layers on group, found ${numLayers}`,
          ),
        })
      }
    },
  })
}

const ruleModule: RuleModule = {
  rule,
  name: 'groups-max-layers',
  title: _(t`Max Group Layers`),
  description: _(t`Restrict groups to a maximum number of child layers`),
  getOptions(helpers) {
    return [
      helpers.numberOption({
        name: 'maxLayers',
        title: _(t`Maximum Layers`),
        defaultValue: 50,
        description: _(t`Maximum layers in a group`),
        minimum: 1,
      }),
      helpers.stringArrayOption({
        name: 'skipClasses',
        title: _(t`Skip Classes`),
        description: _(
          t`An array of Sketch file class values for layers that should be skipped and not counted when calculating the number of child layers in a group`,
        ),
      }),
    ]
  },
}

export { ruleModule }
