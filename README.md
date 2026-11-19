# snake.exe 1.2
Primeiro projeto autoral de portfólio, desenvolvido para aprender e praticar os fundamentos da programação web.

**Jogue agora:** [Acessar o jogo](https://claramirandavie.github.io/snake.exe-1.2/)

## Funcionalidades
- **Modo Classic:** três níveis de dificuldade (Easy, Normal e Hard), cada um com velocidades diferentes.
- **Sistema de pausa:** menu com as opções Resume, Restart e Main Menu. A partida fica completamente congelada durante a pausa.
- **Recordes locais:** pontuações mais altas salvas separadamente por dificuldade.
- **Ranking online:** Top 10 por dificuldade, utilizando banco de dados na nuvem.
- **Skins:** quatro aparências para a cobrinha: Default (ciano), Pink, Lime e White.
- **Áudio:** efeitos sonoros e música gerados por código através da Web Audio API.
- **Configurações:** controle individual de volume geral, efeitos sonoros e música.
- **Estatísticas:** partidas realizadas e concluídas, maior pontuação, total de comidas coletadas, maior comprimento e melhores resultados.
- **Persistência de dados:** nome do jogador, recordes, skin selecionada, configurações e estatísticas salvos automaticamente no navegador através do LocalStorage.

## Como jogar
| Tecla | Ação |
|---|---|
| ← ↑ → ↓ | Movimentar a cobrinha |
| `Esc` ou `P` | Pausar / continuar |

### Regras
- A cobrinha começa com três segmentos.
- Cada comida coletada vale **10 pontos** e aumenta o comprimento da cobrinha.
- Colidir com as paredes ou com o próprio corpo encerra a partida.
- Não é possível inverter a direção diretamente.
- É permitido mover-se para a posição que a cauda está deixando, pois ela sai daquele espaço no mesmo passo.

## Tecnologias utilizadas
- **HTML5:** estrutura das telas.
- **CSS3:** identidade visual, variáveis CSS e animações.
- **JavaScript (ES Modules):** lógica do jogo, organizada em módulos.
- **Canvas API:** renderização da cobrinha e dos alimentos.
- **Web Audio API:** geração de efeitos sonoros e música.
- **LocalStorage:** armazenamento de dados no navegador.
- **Supabase (PostgreSQL):** banco de dados utilizado no ranking online, integrado através de requisições `fetch`.

## Estrutura do projeto
```
snake-game/
├── index.html
├── README.md
├── supabase-setup.sql
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── menu.js
│   ├── game.js
│   ├── snake.js
│   ├── food.js
│   ├── audio.js
│   ├── settings.js
│   ├── skins.js
│   ├── statistics.js
│   ├── player.js
│   ├── ranking.js
│   ├── config.js
│   └── storage.js
└── assets/
    ├── images/
    └── sounds/
```
O projeto utiliza uma arquitetura modular, na qual cada arquivo possui uma responsabilidade específica. Os módulos se comunicam através de `import` e `export`, facilitando a organização e a manutenção do código.

## Como executar localmente
O projeto utiliza **JavaScript ES Modules**, que não funcionam corretamente quando o arquivo `index.html` é aberto diretamente pelo navegador.
Para executar o projeto localmente:
1. Instale o [Visual Studio Code](https://code.visualstudio.com/).
2. Instale a extensão **Live Server**.
3. Abra a pasta do projeto no VS Code.
4. Clique com o botão direito no arquivo `index.html`.
5. Selecione **Open with Live Server**.

O jogo será aberto automaticamente no navegador.

## Configurando o ranking online (opcional)
O jogo funciona normalmente mesmo sem a configuração do Supabase. Nesse caso, apenas o ranking online ficará indisponível.
Para habilitá-lo:
1. Crie uma conta e um projeto no [Supabase](https://supabase.com/).
2. Acesse o **SQL Editor** e execute o conteúdo do arquivo `supabase-setup.sql`.
3. Em **Connect** ou **Project Settings → API Keys**, copie a Project URL e a chave pública publishable (`sb_publishable_...`).
4. Insira os dois valores no arquivo `js/config.js`.

### Segurança do ranking
O ranking utiliza **Row Level Security (RLS)** para controlar o acesso ao banco de dados.
- O público pode consultar e inserir pontuações.
- Não é permitido editar ou excluir pontuações existentes.
- O banco valida os dados enviados, incluindo nome de 1 a 12 caracteres, dificuldade válida e pontuação entre 0 e 3970, em múltiplos de 10.

## O que aprendi desenvolvendo este projeto
Durante o desenvolvimento, pratiquei e aprofundei conhecimentos em:
- Organização de código utilizando módulos JavaScript (`import` e `export`).
- Desenvolvimento de loops de jogo com `requestAnimationFrame`.
- Controle de tempo e velocidade de execução.
- Implementação de filas de comandos para controlar a movimentação.
- Renderização gráfica utilizando a Canvas API.
- Manipulação de eventos e *event delegation*.
- Armazenamento e persistência de dados com LocalStorage.
- Geração de áudio utilizando a Web Audio API.
- Integração com banco de dados relacional PostgreSQL.
- Comunicação com serviços externos através de requisições HTTP.
- Segurança básica no desenvolvimento web, incluindo prevenção de XSS com `textContent` e proteção de credenciais.

## Limitações conhecidas
- **Ranking:** embora o banco valide os dados recebidos, como a lógica do jogo é executada no navegador, ainda é possível manipular pontuações dentro dos limites permitidos. Uma validação completamente confiável exigiria executar a lógica do jogo em um servidor.
- **Nomes repetidos:** quando duas pessoas utilizam o mesmo nome, o ranking considera apenas a melhor pontuação.
- **Dispositivos:** o jogo foi desenvolvido pensando principalmente em computadores, com controles por teclado.

## Próximas atualizações
- [ ] **Zen Mode:** modo com velocidade constante e reduzida, sem pressão.
- [ ] **Challenge Mode:** fases com obstáculos e objetivos específicos.
- [ ] Música de fundo utilizando arquivos de áudio.
- [ ] Controles por toque para dispositivos móveis.
