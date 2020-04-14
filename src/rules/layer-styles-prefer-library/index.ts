import { t } from '@lingui/macro'
import { RuleContext, RuleFunction, FileFormat } from '@sketch-hq/sketch-assistant-types'

import { CreateRuleFunction } from '../..'
import { isCombinedShapeChildLayer } from '../../rule-helpers'

// Do not check for duplicate style properties on these objects
const IGNORE_CLASSES = ['artboard', 'page', 'symbolMaster', 'text']

export const createRule: CreateRuleFunction = (i18n) => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { file, utils } = context
    // Gather option value and assert its type
    const authorizedLibraries = utils.getOption('libraries') || []
    const doc = file.file.contents.document
    // libraries is a Map<shared style id strings, library shared styles>
    const libraries = doc.foreignLayerStyles.reduce(
      (styleMap, libStyle) => styleMap.set(libStyle.localSharedStyle.do_objectID, libStyle),
      new Map(),
    )
    // Reports are done in place, while iterating through cache.
    await utils.iterateCache({
      async $layers(node): Promise<void> {
        const layer = utils.nodeToObject<FileFormat.AnyLayer>(node)
        if (IGNORE_CLASSES.includes(node._class)) return
        if (isCombinedShapeChildLayer(node, utils)) return // Ignore layers in combined shapes
        if (layer._class === 'group' && !layer.style?.shadows?.length) return // Ignore groups with default styles (i.e. no shadows)
        if (typeof layer.sharedStyleID !== 'string') {
          // Report immediately if there is no sharedStyleID
          utils.report([
            {
              node,
              message: i18n._(t`Layer styles must be set with the shared styles of a library`),
            },
          ])
          return // don't process this node further
        }
        const library = libraries.get(layer.sharedStyleID)
        if (!library) {
          // sharedStyleID does not belong to a library
          utils.report([
            {
              node,
              message: i18n._(t`A shared style from a library is expected`),
            },
          ])
          return
        }
        const libraryName = library.sourceLibraryName
        // Determine if the library is one of the allowed libraries
        if (Array.isArray(authorizedLibraries) && authorizedLibraries.length > 0) {
          const isAuthorized = authorizedLibraries.indexOf(libraryName) > -1
          if (!isAuthorized) {
            utils.report([
              {
                node,
                message: i18n._(t`Uses the unauthorized library "${libraryName}"`),
              },
            ])
            return
          }
        }
        // Check if the layer styles differ from the library
        // Get an md5 hash of the style object. Only consider a subset of style
        // object properties when computing the hash (can revisit this to make the
        // check looser or stricter)
        const layerStyle = layer.style
        const layerHash = utils.objectHash({
          borders: layerStyle?.borders,
          borderOptions: layerStyle?.borderOptions,
          blur: layerStyle?.blur,
          fills: layerStyle?.fills,
          shadows: layerStyle?.shadows,
          innerShadows: layerStyle?.innerShadows,
        })
        const libraryStyle = library.localSharedStyle.value
        const libraryHash = utils.objectHash({
          borders: libraryStyle?.borders,
          borderOptions: libraryStyle?.borderOptions,
          blur: libraryStyle?.blur,
          fills: libraryStyle?.fills,
          shadows: libraryStyle?.shadows,
          innerShadows: libraryStyle?.innerShadows,
        })
        if (layerHash !== libraryHash) {
          utils.report([
            {
              node,
              message: i18n._(t`Shared style differs from library`),
            },
          ])
        }
      },
    })
  }

  return {
    rule,
    name: 'layer-styles-prefer-library',
    title: i18n._(t`Prefer Library Layer Styles`),
    description: i18n._(t`Disallow layer styles in favour of library styles`),
    getOptions: (helpers) => [
      helpers.stringArrayOption({
        name: 'libraries',
        title: i18n._(t`Authorized libraries`),
        description: i18n._(
          t`Libraries that are valid to use. An error is shown if a library that does not belong to this list is used.`,
        ),
        defaultValue: [],
      }),
    ],
  }
}
