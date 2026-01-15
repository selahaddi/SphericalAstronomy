import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { CelestialSphere } from './CelestialSphere';
import { HorizonSystem } from './systems/HorizonSystem';
import { EquatorialSystem } from './systems/EquatorialSystem';
import { EclipticSystem } from './systems/EclipticSystem';
import { TriangleSolver } from './TriangleSolver';
import { EarthMode } from './features/EarthMode';
import { PZSMode } from './features/PZSMode';
import { SunriseMode } from './features/SunriseMode';

interface SceneProps {
    showHorizon: boolean;
    showEquatorial: boolean;
    showEcliptic: boolean;
    showTriangle: boolean;
    mode: 'EXPLORE' | 'EARTH' | 'PZS' | 'SUNRISE';
    problemParams: any;
}

export const Scene: React.FC<SceneProps> = ({
    showHorizon,
    showEquatorial,
    showEcliptic,
    showTriangle,
    mode,
    problemParams
}) => {
    return (
        <div className="w-full h-full relative gradient-bg">
            <Canvas camera={{ position: [15, 10, 20], fov: 45 }}>
                <color attach="background" args={['#050510']} />

                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />

                    <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    {/* Core Sphere - Hide in Earth Mode? Or keep as sky? */}
                    {mode !== 'EARTH' && <CelestialSphere opacity={mode !== 'EXPLORE' ? 0.05 : 0.1} />}

                    {/* Main Systems - Only show in Explore Mode or relevant mode */}
                    {(mode === 'EXPLORE' && showHorizon) && <HorizonSystem />}
                    {(mode === 'EXPLORE' && showEquatorial) && <EquatorialSystem />}
                    {(mode === 'EXPLORE' && showEcliptic) && <EclipticSystem />}
                    {(mode === 'EXPLORE' && showTriangle) && <TriangleSolver />}

                    {/* Problem Modes */}
                    {mode === 'EARTH' && <EarthMode params={problemParams} />}
                    {mode === 'PZS' && <PZSMode params={problemParams} />}
                    {mode === 'SUNRISE' && <SunriseMode params={problemParams} />}

                    <OrbitControls
                        enablePan={false}
                        minDistance={5}
                        maxDistance={50}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};
