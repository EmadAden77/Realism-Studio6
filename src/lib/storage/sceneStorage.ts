/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SceneState } from '../../types/scene.ts';
import { assembleMasterPrompt } from '../prompt/promptBuilder.ts';
import { INITIAL_SCENE_STATE } from '../presets/data.ts';

const STORAGE_KEY = 'realism_studio_saved_scenes';
const ACTIVE_SCENE_KEY = 'realism_studio_active_scene';

export interface SavedSceneSummary {
  id: string;
  title: string;
  updatedAt: number;
  environmentCategory: string;
  cameraMode: string;
  thumbnailPromptPreview: string;
  isFavorite?: boolean;
}

export function getSavedScenes(): SceneState[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultPresetLibrary();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDefaultPresetLibrary();
  } catch {
    return getDefaultPresetLibrary();
  }
}

export function saveSceneToLibrary(scene: SceneState): void {
  try {
    const scenes = getSavedScenes();
    const existingIndex = scenes.findIndex((s) => s.id === scene.id);
    const updatedScene = {
      ...scene,
      output: {
        ...scene.output,
        ...assembleMasterPrompt(scene),
        generationTimestamp: Date.now()
      }
    };

    if (existingIndex >= 0) {
      scenes[existingIndex] = updatedScene;
    } else {
      scenes.unshift(updatedScene);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenes));
  } catch (err) {
    console.error('Failed to save scene:', err);
  }
}

export function deleteSceneFromLibrary(sceneId: string): void {
  try {
    const scenes = getSavedScenes().filter((s) => s.id !== sceneId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenes));
  } catch (err) {
    console.error('Failed to delete scene:', err);
  }
}

export function exportSceneAsJson(scene: SceneState): void {
  // Strip heavy reference image base64 if present to maintain privacy and lean file size
  const exportable = {
    ...scene,
    identity: {
      ...scene.identity,
      referenceImageUrl: null // Do not export private biometric image in public JSON
    }
  };

  const jsonStr = JSON.stringify(exportable, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `realism-studio-${scene.id || 'scene'}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportPromptAsTxt(englishPrompt: string, negativePrompt: string, title: string): void {
  const content = [
    `REALISM STUDIO AI - GENERATED PROMPT`,
    `Scene: ${title}`,
    `Generated: ${new Date().toISOString()}`,
    `--------------------------------------------------`,
    `POSITIVE PROMPT:`,
    englishPrompt,
    `--------------------------------------------------`,
    `NEGATIVE PROMPT:`,
    negativePrompt,
    `--------------------------------------------------`,
    `Recommended Models: Midjourney v6.1 / Flux.1 Schnell / Stable Diffusion 3.5 / Ideogram v2`
  ].join('\n\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `prompt-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importSceneFromJson(fileContent: string): SceneState | null {
  try {
    const parsed = JSON.parse(fileContent) as SceneState;
    if (parsed && parsed.identity && parsed.camera && parsed.lighting) {
      return {
        ...parsed,
        id: `imported_${Date.now()}`
      };
    }
    return null;
  } catch (err) {
    console.error('Failed to import JSON scene:', err);
    return null;
  }
}

export function getDefaultPresetLibrary(): SceneState[] {
  const defaultScene = JSON.parse(JSON.stringify(INITIAL_SCENE_STATE)) as SceneState;
  
  // Scene 2: Saudi Villa Street at Night
  const streetScene = JSON.parse(JSON.stringify(INITIAL_SCENE_STATE)) as SceneState;
  streetScene.id = 'preset_saudi_street_night';
  streetScene.title = 'شارع سكني بالرياض ليلًا (ثوب سعودي)';
  streetScene.descriptionInput = 'وقوف هادئ في شارع سكني هادئ بالرياض ليلًا، ثوب سعودي أبيض أنيق وإضاءة أعمدة الإنارة الصفراء.';
  streetScene.environmentCategory = 'saudi_street';
  streetScene.locationPresetId = 'saudi_villa_street_night';
  streetScene.camera.mode = 'rear_main_self_capture';
  streetScene.camera.focalLengthEquivMm = 23;
  streetScene.camera.aperture = 'f/1.63';
  streetScene.lighting.mode = 'street_led';
  streetScene.clothing.upper = {
    id: 'upper_thobe_white',
    nameAr: 'ثوب سعودي أبيض',
    nameEn: 'Tailored white Saudi thobe',
    category: 'upper',
    colorAr: 'أبيض ناصع',
    colorEn: 'Pure crisp white',
    material: 'woven_thobe_fabric',
    fit: 'natural_athletic',
    wearState: 'fresh_clean'
  };
  streetScene.pose.presetId = 'standing_against_wall_leaning';
  streetScene.pose.category = 'standing';

  // Scene 3: Parked Car Selfie
  const carScene = JSON.parse(JSON.stringify(INITIAL_SCENE_STATE)) as SceneState;
  carScene.id = 'preset_parked_car_selfie';
  carScene.title = 'سيلفي مقعد السائق في السيارة';
  carScene.descriptionInput = 'سيلفي في مقعد السائق، حزام الأمان على الكتف، تيشيرت أسود سادة وإضاءة شاشات السيارة الليلية.';
  carScene.environmentCategory = 'vehicle';
  carScene.locationPresetId = 'vehicle_parked_driver_seat';
  carScene.vehicle.enabled = true;
  carScene.lighting.mode = 'vehicle_dashboard';
  carScene.pose.presetId = 'sitting_car_driver_wheel';
  carScene.pose.category = 'sitting';

  // Scene 4: Café Corner
  const cafeScene = JSON.parse(JSON.stringify(INITIAL_SCENE_STATE)) as SceneState;
  cafeScene.id = 'preset_cafe_corner';
  cafeScene.title = 'مقهى مختص - كوب فلات وايت';
  cafeScene.descriptionInput = 'جلسة في ركن هادئ بمقهى مختص، قميص بولو زيتي، كوب قهوة خزفي وإضاءة نهارية ممزوجة بسبوت لايت دافئ.';
  cafeScene.environmentCategory = 'cafe';
  cafeScene.locationPresetId = 'cafe_interior_corner';
  cafeScene.lighting.mode = 'mixed_practical';
  cafeScene.pose.presetId = 'sitting_cafe_table_coffee_cup';
  cafeScene.pose.category = 'sitting';

  return [defaultScene, streetScene, carScene, cafeScene];
}

export function saveActiveSceneState(scene: SceneState): void {
  try {
    localStorage.setItem(ACTIVE_SCENE_KEY, JSON.stringify(scene));
  } catch (err) {
    console.error('Failed to save active scene:', err);
  }
}

export function loadActiveSceneState(): SceneState {
  try {
    const raw = localStorage.getItem(ACTIVE_SCENE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.identity && parsed.camera) return parsed;
    }
  } catch {
    // fallback
  }
  return JSON.parse(JSON.stringify(INITIAL_SCENE_STATE));
}
