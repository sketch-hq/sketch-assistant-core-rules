import { t } from '@lingui/macro'
import { RuleContext, RuleFunction, FileFormat } from '@sketch-hq/sketch-assistant-types'

import { CreateRuleFunction } from '../..'

function assertMaxLayers(maxLayers: unknown): asserts maxLayers is number {
  if (typeof maxLayers !== 'number') throw new Error()
}

function assertSkipClasses(skipClasses: unknown): asserts skipClasses is string[] {
  if (!Array.isArray(skipClasses)) throw new Error()
  for (const el of skipClasses) {
    if (typeof el !== 'string') throw new Error()
  }
}

export const createRule: CreateRuleFunction = i18n => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { utils } = context

    const maxLayers = utils.getOption('maxLayers')
    const skipClasses = utils.getOption('skipClasses')

    assertMaxLayers(maxLayers)
    assertSkipClasses(skipClasses)

    await utils.iterateCache({
      async $groups(node): Promise<void> {
        const group = utils.nodeToObject<FileFormat.AnyGroup>(node)
        if (group._class === 'shapeGroup') return // Do not consider shape groups, its common/expected for these to have many layers
        const numLayers = group.layers.filter(layer => !skipClasses.includes(layer._class)).length
        if (numLayers > maxLayers) {
          utils.report({
            node,
            message: i18n._(t`Expected ${maxLayers} or less layers on group, found ${numLayers}`),
          })
        }
      },
    })
  }

  return {
    rule,
    name: 'groups-max-layers',
    title: i18n._(t`Max Group Layers`),
    description: i18n._(t`Restrict groups to a maximum number of child layers`),
    getOptions(helpers) {
      return [
        helpers.numberOption({
          name: 'maxLayers',
          title: i18n._(t`Maximum Layers`),
          defaultValue: 50,
          description: i18n._(t`Maximum layers in a group`),
          minimum: 1,
        }),
        helpers.stringArrayOption({
          name: 'skipClasses',
          title: i18n._(t`Skip Classes`),
          description: i18n._(
            t`An array of Sketch file class values for layers that should be skipped and not counted when calculating the number of child layers in a group`,
          ),
        }),
      ]
    },
  }
}
