
Compilar LESS con Grunt.js
==========

En los últimos años los desarrolladores han estado más interesados en cómo desempeñan su trabajo que en lo que producen, en cómo agilizar procesos y mejorar su flujo de trabajo. Con esa pretensión surgió Grunt para automatizar tareas repetitivas que todo desarrollador realiza como compilación, minificación, concatenación, pruebas unitarias, verificación de sintaxis, etcétera.

Parecido al Make de C, el Ant de XML o el Rake de Ruby, Grunt es un automatizador de tareas o un *build tool* en JavaScript que puede ser usado para proyectos en cualquier tipo de lenguaje de programación. Actualmente cuenta con más 3000 que puedes usar en tus proyectos, aunque también te ofrece la posibilidad de crear tus propios plugins. Si bien Grunt ha sido uno de los *task runners* más populares y con mayor éxito, hace no mucho han surgido nuevos como Gulp que ha puesto de relieve una presunta rivalidad.

En este breve artículo vamos a mostrar un ejemplo del funcionamiento de Grunt compilando archivos del preprocesador LESS para generar archivos CSS y utilizando también [LiveReload](http://livereload.com). Con LiveReload vamos a poder modificar archivos LESS y visualizar los estilos casi instantaneamente en el navegador.

## Grunt

Para instalar Grunt en tu proyecto, el CLI de Grunt (línea de comandos), el plugin que compile LESS a CSS, así como el plugin que "escuchará" los archivos modificados para hacer livereload, necesitas ejecutar:

```bash
npm install -g grunt-cli
npm install grunt --save-dev
npm install grunt-contrib-less --save-dev
npm install grunt-contrib-watch --save-dev
```

El argumento `save-dev` es opcional y se encargará de guardar la dependencia en el `package.json` de tu proyecto. Es necesario señalar que los plugins que tienen nomenclatura del tipo `grunt-contrib-[algo]` son creados por el equipo de desarrolladores de Grunt, así que puedes tener la certeza de que son plugins muy bien soportados.

La estructura de las tareas en Grunt es muy simple. Necesitamos escribir un archivo llamado **Gruntfile.js** y exportar allí una función que será ejecutada por Grunt en la línea de comandos.

```js
module.exports = function (grunt) {};
```

Dentro de la función debemos añadir los plugins que utilizaremos, así como la configuración de tareas con un simple objeto pasado como argumento a la función `grunt.initConfig`.

```js
module.exports = function (grunt) {

  // Configuración de tareas
  grunt.initConfig({});

  // Plugins
  grunt.loadNpmTasks('NOMBRE-DEL-PLUGIN-1');
  grunt.loadNpmTasks('NOMBRE-DEL-PLUGIN-2');
  grunt.loadNpmTasks('NOMBRE-DEL-PLUGIN-3');

};
```

## Compilar LESS en modo desarrollo y modo producción

Necesitamos crear dos subtareas: `less:production` y `less:development`, para ello escribimos lo siguiente:

```js
module.exports = function (grunt) {

  grunt.initConfig({
    less: {
    development: {
        files: {
          'css/styles.css': 'less/styles.less'
        }
      },
      production: {
        options: {
          cleancss: true
        },
        files: {
          'css/styles.min.css': 'less/styles.less'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');

};
```

De esta manera cuando ejecutemos en la línea de comandos `grunt less:development` o `grunt less:production` (con *minification* declarada con `{ cleancss: true }`), Grunt nos ayudará a compilar los archivos LESS que definimos en el objeto. Pero, debido a que Grunt es un automatizador de tareas y pretende ayudarnos en nuestro proceso de desarrollo, podemos implantar el plugin `grunt-contrib-watch` que escuchará los archivos LESS modificados, los compilará automáticamente y realizará un *livereload* de nuestro navegador.

Al final tendremos nuestro código así:

```js
module.exports = function (grunt) {

  grunt.initConfig({
    less: {
    development: {
        files: {
          'css/styles.css': 'less/styles.less'
        }
      },
      production: {
        options: {
          cleancss: true
        },
        files: {
          'css/styles.min.css': 'less/styles.less'
        }
      }
    },
    watch: {
      less: {
        files: ['less/styles.less'],
        tasks: ['less:development'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

};
```

La tarea `watch:less` contiene la cadena de los archivos que escuchará para que, cuando se modifiquen, ejecute la tarea `less:development`. No necesitamos ejecutar `less:production` porque se supone que el LiveReload sólo lo utilizaremos cuando estemos desarrollando. En las opciones, es necesario definir *livereload* en true y *spawn* en false, éste último hará que el *livereload* sea más rápido. Finalmente, necesitamos vincular el CSS generado a un HTML y abrirlo en un navegador.

Si ejecutas ahora `grunt watch` o `grunt watch:less`, y modificas el archivo *styles.less* de prueba, automáticamente se compilará y el navegador será actualizado. Para que esto funcione correctamente en tu navegador, debes descargar las [extensiones LiveReload](https://github.com/livereload/livereload-extensions) de Chrome, Firefox, Opera o Safari.
