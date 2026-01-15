import { useState } from 'react';
import { Scene } from './components/Scene';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Globe, Star, Triangle, Info } from 'lucide-react';
import { ProblemSidebar, type SolverMode } from './ui/ProblemSidebar';

function App() {
  const [showHorizon, setShowHorizon] = useState(false);
  const [showEquatorial, setShowEquatorial] = useState(true);
  const [showEcliptic, setShowEcliptic] = useState(false);
  const [showTriangle, setShowTriangle] = useState(true);

  // New Problem Solver State
  const [mode, setMode] = useState<SolverMode>('EXPLORE');
  const [problemParams, setProblemParams] = useState<any>({});

  return (
    <main className="w-full h-screen bg-[#050510] relative overflow-hidden text-white font-sans selection:bg-pink-500/30">

      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene
          showHorizon={showHorizon}
          showEquatorial={showEquatorial}
          showEcliptic={showEcliptic}
          showTriangle={showTriangle}
          mode={mode}
          problemParams={problemParams}
        />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">

        {/* Header */}
        <header className="pointer-events-auto">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block"
          >
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-lg">
              Celestial Sphere
            </h1>
            <p className="text-blue-200/60 text-sm mt-1 font-light tracking-wide">
              Interactive Spherical Astronomy
            </p>
          </motion.div>
        </header>

        {/* Sidebar Controls - Conditional Rendering */}
        <ProblemSidebar mode={mode} setMode={setMode} onUpdateParams={setProblemParams} />

        {/* Classic Explore Controls (Only visible in EXPLORE mode) */}
        {mode === 'EXPLORE' && (
          <aside className="absolute top-24 right-6 pointer-events-auto flex flex-col gap-4 w-64">
            {/* Control Panel */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl ring-1 ring-white/5"
            >
              <div className="flex items-center gap-2 mb-4 text-cyan-300 border-b border-white/10 pb-2">
                <Layers size={18} />
                <h2 className="font-semibold text-sm uppercase tracking-wider">Coordinate Systems</h2>
              </div>

              <div className="space-y-3">
                <ToggleRow
                  label="Horizon System"
                  active={showHorizon}
                  color="bg-emerald-500"
                  onClick={() => setShowHorizon(!showHorizon)}
                  icon={<Globe size={14} />}
                />
                <ToggleRow
                  label="Equatorial System"
                  active={showEquatorial}
                  color="bg-blue-500"
                  onClick={() => setShowEquatorial(!showEquatorial)}
                  icon={<Star size={14} />}
                />
                <ToggleRow
                  label="Ecliptic System"
                  active={showEcliptic}
                  color="bg-yellow-500"
                  onClick={() => setShowEcliptic(!showEcliptic)}
                  icon={<div className="w-3 h-3 rounded-full border-2 border-current" />}
                />
              </div>
            </motion.div>

            {/* Tools Panel */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl ring-1 ring-white/5"
            >
              <div className="flex items-center gap-2 mb-4 text-pink-300 border-b border-white/10 pb-2">
                <Triangle size={18} />
                <h2 className="font-semibold text-sm uppercase tracking-wider">Tools</h2>
              </div>

              <ToggleRow
                label="Spherical Triangle"
                active={showTriangle}
                color="bg-pink-500"
                onClick={() => setShowTriangle(!showTriangle)}
                icon={<Triangle size={14} />}
              />

              <AnimatePresence>
                {showTriangle && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 text-xs text-blue-200/70 leading-relaxed overflow-hidden"
                  >
                    <p className="flex gap-2 items-start">
                      <Info size={14} className="mt-0.5 shrink-0 text-cyan-400" />
                      Click anywhere on the sphere to place 3 points.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </aside>
        )}

        {/* Footer / Credits */}
        <footer className="pointer-events-auto opacity-50 hover:opacity-100 transition-opacity">
          <div className="text-[10px] text-white/30">
            Spherical Astronomy v1.0 • Built with R3F
          </div>
        </footer>

      </div>
    </main>
  );
}

// Subcomponent for Toggles
const ToggleRow = ({ label, active, color, onClick, icon }: any) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, paddingLeft: 12 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-300 border ${active ? 'bg-white/10 border-white/20' : 'hover:bg-white/5 border-transparent'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg ${active ? color : 'bg-white/10 text-gray-400'} transition-colors shadow-inner`}>
          {icon}
        </div>
        <span className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-400'}`}>{label}</span>
      </div>

      {/* Custom Toggle Switch UI */}
      <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? color : 'bg-gray-700'}`}>
        <motion.div
          animate={{ x: active ? 16 : 2 }}
          className="absolute top-0.5 left-0 w-3 h-3 bg-white rounded-full shadow-md"
        />
      </div>
    </motion.button>
  )
}

export default App;
