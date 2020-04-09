import { t } from '@lingui/macro'
import { RuleContext, RuleFunction } from '@sketch-hq/sketch-assistant-types'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

import { CreateRuleFunction } from '../..'

type SharedStyle = FileFormat.SharedStyle
type Style = FileFormat.Style
type HashableStyle =
  | (Partial<
      Pick<Style, 'borders' | 'borderOptions' | 'blur' | 'fills' | 'shadows' | 'innerShadows'>
    > & { textStyle: string | null })
  | Partial<FileFormat.TextStyle>

// Helper function that creates a hash from a set of attributes of a Style
// object.
const styleHash = (hashFunction: (o: HashableStyle) => string, style: Partial<Style>) =>
  hashFunction({
    borders: style?.borders,
    borderOptions: style?.borderOptions,
    blur: style?.blur,
    fills: style?.fills,
    shadows: style?.shadows,
    innerShadows: style?.innerShadows,
    textStyle: style.textStyle ? hashFunction(style?.textStyle) : null,
  })

export const createRule: CreateRuleFunction = (i18n) => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { utils } = context

    // Style comparison helper
    const styleIsEq = (s1: Style, s2: Style) =>
      styleHash(utils.objectHash, s1) === styleHash(utils.objectHash, s2)
    // Shared styles container, useful to quickly get them in the text
    // node iterator bellow
    const sharedStyles: Map<string, SharedStyle> = new Map()

    await utils.iterateCache({
      // Builds the shared styles container
      async sharedStyle(node) {
        const style: SharedStyle = node as SharedStyle
        if (typeof style.do_objectID === 'string') {
          sharedStyles.set(style.do_objectID, style)
        }
      },
      async text(node): Promise<void> {
        const layer = utils.nodeToObject<FileFormat.Text>(node)
        if (typeof layer.sharedStyleID === 'string') {
          // Get the shared style object
          const sharedStyle = sharedStyles.get(layer.sharedStyleID)
          if (sharedStyle) {
            // Report if this text style differs from its shared style
            if (!layer.style || !styleIsEq(layer.style, sharedStyle.value)) {
              utils.report({
                node,
                message: i18n._(t`Style differs from the shared text style`),
              })
            }
          }
        }
      },
    })
  }

  return {
    rule,
    name: 'text-styles-no-dirty',
    title: i18n._(t`Prefer text styles to be in sync with their shared style`),
    description: i18n._(t`Disallow text styles that differ from their shared styles`),
  }
}
