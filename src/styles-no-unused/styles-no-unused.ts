import {
  Rule,
  RuleModule,
  Node,
  ReportItem,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'
import FileFormat from '@sketch-hq/sketch-file-format-ts'
import { t } from '@lingui/macro'
import { _ } from '../i18n'

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context

  const sharedStyles: Node<FileFormat.SharedStyle>[] = []
  const usages: Set<string> = new Set()

  await utils.iterateCache({
    sharedStyle(node) {
      sharedStyles.push(node as Node<FileFormat.SharedStyle>)
    },
    $layers(node) {
      const obj = utils.nodeToObject(node)
      if ('sharedStyleID' in obj && typeof obj.sharedStyleID === 'string') {
        usages.add(obj.sharedStyleID)
      }
    },
  })

  const invalid: Node[] = sharedStyles.filter(
    node => !usages.has(node.do_objectID),
  )

  utils.report(
    invalid.map(
      (node): ReportItem => ({
        message: _(t`Unexpected unused shared style`),
        node,
      }),
    ),
  )
}

const ruleModule: RuleModule = {
  rule,
  name: 'styles-no-unused',
  title: _(t`No Unused Shared Style`),
  description: _(t`Disallow unused shared styles`),
}

export { ruleModule }
