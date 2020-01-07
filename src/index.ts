import { RuleSet } from '@sketch-hq/sketch-lint-core'
import { ruleModule as debugAllOptions } from './debug-all-options'
import { ruleModule as debugThrowsError } from './debug-throws-error'
import { ruleModule as groupsMaxLayers } from './groups-max-layers'
import { ruleModule as imagesNoOutsized } from './images-no-outsized'
import { ruleModule as layersNoHidden } from './layers-no-hidden'
import { ruleModule as symbolsNoUnused } from './symbols-no-unused'
import { ruleModule as layerNamesPatternAllowed } from './layer-names-pattern-allowed'
import { ruleModule as stylesNoDuplicate } from './styles-no-duplicate'
import { ruleModule as artboardsGrid } from './artboards-grid'
import { ruleModule as groupsNoRedundant } from './groups-no-redundant'
import { ruleModule as bordersNoDisabled } from './borders-no-disabled'
import { ruleModule as groupsNoEmpty } from './groups-no-empty'
import { ruleModule as artboardsLayout } from './artboards-layout'

const ruleSet: RuleSet = {
  name: '@sketch-hq/sketch-lint-ruleset-core',
  title: 'Sketch Core',
  description: 'The core sketch-lint ruleset',
  rules: [
    debugAllOptions,
    debugThrowsError,
    groupsMaxLayers,
    imagesNoOutsized,
    layersNoHidden,
    symbolsNoUnused,
    layerNamesPatternAllowed,
    stylesNoDuplicate,
    artboardsGrid,
    groupsNoRedundant,
    bordersNoDisabled,
    groupsNoEmpty,
    artboardsLayout,
  ],
}

export { ruleSet }
