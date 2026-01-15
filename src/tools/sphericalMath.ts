import * as THREE from 'three';

export const RADIUS = 10;

// Convert Spherical Audio/Physics coordinates (r, theta, phi) to Cartesian is standard,
// but for Astronomy we use Right Ascension (RA) and Declination (Dec).
// Or Altitude/Azimuth.
// Let's standardise on a unit sphere of radius R.

// Convert Degrees to Radians
export const toRad = (deg: number) => (deg * Math.PI) / 180;
export const toDeg = (rad: number) => (rad * 180) / Math.PI;

// Convert RA (hours) / Dec (degrees) to Cartesian
// RA in hours (0-24), Dec in degrees (-90 to +90)
export const equatorialToVector3 = (raHours: number, decDeg: number, radius = RADIUS) => {
    const raRad = toRad(raHours * 15); // 1 hour = 15 degrees
    const decRad = toRad(decDeg);

    // Y is up (North Pole)
    // X points to Vernal Equinox (RA=0)?
    // Z points to RA=6h?
    // x = r cos(dec) cos(ra)
    // z = -r cos(dec) sin(ra)  (Three.js RHS: -Z is forward)
    // y = r sin(dec)

    // Let's align such that:
    // North Pole = +Y
    // Vernal Equinox = +X (or -Z)

    const phi = Math.PI / 2 - decRad; // polar angle from +Y
    const theta = raRad; // azimuthal angle

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    // Note: ThreeJS coordinate system.

    return new THREE.Vector3(x, y, z);
};

// Convert Alt/Az to Cartesian
// Alt: 0 at horizon, 90 at Zenith (+Y for local coords)
// Az: 0 at North? South? 
export const horizontalToVector3 = (azDeg: number, altDeg: number, radius = RADIUS) => {
    const altRad = toRad(altDeg);
    const azRad = toRad(azDeg);

    const y = radius * Math.sin(altRad);
    const rPlane = radius * Math.cos(altRad);

    // If Az=0 is North (-Z in ThreeJS default camera view? Or +Z?)
    // Let's assume standard math: x = r cos(az), z = r sin(az)
    const x = rPlane * Math.sin(azRad);
    const z = rPlane * Math.cos(azRad);
    // We can adjust this to match the visual orientation later.

    return new THREE.Vector3(x, y, z);
}

// Great Circle Distance between two vectors
export const calculateGreatCircleAngle = (v1: THREE.Vector3, v2: THREE.Vector3) => {
    return v1.angleTo(v2); // Returns radians [0, PI]
}

export const formatDegrees = (deg: number) => deg.toFixed(2) + '°';
export const formatHours = (hrs: number) => {
    const h = Math.floor(hrs);
    const m = Math.floor((hrs - h) * 60);
    return `${h}h ${m}m`;
}
