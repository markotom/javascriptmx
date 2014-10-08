# ¿Qué es una visualización de datos?

Una visualización de datos es la presentación de datos en un formato gráfico. El interés y, sobre todo, la utilidad  en las visualizaciones de datos parece incrementarse conforme a la cantidad de datos que se producen diariamente en la web que ahora podemos llamar [Big data](http://es.wikipedia.org/wiki/Big_data). Nos permiten comprender y transmitir mejor la información; así podemos persuadir, identificar patrones, comprender relaciones y producir nuevos significados con mayor ventaja que en una presentación rígida, aburrida y tediosa como una hoja de cálculo.

Las visualizaciones de datos ya no es un tema que sólo interese a los computólogos, científicos o humanistas. Podemos utilizarlas en nuestros proyectos y tenemos muchas librerías para hacerlas. Puedes revisar algunas herramientas para hacer [visualizaciones de datos](https://github.com/showcases/data-visualization) en Github.

# ¿Qué es [D3.js](http://d3js.org)?

D3.js (*Data-Driven Documents*) es una de las librerías de JavaScript más populares que nos permite hacer visualizaciones de datos y añadirlas en un navegador utilizando HTML, SVG y CSS. Podemos combinarla con librerías como Backbone.js, Angular.js, Ember.js, etcétera. D3.js depende de la API de DOM de un navegador, aunque también puede ejecutarse desde Node.js utilizando librerías como JSDOM.

D3.js te ofrece todo lo necesario para trabajar con arreglos, crear elementos SVG (formas, líneas, axes), crear escalas, animaciones, transiciones, entre otras cosas. Aunque puedes crear tus propias visualizaciones, D3.js incluye *layouts* para crear visualizaciones predeterminadas del tipo Bundle, Chord, Force, Pack, Stack, Tree, etcétera.

# ¿Cómo instalarlo?

Puedes descargar D3.js desde diferentes *package managers* como NPM, Bower, Component, JSPM, entre otros. También puedes acceder al [repositorio](https://github.com/mbostock/d3/releases) o directamente añadir el enlace del sitio web oficial de la versión más reciente:

```html
<script src="http://d3js.org/d3.v3.min.js"></script>
```

# Introducción a D3.js

Primero necesitamos obtener datos de alguna manera. Normalmente esos datos los encontramos en formato JSON; aunque D3.js nos permite trabajar con XML y CSV. No necesitamos jQuery para lograr esto. Podemos usar funciones para extraer información asincrónicamente con `d3.json`, `d3.csv` o `d3.xml`.

```js
d3.json('file.json', function (data) {});
d3.csv('file.csv', function (data) {});
d3.xml('file.xml', 'application/xml', function (data) {});
```

Vamos a crear un ejemplo sencillo de visualización. Supongamos que queremos presentar los repositorios de JavaScript más destacados de Github. Para empezar crearemos una función que pasaremos como *callback* una vez extraídos los datos. Siguiendo el *method chaining* o estilo de programación en "cascada", tendremos algo como esto:

```js
var chart = function (data) {
  d3.select('body')
    .append('ul')
    .selectAll('li')
    .data(data.items)
    .enter()
    .append('li')
      .text(function (item) {
        return item.name;
      });
};

d3.json('https://api.github.com/search/repositories?q=language:javascript&sort=stars&per_page=100', chart);
```

Lo anterior creará sólo una lista desordenada con el nombre de cada repositorio. Primero, con `d3.select('body')` seleccionamos el elemento `<body>`en donde añadiremos nuevos elementos como `<ul>`. Después, "seleccionamos" todos los elementos de la lista con`selectAll('li')`, aunque ciertamente aún no existe ninguno. Lo anterior creará una selección vacía (un arreglo sin elementos) en donde se añadirán posteriormente elementos vacíos con `data(data.items)`. Con la función `enter()` tendremos una selección completa de los elementos, pero que aún no tienen un elemento en el DOM existente, para que con `append('li')` podamos integrarlos. Finalmente, con la función `text(a)`, donde "a" es la función que se itera en cada elemento, añadiremos texto con la información correspondiente.

Para modificar el diseño debemos añadir el atributo `class` a cada elemento:

```js
d3.select('body')
  .append('div')
    .attr('class', 'chart')
  .selectAll('div')
  .data(data.items)
  .enter()
  .append('div')
    .attr('class', 'bar')
    .text(function (item) {
      return item.name;
    });
```

```css
.chart {
  font-family: Helvetica, sans-serif;
}

.bar {
  margin-bottom: 1px;
  height: 2em;
  background-color: gray;
  color: white;
  line-height: 2em;
}
```

Ahora queremos que el ancho corresponda al número de estrellas que tiene un repositorio. Para ello es necesario añadir un nuevo estilo que dependa de los datos de cada elemento. Además debemos crear una escala lineal con dominio y rango para poderlo representar en un ancho coherente a la pantalla. Supongamos que el repositorio más popular tiene 35450 estrellas, pero no queremos que el ancho sea 35450px, sino que 35450 corresponda al 100% y todos los demás elementos tengan un porcentaje en función del máximo. Para saber cuál es el elemento máximo de un arreglo utilizamos `d3.max(a, b)`, donde "a" es el arreglo y "b" un elemento opcional que corresponde a un `d3.map(array)`, el cual es muy útil cuando queremos extraer el máximo según un elemento con mayor profundidad en el arreglo.

```js
var maxStars = d3.max(data.items, function (item) {
  return item.stargazers_count;
});
```

Para crear la escala lineal con dominio y rango utilizaremos `d3.scale.linear()`, `domain(a, b)` y `range(a, b)`, donde "a" y "b" de `range` son proporcionales a "a" y "b" de `domain`.

```js
var width = d3.scale.linear()
              .domain([0, maxStars])
              .range([0, 100]);
```

Finalmente necesitamos añadir el estilo `width` a cada elemento y con la escala que acabamos de crear.

```js
d3.select('body')
  .append('div')
    .attr('class', 'chart')
  .selectAll('div')
  .data(data.items)
  .enter()
  .append('div')
    .attr('class', 'bar')
    .style('width', function (item) {
      return width(item.stargazers_count) + '%';
    })
    .text(function (item) {
      return item.name;
    });
```

Supongamos que ahora quisiéramos mostrar el número de "forks" y representarlo con los colores de fondo de las barras: rojo para el repositorio con más "forks" y azul para el que menos tiene. Tendremos algo como lo siguiente:

```js
var maxForks = d3.max(data.items, function (item) {
  return item.forks;
});

var background = d3.scale.linear()
                   .domain([0, maxForks])
                   .range(["#1f77b4", "#d62728"]);

d3.select('body')
  .append('div')
    .attr('class', 'chart')
  .selectAll('div')
  .data(data.items)
  .enter()
  .append('div')
    .attr('class', 'bar')
    .style('width', function (item) {
      return width(item.stargazers_count) + '%';
    })
    .style('background-color', function (item) {
      return background(item.forks);
    })
    .text(function (item) {
      return item.name;
    });
```
Así se vería el ejemplo final:

![Ejemplo final](https://raw.githubusercontent.com/markotom/javascriptmx/master/introduccion-d3js/example.png)


¿Por qué Angular.js tiene muchos más "forks" que los demás?

Puedes ver este ejemplo en [Github](https://github.com/markotom/javascriptmx/tree/master/introduccion-d3js/example). Si quieres saber más de lo que puedes hacer con D3.js, visita esta [galería](https://github.com/mbostock/d3/wiki/Gallery) donde encontrarás ejemplos increíbles.
