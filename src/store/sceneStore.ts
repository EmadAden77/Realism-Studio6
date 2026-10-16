/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CameraState,
  ClothingState,
  DisorderState,
  ExpressionState,
  EyewearState,
  FabricPhysicsState,
  FacialHairState,
  GazeState,
  HairState,
  IdentityLocks,
  IdentityState,
  LightingState,
  PoseState,
  RecentActivityType,
  SceneSnapshot,
  SceneState,
  ValidationIssue
} from '../types/scene';
import { INITIAL_SCENE_STATE, LOCATION_PRESETS, POSE_PRESETS, OUTFIT_PRESETS } from '../lib/presets/data';
import { assembleMasterPrompt } from '../lib/prompt/promptBuilder';
import { validateScene, autoCorrectScene } from '../lib/validation/rules';
import { parseSceneDescription } from '../lib/ai/deterministicInterpreter';
import { loadActiveSceneState, saveActiveSceneState, saveSceneToLibrary } from '../lib/storage/sceneStorage';
import { analyzeReferenceFidelity, applyUserObservationCorrection } from '../lib/reference/referenceAnalyzer';
import { validateHairstyleCompatibility, enforceCompatibleHairstyle } from '../lib/reference/hairstyleCompatibility';
import { updateGeometryFromScene } from '../lib/geometry/calibration';
import { syncFramingFromScene } from '../lib/framing/framingCalculator';
import { applyPreCaptureActivity } from '../lib/timeline/preCaptureContext';
import { applySinglePropertyEdit } from '../lib/scene/sceneDiff';
import { generateExplainableDecisions } from '../lib/scene/sceneDecisions';
import { createSceneSnapshot, restoreSnapshot as restoreSnapshotUtil, persistSnapshots, loadSavedSnapshots, migrateSceneSchema } from '../lib/scene/sceneSnapshots';
import { evaluateSceneReadiness } from '../lib/validation/readinessValidator';
import { ALL_LOCATION_PRESETS, ALL_CLOTHING_PRESETS, ALL_POSE_PRESETS, ALL_CAMERA_ANGLE_PRESETS, ALL_EXPRESSION_PRESETS, ALL_HAIRSTYLE_PRESETS, ALL_GAZE_PRESETS } from '../lib/presets/data';
import { validateCrossCategoryCompatibility, autoResolveConflicts } from '../lib/compatibility/compatibilityMatrix';
import { buildCompatibleSceneSuggestion, applySmartSceneSuggestion } from '../lib/builder/smartSceneBuilder';
import type { FacialActionEngineState, SmartSceneBuilderInput, SmartSceneSuggestion } from '../types/v4';

// Simple global listener for reactive multi-component subscription
type Listener = () => void;
let globalSceneState: SceneState = migrateSceneSchema(loadActiveSceneState());
let historyStack: SceneState[] = [];
let redoStack: SceneState[] = [];
const listeners = new Set<Listener>();

function notify() {
  saveActiveSceneState(globalSceneState);
  listeners.forEach((l) => l());
}

export function getGlobalSceneState(): SceneState {
  return globalSceneState;
}

export function updateGlobalSceneState(
  updater: (prev: SceneState) => SceneState,
  recordHistory: boolean = true
) {
  if (recordHistory) {
    historyStack.push(JSON.parse(JSON.stringify(globalSceneState)));
    if (historyStack.length > 30) historyStack.shift();
    redoStack = [];
  }
  const next = updater(globalSceneState);
  
  // Auto-validate and recalculate V3 intelligence
  next.validationIssues = validateScene(next);
  next.readinessStatus = evaluateSceneReadiness(next);
  next.sceneDecisions = generateExplainableDecisions(next);
  next.framingPreview = syncFramingFromScene(next);
  
  globalSceneState = next;
  notify();
}

export function useSceneStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setTick((t) => t + 1);
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const state = globalSceneState;

  // Identity Updaters
  const updateIdentity = useCallback((patch: Partial<IdentityState>) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      identity: { ...prev.identity, ...patch }
    }));
  }, []);

  const toggleIdentityLock = useCallback((lockKey: keyof IdentityLocks) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      identity: {
        ...prev.identity,
        locks: {
          ...prev.identity.locks,
          [lockKey]: !prev.identity.locks[lockKey]
        }
      }
    }));
  }, []);

  // Hair Updaters
  const updateHair = useCallback((patch: Partial<HairState>) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      hair: { ...prev.hair, ...patch }
    }));
  }, []);

  // Facial Hair Updaters
  const updateFacialHair = useCallback((patch: Partial<FacialHairState>) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      facialHair: { ...prev.facialHair, ...patch }
    }));
  }, []);

  // Expression Updaters
  const updateExpression = useCallback((patch: Partial<ExpressionState>) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      expression: { ...prev.expression, ...patch }
    }));
  }, []);

  // Gaze Updaters
  const updateGaze = useCallback((patch: Partial<GazeState>) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      gaze: { ...prev.gaze, ...patch }
    }));
  }, []);

  // Eyewear Updaters
  const updateEyewear = useCallback((patch: Partial<EyewearState>) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      eyewear: { ...prev.eyewear, ...patch }
    }));
  }, []);

  // Clothing Updaters
  const updateClothing = useCallback((patch: Partial<ClothingState>) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      clothing: { ...prev.clothing, ...patch }
    }));
  }, []);

  const selectOutfitPreset = useCallback((presetId: string) => {
    const preset = OUTFIT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    updateGlobalSceneState((prev) => ({
      ...prev,
      clothing: {
        ...prev.clothing,
        activeOutfitPresetId: preset.id,
        upper: {
          id: `upper_${preset.id}`,
          nameAr: preset.upperAr,
          nameEn: preset.upperEn,
          category: 'upper',
          colorAr: preset.upperAr,
          colorEn: preset.upperEn,
          material: preset.material,
          fit: 'natural_athletic',
          wearState: 'lived_in'
        },
        lower: {
          id: `lower_${preset.id}`,
          nameAr: preset.lowerAr,
          nameEn: preset.lowerEn,
          category: 'lower',
          colorAr: preset.lowerAr,
          colorEn: preset.lowerEn,
          material: preset.material,
          fit: 'relaxed',
          wearState: 'lightly_creased'
        }
      }
    }));
  }, []);

  // Fabric Updaters
  const updateFabric = useCallback((patch: Partial<FabricPhysicsState>) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      fabric: { ...prev.fabric, ...patch }
    }));
  }, []);

  // Pose Updaters
  const updatePose = useCallback((patch: Partial<PoseState>) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      pose: { ...prev.pose, ...patch }
    }));
  }, []);

  const selectPosePreset = useCallback((presetId: string) => {
    const preset = POSE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    updateGlobalSceneState((prev) => ({
      ...prev,
      pose: {
        ...prev.pose,
        presetId: preset.id,
        category: preset.category,
        freeHand: preset.freeHand,
        supportSurface: preset.supportSurface,
        candidAction: preset.descriptionEn
      }
    }));
  }, []);

  // Camera Updaters
  const updateCamera = useCallback((patch: Partial<CameraState>) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      camera: { ...prev.camera, ...patch }
    }));
  }, []);

  // Lighting Updaters
  const updateLighting = useCallback((patch: Partial<LightingState>) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      lighting: { ...prev.lighting, ...patch }
    }));
  }, []);

  // Location Updaters
  const selectLocationPreset = useCallback((presetId: string) => {
    const preset = LOCATION_PRESETS.find((l) => l.id === presetId);
    if (!preset) return;

    updateGlobalSceneState((prev) => {
      const next = {
        ...prev,
        locationPresetId: preset.id,
        environmentCategory: preset.category,
        lighting: {
          ...prev.lighting,
          mode: preset.defaultLighting
        },
        camera: {
          ...prev.camera,
          mode: preset.defaultCameraMode,
          focalLengthEquivMm: preset.defaultCameraMode === 'front_selfie' ? 21 : 23,
          aperture: preset.defaultCameraMode === 'front_selfie' ? 'f/2.0' : 'f/1.63'
        }
      };
      return next;
    });
  }, []);

  // Disorder Updaters
  const updateDisorder = useCallback((patch: Partial<DisorderState>) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      disorder: { ...prev.disorder, ...patch }
    }));
  }, []);

  // Smart Scene Description Input
  const setDescriptionInput = useCallback((input: string) => {
    updateGlobalSceneState(
      (prev) => ({
        ...prev,
        descriptionInput: input
      }),
      false
    );
  }, []);

  // Analyze Scene (Hybrid AI + Deterministic)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);

  const analyzeScene = useCallback(async (customInput?: string) => {
    const textToAnalyze = customInput || globalSceneState.descriptionInput;
    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    setAnalysisMessage('جاري تحليل المشهد وتطبيق القواعد الفيزيائية...');

    try {
      // First try backend AI endpoint
      const response = await fetch('/api/analyze-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: textToAnalyze,
          currentScene: globalSceneState
        })
      });

      const resData = await response.json();

      if (!resData.fallback && resData.data) {
        // AI returned structured data
        const d = resData.data;
        updateGlobalSceneState((prev) => {
          const next = { ...prev };
          if (d.environmentCategory) next.environmentCategory = d.environmentCategory;
          if (d.cameraMode) {
            next.camera.mode = d.cameraMode;
            next.camera.focalLengthEquivMm = d.cameraMode === 'front_selfie' ? 21 : 23;
            next.camera.aperture = d.cameraMode === 'front_selfie' ? 'f/2.0' : 'f/1.63';
          }
          if (d.lightingMode) next.lighting.mode = d.lightingMode;
          if (d.upperGarmentEn) {
            next.clothing.upper.nameEn = d.upperGarmentEn;
            if (d.upperGarmentAr) next.clothing.upper.nameAr = d.upperGarmentAr;
          }
          if (d.lowerGarmentEn) {
            next.clothing.lower.nameEn = d.lowerGarmentEn;
            if (d.lowerGarmentAr) next.clothing.lower.nameAr = d.lowerGarmentAr;
          }
          if (typeof d.disorderLevel === 'number') {
            next.disorder.level = Math.min(4, Math.max(0, d.disorderLevel)) as any;
          }
          const { correctedState } = autoCorrectScene(next);
          return correctedState;
        });
        setAnalysisMessage(d.summaryAr || 'تم استخراج وتنسيق المشهد بنجاح عبر الذكاء الاصطناعي');
      } else {
        // Fallback to deterministic interpreter
        const { updatedState, extractedTokens } = parseSceneDescription(
          textToAnalyze,
          globalSceneState
        );
        updateGlobalSceneState(() => updatedState);
        setAnalysisMessage(`تم التحليل الفوري للمشهد (${Object.keys(extractedTokens).length} خصائص مطابقة)`);
      }
    } catch {
      // Deterministic offline fallback
      const { updatedState, extractedTokens } = parseSceneDescription(
        textToAnalyze,
        globalSceneState
      );
      updateGlobalSceneState(() => updatedState);
      setAnalysisMessage(`تم التحليل الفوري للمشهد (${Object.keys(extractedTokens).length} خصائص مطابقة)`);
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setAnalysisMessage(null), 4000);
    }
  }, []);

  // Generate Prompt
  const [isRefiningPrompt, setIsRefiningPrompt] = useState(false);

  const generatePrompt = useCallback(async (withAiRefinement = false) => {
    // 1. Generate local deterministic prompt first
    const { englishPrompt, negativePrompt } = assembleMasterPrompt(globalSceneState);

    updateGlobalSceneState((prev) => ({
      ...prev,
      output: {
        ...prev.output,
        englishPrompt,
        negativePrompt,
        generationTimestamp: Date.now(),
        isAiRefined: false
      }
    }));

    if (withAiRefinement) {
      setIsRefiningPrompt(true);
      try {
        const response = await fetch('/api/refine-prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rawPrompt: englishPrompt,
            negativePrompt,
            sceneSummary: {
              environment: globalSceneState.environmentCategory,
              camera: globalSceneState.camera.mode,
              lighting: globalSceneState.lighting.mode,
              identityHeight: globalSceneState.identity.heightCm
            }
          })
        });

        const resData = await response.json();
        if (resData.data && resData.data.refinedPrompt) {
          updateGlobalSceneState((prev) => ({
            ...prev,
            output: {
              ...prev.output,
              englishPrompt: resData.data.refinedPrompt,
              negativePrompt: resData.data.refinedNegativePrompt || prev.output.negativePrompt,
              isAiRefined: true
            }
          }));
        }
      } catch (err) {
        console.warn('AI Refine fallback:', err);
      } finally {
        setIsRefiningPrompt(false);
      }
    }
  }, []);

  // Auto-correct contradictions
  const applyAutoCorrections = useCallback(() => {
    updateGlobalSceneState((prev) => {
      const { correctedState } = autoCorrectScene(prev);
      return correctedState;
    });
  }, []);

  // Undo / Redo
  const canUndo = historyStack.length > 0;
  const canRedo = redoStack.length > 0;

  const undo = useCallback(() => {
    if (historyStack.length === 0) return;
    const previous = historyStack.pop()!;
    redoStack.push(JSON.parse(JSON.stringify(globalSceneState)));
    globalSceneState = previous;
    notify();
  }, []);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack.pop()!;
    historyStack.push(JSON.parse(JSON.stringify(globalSceneState)));
    globalSceneState = next;
    notify();
  }, []);

  const loadScene = useCallback((newScene: SceneState) => {
    updateGlobalSceneState(() => newScene);
  }, []);

  const saveCurrentScene = useCallback((customTitle?: string) => {
    const toSave = {
      ...globalSceneState,
      title: customTitle || globalSceneState.title,
      id: globalSceneState.id.startsWith('scene_') ? `scene_${Date.now()}` : globalSceneState.id
    };
    saveSceneToLibrary(toSave);
    updateGlobalSceneState(() => toSave);
  }, []);

  // V3 Reference Analysis Handlers
  const triggerReferenceAnalysis = useCallback((options?: { isPartialHairlineOccluded?: boolean; hasShadows?: boolean }) => {
    updateGlobalSceneState((prev) => {
      const analysis = analyzeReferenceFidelity(prev.identity.referenceImageUrl, prev.identity.referenceImageName, options);
      return {
        ...prev,
        referenceAnalysis: analysis
      };
    });
  }, []);

  const updateObservationCorrection = useCallback((property: string, correctionText: string) => {
    updateGlobalSceneState((prev) => {
      const updated = applyUserObservationCorrection(prev.referenceAnalysis, property, correctionText);
      return {
        ...prev,
        referenceAnalysis: updated
      };
    });
  }, []);

  const enforceCompatibleHair = useCallback(() => {
    updateGlobalSceneState((prev) => enforceCompatibleHairstyle(prev));
  }, []);

  // V3 Pre-Capture Activity Handlers
  const updatePreCapture = useCallback((activity: RecentActivityType, minutesAgo: number = 3) => {
    updateGlobalSceneState((prev) => applyPreCaptureActivity(prev, activity, minutesAgo));
  }, []);

  // V3 Geometry Calibration Handlers
  const updateGeometryDistance = useCallback((distanceCm: number) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      pose: {
        ...prev.pose,
        selfieArmDistanceCm: distanceCm
      },
      geometryCalibration: {
        ...prev.geometryCalibration,
        camera: {
          ...prev.geometryCalibration.camera,
          lensToFaceDistanceCm: distanceCm
        }
      }
    }));
  }, []);

  const updateGeometryPitch = useCallback((pitchDeg: number) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      geometryCalibration: {
        ...prev.geometryCalibration,
        camera: {
          ...prev.geometryCalibration.camera,
          cameraPitchDeg: pitchDeg
        }
      }
    }));
  }, []);

  const updateGeometryRoll = useCallback((rollDeg: number) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      camera: {
        ...prev.camera,
        naturalHandheldRollDeg: rollDeg
      },
      geometryCalibration: {
        ...prev.geometryCalibration,
        camera: {
          ...prev.geometryCalibration.camera,
          cameraRollDeg: rollDeg
        }
      }
    }));
  }, []);

  // V3 Differential Edit Handlers
  const applySingleEdit = useCallback(<T>(
    field: string,
    labelAr: string,
    value: T,
    reasonAr: string,
    updater: (prev: SceneState) => SceneState
  ) => {
    updateGlobalSceneState((prev) => {
      const { nextState } = applySinglePropertyEdit(prev, field, labelAr, value, reasonAr, updater);
      return nextState;
    });
  }, []);

  // V3 Snapshots Handlers
  const saveSnapshot = useCallback((name?: string, description?: string) => {
    const snapshot = createSceneSnapshot(globalSceneState, name, description);
    const existing = loadSavedSnapshots();
    const updated = [snapshot, ...existing].slice(0, 50);
    persistSnapshots(updated);
    updateGlobalSceneState((prev) => ({
      ...prev,
      sceneVersions: {
        ...prev.sceneVersions,
        snapshots: updated,
        activeSnapshotId: snapshot.id
      }
    }));
    return snapshot;
  }, []);

  const restoreSnapshot = useCallback((snapshot: SceneSnapshot) => {
    updateGlobalSceneState((prev) => restoreSnapshotUtil(snapshot, prev));
  }, []);

  const deleteSnapshot = useCallback((id: string) => {
    const existing = loadSavedSnapshots().filter((s) => s.id !== id);
    persistSnapshots(existing);
    updateGlobalSceneState((prev) => ({
      ...prev,
      sceneVersions: {
        ...prev.sceneVersions,
        snapshots: existing,
        activeSnapshotId: prev.sceneVersions.activeSnapshotId === id ? null : prev.sceneVersions.activeSnapshotId
      }
    }));
  }, []);

  // V4 Extended Library Handlers
  const selectV4Location = useCallback((presetId: string) => {
    const loc = ALL_LOCATION_PRESETS.find((l) => l.id === presetId);
    if (!loc) return;
    updateGlobalSceneState((prev) => ({
      ...prev,
      locationPresetId: presetId,
      environmentCategory: loc.category,
      lighting: {
        ...prev.lighting,
        mode: loc.defaultLighting
      },
      camera: {
        ...prev.camera,
        mode: loc.defaultCameraMode
      },
      v4RecentlyUsed: Array.from(new Set([presetId, ...(prev.v4RecentlyUsed || [])])).slice(0, 30)
    }));
  }, []);

  const selectV4Clothing = useCallback((presetId: string) => {
    const item = ALL_CLOTHING_PRESETS.find((c) => c.id === presetId);
    if (!item) return;
    updateGlobalSceneState((prev) => {
      const next = { ...prev };
      if (item.garmentCategory === 'upper') {
        next.clothing = {
          ...next.clothing,
          upper: {
            id: item.id,
            nameAr: item.nameAr,
            nameEn: item.nameEn,
            category: 'upper',
            colorAr: item.defaultColorAr,
            colorEn: item.defaultColor,
            material: item.material as any,
            fit: item.fit === 'slim' ? 'fitted' : item.fit === 'loose' ? 'loose' : 'relaxed',
            wearState: item.wearState === 'freshly_worn' ? 'fresh_clean' : 'lived_in'
          }
        };
      } else if (item.garmentCategory === 'lower') {
        next.clothing = {
          ...next.clothing,
          lower: {
            id: item.id,
            nameAr: item.nameAr,
            nameEn: item.nameEn,
            category: 'lower',
            colorAr: item.defaultColorAr,
            colorEn: item.defaultColor,
            material: item.material as any,
            fit: item.fit === 'slim' ? 'fitted' : item.fit === 'loose' ? 'loose' : 'relaxed',
            wearState: item.wearState === 'freshly_worn' ? 'fresh_clean' : 'lived_in'
          }
        };
      } else if (item.garmentCategory === 'thobe') {
        next.clothing = {
          ...next.clothing,
          upper: {
            id: item.id,
            nameAr: item.nameAr,
            nameEn: item.nameEn,
            category: 'upper',
            colorAr: item.defaultColorAr,
            colorEn: item.defaultColor,
            material: item.material as any,
            fit: 'natural_athletic',
            wearState: 'fresh_clean'
          }
        };
      }
      next.v4RecentlyUsed = Array.from(new Set([presetId, ...(prev.v4RecentlyUsed || [])])).slice(0, 30);
      return next;
    });
  }, []);

  const selectV4Pose = useCallback((presetId: string) => {
    const p = ALL_POSE_PRESETS.find((pose) => pose.id === presetId);
    if (!p) return;
    updateGlobalSceneState((prev) => ({
      ...prev,
      pose: {
        ...prev.pose,
        presetId: p.id,
        category: p.group === 'standing' ? 'standing' : p.group === 'sitting' ? 'sitting' : p.group === 'reclining' ? 'reclining' : 'sitting',
        candidAction: p.nameEn
      },
      v4RecentlyUsed: Array.from(new Set([presetId, ...(prev.v4RecentlyUsed || [])])).slice(0, 30)
    }));
  }, []);

  const selectV4CameraAngle = useCallback((presetId: string) => {
    const angle = ALL_CAMERA_ANGLE_PRESETS.find((a) => a.id === presetId);
    if (!angle) return;
    updateGlobalSceneState((prev) => ({
      ...prev,
      camera: {
        ...prev.camera,
        angle: angle.elevationDegrees > 3 ? 'slightly_elevated' : angle.elevationDegrees < -3 ? 'low_angle' : 'eye_level',
        naturalHandheldRollDeg: angle.rollDegrees
      },
      pose: {
        ...prev.pose,
        selfieArmDistanceCm: angle.distanceCm
      },
      geometryCalibration: {
        ...prev.geometryCalibration,
        camera: {
          ...prev.geometryCalibration.camera,
          lensToFaceDistanceCm: angle.distanceCm,
          cameraPitchDeg: angle.pitchDegrees,
          cameraRollDeg: angle.rollDegrees,
          cameraYawDeg: angle.yawDegrees
        }
      },
      v4RecentlyUsed: Array.from(new Set([presetId, ...(prev.v4RecentlyUsed || [])])).slice(0, 30)
    }));
  }, []);

  const selectV4Expression = useCallback((presetId: string) => {
    const expr = ALL_EXPRESSION_PRESETS.find((e) => e.id === presetId);
    if (!expr) return;
    updateGlobalSceneState((prev) => ({
      ...prev,
      expression: {
        ...prev.expression,
        presetId: expr.id,
        intensity: expr.intensity,
        customDescription: expr.nameEn,
        facialActions: {
          eyebrowElevationMm: expr.eyebrowElevation,
          eyebrowConvergenceFactor: expr.eyebrowConvergence,
          eyelidOpennessFactor: expr.eyelidOpenness,
          cheekElevationFactor: expr.cheekElevation,
          mouthCornerMovementMm: expr.mouthCornerMovement,
          lipTensionFactor: expr.lipTension,
          jawRelaxationFactor: expr.jawRelaxation,
          activeExpressionPresetId: expr.id,
          intensity: expr.intensity
        }
      },
      v4RecentlyUsed: Array.from(new Set([presetId, ...(prev.v4RecentlyUsed || [])])).slice(0, 30)
    }));
  }, []);

  const updateFacialActions = useCallback((patch: Partial<FacialActionEngineState>) => {
    updateGlobalSceneState((prev) => {
      const current = prev.expression.facialActions || {
        eyebrowElevationMm: 0,
        eyebrowConvergenceFactor: 0,
        eyelidOpennessFactor: 0.9,
        cheekElevationFactor: 0,
        mouthCornerMovementMm: 0,
        lipTensionFactor: 0.1,
        jawRelaxationFactor: 0.8,
        activeExpressionPresetId: prev.expression.presetId,
        intensity: prev.expression.intensity
      };
      return {
        ...prev,
        expression: {
          ...prev.expression,
          facialActions: {
            ...current,
            ...patch
          }
        }
      };
    });
  }, []);

  const selectV4Hairstyle = useCallback((presetId: string) => {
    const h = ALL_HAIRSTYLE_PRESETS.find((hair) => hair.id === presetId);
    if (!h) return;
    updateGlobalSceneState((prev) => ({
      ...prev,
      hair: {
        ...prev.hair,
        presetId: h.id,
        direction: h.direction,
        densityLock: prev.identity.locks.hairDensity ? true : prev.hair.densityLock
      },
      v4RecentlyUsed: Array.from(new Set([presetId, ...(prev.v4RecentlyUsed || [])])).slice(0, 30)
    }));
  }, []);

  const selectV4Gaze = useCallback((presetId: string) => {
    const g = ALL_GAZE_PRESETS.find((gaze) => gaze.id === presetId);
    if (!g) return;
    updateGlobalSceneState((prev) => ({
      ...prev,
      gaze: {
        ...prev.gaze,
        targetId: g.id,
        customDescription: g.nameEn
      },
      v4RecentlyUsed: Array.from(new Set([presetId, ...(prev.v4RecentlyUsed || [])])).slice(0, 30)
    }));
  }, []);

  const toggleFavorite = useCallback((presetId: string) => {
    updateGlobalSceneState((prev) => {
      const favs = prev.v4LibraryFavorites || [];
      const updated = favs.includes(presetId)
        ? favs.filter((id) => id !== presetId)
        : [...favs, presetId];
      return {
        ...prev,
        v4LibraryFavorites: updated
      };
    });
  }, []);

  const checkCompatibility = useCallback(() => {
    return validateCrossCategoryCompatibility(globalSceneState);
  }, []);

  const autoResolveAllConflicts = useCallback(() => {
    updateGlobalSceneState((prev) => autoResolveConflicts(prev));
  }, []);

  const generateSmartScene = useCallback((input: SmartSceneBuilderInput) => {
    return buildCompatibleSceneSuggestion(input, globalSceneState);
  }, []);

  const applySmartScene = useCallback((suggestion: SmartSceneSuggestion) => {
    updateGlobalSceneState((prev) => applySmartSceneSuggestion(prev, suggestion));
  }, []);

  return {
    state,
    updateIdentity,
    toggleIdentityLock,
    updateHair,
    updateFacialHair,
    updateExpression,
    updateGaze,
    updateEyewear,
    updateClothing,
    selectOutfitPreset,
    updateFabric,
    updatePose,
    selectPosePreset,
    updateCamera,
    updateLighting,
    selectLocationPreset,
    updateDisorder,
    setDescriptionInput,
    analyzeScene,
    isAnalyzing,
    analysisMessage,
    generatePrompt,
    isRefiningPrompt,
    applyAutoCorrections,
    undo,
    redo,
    canUndo,
    canRedo,
    loadScene,
    saveCurrentScene,
    // V3 Extension Actions
    triggerReferenceAnalysis,
    updateObservationCorrection,
    enforceCompatibleHair,
    updatePreCapture,
    updateGeometryDistance,
    updateGeometryPitch,
    updateGeometryRoll,
    applySingleEdit,
    saveSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    updateGlobalSceneState,
    // V4 Extended Actions
    selectV4Location,
    selectV4Clothing,
    selectV4Pose,
    selectV4CameraAngle,
    selectV4Expression,
    updateFacialActions,
    selectV4Hairstyle,
    selectV4Gaze,
    toggleFavorite,
    checkCompatibility,
    autoResolveAllConflicts,
    generateSmartScene,
    applySmartScene
  };
}
