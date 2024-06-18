export class City {
    private cityPosition: Point;
    private cityName: string;

    constructor(name: string, coordinate: Point) {
        this.cityName = name;
        this.cityPosition = coordinate;
    }

    getCityName(): string {
        return this.cityName;
    }

    getCityPosition(): Point {
        return this.cityPosition;
    }
}

interface Point {
    x: number;
    y: number;
}
