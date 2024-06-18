import { City } from "./City";

export class CityManager {
    private static cities: City[] = [];

    static addCity(city: City): void {
        this.cities.push(city);
    }

    static getCity(index: number): City {
        return this.cities[index];
    }

    static numberOfCities(): number {
        return this.cities.length;
    }
}
