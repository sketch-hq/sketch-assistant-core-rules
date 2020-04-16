import { resolve } from 'path'
import * as utils from '@sketch-hq/sketch-assistant-utils'
import { AssistantEnv, RunResult, RuleConfig } from '@sketch-hq/sketch-assistant-types'

import assistant from './index'

export const testRule = async (
  dirname: string,
  fixture: string,
  ruleId: string,
  config: RuleConfig = { active: true },
  env?: AssistantEnv,
): Promise<RunResult> =>
  await utils.testRule(
    resolve(dirname, fixture),
    assistant,
    `@sketch-hq/sketch-assistant-core-rules/${ruleId}`,
    config,
    env,
  )
