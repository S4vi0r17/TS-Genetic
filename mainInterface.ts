import * as readline from 'readline';
import { GeneticsAlgorithm } from './GeneticsAlgorithm';

// Códigos ANSI para colores
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m',
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
    crimson: '\x1b[48m',
  },
};

const printTitle = (): void => {
  console.clear();
  console.log(
    `${colors.fg.cyan}${colors.bright}==============================================${colors.reset}`
  );
  console.log(
    `${colors.fg.yellow}${colors.bright}        ALGORITMO GENÉTICO PARA TSP${colors.reset}`
  );
  console.log(
    `${colors.fg.cyan}${colors.bright}==============================================${colors.reset}`
  );
  console.log('');
};

const printHelp = (): void => {
  console.log(`${colors.fg.green}INSTRUCCIONES:${colors.reset}`);
  console.log(
    `Ingresa las coordenadas de las ciudades con el siguiente formato:`
  );
  console.log(
    `${colors.fg.yellow}((x1,y1) (x2,y2) (x3,y3) ... (xn,yn))${colors.reset}`
  );
  console.log('');
  console.log(`${colors.fg.green}EJEMPLO:${colors.reset}`);
  console.log(
    `${colors.fg.cyan}((60,200) (180,200) (80,180) (140,180) (20,160))${colors.reset}`
  );
  console.log('');
  console.log(
    `${colors.fg.yellow}IMPORTANTE: Se recomienda utilizar entre 3 y 20 ciudades para obtener buenos resultados.${colors.reset}`
  );
  console.log('');
};

const parseStringToCoordinates = (input: string): boolean => {
  // Validar formato general
  if (
    !(
      input.length > 2 &&
      input.charAt(0) === '(' &&
      input.charAt(input.length - 1) === ')'
    )
  ) {
    console.log(
      `${colors.fg.red}Error: Formato incorrecto. Debe empezar y terminar con paréntesis.${colors.reset}`
    );
    return false;
  }

  // Extraer coordenadas
  const coordsString = input.substring(1, input.length - 1).trim();
  const coordsPattern = /\(\s*\d+\s*,\s*\d+\s*\)/g;
  const matches = coordsString.match(coordsPattern);

  if (!matches || matches.length < 3) {
    console.log(
      `${colors.fg.red}Error: Se necesitan al menos 3 coordenadas válidas.${colors.reset}`
    );
    return false;
  }

  if (matches.length > 80) {
    console.log(
      `${colors.fg.red}Error: Demasiadas coordenadas. El máximo es 80.${colors.reset}`
    );
    return false;
  }

  console.log(
    `${colors.fg.green}Procesando ${matches.length} ciudades...${colors.reset}`
  );

  // Crear instancia del algoritmo genético con el número de generaciones proporcional a las ciudades
  const numGenerations = Math.min(100, Math.max(20, matches.length * 4));
  const tsp = new GeneticsAlgorithm(numGenerations);

  // Procesar cada coordenada
  for (const coordStr of matches) {
    // Extraer números
    const numberPattern = /\((\d+),(\d+)\)/;
    const numberMatch = numberPattern.exec(coordStr);

    if (numberMatch && numberMatch.length === 3) {
      const x = parseInt(numberMatch[1], 10);
      const y = parseInt(numberMatch[2], 10);
      tsp.setNew({ x, y });
    } else {
      console.log(
        `${colors.fg.red}Error al procesar coordenada: ${coordStr}${colors.reset}`
      );
      return false;
    }
  }

  try {
    // Ejecutar algoritmo
    console.log(`${colors.fg.cyan}Creando rutas iniciales...${colors.reset}`);
    tsp.createPaths();

    console.log(
      `${colors.fg.cyan}Ejecutando simulación por ${numGenerations} generaciones...${colors.reset}`
    );
    console.log('');
    tsp.launchSimulation();

    console.log('');
    console.log(
      `${colors.fg.green}${colors.bright}¡Simulación completada con éxito!${colors.reset}`
    );
    return true;
  } catch (error) {
    console.log(
      `${colors.fg.red}Error durante la ejecución: ${error}${colors.reset}`
    );
    return false;
  }
};

const main = async (): Promise<void> => {
  printTitle();
  printHelp();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = `${colors.fg.yellow}Ingresa las coordenadas: ${colors.reset}`;

  rl.question(prompt, (userInput) => {
    const success = parseStringToCoordinates(userInput.trim());

    if (!success) {
      console.log('');
      console.log(
        `${colors.fg.yellow}Inténtalo de nuevo con el formato correcto.${colors.reset}`
      );
    }

    rl.close();
  });
};

// Ejecutar programa principal
main().catch((err) => {
  console.error(
    `${colors.fg.red}Error inesperado: ${err.message}${colors.reset}`
  );
  process.exit(1);
});
