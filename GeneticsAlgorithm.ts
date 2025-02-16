import { City } from './City';
import { Path } from './Path';

interface Point {
  x: number;
  y: number;
}

// Códigos ANSI para colores
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  },

  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
  },
};

export class GeneticsAlgorithm {
  private map: City[];
  private paths: Path[];
  private n: number;
  private maxGenerations: number;
  private generation: number;
  private populationSize: number;
  private names: string[] = [
    'Airds',
    'Albury',
    'Armidale',
    'Ashfield',
    'Bradbury',
    'Bankstown',
    'Bateau-Bay',
    'Batemans-Bay-Outreach',
    'Bathurst',
    'Bega',
    'Bidwill',
    'Blackett',
    'Blacktown',
    'Burwood',
    'Campbelltown',
    'Casino',
    'Charlestown',
    'Claymore',
    'Claymore-Gumnut-Services',
    'Coffs-Harbour',
    'Cootamundra',
    'Government-Office-Building',
    'Corrimal',
    'Cowra',
    'Cranebrook',
    'Dapto',
    'Dee-Why',
    'Dubbo',
    'Fairfield',
    'Glebe-Outreach',
    'Gosford',
    'Goulburn',
    'Grafton',
    'Griffith',
    'Gunnedah',
    'Hamilton-South',
    'Hurstville',
    'Inverell',
    'Kempsey',
    'Leeton-Outreach',
    'Lismore',
    'Lithgow',
    'Liverpool',
    'Macquarie-Fields',
    'Maitland',
    'Maroubra',
    'Miller',
    'Minto',
    'Miranda',
    'Moree',
    'Moree-South-ITM',
    'Mount-Druitt',
    'Narrabri',
    'Newcastle',
    'Nowra',
    'Orange',
    'Parkes',
    'Parramatta',
    'Penrith',
    'Port-Macquarie',
    'Queanbeyan',
    'Raymond-Terrace',
    'Redfern',
    'Riverwood',
    'Ryde',
    'Seven-Hills',
    'Shellharbour',
    'South-Coogee',
    'Surry-Hills',
    'Tamworth',
    'Tamworth-ITM',
    'Taree',
    'Telopea-ITM',
    'Toronto',
    'Tumut-Outreach',
    'Tweed-Heads',
    'Wagga-Wagga',
    'Waterloo',
    'Willmot',
    'Wollongong',
    'Woolloomooloo',
    'Wyong',
  ];
  private bannedCities: number[];
  private bestDistance: number = Infinity;
  private initialDistance: number = 0;
  private startTime: number = 0;

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
    // Asegurar que no excedamos el límite de nombres disponibles
    if (this.n >= this.names.length) {
      // Generar un nombre genérico si se excede el límite
      const newCity = new City(`Ciudad-${this.n + 1}`, coordinate);
      this.map.push(newCity);
    } else {
      const newCity = new City(this.names[this.n], coordinate);
      this.map.push(newCity);
    }
    this.n++;
  }

  createPaths(): void {
    // Asegurar que haya al menos 3 ciudades para que el algoritmo funcione correctamente
    if (this.n < 3) {
      console.log(
        `${colors.fg.red}Error: Se necesitan al menos 3 ciudades para crear rutas válidas.${colors.reset}`
      );
      return;
    }

    if ((3 * this.n) % 2 === 0) {
      this.populationSize = 3 * this.n;
    } else {
      this.populationSize = 3 * this.n + 1;
    }

    console.log(
      `${colors.fg.cyan}Creando población inicial de ${colors.bright}${this.populationSize}${colors.reset}${colors.fg.cyan} rutas...${colors.reset}`
    );

    for (let i = 0; i < this.populationSize; i++) {
      const newPath = new Path();
      this.paths.push(newPath);
      this.bannedCities = []; // Reiniciar la lista de ciudades prohibidas para cada nueva ruta

      let j = 0;
      while (j < this.map.length) {
        newPath.addCity(this.map[this.generateNewCityBanning()]);
        j++;
      }
      // Añadir la primera ciudad al final para cerrar el ciclo
      newPath.addCity(newPath.getCityFromPath(0));
      newPath.calculateEuclideanDistance();
    }

    // Ordenar las rutas y guardar la mejor distancia inicial
    this.paths.sort(
      (a, b) => a.getEuclideanDistance() - b.getEuclideanDistance()
    );
    this.initialDistance = this.paths[0].getEuclideanDistance();
    this.bestDistance = this.initialDistance;

    console.log(
      `${colors.fg.green}Población inicial creada. Mejor distancia inicial: ${
        colors.bright
      }${this.initialDistance.toFixed(2)}${colors.reset}`
    );
  }

  launchSimulation(): void {
    // Verificar que se hayan creado rutas
    if (this.paths.length === 0) {
      console.log(
        `${colors.fg.red}Error: No hay rutas para simular. Verifica la creación de ciudades y rutas.${colors.reset}`
      );
      return;
    }

    this.startTime = Date.now();
    this.printSimulationHeader();

    for (let i = 0; i < this.maxGenerations; i++) {
      this.generation++;

      // Sort paths by Euclidean distance
      this.paths.sort(
        (a, b) => a.getEuclideanDistance() - b.getEuclideanDistance()
      );

      const newPaths: Path[] = [];
      const tmp: number[] = this.paths.map((path) =>
        path.getEuclideanDistance()
      );

      // Deterministic selection
      for (let j = 0; j < tmp.length; j++) {
        if (
          j < tmp.length / 4 ||
          (j >= tmp.length / 2 && j <= tmp.length - tmp.length / 4)
        ) {
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

      // Verificar que haya suficientes rutas para el crossover
      if (newPaths.length < 2) {
        console.log(
          `${colors.fg.yellow}Advertencia: Muy pocas rutas para crossover. Añadiendo más rutas aleatorias...${colors.reset}`
        );
        // Añadir algunas rutas aleatorias adicionales
        while (newPaths.length < 2) {
          const randomIndex = Math.floor(Math.random() * this.paths.length);
          if (!newPaths.includes(this.paths[randomIndex])) {
            newPaths.push(this.paths[randomIndex]);
          }
        }
      }

      // Crossover
      const fatherSize = newPaths.length;
      for (let j = 0; j < fatherSize - 1; j++) {
        if (newPaths[j + 1] !== undefined) {
          const f1 = newPaths[j];
          const f2 = newPaths[j + 1];
          const s1 = new Path();
          const s2 = new Path();

          let cutPoint1 = 0;
          let cutPoint2 = 0;
          let aux = 0;
          let maxAttempts = 10; // Limitar los intentos para evitar bucles infinitos
          let valid = false;

          while (!valid && maxAttempts > 0) {
            cutPoint1 =
              Math.floor(Math.random() * (newPaths[j].path.length - 3)) + 1;
            cutPoint2 = cutPoint1;

            while (
              (cutPoint2 === cutPoint1 ||
                Math.abs(cutPoint2 - cutPoint1) <= 2) &&
              maxAttempts > 0
            ) {
              cutPoint2 =
                Math.floor(Math.random() * (newPaths[j].path.length - 3)) + 1;
              maxAttempts--;
            }

            if (cutPoint1 > cutPoint2) {
              aux = cutPoint2;
              cutPoint2 = cutPoint1;
              cutPoint1 = aux;
            }

            valid = this.generateNewValidPath(
              f1,
              f2,
              s1,
              s2,
              cutPoint1,
              cutPoint2
            );
            maxAttempts--;
          }

          if (valid) {
            if (s1.getEuclideanDistance() < s2.getEuclideanDistance()) {
              newPaths.push(s1);
            } else {
              newPaths.push(s2);
            }
          }
        }
      }

      // Mutation
      for (let a = 0; a < newPaths.length; a++) {
        if (newPaths[a].path.length < 4) continue; // Saltar si la ruta es demasiado corta

        const temporal = new Path();
        const cutPoint1 = Math.floor(
          Math.random() * (newPaths[a].path.length - 2)
        );
        let cutPoint2 = cutPoint1;

        if (cutPoint2 === 0) cutPoint2++;

        let maxAttempts = 10;
        while ((cutPoint2 === cutPoint1 || cutPoint2 < 1) && maxAttempts > 0) {
          cutPoint2 = Math.floor(Math.random() * (newPaths[a].path.length - 2));
          maxAttempts--;
        }

        if (cutPoint2 === cutPoint1) continue; // Saltar si no se pudo encontrar un punto diferente

        for (let b = 0; b < newPaths[a].path.length; b++) {
          temporal.path.push(newPaths[a].getCityFromPath(b));
        }

        // Swap cities and calculate new Euclidean distance
        const temp = temporal.path[cutPoint1];
        temporal.path[cutPoint1] = temporal.path[cutPoint2];
        temporal.path[cutPoint2] = temp;
        temporal.calculateEuclideanDistance();

        if (
          temporal.getEuclideanDistance() < newPaths[a].getEuclideanDistance()
        ) {
          newPaths[a] = temporal;
        }
      }

      this.paths = newPaths;

      // Ordenar y actualizar la mejor distancia
      this.paths.sort(
        (a, b) => a.getEuclideanDistance() - b.getEuclideanDistance()
      );
      const currentBest = this.paths[0].getEuclideanDistance();

      if (currentBest < this.bestDistance) {
        this.bestDistance = currentBest;
      }

      // Imprimir progreso cada 5 generaciones o en la última
      if (i % 5 === 0 || i === this.maxGenerations - 1) {
        this.printProgress(currentBest);
      }
    }

    this.printFinalResults();
  }

  private printSimulationHeader(): void {
    console.log('');
    console.log(
      `${colors.fg.yellow}${colors.bright}==== INICIANDO SIMULACIÓN =====${colors.reset}`
    );
    console.log(
      `${colors.fg.white}Número de ciudades: ${colors.bright}${this.n}${colors.reset}`
    );
    console.log(
      `${colors.fg.white}Tamaño de población: ${colors.bright}${this.populationSize}${colors.reset}`
    );
    console.log(
      `${colors.fg.white}Generaciones máximas: ${colors.bright}${this.maxGenerations}${colors.reset}`
    );
    console.log('');

    // Crear cabecera de tabla
    console.log(
      `${colors.fg.cyan}${colors.underscore}GENERACIÓN   MEJOR DISTANCIA   MEJORA (%)   ESTADO        ${colors.reset}`
    );
  }

  private printProgress(currentBest: number): void {
    const improvement =
      ((this.initialDistance - currentBest) / this.initialDistance) * 100;
    const isValid = this.isValidPath(this.paths[0]);

    let statusColor = isValid ? colors.fg.green : colors.fg.red;
    let statusText = isValid ? 'Válida' : 'Inválida';

    // Formato de tabla con espacios fijos
    console.log(
      `${colors.fg.white}${this.generation.toString().padStart(10)}   ` +
        `${colors.fg.yellow}${currentBest.toFixed(2).padStart(15)}   ` +
        `${colors.fg.cyan}${improvement.toFixed(2).padStart(10)}%   ` +
        `${statusColor}${statusText.padStart(12)}${colors.reset}`
    );
  }

  private printFinalResults(): void {
    const elapsedTime = (Date.now() - this.startTime) / 1000;
    const improvement =
      ((this.initialDistance - this.bestDistance) / this.initialDistance) * 100;

    console.log('');
    console.log(
      `${colors.fg.yellow}${colors.bright}==== RESULTADOS FINALES =====${colors.reset}`
    );
    console.log(
      `${colors.fg.white}Tiempo total: ${colors.bright}${elapsedTime.toFixed(
        2
      )} segundos${colors.reset}`
    );
    console.log(
      `${colors.fg.white}Distancia inicial: ${
        colors.bright
      }${this.initialDistance.toFixed(2)}${colors.reset}`
    );
    console.log(
      `${colors.fg.white}Mejor distancia encontrada: ${
        colors.bright
      }${this.bestDistance.toFixed(2)}${colors.reset}`
    );
    console.log(
      `${colors.fg.white}Mejora total: ${colors.bright}${improvement.toFixed(
        2
      )}%${colors.reset}`
    );
    console.log('');

    console.log(
      `${colors.fg.green}${colors.bright}Mejor ruta encontrada:${colors.reset}`
    );
    this.paths[0].printPath();
  }

  private generateNewValidPath(
    f1: Path,
    f2: Path,
    s1: Path,
    s2: Path,
    minCutPoint: number,
    maxCutPoint: number
  ): boolean {
    // Verificar que los puntos sean válidos
    if (
      minCutPoint >= f1.path.length - 1 ||
      maxCutPoint >= f1.path.length - 1
    ) {
      return false;
    }

    minCutPoint++;
    const f1Extract: City[] = [];
    const f2Extract: City[] = [];

    // Inicializar los nuevos caminos
    s1.path = [];
    s2.path = [];

    for (let i = 0; i < f1.path.length; i++) {
      s1.path.push(f1.getCityFromPath(i));
      s2.path.push(f2.getCityFromPath(i));
    }

    let j = 0;
    for (let i = minCutPoint; i < maxCutPoint; i++) {
      if (i >= f1.path.length || i >= f2.path.length) break;

      f1Extract[j] = f1.getCityFromPath(i);
      f2Extract[j] = f2.getCityFromPath(i);
      s1.path[i] = f2Extract[j];
      s2.path[i] = f1Extract[j];
      j++;
    }

    // Corregir ciudades duplicadas en s1
    for (let i = 0; i < f1Extract.length; i++) {
      for (let x = 0; x < f1.path.length; x++) {
        if (x >= s1.path.length) continue;

        if (
          f2Extract[i].getCityName() === s1.getCityFromPath(x).getCityName() &&
          (x < minCutPoint || x >= maxCutPoint)
        ) {
          for (let z = 0; z < f1.path.length; z++) {
            if (z >= s1.path.length) continue;

            let found = false;
            for (let y = 0; y < s1.path.length; y++) {
              if (
                f1.getCityFromPath(z).getCityName() ===
                s1.getCityFromPath(y).getCityName()
              ) {
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

    // Corregir ciudades duplicadas en s2
    for (let i = 0; i < f2Extract.length; i++) {
      for (let x = 0; x < f2.path.length; x++) {
        if (x >= s2.path.length) continue;

        if (
          f1Extract[i].getCityName() === s2.getCityFromPath(x).getCityName() &&
          (x < minCutPoint || x >= maxCutPoint)
        ) {
          for (let z = 0; z < f2.path.length; z++) {
            if (z >= s2.path.length) continue;

            let found = false;
            for (let y = 0; y < s2.path.length; y++) {
              if (
                f2.getCityFromPath(z).getCityName() ===
                s2.getCityFromPath(y).getCityName()
              ) {
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

    // Asegurar que la primera y última ciudad sean las mismas
    if (s1.path.length > 0) {
      s1.path[s1.path.length - 1] = s1.path[0];
    }

    if (s2.path.length > 0) {
      s2.path[s2.path.length - 1] = s2.path[0];
    }

    s1.calculateEuclideanDistance();
    s2.calculateEuclideanDistance();
    return true;
  }

  private generateNewCityBanning(): number {
    let maxAttempts = 100; // Prevenir bucle infinito

    while (maxAttempts > 0) {
      const testN = Math.floor(Math.random() * this.n);
      if (!this.bannedCities.includes(testN)) {
        this.bannedCities.push(testN);
        return testN;
      }
      maxAttempts--;
    }

    // Si no se encuentra ninguna ciudad no prohibida, devolver la primera disponible
    for (let i = 0; i < this.n; i++) {
      if (!this.bannedCities.includes(i)) {
        this.bannedCities.push(i);
        return i;
      }
    }

    // Si todas están prohibidas, reiniciar y devolver la primera
    this.bannedCities = [0];
    return 0;
  }

  private isValidPath(check: Path): boolean {
    if (check.path.length === 0) return false;

    // Crear un conjunto para almacenar las ciudades visitadas (sin contar la última que debe ser igual a la primera)
    const visitedCities = new Set<string>();

    // Verificar que no haya ciudades duplicadas (excepto la primera/última)
    for (let i = 0; i < check.path.length - 1; i++) {
      const cityName = check.getCityFromPath(i).getCityName();
      if (visitedCities.has(cityName)) {
        return false;
      }
      visitedCities.add(cityName);
    }

    // Verificar que la ruta comience y termine en la misma ciudad
    const firstCity = check.getCityFromPath(0).getCityName();
    const lastCity = check.getCityFromPath(check.path.length - 1).getCityName();
    return firstCity === lastCity;
  }
}
