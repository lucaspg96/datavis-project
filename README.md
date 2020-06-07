# Real-Time-Tweets

Para executar o projet, é necessário definir 4 variáveis de ambiente com as chaves de acesso da API do Twitter:
* consumerKey
* consumerSecret
* accessToken
* accessTokenSecret

Uma vez que as variáveis esteja definidas, basta executar a classe `Server.scala`. Ela iniciará o servidor na porta `9000`, servindo tanto a API quanto o WebApp. 

## Modificando o WebApp
O código fonte do WebApp encontra-se na pasta `webapp-source`.  Para rodar em dev, abra o arquivo `src/websocket.js` e mude a variável `websocketURL` para  `ws://localhost:9000` e execute a aplicação React