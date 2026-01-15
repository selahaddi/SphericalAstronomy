export class DMS {
    // Parse various string formats to Decimal Degrees
    // Supports: "125 30 40", "125° 30' 40\"", "125.5", "12h 30m" (if isHour=true)
    static parse(str: string | number): number {
        if (typeof str === 'number') return str;
        if (!str) return 0;

        // Cleanup
        let s = str.trim().replace(/[°'"hms]/g, ' ');
        s = s.replace(/\s+/g, ' ');

        const parts = s.split(' ').map(parseFloat);

        let val = 0;
        if (parts.length >= 1 && !isNaN(parts[0])) val += parts[0];
        if (parts.length >= 2 && !isNaN(parts[1])) val += parts[1] / 60;
        if (parts.length >= 3 && !isNaN(parts[2])) val += parts[2] / 3600;

        return val;
    }

    // Format Decimal Degrees to DMS String
    static format(deg: number, precision = 1): string {
        const d = Math.floor(deg);
        const m = Math.floor((deg - d) * 60);
        const s = ((deg - d) * 60 - m) * 60;

        return `${d}° ${m}' ${s.toFixed(precision)}"`;
    }

    // Format Decimal Hours to HMS String
    static formatTime(hrs: number): string {
        const h = Math.floor(hrs);
        const m = Math.floor((hrs - h) * 60);
        const s = ((hrs - h) * 60 - m) * 60;
        return `${h}h ${m}m ${s.toFixed(1)}s`;
    }
}
