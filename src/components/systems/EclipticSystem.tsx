import React from 'react';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { RADIUS } from '../../tools/sphericalMath';

export const EclipticSystem: React.FC = () => {
    const OBLIQUITY = 23.5; // Tilt of Earth's axis
    const tiltRad = (OBLIQUITY * Math.PI) / 180;

    // Ecliptic is tilted by 23.5 relative to Equator.
    // If Equator is XZ plane, Ecliptic is rotated around X axis.

    // 1. Ecliptic Circle
    const eclipticPoints = [];
    for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        eclipticPoints.push(new THREE.Vector3(RADIUS * Math.cos(theta), 0, RADIUS * Math.sin(theta)));
    }

    return (
        <group rotation={[tiltRad, 0, 0]}>
            {/* Ecliptic Circle */}
            <Line points={eclipticPoints} color="#ddaa44" lineWidth={3} transparent opacity={0.8} />
            <Html position={[0, 0, RADIUS + 1]}>
                <div className="text-yellow-400 text-xs font-bold px-1 bg-black/50 rounded">Ecliptic</div>
            </Html>

            {/* Ecliptic Poles */}
            <Line points={[new THREE.Vector3(0, -RADIUS * 1.2, 0), new THREE.Vector3(0, RADIUS * 1.2, 0)]} color="#ddaa44" lineWidth={1} dashed dashScale={2} />
            <Html position={[0, RADIUS * 1.1, 0]}>
                <div className="text-yellow-400 font-bold">NEP</div>
            </Html>
            <Html position={[0, -RADIUS * 1.1, 0]}>
                <div className="text-yellow-400 font-bold">SEP</div>
            </Html>
        </group>
    );
};
