import { t } from '@lingui/macro'
import { RuleContext, RuleFunction, FileFormat, Node } from '@sketch-hq/sketch-assistant-utils'
import { CreateRuleFunction } from '../..'

export const createRule: CreateRuleFunction = i18n => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { utils } = context

    const sharedStyles: Node<FileFormat.SharedStyle>[] = []
    const usages: Set<string> = new Set()

    await utils.iterateCache({
      async sharedStyle(node) {
        sharedStyles.push(node as Node<FileFormat.SharedStyle>)
      },
      async $layers(node) {
        const obj = utils.nodeToObject(node)
        if ('sharedStyleID' in obj && typeof obj.sharedStyleID === 'string') {
          usages.add(obj.sharedStyleID)
        }
      },
    })

    const invalid: Node[] = sharedStyles.filter(node => !usages.has(node.do_objectID))

    utils.report(
      invalid.map(node => ({
        message: i18n._(t`Unexpected unused shared style`),
        node,
      })),
    )
  }

  return {
    rule,
    name: 'shared-styles-no-unused',
    title: i18n._(t`No Unused Shared Style`),
    description: i18n._(t`Disallow unused shared styles`),
  }
}