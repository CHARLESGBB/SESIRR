// Função para carregar dinamicamente a tabela de atendimento social dentro do div correto
function carregarAtendimentoSocial() {
    // Seleciona o div onde a tabela será inserida
    const container = document.getElementById("aplicacaoRLCC_gratuidade");

    if (!container) {
        console.error("Erro: Div de destino não encontrada!");
        return;
    }

    // Cria um elemento para carregar o HTML da tabela
    const iframe = document.createElement("iframe");
    iframe.src = "atendimento_social.html"; // Caminho da página contendo a tabela
    iframe.style.width = "100%";
    iframe.style.height = "600px"; // Ajuste conforme necessário
    iframe.style.border = "none";

    // Insere o iframe na div especificada
    container.appendChild(iframe);
}

// Executa a função quando a página estiver carregada
document.addEventListener("DOMContentLoaded", carregarAtendimentoSocial);
