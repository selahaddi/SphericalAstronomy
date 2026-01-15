import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DMS } from '../tools/dms';
import { SphericalTrig } from '../tools/trigonometry';

// Mode types
export type SolverMode = 'EXPLORE' | 'EARTH' | 'PZS' | 'SUNRISE';

interface SidebarProps {
    mode: SolverMode;
    setMode: (m: SolverMode) => void;
    onUpdateParams: (params: any) => void;
}

export const ProblemSidebar: React.FC<SidebarProps> = ({ mode, setMode, onUpdateParams }) => {

    // Mode 1 State
    const [m1_A, setM1_A] = useState('125 30 40');
    const [m1_a, setM1_a] = useState('101 20 35');
    const [m1_res, setM1_res] = useState<any>(null);

    // Mode 2 State
    const [m2_Lat, setM2_Lat] = useState('40');
    const [m2_Dec, setM2_Dec] = useState('20');
    const [m2_HA, setM2_HA] = useState('2');
    const [m2_res, setM2_res] = useState<any>(null);

    // Mode 3 State
    const [m3_Lat, setM3_Lat] = useState('38.7'); // Kayseri roughly
    const [m3_Day, setM3_Day] = useState(80); // Spring Equinox approx (March 21)
    const [m3_Time, setM3_Time] = useState(12); // Noon
    const [m3_res, setM3_res] = useState<any>(null);

    // Derived Dec
    const m3_DecVal = 23.45 * Math.sin((2 * Math.PI * (284 + m3_Day)) / 365);



    // Solving Logic
    useEffect(() => {
        if (mode === 'EARTH') {
            const A = DMS.parse(m1_A);
            const a = DMS.parse(m1_a);
            if (A && a) {
                const res = SphericalTrig.solveIsosceles(A, a);
                setM1_res(res);
                onUpdateParams({ type: 'EARTH', A, a });
            }
        }
        else if (mode === 'PZS') {
            const lat = DMS.parse(m2_Lat);
            const dec = DMS.parse(m2_Dec);
            const ha = parseFloat(m2_HA); // Hours
            if (!isNaN(lat)) {
                const res = SphericalTrig.solvePZS(lat, dec, ha);
                setM2_res(res);
                onUpdateParams({ type: 'PZS', lat, dec, ha });
            }
        }
        else if (mode === 'SUNRISE') {
            const lat = DMS.parse(m3_Lat);
            // Use derived Dec from Day of Year
            const dec = m3_DecVal;

            if (!isNaN(lat)) {
                // Calculate Rise/Set times (LHA)
                const res = SphericalTrig.calculateRiseSet(lat, dec);
                setM3_res(res);

                // Calculate Current Sun Position (LHA) from Time Slider
                // Time 12h = Noon = LHA 0.
                // Time 18h = 6h past noon = LHA +6h.
                // Time 6h = 6h before noon = LHA -6h.
                const currentLHA = m3_Time - 12;

                onUpdateParams({ type: 'SUNRISE', lat, dec, lha: res.lha, currentLHA });
            }
        } else {
            onUpdateParams({ type: 'EXPLORE' });
        }
    }, [mode, m1_A, m1_a, m2_Lat, m2_Dec, m2_HA, m3_Lat, m3_Day, m3_Time, m3_DecVal]);

    return (
        <div className="absolute top-24 left-6 flex flex-col gap-4 w-80 pointer-events-auto">
            {/* Mode Selector (Always visible) */}
            <motion.div
                layout
                className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl z-20 pointer-events-auto"
            >
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-white font-bold text-sm">Select Problem</h2>
                    {mode !== 'EXPLORE' && (
                        <button
                            onClick={() => setMode('EXPLORE')}
                            className="text-[10px] text-white/50 hover:text-white bg-white/5 px-2 py-1 rounded"
                        >
                            Reset
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <ModeButton
                        active={mode === 'EARTH'}
                        onClick={() => setMode('EARTH')}
                        label="1. Plane/Area (Earth)"
                        color="from-green-500 to-emerald-700"
                    />
                    <ModeButton
                        active={mode === 'PZS'}
                        onClick={() => setMode('PZS')}
                        label="2. P-Z-S Transformation"
                        color="from-blue-500 to-indigo-700"
                    />
                    <ModeButton
                        active={mode === 'SUNRISE'}
                        onClick={() => setMode('SUNRISE')}
                        label="3. Sunrise/Refraction"
                        color="from-orange-500 to-red-700"
                    />
                </div>
            </motion.div>

            {/* Dynamic Content */}
            <AnimatePresence mode="wait">
                {mode !== 'EXPLORE' && (
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl max-h-[60vh] overflow-y-auto"
                    >
                        {mode === 'EARTH' && (
                            <div className="space-y-4">
                                <InputGroup label="Angle A (deg)" value={m1_A} onChange={setM1_A} />
                                <InputGroup label="Side a (deg)" value={m1_a} onChange={setM1_a} />

                                {m1_res && (
                                    <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
                                        <div className="text-xs text-gray-400 mb-1">Results</div>
                                        <div className="text-sm font-mono text-green-300">Angle C: {m1_res.C.toFixed(2)}°</div>
                                        <div className="text-sm font-mono text-green-300">Side c: {m1_res.c.toFixed(2)}°</div>
                                        <div className="text-sm font-mono text-yellow-300 mt-2">Excess (E): {m1_res.excess.toFixed(2)}°</div>
                                        <div className="text-md font-bold text-white mt-1">Area: {Math.round(m1_res.area).toLocaleString()} km²</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {mode === 'PZS' && (
                            <div className="space-y-4">
                                <InputGroup label="Latitude (φ)" value={m2_Lat} onChange={setM2_Lat} />
                                <InputGroup label="Declination (δ)" value={m2_Dec} onChange={setM2_Dec} />
                                <InputGroup label="Hour Angle (h)" value={m2_HA} onChange={setM2_HA} />

                                {m2_res && (
                                    <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
                                        <div className="text-xs text-gray-400 mb-1">Horizon Coordinates</div>
                                        <div className="text-sm font-mono text-blue-300">Altitude (a): {m2_res.alt.toFixed(2)}°</div>
                                        <div className="text-sm font-mono text-blue-300">Azimuth (A): {m2_res.az.toFixed(2)}°</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {mode === 'SUNRISE' && (
                            <div className="space-y-4">
                                <InputGroup label="Latitude (φ)" value={m3_Lat} onChange={setM3_Lat} />

                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-3">
                                    {/* Date Slider */}
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                            <span>Day {m3_Day}</span>
                                            <span className="text-orange-300">δ: {m3_DecVal.toFixed(1)}°</span>
                                        </div>
                                        <input
                                            type="range" min="1" max="365" step="1"
                                            value={m3_Day}
                                            onChange={e => setM3_Day(parseInt(e.target.value))}
                                            className="w-full accent-orange-500 h-1 bg-white/20 rounded-lg cursor-pointer"
                                        />
                                    </div>

                                    {/* Time Slider */}
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                            <span>Time: {DMS.formatTime(m3_Time)}</span>
                                            <span className="text-yellow-300">LHA: {(m3_Time - 12).toFixed(1)}h</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="24" step="0.1"
                                            value={m3_Time}
                                            onChange={e => setM3_Time(parseFloat(e.target.value))}
                                            className="w-full accent-yellow-400 h-1 bg-white/20 rounded-lg cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div className="text-xs text-orange-300/50 italic">Refraction constant: 50'</div>

                                {m3_res && (
                                    <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
                                        <div className="text-xs text-gray-400 mb-1">Sun Times</div>
                                        <div className="text-lg font-mono text-orange-400">
                                            Rise LHA: -{m3_res.lha.toFixed(2)}h
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {(12 - m3_res.lha).toFixed(2)}h Local Time approx
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// UI Helpers
const ModeButton = ({ label, color, onClick, active }: any) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full p-3 rounded-xl bg-gradient-to-r ${color} ${active ? 'ring-2 ring-white scale-[1.02] shadow-lg' : 'opacity-80 grayscale-[0.5]'} text-white font-semibold text-sm shadow-md text-left transition-all`}
    >
        {label}
    </motion.button>
);

const InputGroup = ({ label, value, onChange }: any) => (
    <div>
        <label className="text-xs text-gray-400 block mb-1">{label}</label>
        <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-white font-mono text-sm focus:border-blue-500 outline-none transition-colors"
        />
    </div>
);
