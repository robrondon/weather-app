import inquirer from 'inquirer';
import colors from 'colors';

const menu = async () => {
  const options = [
    {
      type: 'list',
      name: 'option',
      message: '¿Qué deseas hacer?',
      choices: [
        {
          value: 1,
          name: `${'1.'.cyan} Buscar ciudad`,
        },
        {
          value: 2,
          name: `${'2.'.cyan} Historial`,
        },
        {
          value: 0,
          name: `${'0.'.cyan} Salir`,
        },
      ],
    },
  ];

  console.clear();
  console.log('==========================='.cyan);
  console.log('   Seleccione una opción'.white);
  console.log('===========================\n'.cyan);
  const { option } = await inquirer.prompt(options);
  return option;
};

const pause = async () => {
  const option = [
    {
      type: 'input',
      name: 'enter',
      message: `Presione ${'ENTER'.cyan} para continuar`,
    },
  ];

  console.log('\n');
  await inquirer.prompt(option);
};

const readInput = async (message) => {
  const option = [
    {
      type: 'input',
      name: 'desc',
      message,
      validate(value) {
        if (value.length === 0) return 'Por favor ingrese un valor';
        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(option);
  return desc;
};

const listPlaces = async (places = []) => {
  const choices = places.map((place, i) => {
    const index = `${(i + 1 + '.').cyan}`;
    return {
      value: place.id,
      name: `${index} ${place.name}`,
    };
  });
  choices.push({
    value: '0',
    name: `${'0.'.cyan} Cancelar`,
  });

  const options = [
    {
      type: 'list',
      name: 'id',
      message: 'Seleccione un lugar:',
      choices,
    },
  ];
  const { id } = await inquirer.prompt(options);
  return id;
};

export { menu, pause, readInput, listPlaces };
