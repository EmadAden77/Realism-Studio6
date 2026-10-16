/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SceneState } from '../../types/scene.ts';
import { autoCorrectScene } from '../validation/rules.ts';

export interface InterpretationResult {
  updatedState: SceneState;
  extractedTokens: { [key: string]: string };
  confidence: number;
}

export function parseSceneDescription(input: string, currentState: SceneState): InterpretationResult {
  const text = input.toLowerCase().trim();
  const next = JSON.parse(JSON.stringify(currentState)) as SceneState;
  const tokens: { [key: string]: string } = {};

  // 1. Environment & Location
  if (text.includes('غرفة نوم') || text.includes('غرفة النوم') || text.includes('السرير') || text.includes('bedroom')) {
    next.environmentCategory = 'bedroom';
    next.locationPresetId = 'bedroom_bed_edge';
    tokens.environment = 'غرفة نوم سكنية';
  } else if (text.includes('شارع') || text.includes('فيلا') || text.includes('رصيف') || text.includes('street')) {
    next.environmentCategory = 'saudi_street';
    next.locationPresetId = 'saudi_villa_street_night';
    next.lighting.mode = 'street_led';
    next.camera.mode = 'rear_main_self_capture';
    next.camera.focalLengthEquivMm = 23;
    next.camera.aperture = 'f/1.63';
    tokens.environment = 'شارع سكني سعودي';
  } else if (text.includes('مقهى') || text.includes('كافيه') || text.includes('قهوة') || text.includes('cafe')) {
    next.environmentCategory = 'cafe';
    next.locationPresetId = 'cafe_interior_corner';
    tokens.environment = 'مقهى مختص';
  } else if (text.includes('سيارة') || text.includes('السيارة') || text.includes('سائق') || text.includes('car')) {
    next.environmentCategory = 'vehicle';
    next.locationPresetId = 'vehicle_parked_driver_seat';
    next.vehicle.enabled = true;
    tokens.environment = 'مقعد السيارة';
  } else if (text.includes('نادي') || text.includes('جيم') || text.includes('تمرين') || text.includes('gym')) {
    next.environmentCategory = 'gym';
    next.locationPresetId = 'gym_training_bench';
    tokens.environment = 'نادي رياضي';
  } else if (text.includes('بقالة') || text.includes('تموينات') || text.includes('grocery')) {
    next.environmentCategory = 'commercial';
    next.locationPresetId = 'commercial_baqala_exterior';
    tokens.environment = 'تموينات / بقالة الحي';
  }

  // 2. Camera Mode & Aspect Ratio
  if (text.includes('سيلفي') || text.includes('selfie') || text.includes('كاميرا امامية') || text.includes('كاميرا أمامية')) {
    next.camera.mode = 'front_selfie';
    next.camera.focalLengthEquivMm = 21;
    next.camera.aperture = 'f/2.0';
    next.camera.aspectRatio = '9:16';
    tokens.camera = 'كاميرا أمامية شاومي 15 ألترا 21mm f/2.0';
  } else if (text.includes('مرآة') || text.includes('مراية') || text.includes('mirror')) {
    next.camera.mode = 'mirror_selfie';
    tokens.camera = 'سيلفي مرآة مع انعكاس الهاتف';
  } else if (text.includes('خلفية') || text.includes('rear') || text.includes('كاميرا رئيسية')) {
    next.camera.mode = 'rear_main_self_capture';
    next.camera.focalLengthEquivMm = 23;
    next.camera.aperture = 'f/1.63';
    tokens.camera = 'كاميرا خلفية رئيسية 23mm مستشعر 1 بوصة';
  }

  // 3. Lighting Mode & Time of Day
  if (text.includes('شاشة') || text.includes('الشاشة فقط') || text.includes('screen only') || text.includes('ضوء الشاشة')) {
    next.lighting.mode = 'phone_screen_only';
    next.lighting.timeOfDay = 'night';
    next.lighting.strictRealismLock = true;
    next.lighting.secondarySourceEnabled = false;
    tokens.lighting = 'إضاءة شاشة الهاتف فقط (غرفة مظلمة)';
  } else if (text.includes('نهار') || text.includes('صباح') || text.includes('daylight') || text.includes('شمس')) {
    next.lighting.mode = 'natural_daylight';
    next.lighting.timeOfDay = 'day';
    tokens.lighting = 'ضوء نهار طبيعي';
  } else if (text.includes('عصر') || text.includes('غروب') || text.includes('sunset') || text.includes('ذهبي')) {
    next.lighting.mode = 'late_afternoon';
    next.lighting.timeOfDay = 'sunset';
    tokens.lighting = 'شمس العصر الذهبية';
  } else if (text.includes('ليل') || text.includes('بالليل') || text.includes('night')) {
    if (next.lighting.mode !== 'phone_screen_only') {
      next.lighting.timeOfDay = 'night';
      if (next.environmentCategory === 'saudi_street') {
        next.lighting.mode = 'street_led';
      }
    }
    tokens.time = 'ليل';
  }

  // 4. Clothing
  if (text.includes('فانيلة') || text.includes('كت') || text.includes('حفر') || text.includes('tank top')) {
    next.clothing.upper = {
      id: 'upper_tank_white',
      nameAr: 'فانيلة حفر بيضاء قطنية',
      nameEn: 'White ribbed-cotton sleeveless tank top',
      category: 'upper',
      colorAr: 'أبيض قطني',
      colorEn: 'Off-white natural cotton',
      material: 'lightweight_cotton',
      fit: 'natural_athletic',
      wearState: 'lived_in'
    };
    tokens.upper = 'فانيلة قطنية بيضاء بدون أكمام';
  } else if (text.includes('تيشيرت') || text.includes('تي شيرت') || text.includes('t-shirt') || text.includes('tshirt')) {
    const isBlack = text.includes('اسود') || text.includes('أسود') || text.includes('black');
    next.clothing.upper = {
      id: isBlack ? 'upper_tee_black' : 'upper_tee_white',
      nameAr: isBlack ? 'تيشيرت أسود سادة' : 'تيشيرت أبيض سادة',
      nameEn: isBlack ? 'Plain black cotton crewneck T-shirt' : 'Plain white cotton crewneck T-shirt',
      category: 'upper',
      colorAr: isBlack ? 'أسود' : 'أبيض قطني',
      colorEn: isBlack ? 'Black' : 'Clean white',
      material: 'medium_cotton',
      fit: 'relaxed',
      wearState: 'lived_in'
    };
    tokens.upper = isBlack ? 'تيشيرت قطني أسود سادة' : 'تيشيرت قطني أبيض سادة';
  } else if (text.includes('ثوب') || text.includes('thobe')) {
    next.clothing.upper = {
      id: 'upper_thobe_white',
      nameAr: 'ثوب سعودي أبيض',
      nameEn: 'Traditional tailored white Saudi thobe',
      category: 'upper',
      colorAr: 'أبيض ناصع',
      colorEn: 'Pure white crisp fabric',
      material: 'woven_thobe_fabric',
      fit: 'natural_athletic',
      wearState: 'fresh_clean'
    };
    tokens.upper = 'ثوب سعودي أبيض';
  }

  // Lower garment
  if (text.includes('شورت كحلي') || (text.includes('شورت') && (text.includes('كحلي') || text.includes('ازرق') || text.includes('navy')))) {
    next.clothing.lower = {
      id: 'lower_navy_shorts',
      nameAr: 'شورت كحلي مريح',
      nameEn: 'Navy-blue cotton lounge shorts',
      category: 'lower',
      colorAr: 'كحلي داكن',
      colorEn: 'Deep navy blue',
      material: 'medium_cotton',
      fit: 'relaxed',
      wearState: 'lightly_creased'
    };
    tokens.lower = 'شورت قطني كحلي داكن';
  } else if (text.includes('شورت اسود') || text.includes('شورت أسود') || (text.includes('شورت') && text.includes('black'))) {
    next.clothing.lower = {
      id: 'lower_black_shorts',
      nameAr: 'شورت أسود رياضي',
      nameEn: 'Black relaxed-fit lounge shorts',
      category: 'lower',
      colorAr: 'أسود',
      colorEn: 'Matte black',
      material: 'medium_cotton',
      fit: 'relaxed',
      wearState: 'lightly_creased'
    };
    tokens.lower = 'شورت قطني أسود';
  } else if (text.includes('جينز') || text.includes('jeans')) {
    next.clothing.lower = {
      id: 'lower_jeans_blue',
      nameAr: 'بنطلون جينز كاجوال',
      nameEn: 'Classic indigo blue denim jeans',
      category: 'lower',
      colorAr: 'أزرق داكن',
      colorEn: 'Indigo denim',
      material: 'denim',
      fit: 'relaxed',
      wearState: 'lived_in'
    };
    tokens.lower = 'بنطلون جينز أزرق';
  }

  // 5. Eyewear
  if (text.includes('بدون نظارة') || text.includes('بدون نظارات') || text.includes('بلا نظارة') || text.includes('no glasses')) {
    next.eyewear.mode = 'no_glasses';
    tokens.eyewear = 'بدون نظارة';
  } else if (text.includes('نظارة طبية') || text.includes('نظارة') || text.includes('glasses')) {
    next.eyewear.mode = 'prescription_glasses';
    tokens.eyewear = 'نظارة طبية';
  }

  // 6. Facial Expression
  if (text.includes('بدون ابتسامة') || text.includes('محايد') || text.includes('no smile') || text.includes('ملامح هادئة')) {
    next.expression.presetId = 'neutral';
    next.expression.intensity = 'subtle';
    tokens.expression = 'محايد هادئ بدون ابتسامة';
  } else if (text.includes('ابتسامة خفيفة') || text.includes('ابتسامة') || text.includes('smile')) {
    next.expression.presetId = 'small_genuine_smile';
    next.expression.intensity = 'subtle';
    tokens.expression = 'ابتسامة عفوية خفيفة';
  } else if (text.includes('تعب') || text.includes('نعاس') || text.includes('sleepy') || text.includes('tired')) {
    next.expression.presetId = 'sleepy_unimpressed';
    next.expression.intensity = 'subtle';
    tokens.expression = 'نعاس خفيف وغير متكلف';
  }

  // Run auto-correction to eliminate any contradictions resulting from text input
  const { correctedState } = autoCorrectScene(next);
  correctedState.descriptionInput = input;

  return {
    updatedState: correctedState,
    extractedTokens: tokens,
    confidence: Object.keys(tokens).length > 2 ? 0.95 : 0.75
  };
}
