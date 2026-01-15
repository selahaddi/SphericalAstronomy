import React from 'react';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { RADIUS } from '../../tools/sphericalMath';

export const EquatorialSystem: React.FC = () => {
    // 1. Celestial Equator (Circle on XZ plane)
    const equatorPoints = [];
    for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        equatorPoints.push(new THREE.Vector3(RADIUS * Math.cos(theta), 0, RADIUS * Math.sin(theta)));
    }

    // 2. Hour Circles (Great Circles passing through poles)
    // We'll draw 12 hour circles (every 2 hours)
    const hourCircles = [];
    for (let h = 0; h < 12; h++) {
        const angle = (h / 12) * Math.PI; // 0 to Pi (covers full circle since it goes round the back)
        // Actually we need loops.
        // A circle in plane rotated slightly?
        // A meridian is a circle passing through (0, R, 0) and (0, -R, 0).
        // Rotate around Y axis.
        const points = [];
        for (let i = 0; i <= 64; i++) {
            const theta = (i / 64) * Math.PI * 2;
            const x = RADIUS * Math.sin(theta) * Math.cos(angle);
            const y = RADIUS * Math.cos(theta); // Goes through poles
            const z = RADIUS * Math.sin(theta) * Math.sin(angle);
            points.push(new THREE.Vector3(x, y, z));
        }
        hourCircles.push(points);
    }

    return (
        <group>
            {/* Celestial Equator */}
            <Line points={equatorPoints} color="#88aaff" lineWidth={3} transparent opacity={0.8} />
            <Html position={[RADIUS + 1, 0, 0]}>
                <div className="text-blue-300 text-xs font-bold px-1 bg-black/50 rounded">Celestial Equator</div>
            </Html>

            {/* Poles */}
            <Line points={[new THREE.Vector3(0, -RADIUS * 1.2, 0), new THREE.Vector3(0, RADIUS * 1.2, 0)]} color="#88aaff" lineWidth={1} dashed dashScale={2} />
            <Html position={[0, RADIUS * 1.1, 0]}>
                <div className="text-blue-300 font-bold">NCP</div>
            </Html>
            <Html position={[0, -RADIUS * 1.1, 0]}>
                <div className="text-blue-300 font-bold">SCP</div>
            </Html>

            {/* Hour Circles */}
            {hourCircles.map((points, i) => (
                <Line key={i} points={points} color="#445588" lineWidth={1} transparent opacity={0.3} />
            ))}
        </group>
    );
};
