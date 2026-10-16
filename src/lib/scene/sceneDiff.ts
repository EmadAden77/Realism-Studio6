/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneChange, SceneDiffState, SceneState } from '../../types/scene.ts';

export interface DifferentialEditResult {
  nextState: SceneState;
  changeRecord: SceneChange;
  preservedFields: string[];
}

/**
 * Applies a surgical single-property change, preserving all other state and locked fields untouched.
 */
export function applySinglePropertyEdit<T>(
  currentState: SceneState,
  targetField: string,
  targetLabelAr: string,
  newValue: T,
  reasonAr: string,
  updater: (prev: SceneState) => SceneState
): DifferentialEditResult {
  // Deep clone previous value for tracking
  const previousValue = (currentState as unknown as Record<string, unknown>)[targetField.split('.')[0]];

  // Execute focused updater
  const nextState = updater(currentState);

  const changeRecord: SceneChange = {
    id: `chg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    propertyPath: targetField,
    propertyLabelAr: targetLabelAr,
    previousValue,
    nextValue: newValue,
    reasonAr,
    automaticallyDerived: false
  };

  const activeChanges = [changeRecord, ...currentState.sceneDiff.activeSessionChanges].slice(0, 50);

  const preservedFields = [
    'identity.locks.faceAndSkull',
    'identity.locks.hairDensity',
    'identity.locks.skinTone',
    'bedroomGeometry.roomDimensionsM',
    'clothing.upper',
    'lighting.mode'
  ].filter((f) => !f.startsWith(targetField.split('.')[0]));

  nextState.sceneDiff = {
    activeSessionChanges: activeChanges,
    lastModifiedField: targetField,
    preservedLockedFields: preservedFields
  };

  return {
    nextState,
    changeRecord,
    preservedFields
  };
}

/**
 * Compares two SceneStates and returns human-readable changes and preserved locks
 */
export function computeSceneDiff(
  before: SceneState,
  after: SceneState
): {
  differences: { field: string; fieldLabelAr: string; beforeVal: string; afterVal: string }[];
  preservedLocks: string[];
} {
  const differences: { field: string; fieldLabelAr: string; beforeVal: string; afterVal: string }[] = [];

  // Check expression
  if (before.expression.presetId !== after.expression.presetId) {
    differences.push({
      field: 'expression',
      fieldLabelAr: 'تعبير الوجه',
      beforeVal: before.expression.presetId,
      afterVal: after.expression.presetId
    });
  }

  // Check camera angle
  if (before.camera.angle !== after.camera.angle) {
    differences.push({
      field: 'camera.angle',
      fieldLabelAr: 'زاوية الكاميرا',
      beforeVal: before.camera.angle,
      afterVal: after.camera.angle
    });
  }

  // Check lighting
  if (before.lighting.mode !== after.lighting.mode) {
    differences.push({
      field: 'lighting.mode',
      fieldLabelAr: 'نمط الإضاءة',
      beforeVal: before.lighting.mode,
      afterVal: after.lighting.mode
    });
  }

  // Check clothing
  if (before.clothing.activeOutfitPresetId !== after.clothing.activeOutfitPresetId) {
    differences.push({
      field: 'clothing',
      fieldLabelAr: 'الملابس',
      beforeVal: before.clothing.activeOutfitPresetId,
      afterVal: after.clothing.activeOutfitPresetId
    });
  }

  // Check hair
  if (before.hair.presetId !== after.hair.presetId) {
    differences.push({
      field: 'hair',
      fieldLabelAr: 'تسريحة الشعر',
      beforeVal: before.hair.presetId,
      afterVal: after.hair.presetId
    });
  }

  const preservedLocks: string[] = [];
  if (before.identity.locks.hairDensity && after.identity.locks.hairDensity) {
    preservedLocks.push('قفل كثافة الشعر الأصلي (Hair Density Lock)');
  }
  if (before.identity.locks.faceAndSkull && after.identity.locks.faceAndSkull) {
    preservedLocks.push('قفل أبعاد الوجه والجمجمة (Skull Anatomy Lock)');
  }
  if (before.bedroomGeometry.persistentLayout && after.bedroomGeometry.persistentLayout) {
    preservedLocks.push('ثبات هندسة ومعمار غرفة النوم (Room Geometry Persistence)');
  }
  if (before.lighting.strictRealismLock && after.lighting.strictRealismLock) {
    preservedLocks.push('قفل الإضاءة الفيزيائية الصارمة (Strict Realism Lock)');
  }

  return { differences, preservedLocks };
}
