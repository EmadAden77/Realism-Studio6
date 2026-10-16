/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import type {
  CameraAngle,
  CameraMode,
  EnvironmentCategory,
  FabricMaterial,
  LightingMode,
  SaudiCity,
  SceneState
} from './scene';

// ============================================================
// 1. LOCATION PRESETS DATA MODEL (Section 02)
// ============================================================
export type LocationGroup =
  | 'home_interiors'       // GROUP A (45)
  | 'saudi_streets'        // GROUP B (50)
  | 'commercial_cafes'     // GROUP C (40)
  | 'vehicles_parking'     // GROUP D (25)
  | 'work_gym_facilities'; // GROUP E (40)

export interface V4LocationPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  group: LocationGroup;
  category: EnvironmentCategory;
  compatibleRegions: SaudiCity[];
  environmentType: 'indoor' | 'outdoor' | 'semi_covered' | 'vehicle_interior';
  buildingArchitecture: string;
  roomOrStreetGeometry: string;
  requiredObjects: string[];
  optionalObjects: string[];
  availableSurfaces: string[];
  lightingModes: LightingMode[];
  compatiblePoses: string[];
  compatibleCameraAngles: string[];
  backgroundActivityCompatibility: string;
  environmentalMaterialDefinitions: string[];
  disorderOptions: string[];
  negativeConstraints: string[];
  promptFragment: string;
  defaultLighting: LightingMode;
  defaultCameraMode: CameraMode;
}

export const V4LocationPresetSchema = z.object({
  id: z.string(),
  nameAr: z.string(),
  nameEn: z.string(),
  group: z.enum([
    'home_interiors',
    'saudi_streets',
    'commercial_cafes',
    'vehicles_parking',
    'work_gym_facilities'
  ]),
  category: z.string(),
  compatibleRegions: z.array(z.string()),
  environmentType: z.enum(['indoor', 'outdoor', 'semi_covered', 'vehicle_interior']),
  buildingArchitecture: z.string(),
  roomOrStreetGeometry: z.string(),
  requiredObjects: z.array(z.string()),
  optionalObjects: z.array(z.string()),
  availableSurfaces: z.array(z.string()),
  lightingModes: z.array(z.string()),
  compatiblePoses: z.array(z.string()),
  compatibleCameraAngles: z.array(z.string()),
  backgroundActivityCompatibility: z.string(),
  environmentalMaterialDefinitions: z.array(z.string()),
  disorderOptions: z.array(z.string()),
  negativeConstraints: z.array(z.string()),
  promptFragment: z.string(),
  defaultLighting: z.string(),
  defaultCameraMode: z.string()
});

// ============================================================
// 2. CLOTHING PRESETS DATA MODEL (Section 04 & 05)
// ============================================================
export type ClothingGroup =
  | 'tshirts_sleeveless'            // GROUP A (25)
  | 'thobes_shirts_upper'           // GROUP B (25)
  | 'shorts_trousers'               // GROUP C (30)
  | 'outerwear_footwear_accessories'; // GROUP D (20)

export type GarmentFit = 'slim' | 'regular' | 'relaxed' | 'loose';
export type GarmentThickness = 'thin' | 'medium' | 'thick';
export type GarmentSurface = 'matte' | 'slightly_textured' | 'mild_sheen';
export type GarmentWearState = 'freshly_worn' | 'naturally_used' | 'slightly_wrinkled' | 'after_activity';

export interface V4ClothingPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  group: ClothingGroup;
  garmentCategory: 'upper' | 'lower' | 'thobe' | 'outerwear' | 'footwear' | 'accessory';
  material: FabricMaterial | string;
  defaultColor: string;
  defaultColorAr: string;
  fit: GarmentFit;
  length: string;
  thickness: GarmentThickness;
  surfaceReflectance: GarmentSurface;
  wearState: GarmentWearState;
  wrinkleBehavior: string;
  stretchBehavior: string;
  applicableEnvironments: EnvironmentCategory[];
  supportedActions: string[];
  physicalConstraints: string[];
  promptFragment: string;
}

// ============================================================
// 3. HUMAN POSE DATA MODEL (Section 06)
// ============================================================
export type PoseGroup =
  | 'standing'      // 15
  | 'sitting'       // 20
  | 'reclining'     // 15
  | 'walking'       // 10
  | 'interactions'; // 20

export interface V4PosePreset {
  id: string;
  nameAr: string;
  nameEn: string;
  group: PoseGroup;
  bodySupportRequirements: string;
  shoulderPosition: string;
  armConfiguration: string;
  torsoRotation: string;
  headOrientation: string;
  legConfiguration: string;
  contactSurfaces: string[];
  compatibleCameraAngles: string[];
  compatibleEnvironments: EnvironmentCategory[];
  requiredObjects: string[];
  anatomicalRestrictions: string[];
  constraints: string[];
  promptFragment: string;
}

// ============================================================
// 4. SELFIE CAMERA ANGLE DATA MODEL (Section 07 & 08)
// ============================================================
export type CameraAngleGroup =
  | 'frontal_eye'
  | 'elevated'
  | 'low_angle'
  | 'lateral'
  | 'framing_tightness'
  | 'posture_specific';

export interface V4CameraAnglePreset {
  id: string;
  nameAr: string;
  nameEn: string;
  group: CameraAngleGroup;
  elevationDegrees: number; // e.g. -15 to +35
  horizontalOffsetCm: number; // -20 to +20
  distanceCm: number; // 45 to 65 standard handheld
  pitchDegrees: number; // tilt down/up
  yawDegrees: number; // side turn
  rollDegrees: number; // handheld roll tilt e.g. -2 to +2
  expectedVisibleBodyRegions: string[];
  approximateBackgroundCoverage: string;
  handheldFeasibility: boolean;
  compatiblePoses: string[];
  promptFragment: string;
}

// ============================================================
// 5. ANATOMICAL FACIAL EXPRESSION & ACTION ENGINE (Section 09 & 10)
// ============================================================
export type ExpressionGroup =
  | 'neutral'      // Calm, relaxed, resting
  | 'satisfaction' // Relief, contentment, subtle smile
  | 'fatigue'      // Mildly tired, sleepy, just awake
  | 'attention'    // Focused, curious, thoughtful
  | 'reaction'     // Subtle skepticism, mild confusion, slight surprise
  | 'social';      // Listening, reacting, speaking

export interface V4ExpressionPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  group: ExpressionGroup;
  intensity: 'very_subtle' | 'subtle' | 'moderate';
  facialActions: string[];
  eyebrowElevation: number;    // -2 to +2 mm
  eyebrowConvergence: number;  // 0 to 1
  eyelidOpenness: number;      // 0.5 to 1.0 (1.0 = fully open, 0.6 = drowsy)
  cheekElevation: number;      // 0 to 1
  mouthCornerMovement: number; // -2 to +2 mm (0 = flat, +1.5 = micro smirk)
  lipTension: number;          // 0 to 1
  jawRelaxation: number;       // 0 to 1
  headOrientation: string;
  eyeDirection: string;
  promptFragment: string;
}

export interface FacialActionEngineState {
  eyebrowElevationMm: number;    // -2 to +2
  eyebrowConvergenceFactor: number; // 0 to 1
  eyelidOpennessFactor: number;     // 0.5 to 1.0
  cheekElevationFactor: number;     // 0 to 1
  mouthCornerMovementMm: number;    // -2 to +2
  lipTensionFactor: number;         // 0 to 1
  jawRelaxationFactor: number;      // 0 to 1
  activeExpressionPresetId: string;
  intensity: 'very_subtle' | 'subtle' | 'moderate';
}

// ============================================================
// 6. NATURAL GAZE DATA MODEL (Section 11)
// ============================================================
export interface V4GazePreset {
  id: string;
  nameAr: string;
  nameEn: string;
  targetDescription: string;
  horizontalAngleDeg: number; // -35 to +35
  verticalAngleDeg: number;   // -25 to +20
  compatiblePoses: string[];
  promptFragment: string;
}

// ============================================================
// 7. REFERENCE-COMPATIBLE HAIRSTYLE DATA MODEL (Section 12 & 13)
// ============================================================
export type HairstyleGroup =
  | 'original'       // Reference exact
  | 'forward'        // Forward textures
  | 'side'           // Side sweep
  | 'back'           // Brushed back
  | 'casual'         // Casual finger combed
  | 'after_activity';// Bedhead, damp, wind

export interface V4HairstylePreset {
  id: string;
  nameAr: string;
  nameEn: string;
  group: HairstyleGroup;
  direction: string;
  minimumLengthCategory: 'very_short' | 'short' | 'medium' | 'long';
  densityRequirement: 'sparse_ok' | 'standard_natural' | 'thick_required';
  referenceCompatible: boolean;
  templeCoverageRequirement: 'minimal' | 'moderate' | 'full';
  promptFragment: string;
}

// ============================================================
// 8. SMART COMPATIBILITY MATRIX (Section 14)
// ============================================================
export interface CompatibilityConflict {
  id: string;
  severity: 'error' | 'warning' | 'info';
  titleAr: string;
  messageAr: string;
  explanationEn: string;
  conflictingElements: string[];
  autoResolutionSuggestionAr: string;
  canAutoResolve: boolean;
}

export interface CompatibilityValidationReport {
  isPlausible: boolean;
  score: number; // 0-100%
  conflicts: CompatibilityConflict[];
  appliedPhysicalEnforcements: string[];
}

// ============================================================
// 9. AUTOMATIC COMPATIBLE SCENE BUILDER (Section 15)
// ============================================================
export interface SmartSceneBuilderInput {
  locationId?: string;
  clothingPresetId?: string;
  poseId?: string;
  cameraAngleId?: string;
  expressionId?: string;
  hairstyleId?: string;
  gazeId?: string;
  timeOfDay?: 'day' | 'evening' | 'night';
  lightingMode?: LightingMode;
}

export interface SmartSceneSuggestion {
  cameraAngle: V4CameraAnglePreset;
  gaze: V4GazePreset;
  pose: V4PosePreset;
  lightingMode: LightingMode;
  fabricBehavior: string;
  hairBehavior: string;
  environmentalDetails: string[];
  naturalSceneActivity: string;
  reasoningAr: string[];
}
