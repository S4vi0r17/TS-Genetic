import { City } from "./City";
import { CityManager } from "./CityManager";

export class Path {
    private cities: (City | null)[] = [];
    private fitness: number = 0;
    private distance: number = 0;

    constructor() {
        for (let i = 0; i < CityManager.numberOfCities(); i++) {
            this.cities.push(null);
        }
    }

    pathSize(): number {
        return this.cities.length;
    }

    getCity(index: number): City | null {
        return this.cities[index];
    }

    setCity(index: number, city: City | null): void {
        this.cities[index] = city;
        this.fitness = 0;
        this.distance = 0;
    }

    containsCity(city: City): boolean {
        return this.cities.includes(city);
    }

    generateIndividual(): void {
        for (let cityIndex = 0; cityIndex < CityManager.numberOfCities(); cityIndex++) {
            this.setCity(cityIndex, CityManager.getCity(cityIndex));
        }
        this.cities = this.shuffle(this.cities);
    }

    getFitness(): number {
        if (this.fitness === 0) {
            this.fitness = 1 / this.getDistance();
        }
        return this.fitness;
    }

    getDistance(): number {
        if (this.distance === 0) {
            let pathDistance = 0;
            for (let cityIndex = 0; cityIndex < this.pathSize(); cityIndex++) {
                const fromCity = this.getCity(cityIndex);
                const destinationCity = this.getCity(cityIndex + 1 < this.pathSize() ? cityIndex + 1 : 0);
                if (fromCity && destinationCity) {
                    pathDistance += fromCity.distanceTo(destinationCity);
                }
            }
            this.distance = pathDistance;
        }
        return this.distance;
    }

    private shuffle(array: (City | null)[]): (City | null)[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    toString(): string {
        return this.cities.map(city => city ? city.toString() : "").join(" -> ");
    }
}
