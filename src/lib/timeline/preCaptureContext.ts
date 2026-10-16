/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { PreCaptureContextState, RecentActivityType, SceneState } from '../../types/scene.ts';
import { RECENT_ACTIVITIES } from '../presets/data.ts';

/**
 * Derives realistic, restrained physical consequences for a given recent activity.
 * Strictly adheres to anti-exaggeration rules: no dramatic sweat, dirt, or disheveled hair.
 */
export function deriveActivityConsequences(
  activityType: RecentActivityType,
  minutesAgo: number = 3
): PreCaptureContextState['naturalConsequences'] {
  const activity = RECENT_ACTIVITIES.find((a) => a.id === activityType);
  if (!activity || activityType === 'none') {
    return {
      hairOrientationEffect: null,
      beddingDeformationEffect: null,
      fabricTensionEffect: null,
      nearbyObjectsEffect: null,
      skinMoistureEffect: null,
      postureRelaxationEffect: null
    };
  }

  return {
    hairOrientationEffect: activity.hairEffect,
    beddingDeformationEffect: activity.beddingEffect,
    fabricTensionEffect: activity.fabricEffect,
    nearbyObjectsEffect: activity.objectEffect,
    skinMoistureEffect: activity.skinMoistureEffect,
    postureRelaxationEffect: activity.postureEffect
  };
}

/**
 * Applies pre-capture context to scene state and updates dependent physical locks
 */
export function applyPreCaptureActivity(
  state: SceneState,
  activityType: RecentActivityType,
  minutesAgo: number = 3
): SceneState {
  const consequences = deriveActivityConsequences(activityType, minutesAgo);

  const updatedState: SceneState = {
    ...state,
    preCaptureContext: {
      recentActivity: activityType,
      minutesAgo,
      naturalConsequences: consequences,
      userCustomConsequences: state.preCaptureContext.userCustomConsequences
    }
  };

  // Specific contextual dependencies
  if (activityType === 'recently_reclined') {
    // TEST 05: Pillow compression and bedding effects
    updatedState.realismIntelligence.contactPhysics.pillowHeadDeformation = true;
    updatedState.realismIntelligence.contactPhysics.mattressPelvisCompression = true;
    if (updatedState.pose.category !== 'reclining') {
      updatedState.pose.category = 'reclining';
      updatedState.pose.supportSurface = 'pillows';
    }
  } else if (activityType === 'recently_sat_on_bed') {
    updatedState.realismIntelligence.contactPhysics.mattressPelvisCompression = true;
    updatedState.fabric.postureFolds.sittingHipFolds = true;
  } else if (activityType === 'adjusting_clothing') {
    updatedState.fabric.postureFolds.gripPointRadiation = true;
    updatedState.realismIntelligence.contactPhysics.gripPointTensionOrigination = true;
  } else if (activityType === 'just_woke_up') {
    updatedState.realismIntelligence.contactPhysics.pillowHeadDeformation = true;
    updatedState.disorder.level = Math.max(2, updatedState.disorder.level) as 0 | 1 | 2 | 3 | 4;
  }

  return updatedState;
}
