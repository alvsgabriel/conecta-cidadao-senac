// 1. Configurações Iniciais
// Coloque sua chave entre as aspas (pegue no site openweathermap.org)
const minhaChave = "105d4c5af66162bca3e200c3a89a40ff"; 
let cidadeAtual = "Estrela,BR"; // Será atualizado com base no CEP salvo ou padrão
let mapa; // Variável para o mapa Leaflet
let marcador; // Variável para o marcador do mapa
let camadas = {}; // Objeto para armazenar as camadas de clima

// 2. Função para buscar dados do ViaCEP
function buscarCEP(cep) {
    // Remove caracteres não-numéricos
    cep = cep.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        document.getElementById("cep-error").textContent = "CEP deve ter 8 dígitos.";
        document.getElementById("cep-info").textContent = "";
        return;
    }

    document.getElementById("cep-error").textContent = "";
    document.getElementById("cep-info").textContent = "Buscando localização...";

    const url = "https://viacep.com.br/ws/" + cep + "/json/";

    fetch(url)
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(dados) {
            if (dados.erro) {
                document.getElementById("cep-error").textContent = "CEP não encontrado.";
                document.getElementById("cep-info").textContent = "";
                return;
            }

            // Formata a localização para a API OpenWeatherMap
            cidadeAtual = dados.localidade + "," + "BR";
            
            // Salva no localStorage
            localStorage.setItem("cepSalvo", cep);
            localStorage.setItem("cidadeSalva", cidadeAtual);

            document.getElementById("cep-info").textContent = "Local atualizado: " + dados.localidade + ", " + dados.uf;
            document.getElementById("cep-error").textContent = "";

            // Busca o clima da nova localização
            buscarClima();
        })
        .catch(function(erro) {
            console.error("Erro ao buscar CEP: ", erro);
            document.getElementById("cep-error").textContent = "Erro ao buscar CEP.";
            document.getElementById("cep-info").textContent = "";
        });
}

// 3. Função para buscar os dados da API OpenWeatherMap
function buscarClima() {
    // Montamos a URL com a cidade, a chave, o idioma (pt_br) e a unidade (metric para Celsius)
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cidadeAtual + "&appid=" + minhaChave + "&units=metric&lang=pt_br";

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

// 4. Função para colocar os dados no HTML
function mostrarNaTela(dadosClima) {
    console.log(dadosClima);
    // Selecionamos o elemento onde vamos colocar as informações
    const boxClima = document.getElementById("weather-card");

    // Pegamos as informações específicas que queremos de dentro do 'pacotão' da API
    const temperatura = Math.round(dadosClima.main.temp); // Arredonda o número
    const descricao = dadosClima.weather[0].description;
    const umidade = dadosClima.main.humidity;
    const icone = dadosClima.weather[0].icon;
    const lat = dadosClima.coord.lat;
    const lon = dadosClima.coord.lon;

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

    // Inicializar ou atualizar o mapa com as coordenadas
    inicializarMapa(lat, lon);
}

// 4.5. Função para inicializar o mapa com camadas de clima
function inicializarMapa(lat, lon) {
    // Se o mapa já existe, apenas atualiza a vista e o marcador
    if (mapa) {
        mapa.setView([lat, lon], 10);
        // Remover marcador antigo se existir
        if (marcador) {
            mapa.removeLayer(marcador);
        }
        // Adicionar novo marcador
        marcador = L.marker([lat, lon]).addTo(mapa)
            .bindPopup(`Localização: ${cidadeAtual}`)
            .openPopup();
        return;
    }

    // Inicializar o mapa centrado nas coordenadas
    mapa = L.map('weather-map').setView([lat, lon], 10);

    // Adicionar camada base (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mapa);

    // Definir as camadas de clima disponíveis
    const camadasClima = {
        "Precipitação": L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${minhaChave}`, {
            attribution: '© OpenWeatherMap'
        }),
        "Nuvens": L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${minhaChave}`, {
            attribution: '© OpenWeatherMap'
        }),
        "Pressão": L.tileLayer(`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${minhaChave}`, {
            attribution: '© OpenWeatherMap'
        }),
        "Vento": L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${minhaChave}`, {
            attribution: '© OpenWeatherMap'
        }),
        "Temperatura": L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${minhaChave}`, {
            attribution: '© OpenWeatherMap'
        })
    };

    // Adicionar controle de camadas
    L.control.layers(null, camadasClima).addTo(mapa);

    // Adicionar marcador na localização
    marcador = L.marker([lat, lon]).addTo(mapa)
        .bindPopup(`Localização: ${cidadeAtual}`)
        .openPopup();
}
const formularioCEP = document.getElementById("cep-form");

formularioCEP.addEventListener("submit", function(evento) {
    evento.preventDefault();
    const cepDigitado = document.getElementById("cep-input").value;
    buscarCEP(cepDigitado);
    // formularioCEP.reset(); // Removido para manter o valor do CEP
    // Scroll automático para a seção clima
    document.getElementById('clima').scrollIntoView({ behavior: 'smooth' });
});

// 6. Lógica do Formulário de Contato
const formulario = document.getElementById("lead-form");

formulario.addEventListener("submit", function(evento) {
    // Impede a página de recarregar quando clica no botão
    evento.preventDefault();

    // Aqui você pegaria os valores dos inputs se quisesse enviar para um banco de dados
    alert("Mensagem enviada com sucesso! Logo entraremos em contato.");
    
    // Limpa o formulário
    formulario.reset();
});

// 7. Execução automática
// Assim que a página termina de carregar, ele chama a função do clima
window.onload = function() {
    // Verifica se há uma cidade salva no localStorage
    const cidadeSalva = localStorage.getItem("cidadeSalva");
    if (cidadeSalva) {
        cidadeAtual = cidadeSalva;
        // Preenche o input com o CEP salvo (se existir)
        const cepSalvo = localStorage.getItem("cepSalvo");
        if (cepSalvo) {
            // Formata o CEP com hífen para exibição
            const cepFormatado = cepSalvo.substring(0, 5) + "-" + cepSalvo.substring(5);
            document.getElementById("cep-input").value = cepFormatado;
        }
    }
    buscarClima();
};
