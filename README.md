## Tweets Monitor

Este repositório contém o trabalho da disciplina de Visualização Científica, ofertada para a pós graduação em Ciência da Computação na Universidade Federal do Ceará. Ele foi desenvolvido por [lucaspg96](https://github.com/lucaspg96) e [felipemarcel](https://github.com/felipemarcel).

O objetivo deste trabalho é analisar, em tempo real, a quantidade de tweets sobre um certo assunto. Devido à limitações da API do Twitter, apenas dois assuntos podem ser monitorados por vez, além de a quantidade de tweets ser bem reduzida em relação ao real.

O trabalho conta com duas implementações principais:
* Back-End, feito em Scala, que consome os tweets, utilizando o Twitter4J, e disponibiliza um websocket para consumir em tempo real (Akka HTTP + Akka Stream). Os tweets são também armazenados no MongoDB para permitir uma análise histórica posteriormente;
* Front-End, feito (principalmente) com React, D#, Dc.js, Crossfilter.js, AntV e Ant Desing. A aplicação conta com duas telas: uma para analisar os tweets em tempo real, permitindo ver a contagem dos tweets, e uma para analisar os tweets consumidos, permitindo análises um pouco mais complexas.
### Executando a aplicação
Para visualizar a página estática, existe uma versão disponível neste repositório pelo [GitHub pages](https://lucaspg96.github.io/datavis-project/). Entretanto, a análise em tempo real só pode utilizada com a execução do back-end. 

Para executá-lo, é necessário a criação de uma aplicação no [Twitter Developer](https://developer.twitter.com/en/apps), onde serão obtidas as credenciais para executar a aplicação. As credenciais deverão estar disponíveis em 4 variáveis de ambiente:
* consumerKey
* consumerSecret
* accessToken
* accessTokenSecret

**OBS**: caso queira, pode modificar o arquivo `src/main/resources/application.conf` e colocar suas credenciais lá.

Para rodar, é necessário ter o [sbt](https://www.scala-sbt.org/) instalado.  Além disso, é necessário tem um MongoDB executando. Neste repositório, temos o arquivo `mongo-docker-compose.yml` que permite (utilizando o docker-compose) instanciar um MongoDB na máquina. Para isso, basta executar `docker-compose -f mongo-docker-compose.yml up -d`.

Tendo as variáveis de ambiente configuradas (ou adicionando elas no arquivo de configuração) e o MongoDB rodando, basta executar `sbt run`.

Uma vez que o servidor esteja rodando, basta acessar `http://localhost:9000/webapp`

### Modificando o WebApp
O código fonte do WebApp encontra-se na pasta `webapp-source`.  
Para rodar em dev, execute a aplicação React.