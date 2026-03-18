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
Atualmente, a comunicação entre o cidadão e os serviços públicos é caracterizada por ser ineficiente, fragmentada e reativa[cite: 10]. Os principais problemas identificados são:
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

Infraestrutura e BackEnd:
 - A ver
