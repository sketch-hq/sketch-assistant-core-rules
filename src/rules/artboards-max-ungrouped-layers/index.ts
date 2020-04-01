import { t } from '@lingui/macro'
import { RuleContext, RuleFunction, FileFormat } from '@sketch-hq/sketch-assistant-types'

import { CreateRuleFunction } from '../..'

function assertMaxUngrouped(maxUngrouped: unknown): asserts maxUngrouped is number {
  if (typeof maxUngrouped !== 'number') throw Error()
}

export const createRule: CreateRuleFunction = (i18n) => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { utils } = context
    const maxUngrouped = utils.getOption('maxUngrouped')
    assertMaxUngrouped(maxUngrouped)
    await utils.iterateCache({
      async artboard(node): Promise<void> {
        const artboard = utils.nodeToObject<FileFormat.Artboard>(node)
        const nonGroupLayers = artboard.layers.filter((layer) => layer._class !== 'group').length
        if (nonGroupLayers > maxUngrouped) {
          utils.report({
            node,
            message: i18n._(
              t`Found ${nonGroupLayers} ungrouped layers at top level of artboard, expected at most ${maxUngrouped}`,
            ),
          })
        }
      },
    })
  }

  return {
    rule,
    name: 'artboards-max-ungrouped-layers',
    title: i18n._(t`Max Ungrouped Layers in Artboards`),
    description: i18n._(
      t`Specifies a maximum number of ungrouped layers allowable at the top-level of artboards`,
    ),
    getOptions(helpers) {
      return [
        helpers.numberOption({
          name: 'maxUngrouped',
          title: i18n._(t`Maximum Ungrouped Layers`),
          defaultValue: 5,
          description: i18n._(t`Maximum number of ungrouped layers`),
          minimum: 1,
        }),
      ]
    },
  }
}
