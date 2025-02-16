import { City } from './City';

// Códigos ANSI para colores
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    
    fg: {
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m'
    }
};

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
        // Mostrar el orden de las ciudades con mejor formato
        const cityNames = this.path.map(city => city.getCityName());
        
        console.log(`${colors.fg.cyan}Ruta: ${colors.reset}`);
        
        // Imprimir las ciudades en grupos de 5 por línea
        for (let i = 0; i < cityNames.length; i += 5) {
            const line = cityNames.slice(i, i + 5).join(' → ');
            if (i === 0) {
                console.log(`  ${colors.fg.green}${line}${colors.reset}`);
            } else {
                console.log(`  ${colors.fg.yellow}${line}${colors.reset}`);
            }
        }
        
        // Mostrar la distancia total y si es válida
        const validStatus = this.isValidPath() 
            ? `${colors.fg.green}Válida${colors.reset}` 
            : `${colors.fg.red}Inválida${colors.reset}`;
            
        console.log(`${colors.fg.white}Distancia total: ${colors.bright}${this.totalDistance.toFixed(2)}${colors.reset}`);
        console.log(`${colors.fg.white}Estado de la ruta: ${validStatus}`);
    }

    private isValidPath(): boolean {
        const visitedCities = new Set<string>();
        
        // Verificar todas las ciudades excepto la última (que debe ser igual a la primera)
        for (let i = 0; i < this.path.length - 1; i++) {
            const cityName = this.path[i].getCityName();
            if (visitedCities.has(cityName)) {
                return false;
            }
            visitedCities.add(cityName);
        }
        
        // Verificar que la ruta comience y termine en la misma ciudad
        return this.path.length > 0 && 
               this.path[0].getCityName() === this.path[this.path.length - 1].getCityName();
    }
}