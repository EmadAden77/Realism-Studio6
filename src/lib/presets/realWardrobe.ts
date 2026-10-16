import type {ClothingItem, SceneState, FabricMaterial} from '../../types/scene';

export type WardrobeCategory='upper'|'lower'|'outer'|'footwear';
export type RealGarment={id:string;nameAr:string;nameEn:string;category:WardrobeCategory;colorAr:string;colorEn:string;material:FabricMaterial;fit:ClothingItem['fit'];wear:ClothingItem['wearState'];detailEn:string;};

type Entry=[string,string,string,string,FabricMaterial,ClothingItem['fit'],string];
const groups:Record<WardrobeCategory,Entry[]>={
 upper:[
 ['white_crew','تيشيرت أبيض قطني سادة','White cotton crew-neck T-shirt','أبيض','medium_cotton','natural_athletic','matte jersey knit and ribbed collar'],
 ['black_crew','تيشيرت أسود قطني سادة','Black cotton crew-neck T-shirt','أسود','medium_cotton','relaxed','soft cotton jersey'],
 ['navy_crew','تيشيرت كحلي قطني','Navy cotton T-shirt','كحلي','medium_cotton','relaxed','natural cotton drape'],
 ['grey_marl','تيشيرت رمادي ميلانج','Heather grey jersey T-shirt','رمادي ميلانج','jersey_knit','relaxed','heathered cotton-blend surface'],
 ['olive_crew','تيشيرت زيتي','Olive green T-shirt','زيتي','medium_cotton','relaxed','washed matte jersey'],
 ['cream_boxy','تيشيرت أوف وايت واسع','Ecru boxy heavyweight T-shirt','أوف وايت','heavy_cotton','loose','thick structured cotton'],
 ['white_tank','فانيلة حفر بيضاء قطنية','White ribbed cotton tank top','أبيض','lightweight_cotton','natural_athletic','vertical ribs and natural armhole tension'],
 ['black_tank','فانيلة حفر سوداء','Black cotton sleeveless tank','أسود','lightweight_cotton','natural_athletic','light ribbed knit'],
 ['white_sport','تيشيرت رياضي أبيض','White performance sports tee','أبيض','athletic_polyester','natural_athletic','breathable matte technical fabric'],
 ['charcoal_sport','تيشيرت رياضي فحمي','Charcoal athletic T-shirt','فحمي','athletic_polyester','natural_athletic','subtle mesh texture'],
 ['polo_navy','بولو كحلي قطني','Navy cotton piqué polo','كحلي','medium_cotton','natural_athletic','piqué surface and structured collar'],
 ['polo_sand','بولو رملي','Sand-beige piqué polo','رملي','medium_cotton','relaxed','short placket and cotton piqué'],
 ['linen_white','قميص كتان أبيض بأكمام طويلة','White linen-blend casual shirt','أبيض','linen_blend','relaxed','natural wrinkles and open collar'],
 ['linen_blue','قميص كتان أزرق فاتح','Light-blue linen shirt','أزرق فاتح','linen_blend','relaxed','loose linen drape'],
 ['oxford_blue','قميص أكسفورد أزرق','Light-blue Oxford button-down shirt','أزرق','heavy_cotton','natural_athletic','woven Oxford texture'],
 ['shirt_burgundy','قميص خمري بأكمام طويلة','Burgundy cotton dress shirt','خمري','medium_cotton','natural_athletic','woven cotton collar and cuffs'],
 ['shirt_olive','قميص زيتي بأكمام مطوية','Olive casual button shirt','زيتي','linen_blend','relaxed','rolled sleeves and genuine seam folds'],
 ['thobe_white','ثوب سعودي أبيض قطني','White Saudi cotton thobe','أبيض','woven_thobe_fabric','relaxed','standing collar and realistic vertical drape'],
 ['thobe_navy','ثوب كحلي مطفي','Matte navy Saudi thobe','كحلي','woven_thobe_fabric','relaxed','restrained woven sheen'],
 ['thobe_grey','ثوب رمادي فاتح','Light-grey Saudi thobe','رمادي فاتح','woven_thobe_fabric','relaxed','clean seams and believable folds']
 ],
 lower:[
 ['short_navy','شورت كحلي قطني قصير','Navy cotton lounge shorts','كحلي','medium_cotton','relaxed','elastic waistband and mid-thigh hem'],
 ['short_black','شورت أسود رياضي','Black athletic shorts','أسود','athletic_polyester','relaxed','matte fabric and side seams'],
 ['short_grey','شورت رمادي قطني','Grey jersey lounge shorts','رمادي','jersey_knit','relaxed','soft jersey fold breaks'],
 ['short_beige','شورت بيج كاجوال','Beige chino shorts','بيج','heavy_cotton','relaxed','structured waistband and pockets'],
 ['short_olive','شورت زيتي','Olive twill shorts','زيتي','heavy_cotton','relaxed','matte cotton twill'],
 ['short_blue','شورت أزرق رياضي','Blue running shorts','أزرق','athletic_polyester','relaxed','light running fabric'],
 ['jogger_black','بنطلون رياضي أسود','Black cotton joggers','أسود','jersey_knit','relaxed','drawstring waistband and ankle cuffs'],
 ['jogger_grey','بنطلون رياضي رمادي','Heather grey sweatpants','رمادي','heavy_cotton','relaxed','fleece texture and natural knee creases'],
 ['jeans_dark','جينز أزرق داكن مستقيم','Dark indigo straight-cut jeans','أزرق داكن','denim','natural_athletic','denim twill and hip whiskers'],
 ['jeans_light','جينز أزرق متوسط','Medium-wash relaxed jeans','أزرق متوسط','denim','relaxed','realistic faded denim'],
 ['chino_khaki','بنطلون تشينو كاكي','Khaki cotton chinos','كاكي','heavy_cotton','natural_athletic','cotton twill and crease lines'],
 ['chino_black','بنطلون تشينو أسود','Black tapered chinos','أسود','heavy_cotton','natural_athletic','matte structured cotton'],
 ['trouser_grey','بنطلون قماش رمادي','Grey tailored trousers','رمادي','linen_blend','natural_athletic','pressed creases and natural hip folds'],
 ['trouser_brown','بنطلون قماش بني','Brown casual trousers','بني','linen_blend','relaxed','woven neutral-finish fabric']
 ],
 outer:[
 ['hoodie_grey','هودي رمادي بسيط','Grey cotton hoodie','رمادي','heavy_cotton','relaxed','heavy brushed cotton and drawcords'],
 ['hoodie_black','هودي أسود مطفي','Black pullover hoodie','أسود','heavy_cotton','loose','thick matte sweatshirt fabric'],
 ['zip_navy','جاكيت رياضي بسحاب كحلي','Navy zip-up training jacket','كحلي','athletic_polyester','natural_athletic','rib cuffs and front zip'],
 ['denim_blue','جاكيت جينز أزرق','Blue denim trucker jacket','أزرق جينز','denim','relaxed','denim seams and chest pockets'],
 ['bomber_black','جاكيت بومبر أسود','Black lightweight bomber jacket','أسود','cotton_poly_blend','relaxed','ribbed neckline and matte shell'],
 ['overshirt_olive','أوفرشيرت زيتي','Olive cotton overshirt','زيتي','heavy_cotton','relaxed','button front and patch pockets'],
 ['cardigan_beige','كارديغان بيج خفيف','Beige cotton knit cardigan','بيج','jersey_knit','relaxed','soft layered knit'],
 ['windbreaker_charcoal','جاكيت خفيف فحمي','Charcoal windbreaker','فحمي','athletic_polyester','relaxed','fine matte wind-resistant shell']
 ],
 footwear:[
 ['sneakers_white','حذاء سنيكرز أبيض','Plain white low-top sneakers','أبيض','cotton_poly_blend','natural_athletic','lace-up low-top construction'],
 ['sneakers_black','حذاء سنيكرز أسود','Black casual sneakers','أسود','cotton_poly_blend','natural_athletic','matte uppers and rubber sole'],
 ['running_grey','حذاء ركض رمادي','Grey technical running shoes','رمادي','athletic_polyester','natural_athletic','mesh upper and foam midsole'],
 ['slides_black','شبشب منزلي أسود','Black everyday slides','أسود','athletic_polyester','relaxed','matte slip-on profile'],
 ['sandals_brown','صندل بني بسيط','Brown everyday sandals','بني','cotton_poly_blend','relaxed','adjustable straps and grounded sole'],
 ['loafers_brown','حذاء لوفر بني','Brown casual loafers','بني','cotton_poly_blend','natural_athletic','understated leather-like surface']
 ]
};
const colors:Record<string,string>={'أبيض':'white','أسود':'black','كحلي':'navy blue','رمادي':'grey','رمادي ميلانج':'heather grey','زيتي':'olive green','أوف وايت':'ecru','فحمي':'charcoal','رملي':'sand beige','أزرق فاتح':'light blue','أزرق':'blue','خمري':'burgundy','رمادي فاتح':'light grey','بيج':'beige','أزرق داكن':'dark indigo','أزرق متوسط':'medium blue','كاكي':'khaki','بني':'brown','أزرق جينز':'denim blue'};
export const REAL_GARMENTS:RealGarment[]=Object.entries(groups).flatMap(([category,entries])=>entries.map(([id,nameAr,nameEn,colorAr,material,fit,detailEn])=>({
 id:category+'_'+id,nameAr,nameEn,category:category as WardrobeCategory,colorAr,colorEn:colors[colorAr]||colorAr,material,fit,wear:'lightly_creased' as const,detailEn
})));
export function applyRealGarment(state:SceneState,item:RealGarment):SceneState{
 const garment:ClothingItem={id:item.id,nameAr:item.nameAr,nameEn:item.nameEn,category:item.category==='footwear'?'footwear':item.category==='outer'?'outer':item.category,colorAr:item.colorAr,colorEn:item.colorEn,material:item.material,fit:item.fit,wearState:item.wear};
 return {...state,clothing:{...state.clothing,activeOutfitPresetId:'custom_real_wardrobe', [item.category]:garment}};
}
