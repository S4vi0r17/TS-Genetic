import { City } from './City';
import { Path } from './Path';

interface Point {
    x: number;
    y: number;
}

export class GeneticsAlgorithm {
    private map: City[];
    private paths: Path[];
    private n: number;
    private maxGenerations: number;
    private generation: number;
    private populationSize: number;
    private names: string[] = ["Airds", "Albury", "Armidale", "Ashfield", "Bradbury", "Bankstown", "Bateau-Bay", "Batemans-Bay-Outreach", "Bathurst", "Bega", "Bidwill", "Blackett", "Blacktown", "Burwood", "Campbelltown", "Casino", "Charlestown", "Claymore", "Claymore-Gumnut-Services", "Coffs-Harbour", "Cootamundra", "Government-Office-Building", "Corrimal", "Cowra", "Cranebrook", "Dapto", "Dee-Why", "Dubbo", "Fairfield", "Glebe-Outreach", "Gosford", "Goulburn", "Grafton", "Griffith", "Gunnedah", "Hamilton-South", "Hurstville", "Inverell", "Kempsey", "Leeton-Outreach", "Lismore", "Lithgow", "Liverpool", "Macquarie-Fields", "Maitland", "Maroubra", "Miller", "Minto", "Miranda", "Moree", "Moree-South-ITM", "Mount-Druitt", "Narrabri", "Newcastle", "Nowra", "Orange", "Parkes", "Parramatta", "Penrith", "Port-Macquarie", "Queanbeyan", "Raymond-Terrace", "Redfern", "Riverwood", "Ryde", "Seven-Hills", "Shellharbour", "South-Coogee", "Surry-Hills", "Tamworth", "Tamworth-ITM", "Taree", "Telopea-ITM", "Toronto", "Tumut-Outreach", "Tweed-Heads", "Wagga-Wagga", "Waterloo", "Willmot", "Wollongong", "Woolloomooloo", "Wyong"];
    private bannedCities: number[];

    constructor(max: number) {
        this.map = [];
        this.paths = [];
        this.n = 0;
        this.generation = 0;
        this.populationSize = 0;
        this.bannedCities = [];
        this.maxGenerations = max;
    }

    setNew(coordinate: Point): void {
        const newCity = new City(this.names[this.n], coordinate);
        this.map.push(newCity);
        this.n++;
    }

    createPaths(): void {
        if ((3 * this.n) % 2 === 0) {
            this.populationSize = (3 * this.n);
        } else {
            this.populationSize = (3 * this.n) + 1;
        }

        // OJO
        for (let i = 0; i < this.populationSize; i++) {
            const newPath = new Path();
            this.paths.push(newPath);
            let j = 0;
            while (j < this.map.length) {
                newPath.addCity(this.map[this.generateNewCityBanning()]);
                j++;
            }
            newPath.addCity(newPath.getCityFromPath(0));
            newPath.calculateEuclideanDistance();
            this.bannedCities = [];
        }
    }

    launchSimulation(): void {
        for (let i = 0; i < this.maxGenerations; i++) {
            this.generation++;
            // Sort paths by Euclidean distance
            this.paths.sort((a, b) => a.getEuclideanDistance() - b.getEuclideanDistance());

            const newPaths: Path[] = [];
            const tmp: number[] = this.paths.map(path => path.getEuclideanDistance());

            // Deterministic selection
            for (let j = 0; j < tmp.length; j++) {
                if ((j < (tmp.length) / 4) || (j >= tmp.length / 2 && j <= (tmp.length - tmp.length / 4))) {
                    // Do nothing
                } else {
                    tmp[j] = -1.0;
                }
            }

            for (let j = 0; j < tmp.length; j++) {
                if (tmp[j] === this.paths[j].getEuclideanDistance()) {
                    newPaths.push(this.paths[j]);
                }
            }

            // Crossover
            const fatherSize = newPaths.length;
            for (let j = 0; j < (fatherSize - 1); j++) {
                if (newPaths[j + 1] !== undefined) {
                    const f1 = newPaths[j];
                    const f2 = newPaths[j + 1];
                    const s1 = new Path();
                    const s2 = new Path();

                    let cutPoint1 = 0;
                    let cutPoint2 = 0;
                    let aux = 0;

                    do {
                        cutPoint1 = Math.floor(Math.random() * (newPaths[j].path.length - 1));
                        cutPoint2 = cutPoint1;

                        while (cutPoint2 === cutPoint1 || cutPoint2 === cutPoint1 + 2 || cutPoint2 === cutPoint1 - 2 || cutPoint2 === cutPoint1 + 1 || cutPoint2 === cutPoint1 - 1) {
                            cutPoint2 = Math.floor(Math.random() * (newPaths[j].path.length - 1));
                        }

                        if (cutPoint1 > cutPoint2) {
                            aux = cutPoint2;
                            cutPoint2 = cutPoint1;
                            cutPoint1 = aux;
                        }
                    } while (!this.generateNewValidPath(f1, f2, s1, s2, cutPoint1, cutPoint2));

                    if (s1.getEuclideanDistance() < s2.getEuclideanDistance()) {
                        newPaths.push(s1);
                    } else {
                        newPaths.push(s2);
                    }
                }
            }

            // Mutation
            for (let a = 0; a < newPaths.length; a++) {
                const temporal = new Path();
                const cutPoint1 = Math.floor(Math.random() * (newPaths[a].path.length - 2));
                let cutPoint2 = cutPoint1;
                if (cutPoint2 === 0) cutPoint2++;
                while (cutPoint2 === cutPoint1 || cutPoint2 < 1) {
                    cutPoint2 = Math.floor(Math.random() * (newPaths[a].path.length - 2));
                }

                for (let b = 0; b < newPaths[a].path.length; b++) {
                    temporal.path.push(newPaths[a].getCityFromPath(b));
                }

                // Swap cities and calculate new Euclidean distance
                const temp = temporal.path[cutPoint1];
                temporal.path[cutPoint1] = temporal.path[cutPoint2];
                temporal.path[cutPoint2] = temp;
                temporal.calculateEuclideanDistance();

                if (temporal.getEuclideanDistance() < newPaths[a].getEuclideanDistance()) {
                    newPaths[a] = temporal;
                }
            }

            this.paths = newPaths;

            console.log(`\nGeneration: ${this.generation}`);
            this.paths.sort((a, b) => a.getEuclideanDistance() - b.getEuclideanDistance());
            this.paths[0].printPath();
            console.log(this.isValidPath(this.paths[0]) ? ' Valid path' : ' Invalid path');
        }
    }

    private generateNewValidPath(f1: Path, f2: Path, s1: Path, s2: Path, minCutPoint: number, maxCutPoint: number): boolean {
        minCutPoint++;
        const f1Extract: City[] = [];
        const f2Extract: City[] = [];

        if (
            !(f1.getCityFromPath(minCutPoint).getCityName() === f2.getCityFromPath(minCutPoint + 1).getCityName()) ||
            !(f1.getCityFromPath(maxCutPoint - 1).getCityName() === f2.getCityFromPath(maxCutPoint).getCityName()) ||
            !(f2.getCityFromPath(minCutPoint).getCityName() === f1.getCityFromPath(minCutPoint + 1).getCityName()) ||
            !(f2.getCityFromPath(maxCutPoint - 1).getCityName() === f1.getCityFromPath(maxCutPoint).getCityName())
        ) {
            for (let i = 0; i < f1.path.length; i++) {
                s1.path.push(f1.getCityFromPath(i));
                s2.path.push(f2.getCityFromPath(i));
            }

            let j = 0;
            for (let i = minCutPoint; i < maxCutPoint; i++) {
                f1Extract[j] = f1.getCityFromPath(i);
                f2Extract[j] = f2.getCityFromPath(i);
                s1.path[i] = f2Extract[j];
                s2.path[i] = f1Extract[j];
                j++;
            }

            for (let i = 0; i < f1Extract.length; i++) {
                for (let x = 0; x < f1.path.length; x++) {
                    if (f2Extract[i].getCityName() === s1.getCityFromPath(x).getCityName() && (x < minCutPoint || x >= maxCutPoint)) {
                        for (let z = 0; z < f1.path.length; z++) {
                            let found = false;
                            for (let y = 0; y < s1.path.length; y++) {
                                if (f1.getCityFromPath(z).getCityName() === s1.getCityFromPath(y).getCityName()) {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                s1.path[x] = f1.getCityFromPath(z);
                                if (x === 0) {
                                    s1.path[s1.path.length - 1] = s1.getCityFromPath(0);
                                }
                                break;
                            }
                        }
                    }
                }
            }

            let w = 0;
            for (let i = 0; i < f2Extract.length; i++) {
                for (let x = 0; x < f2.path.length; x++) {
                    if (f1Extract[i].getCityName() === s2.getCityFromPath(x).getCityName() && (x < minCutPoint || x >= maxCutPoint)) {
                        for (let z = 0; z < f2.path.length; z++) {
                            let found = false;
                            for (let y = 0; y < s2.path.length; y++) {
                                if (f2.getCityFromPath(z).getCityName() === s2.getCityFromPath(y).getCityName()) {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                s2.path[x] = f2.getCityFromPath(z);
                                if (x === 0) {
                                    s2.path[s2.path.length - 1] = s2.getCityFromPath(0);
                                }
                                break;
                            }
                        }
                    }
                }
            }

            s1.calculateEuclideanDistance();
            s2.calculateEuclideanDistance();
            return true;
        } else {
            return false;
        }
    }

    private generateNewCityBanning(): number {
        while (true) {
            const testN = Math.floor(Math.random() * this.n);
            if (!this.bannedCities.includes(testN)) {
                this.bannedCities.push(testN);
                return testN;
            }
        }
    }

    private isValidPath(check: Path): boolean {
        for (let i = 0; i < check.path.length - 1; i++) {
            for (let j = 0; j < check.path.length - 1; j++) {
                if (check.getCityFromPath(i).getCityName() === check.getCityFromPath(j).getCityName() && i !== j) {
                    return false;
                }
            }
        }
        return true;
    }
}

