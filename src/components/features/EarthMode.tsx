import React from 'react';
import { Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { RADIUS, toRad } from '../../tools/sphericalMath';

export const EarthMode: React.FC<{ params: any }> = ({ params }) => {
    // Show Earth Sphere instead of Transparent Cellestial Sphere?
    // Or inside it?
    // Let's render a solid Earth sphere slightly smaller to avoid z-fighting if mixed.
    // Or assume this replaces the main sphere.

    // Visualize Isosceles Triangle
    // Given A, a (and implied A=B).
    // Let's draw:
    // Vertex C at North Pole (simplifies math for display).
    // Then vertices A and B are at same latitude.
    // Side a is distance B-C. Side b is A-C.
    // Wait, if A=B, then sides a=b.
    // So if Vertex C is at Pole? Then Angle A is at... no.
    // Isosceles means two sides equal.
    // If A=B, then side a = side b.
    // So Vertex C is apex. AC = BC.

    // Let's use computed sides from params if available.
    // We already calculated side c.
    // Apex C at (0, R, 0).
    // Base vertices A and B at some latitude.
    // Side a = Side b.
    // Latitude = 90 - a.
    // Longitudinal difference = angle C.

    // If we only know 'a' and 'A'.
    // We calculated C in the sidebar.
    // So we can visualize:
    // Point C = North Pole.
    // Point A = Lat (90-a), Long (-C/2).
    // Point B = Lat (90-a), Long (+C/2).

    // Check: Side opposite to A is side a (BC).
    // Distance BC should be 'a'.
    // In our construction:
    // BC is distance between two points at same lat.
    // This side 'a' is the BASE of our visual Isosceles triangle.
    // But in math input, 'a' was opposite Angle A.
    // So side a is BC.
    // Angle A is angle at vertex A.
    // Angle B is angle at vertex B.
    // If A=B, then AC = BC.
    // So Sides b = a.
    // So side opposite B is b.
    // So we have triangle with sides a, b=a, c.
    // So AC = a, BC = a.
    // Apex C.
    // This matches: C at Pole. A and B at Lat (90-a).
    // Distance AC = a. Correct.
    // Distance BC = a. Correct.
    // Angle at A?
    // In Isosceles triangle with Apex C:
    // Base angles A and B are equal.
    // So this visualization is valid.

    const { C } = params; // we need C from results to draw properly
    if (!C) return null; // Wait for calculations

    // Convert a (side length) to polar angle
    const a_deg = params.a;
    const lat = 90 - a_deg;

    // Points
    const r = RADIUS * 0.99; // Slightly inside main sphere or on top?
    // If we are Earth Mode, we should probably hide the glass sphere or make it opaque Earth.

    // Apex C (Pole)
    const vC = new THREE.Vector3(0, r, 0);

    // Base A
    // lat 0 -> y=0. lat 90 -> y=R.
    // y = R sin(lat)
    // xz radius = R cos(lat)
    const y = r * Math.sin(toRad(lat));
    const radXZ = r * Math.cos(toRad(lat));

    const longA = toRad(-C / 2);
    const vA = new THREE.Vector3(radXZ * Math.sin(longA), y, radXZ * Math.cos(longA));

    const longB = toRad(C / 2);
    const vB = new THREE.Vector3(radXZ * Math.sin(longB), y, radXZ * Math.cos(longB));

    // Draw Arcs
    // Function to get arc points
    const getArc = (v1: THREE.Vector3, v2: THREE.Vector3) => {
        const pts = [];
        const steps = 32;
        const v1n = v1.clone().normalize();
        const v2n = v2.clone().normalize();
        const angle = v1n.angleTo(v2n);
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const sinOm = Math.sin(angle);
            const c1 = Math.sin((1 - t) * angle) / sinOm;
            const c2 = Math.sin(t * angle) / sinOm;
            pts.push(v1n.clone().multiplyScalar(c1).add(v2n.clone().multiplyScalar(c2)).multiplyScalar(r));
        }
        return pts;
    }

    return (
        <group>
            {/* Earth Sphere - Simple Blue Marble style */}
            <Sphere args={[r * 0.99, 64, 64]}>
                <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
            </Sphere>

            {/* Triangle Arcs */}
            <Line points={getArc(vC, vA)} color="#4ade80" lineWidth={4} />
            <Line points={getArc(vC, vB)} color="#4ade80" lineWidth={4} />
            <Line points={getArc(vA, vB)} color="#facc15" lineWidth={4} />

            {/* Vertices */}
            <Sphere position={vC} args={[0.2]}><meshBasicMaterial color="white" /></Sphere>
            <Sphere position={vA} args={[0.2]}><meshBasicMaterial color="white" /></Sphere>
            <Sphere position={vB} args={[0.2]}><meshBasicMaterial color="white" /></Sphere>

            {/* Fill Area? complex for 3D sphere. Just highlight area with particle cloud or distinct lines */}
        </group>
    );
};
