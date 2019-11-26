import { RuleSet } from '@sketch-hq/sketch-lint-core'
import { ruleModule as debugAllOptions } from './debug-all-options'
import { ruleModule as debugThrowsError } from './debug-throws-error'
import { ruleModule as groupsMaxLayers } from './groups-max-layers'
import { ruleModule as imagesNoOutsized } from './images-no-outsized'
import { ruleModule as layersNoHidden } from './layers-no-hidden'

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
  ],
}

export { ruleSet }
