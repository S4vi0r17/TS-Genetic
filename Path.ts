import { createLanguageService } from 'typescript';
import { City } from './City';

export class Path {
    public path: City[];
    private totalDistance: number;

    constructor() {
        this.path = [];
        this.totalDistance = 0;
    }

    getCityFromPath(index: number): City {
        return this.path[index];
    }

    calculateEuclideanDistance(): void {
        let euclideanDistance = 0;
        for (let i = 0; i < this.path.length; i++) {
            if (!(i === this.path.length - 1)) {
                euclideanDistance += Math.sqrt(
                    Math.pow(this.path[i + 1].getCityPosition().x - this.path[i].getCityPosition().x, 2) +
                    Math.pow(this.path[i + 1].getCityPosition().y - this.path[i].getCityPosition().y, 2)
                );
            } else {
                euclideanDistance += Math.sqrt(
                    Math.pow(this.path[0].getCityPosition().x - this.path[i].getCityPosition().x, 2) +
                    Math.pow(this.path[0].getCityPosition().y - this.path[i].getCityPosition().y, 2)
                );
            }
            this.totalDistance = euclideanDistance;
        }
    }

    getEuclideanDistance(): number {
        return this.totalDistance;
    }

    addCity(city: City): void {
        this.path.push(city);
    }

    printPath(): void {
        for (let i = 0; i < this.path.length; i++) {
            process.stdout.write(`${this.path[i].getCityName()}\t`);
        }
        process.stdout.write(`${this.totalDistance}`);
        if (this.isValidPath()) {
            process.stdout.write(' Valid path');
        } else {
            process.stdout.write(' Invalid path');
        }
        process.stdout.write('\n');
    }

    // PrintPath(): void {
    //     for (let i = 0; i < this.path.length; i++) {
    //         console.log(`${this.path[i].getCityName()}\t`);
    //     }
    //     console.log(`${this.totalDistance}`);
    // }

    // private isValidPath(): boolean {
    //     for (let i = 0; i < this.path.length - 1; i++) {
    //         for (let j = i + 1; j < this.path.length; j++) {
    //             if (this.path[i].getCityName() === this.path[j].getCityName()) {
    //                 return false;
    //             }
    //         }
    //     }
    //     return true;
    // }

    private isValidPath(): boolean {
        const visitedCities = new Set<string>();
        for (const city of this.path) {
            if (visitedCities.has(city.getCityName())) {
                return false;
            }
            visitedCities.add(city.getCityName());
        }
        // Asegurarse de que la ruta comienza y termina en la misma ciudad
        return this.path.length > 0 && this.path[0].getCityName() === this.path[this.path.length - 1].getCityName();
    }
}

