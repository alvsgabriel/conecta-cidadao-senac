// 1. Configurações Iniciais
// Coloque sua chave entre as aspas (pegue no site openweathermap.org)
const minhaChave = "SUA_CHAVE_AQUI"; 
const cidadePadrao = "Estrela,BR"; // Você pode mudar para sua cidade

// 2. Função para buscar os dados da API
function buscarClima() {
    // Montamos a URL com a cidade, a chave, o idioma (pt_br) e a unidade (metric para Celsius)
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cidadePadrao + "&appid=" + minhaChave + "&units=metric&lang=pt_br";

    // O 'fetch' vai até a internet buscar os dados
    fetch(url)
        .then(function(resposta) {
            // Transformamos a resposta em um objeto JSON (lista de dados)
            return resposta.json();
        })
        .then(function(dados) {
            // Agora que temos os dados, chamamos a função que vai mostrar na tela
            mostrarNaTela(dados);
        })
        .catch(function(erro) {
            // Se algo der errado (ex: internet caiu ou chave errada), cai aqui
            console.error("Erro ao buscar dados: ", erro);
            document.getElementById("weather-card").innerHTML = "Erro ao carregar clima.";
        });
}

// 3. Função para colocar os dados no HTML
function mostrarNaTela(dadosClima) {
    // Selecionamos o elemento onde vamos colocar as informações
    const boxClima = document.getElementById("weather-card");

    // Pegamos as informações específicas que queremos de dentro do 'pacotão' da API
    const temperatura = Math.round(dadosClima.main.temp); // Arredonda o número
    const descricao = dadosClima.weather[0].description;
    const umidade = dadosClima.main.humidity;
    const icone = dadosClima.weather[0].icon;

    // Criamos o HTML que vai aparecer dentro do card
    // Usamos o sinal de crase (`) para conseguir misturar texto com variáveis ${}
    boxClima.innerHTML = `
        <div class="clima-info">
            <img src="https://openweathermap.org/img/wn/${icone}@2x.png" alt="Icone do tempo">
            <h3>${temperatura}°C</h3>
            <p style="text-transform: capitalize;">${descricao}</p>
            <p>Umidade: ${umidade}%</p>
            <p><strong>Local:</strong> ${dadosClima.name}</p>
        </div>
    `;
}

// 4. Lógica do Formulário de Contato
const formulario = document.getElementById("lead-form");

formulario.addEventListener("submit", function(evento) {
    // Impede a página de recarregar quando clica no botão
    evento.preventDefault();

    // Aqui você pegaria os valores dos inputs se quisesse enviar para um banco de dados
    alert("Mensagem enviada com sucesso! Logo entraremos em contato.");
    
    // Limpa o formulário
    formulario.reset();
});

// 5. Execução automática
// Assim que a página termina de carregar, ele chama a função do clima
window.onload = function() {
    buscarClima();
};
