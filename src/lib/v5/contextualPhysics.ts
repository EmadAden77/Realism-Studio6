import type { SceneState } from '../../types/scene';

export type HandAction = 'none' | 'hold_cup' | 'pinch_sleeve' | 'move_pillow' | 'lift_duvet' | 'touch_hair';
export type ClimateCondition = 'neutral' | 'air_conditioned' | 'warm_humid' | 'after_shower' | 'after_workout';
export type ReflectionMode = 'none' | 'mirror' | 'car_glass' | 'window';
export type PromptLength = 'concise' | 'balanced' | 'detailed';

export interface V5Context {
  handAction: HandAction;
  climate: ClimateCondition;
  reflection: ReflectionMode;
  layeredClothing: boolean;
  causalClutter: boolean;
  occlusion: boolean;
  relationLock: boolean;
  promptLength: PromptLength;
}
export const V5_DEFAULTS: V5Context = {
  handAction: 'none', climate: 'neutral', reflection: 'none',
  layeredClothing: false, causalClutter: true, occlusion: true,
  relationLock: true, promptLength: 'balanced'
};

export function getV5(state: SceneState): V5Context {
  return { ...V5_DEFAULTS, ...state.v5Context };
}

export interface V5Finding { id: string; level: 'error' | 'warning'; messageAr: string; }
export function validateV5(state: SceneState): V5Finding[] {
  const v = getV5(state);
  const issues: V5Finding[] = [];
  if (v.handAction !== 'none' && state.camera.mode === 'front_selfie' && state.pose.freeHand === 'both_free') {
    issues.push({id:'V5_SELFIE_HAND',level:'warning',messageAr:'التفاعل يحتاج يداً حرة، ويجب تخصيص اليد الأخرى للهاتف.'});
  }
  if (v.handAction === 'lift_duvet' && state.environmentCategory !== 'bedroom' && state.environmentCategory !== 'home_general') {
    issues.push({id:'V5_DUVET_PLACE',level:'warning',messageAr:'رفع البطانية يتطلب مكاناً يحتوي بطانية بالفعل.'});
  }
  if (v.reflection === 'mirror' && state.camera.mode !== 'mirror_selfie') {
    issues.push({id:'V5_REFLECTION_MODE',level:'warning',messageAr:'المرآة محددة لكن نمط الكاميرا ليس سيلفي مرآة؛ يجب تنسيق زاوية الانعكاس.'});
  }
  if (v.climate === 'after_shower' && state.environmentCategory === 'saudi_street') {
    issues.push({id:'V5_WET_STREET',level:'warning',messageAr:'آثار الاستحمام بالخارج ينبغي أن تبقى خفيفة ولا تعني إضاءة أو بللاً مبالغاً فيه.'});
  }
  return issues;
}

const actions: Record<HandAction,string> = {
  none:'', hold_cup:'the free hand wraps naturally around a cup with grounded finger contact and plausible wrist alignment',
  pinch_sleeve:'the free hand lightly pinches the sleeve hem, creating localized tension folds at the actual grip',
  move_pillow:'the free hand shifts a supported pillow, creating plausible cushion compression and partial hand occlusion',
  lift_duvet:'the free hand lifts one duvet edge, with natural drape, fabric thickness and gravity-driven folds',
  touch_hair:'the free hand briefly touches existing hair without changing the reference hairline or density'
};
const climates: Record<ClimateCondition,string> = {
  neutral:'', air_conditioned:'dry indoor materials, no invented perspiration or condensation',
  warm_humid:'subtle context-dependent humidity behavior, never automatic dramatic sweat or wet clothing',
  after_shower:'slightly damp hair grouping only when consistent with recent activity; no added hair density',
  after_workout:'restrained post-exercise skin and textile moisture only where justified by the scene'
};
const reflections: Record<ReflectionMode,string> = {
  none:'', mirror:'consistent mirror reflection geometry including visible phone, holding hand and reversed spatial orientation',
  car_glass:'subtle vehicle-window reflections corresponding only to actual light sources and surrounding objects',
  window:'view-dependent glass reflections with appropriate transparency and existing scene light sources'
};

export function buildV5Prompt(state: SceneState): string {
  const v=getV5(state);
  const clauses=[
    v.promptLength === 'concise' ? 'prefer compact, non-redundant wording while retaining identity and lighting requirements' : v.promptLength === 'detailed' ? 'articulate concrete physical contact, optics and material relationships explicitly without inventing unseen details' : 'use balanced, non-repetitive photographic description',
    actions[v.handAction],
    climates[v.climate],
    reflections[v.reflection],
    v.layeredClothing && state.clothing.outer ? 'outer garment rests over the inner garment with independent folds, hem visibility and no intersecting fabric layers' : '',
    v.occlusion ? 'correct foreground-background occlusion: hands, pillows, clothing and furniture naturally hide the parts behind them' : '',
    v.relationLock ? 'preserve persistent object relationships, grounded support surfaces and locations across camera-angle changes' : '',
    v.causalClutter && state.disorder.level>0 ? 'only activity-caused small-scale clutter, supported by real surfaces with coherent contact shadows and no arbitrary objects' : ''
  ].filter(Boolean);
  return clauses.length ? 'Contextual physical relationships: '+clauses.join('; ') : '';
}

export function buildV5Negative(state:SceneState):string {
  const v=getV5(state);
  return [v.handAction!=='none'?'extra fingers, impossible finger grip, disconnected wrist':'',
    v.reflection!=='none'?'duplicated reflected person, impossible mirror orientation, reflected nonexistent light':'',
    v.layeredClothing?'intersecting garment layers, painted-on jacket':'',
    v.occlusion?'floating foreground elements, incorrect object overlap':'',
    v.causalClutter?'random staged junk':''].filter(Boolean).join(', ');
}
