import { t } from '@lingui/macro'
import { RuleContext, RuleFunction, Node } from '@sketch-hq/sketch-assistant-utils'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

import { CreateRuleFunction } from '../..'

export const createRule: CreateRuleFunction = i18n => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { utils } = context
    const masters: Node[] = []
    const instances: Node[] = []
    await utils.iterateCache({
      async symbolMaster(node): Promise<void> {
        masters.push(node)
      },
      async symbolInstance(node): Promise<void> {
        instances.push(node)
      },
    })
    const invalid: Node[] = masters.filter(
      master =>
        instances.findIndex(
          instance =>
            utils.nodeToObject<FileFormat.SymbolInstance>(instance).symbolID ===
            utils.nodeToObject<FileFormat.SymbolMaster>(master).symbolID,
        ) === -1,
    )
    utils.report(
      invalid.map(node => ({
        message: i18n._(t`Unexpected unused symbol`),
        node,
      })),
    )
  }

  return {
    rule,
    name: 'symbols-no-unused',
    title: i18n._(t`No Unused Symbols`),
    description: i18n._(
      t`Disallow symbols that have no corresponding usage anywhere in the document`,
    ),
  }
}
