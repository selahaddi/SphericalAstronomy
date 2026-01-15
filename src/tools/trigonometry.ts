import { toRad, toDeg } from './sphericalMath';

export const EARTH_RADIUS_KM = 6371;

export class SphericalTrig {

    // Solve Isosceles Triangle: Given angles A, B and side a (opposite to A)
    static solveIsosceles(A_deg: number, a_deg: number): { c: number, C: number, area: number, excess: number } {
        // Bisect angle C and side c.
        // Triangle 90, A, C/2. Sides a, c/2, altitude.
        // Napier's Rules for Right Spherical Triangle.
        const A_rad = toRad(A_deg);
        const a_rad = toRad(a_deg);

        // Rule 1: Relation between A, a, c/2
        // cos(A) = tan(c/2) * cot(a)  -> tan(c/2) = cos(A) * tan(a)
        const c_half_rad = Math.atan(Math.cos(A_rad) * Math.tan(a_rad));
        const c_deg = toDeg(c_half_rad * 2);

        // Rule 2: Relation between A, a, C/2
        // cos(a) = cot(A) * cot(C/2) -> tan(C/2) = 1 / (cos(a) * tan(A))
        const C_half_rad = Math.atan(1 / (Math.cos(a_rad) * Math.tan(A_rad)));

        const C_rad = C_half_rad * 2;
        const C_deg = toDeg(C_rad);

        const Excess_deg = (A_deg + A_deg + C_deg) - 180;
        const R = EARTH_RADIUS_KM;
        // Area = (E_rad) * R^2 
        // E_rad = E_deg * PI / 180
        const Area = (Excess_deg * Math.PI * R * R) / 180;

        return { c: c_deg, C: C_deg, area: Area, excess: Excess_deg };
    }

    // PZS Triangle Conversion
    // Given: Lat (phi), Dec (delta), Hour Angle (t)
    // Find: Alt (a), Az (A)
    static solvePZS(lat: number, dec: number, ha: number): { alt: number, az: number } {
        const phi = toRad(lat);
        const del = toRad(dec);
        const t = toRad(ha * 15); // HA in hours usually

        // Cosine Rule for Side ZS (Zenith Distance z = 90 - alt)
        // cos(z) = sin(phi)sin(del) + cos(phi)cos(del)cos(t)
        const sinAlt = Math.sin(phi) * Math.sin(del) + Math.cos(phi) * Math.cos(del) * Math.cos(t);
        const altRad = Math.asin(sinAlt);

        // Robust vector approach for Azimuth:
        const x = -Math.sin(t) * Math.cos(del);
        const y = Math.sin(del) * Math.cos(phi) - Math.cos(del) * Math.sin(phi) * Math.cos(t);
        const azRad = Math.atan2(x, y);

        return { alt: toDeg(altRad), az: (toDeg(azRad) + 360) % 360 };
    }

    // Sunrise/Sunset Calc
    static calculateRiseSet(lat: number, dec: number, refractionDeg = 50 / 60): { lha: number } {
        // Star/Sun center is at altitude = -refraction roughly.
        // h = -refraction
        // cos(t) = (sin(h) - sin(phi)sin(del)) / (cos(phi)cos(del))

        const h = toRad(-refractionDeg); // -50 arcminutes roughly
        const phi = toRad(lat);
        const del = toRad(dec);

        const cosT = (Math.sin(h) - Math.sin(phi) * Math.sin(del)) / (Math.cos(phi) * Math.cos(del));

        if (cosT < -1 || cosT > 1) return { lha: 0 }; // Circumpolar or never rises

        const tRad = Math.acos(cosT);
        return { lha: toDeg(tRad) / 15 }; // Result in Hours
    }
}
