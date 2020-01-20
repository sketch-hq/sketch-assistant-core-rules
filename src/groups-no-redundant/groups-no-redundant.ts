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
  await utils.walk({
    group(node): void {
      const group = utils.nodeToObject<FileFormat.Group>(node)
      const usesSharedStyle = typeof group.sharedStyleID === 'string'
      const isStyled =
        group.style && group.style.shadows && group.style.shadows.length > 0
      const hasOneChild = group.layers.length === 1
      const onlyChildIsGroup = hasOneChild && group.layers[0]._class === 'group'
      if (!usesSharedStyle && !isStyled && hasOneChild && onlyChildIsGroup) {
        utils.report({
          node,
          message: _(t`Unexpected redundant group`),
        })
      }
    },
  })
}

const ruleModule: RuleModule = {
  rule,
  name: 'groups-no-redundant',
  title: _(t`No Redundant Groups`),
  description: _(
    t`Disallows unstyled groups with only one child which is also a group`,
  ),
}

export { ruleModule }
