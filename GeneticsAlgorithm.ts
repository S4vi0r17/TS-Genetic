import { Path } from "./Path";
import { Population } from "./Poputation";

export class GeneticsAlgorithm {
    private static readonly mutationRate: number = 0.015;
    private static readonly tournamentSize: number = 5;
    private static readonly elitism: boolean = true;

    static evolvePopulation(pop: Population): Population {
        const newPopulation = new Population(pop.size(), false);

        let elitismOffset = 0;
        if (this.elitism) {
            newPopulation.savePath(0, pop.getFittest());
            elitismOffset = 1;
        }

        for (let i = elitismOffset; i < newPopulation.size(); i++) {
            const parent1 = this.tournamentSelection(pop);
            const parent2 = this.tournamentSelection(pop);
            const child = this.crossover(parent1, parent2);
            newPopulation.savePath(i, child);
        }

        for (let i = elitismOffset; i < newPopulation.size(); i++) {
            this.mutate(newPopulation.getPath(i));
        }

        return newPopulation;
    }

    private static crossover(parent1: Path, parent2: Path): Path {
        const child = new Path();

        const startPos = Math.floor(Math.random() * parent1.pathSize());
        const endPos = Math.floor(Math.random() * parent1.pathSize());

        for (let i = 0; i < child.pathSize(); i++) {
            if (startPos < endPos && i > startPos && i < endPos) {
                child.setCity(i, parent1.getCity(i));
            } else if (startPos > endPos) {
                if (!(i < startPos && i > endPos)) {
                    child.setCity(i, parent1.getCity(i));
                }
            }
        }

        for (let i = 0; i < parent2.pathSize(); i++) {
            if (!child.containsCity(parent2.getCity(i)!)) {
                for (let ii = 0; ii < child.pathSize(); ii++) {
                    if (child.getCity(ii) == null) {
                        child.setCity(ii, parent2.getCity(i));
                        break;
                    }
                }
            }
        }

        return child;
    }

    private static mutate(path: Path): void {
        for (let pathPos1 = 0; pathPos1 < path.pathSize(); pathPos1++) {
            if (Math.random() < this.mutationRate) {
                const pathPos2 = Math.floor(Math.random() * path.pathSize());

                const city1 = path.getCity(pathPos1);
                const city2 = path.getCity(pathPos2);

                path.setCity(pathPos2, city1);
                path.setCity(pathPos1, city2);
            }
        }
    }

    private static tournamentSelection(pop: Population): Path {
        const tournament = new Population(this.tournamentSize, false);
        for (let i = 0; i < this.tournamentSize; i++) {
            const randomId = Math.floor(Math.random() * pop.size());
            tournament.savePath(i, pop.getPath(randomId));
        }
        return tournament.getFittest();
    }
}
