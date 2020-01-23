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
    $layers(node): void {
      const layer = utils.nodeToObject<FileFormat.AnyLayer>(node)
      if (layer.isVisible === false) {
        utils.report({
          node,
          message: _(t`Unexpected hidden layer`),
        })
      }
    },
  })
}

const ruleModule: RuleModule = {
  rule,
  name: 'layers-no-hidden',
  title: _(t`No Hidden Layers`),
  description: _(t`Disallow layers visually hidden in the layers list UI`),
}

export { ruleModule }
