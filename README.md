## projeto-integrador-grupo01

# Conecta Cidadão

## Integrantes:
- Carlos Gustavo Guerra Carvalho
- Gabriel Alves dos Santos
- Guilherme Matheus da Silva
- Josias Eliel Sarquiz
- Luan de Melo Gonçalves

## Proposta

O Conecta Cidadão é uma solução tecnológica criada para melhorar a comunicação entre a população e os serviços públicos, especialmente em situações de crise.
Nossa proposta é centralizar alertas e pedidos de ajuda em uma plataforma integrada, garantindo que informações críticas (como enchentes ou interdições) cheguem instantaneamente e de forma clara aos cidadãos e gestores. A missão é transformar a tecnologia em uma ferramenta de empoderamento cívico.

### Necessidade
Atualmente, a comunicação entre o cidadão e os serviços públicos é caracterizada por ser ineficiente, fragmentada e reativa. Os principais problemas identificados são:
* **Resposta ineficiente a emergências:** Falta de clareza sobre localização, situação real e prioridade das demandas.
* **Escassez de dados em tempo real:** Tanto a população quanto os serviços carecem de informações atualizadas sobre ocorrências em andamento.
* **Canais complicados:** Existe uma falta de agilidade na comunicação ou clareza sobre qual serviço específico deve ser acionado.
* **Falta de integração:** Baixa participação cívica e aumento da sensação de insegurança devido à percepção de uma resposta pública ineficaz.

### Público-Alvo
O projeto **Conecta Cidadão** foca nos seguintes perfis:
* **População em geral:** Indivíduos que utilizam smartphones e buscam um canal direto e eficiente para se comunicar com órgãos públicos.
* **Serviços Públicos:** Prefeituras, Polícias, Bombeiros, Defesa Civil e serviços de infraestrutura que buscam otimizar operações com dados precisos.
* **Foco Geográfico:** Cidades de pequeno e médio porte, que permitem uma implantação mais ágil e controlada da solução.

### Objetivo da Landing Page
O objetivo central da página de entrada do projeto é **Apresentar Soluções e Captar Leads**, estruturado em:
* **Divulgação de Soluções:** Demonstrar como a plataforma centraliza denúncias e pedidos de ajuda em um canal rápido, além de facilitar o recebimento de alertas oficiais (como enchentes ou interdições) em tempo real.
* **Conversão de Parceiros:** Atrair o interesse de gestores municipais e órgãos de segurança para contratos de licenciamento do sistema.
* **Engajamento Comunitário:** Informar como a ferramenta fortalece a cidadania e a confiança entre a comunidade e o setor público.

## API Escolhida
Utilizaremos a **OpenWeatherMap** API para monitoramento ambiental

**Pontos de acesso (endpoints)**:
 - Current Weather Data: Fornece a situação climática atual (temperatura, umidade, pressão). Call: `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}`
 - Hourly forecast: Previsão do tempo a cada hora para os próximos 4 dias (96 timestamps). Call `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat={lat}&lon={lon}&appid={API key}`
 - Geocoding API: Converte endereços digitados em coordenadas geográficas que possam ser utilizadas pela aplicação. Call: `http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}`

**Informação Consumida**: Serão extraídos dados climáticos em tempo real, como temperatura, umidade, velocidade do vento e previsão do tempo. Também será utilizada a Geocoding API para geolocalização de acordo com os endereços fornecidos.

**Exibição dos Dados**: 
- No Aplicativo do Cidadão: Os dados climáticos serão exibidos em um card de "Situação climática".
- No Painel Web dos serviços: As informações aparecerão sobre um mapa e em um dashboard, permitindo a correlação entre o clima e o volume de ocorrências abertas.

A integração de dados climáticos via API é útil para o Conecta Cidadão uma vez que traz informações em tempo real que podem ser correlacionadas com as emergências e gestão dos serviços cumprindo a missão de organizar o serviço através da comunicação ágil. Inspirada no sistema GAIA, de Rolante/RS e AlertaBlu de Blumenau/SC, essa tecnologia possibilita que a população e os serviços de emergência antecipem riscos e planejem ações, otimizando a alocação de recursos e garantindo que os comunicados oficiais cheguem diretamente ao cidadão.

## Planejamento do projeto
* **Criação e Organização do Github:** Feito por Gabriel Alves dos Santos
* **Proposta:** Feito por Carlos Gustavo Guerra Carvalho

O projeto possui um ciclo total de 12 meses:

- Mês 1: Planejamento e prototipagem no Figma.

- Meses 2–6: Desenvolvimento do MVP utilizando HTML, CSS e JavaScript.

- Meses 7–9: Testes piloto e ajustes de usabilidade com parceiros.

- Meses 10–12: Lançamento da versão estável e expansão de mercado.


## Estrutura prevista da landing page

A página será organizada nas seguintes seções para garantir clareza e conversão:

 - **Chamada inicial (Hero Section)**: Chamada principal focada na proposta de valor e botões de Download/Acesso. Objetivo e botão de ação

 - **Problema**: Infográfico demonstrando a ineficiência dos canais de comunicação atuais. Diagnóstico, impacto e consequência. Preparação para a sulução na próxima seção.

 - **Funcionalidades (Cidadão)**: Cards apresentando o canal de entrada de informações o recebimento de alertas via celular.

 - **Funcionalidades (Gestor)**: Demonstração do dashboard e mapa para administração dos serviços.

 - **Prova Social/Viabilidade**: Análise de viabilidade e dados estatísticos que validam o projeto. Estatísticas e demanda.

 - **Chamada para Ação (Call to Action)**: Seção final para download das versões e pedido de parcerias. Links para download/acesso e contato.
 
**Tecnologias e recursos a serem utilizadas**:
 
Design e Planejamento:

 - **Figma**: Para prototipação e desenvolvimento de UI e testesde UX.
 - **GitHub**: Para colaboração e versionamento.

Desenvolvimento FrontEnd:

 - **HTML**: Para estruturar as páginas.
 - **CSS**: Para estilizar as páginas.
 - **JavaScript**: Para programar a interatividade e consumo de dados.

Integrações e Serviços Externos:

 - **OpenWeatherMap API**: Fonte principal de dados para monitoramento climático e geocodificação de endereços.
 - **Firebase Cloud Messaging**: Para envio de notificações push aos usuários.

## Planejamento Técnico da Página 

- A landing será desenvolvida como página responsiva, com foco em clareza de informação, apresentação da proposta da solução e captação de interesse de cidadãos e gestores públicos. 

- **Cabeçalho (header):** Apresentará o nome do projeto, menu de navegação e botão de chamada para ação. Essa seção terá como objetivo facilitar o acesso rápido às áreas principais da página.

- **Seção principal (Hero Section):** Será a área de destaque inicial da landing page, contendo o slogan do projeto, uma breve apresentação da proposta de valor e botões de ação, como “Saiba mais” e “Solicitar demonstração”. Também poderá conter uma imagem ilustrativa ou mockup da plataforma.

- **Seção do Problema:** Explicará as dificuldades atuais na comunicação entre cidadãos e serviços públicos, destacando pontos como demora no atendimento, falta de integração e ausência de dados em tempo real. O objetivo será contextualizar a necessidade da solução.

- **Seção da Solução:** Apresentará o Conecta Cidadão como resposta para esses problemas, explicando como a plataforma centraliza alertas, pedidos de ajuda e informações em tempo real.

- **Seção de Funcionalidades:** Será dividida em dois blocos:
  - **Funcionalidades para o cidadão:** envio de solicitações, recebimento de alertas, acompanhamento de ocorrências.
  - **Funcionalidades para gestores públicos:** painel administrativo, mapa de ocorrências, correlação entre clima e demandas.

- **Seção de Dados Climáticos / Integração com API:** Mostrará como os dados da OpenWeatherMap API serão integrados à aplicação. Nessa área, será possível exibir informações como temperatura, umidade, vento e condição climática atual. Essa seção servirá tanto para demonstrar tecnicamente o uso da API quanto para reforçar o valor da solução no monitoramento de situações de risco.

- **Seção de Benefícios e Impacto:** Apresentará os principais ganhos da plataforma, como agilidade no atendimento, prevenção de riscos, melhor comunicação institucional e fortalecimento da cidadania.

- **Seção de Chamada para Ação (CTA):** Trará um formulário simples ou botões para contato, demonstração e interesse em parceria, com foco em conversão de leads e divulgação do projeto.

- **Rodapé (Footer):** Conterá informações complementares, nomes da equipe, links institucionais e créditos do projeto.

- **Resumo das linguagens**
  - O projeto Conecta Cidadão utilizará HTML para estruturar toda a página, organizando as seções como cabeçalho, chamada inicial, área de problema, funcionalidades e demais conteúdos.
  <header> para o topo da página
  <section> para dividir os blocos de conteúdo
  <nav> para o menu de navegação
  <form> para captação de contatos
  <footer> para o rodapé
  Além disso, o HTML será responsável por organizar textos, títulos, botões, imagens, cards informativos e áreas reservadas para exibição dinâmica dos dados climáticos trazidos pela API.

  - O CSS será responsável pela estilização da interface, definindo cores, layout, tipografia e garantindo uma navegação clara, responsiva e agradável para o usuário.

  - O JavaScript será utilizado para implementar a interatividade da página e realizar a integração com a OpenWeatherMap API. Entre suas funções principais estão:
    - Realizar requisições à API para obter dados climáticos em tempo real
    - Processar e exibir essas informações dinamicamente na seção de clima
    - Permitir interações com botões e elementos da página
    - Validar campos do formulário de contato antes do envio
    - Atualizar partes do conteúdo sem necessidade de recarregar a página
    - Dessa forma, o JavaScript será o responsável por conectar a parte visual da landing page com dados externos e comportamentos dinâmicos da interface.

## Infraestrutura e BackEnd:
 - A ver
