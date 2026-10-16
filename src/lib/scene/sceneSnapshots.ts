/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneSnapshot, SceneState, SceneVersionsState } from '../../types/scene.ts';
import { INITIAL_SCENE_STATE } from '../presets/data.ts';

const SNAPSHOTS_STORAGE_KEY = 'realism_studio_v3_snapshots';

/**
 * Creates a clean snapshot of the scene, stripping large base64 image data for export safety
 */
export function createSceneSnapshot(
  state: SceneState,
  name?: string,
  description?: string
): SceneSnapshot {
  // Clone state
  const cleanState: SceneState = JSON.parse(JSON.stringify(state));

  // Omit private image data from snapshot by default
  cleanState.identity.referenceImageUrl = null;
  if (cleanState.imageReview) {
    cleanState.imageReview.uploadedImageUrl = null;
  }
  cleanState.referenceAnalysis.referenceImageUrl = null;

  const id = `snap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const snapshotName = name || `لقطة مشهد ${new Date().toLocaleTimeString('ar-SA')}`;

  return {
    id,
    name: snapshotName,
    timestamp: Date.now(),
    description: description || `حفظ مشهد: ${state.title || 'مشهد واقعي'}`,
    sceneState: cleanState,
    promptBackup: state.output.englishPrompt || ''
  };
}

/**
 * Loads snapshots from localStorage
 */
export function loadSavedSnapshots(): SceneSnapshot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Persists snapshots to localStorage
 */
export function persistSnapshots(snapshots: SceneSnapshot[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(snapshots));
  } catch (err) {
    console.error('Failed to save snapshots:', err);
  }
}

/**
 * Restores a snapshot into an active SceneState, migrating older schema versions if needed
 * Fulfills TEST 08 & TEST 12
 */
export function restoreSnapshot(
  snapshot: SceneSnapshot,
  currentLiveState?: SceneState
): SceneState {
  const sourceState = snapshot.sceneState;

  // Schema migration for V1, V2 -> V3
  const migratedState = migrateSceneSchema(sourceState);

  // Preserve user uploaded reference images from live session if user desires
  if (currentLiveState?.identity.referenceImageUrl && !migratedState.identity.referenceImageUrl) {
    migratedState.identity.referenceImageUrl = currentLiveState.identity.referenceImageUrl;
    migratedState.identity.referenceImageName = currentLiveState.identity.referenceImageName;
    migratedState.referenceAnalysis.hasReferenceImage = true;
    migratedState.referenceAnalysis.referenceImageUrl = currentLiveState.identity.referenceImageUrl;
    migratedState.referenceAnalysis.referenceImageName = currentLiveState.identity.referenceImageName;
  }

  return migratedState;
}

/**
 * Migrates any older schema (v1 or v2) or partial JSON to a complete, valid V3 SceneState
 * Fulfills TEST 12
 */
export function migrateSceneSchema(raw: unknown): SceneState {
  if (!raw || typeof raw !== 'object') {
    return JSON.parse(JSON.stringify(INITIAL_SCENE_STATE));
  }

  const obj = raw as Record<string, unknown>;
  const base = JSON.parse(JSON.stringify(INITIAL_SCENE_STATE)) as SceneState;

  // Deep merge properties
  const migrated: SceneState = {
    ...base,
    ...obj,
    version: 3,
    identity: {
      ...base.identity,
      ...((obj.identity as object) || {}),
      locks: {
        ...base.identity.locks,
        ...(((obj.identity as Record<string, unknown>)?.locks as object) || {})
      }
    },
    hair: {
      ...base.hair,
      ...((obj.hair as object) || {})
    },
    clothing: {
      ...base.clothing,
      ...((obj.clothing as object) || {})
    },
    pose: {
      ...base.pose,
      ...((obj.pose as object) || {})
    },
    camera: {
      ...base.camera,
      ...((obj.camera as object) || {})
    },
    lighting: {
      ...base.lighting,
      ...((obj.lighting as object) || {})
    },
    realismIntelligence: {
      ...base.realismIntelligence,
      ...((obj.realismIntelligence as object) || {})
    },
    referenceAnalysis: {
      ...base.referenceAnalysis,
      ...((obj.referenceAnalysis as object) || {})
    },
    geometryCalibration: {
      ...base.geometryCalibration,
      ...((obj.geometryCalibration as object) || {})
    },
    framingPreview: {
      ...base.framingPreview,
      ...((obj.framingPreview as object) || {})
    },
    preCaptureContext: {
      ...base.preCaptureContext,
      ...((obj.preCaptureContext as object) || {})
    },
    sceneDecisions: Array.isArray(obj.sceneDecisions) ? (obj.sceneDecisions as SceneState['sceneDecisions']) : base.sceneDecisions,
    sceneVersions: {
      ...base.sceneVersions,
      ...((obj.sceneVersions as object) || {})
    },
    sceneDiff: {
      ...base.sceneDiff,
      ...((obj.sceneDiff as object) || {})
    },
    readinessStatus: {
      ...base.readinessStatus,
      ...((obj.readinessStatus as object) || {})
    },
    output: {
      ...base.output,
      ...((obj.output as object) || {})
    },
    validationIssues: Array.isArray(obj.validationIssues) ? (obj.validationIssues as SceneState['validationIssues']) : []
  };

  return migrated;
}
