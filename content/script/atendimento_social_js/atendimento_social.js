// Variáveis globais para a API
const entidade = "sesi";
const departamento = "sesi-rr";
const baseURL = "https://sistematransparenciaweb.com.br/api-atendimento-social/publico/atendimento-social";

const anoSelect = document.getElementById("ano");
const btnExcel = document.getElementById("btnExcel");
const btnOds = document.getElementById("btnOds");

/**
 * Função para verificar os anos válidos na API
 */
async function verificarAnosValidos() {
    console.log("Verificando anos disponíveis...");

    const anoAtual = new Date().getFullYear();
    let anosValidos = [];

    for (let ano = anoAtual; ano >= anoAtual - 5; ano--) { // Testa apenas os últimos 5 anos
        try {
            const response = await fetch(`${baseURL}?entidade=${entidade}&departamento=${departamento}&ano=${ano}`);
            if (!response.ok) {
                console.warn(`Ano ${ano} não disponível.`);
                continue;
            }

            const data = await response.json();
            if (data.temas && Object.keys(data.temas).length > 0) {
                anosValidos.push(ano);
            }
        } catch (error) {
            console.error(`Erro ao verificar ano ${ano}:`, error);
        }
    }

    if (anosValidos.length > 0) {
        popularSelecaoAnos(anosValidos);
        fetchData();
    } else {
        console.error("Nenhum dado válido encontrado.");
    }
}

/**
 * Popula a seleção de ano
 */
function popularSelecaoAnos(anosValidos) {
    anosValidos.forEach(ano => {
        let option = document.createElement("option");
        option.value = ano;
        option.textContent = ano;
        anoSelect.appendChild(option);
    });

    anoSelect.addEventListener("change", fetchData);
}

/**
 * Busca os dados da API e exibe na tabela
 */
async function fetchData() {
    let anoSelecionado = anoSelect.value;
    try {
        const response = await fetch(`${baseURL}?entidade=${entidade}&departamento=${departamento}&ano=${anoSelecionado}`);
        const data = await response.json();

        const tableBody = document.querySelector("#data-table tbody");
        tableBody.innerHTML = "";

        for (const temaKey in data.temas) {
            const tema = data.temas[temaKey];

            const temaRow = document.createElement("tr");
            temaRow.innerHTML = `<td colspan="4" class="tema">${tema.nomeTema}</td>`;
            tableBody.appendChild(temaRow);

            for (const linhaNegocioKey in tema.linhasNegocio) {
                const linhaNegocio = tema.linhasNegocio[linhaNegocioKey];

                for (const acaoFinalisticaKey in linhaNegocio.acoesFinalisticas) {
                    const acaoFinalistica = linhaNegocio.acoesFinalisticas[acaoFinalisticaKey];
                    const dadosQuantitativos = acaoFinalistica.dadosQuantitativos.NORTE;

                    if (dadosQuantitativos) {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${acaoFinalistica.nomeAcaoFinalistica}</td>
                            <td>${dadosQuantitativos.previsto}</td>
                            <td>${dadosQuantitativos.realizado || "-"}</td>
                            <td>${dadosQuantitativos.indiceRealizacao || "0.00%"}</td>
                        `;
                        tableBody.appendChild(row);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Erro ao buscar os dados:", error);
    }
}

btnExcel.addEventListener("click", () => {
    window.location.href = `${baseURL}/export?entidade=${entidade}&departamento=${departamento}&ano=${anoSelect.value}&formatoExportacao=XLSX`;
});

btnOds.addEventListener("click", () => {
    window.location.href = `${baseURL}/export?entidade=${entidade}&departamento=${departamento}&ano=${anoSelect.value}&formatoExportacao=ODS`;
});

// Inicia o script
verificarAnosValidos();
