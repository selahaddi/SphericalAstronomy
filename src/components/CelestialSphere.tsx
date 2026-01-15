import React, { useRef } from 'react';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { RADIUS } from '../tools/sphericalMath';

interface CelestialSphereProps {
    opacity?: number;
}

export const CelestialSphere: React.FC<CelestialSphereProps> = ({ opacity = 0.1 }) => {
    const sphereRef = useRef<THREE.Mesh>(null);

    // Optional: Slow rotation to simulate sidereal motion if desired, but 
    // for educational "static" sphere we might keep it still.
    // useFrame((state, delta) => {
    //     if (sphereRef.current) {
    //         sphereRef.current.rotation.y += delta * 0.01;
    //     }
    // });

    return (
        <group>
            {/* The main glass sphere */}
            <Sphere ref={sphereRef} args={[RADIUS, 64, 64]}>
                <meshStandardMaterial
                    color="#445588"
                    roughness={0.1}
                    metalness={0.1}
                    transparent
                    opacity={opacity}
                    side={THREE.DoubleSide}
                    depthWrite={false} // Important for inner objects to be visible
                />
            </Sphere>

            {/* Outline wireframe for better definition */}
            <Sphere args={[RADIUS * 1.001, 32, 32]}>
                <meshBasicMaterial
                    color="#6688cc"
                    wireframe
                    transparent
                    opacity={0.05}
                />
            </Sphere>
        </group>
    );
};
