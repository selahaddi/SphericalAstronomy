import React from 'react';
import { Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { RADIUS, toRad } from '../../tools/sphericalMath';

export const PZSMode: React.FC<{ params: any }> = ({ params }) => {
    const { lat, dec, ha } = params;
    if (lat === undefined) return null;

    // Radius
    const R = RADIUS;

    // 1. Define Points
    // P = North Celestial Pole. In our coords (Equatorial): (0, R, 0)
    // Z = Zenith. Depends on Latitude.
    const Z = new THREE.Vector3(0, R * Math.sin(toRad(lat)), R * Math.cos(toRad(lat)));
    const P = new THREE.Vector3(0, R, 0);

    // S = Star.
    const haRad = toRad(ha * 15);
    const yS = R * Math.sin(toRad(dec));
    const rS = R * Math.cos(toRad(dec)); // radius in xz
    const xS = rS * Math.sin(haRad);
    const zS = rS * Math.cos(haRad);
    const S = new THREE.Vector3(xS, yS, zS);

    const getArc = (v1: THREE.Vector3, v2: THREE.Vector3, color: string) => {
        const pts = [];
        const steps = 32;
        const v1n = v1.clone().normalize();
        const v2n = v2.clone().normalize();
        const angle = v1n.angleTo(v2n);
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const sinOm = Math.sin(angle);
            if (sinOm < 0.0001) continue;
            const c1 = Math.sin((1 - t) * angle) / sinOm;
            const c2 = Math.sin(t * angle) / sinOm;
            pts.push(v1n.clone().multiplyScalar(c1).add(v2n.clone().multiplyScalar(c2)).multiplyScalar(R));
        }
        return <Line points={pts} color={color} lineWidth={4} />;
    }

    return (
        <group>
            {/* Points */}
            <Sphere position={P} args={[0.3]}><meshBasicMaterial color="#ffffff" /></Sphere>
            <Html position={P}><div className="font-bold text-white">P</div></Html>

            <Sphere position={Z} args={[0.3]}><meshBasicMaterial color="#4ade80" /></Sphere>
            <Html position={Z}><div className="font-bold text-green-400">Z</div></Html>

            <Sphere position={S} args={[0.3]}><meshBasicMaterial color="#facc15" /></Sphere>
            <Html position={S}><div className="font-bold text-yellow-400">S</div></Html>

            {/* Arcs */}
            {getArc(P, Z, "#4ade80")} {/* Colatitude */}
            {getArc(P, S, "#facc15")} {/* Codeclination */}
            {getArc(Z, S, "#60a5fa")} {/* Zenith Distance */}
        </group>
    );
};
