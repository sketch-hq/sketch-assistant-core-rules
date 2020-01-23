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
  await utils.iterateCache({
    group(node): void {
      const group = utils.nodeToObject<FileFormat.Group>(node)
      if (group.layers.length === 0) {
        utils.report({
          node,
          message: _(t`Unexpected empty group`),
        })
      }
    },
  })
}

const ruleModule: RuleModule = {
  rule,
  name: 'groups-no-empty',
  title: _(t`No Empty Groups`),
  description: _(t`Disallow empty groups, i.e. with no child layers`),
}

export { ruleModule }
