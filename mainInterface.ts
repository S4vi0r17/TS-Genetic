import { City } from './City';
import { CityManager } from './CityManager';
import { GeneticsAlgorithm } from './GeneticsAlgorithm';
import { Population } from './Poputation';

function main() {
    const cities: City[] = [
        new City(60, 200), new City(180, 200), new City(80, 180),
        new City(140, 180), new City(20, 160), new City(100, 160),
        new City(200, 160), new City(140, 140), new City(40, 120),
        new City(100, 120), new City(180, 100), new City(60, 80),
        new City(120, 80), new City(180, 60), new City(20, 40),
        new City(100, 40), new City(200, 40), new City(20, 20),
        new City(60, 20), new City(160, 20)
    ];

    for (const city of cities) {
        CityManager.addCity(city);
    }

    let pop = new Population(50, true); // 50 caminos
    console.log("Initial distance: " + pop.getFittest().getDistance());

    pop = GeneticsAlgorithm.evolvePopulation(pop);
    for (let i = 0; i < 100; i++) {
        pop = GeneticsAlgorithm.evolvePopulation(pop);
    }

    console.log("Finished");
    console.log("Final distance: " + pop.getFittest().getDistance());
    console.log("Solution:");
    console.log(pop.getFittest().toString());
}

main();
