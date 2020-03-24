import { t } from '@lingui/macro'
import {
  RuleContext,
  RuleFunction,
  Node,
  ImageMetadata,
  FileFormat,
} from '@sketch-hq/sketch-assistant-types'

import { CreateRuleFunction } from '../..'

function assertOption(value: unknown): asserts value is number {
  if (typeof value !== 'number') throw new Error()
}

type ImageRef = string

type ImageUsage = {
  node: Node
  frame: FileFormat.Rect
  type: 'bitmap' | 'fill'
  imageMetadata: ImageMetadata
}

type Results = Map<ImageRef, ImageUsage[]>

const isValidUsage = (usage: ImageUsage, maxRatio: number): boolean => {
  const { frame, imageMetadata } = usage
  const { width, height } = imageMetadata
  const isWidthOversized = frame.width * maxRatio < width
  const isHeightOversized = frame.height * maxRatio < height
  return !isWidthOversized && !isHeightOversized
}

export const createRule: CreateRuleFunction = (i18n) => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { utils } = context

    const maxRatio = utils.getOption('maxRatio')
    assertOption(maxRatio)

    // Create a data structure to hold the results from scanning the document.
    // It's a map keyed by image reference, with the values being an array of
    // objects representing instances where that image has been used
    const results: Results = new Map()

    const addResult = async (
      ref: ImageRef,
      node: Node,
      frame: FileFormat.Rect,
      type: 'bitmap' | 'fill',
    ): Promise<void> => {
      const usage: ImageUsage = {
        node,
        frame,
        type,
        imageMetadata: await utils.getImageMetadata(ref),
      }

      if (results.has(ref)) {
        const item = results.get(ref)
        item?.push(usage)
        return
      }

      results.set(ref, [usage])
    }

    const promises: Promise<void>[] = []

    await utils.iterateCache({
      async $layers(node): Promise<void> {
        const layer = utils.nodeToObject<FileFormat.AnyLayer>(node)
        const { frame } = layer
        // Handle images in bitmap layers
        if (layer._class === 'bitmap') {
          if (layer.image && layer.image._class === 'MSJSONFileReference') {
            promises.push(addResult(layer.image._ref, node, frame, 'bitmap'))
          }
        }
        // Handle image fills in layer styles
        if (layer.sharedStyleID === 'string') return // Skip shared styles
        if (!layer.style) return // Narrow to truthy style objects
        if (!layer.style.fills) return // Narrow to truthy style fills arrays
        for (const fill of layer.style.fills) {
          if (fill.fillType !== FileFormat.FillType.Pattern) continue
          if (!fill.image) continue
          if (fill.image._class !== 'MSJSONFileReference') continue
          promises.push(addResult(fill.image._ref, node, frame, 'fill'))
        }
      },
    })

    // Await all promises together to benefit from parallelisation
    await Promise.all(promises)

    for (const usages of results.values()) {
      // In order for any usage of an image to be considered invalid, all other
      // usages of it throughout the document must also be invalid - in other words,
      // if an image has been used correctly at least once it has earned its
      // filesize penality in the document

      // Bail early from this loop iteration if at least one usage of this
      // image is valid
      const atLeaseOneValid = usages.map((usage) => isValidUsage(usage, maxRatio)).includes(true)
      if (atLeaseOneValid) continue

      // Having got to this point we know that all usages of the image are
      // invalid, i.e. oversized, so generate a violation for each containing
      // layer
      for (const usage of usages) {
        let message
        switch (usage.type) {
          case 'bitmap':
            message = i18n._(
              t`Unexpected oversized image used in image layer, must be no more than ${maxRatio} times larger than the layer frame's width or height`,
            )
            break
          case 'fill':
            message = i18n._(
              t`Unexpected oversized image used in layer style image fill, must be no more than ${maxRatio} times larger than the layer frame's width or height`,
            )
            break
        }
        utils.report({
          node: usage.node,
          message,
        })
      }
    }
  }

  return {
    rule,
    name: 'images-no-outsized',
    title: i18n._(t`No Outsized Images`),
    description: i18n._(
      t`Disallow images that are larger than their frame by a configurable ratio`,
    ),
    getOptions(helpers) {
      return [
        helpers.numberOption({
          name: 'maxRatio',
          title: i18n._(t`Maximum Ratio`),
          defaultValue: 1,
          description: i18n._(
            t`How much larger an image can be than its frame and still be considered valid`,
          ),
          minimum: 1,
        }),
      ]
    },
  }
}
