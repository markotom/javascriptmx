## ¿Qué es Jasmine?

Jasmine es un framework de Desarrollo Dirigido por Comportamientos (*Behavior Driven Development*) para realizar pruebas unitarias (*Unit Testing*) de código JavaScript. Jasmine puede ser ejecutado en el navegador o sin él utilizando un *headless browser* como PhantomJS, CasperJS o ZombieJS para automatizar mejor las pruebas. También no requiere de un DOM, por lo que es posible hacer pruebas en cualquier Javascript Engine, como Rhino o V8 (Node.js).

En Jasmine encontraremos las siguientes características:

1. Sintáxis natural para poder probar comportamientos con BDD
2. Soporte para pruebas asincrónicas
3. Personalización de diferentes componentes como *reporters*, *equalities* y *matchers*
2. Mocking
3. Stubing
4. Spying

## ¿Por qué Jasmine?

BDD está relacionado con el comportamiento de nuestro desarrollo, a diferencia de TDD (*Testing Driven Development*) que sólo está centrado en probar su funcionamiento. Con BDD podemos describir de manera más precisa lo que nuestro desarrollo debe hacer, por eso es muy útil para tener claridad de cómo empezar a desarrollar y para saber qué es lo que debemos y no debemos hacer. Si deseas conocer más sobre BDD, puedes revisar la publicación [Introducing BDD](http://dannorth.net/introducing-bdd) de Dan North.

Cada día es más necesario hacer pruebas de nuestro código, para asegurar su estabilidad y hacerlo escalable. Actualmente existen muchas librerías y frameworks en diferentes lenguajes de programación que nos ayudan a lograrlo. Con Jasmine podemos hacer fácilmente nuestras pruebas, con una sintáxis idiomática inspirada en ScrewUnit, JSSpec, JSpec y RSpec (Ruby).

## Jasmine en el navegador

Para descargar Jasmine puedes clonar el repositorio o sólo descargar la [standalone version](https://github.com/pivotal/jasmine/tree/master/dist) más reciente desde Github:

```bash
$ wget https://github.com/pivotal/jasmine/raw/master/dist/jasmine-standalone-2.0.3.zip
$ unzip jasmine-standalone-2.0.3.zip
$ rm jasmine-standalone-2.0.3.zip
$ rm spec/* src/*
```
Después tendremos una estructura de archivos como la siguiente:

	.
    ├─ MIT.LICENSE
    ├─ SpecRunner.html
    ├─ lib
    │  └─ jasmine-2.x.x
    │     ├─ boot.js
    │     ├─ console.js
    │     ├─ jasmine-html.js
    │     ├─ jasmine.css
    │     ├─ jasmine.js
    │     └─ jasmine_favicon.png
    ├─ spec
    └─ src

Puedes no seguir la convención de estructura de archivos que Jasmine ofrece y adaptarlo fácilmente a cualquier tipo de proyecto. Lo único que debes saber es que necesitas un *runner* como **SpecRunner.html** que deberá cargar la librería `jasmine.js` y todo lo necesario dentro de `lib/jasmine-2.x.x`. Por defecto, **SpecRunner.html** nos cargará también el *reporter* predeterminado `jasmine-html.js` y el archivo de inicialización `boot.js` que será ejecutado antes de las pruebas unitarias y que puede personalizarse para modificar el funcionamiento de Jasmine o para añadir un *reporter* personalizado.

Dentro del *runner* necesitamos incluir los archivos de pruebas (especificaciones) y los archivos que serán probados (código en producción), ambos tipos de archivos pueden ubicarse dentro de `/spec` y `/src`, respectivamente.

## ¿Cómo funciona?

Las funciones principales de Jasmine para hacer pruebas son:

* `describe(a, b)` donde "a" es la descripción de nuestra *suite* y "b" la función anónima donde se incluirá toda la *suite* o serie de especificaciones.
* `it(a, b)` donde "a" es la descripción de la especificación y "b" la función anónima donde se incluirán las expectativas (expectations) que debe cumplir la aplicación.
* `expect(a)` donde "a" es un valor que será probado, mediante argumentos en cadena (*method chaining*). Por ejemplo: `expect(true).not.toBe(false)`.
* `beforeAll(a)` donde "a" será la función que se ejecutará antes de iniciar las pruebas.
* `afterAll(a)` donde "a" será la función que se ejecutará después de iniciar las pruebas.
* `beforeEach(a)` donde "a" será la función que se ejecutará antes de cada prueba.
* `afterEach(a)` donde "a" será la función que se ejecutará después de cada prueba.

## El "¡Hola mundo!" de Jasmine

Supongamos que quieres saber si tu aplicación saluda al mundo. Primero necesitas hacer la primera prueba para que tu aplicación no sepa de qué estás hablando. Crea el archivo `/spec/HolaMundoSpec.js` y añade lo siguiente:

```js
describe('Hola mundo', function () {
  it('debe saludar al mundo', function () {
    expect(saludar()).toEqual('¡Hola Mundo!');
  });
});
```

La prueba fallará porque no encontrará la función `saludar` y no podrá evaluarla. El siguiente paso es superar la prueba con las expectativas que se han generado, es decir, que la función `saludar` debe arrojar una cadena igual a "¡Hola Mundo!". Para pasar esta prueba, crea el archivo `/src/HolaMundo.js` y añade lo siguiente:

```js
var saludar = function () {
  return '¡Hola Mundo!';
};
```

¿Qué pasa si ahora queremos que nuestra aplicación salude en diferentes idiomas? Nosotros tendremos que modificar nuestra prueba y añadir más especificaciones.

```js
describe('Hola mundo', function () {
  it('debe saludar al mundo en español', function () {
    expect(saludar()).toEqual('¡Hola Mundo!');
  });

  it('debe saludar al mundo en inglés', function () {
    expect(saludar('inglés')).toEqual('Hello World!');
  });

  it('debe saludar al mundo en alemán', function () {
    expect(saludar('alemán')).toEqual('Hallo Welt!');
  });

  it('debe saludar al mundo en francés', function () {
    expect(saludar('francés')).toEqual('Bonjour Monde!');
  });
});
```

Nuestra prueba fallará en todas las especificaciones, excepto en idioma español. Ahora, para pasar la prueba, debemos modificar la función `saludar` con el fin de que nos arroje un saludo en diferentes idiomas dependiendo del argumento que pasemos.

```js
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
```

Finalmente, nuestras pruebas han pasado, pero ahora quisiéramos mejorarlas y crear un [custom matcher](http://jasmine.github.io/2.0/custom_matcher.html) para verificar un saludo, porque nos parece que `expect(a).toEqual(b)` no tiene la suficiente claridad que necesitamos.

```js
describe('Hola mundo', function () {

  beforeEach(function () {
    jasmine.addMatchers({
      toBeGreeting: function () {
        return {
          compare: function (saludo) {
            var resultado = {};
            resultado.pass = saludo.match(/hola|hello|hallo|bonjour/i);
            return resultado;
          }
        }
      }
    });
  });

  it('debe saludar al mundo en español', function () {
    expect(saludar()).toBeGreeting();
  });

  it('debe saludar al mundo en inglés', function () {
    expect(saludar('inglés')).toBeGreeting();
  });

  it('debe saludar al mundo en alemán', function () {
    expect(saludar('alemán')).toBeGreeting();
  });

  it('debe saludar al mundo en francés', function () {
    expect(saludar('francés')).toBeGreeting();
  });
});
```

Puedes ver este ejemplo en [Github](https://github.com/markotom/javascriptmx/tree/master/hacer-pruebas-de-bdd-tdd-con-jasmine/example).
