import React from 'react';
import { Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { RADIUS, toRad } from '../../tools/sphericalMath';

export const SunriseMode: React.FC<{ params: any }> = ({ params }) => {
    const { lat, dec, lha, currentLHA } = params;
    if (lat === undefined) return null;

    // 1. Horizon Plane (Circle) - Green
    const horizonPts = [];
    for (let i = 0; i <= 64; i++) {
        const th = i / 64 * Math.PI * 2;
        horizonPts.push(new THREE.Vector3(RADIUS * Math.cos(th), 0, RADIUS * Math.sin(th)));
    }

    // 2. NCP Axis
    // Tilted by (lat). NCP is Z', but if Z is Up, NCP tilts from N towards Z by Lat.
    // Here we treat Z-axis of ThreeJS as North?
    // In PZSMode: Zenith was (0,R,0). NCP was (0, sinLat, -cosLat).
    // Let's match PZSMode.
    const axisY = Math.sin(toRad(lat)); // Altitude of Pole = Lat
    const axisZ = -Math.cos(toRad(lat)); // North is -Z
    const NCP = new THREE.Vector3(0, axisY, axisZ).normalize().multiplyScalar(RADIUS);

    // 3. Sun Path (Diurnal Circle)
    // Circle centered at P_center, perpedicular to NCP.
    const rSun = RADIUS * Math.cos(toRad(dec));
    const distSun = RADIUS * Math.sin(toRad(dec)); // along axis
    const centerSun = NCP.clone().normalize().multiplyScalar(distSun);

    // Construct Basis for circle
    const u = new THREE.Vector3(1, 0, 0); // East-West (X-axis) is perp to NCP (which is in Y-Z plane).
    const v = u.clone().cross(NCP).normalize(); // Vector in Meridian plane (perp to NCP and East).

    const sunPathPts = [];
    for (let i = 0; i <= 64; i++) {
        const th = i / 64 * Math.PI * 2;
        // P = C + R(cos u + sin v)
        const p = centerSun.clone()
            .add(u.clone().multiplyScalar(rSun * Math.cos(th)))
            .add(v.clone().multiplyScalar(rSun * Math.sin(th)));
        sunPathPts.push(p);
    }

    // 4. Sun Position Calculation
    // t (LHA) = 0 -> Meridian (South or North?). Usually South (Highest point).
    // Highest point is in Meridian plane (+v direction?).
    // If t=0, cost=1, sint=0 -> pos = C + v*R.
    // Meridian vector v points "up" relative to NCP? Yes.
    // LHA increases Westwards. West is -X (if East is +X).
    // u is +X (East).
    // So for Westward motion, we need component towards -u.
    // sin(t) for small t>0 should give Neg X?
    // If t>0, sin(t)>0. -u*sin(t) gives Neg X (West). Correct.

    const getSunPos = (lhaHours: number) => {
        const tRad = toRad(lhaHours * 15);
        return centerSun.clone()
            .add(v.clone().multiplyScalar(rSun * Math.cos(tRad)))
            .add(u.clone().multiplyScalar(-rSun * Math.sin(tRad)));
    }

    // Rise/Set Positions
    const risePos = getSunPos(-lha); // Rise is East (-LHA)
    const setPos = getSunPos(lha);   // Set is West (+LHA)

    // Current Sun Position from Slider
    // params.currentLHA coming from sidebar
    const currLHA = currentLHA !== undefined ? currentLHA : 2; // default
    const currentSunPos = getSunPos(currLHA);

    return (
        <group>
            {/* Horizon */}
            <Line points={horizonPts} color="#10b981" lineWidth={2} />
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[RADIUS, 64]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.1} side={THREE.DoubleSide} />
            </mesh>

            {/* Axis */}
            <Line points={[NCP.clone().negate(), NCP]} color="#64748b" dashed dashScale={2} />

            {/* Sun Path */}
            <Line points={sunPathPts} color="#f97316" lineWidth={3} transparent opacity={0.4} />

            {/* Dynamic Sun */}
            <Sphere position={currentSunPos} args={[0.8]}>
                <meshStandardMaterial color="#fdba74" emissive="#f97316" emissiveIntensity={3} />
            </Sphere>
            <pointLight position={currentSunPos} intensity={2} distance={15} color="#fbbf24" />

            {/* Rise/Set Markers */}
            <Sphere position={risePos} args={[0.3]}><meshBasicMaterial color="orange" opacity={0.5} transparent /></Sphere>
            <Sphere position={setPos} args={[0.3]}><meshBasicMaterial color="orange" opacity={0.5} transparent /></Sphere>

            <Html position={currentSunPos}>
                <div className="bg-black/80 text-yellow-300 text-[10px] px-1.5 py-0.5 rounded border border-yellow-500/50 whitespace-nowrap -translate-y-6">
                    Sun
                </div>
            </Html>

            <Html position={risePos}>
                <div className="bg-black/80 text-orange-400 text-[10px] px-1 py-0.5 rounded opacity-50">Rise</div>
            </Html>
        </group>
    );
};
