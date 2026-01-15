import React, { useState, useMemo } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { Line, Sphere, Html } from '@react-three/drei';
import { motion } from 'motion/react';
import * as THREE from 'three';
import { RADIUS, toDeg } from '../tools/sphericalMath';

export const TriangleSolver: React.FC = () => {
    const [points, setPoints] = useState<THREE.Vector3[]>([]);

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        if (points.length >= 3) {
            // Find closest and replace?
            // calculate distances
            let minDist = Infinity;
            let idx = -1;
            const clickPoint = e.point.clone().normalize().multiplyScalar(RADIUS);

            points.forEach((p, i) => {
                const d = p.distanceTo(clickPoint);
                if (d < minDist) {
                    minDist = d;
                    idx = i;
                }
            });

            if (idx !== -1 && minDist < RADIUS * 0.5) {
                const newPoints = [...points];
                newPoints[idx] = clickPoint;
                setPoints(newPoints);
                e.stopPropagation();
            }
        } else {
            e.stopPropagation();
            setPoints([...points, e.point.clone().normalize().multiplyScalar(RADIUS)]);
        }
    };

    // Calculate Arcs
    const arcs = useMemo(() => {
        if (points.length < 2) return [];
        const res = [];

        // Pairs: 0-1, 1-2, 2-0 (if 3 pnts)
        const pairs = [];
        if (points.length === 2) pairs.push([0, 1]);
        if (points.length === 3) {
            pairs.push([0, 1]); // c
            pairs.push([1, 2]); // a
            pairs.push([2, 0]); // b
        }

        for (const [i1, i2] of pairs) {
            const v1 = points[i1];
            const v2 = points[i2];

            // Generate Great Circle points
            const arcPoints = [];

            const vec1 = v1.clone().normalize();
            const vec2 = v2.clone().normalize();

            // Angle between them
            const angle = vec1.angleTo(vec2);
            const steps = Math.max(10, Math.floor(angle * 20)); // Adaptive steps

            for (let s = 0; s <= steps; s++) {
                const t = s / steps;

                // Manual Slerp for Vectors
                const sinOm = Math.sin(angle);
                if (sinOm < 0.0001) {
                    arcPoints.push(v1.clone().multiplyScalar(RADIUS)); // Coincident
                    continue;
                }

                const coeff1 = Math.sin((1 - t) * angle) / sinOm;
                const coeff2 = Math.sin(t * angle) / sinOm;

                const p = vec1.clone().multiplyScalar(coeff1).add(vec2.clone().multiplyScalar(coeff2));
                arcPoints.push(p.multiplyScalar(RADIUS));
            }
            res.push({ points: arcPoints, length: toDeg(angle) });
        }
        return res;
    }, [points]);

    // Calculate Angles (only if 3 points)
    const triangleData = useMemo(() => {
        if (points.length !== 3) return null;

        // Sides (in radians)
        const vA = points[0].clone().normalize();
        const vB = points[1].clone().normalize();
        const vC = points[2].clone().normalize();

        const c = vA.angleTo(vB);
        const a = vB.angleTo(vC);
        const b = vC.angleTo(vA);

        // Internal Angles (Spherical Law of Cosines)

        const calcAngle = (sideOp: number, sideAdj1: number, sideAdj2: number) => {
            const val = (Math.cos(sideOp) - Math.cos(sideAdj1) * Math.cos(sideAdj2)) /
                (Math.sin(sideAdj1) * Math.sin(sideAdj2));
            // Clamp for float errors
            const clamped = Math.max(-1, Math.min(1, val));
            return Math.acos(clamped);
        };

        const AngA = toDeg(calcAngle(a, b, c));
        const AngB = toDeg(calcAngle(b, a, c));
        const AngC = toDeg(calcAngle(c, a, b));

        return {
            sides: { a: toDeg(a), b: toDeg(b), c: toDeg(c) },
            angles: { A: AngA, B: AngB, C: AngC }
        };

    }, [points]);

    return (
        <group>
            {/* Interaction Layer */}
            <mesh onClick={handleClick} visible={false}>
                <sphereGeometry args={[RADIUS, 64, 64]} />
                <meshBasicMaterial side={THREE.DoubleSide} />
            </mesh>

            {/* Points */}
            {points.map((p, i) => (
                <Sphere key={i} position={p} args={[0.3, 16, 16]}>
                    <meshStandardMaterial color="#ff3366" emissive="#ff0044" emissiveIntensity={0.5} />
                    <Html position={[0, 0.5, 0]}>
                        <div className="text-white font-bold bg-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg">
                            {['A', 'B', 'C'][i]}
                        </div>
                    </Html>
                </Sphere>
            ))}

            {/* Arcs */}
            {arcs.map((arc, i) => (
                <group key={i}>
                    <Line points={arc.points} color="#ffffff" lineWidth={4} />
                </group>
            ))}

            {/* Centroid Data Display */}
            {triangleData && (
                <Html fullscreen style={{ pointerEvents: 'none', zIndex: 10 }}>
                    <div className="w-full h-full relative">
                        <motion.div
                            drag
                            dragMomentum={false}
                            initial={{ x: 20, y: -20 }}
                            className="absolute bottom-10 left-10 pointer-events-auto cursor-move select-none"
                            style={{ touchAction: 'none' }}
                        >
                            <div className="flex flex-col gap-2 p-4 min-w-[200px] backdrop-blur-xl bg-slate-900/80 border border-white/20 rounded-xl text-white shadow-2xl">
                                <h3 className="text-sm font-bold border-b border-white/20 pb-1 mb-1 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                                    Spherical Triangle
                                </h3>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                    <div className="text-gray-400">Sides (deg)</div>
                                    <div className="text-gray-400">Angles (deg)</div>

                                    <div><span className="text-pink-400 font-mono">a:</span> {triangleData.sides.a.toFixed(1)}°</div>
                                    <div><span className="text-violet-400 font-mono">A:</span> {triangleData.angles.A.toFixed(1)}°</div>

                                    <div><span className="text-pink-400 font-mono">b:</span> {triangleData.sides.b.toFixed(1)}°</div>
                                    <div><span className="text-violet-400 font-mono">B:</span> {triangleData.angles.B.toFixed(1)}°</div>

                                    <div><span className="text-pink-400 font-mono">c:</span> {triangleData.sides.c.toFixed(1)}°</div>
                                    <div><span className="text-violet-400 font-mono">C:</span> {triangleData.angles.C.toFixed(1)}°</div>
                                </div>

                                <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-center text-gray-500 italic flex justify-between items-center">
                                    <span>Drag to move</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setPoints([]); }}
                                        className="text-red-400 hover:text-red-300 font-bold px-1"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </Html>
            )}


        </group>
    );
};
