export class City {
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    distanceTo(city: City): number {
        const xDistance = Math.abs(this.getX() - city.getX());
        const yDistance = Math.abs(this.getY() - city.getY());
        return Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));
    }

    toString(): string {
        return `${this.getX()}, ${this.getY()}`;
    }
}
