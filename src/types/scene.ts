/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';

export type AspectRatio = '9:16' | '1:1' | '4:5' | '3:4' | '16:9';

export type CameraMode = 
  | 'front_selfie'
  | 'rear_main_self_capture'
  | 'mirror_selfie'
  | 'third_person_phone';

export type CameraAngle =
  | 'eye_level'
  | 'slightly_elevated'
  | 'elevated'
  | 'low_angle'
  | 'lateral_left'
  | 'lateral_right'
  | 'reclining_angle'
  | 'overhead_reachable'
  | 'custom';

export type LightingMode =
  | 'phone_screen_only'
  | 'natural_daylight'
  | 'morning_daylight'
  | 'midday_sunlight'
  | 'late_afternoon'
  | 'sunset'
  | 'twilight'
  | 'deep_night'
  | 'ceiling_light_only'
  | 'bedside_lamp_only'
  | 'street_led'
  | 'storefront_light'
  | 'vehicle_dashboard'
  | 'phone_flash'
  | 'mixed_practical';

export type SaudiCity =
  | 'riyadh'
  | 'jeddah'
  | 'makkah'
  | 'madinah'
  | 'dammam'
  | 'khobar'
  | 'dhahran'
  | 'abha'
  | 'taif'
  | 'tabuk'
  | 'hail'
  | 'buraidah'
  | 'hofuf'
  | 'yanbu'
  | 'najran'
  | 'custom';

export type EnvironmentCategory =
  | 'bedroom'
  | 'home_general'
  | 'saudi_street'
  | 'commercial'
  | 'cafe'
  | 'vehicle'
  | 'work'
  | 'gym';

export type FabricMaterial =
  | 'lightweight_cotton'
  | 'medium_cotton'
  | 'heavy_cotton'
  | 'jersey_knit'
  | 'athletic_polyester'
  | 'cotton_poly_blend'
  | 'woven_thobe_fabric'
  | 'linen_blend'
  | 'denim';

export type ExpressionIntensity = 'very_subtle' | 'subtle' | 'moderate';

export type CandidnessLevel = 'still_natural' | 'slightly_spontaneous' | 'everyday_candid' | 'active_moment';

export interface IdentityLocks {
  faceAndSkull: boolean;
  eyeAndNose: boolean;
  skinTone: boolean;
  hairline: boolean;
  hairDensity: boolean;
  facialHair: boolean;
  apparentAge: boolean;
  bodyProportions: boolean;
}

export interface IdentityState {
  referenceImageUrl: string | null;
  referenceImageName: string | null;
  heightCm: number;
  weightKg: number;
  bodyType: 'tall_lean_athletic' | 'athletic' | 'average' | 'slender' | 'broad_build';
  apparentAge: number;
  skinTone: string;
  headShape: string;
  facialAsymmetry: string;
  locks: IdentityLocks;
  customDescription: string;
}

export interface HairState {
  length: 'original' | 'short' | 'medium' | 'custom';
  direction: 'original' | 'forward' | 'side_left' | 'side_right' | 'backward' | 'irregular';
  presetId: string;
  densityLock: boolean;
  physicsMode: 'natural_clumps';
  preventArtificialThickening: boolean;
  customNotes: string;
}

export interface FacialHairState {
  preserveBeard: boolean;
  preserveMoustache: boolean;
  growthTexture: 'natural_stubble' | 'short_boxed' | 'neatly_trimmed' | 'natural_full_stubble' | 'clean_shaven';
  densityLock: boolean;
  naturalBoundaries: boolean;
  noGapFilling: boolean;
  customNotes: string;
}

export interface ExpressionState {
  presetId: string;
  intensity: ExpressionIntensity;
  customDescription: string;
  facialActions?: import('./v4').FacialActionEngineState;
}

export interface GazeState {
  targetId: string;
  alignedWithAction: boolean;
  customDescription: string;
}

export interface EyewearState {
  mode: 'follow_reference' | 'no_glasses' | 'prescription_glasses' | 'sunglasses';
  preserveEyeStructure: boolean;
  styleDescription: string;
}

export interface ClothingItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'upper' | 'lower' | 'outer' | 'footwear' | 'accessory';
  colorAr: string;
  colorEn: string;
  material: FabricMaterial;
  fit: 'fitted' | 'relaxed' | 'loose' | 'natural_athletic';
  wearState: 'fresh_clean' | 'lightly_creased' | 'lived_in';
}

export interface ClothingState {
  activeOutfitPresetId: string;
  upper: ClothingItem;
  lower: ClothingItem;
  outer: ClothingItem | null;
  footwear: ClothingItem | null;
  customOutfitDescription: string;
}

export interface FabricPhysicsState {
  enabled: boolean;
  gravityResponse: boolean;
  bodyContactFolds: boolean;
  seamTension: boolean;
  anchorPoints: boolean;
  postureFolds: {
    sittingHipFolds: boolean;
    recliningCompression: boolean;
    armLiftTension: boolean;
    gripPointRadiation: boolean;
  };
  reflectance: 'matte_textile' | 'slight_jersey_sheen';
  preventPlasticGarments: boolean;
}

export interface PoseState {
  presetId: string;
  category: 'standing' | 'sitting' | 'reclining' | 'walking' | 'interaction' | 'candid_micro';
  freeHand: 'right_holding_phone' | 'left_holding_phone' | 'both_free' | 'resting_on_lap' | 'adjusting_item';
  supportSurface: 'bed_mattress' | 'pillows' | 'chair' | 'car_seat' | 'ground' | 'wall' | 'unsupported';
  selfieArmDistanceCm: number;
  candidAction: string;
}

export interface CameraState {
  device: 'Xiaomi 15 Ultra';
  mode: CameraMode;
  angle: CameraAngle;
  aspectRatio: AspectRatio;
  focalLengthEquivMm: number;
  aperture: string;
  sensorSize: '1/2.74-inch' | '1-inch-type';
  naturalHandheldRollDeg: number;
  faceFraming: 'rule_of_thirds' | 'slightly_off_center' | 'centered_intimate';
  lensFlawsSimulation: {
    naturalVignette: boolean;
    sensorNoiseLowLight: boolean;
    noArtificialPortraitBlur: boolean;
  };
}

export interface LightingState {
  mode: LightingMode;
  strictRealismLock: boolean;
  timeOfDay: 'day' | 'night' | 'sunset' | 'dawn';
  primarySource: {
    type: string;
    direction: 'front_screen' | 'overhead' | 'lateral_window' | 'side_lamp' | 'front_flash';
    colorTempK: number;
    intensity: 'low' | 'medium' | 'high';
  };
  secondarySourceEnabled: boolean;
  secondarySourceType: string;
}

export interface SpatialObject3D {
  id: string;
  name: string;
  x: number; // in meters relative to room center
  y: number;
  z: number;
  widthM: number;
  depthM: number;
  heightM: number;
  isFixed: boolean;
}

export interface BedroomGeometry {
  persistentLayout: boolean;
  roomDimensionsM: { length: number; width: number; height: number };
  bedDimensionsCm: { width: number; length: number; height: number };
  headboardWidthCm: number;
  wallFinish: 'matte_cream_plaster' | 'neutral_beige_paint';
  flooring: 'saudi_ceramic_tile' | 'light_marble_pattern_tile';
  curtainState: 'drawn_shut' | 'partially_open';
  forbiddenLuxuryDetails: boolean;
  spatialObjects: SpatialObject3D[];
}

export interface SaudiEnvironmentState {
  city: SaudiCity;
  neighborhoodType: 'modern_villa' | 'classic_residential' | 'mid_rise_apartment' | 'quiet_alley';
  curbStyle: 'white_black' | 'yellow_black' | 'plain_concrete';
  sidewalkMaterial: 'interlocking_pavers' | 'poured_concrete' | 'mixed_stone';
  preventOrientalistCliches: boolean;
}

export interface VehicleState {
  enabled: boolean;
  category: 'suv' | 'sedan' | 'pickup';
  makeModel: string;
  exteriorColor: string;
  interiorColor: string;
  seatPosition: 'driver_seat' | 'passenger_seat' | 'exterior_beside_door';
  doorState: 'closed' | 'open_framing_body';
}

export interface BackgroundPeopleState {
  count: number;
  densityMode: 'exact' | 'auto_contextual';
  actions: string;
  noFaceCloning: boolean;
}

export interface DisorderState {
  level: 0 | 1 | 2 | 3 | 4;
  recentContextActivity: 'after_waking' | 'casual_lounging' | 'getting_ready' | 'working' | 'after_drive';
  activeItems: string[];
}

// ADVANCED PHYSICAL REALISM INTELLIGENCE ENGINE V2.0 STATE
export interface RealismIntelligenceState {
  opticalGeometryStrictness: 'low' | 'medium' | 'high'; // Default high
  lightingPhysicsStrictness: 'normal' | 'high' | 'very_high'; // Default very_high
  naturalTextureProtection: 'normal' | 'high' | 'very_high'; // Default very_high
  candidMotionIntensity: CandidnessLevel; // Default everyday_candid
  materialPhysicsEnforcement: boolean; // Default true
  sceneContinuityLock: boolean; // Default true
  automaticExaggerationReduction: boolean; // Default true
  contactPhysics: {
    mattressPelvisCompression: boolean;
    pillowHeadDeformation: boolean;
    clothingPressureFolds: boolean;
    armReachAnatomicalAnchor: boolean;
    gripPointTensionOrigination: boolean;
  };
  unifiedSmartphoneImaging: {
    enabled: boolean;
    coherentToneMapping: boolean;
    localExposureNoise: boolean;
    prohibitFaceOnlyBeautyDenoise: boolean;
    prohibitArtificialPortraitBlur: boolean;
  };
  controlledImperfections: {
    sensorLuminanceNoise: boolean;
    slightOpticalAberration: boolean;
    realisticLowLightDetailLoss: boolean;
    modestHandheldFramingTilt: boolean;
    highlightClippingNearSource: boolean;
  };
}

export interface ImageReviewItem {
  id: string;
  category: string;
  severity: 'error' | 'warning' | 'info';
  issueAr: string;
  evidenceEn: string;
  confidence: number;
  suggestedPromptCorrectionEn: string;
  elementsToPreserveEn: string;
}

export interface ImageReviewState {
  uploadedImageUrl: string | null;
  uploadedImageName: string | null;
  isAnalyzing: boolean;
  analysisCompleted: boolean;
  reviewItems: ImageReviewItem[];
  overallRealismAssessmentAr: string;
  targetedEditInstructionsEn: string;
}

export interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  titleAr: string;
  messageAr: string;
  explanationEn: string;
  conflictingFields: string[];
  suggestedResolutionAr: string;
  canAutoCorrect: boolean;
}

export interface PromptOutputState {
  englishPrompt: string;
  negativePrompt: string;
  modelRecommendation: string;
  generationTimestamp: number;
  isAiRefined: boolean;
  appliedCorrections: string[];
}

// ============================================================
// VERSION 3.0 DATA MODEL EXTENSIONS
// ============================================================

export type ObservationVisibility =
  | 'clearly_visible'
  | 'partially_visible'
  | 'uncertain'
  | 'not_observable';

export type ObservationConfidence =
  | 'clearly_visible'
  | 'partially_visible'
  | 'uncertain'
  | 'not_observable';

export interface ReferenceObservation {
  property: string;
  propertyNameAr: string;
  value: string | null;
  visibility: ObservationVisibility;
  confidence: ObservationConfidence;
  source: string;
  userVerified: boolean;
  notes?: string;
  userCorrection?: string;
}

export interface ReferenceAnalysisState {
  hasReferenceImage: boolean;
  referenceImageName: string | null;
  referenceImageUrl: string | null;
  analysisDate: number | null;
  isAnalyzed: boolean;
  observations: ReferenceObservation[];
  lockedFeatures: string[];
  hairCompatibility: {
    isCompatible: boolean;
    hairlinePreserved: boolean;
    densityPreserved: boolean;
    warnings: string[];
    suggestions: string[];
  };
  uncertaintyNotesAr: string;
}

export interface SubjectGeometry {
  heightCm: number;
  proportions: 'tall_lean' | 'athletic' | 'average' | 'compact' | 'broad';
  shoulderWidthCm: number;
  cameraHoldingArm: 'right' | 'left' | 'both_hands' | 'none';
  armReachCm: number;
  headPitchDeg: number;
  headYawDeg: number;
  torsoOrientationDeg: number;
  posture: 'standing' | 'sitting' | 'reclining' | 'walking';
}

export interface CameraGeometry {
  lensToFaceDistanceCm: number;
  cameraHeightCm: number;
  horizontalOffsetCm: number;
  cameraPitchDeg: number;
  cameraYawDeg: number;
  cameraRollDeg: number;
  fovHorizontalDeg: number;
}

export interface EnvironmentGeometry {
  roomWidthM: number;
  roomLengthM: number;
  ceilingHeightM: number;
  bedWidthCm: number;
  bedLengthCm: number;
  bedHeightCm: number;
  walkingClearanceM: number;
  supportSurfaceHeightCm: number;
  isPhysicalSupportValid: boolean;
}

export interface GeometryCalibrationState {
  subject: SubjectGeometry;
  camera: CameraGeometry;
  environment: EnvironmentGeometry;
  reachStatus: {
    canReach: boolean;
    maxReachCm: number;
    currentReachCm: number;
    messageAr: string;
  };
  clearanceWarnings: string[];
}

export interface FramingPreviewState {
  aspectRatio: AspectRatio;
  facePositionX: number; // percentage offset -50 to 50
  facePositionY: number; // percentage offset -50 to 50
  framingTightness: 'close_up' | 'medium_close_up' | 'bust' | 'waist_up' | 'full_figure';
  headBoundingBox: { x: number; y: number; width: number; height: number };
  shoulderBoundingBox: { x: number; y: number; width: number; height: number };
  torsoBoundingBox: { x: number; y: number; width: number; height: number };
  armDirection: 'right_bottom' | 'left_bottom' | 'center_bottom' | 'out_of_frame';
  backgroundCoveragePercent: number;
  isApproximatePreviewNoticeAcknowledged: boolean;
}

export type RecentActivityType =
  | 'just_woke_up'
  | 'recently_sat_on_bed'
  | 'recently_reclined'
  | 'finished_exercising'
  | 'just_entered_room'
  | 'just_exited_vehicle'
  | 'waiting_for_someone'
  | 'preparing_to_leave'
  | 'adjusting_clothing'
  | 'drinking_coffee'
  | 'checking_phone'
  | 'resting_after_work'
  | 'recently_washed_face'
  | 'recently_showered'
  | 'casual_conversation'
  | 'none';

export interface PreCaptureContextState {
  recentActivity: RecentActivityType;
  minutesAgo: number;
  naturalConsequences: {
    hairOrientationEffect: string | null;
    beddingDeformationEffect: string | null;
    fabricTensionEffect: string | null;
    nearbyObjectsEffect: string | null;
    skinMoistureEffect: string | null;
    postureRelaxationEffect: string | null;
  };
  userCustomConsequences?: string;
}

export interface SceneDecision {
  id: string;
  property: string;
  propertyLabelAr: string;
  selectedValue: unknown;
  reasonAr: string;
  ruleId: string;
  assumptionsAr: string[];
  confidence: 'high' | 'medium' | 'low';
  relatedFields: string[];
  alternativesAr?: string[];
}

export interface SceneChange {
  id: string;
  timestamp: number;
  propertyPath: string;
  propertyLabelAr: string;
  previousValue: unknown;
  nextValue: unknown;
  reasonAr: string;
  automaticallyDerived: boolean;
}

export interface SceneDiffState {
  activeSessionChanges: SceneChange[];
  lastModifiedField: string | null;
  preservedLockedFields: string[];
}

export interface SceneSnapshot {
  id: string;
  name: string;
  timestamp: number;
  description?: string;
  sceneState: SceneState;
  promptBackup: string;
}

export interface SceneVersionsState {
  snapshots: SceneSnapshot[];
  activeSnapshotId: string | null;
  comparisonSnapshotId: string | null;
}

export type ReadinessStatus = 'ready' | 'ready_with_warnings' | 'invalid';

export interface SceneReadiness {
  status: ReadinessStatus;
  statusLabelAr: string;
  scoreExplanationAr: string;
  warnings: string[];
  errors: string[];
  checklist: {
    id: string;
    labelAr: string;
    passed: boolean;
    detailsAr: string;
  }[];
  unsupportedAssumptions: string[];
  suggestedCorrectionsAr: string[];
}

export interface PromptComparisonState {
  versionA: {
    id: string;
    name: string;
    prompt: string;
    timestamp: number;
  };
  versionB: {
    id: string;
    name: string;
    prompt: string;
    timestamp: number;
  };
  addedInstructions: string[];
  removedInstructions: string[];
  modifiedProperties: string[];
  unchangedLockedRequirements: string[];
}

export interface SceneState {
  version: number;
  id: string;
  title: string;
  descriptionInput: string;
  environmentCategory: EnvironmentCategory;
  locationPresetId: string;
  domesticSelection?: import('../lib/domestic/domesticOptions').DomesticSelection;
  
  identity: IdentityState;
  hair: HairState;
  facialHair: FacialHairState;
  expression: ExpressionState;
  gaze: GazeState;
  eyewear: EyewearState;
  clothing: ClothingState;
  fabric: FabricPhysicsState;
  pose: PoseState;
  camera: CameraState;
  lighting: LightingState;
  bedroomGeometry: BedroomGeometry;
  saudiEnvironment: SaudiEnvironmentState;
  vehicle: VehicleState;
  backgroundPeople: BackgroundPeopleState;
  disorder: DisorderState;

  // V2 Advanced Realism Intelligence Engine State
  realismIntelligence: RealismIntelligenceState;
  imageReview?: ImageReviewState;

  // V3 Scene Intelligence & Reference Fidelity Engine State
  referenceAnalysis: ReferenceAnalysisState;
  geometryCalibration: GeometryCalibrationState;
  framingPreview: FramingPreviewState;
  preCaptureContext: PreCaptureContextState;
  sceneDecisions: SceneDecision[];
  sceneVersions: SceneVersionsState;
  sceneDiff: SceneDiffState;
  readinessStatus: SceneReadiness;
  
  v7Calibration?: import('../lib/v7/physicalCalibration').V7Calibration;

  // V5 Contextual Physics (optional for old saved scenes)
  v5Context?: import('../lib/v5/contextualPhysics').V5Context;

  // V4 Library & Preset Extensions
  v4LibraryFavorites?: string[];
  v4RecentlyUsed?: string[];

  output: PromptOutputState;
  validationIssues: ValidationIssue[];
}

export const ReferenceObservationSchema = z.object({
  property: z.string(),
  propertyNameAr: z.string(),
  value: z.string().nullable(),
  visibility: z.enum(['clearly_visible', 'partially_visible', 'uncertain', 'not_observable']),
  confidence: z.enum(['clearly_visible', 'partially_visible', 'uncertain', 'not_observable']),
  source: z.string(),
  userVerified: z.boolean(),
  notes: z.string().optional(),
  userCorrection: z.string().optional(),
});

export const SceneDecisionSchema = z.object({
  id: z.string(),
  property: z.string(),
  propertyLabelAr: z.string(),
  selectedValue: z.unknown(),
  reasonAr: z.string(),
  ruleId: z.string(),
  assumptionsAr: z.array(z.string()),
  confidence: z.enum(['high', 'medium', 'low']),
  relatedFields: z.array(z.string()),
  alternativesAr: z.array(z.string()).optional(),
});

export const SceneChangeSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  propertyPath: z.string(),
  propertyLabelAr: z.string(),
  previousValue: z.unknown(),
  nextValue: z.unknown(),
  reasonAr: z.string(),
  automaticallyDerived: z.boolean(),
});

export const SceneReadinessSchema = z.object({
  status: z.enum(['ready', 'ready_with_warnings', 'invalid']),
  statusLabelAr: z.string(),
  scoreExplanationAr: z.string(),
  warnings: z.array(z.string()),
  errors: z.array(z.string()),
  checklist: z.array(z.object({
    id: z.string(),
    labelAr: z.string(),
    passed: z.boolean(),
    detailsAr: z.string(),
  })),
  unsupportedAssumptions: z.array(z.string()),
  suggestedCorrectionsAr: z.array(z.string()),
});

export const SceneStateSchema = z.object({
  version: z.number(),
  id: z.string(),
  title: z.string(),
  descriptionInput: z.string(),
  environmentCategory: z.string(),
  locationPresetId: z.string(),
  identity: z.object({
    heightCm: z.number().min(140).max(220),
    weightKg: z.number().min(40).max(180),
    bodyType: z.string(),
    apparentAge: z.number().min(16).max(80),
  }),
  camera: z.object({
    mode: z.string(),
    aspectRatio: z.string(),
  }),
  lighting: z.object({
    mode: z.string(),
    strictRealismLock: z.boolean(),
  }),
  referenceAnalysis: z.object({
    hasReferenceImage: z.boolean(),
    isAnalyzed: z.boolean(),
  }).optional(),
  geometryCalibration: z.object({
    subject: z.object({
      heightCm: z.number(),
    }),
  }).optional(),
  preCaptureContext: z.object({
    recentActivity: z.string(),
  }).optional(),
});
