export class Ease {
    public static inBack(t: number, v: number = 0.6): number {
        const s: number = v || 1.70158;
        return t * t * ((s + 1) * t - s);
    }

    public static inSine(t: number): number {
        return 1 - Math.cos(t * Math.PI / 2);
    }

    public static outSine(t: number): number {
        return Math.cos(t * Math.PI / 2);
    }    

    public static inElastic(t: number, a: number = 0.1, p: number = 0.7): number {
        let s: number;
        if (t === 0) return 0;
        if (t === 1) return 1;
        if (!a || a < 1) { a = 1; s = p / 4; }
        else s = p * Math.asin(1 / a) / (2 * Math.PI);
        return - (a * Math.pow(2, 10 * (t - 1)) * Math.sin(((t - 1) - s) * (2 * Math.PI) / p));
    }

    public static outElastic(t: number, a: number = 0.1, p: number = 0.4): number {
        let s: number;
        if (t === 0) return 0;
        if (t === 1) return 1;
        if (!a || a < 1) { a = 1; s = p / 4; }
        else s = p * Math.asin(1 / a) / (2 * Math.PI);
        return - (a * Math.pow(2, 10 * (t - 1)) * Math.sin(((t - 1) - s) * (2 * Math.PI) / p));
    }

    public static inQuad(t: number): number {
        return t * t;
    }

    public static inBounce(t: number): number {
        return 1 - this.outBounce(1 - t);
    }

    public static outBounce(t: number): number {
        if (t < (1 / 2.75)) {
            return 7.5625 * t * t;
        } else if (t < (2 / 2.75)) {
            t = (t - (1.5 / 2.75));
            return 7.5625 * t * t + 0.75;
        } else if (t < (2.5 / 2.75)) {
            t = (t - (2.25 / 2.75));
            return 7.5625 * t * t + 0.9375;
        } else {
            t -= (2.625 / 2.75);
            return 7.5625 * t * t + 0.984375;
        }
    }

    public static inOutBounce(t: number): number {
        if (t < 0.5) return this.inBounce(t * 2) * 0.5;
        return this.outBounce(t * 2 - 1) * 0.5 + 0.5;
    }
}