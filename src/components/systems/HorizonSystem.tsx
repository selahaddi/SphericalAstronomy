import React from 'react';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { RADIUS } from '../../tools/sphericalMath';

export const HorizonSystem: React.FC = () => {
    const LATITUDE = 40; // Default observer latitude

    // Rotate the whole group to match Latitude.
    // By default, generic Horizon system has Z-axis up?
    // No, we are in Equatorial World.
    // Zenith is at Dec = Latitude.
    // So we tilt the Horizon System such that ITS Y-axis aligns with (0, sin(lat), cos(lat))?
    // Actually simpler: The World Up is NCP.
    // The Horizon Plane is tilted.
    // Zenith is rotated by (90 - Lat) from NCP?
    // Logic: At North Pole (lat 90), Zenith = NCP.
    // At Equator (lat 0), Zenith is on Equator.
    // So Zenith makes angle (90 - Lat) with NCP.

    // Rotation: Tilt around X axis?
    // If we tilt by -(90 - Lat), the Y axis (local zenith) moves from World Y (NCP) towards Z (Equator)?
    // Let's assume Zenith is "above" the observer.

    const tilt = (90 - LATITUDE) * Math.PI / 180;

    // Visuals are defined in "Horizon Space" (where Y is Zenith), then we Group-Rotate it.

    // 1. Horizon Circle
    const horizonPoints = [];
    for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        horizonPoints.push(new THREE.Vector3(RADIUS * Math.cos(theta), 0, RADIUS * Math.sin(theta)));
    }

    // 2. Cardinals
    // In Horizon space: N is towards the Pole.
    // If we tilt Z axis towards Y (NCP), then North on Horizon is the point "most North".
    // It's complicated to map exactly without clear definition of North in 3D space.
    // Let's assume North is -Z in Horizon Space.

    return (
        <group rotation={[tilt, 0, 0]}>
            {/* Horizon Circle */}
            <Line points={horizonPoints} color="#44aa88" lineWidth={3} transparent opacity={0.8} />
            <Html position={[RADIUS + 1, 0, 0]}>
                <div className="text-emerald-400 text-xs font-bold px-1 bg-black/50 rounded">Horizon</div>
            </Html>

            {/* Zenith / Nadir */}
            <Line points={[new THREE.Vector3(0, -RADIUS * 1.2, 0), new THREE.Vector3(0, RADIUS * 1.2, 0)]} color="#44aa88" lineWidth={1} dashed dashScale={2} />
            <Html position={[0, RADIUS * 1.1, 0]}>
                <div className="text-emerald-400 font-bold">Z</div>
            </Html>
            <Html position={[0, -RADIUS * 1.1, 0]}>
                <div className="text-emerald-400 font-bold">Nadir</div>
            </Html>

            {/* Cardinals */}
            <Html position={[0, 0, -RADIUS * 1.05]}>
                <div className="text-emerald-400 font-bold">N</div>
            </Html>
            <Html position={[0, 0, RADIUS * 1.05]}>
                <div className="text-emerald-400 font-bold">S</div>
            </Html>
            <Html position={[RADIUS * 1.05, 0, 0]}>
                <div className="text-emerald-400 font-bold">E</div>
            </Html>
            <Html position={[-RADIUS * 1.05, 0, 0]}>
                <div className="text-emerald-400 font-bold">W</div>
            </Html>
        </group>
    );
};
