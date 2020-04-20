import { t } from '@lingui/macro'
import { RuleContext, RuleFunction } from '@sketch-hq/sketch-assistant-types'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

import { CreateRuleFunction } from '../..'

// Do not check for style properties on these objects
const IGNORE_CLASSES = ['artboard', 'page', 'symbolMaster', 'text']

type SharedStyle = FileFormat.SharedStyle
type Style = FileFormat.Style
type HashableStyle = Partial<
  Pick<Style, 'borders' | 'borderOptions' | 'blur' | 'fills' | 'shadows' | 'innerShadows'>
>

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
  })

export const createRule: CreateRuleFunction = (i18n) => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { utils } = context
    // Style comparison helper
    const styleIsEq = (s1: Style, s2: Style) =>
      styleHash(utils.objectHash, s1) === styleHash(utils.objectHash, s2)
    const sharedStyles: Map<string, SharedStyle> = new Map()

    await utils.iterateCache({
      // Build the shared styles container
      async sharedStyle(node) {
        const style: SharedStyle = node as SharedStyle
        if (typeof style.do_objectID === 'string') {
          sharedStyles.set(style.do_objectID, style)
        }
      },
      async $layers(node): Promise<void> {
        const layer = utils.nodeToObject<FileFormat.AnyLayer>(node)
        if (IGNORE_CLASSES.includes(node._class)) return
        // Ignore groups with default styles (i.e. no shadows)
        if (layer._class === 'group' && !layer.style?.shadows?.length) return
        if (typeof layer.sharedStyleID === 'string') {
          // Get the shared style object
          const sharedStyle = sharedStyles.get(layer.sharedStyleID)
          if (sharedStyle) {
            // Report if this layer style differs from its shared style
            if (!layer.style || !styleIsEq(layer.style, sharedStyle.value)) {
              utils.report({
                node,
                message: i18n._(t`Style differs from the shared layer style`),
              })
            }
          }
        }
      },
    })
  }

  return {
    rule,
    name: 'layer-styles-no-dirty',
    title: i18n._(t`Layer styles should be in sync with their shared style`),
    description: i18n._(
      t`Teams may wish to enforce the strict usage of shared styles within a document, and the presence of deviations in layer styles might represent an opportunity to either create a new shared style or set the layers style accordingly`,
    ),
  }
}
