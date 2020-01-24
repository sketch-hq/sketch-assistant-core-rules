import {
  Rule,
  RuleModule,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'
import FileFormat from '@sketch-hq/sketch-file-format-ts'
import { t } from '@lingui/macro'
import { _ } from '../i18n'

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
  const maxLayers = utils.getOption('maxLayers')
  if (typeof maxLayers !== 'number') return
  await utils.iterateCache({
    $groups(node): void {
      const group = utils.nodeToObject<FileFormat.AnyGroup>(node)
      if (group._class === 'shapeGroup') return // Skip counting layers in shapeGroups
      const numLayers = group.layers.length
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
    ]
  },
}

export { ruleModule }
