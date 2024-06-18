import { Path } from "./Path";

export class Population {
    private paths: Path[] = [];

    constructor(size: number, initialize: boolean) {
        if (initialize) {
            for (let i = 0; i < size; i++) {
                const newPath = new Path();
                newPath.generateIndividual();
                this.savePath(i, newPath);
            }
        }
    }

    size(): number {
        return this.paths.length;
    }

    savePath(index: number, path: Path): void {
        this.paths[index] = path;
    }

    getPath(index: number): Path {
        return this.paths[index];
    }

    getFittest(): Path {
        let fittest = this.paths[0];
        for (let i = 1; i < this.size(); i++) {
            if (fittest.getFitness() <= this.getPath(i).getFitness()) {
                fittest = this.getPath(i);
            }
        }
        return fittest;
    }
}
