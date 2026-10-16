import React, { useState, useRef, useEffect } from 'react';
import {
  Bookmark,
  Trash2,
  Copy,
  Upload,
  Layers,
  ArrowRight,
  Clock,
  Sparkles,
  Check,
  Camera,
  History,
  Download
} from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';
import {
  getSavedScenes,
  deleteSceneFromLibrary,
  saveSceneToLibrary,
  importSceneFromJson
} from '../../lib/storage/sceneStorage';
import { SceneSnapshot, SceneState } from '../../types/scene';
import { loadSavedSnapshots, persistSnapshots, createSceneSnapshot, restoreSnapshot as restoreSnapshotUtil, migrateSceneSchema } from '../../lib/scene/sceneSnapshots';

interface LibraryViewProps {
  onLoadAndNavigateToHome: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onLoadAndNavigateToHome }) => {
  const { state, loadScene } = useSceneStore();
  const [scenes, setScenes] = useState<SceneState[]>(getSavedScenes());
  const [snapshots, setSnapshots] = useState<SceneSnapshot[]>(loadSavedSnapshots());
  const [viewMode, setViewMode] = useState<'scenes' | 'snapshots'>('scenes');
  const [filter, setFilter] = useState<string>('all');
  const [newSnapshotName, setNewSnapshotName] = useState('');
  const [snapshotSavedNotice, setSnapshotSavedNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshList = () => {
    setScenes(getSavedScenes());
    setSnapshots(loadSavedSnapshots());
  };

  const handleSelectScene = (scene: SceneState) => {
    loadScene(scene);
    onLoadAndNavigateToHome();
  };

  const handleRestoreSnapshot = (snapshot: SceneSnapshot) => {
    const restored = restoreSnapshotUtil(snapshot, state);
    loadScene(restored);
    onLoadAndNavigateToHome();
  };

  const handleTakeSnapshot = () => {
    const snap = createSceneSnapshot(state, newSnapshotName || undefined);
    const updated = [snap, ...snapshots].slice(0, 50);
    persistSnapshots(updated);
    setSnapshots(updated);
    setNewSnapshotName('');
    setSnapshotSavedNotice(true);
    setTimeout(() => setSnapshotSavedNotice(false), 2500);
  };

  const handleDeleteSnapshot = (id: string) => {
    const updated = snapshots.filter((s) => s.id !== id);
    persistSnapshots(updated);
    setSnapshots(updated);
  };

  const handleDelete = (e: React.MouseEvent, sceneId: string) => {
    e.stopPropagation();
    if (confirm('هل أنت متأكد من حذف هذا المشهد من المكتبة؟')) {
      deleteSceneFromLibrary(sceneId);
      refreshList();
    }
  };

  const handleDuplicate = (e: React.MouseEvent, scene: SceneState) => {
    e.stopPropagation();
    const duplicated: SceneState = {
      ...scene,
      id: `scene_${Date.now()}`,
      title: `${scene.title} (نسخة)`
    };
    saveSceneToLibrary(duplicated);
    refreshList();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);
          // Fulfills TEST 12: Supported schema migration and validation
          const migrated = migrateSceneSchema(parsed);
          saveSceneToLibrary(migrated);
          refreshList();
          alert('تم استيراد المشهد وترقيته بنجاح إلى النسخة V3.0');
        } catch {
          alert('تعذر استيراد الملف، تأكد من صحة تنسيق JSON لمشهد Realism Studio AI');
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredScenes = filter === 'all'
    ? scenes
    : scenes.filter((s) => s.environmentCategory === filter);

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-3">
      {/* Header & Import */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-400" />
            مكتبة المشاهد المحفوظة (Saved Scenes)
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            استرجع مشاهدك المفضلة أو قم باستيراد وتصدير إعدادات الكاميرا والبيئة
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".json,application/json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold border border-neutral-700 transition"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>استيراد ملف JSON</span>
          </button>
        </div>
      </div>

      {/* View Mode: Saved Scenes vs Snapshots */}
      <div className="flex items-center justify-between gap-3 p-1 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('scenes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'scenes'
                ? 'bg-amber-500 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>المشاهد المحفوظة ({scenes.length})</span>
          </button>
          <button
            onClick={() => setViewMode('snapshots')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'snapshots'
                ? 'bg-amber-500 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>اللقطات السريعة V3 ({snapshots.length})</span>
          </button>
        </div>

        {viewMode === 'snapshots' && (
          <div className="flex items-center gap-1.5 px-2">
            <input
              type="text"
              placeholder="اسم اللقطة..."
              value={newSnapshotName}
              onChange={(e) => setNewSnapshotName(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleTakeSnapshot}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-bold transition flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>أخذ لقطة للمشهد الحالي</span>
            </button>
          </div>
        )}
      </div>

      {snapshotSavedNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>تم حفظ لقطة المشهد الحالية بنجاح (بدون تضمين بيانات الصور الخاصة).</span>
        </div>
      )}

      {viewMode === 'snapshots' ? (
        /* Snapshots Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {snapshots.length === 0 ? (
            <div className="col-span-2 text-center p-8 bg-neutral-900/40 border border-neutral-800 rounded-2xl text-xs text-neutral-400">
              لا توجد لقطات محفوظة حاليًا. اضغط على "أخذ لقطة للمشهد الحالي" لحفظ نسخة كاملة للرجوع إليها في أي وقت.
            </div>
          ) : (
            snapshots.map((snap) => (
              <div
                key={snap.id}
                className="bg-neutral-900/70 border border-neutral-800 hover:border-amber-500/50 rounded-2xl p-4 text-xs transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-bold text-white text-sm block">
                      {snap.name}
                    </span>
                    <span className="text-[10px] bg-neutral-950 border border-neutral-800 px-2 py-0.5 rounded text-neutral-400 font-mono">
                      {new Date(snap.timestamp).toLocaleTimeString('ar-SA')}
                    </span>
                  </div>

                  <p className="text-neutral-400 text-[11px] line-clamp-2 mb-3">
                    {snap.description || snap.promptBackup}
                  </p>

                  <div className="flex flex-wrap gap-1.5 text-[10px] text-neutral-400 mb-3">
                    <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                      {snap.sceneState.camera.mode === 'front_selfie' ? 'سيلفي 21mm' : 'خلفية 23mm'}
                    </span>
                    <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                      {snap.sceneState.lighting.mode}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-800/80 pt-2.5 mt-auto">
                  <button
                    onClick={() => handleRestoreSnapshot(snap)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    <span>استعادة هذه اللقطة</span>
                    <ArrowRight className="w-3 h-3 rotate-180" />
                  </button>

                  <button
                    onClick={() => handleDeleteSnapshot(snap.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition"
                    title="حذف اللقطة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Saved Scenes Filter & Grid */
        <>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {[
              { id: 'all', labelAr: 'الكل' },
              { id: 'bedroom', labelAr: 'غرف نوم' },
              { id: 'saudi_street', labelAr: 'شوارع سعودية' },
              { id: 'vehicle', labelAr: 'سيارات' },
              { id: 'cafe', labelAr: 'مقاهي' },
              { id: 'gym', labelAr: 'أندية رياضية' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl transition ${
                  filter === f.id
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {f.labelAr}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredScenes.map((scene) => (
          <div
            key={scene.id}
            onClick={() => handleSelectScene(scene)}
            className="bg-neutral-900/70 border border-neutral-800 hover:border-amber-500/50 rounded-2xl p-4 text-xs transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-bold text-white text-sm block group-hover:text-amber-400 transition">
                  {scene.title}
                </span>
                <span className="text-[10px] bg-neutral-950 border border-neutral-800 px-2 py-0.5 rounded text-neutral-400 font-mono">
                  {scene.environmentCategory}
                </span>
              </div>

              <p className="text-neutral-400 line-clamp-2 text-[11px] leading-relaxed mb-3">
                {scene.descriptionInput || scene.output.englishPrompt}
              </p>

              <div className="flex flex-wrap gap-1.5 text-[10px] text-neutral-400 mb-3">
                <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                  {scene.camera.mode === 'front_selfie' ? 'سيلفي 21mm' : 'خلفية 23mm'}
                </span>
                <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                  {scene.lighting.mode}
                </span>
                <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                  {scene.camera.aspectRatio}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-800/80 pt-2.5 mt-auto">
              <span className="text-[10px] text-amber-400 flex items-center gap-1 font-medium">
                تفعيل المشهد
                <ArrowRight className="w-3 h-3 rotate-180" />
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => handleDuplicate(e, scene)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                  title="تكرار المشهد"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => handleDelete(e, scene.id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition"
                  title="حذف المشهد"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )}
</div>
  );
};
