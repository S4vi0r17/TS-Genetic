import * as readline from 'readline';
import { GeneticsAlgorithm } from './GeneticsAlgorithm';

const welcomeMessage = "Escribe las coordenadas de las ciudades con el sig. formato:\nEjemplo: ((1,1) (2,2) (3,3) (4,5))";
let error = true;
let tsp: GeneticsAlgorithm | undefined;

const parseStringToCoordinates = (from: string): void => {
    if (from.length > 2 && from.charAt(0) === '(' && from.charAt(from.length - 1) === ')') {
        console.log("Es una cadena valida");
        const coordinates = from.substring(1, from.length - 1).split(' ');
        tsp = new GeneticsAlgorithm(20);

        for (let i = 0; i < coordinates.length; i++) {
            const coordinate = coordinates[i].replace(/[\(\)]/g, '');
            const pattern = /[0-9]+(,[0-9]+)/;
            const matcher = pattern.exec(coordinate);

            if (matcher) {
                const [x, y] = coordinate.split(',').map(Number);
                tsp.setNew({ x, y });
            } else {
                console.log("No es una cadena valida");
                error = false;
                return;
            }
        }

        tsp.createPaths();
        tsp.launchSimulation();
        error = false;
    } else {
        console.log("No es una cadena valida");
        error = true;
    }
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question(welcomeMessage, (userInput) => {
    parseStringToCoordinates(userInput);
    rl.close();
});

/* Example
Escribe las coordenadas de las ciudades con el sig. formato:
Ejemplo: ((60,200) (180,200) (80,180) (140,180) (20,160) (100,160) (200,160) (140,140) (40,120) (100,120))

*/
