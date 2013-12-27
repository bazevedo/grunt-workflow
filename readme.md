# Workflow com Grunt
O objetivo desse repositório é mostrar, de uma maneira simples, um workflow para desenvolvimento e deploy de uma aplicação utilizando o [Grunt](http://gruntjs.com) como ferramenta.
Lembrando que esse repositório tem como objetivo o ensino e não é um projeto para ser utilizado em produção. Aproveite as dicas e faça o seu próprio Gruntfile :)

## Instalações básicas

- Ter o [nodeJS](http://nodejs.org) disponível no seu ambiente;
- Algum Terminal (para usuários OSX recomendo o [iTerm2](http://www.iterm2.com/));

### Instalando o Grunt
No terminal rodar o comando:

`npm install -g grunt-cli`

Dessa maneira, teremos o Grunt instalado de maneira global para usarmos em qualquer um dos nossos projetos.
Para mais informações, visite o [guia oficial](http://gruntjs.com/getting-started).

## Configurando um novo projeto
Vá ao seu diretório de projetos e crie uma nova pasta. Essa pasta receberá, primeiramente, os arquivos de configuração necessários para o Grunt rodar, que são o `package.json` e `Gruntfile.js`.

### Package.json
Nesse arquivo ficaram as configurações do seu projeto. A mais importante delas se refere as suas depêndencias, mas isso falaremos mais adiante. Para criarmos o arquivo, rodamos o comando `npm init` no terminal. Após o comando, digite as informações pedidas. Quando o arquivo for criado, teremos várias instruções nele, mas para o momento, podemos eliminar a maioria das configurações e deixa-lo como no exemplo abaixo:

```
{
  "name" : "example",
  "version" : "0.0.0",
  "description" : "an example package.json file"
}
```
Agora instalaremos o Grunt propriamente dito. Utilizaremos o comando:
`npm install grunt --save-dev`

Aqui é importante entender a instrução `--save-dev`. Sempre que instalarmos um plugin com ela, a chamada dele será inscrita no nosso package.json. Dessa maneira, o arquivo ficará assim:
```
{
  "name" : "example",
  "version" : "0.0.0",
  "description" : "an example package.json file",
  "devDependencies" : {
    "grunt" : "~0.4.2"
  }
}
```

A vantagem disso é que podemos utilizar o mesmo `package.json` em qualquer outro projeto, juntamente com as suas dependências. Ao criarmos um novo projeto, copiamos esse mesmo `package.json` e utilizamos o comando `npm install`. Dessa maneira, todos os nossos plugins serão instalados automaticamente, sem a necessidade de instalarmos "um por um".

Se isso ficou um pouco confuso, me assista fazendo esses comandos direto no [terminal](http://showterm.io/60af356580ad9f92a733a).

### Gruntfile.js
Todas as chamadas e comportamentos dos módulos vão ser editadas nesse arquivo.
Como estamos aprendendo a utilizar o Grunt, não faremos [scaffolding](http://gruntjs.com/project-scaffolding) de algum projeto, vamos fazer o arquivo na mão mesmo.
Primeiro, criamos o arquivo `Gruntfile.js` com o seguinte código:
```
module.exports = function(grunt) {

	'use strict';

	grunt.initConfig({

		examplePlugin : {
			firstTask : {
				options : {
					expanded : true
				}
			}
		}

	});

	grunt.loadNpmTasks('some-plugin');

	grunt.registerTask('default', [examplePlugin]);

};
```

**Explicando:**
- `grunt.initConfig({})` é onde as instruções para nossos plugins vão ficar. Ou seja, as configurações necessárias para o funcionamento de acordo com nossas necessidades.
- `grunt.loadNpmTasks('some-task')` essa chamada é a responsável pelo carregamento do plugin instalado. Mas aqui tem uma pegadinha, mesmo que não seja utilizado, o plugin é "carregado". Isso torna a execução das tarefas um pouco mais demoradas, especialmente quando temos plugins que demandam muito processamento como por exemplo o [imagemin](https://npmjs.org/package/grunt-contrib-imagemin). Para contornarmos esse problema, podemos fazer a chamada do plugin atrelado a uma tarefa específica. Exemplo:

```
grunt.registerTask('imagesMin', [], function () {

	grunt.loadNpmTasks('grunt-contrib-imagemin');

	grunt.task.run('imagemin');

});
```
Chamamos essa tarefa com o comando `grunt imagesMin`.

- `grunt.registerTask('default', [examplePlugin])` aqui ficaram as chamadas das nossas tarefas. Ela será definidada por um nome, aqui representado por ***'default'*** e quais tarefas serão executadas, representados através de um Array.

As chamadas do Grunt serão executadas utilizando o seguinte comando no terminal:
`grunt *nome da tarefa*`

####Chamando uma tarefa:
Vamos utilizar o código abaixo como base:

```
grunt.initConfig({
	sass : {
		dev : {
			files : {
				'dev/css/main.css': 'dev/sass/main-sass.scss'
			},
			options : {
				debugInfo : true,
				sourcemap : true
			}
		},
		prod : {
			files : {
				'dev/css/main.css': 'dev/sass/main-sass.scss'
			}
		}
	}
});
```

Podemos fazer as seguintes chamadas:
* `grunt sass` : Dessa maneira, todas as "funções" da tarefa serão chamadas. Primeiro a tarefa do objeto `dev` vai ocorrer depois, após seu término, `prod` vai ser processado.
* `grunt sass:prod` : Somente as orientações do objeto `prod` serão chamadas.

####Chamando mais de uma tarefa com o mesmo comando:
Exemplo:
```
grunt.initConfig({
	sass : {
		prod : {
			files : {
				'dev/css/main.css': 'dev/sass/main-sass.scss'
			}
		}
	},
	autoprefixer : {
		target : {
			src : 'dev/css/main.css'
		}
	}
});

grunt.registerTask('css', ['sass', 'autoprefixer']);
```
Utilizaremos a task `css` para rodar os dois plugins. Então a chamada é a seguinte:

 `grunt css`

 Dessa maneira, a tarefa `sass` ira rodar e no seu término, a tarefa `autoprefixer` acontecerá.

## Plugins
Aqui vou mostrar alguns dos puglins que utilizo para desenvolvimento e deploy.
Lembrando que o repositório de plugins fica no próprio [site](http://gruntjs.com/plugins) do Grunt. Tem muita coisa bacana por lá, não deixe de explorar :)

###SASS: https://npmjs.org/package/grunt-contrib-sass
Primeiro, instalaremos o nosso pré-processador de CSS. Nesse exemplo vou usar o [SASS](http://sass-lang.com/), mas nada impede você de usar o de sua preferência.
Comando para instalação:

`npm install grunt-contrib-sass --save-dev`

Para o nosso exemplo, o código de sua configuração fica assim:
```
sass : {
	dist : {
		files : {
			'dev/css/main.css': 'dev/sass/main-sass.scss'
		},
		options : {
			debugInfo : true,
			sourcemap : true
		}
	}
}
```
De destaque ficam as opções `debugInfo` e `sourcemap`. Utilizamos essas configurações para ativarmos o debug do SASS por meio do [fireSASS](https://addons.mozilla.org/en-US/firefox/addon/firesass-for-firebug/) e ativarmos [sourcemap](http://net.tutsplus.com/tutorials/html-css-techniques/developing-with-sass-and-chrome-devtools/) para os browsers que suportam essa tecnologia. Lembrando que o processamento fica mais lento utilizando essas opções.

Para quem não usa nenhuma opção de debug, a dica é experimentar o plugin [grunt-sass](https://npmjs.org/package/grunt-sass), que utiliza o próprio Node.js como compilador, deixando assim o processo muito mais rápido.

**Importante:** O SASS 3.3 **JÁ** deve estar instalado em seu ambiente para que essas opções funcionem.

Mais opções de configuração do plugin, estão disponíveis no seu [repositório oficial](https://npmjs.org/package/grunt-contrib-sass)

###Watch: https://npmjs.org/package/grunt-contrib-watch
Com esse plugin, conseguimos rodar tarefas quando arquivos selecionados forem modificados. Um exemplo clássico é utilizarmos o watch para processar o nosso SASS sem termos que ficar indo no terminal cada vez que salvamos o arquivo.

Comando para instalação:

`npm install grunt-contrib-watch --save-dev`

Configuração básica:
```
watch : {
	options	: {
		livereload : true
	},
	sassToCSS : {
		files : ['dev/sass/*.scss'],
		tasks : ['sass']
	}
}
```
Utilizando o watch, ainda conseguiremos habilitar o `livereload` para o nosso ambiente. Isso quer dizer que depois que o arquivo passar pela tarefa, o browser será recarregado automaticamente, assim, não precisamos ficar recarregando o browser a cada alteração de arquivo.

Para o liveReload funcionar, é necessário a instalação da [extensão](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-) para o seu browser preferido.

###JSHint: https://npmjs.org/package/grunt-contrib-jshint
Ferramenta de validação de arquivos JS com a ferramenta [JSHint](http://www.jshint.com/).

instalação:

`npm install grunt-contrib-watch --save-dev`

Configuração básica:
```
jshint : {
	options : {
		jshintrc : '.jshintrc',
		reporter : require('jshint-stylish')
	},
	files : {
		src : ['Gruntfile.js']
	}
}
```
Aqui vou destacar as duas opções:
* `jshintrc`: Indicaremos ao plugin onde colocamos o nosso arquivo '.jshintrc'. Esse arquivo é um JSON com todas as configurações que escolhemos para validar os nossos arquivos JS. As opções pode ser vistas na própria [documentação](http://www.jshint.com/docs/options/) do JSHint.
* `reporter`: Utilizaremos o plugin [jshint-stylish](https://github.com/sindresorhus/jshint-stylish) para deixarmos o relatório de erros do JSHint mais bonito e organizado.

###W3C html validation: https://npmjs.org/package/grunt-html-validation
Válida o nosso HTML de acordo com as [especificações do W3C](http://validator.w3.org).

Instalação:

`npm install grunt-html-validation --save-dev`

Configuração básica:
```
validation : {
	options : {
		reset : true,
		reportpath : false
	},
	files : {
		src : 'dev/index.html'
	}
}
```
* A opção `reset : true` é referente ao cache. Já tive problemas de cache com esse plugin, dessa maneira, vamos ignorar o cache e sempre passar nosso HTML pelo validador.
* Já `reportpath : false` não vai criar um arquivo de log referente aos problemas encontrados.

Para mais informações, visite o [repositório do plugin](https://npmjs.org/package/grunt-html-validation)

###Autoprefixer: https://npmjs.org/package/grunt-autoprefixer
Adiciona vendor-prefix ao CSS de acordo com o [caniuse](http://caniuse.com)

Instalação:

`npm install grunt-autoprefixer --save-dev`

Configuração básica:
```
autoprefixer : {
	target : {
		src : 'dev/css/main.css'
	}
}
```
Mais opções de configuração, visite a [página do plugin](https://npmjs.org/package/grunt-autoprefixer)

###Spritesmith: https://npmjs.org/package/grunt-spritesmith
Converte um grupo de imagens para sprite e gera seu respectivo CSS.

Instalação:

`npm install grunt-spritesmith --save-dev`

Configuração básica:
```
spritesmith : {
	all : {
		src : 'dev/img/sprites/*.png',
		destImg : 'dev/img/sprites.png',
		destCSS : 'dev/sass/sprites.scss',
		cssFormat : 'css'
	}
}
```

###ImageMin: https://npmjs.org/package/grunt-contrib-imagemin
Otimiza imagens em formato PNG, GIF e JPEG.

Instalação:

`npm install grunt-contrib-imagemin`

Configuração básica:

```
imagemin : {
	dist : {
		files : [{
			expand : true,
			cwd : 'dev/',
			src : ['img/*.{png,jpg,gif}'],
			dest : 'assets/'
		}]
	}
}
```

###SVGmin: https://npmjs.org/package/grunt-svgmin
Minifica e otimiza o SVG

Instalação:

`npm install grunt-svgmin --save-dev`

Configuração básica:

```
svgmin : {
	dist : {
		files : [{
			expand : true,
			cwd : 'dev/',
			src : ['img/*.svg'],
			dest : 'assets/'
		}]
	}
}
```

###Newer: https://npmjs.org/package/grunt-newer
Realiza a tarefa somente se o arquivo de origem for mais novo que o arquivo de destino.

Instalação:

`npm install grunt-newer --save-dev`

Configuração básica:

```
watch : {
	options	: {
		livereload : true
	},
	sassToCSS : {
		files : ['dev/sass/*.scss'],
		tasks : ['newer:sass']
	}
}
```
Pode ser usado na chamada da tarefa também:

```
grunt.registerTask('imger', ['newer:imagemin']);
```
Nesse exemplo, a tarefa de otimizar as imagens só vai acontecer quando a imagem for nova ou for uma versão atualizada do arquivo já otimizado.

###￼Uglify: https://npmjs.org/package/grunt-contrib-uglify
Minifica e concatena os arquivos js utilizando o [UglifyJS](https://github.com/mishoo/UglifyJS).

Instalação:

`npm install grunt-contrib-uglify`

Configuração básica:

```
uglify : {
	options : {
		banner : '/* Want to see the source? Go to /dev instead :) */'
	},
	build : {
		src : 'dev/js/main.js',
		dest : 'assets/js/main.js'
	}
}
```
Temos também a opção de concatenar os arquivos JS. Você pode saber mais na [página do plugin](https://npmjs.org/package/grunt-contrib-uglify).

###CSSMIN: https://npmjs.org/package/grunt-contrib-cssmin
minifica e concatena os arquivos CSS

Instalação:

`npm install grunt-contrib-cssmin --save-dev`

Configuração básica:

```
cssmin : {
	build : {
		files : {
			'assets/css/main.css' : ['dev/css/main.css']
		}
	}
}
```

###Clean: https://npmjs.org/package/grunt-contrib-clean
Limpa (deleta) pastas e arquivos.

Instalação:

`npm install grunt-contrib-clean --save-dev`

Configuração básica:

```
clean : ['assets/']
```

###Replace: https://npmjs.org/package/grunt-replace
Troca texto de acordo com strings e expressões regulares.

Instalação:

`npm install grunt-replace --save-dev`

Configuração:

```
replace : {
	css : {
		options : {
			patterns : [{
				match : /main.css/,
				replacement : 'main.' + Math.ceil(Math.random() * 50000) + '.css',
				expression : true
			}]
		},
		files : [{
			src : ['dev/index.html'],
			dest : 'assets/index.html'
		}],
	}
}
```

Explicando essa chamada: Utilizando as direitivas do [.htaccess](https://github.com/h5bp/html5-boilerplate/blob/master/.htaccess#L597) do [HTML5 Boilerplate](http://html5boilerplate.com/), colocaremos um número randômico no meio da nossa chamada de CSS. A tarefa `replace` inspecionará o nosso `index.html` de desenvolvimento para alterar a chamada dos nossos insumos. Após isso, um novo arquivo `index.html` será criado dentro da nossa pasta `assets` onde estará pronto para ser publicado em produção. Isso quer dizer que podemos deixar nossos insumos com um cache bem alto, e não temos que nos preocupar com a invalidação do mesmo. Para mais informações sobre cache busting, leia o [post do Steve Souders](http://www.stevesouders.com/blog/2008/08/23/revving-filenames-dont-use-querystring).

Temos diversas maneiras de atacar esse problema, uma outra maneira é utilizando o plugin [grunt-use-min](https://github.com/yeoman/grunt-usemin) junto com o [grunt-rev](https://npmjs.org/package/grunt-rev). Sugiro vocês pesquisarem por uma solução especifica para o ambiente de vocês.

###Notify: https://npmjs.org/package/grunt-notify
Notifica automaticamente se alguma tarefa lançou erros ou avisos. Também notifica quando tarefas especificas do projeto forem completadas.

Instalação:

`npm install grunt-notify --save-dev`

Configuração:

```
notify: {
	deploy: {
		options : {
			title : 'Deploy completed!',
			message : 'Congratulations, your app is up :)'
		}
	}
}
```
Esse plugin pode receber diversos tipos de configuração. Na sua [página](https://npmjs.org/package/grunt-notify) temos várias amostras dessas configurações.

###rsync: https://npmjs.org/package/grunt-rsync
Publica arquivos utilizando [rsync](http://rsync.samba.org/) como protocolo. Por favor, não utilize mais FTP, vá de rsync, as vantagens são inúmeras :)

Instalação:

`npm install grunt-rsync --save-dev`

Configuração básica:

```
rsync : {
    options : {
        exclude : ['.git*','node_modules'],
        recursive : true
    },
	home : {
		options : {
			src : 'assets/',
			dest : 'www/yourProject',
			host : 'user@host',
			recursive : true,
			syncDest : true
		}
	}
}
```

##Tarefas
Aqui vou deixar algumas tarefas já prontas, mas não deixe de fazer as suas, de acordo com a necessidade do projeto.

###Default:
Na nossa tarefa default, utilizei o `watch` para automatizar a compilação do SASS, validar os arquivos .js e verificar o HTML. Além é claro, de deixar o live reload habilitado.

Chamada:

`grunt`

Simples assim :)

###Deploy:
Uma tarefa de deploy completo da sua aplicação.
* Válida o código com `JSHint`
* Limpa a pasta de produção, que no nosso exemplo chamamos de `assets`
* Compila o `SASS` sem os helpers
* Passa o `autoprefixer` no arquivo CSS gerado
* Minifica o CSS
* Minifica o JS
* Otimiza as imagens e os SVG
* Utilizamos o `replace` para gerarmos um novo HTML, na pasta de produção
* Publicamos tudo isso para produção utilizando `rsync`

Chamada:

`grunt deploy`

Com um comando simples, conseguimos fazer diversas tarefas que antes levavam um tempo considerável, em apenas alguns segundos.

##Finalizando
O que foi mostrado aqui, não é quase nada perto do poder que uma ferramenta como o Grunt tem para nos oferecer. Agora é com vocês, aprendam a usar e se divirtam deixando seu desenvolvimento muito mais fácil :)

Mas novamente, o motivo desse repósitorio não é fazer a solução definitiva. A idéia aqui é ser um lugar para aprendizado. Não coloque esses arquivos diretamente em produção, faça o seu próprio build de acordo com suas necessidades. E não esqueça de olhar o arquivo `Gruntfile.js` para entender um pouco melhor como as coisas funcionam.

Se alguém tiver algo a contribuir, ou corrigir, é só avisar!

Você também pode entrar em contato pelo meu Twitter [@bazevedo](https://twitter.com/bazevedo).