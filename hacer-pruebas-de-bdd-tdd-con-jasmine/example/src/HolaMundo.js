var saludar = function (lenguaje) {
  var saludo = '¡Hola Mundo!';

  switch (lenguaje) {
    case 'inglés':
      saludo = 'Hello World!';
      break;
    case 'alemán':
      saludo = 'Hallo Welt!';
      break;
    case 'francés':
      saludo = 'Bonjour Monde!';
      break;
  };

  return saludo;
};