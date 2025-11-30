import React, { useState } from 'react';
import { Upload, FileText, Download, Trash2, Eye, Check, X, Home, Map, User, File, Briefcase, Target, ChevronRight, Plus, Search, Star, Clock, MessageSquare } from 'lucide-react';

// ============================================
// FILE UPLOAD COMPONENT
// ============================================
const FileUpload = ({ onUpload, accept = ".pdf,.doc,.docx,.png,.jpg" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) simulateUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) simulateUpload(file);
  };

  const simulateUpload = (file) => {
    setIsUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFile({ name: file.name, size: file.size, url: '#' });
          onUpload?.({ name: file.name, url: '#' });
          return 100;
        }
        return p + 20;
      });
    }, 300);
  };

  if (uploadedFile) {
    return (
      <div className="border border-emerald-500/50 bg-emerald-500/5 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-white font-medium truncate max-w-[200px]">{uploadedFile.name}</p>
              <p className="text-emerald-400 text-sm">✓ Téléchargé avec succès</p>
            </div>
          </div>
          <button onClick={() => setUploadedFile(null)} className="text-slate-400 hover:text-red-400 p-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
        isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 hover:border-slate-600'
      }`}
    >
      <input type="file" accept={accept} onChange={handleFileSelect} className="hidden" id="file-input" />
      <label htmlFor="file-input" className="cursor-pointer block">
        {isUploading ? (
          <div>
            <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-slate-700 border-t-emerald-500 animate-spin" />
            <p className="text-slate-400 mb-2">Téléchargement en cours...</p>
            <div className="w-48 mx-auto bg-slate-700 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-500" />
            <p className="text-white font-medium mb-1">Glissez-déposez votre fichier ici</p>
            <p className="text-slate-400 text-sm mb-3">ou cliquez pour sélectionner</p>
            <p className="text-slate-500 text-xs">PDF, DOC, DOCX, PNG, JPG • Max 10MB</p>
          </>
        )}
      </label>
    </div>
  );
};

// ============================================
// DASHBOARD PAGE
// ============================================
const DashboardPage = ({ onNavigate, userData }) => (
  <div className="p-8">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">Bonjour, {userData.firstName} 👋</h1>
      <p className="text-slate-400">Bienvenue sur votre tableau de bord JobSeed.</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">🔮</div>
          <div>
            <p className="text-slate-400 text-sm">Tests complétés</p>
            <p className="text-2xl font-bold text-white">{userData.testsCompleted}/3</p>
          </div>
        </div>
        <div className="mt-4 w-full bg-slate-700 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(userData.testsCompleted/3)*100}%` }} />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl">🗺️</div>
          <div>
            <p className="text-slate-400 text-sm">Parcours du Héros</p>
            <p className="text-2xl font-bold text-white">Station {userData.currentStation}/12</p>
          </div>
        </div>
        <div className="mt-4 w-full bg-slate-700 rounded-full h-2">
          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(userData.currentStation/12)*100}%` }} />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">📄</div>
          <div>
            <p className="text-slate-400 text-sm">Documents</p>
            <p className="text-2xl font-bold text-white">{userData.documentsCount}</p>
          </div>
        </div>
        <button onClick={() => onNavigate('documents')} className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1">
          Voir mes documents <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Actions rapides */}
    <h2 className="text-xl font-semibold text-white mb-4">Actions rapides</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <button onClick={() => onNavigate('journey')} className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-xl p-6 text-left hover:border-emerald-500/50 transition-all">
        <span className="text-3xl mb-3 block">🗺️</span>
        <h3 className="text-white font-semibold mb-1">Continuer le Parcours</h3>
        <p className="text-slate-400 text-sm">Station {userData.currentStation} - L'Appel</p>
      </button>

      <button onClick={() => onNavigate('new-cv')} className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left hover:border-slate-700 transition-all">
        <span className="text-3xl mb-3 block">✨</span>
        <h3 className="text-white font-semibold mb-1">Générer un CV</h3>
        <p className="text-slate-400 text-sm">IA personnalisée I.C.A.R.E.</p>
      </button>

      <button onClick={() => onNavigate('offers')} className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left hover:border-slate-700 transition-all">
        <span className="text-3xl mb-3 block">🔍</span>
        <h3 className="text-white font-semibold mb-1">Rechercher des offres</h3>
        <p className="text-slate-400 text-sm">IA + jobup.ch, indeed...</p>
      </button>

      <button onClick={() => onNavigate('interviews')} className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left hover:border-slate-700 transition-all">
        <span className="text-3xl mb-3 block">🎯</span>
        <h3 className="text-white font-semibold mb-1">Préparer un entretien</h3>
        <p className="text-slate-400 text-sm">Questions ciblées I.C.A.R.E.</p>
      </button>
    </div>

    {/* Profil I.C.A.R.E. */}
    <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Votre profil I.C.A.R.E.</h2>
      <div className="grid grid-cols-5 gap-4">
        {[
          { key: 'I', label: 'Identité', score: userData.icare?.I || 3.2, color: 'bg-red-500' },
          { key: 'C', label: 'Capacités', score: userData.icare?.C || 4.1, color: 'bg-orange-500' },
          { key: 'A', label: 'Appartenance', score: userData.icare?.A || 3.8, color: 'bg-yellow-500' },
          { key: 'R', label: 'Risque', score: userData.icare?.R || 2.5, color: 'bg-green-500' },
          { key: 'E', label: 'Estime', score: userData.icare?.E || 3.9, color: 'bg-blue-500' },
        ].map((dim) => (
          <div key={dim.key} className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#334155" strokeWidth="6" />
                <circle 
                  cx="32" cy="32" r="28" fill="none" 
                  className={dim.color.replace('bg-', 'stroke-')}
                  strokeWidth="6"
                  strokeDasharray={`${(dim.score/5)*176} 176`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold">{dim.score.toFixed(1)}</span>
            </div>
            <p className="text-slate-400 text-sm">{dim.label}</p>
            {dim.score < 3 && <span className="text-xs text-red-400">⚠️ Blocage</span>}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================
// JOURNEY PAGE
// ============================================
const JourneyPage = ({ onNavigate, userData }) => {
  const stations = [
    { num: 1, name: "Le Monde Ordinaire", icon: "🏠", desc: "Votre situation actuelle" },
    { num: 2, name: "L'Appel à l'Aventure", icon: "📯", desc: "Le déclencheur du changement" },
    { num: 3, name: "Le Refus de l'Appel", icon: "🚫", desc: "Vos résistances intérieures" },
    { num: 4, name: "La Rencontre du Mentor", icon: "🧙", desc: "Guides et ressources" },
    { num: 5, name: "Le Passage du Seuil", icon: "🚪", desc: "L'engagement dans le voyage" },
    { num: 6, name: "Épreuves & Alliés", icon: "⚔️", desc: "Défis et soutiens" },
    { num: 7, name: "L'Approche de la Caverne", icon: "🕳️", desc: "Préparation au grand défi" },
    { num: 8, name: "L'Épreuve Suprême", icon: "🐉", desc: "La confrontation majeure" },
    { num: 9, name: "La Récompense", icon: "🏆", desc: "Les fruits de vos efforts" },
    { num: 10, name: "Le Chemin du Retour", icon: "🛤️", desc: "Intégration des apprentissages" },
    { num: 11, name: "La Résurrection", icon: "🌅", desc: "La transformation finale" },
    { num: 12, name: "Le Retour avec l'Élixir", icon: "✨", desc: "Partage de votre sagesse" },
  ];

  const getStatus = (num) => {
    if (num < userData.currentStation) return 'completed';
    if (num === userData.currentStation) return 'current';
    return 'locked';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Le Parcours du Héros 🗺️</h1>
        <p className="text-slate-400">Votre voyage de transformation professionnelle en 12 stations.</p>
      </div>

      {/* Progress bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400">Progression</span>
          <span className="text-white font-semibold">{Math.round((userData.currentStation-1)/12*100)}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all" 
            style={{ width: `${((userData.currentStation-1)/12)*100}%` }} 
          />
        </div>
      </div>

      {/* Stations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map((station) => {
          const status = getStatus(station.num);
          return (
            <button
              key={station.num}
              onClick={() => status !== 'locked' && onNavigate(`station-${station.num}`)}
              disabled={status === 'locked'}
              className={`text-left p-6 rounded-xl border transition-all ${
                status === 'completed' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50' 
                  : status === 'current'
                  ? 'bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-emerald-500/50 ring-2 ring-emerald-500/30'
                  : 'bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{station.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-500 text-sm">Station {station.num}</span>
                    {status === 'completed' && <Check className="w-4 h-4 text-emerald-400" />}
                    {status === 'current' && <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">En cours</span>}
                    {status === 'locked' && <span className="text-slate-600">🔒</span>}
                  </div>
                  <h3 className="text-white font-semibold mb-1">{station.name}</h3>
                  <p className="text-slate-400 text-sm">{station.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// PROFILE PAGE
// ============================================
const ProfilePage = ({ userData }) => {
  const [activeTab, setActiveTab] = useState('icare');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Mon Profil 👤</h1>
        <p className="text-slate-400">Vos résultats psychométriques et votre profil narratif.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'icare', label: 'I.C.A.R.E.', icon: '🎯' },
          { id: 'riasec', label: 'RIASEC', icon: '🔮' },
          { id: 'enneagram', label: 'Ennéagramme', icon: '⭐' },
          { id: 'summary', label: 'Synthèse', icon: '📊' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === tab.id 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* I.C.A.R.E. Tab */}
      {activeTab === 'icare' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Profil I.C.A.R.E.</h2>
          <div className="space-y-4">
            {[
              { key: 'I', label: 'Identité', desc: 'Clarté sur qui vous êtes professionnellement', score: userData.icare?.I || 3.2, color: 'bg-red-500' },
              { key: 'C', label: 'Capacités', desc: 'Confiance en vos compétences', score: userData.icare?.C || 4.1, color: 'bg-orange-500' },
              { key: 'A', label: 'Appartenance', desc: 'Sentiment d\'être à votre place', score: userData.icare?.A || 3.8, color: 'bg-yellow-500' },
              { key: 'R', label: 'Risque', desc: 'Capacité à prendre des risques calculés', score: userData.icare?.R || 2.5, color: 'bg-green-500' },
              { key: 'E', label: 'Estime', desc: 'Valeur que vous vous accordez', score: userData.icare?.E || 3.9, color: 'bg-blue-500' },
            ].map((dim) => (
              <div key={dim.key} className="flex items-center gap-4">
                <div className="w-24 text-right">
                  <span className="text-white font-medium">{dim.label}</span>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-slate-700 rounded-full h-4">
                    <div className={`${dim.color} h-4 rounded-full transition-all relative`} style={{ width: `${(dim.score/5)*100}%` }}>
                      <span className="absolute right-2 text-white text-xs font-bold leading-4">{dim.score.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mt-1">{dim.desc}</p>
                </div>
                {dim.score < 3 && <span className="text-red-400 text-sm">⚠️ Blocage identifié</span>}
              </div>
            ))}
          </div>
          {userData.icare?.R < 3 && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 font-medium mb-1">🎯 Blocage principal : Risque</p>
              <p className="text-slate-400 text-sm">Vous avez tendance à éviter les situations d'incertitude. L'IA personnalisera votre accompagnement pour vous aider à apprivoiser le risque progressivement.</p>
            </div>
          )}
        </div>
      )}

      {/* RIASEC Tab */}
      {activeTab === 'riasec' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Profil RIASEC</h2>
          <div className="flex items-center justify-center gap-8 mb-8">
            {['S', 'A', 'E'].map((letter, i) => (
              <div key={letter} className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold ${
                i === 0 ? 'bg-emerald-500 text-white' : i === 1 ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
              }`}>
                {letter}
              </div>
            ))}
          </div>
          <p className="text-center text-white text-xl font-semibold mb-2">Social - Artistique - Entreprenant</p>
          <p className="text-center text-slate-400 mb-6">Votre code RIASEC en 3 lettres</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { code: 'R', name: 'Réaliste', score: 2.1 },
              { code: 'I', name: 'Investigateur', score: 3.2 },
              { code: 'A', name: 'Artistique', score: 4.3 },
              { code: 'S', name: 'Social', score: 4.8 },
              { code: 'E', name: 'Entreprenant', score: 4.1 },
              { code: 'C', name: 'Conventionnel', score: 2.5 },
            ].map((dim) => (
              <div key={dim.code} className="flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold">{dim.code}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400 text-sm">{dim.name}</span>
                    <span className="text-white text-sm">{dim.score.toFixed(1)}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(dim.score/5)*100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enneagram Tab */}
      {activeTab === 'enneagram' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Profil Ennéagramme</h2>
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-6xl font-bold text-white">3</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Le Battant</h3>
            <p className="text-slate-400">avec une aile 2 (L'Altruiste)</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Forces</h4>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Orienté résultats et efficacité</li>
                <li>• Adaptable et charismatique</li>
                <li>• Motivé par le succès</li>
                <li>• Capacité à inspirer les autres</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Points de vigilance</h4>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Tendance à se définir par ses accomplissements</li>
                <li>• Risque de workaholic</li>
                <li>• Difficulté à montrer sa vulnérabilité</li>
                <li>• Comparaison aux autres</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Synthèse de votre profil</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed mb-4">
              Vous êtes un professionnel orienté vers les relations humaines (Social) avec une forte dimension créative (Artistique) et entrepreneuriale. Votre type 3 Ennéagramme avec aile 2 vous pousse naturellement vers des rôles de leadership bienveillant.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              Votre analyse I.C.A.R.E. révèle une <strong className="text-red-400">zone de vigilance sur le Risque</strong>. Cette prudence excessive peut vous freiner dans vos prises de décision professionnelles. L'accompagnement JobSeed se concentrera sur cette dimension.
            </p>
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <p className="text-emerald-400 font-medium mb-2">💡 Recommandation</p>
              <p className="text-slate-400 text-sm">Métiers alignés avec votre profil : Coach, Consultant, Formateur, Chef de projet, Manager de transition, Entrepreneur social.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// DOCUMENTS PAGE
// ============================================
const DocumentsPage = ({ onNavigate }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [documents, setDocuments] = useState([
    { id: 1, name: 'CV_Patrick_2024.pdf', type: 'pdf', size: 245000, date: '2024-01-15' },
    { id: 2, name: 'Lettre_Motivation_UBS.docx', type: 'docx', size: 52000, date: '2024-01-14' },
    { id: 3, name: 'Photo_profil.png', type: 'image', size: 180000, date: '2024-01-10' },
  ]);

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getIcon = (type, name) => {
    if (name.endsWith('.pdf') || type === 'pdf') return '📄';
    if (name.endsWith('.doc') || name.endsWith('.docx')) return '📝';
    if (type === 'image') return '🖼️';
    return '📁';
  };

  const handleUpload = (file) => {
    const type = file.name.endsWith('.pdf') ? 'pdf' : file.name.match(/\.(png|jpg|jpeg)$/i) ? 'image' : 'docx';
    setDocuments([{ id: Date.now(), name: file.name, type, size: 150000, date: new Date().toISOString().split('T')[0] }, ...documents]);
    setShowUpload(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mes Documents 📄</h1>
          <p className="text-slate-400">Gérez vos CV, lettres de motivation et autres documents.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowUpload(!showUpload)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Upload className="w-4 h-4" /> Importer
          </button>
          <button onClick={() => onNavigate('new-cv')} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" /> Générer un CV
          </button>
        </div>
      </div>

      {showUpload && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Importer un document</h2>
          <FileUpload onUpload={handleUpload} />
        </div>
      )}

      {documents.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <span className="text-5xl mb-4 block">📂</span>
          <h2 className="text-xl font-semibold text-white mb-2">Aucun document</h2>
          <p className="text-slate-400 mb-6">Commencez par importer un CV ou en générer un nouveau.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setShowUpload(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">Importer</button>
            <button onClick={() => onNavigate('new-cv')} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg">Générer un CV</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">{getIcon(doc.type, doc.name)}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate" title={doc.name}>{doc.name}</h3>
                  <p className="text-slate-500 text-sm">{formatSize(doc.size)} • {doc.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                <button className="flex-1 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg flex items-center justify-center gap-1">
                  <Eye className="w-4 h-4" /> Voir
                </button>
                <button className="flex-1 py-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg flex items-center justify-center gap-1">
                  <Download className="w-4 h-4" /> Télécharger
                </button>
                <button 
                  onClick={() => setDocuments(documents.filter(d => d.id !== doc.id))} 
                  className="px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// NEW CV PAGE (WIZARD)
// ============================================
const NewCVPage = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [existingCV, setExistingCV] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [cvTemplate, setCvTemplate] = useState('moderne');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const offers = [
    { id: 1, title: 'Chef de Projet Digital', company: 'Swisscom', location: 'Berne' },
    { id: 2, title: 'Product Manager', company: 'UBS', location: 'Zurich' },
    { id: 3, title: 'Business Analyst', company: 'Nestlé', location: 'Vevey' },
    { id: 4, title: 'Coach Professionnel', company: 'Manpower', location: 'Genève' },
  ];

  const templates = [
    { id: 'moderne', name: 'Moderne', desc: 'Design épuré avec accent émeraude', color: 'bg-emerald-500' },
    { id: 'classique', name: 'Classique', desc: 'Format business traditionnel', color: 'bg-slate-500' },
    { id: 'creatif', name: 'Créatif', desc: 'Sidebar colorée et graphiques', color: 'bg-blue-500' },
    { id: 'minimaliste', name: 'Minimaliste', desc: 'Ultra-sobre, maximum lisibilité', color: 'bg-white border border-slate-600' },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
      setStep(4);
    }, 2500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button onClick={() => onNavigate('documents')} className="text-slate-400 hover:text-slate-300 text-sm mb-4 flex items-center gap-1">
        ← Retour aux documents
      </button>
      <h1 className="text-3xl font-bold text-white mb-2">Générer un CV et une Lettre ✨</h1>
      <p className="text-slate-400 mb-8">L'IA personnalise vos documents selon votre profil I.C.A.R.E.</p>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              step >= s ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
            }`}>
              {step > s ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 4 && <div className={`flex-1 h-1 rounded ${step > s ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: CV existant */}
      {step === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-2">1. Avez-vous un CV existant ?</h2>
          <p className="text-slate-400 mb-6">Importez votre CV actuel pour que l'IA s'en inspire.</p>
          <FileUpload onUpload={(file) => setExistingCV(file)} accept=".pdf,.doc,.docx" />
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(2)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg">
              {existingCV ? 'Continuer avec ce CV →' : 'Continuer sans CV →'}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Offre d'emploi */}
      {step === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-2">2. Pour quelle offre postulez-vous ?</h2>
          <p className="text-slate-400 mb-6">Sélectionnez une offre pour personnaliser votre candidature.</p>
          <div className="space-y-3 mb-6 max-h-72 overflow-y-auto">
            {offers.map((offer) => (
              <button
                key={offer.id}
                onClick={() => setSelectedOffer(offer)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedOffer?.id === offer.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">{offer.title}</p>
                    <p className="text-slate-400 text-sm">{offer.company} • {offer.location}</p>
                  </div>
                  {selectedOffer?.id === offer.id && <Check className="w-5 h-5 text-emerald-400" />}
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg">← Retour</button>
            <button onClick={() => setStep(3)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg">
              {selectedOffer ? 'Continuer →' : 'Continuer sans offre →'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Templates */}
      {step === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-2">3. Choisissez votre template</h2>
          <p className="text-slate-400 mb-6">Le design sera appliqué à votre CV et lettre de motivation.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setCvTemplate(t.id)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  cvTemplate === t.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className={`w-8 h-8 rounded mb-3 ${t.color}`} />
                <p className="text-white font-medium">{t.name}</p>
                <p className="text-slate-400 text-sm">{t.desc}</p>
              </button>
            ))}
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6">
            <p className="text-emerald-400 text-sm">
              ✨ Votre profil I.C.A.R.E. (blocage Risque) sera utilisé pour adapter le ton de la lettre et mettre en avant vos capacités de gestion du changement.
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg">← Retour</button>
            <button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>✨ Générer mes documents</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && generated && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">🎉</span>
            <h2 className="text-2xl font-bold text-white mb-2">Documents générés avec succès !</h2>
            <p className="text-slate-400">Téléchargez-les dans le format souhaité.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">📄</span>
                <div>
                  <h3 className="text-white font-semibold text-lg">CV personnalisé</h3>
                  <p className="text-slate-400 text-sm">Template {cvTemplate}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> PDF
                </button>
                <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Word
                </button>
              </div>
            </div>

            <div className="border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">✉️</span>
                <div>
                  <h3 className="text-white font-semibold text-lg">Lettre de motivation</h3>
                  <p className="text-slate-400 text-sm">{selectedOffer ? `Pour ${selectedOffer.company}` : 'Générique'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> PDF
                </button>
                <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Word
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => onNavigate('documents')} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg">
              Voir mes documents
            </button>
            <button 
              onClick={() => { setStep(1); setGenerated(false); setExistingCV(null); setSelectedOffer(null); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
            >
              Nouvelle candidature
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// OFFERS PAGE
// ============================================
const OffersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [offers, setOffers] = useState([
    { id: 1, title: 'Chef de Projet Digital', company: 'Swisscom', location: 'Berne', date: '2024-01-20', saved: true },
    { id: 2, title: 'Product Manager', company: 'UBS', location: 'Zurich', date: '2024-01-19', saved: false },
    { id: 3, title: 'Business Analyst', company: 'Nestlé', location: 'Vevey', date: '2024-01-18', saved: true },
    { id: 4, title: 'Coach Professionnel', company: 'Manpower', location: 'Genève', date: '2024-01-17', saved: false },
  ]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setOffers([
        { id: 5, title: `${searchQuery} - Senior`, company: 'Credit Suisse', location: 'Zurich', date: '2024-01-21', saved: false },
        ...offers
      ]);
      setIsSearching(false);
    }, 1500);
  };

  const toggleSave = (id) => {
    setOffers(offers.map(o => o.id === id ? { ...o, saved: !o.saved } : o));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Offres d'emploi 💼</h1>
        <p className="text-slate-400">Recherchez et sauvegardez des offres adaptées à votre profil.</p>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ex: Chef de projet, Coach, Consultant..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            Rechercher
          </button>
        </div>
        <p className="text-slate-500 text-sm mt-3">L'IA recherche sur jobup.ch, indeed.ch, jobs.ch et LinkedIn</p>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-semibold text-lg">{offer.title}</h3>
                  {offer.saved && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Sauvegardé</span>}
                </div>
                <p className="text-slate-400 mb-3">{offer.company} • {offer.location}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {offer.date}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleSave(offer.id)}
                  className={`p-2 rounded-lg transition-all ${offer.saved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400 hover:text-emerald-400'}`}
                >
                  <Star className={`w-5 h-5 ${offer.saved ? 'fill-current' : ''}`} />
                </button>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
                  Postuler
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// INTERVIEWS PAGE
// ============================================
const InterviewsPage = () => {
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const interviews = [
    { id: 1, company: 'Swisscom', position: 'Chef de Projet', date: '2024-01-25', status: 'upcoming' },
    { id: 2, company: 'UBS', position: 'Product Manager', date: '2024-01-22', status: 'completed' },
  ];

  const questions = [
    { text: "Parlez-moi de vous et de votre parcours professionnel.", type: 'classic' },
    { text: "Quelle a été votre plus grande prise de risque professionnelle ?", type: 'icare', target: 'R' },
    { text: "Décrivez une situation où vous avez dû sortir de votre zone de confort.", type: 'icare', target: 'R' },
    { text: "Comment gérez-vous l'incertitude dans un projet ?", type: 'icare', target: 'R' },
    { text: "Pourquoi souhaitez-vous rejoindre notre entreprise ?", type: 'classic' },
  ];

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setFeedback({
        strengths: ['Bonne structure de réponse', 'Exemples concrets'],
        improvements: ['Pourrait être plus spécifique sur les résultats', 'Mentionner davantage les compétences transférables'],
        suggestion: 'Essayez de quantifier vos réalisations avec des chiffres ou des pourcentages.'
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer('');
      setFeedback(null);
    }
  };

  if (selectedInterview) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <button onClick={() => { setSelectedInterview(null); setCurrentQuestion(0); setUserAnswer(''); setFeedback(null); }} className="text-slate-400 hover:text-slate-300 text-sm mb-4">
          ← Retour aux entretiens
        </button>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl">🎯</div>
            <div>
              <h1 className="text-2xl font-bold text-white">{selectedInterview.position}</h1>
              <p className="text-slate-400">{selectedInterview.company} • {selectedInterview.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm">Question {currentQuestion + 1}/{questions.length}</span>
            <div className="flex-1 bg-slate-700 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            {questions[currentQuestion].type === 'icare' && (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">I.C.A.R.E. - {questions[currentQuestion].target}</span>
            )}
          </div>
          <h2 className="text-xl text-white font-medium mb-6">{questions[currentQuestion].text}</h2>
          
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Tapez votre réponse ici..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 min-h-[150px] resize-none"
          />

          <div className="flex gap-3 mt-4">
            <button 
              onClick={handleSubmitAnswer}
              disabled={isAnalyzing || !userAnswer.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyse...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  Obtenir un feedback
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">💡 Feedback IA</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-emerald-500/10 rounded-lg p-4">
                <h4 className="text-emerald-400 font-medium mb-2">Points forts</h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  {feedback.strengths.map((s, i) => <li key={i}>✓ {s}</li>)}
                </ul>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-4">
                <h4 className="text-orange-400 font-medium mb-2">À améliorer</h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  {feedback.improvements.map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 mb-4">
              <p className="text-slate-300 text-sm">💡 {feedback.suggestion}</p>
            </div>

            <button onClick={nextQuestion} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg">
              {currentQuestion < questions.length - 1 ? 'Question suivante →' : 'Terminer la préparation'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Préparation Entretiens 🎯</h1>
        <p className="text-slate-400">Entraînez-vous avec des questions ciblées selon votre profil I.C.A.R.E.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Entraînement libre</h2>
          <p className="text-slate-400 mb-4">Pratiquez avec des questions adaptées à votre blocage I.C.A.R.E.</p>
          <button 
            onClick={() => setSelectedInterview({ id: 0, company: 'Entraînement', position: 'Préparation générale', date: "Aujourd'hui" })}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
          >
            Commencer →
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Créer une préparation</h2>
          <p className="text-slate-400 mb-4">Préparez un entretien spécifique avec une entreprise.</p>
          <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg">
            + Nouveau
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mb-4">Mes entretiens</h2>
      <div className="space-y-4">
        {interviews.map((interview) => (
          <div key={interview.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  interview.status === 'upcoming' ? 'bg-blue-500/20' : 'bg-emerald-500/20'
                }`}>
                  {interview.status === 'upcoming' ? '📅' : '✅'}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{interview.position}</h3>
                  <p className="text-slate-400">{interview.company} • {interview.date}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedInterview(interview)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
              >
                {interview.status === 'upcoming' ? 'Préparer' : 'Revoir'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================
const navItems = [
  { name: 'Tableau de bord', icon: Home, href: 'dashboard' },
  { name: 'Mon Parcours', icon: Map, href: 'journey' },
  { name: 'Mon Profil', icon: User, href: 'profile' },
  { name: 'Mes Documents', icon: File, href: 'documents' },
  { name: 'Offres d\'emploi', icon: Briefcase, href: 'offers' },
  { name: 'Entretiens', icon: Target, href: 'interviews' },
];

export default function JobSeedApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const userData = {
    firstName: 'Patrick',
    email: 'patrick@exemple.ch',
    testsCompleted: 3,
    currentStation: 4,
    documentsCount: 3,
    icare: { I: 3.2, C: 4.1, A: 3.8, R: 2.5, E: 3.9 }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'journey': return <JourneyPage onNavigate={setCurrentPage} userData={userData} />;
      case 'profile': return <ProfilePage userData={userData} />;
      case 'documents': return <DocumentsPage onNavigate={setCurrentPage} />;
      case 'new-cv': return <NewCVPage onNavigate={setCurrentPage} />;
      case 'offers': return <OffersPage />;
      case 'interviews': return <InterviewsPage />;
      default: return <DashboardPage onNavigate={setCurrentPage} userData={userData} />;
    }
  };

  const getActiveNav = () => {
    if (currentPage === 'new-cv') return 'documents';
    if (currentPage.startsWith('station-')) return 'journey';
    return currentPage;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="text-xl font-bold text-white">JobSeed</span>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = getActiveNav() === item.href;
            return (
              <button
                key={item.name}
                onClick={() => setCurrentPage(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <span className="text-emerald-400 font-semibold">P</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{userData.firstName}</p>
              <p className="text-slate-500 text-sm truncate">{userData.email}</p>
            </div>
          </div>
          <button className="w-full text-left px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}
