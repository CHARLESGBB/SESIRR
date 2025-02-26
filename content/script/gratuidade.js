let entidade = "SESI";
let departamento = "SESI-RR";
let ano = new Date().getFullYear();

let casa = "sesi";

// Função para buscar o tamanho do arquivo usando uma requisição HEAD
function getFileSize(url, callback) {
    $.ajax({
        url: url,
        type: 'HEAD',
        success: function (data, status, xhr) {
            var size = xhr.getResponseHeader('Content-Length');
            callback(size);
        },
        error: function () {
            callback(null);
        }
    });
}

// Função para converter tamanho de bytes para KB e formatar
function formatKilobytes(sizeInBytes) {
    var sizeInKB = sizeInBytes / 1024;
    return sizeInKB.toFixed(1).replace('.', ',') + " KB";
}

$(document).ready(function () {
    // função para os tabs da pagina
    let isAnimating = false;

    function openTab(tabId) {
        if (isAnimating) return;
        isAnimating = true;

        $('.tab-content.active').slideUp(300, function () {
            $(this).removeClass('active');
            $('#' + tabId).slideDown(300, function () {
                $(this).addClass('active');
                isAnimating = false;
            });
        });

        $('.tab-custom').removeClass('tab-active');

        $('[data-tab="' + tabId + '"]').addClass('tab-active');

        var newUrl = window.location.origin + window.location.pathname + '#' + tabId;
        history.pushState({ tab: tabId }, '', newUrl);
    }

    // Lidar com cliques nas abas
    $('.tab-custom').on('click', function () {
        var tabId = $(this).data('tab');

        openTab(tabId);
    });

    /**
    var urlParams = new URLSearchParams(window.location.search);
    var activeTab = urlParams.get('tab') || 'aplicacaoRLCC_gratuidade';
    openTab(activeTab);
    */

    // verifica o endereçamento da url da página
    $(document).ready(function () {
        // função para os tabs da página
        let isAnimating = false;
    
        function openTab(tabId) {
            if (isAnimating) return;
            isAnimating = true;
    
            $('.tab-content.active').slideUp(300, function () {
                $(this).removeClass('active');
                $('#' + tabId).slideDown(300, function () {
                    $(this).addClass('active');
                    isAnimating = false;
                });
            });
    
            $('.tab-custom').removeClass('tab-active');
            $('[data-tab="' + tabId + '"]').addClass('tab-active');
    
            // Atualiza o hash na URL
            var newUrl = window.location.origin + window.location.pathname + '#' + tabId;
            history.pushState({ tab: tabId }, '', newUrl);
        }
    
        // Lidar com cliques nas abas
        $('.tab-custom').on('click', function () {
            var tabId = $(this).data('tab');
            openTab(tabId);
        });
    
        // Verifica o hash da URL e abre a aba correspondente
        var hash = window.location.hash.substring(1); // Remove o '#' do início
        var activeTab = hash || 'aplicacaoRLCC_gratuidade';
        openTab(activeTab);
    });

    // Seleciona todos os links que têm a classe .div_anexos_doc
    $('.div_anexos_doc').each(function () {
        var $link = $(this);
        var fileUrl = $link.attr('href');

        getFileSize(fileUrl, function (size) {
            if (size !== null) {
                $link.find('.file-size').text(formatKilobytes(size));
            } else {
                $link.find('.file-size').text('5MB');
            }
        });
    });

    // Função de click sobre as tabs dentro do conteudo
    $('.accordion-header').click(function () {
        $('.accordion-item.active').removeClass('active').find('.accordion-header').css('border-bottom', '0.1px solid #add8e6');

        $('.accordion-image').removeClass('rotated');

        const contentVisible = $(this).next('.accordion-content').is(':visible');

        $('.accordion-content').slideUp('fast');

        if (!contentVisible) {
            $(this).next('.accordion-content').slideDown('fast');
            $(this).parent().addClass('active').find('.accordion-header').css('border-bottom', '2px solid #0b64bf');
            $(this).find('.accordion-image').addClass('rotated');
        } else {
            $(this).parent().removeClass('active');
        }
    });

    // APLICAÇÃO DA RECEITA LÍQUIDA DE CONTRIBUIÇÃO COMPULSÓRIA
    function fetchDataForYear(year) {
        $('#tituloLiquidaCompulsoria').text(`CARREGANDO...`);
        $('#tbody-receita-compulsoria-gratuidade').empty();
        $('#fonteLiquidaCompulsoria').empty();
        $('#notasLiquidaCompulsoria').empty();

        var apiUrl = `https://sistematransparenciaweb.com.br/api-gratuidade/publico/gratuidades/indicadores/entidades/${entidade}/departamentos/${departamento}/gratuidade?ano=${year}`;

        $.ajax({
            url: apiUrl,
            method: "GET",
            success: function (data) {
                $('#tituloLiquidaCompulsoria').text(`APLICAÇÃO DA RECEITA LÍQUIDA DE CONTRIBUIÇÃO COMPULSÓRIA - ${year}`);

                $('#fonteLiquidaCompulsoria').text(data[0].fonte);
                $('#analiseLiquidaCompulsoria').text(data[0].analise == "" ? "Não há análise" : data[0].analise);
                $('#notasLiquidaCompulsoria').html(data[0].notas == "" ? "Não há notas" : data[0].notas);

                var tableContent = `
                    <tr style="background: #F1F1F1 !important;">
                        <td class="td-indicador td-results-border-right"><b>Indicador</b></td>
                        <td class="td-right td-results-border-right"><b>Meta Anual</b></td>
                        <td class="td-right td-results-border-right"><b>Realizado <br> (${data[0].sgPeriodoReferencia})</b></td>
                        <td class="td-right td-results-border-right"><b>Índice de Realização¹</b></td>
                    </tr>
                `;

                data.forEach(function (item) {
                    tableContent += `
                        <tr>
                            <td class="td-indicador td-results-border-right">${item.indicador}</td>
                            <td class="td-right td-results-border-right">${item.estimadoAnual}</td>
                            <td class="td-right td-results-border-right">${item.realizado}</td>
                            <td class="td-right td-results-border-right">${item.indiceRealizacao}</td>
                        </tr>
                    `;
                });

                $('#tbody-receita-compulsoria-gratuidade').html(tableContent);
            },
            error: function (xhr, status, error) {
                console.error("Erro ao buscar dados da API: ", error);
                $('#tituloLiquidaCompulsoria').text(`Erro ao carregar os dados para o ano ${year}`);
            }
        });
    }

    $('#valueSelectLiquidaCompulsoria').change(function () {
        var selectedYear = $(this).val();
        fetchDataForYear(selectedYear);
    });

    /* ateração da data atual para 2024 */
    var currentYear = new Date().getFullYear() -1;
    $('#valueSelectLiquidaCompulsoria').empty();
    for (var i = 0; i < 4; i++) {
        var year = currentYear - i;
        $('#valueSelectLiquidaCompulsoria').append('<option value="' + year + '">' + year + '</option>');
    }

    fetchDataForYear(currentYear);

    $('#xlsxIndicadoresLiquidaCompulsoria').click(function (event) {
        event.preventDefault();
        var selectedYear = $('#valueSelectLiquidaCompulsoria').val();
        let apiExportReceita = `https://sistematransparenciaweb.com.br/api-gratuidade/publico/gratuidades/indicadores/export?siglaEntidadeNacional=${entidade}&departamento=${departamento}&ano=${selectedYear}&formatoExportacao=XLSX`;
        window.open(apiExportReceita, '_blank');
    });

    $('#odsIndicadoresLiquidaCompulsoria').click(function (event) {
        event.preventDefault();
        var selectedYear = $('#valueSelectLiquidaCompulsoria').val();
        let apiExportReceita = `https://sistematransparenciaweb.com.br/api-gratuidade/publico/gratuidades/indicadores/export?siglaEntidadeNacional=${entidade}&departamento=${departamento}&ano=${selectedYear}&formatoExportacao=ODS`;
        window.open(apiExportReceita, '_blank');
    });


    // EDUCAÇÃO BÁSICA E CONTINUADA
    function fetchDataForYearEducacao(year) {
        $('#tituloEducacaoBasica').text(`CARREGANDO...`);
        $('#tbody-educacao-basica').empty();
        $('#fonteEducacaoBasica').empty();
        $('#notasEducacaoBasica').empty();

        var apiUrl = `https://sistematransparenciaweb.com.br/api-gratuidade/publico/gratuidades/vagas/entidades/${entidade}/departamentos/${departamento}/gratuidade?ano=${year}`;

        $.ajax({
            url: apiUrl,
            method: "GET",
            success: function (data) {
                $('#tituloEducacaoBasica').text(`EDUCAÇÃO BÁSICA E CONTINUADA - ${year}`);

                $('#fonteEducacaoBasica').text(data.fonte == "" ? departamento : data.fonte);
                $('#analiseEducacaoBasica').text(data.analise == "" ? "Não há análise" : data.analise);

                var formattedNota = data.nota.replace(/\(\d\)/g, (match, offset) => {
                    if (offset > 0) {
                        return '<br><br>' + match;
                    }
                    return match;
                });

                formattedNota = formattedNota === "" ? "Não há nota" : formattedNota;
                $('#notasEducacaoBasica').html(formattedNota);

                var tableContent = `
                    <tr style="background: #e3e1e1 !important;">
                        <td class="td-indicador-educacao td-results-border-right" colspan="4"><b>GRATUIDADE REGULAMENTAR</b></td>
                        <td class="td-right td-results-border-right" colspan="1"><b>EXCETO GRATUIDADE REGULAMENTAR</b></td>
                        <td class="td-right td-results-border-right"><b>Total¹</b></td>
                    </tr>
                    <tr style="background: #e3e1e1 !important;">
                        <td class="td-indicador-educacao td-results-border-right"><b>Programa/Modalidade</b></td>
                        <td class="td-right td-results-border-right"><b>Vagas Planejadas Anual</b></td>
                        <td class="td-right td-results-border-right"><b>Matrículas Realizadas³ <br>${(data.periodoReferencia)}</b></td>
                        <td class="td-right td-results-border-right"><b>Hora-Aluno Realizado³ <br>${(data.periodoReferencia)}</b></td>
                        <td class="td-right td-results-border-right"><b>Hora-Aluno Realizado³ <br>${(data.periodoReferencia)}</b></td>
                        <td class="td-right td-results-border-right"><b>Hora-Aluno Realizado³ <br>${(data.periodoReferencia)}</b></td>
                    </tr>
                `;

                data.programas.forEach(function (programa) {
                    tableContent += `
                        <tr style="font-weight: bold;">
                            <td class="td-indicador td-programa td-results-border-right">${programa.descricao}</td>
                            <td class="td-right td-programa td-results-border-right">${programa.qntPlanejada}</td>
                            <td class="td-right td-programa td-results-border-right">${programa.qntRealizada}</td>
                            <td class="td-right td-programa td-results-border-right">${programa.qntHoraAlunoGratuidadeRealizada}</td>
                            <td class="td-right td-programa td-results-border-right">${programa.qntHoraAlunoNaoGratuitoRealizada}</td>
                            <td class="td-right td-programa td-results-border-right">${programa.qntTotalHoraAlunoRealizada}</td>
                        </tr>
                    `;

                    programa.produtos.forEach(function (produto) {
                        tableContent += `
                            <tr>
                                <td class="td-indicador td-results-border-right">- ${produto.descricao}</td>
                                <td class="td-right td-results-border-right">${produto.qntPlanejada}</td>
                                <td class="td-right td-results-border-right">${produto.qntRealizada}</td>
                                <td class="td-right td-results-border-right">${produto.qntHoraAlunoGratuidadeRealizada}</td>
                                <td class="td-right td-results-border-right">${produto.qntHoraAlunoNaoGratuitoRealizada}</td>
                                <td class="td-right td-results-border-right">${produto.qntTotalHoraAlunoRealizada}</td>
                            </tr>
                        `;
                    });
                });

                tableContent += `
                    <tr>
                        <td class="td-indicador td-programa td-results-border-right">Total</td>
                        <td style="text-align: center;" class="td-results td-programa">${data.qntPlanejada}</td>
                        <td style="text-align: center;" class="td-results td-programa">${data.qntRealizada}</td>
                        <td style="text-align: center;" class="td-results td-programa">${data.totalHoraAlunoRealizada}</td>
                        <td style="text-align: center;" class="td-results td-programa">${data.horaAlunoRealizadaGratuita}</td>
                        <td style="text-align: center;" class="td-results td-programa">${data.qntHoraAlunoRealizadaNaoGratuita}</td>
                    </tr>
                `;

                tableContent += `
                    <tr style="height: 15px; background-color: #ffffff;">
                        <td colspan="6" style="border-left: 1px solid #ffffff; border-right: 1px solid #ffffff;"></td>
                    </tr>
                    <tr>
                        <td class="td-indicador td-results-border-right" colspan="3">Hora-aluno realizado em outras modalidades²</td>
                        <td style="text-align: center;" class="td-right-content-2 td-results-border-right">${data.qntHoraAlunoRealizadaOutros}</td>
                        <td style="text-align: center;" class="td-right-content-2 td-results-border-right">${data.qntHoraAlunoRealizadaOutros}</td>
                        <td style="text-align: center;" class="td-right-content-2 td-results-border-right">${data.qntHoraAlunoRealizadaOutros}</td>
                    </tr>
                    <tr class="td-programa">
                        <td class="td-indicador td-results-border-right" colspan="3">Total de hora-aluno realizado no período³</td>
                        <td style="text-align: center;" class="td-results">${data.horaAlunoRealizadaGratuita}</td>
                        <td style="text-align: center;" class="td-results">${data.qntHoraAlunoRealizadaNaoGratuita}</td>
                        <td style="text-align: center;" class="td-results">${data.qntTotalGeralHoraAlunoRealizada}</td>
                    </tr>
                `;

                $('#tbody-educacao-basica').html(tableContent);
            },
            error: function (xhr, status, error) {
                console.error("Erro ao buscar dados da API: ", error);
                $('#tituloEducacaoBasica').text(`Erro ao carregar os dados para o ano ${year}`);
            }
        });
    }

    $('#valueSelectEducacaoBasica').change(function () {
        var selectedYear = $(this).val();
        fetchDataForYearEducacao(selectedYear);
    });

    /* alteração da data para 2024 */
    var currentYear = new Date().getFullYear() -1;
    $('#valueSelectEducacaoBasica').empty();
    for (var i = 0; i < 4; i++) {
        var year = currentYear - i;
        $('#valueSelectEducacaoBasica').append('<option value="' + year + '">' + year + '</option>');
    }

    fetchDataForYearEducacao(currentYear);

    $('#xlsxIndicadoresEducacaoBasica').click(function (event) {
        event.preventDefault();
        var selectedYear = $('#valueSelectEducacaoBasica').val();
        let apiExportReceita = `https://sistematransparenciaweb.com.br/api-gratuidade/publico/gratuidades/vagas/export?siglaEntidadeNacional=${entidade}&departamento=${departamento}&ano=${selectedYear}&formatoExportacao=XLSX`;
        window.open(apiExportReceita, '_blank');
    });

    $('#odsIndicadoresEducacaoBasica').click(function (event) {
        event.preventDefault();
        var selectedYear = $('#valueSelectEducacaoBasica').val();
        let apiExportReceita = `https://sistematransparenciaweb.com.br/api-gratuidade/publico/gratuidades/vagas/export?siglaEntidadeNacional=${entidade}&departamento=${departamento}&ano=${selectedYear}&formatoExportacao=ODS`;
        window.open(apiExportReceita, '_blank');
    });


    // Receita de Contribuição Compulsória
    var currentYear = new Date().getFullYear();
    $('#valueSelectReceita').empty();
    for (var i = 0; i < 1; i++) {
        var year = currentYear - i;
        $('#valueSelectReceita').append('<option value="' + year + '">' + year + '</option>');
    }

    $('#xlsxIndicadoresReceita').click(function (event) {
        event.preventDefault();

        var selectedYear = $('#valueSelectReceita').val();
        let apiExportReceita = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/dr/${casa}/contribuicao-compulsoria/export?entidade=${entidade}&departamento=${departamento}&ano=${selectedYear}&formatoExportacao=XLSX`;

        window.open(apiExportReceita, '_blank');
    });

    $('#odsIndicadoresReceita').click(function (event) {
        event.preventDefault();

        var selectedYear = $('#valueSelectReceita').val();
        let apiExportReceita = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/dr/${casa}/contribuicao-compulsoria/export?entidade=${entidade}&departamento=${departamento}&ano=${selectedYear}&formatoExportacao=ODS`;

        window.open(apiExportReceita, '_blank');
    });

    var apiUrl = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/dr/${casa}/contribuicao-compulsoria?entidade=${entidade}&departamento=${departamento}&ano=${ano}`;

    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function (data) {
            $('#titulo').text(data.titulo);
            $('#fonteReceita').text(data.fonte);

            var formattedNotas = data.notas.replace(/\n\n/g, '<br><br>');
            $('#notasReceita').html(formattedNotas);

            var tableContent = `
                <tr>
                    <td class="td-results"><b>Indicador</b></td>
                    <td class="td-results"><b>Realizado (${data.periodoReferencia})</b></td>
                </tr>
                <tr>
                    <td class="td-results td-results-border-right">RECEITA BRUTA DE CONTRIBUIÇÃO COMPULSÓRIA (RBCC)¹</td>
                    <td class="td-results">${data.rcBrutaContribuicaoCompulsoriaDepRegional}</td>
                </tr>
                <tr>
                    <td class="td-results td-results-border-right">DEDUÇÕES REGULAMENTARES (DDR)²</td>
                    <td class="td-results">${data.drDeducoesRegulamentaresDepRegional}</td>
                </tr>
                <tr>
                    <td class="td-results td-results-border-right">RECEITA LÍQUIDA DE CONTRIBUIÇÃO COMPULSÓRIA (RLCC)³</td>
                    <td class="td-results">${data.rcLiquidaContribuicaoCompulsoriaDepRegional}</td>
                </tr>
            `;

            $('#tbody-receita-compulsoria').html(tableContent);
        },
        error: function (xhr, status, error) {
            console.error("Erro ao buscar dados da API: ", error);
        }
    });


    // Despesa Total por Modalidade
    var currentYear = new Date().getFullYear();
    $('#valueSelectDespesaModalidade').empty();
    for (var i = 0; i < 1; i++) {
        var year = currentYear - i;
        $('#valueSelectDespesaModalidade').append('<option value="' + year + '">' + year + '</option>');
    }

    $('#xlsxIndicadoresDespesaModalidade').click(function (event) {
        event.preventDefault();

        var selectedYear = $('#valueSelectDespesaModalidade').val();
        let apiExportModalidade = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/modalidade/${casa}/despesa-total/export?entidade=${entidade}&departamento=${departamento}&ano=${selectedYear}&tipoExportacao=XLSX`;

        window.open(apiExportModalidade, '_blank');
    });

    $('#odsIndicadoresDespesaModalidade').click(function (event) {
        event.preventDefault();

        var selectedYear = $('#valueSelectDespesaModalidade').val();
        let apiExportModalidade = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/modalidade/${casa}/despesa-total/export?entidade=${entidade}&departamento=${departamento}&ano=${selectedYear}&tipoExportacao=ODS`;

        window.open(apiExportModalidade, '_blank');
    });

    var apiUrl = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/modalidade/${casa}/despesa-total?entidade=${entidade}&departamento=${departamento}&ano=${ano}`;

    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function (data) {
            $('#tituloDespesaModalidade').text(data.titulo);
            $('#fonteDespesaModalidade').text(data.fonte);

            var formattedNotas = data.nota.replace(/\n\n/g, '<br><br>');
            $('#notasDespesaModalidade').html(formattedNotas);

            var tableContent = `
                <tr>
                    <td class="td-results-modalidade"><b>Programa/Modalidade</b></td>
                    <td class="td-results-modalidade"><b>Realizado (${data.periodoReferencia})</b></td>
                </tr>
            `;

            data.programas.forEach(function (programa) {
                tableContent += `
                    <tr class="td-programa">
                        <td class="td-results-modalidade td-results-modalidade-border-right" colspan="2">
                            <b>${programa.nomePrograma}</b>
                        </td>
                    </tr>
                `;

                programa.modalidades.forEach(function (modalidade) {
                    tableContent += `
                        <tr>
                            <td class="td-results-modalidade td-results-modalidade-border-right">${modalidade.nomeModalidade}</td>
                            <td class="td-results-modalidade">${modalidade.valorDespesaTotalModalidade}</td>
                        </tr>
                    `;
                });
            });

            tableContent += `
                <tr class="td-programa">
                    <td class="td-results-modalidade td-results-modalidade-border-right">Total</td>
                    <td class="td-results-modalidade">${data.somaValorDespesaTotalModalidade}</td>
                </tr>
            `;

            $('#tbody-despesa-modalidade').html(tableContent);
        },
        error: function (xhr, status, error) {
            console.error("Erro ao buscar dados da API: ", error);
        }
    });


    // Hora-aluno Total
    var currentYear = new Date().getFullYear();
    $('#valueSelectHoraAluno').empty();
    for (var i = 0; i < 1; i++) {
        var year = currentYear - i;
        $('#valueSelectHoraAluno').append('<option value="' + year + '">' + year + '</option>');
    }

    $('#xlsxIndicadoresHoraAluno').click(function (event) {
        event.preventDefault();

        var selectedYear = $('#valueSelectHoraAluno').val();
        let apiExportModalidade = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/modalidade/${casa}/hora-aluno-total/export?entidade=${entidade}&departamento=${departamento}&ano=${selectedYear}&formatoExportacao=XLSX`;

        window.open(apiExportModalidade, '_blank');
    });

    $('#odsIndicadoresHoraAluno').click(function (event) {
        event.preventDefault();

        var selectedYear = $('#valueSelectHoraAluno').val();
        let apiExportModalidade = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/modalidade/${casa}/hora-aluno-total/export?entidade=${entidade}&departamento=${departamento}&ano=${selectedYear}&formatoExportacao=ODS`;

        window.open(apiExportModalidade, '_blank');
    });

    var apiUrl = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/modalidade/${casa}/hora-aluno-total?entidade=${entidade}&departamento=${departamento}&ano=${ano}`;

    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function (data) {
            $('#tituloHoraAluno').text(data.titulo);
            $('#fonteHoraAluno').text(data.fonte);

            var tableContent = `
                <tr>
                    <td class="td-results-hora-aluno"><b>Programa/Modalidade</b></td>
                    <td class="td-results-hora-aluno"><b>Realizado (${data.periodoReferencia})</b></td>
                </tr>
            `;

            data.programas.forEach(function (programa) {
                tableContent += `
                    <tr class="td-programa">
                        <td class="td-results-hora-aluno td-results-hora-aluno-border-right" colspan="2">
                            <b>${programa.nomePrograma}</b>
                        </td>
                    </tr>
                `;

                programa.modalidades.forEach(function (modalidade) {
                    tableContent += `
                        <tr>
                            <td class="td-results-hora-aluno td-results-hora-aluno-border-right">${modalidade.nomeModalidade}</td>
                            <td class="td-results-hora-aluno">${modalidade.horaAlunoTotalRealizado}</td>
                        </tr>
                    `;
                });
            });

            tableContent += `
                <tr class="td-programa">
                    <td class="td-results-hora-aluno td-results-hora-aluno-border-right">Total</td>
                    <td class="td-results-hora-aluno">${data.somaHoraAlunoTotalRealizado}</td>
                </tr>
            `;

            $('#tbody-hora-aluno').html(tableContent);
        },
        error: function (xhr, status, error) {
            console.error("Erro ao buscar dados da API: ", error);
        }
    });


    // Gasto Médio hora-aluno
    var currentYear = new Date().getFullYear();
    $('#valueSelectHoraAlunoMedio').empty();
    for (var i = 0; i < 1; i++) {
        var year = currentYear - i;
        $('#valueSelectHoraAlunoMedio').append('<option value="' + year + '">' + year + '</option>');
    }

    $('#xlsxIndicadoresHoraAlunoMedio').click(function (event) {
        event.preventDefault();

        var selectedYear = $('#valueSelectHoraAlunoMedio').val();
        let apiExportModalidade = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/modalidade/gasto-medio-hora-aluno/${casa}/export?entidade=${entidade}&departamento=${departamento}&ano=${selectedYear}&formatoExportacao=XLSX`;

        window.open(apiExportModalidade, '_blank');
    });

    $('#odsIndicadoresHoraAlunoMedio').click(function (event) {
        event.preventDefault();

        var selectedYear = $('#valueSelectHoraAlunoMedio').val();
        let apiExportModalidade = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/modalidade/gasto-medio-hora-aluno/${casa}/export?entidade=${entidade}&departamento=${departamento}&ano=${selectedYear}&formatoExportacao=ODS`;

        window.open(apiExportModalidade, '_blank');
    });

    var apiUrl = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/modalidade/${casa}/gasto-medio-hora-aluno?entidade=${entidade}&departamento=${departamento}&ano=${ano}`;

    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function (data) {
            $('#tituloHoraAlunoMedio').text(data.titulo);
            $('#fonteHoraAlunoMedio').text(data.fonte);

            var formattedNotas = data.nota.replace(/\n\n/g, '<br><br>');
            $('#notasHoraAlunoMedio').html(formattedNotas);

            var tableContent = `
                <tr>
                    <td class="td-results-hora-aluno-medio"><b>Programa/Modalidade</b></td>
                    <td class="td-results-hora-aluno-medio"><b>Realizado (${data.periodoReferencia})</b></td>
                </tr>
            `;

            data.programas.forEach(function (programa) {
                tableContent += `
                    <tr class="td-programa">
                        <td class="td-results-hora-aluno-medio td-results-hora-aluno-medio-border-right" colspan="2">
                            <b>${programa.nomePrograma}</b>
                        </td>
                    </tr>
                `;

                programa.modalidades.forEach(function (modalidade) {
                    tableContent += `
                        <tr>
                            <td class="td-results-hora-aluno-medio td-results-hora-aluno-medio-border-right">${modalidade.nomeModalidade}</td>
                            <td class="td-results-hora-aluno-medio">${modalidade.valorGastoMedioHoraAluno}</td>
                        </tr>
                    `;
                });
            });

            $('#tbody-hora-aluno-medio').html(tableContent);
        },
        error: function (xhr, status, error) {
            console.error("Erro ao buscar dados da API: ", error);
        }
    });


    // Hora-aluno em Gratuidade Regulamentar
    var currentYear = new Date().getFullYear();
    $('#valueSelectHoraAlunoGratuidade').empty();
    for (var i = 0; i < 1; i++) {
        var year = currentYear - i;
        $('#valueSelectHoraAlunoGratuidade').append('<option value="' + year + '">' + year + '</option>');
    }

    $('#xlsxIndicadoresHoraAlunoGratuidade').click(function (event) {
        event.preventDefault();

        var selectedYear = $('#valueSelectHoraAlunoGratuidade').val();
        let apiExportModalidade = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/modalidade/${casa}/hora-aluno-gratuidade-regulamentar/export?entidade=${entidade}&departamento=${departamento}&ano=${selectedYear}&formatoExportacao=XLSX`;

        window.open(apiExportModalidade, '_blank');
    });

    $('#odsIndicadoresHoraAlunoGratuidade').click(function (event) {
        event.preventDefault();

        var selectedYear = $('#valueSelectHoraAlunoGratuidade').val();
        let apiExportModalidade = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/modalidade/${casa}/hora-aluno-gratuidade-regulamentar/export?entidade=${entidade}&departamento=${departamento}&ano=${selectedYear}&formatoExportacao=ODS`;

        window.open(apiExportModalidade, '_blank');
    });

    var apiUrl = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/modalidade/${casa}/hora-aluno-gratuidade-regulamentar?entidade=${entidade}&departamento=${departamento}&ano=${ano}`;

    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function (data) {
            $('#tituloHoraAlunoGratuidade').text(data.titulo);
            $('#fonteHoraAlunoGratuidade').text(data.fonte);

            var tableContent = `
                <tr>
                    <td class="td-results-hora-aluno-gratuidade"><b>Programa/Modalidade</b></td>
                    <td class="td-results-hora-aluno-gratuidade"><b>Realizado (${data.periodoReferencia})</b></td>
                </tr>
            `;

            data.programas.forEach(function (programa) {
                tableContent += `
                    <tr class="td-programa">
                        <td class="td-results-hora-aluno-gratuidade td-results-hora-aluno-gratuidade-border-right" colspan="2">
                            <b>${programa.nomePrograma}</b>
                        </td>
                    </tr>
                `;

                programa.modalidades.forEach(function (modalidade) {
                    tableContent += `
                        <tr>
                            <td class="td-results-hora-aluno-gratuidade td-results-hora-aluno-gratuidade-border-right">${modalidade.nomeModalidade}</td>
                            <td class="td-results-hora-aluno-gratuidade">${modalidade.horaAlunoTotalRealizadoGratuidade}</td>
                        </tr>
                    `;
                });
            });

            tableContent += `
                <tr class="td-programa">
                    <td class="td-results-hora-aluno-gratuidade td-results-hora-aluno-gratuidade-border-right">Total</td>
                    <td class="td-results-hora-aluno-gratuidade">${data.somaHoraAlunoTotalRealizadoGratuidade}</td>
                </tr>
            `;

            $('#tbody-hora-aluno-gratuidade').html(tableContent);
        },
        error: function (xhr, status, error) {
            console.error("Erro ao buscar dados da API: ", error);
        }
    });


    // Despesas Aplicadas em Gratuidade Regulamentar
    var currentYear = new Date().getFullYear();
    $('#valueSelectDespesasAplicadas').empty();
    for (var i = 0; i < 1; i++) {
        var year = currentYear - i;
        $('#valueSelectDespesasAplicadas').append('<option value="' + year + '">' + year + '</option>');
    }

    $('#xlsxIndicadoresDespesasAplicadas').click(function (event) {
        event.preventDefault();

        var selectedYear = $('#valueSelectDespesasAplicadas').val();
        let apiExportModalidade = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/modalidade/${casa}/despesas-aplicadas-gratuidade-regulamentar/export?entidade=${entidade}&departamento=${departamento}&ano=${selectedYear}&formatoExportacao=XLSX`;

        window.open(apiExportModalidade, '_blank');
    });

    $('#odsIndicadoresDespesasAplicadas').click(function (event) {
        event.preventDefault();

        var selectedYear = $('#valueSelectDespesasAplicadas').val();
        let apiExportModalidade = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/modalidade/${casa}/despesas-aplicadas-gratuidade-regulamentar/export?entidade=${entidade}&departamento=${departamento}&ano=${selectedYear}&formatoExportacao=ODS`;

        window.open(apiExportModalidade, '_blank');
    });

    var apiUrl = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/modalidade/${casa}/despesas-aplicadas-gratuidade-regulamentar?entidade=${entidade}&departamento=${departamento}&ano=${ano}`;

    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function (data) {
            $('#tituloDespesasAplicadas').text(data.titulo);
            $('#fonteDespesasAplicadas').text(data.fonte);

            var tableContent = `
                <tr>
                    <td class="td-results-despesas-aplicadas"><b>Programa/Modalidade</b></td>
                    <td class="td-results-despesas-aplicadas"><b>Realizado (${data.periodoReferencia})</b></td>
                </tr>
            `;

            data.programas.forEach(function (programa) {
                tableContent += `
                    <tr class="td-programa">
                        <td class="td-results-despesas-aplicadas td-results-despesas-aplicadas-border-right" colspan="2">
                            <b>${programa.nomePrograma}</b>
                        </td>
                    </tr>
                `;

                programa.modalidades.forEach(function (modalidade) {
                    tableContent += `
                        <tr>
                            <td class="td-results-despesas-aplicadas td-results-despesas-aplicadas-border-right">${modalidade.nomeModalidade}</td>
                            <td class="td-results-despesas-aplicadas">${modalidade.valorDespesaGratuidade}</td>
                        </tr>
                    `;
                });
            });

            tableContent += `
                <tr class="td-programa">
                    <td class="td-results-despesas-aplicadas td-results-despesas-aplicadas-border-right">Total</td>
                    <td class="td-results-despesas-aplicadas">${data.somaValorDespesaGratuidade}</td>
                </tr>
            `;

            $('#tbody-despesas-aplicadas').html(tableContent);
        },
        error: function (xhr, status, error) {
            console.error("Erro ao buscar dados da API: ", error);
        }
    });


    // Resultado da Gratuidade Regulamentar
    var currentYear = new Date().getFullYear();
    $('#valueSelectResultadoGratuidade').empty();
    for (var i = 0; i < 1; i++) {
        var year = currentYear - i;
        $('#valueSelectResultadoGratuidade').append('<option value="' + year + '">' + year + '</option>');
    }

    $('#xlsxIndicadoresResultadoGratuidade').click(function (event) {
        event.preventDefault();

        var selectedYear = $('#valueSelectResultadoGratuidade').val();
        let apiExportReceita = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/dr/${casa}/cumprimento-acordo/export?entidade=${entidade}&departamento=${departamento}&ano=${selectedYear}&formatoExportacao=XLSX`;

        window.open(apiExportReceita, '_blank');
    });

    $('#odsIndicadoresResultadoGratuidade').click(function (event) {
        event.preventDefault();

        var selectedYear = $('#valueSelectResultadoGratuidade').val();
        let apiExportReceita = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/dr/${casa}/cumprimento-acordo/export?entidade=${entidade}&departamento=${departamento}&ano=${selectedYear}&formatoExportacao=ODS`;

        window.open(apiExportReceita, '_blank');
    });

    var apiUrl = `https://sistematransparenciaweb.com.br/api-gratuidade-resultados/publico/gratuidade/dr/${casa}/cumprimento-acordo?entidade=${entidade}&departamento=${departamento}&ano=${ano}`;

    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function (data) {
            $('#tituloResultadoGratuidade').text(data.titulo);
            $('#fonteResultadoGratuidade').text(data.fonte);

            var formattedNotas = data.nota.replace(/\n\n/g, '<br><br>');
            $('#notasResultadoGratuidade').html(formattedNotas);

            var tableContent = `
                <tr>
                    <td class="td-results"><b>Receitas</b></td>
                    <td class="td-results"><b>Realizado (${data.periodoReferencia})</b></td>
                </tr>
                <tr>
                    <td class="td-results td-results-border-right">RECEITA BRUTA DE CONTRIBUIÇÃO COMPULSÓRIA (RBCC)¹</td>
                    <td class="td-results">${data.receitaBrutaContribuicaoCompulsoria}</td>
                </tr>
                <tr>
                    <td class="td-results td-results-border-right" style="padding-left: 45px;">(-) Deduções regulamentares (DDR)²</td>
                    <td class="td-results">${data.deducoesRegulamentares}</td>
                </tr>
                <tr>
                    <td class="td-results td-results-border-right" style="font-weight: bold;">Receita Líquida de Contribuição Compulsória (RLCC)²</td>
                    <td class="td-results">${data.receitaLiquidaContribuicaoCompulsoria}</td>
                </tr>
                <tr>
                    <td class="td-results td-results-border-right" style="font-weight: bold;">Compromisso da aplicação da RLCC em Educação Básica e Continuada³</td>
                    <td class="td-results">${data.compromissoEducacaoBasicaContinuada}</td>
                </tr>
                <tr>
                    <td class="td-results td-results-border-right" style="font-weight: bold;">Compromisso da aplicação da RLCC em Gratuidade Regulamentar⁴</td>
                    <td class="td-results">${data.compromissoGratuidadeRegulamentar}</td>
                </tr>
                <tr>
                    <td class="td-results-resultado-gratuidade" style="font-weight: bold;">Despesas</td>
                </tr>
                <tr>
                    <td class="td-results td-results-border-right" style="padding-left: 45px;">em Educação Básica e Continuada²</td>
                    <td class="td-results">${data.desepesaBasicaContinuada}</td>
                </tr>
                <tr>
                    <td class="td-results td-results-border-right" style="padding-left: 45px;">em Gratuidade Regulamentar²</td>
                    <td class="td-results">${data.desepesaGratuidadeRegulamentar}</td>
                </tr>
                <tr>
                    <td class="td-results-resultado-gratuidade" style="font-weight: bold;">Hora-aluno</td>
                </tr>
                <tr>
                    <td class="td-results td-results-border-right" style="padding-left: 45px;">em Educação Básica e Continuada⁵²</td>
                    <td class="td-results">${data.horaAlunoEducacaoBasicaContinuada}</td>
                </tr>
                <tr>
                    <td class="td-results td-results-border-right" style="padding-left: 45px;">em Gratuidade Regulamentar²</td>
                    <td class="td-results">${data.horaAlunoGratuidadeRegulamentar}</td>
                </tr>
                <tr>
                    <td class="td-results td-results-border-right" style="font-weight: bold;">Resultado do Cumprimento da Aplicação da RLCC em Educação Básica e Continuada⁶</td>
                    <td class="td-results">${data.cumprimentoAplicacaoEducacaoBasicaContinuada}</td>
                </tr>
                <tr>
                    <td class="td-results td-results-border-right" style="font-weight: bold;">Percentual da RLCC aplicada em Educação Básica e Continuada</td>
                    <td class="td-results">${data.percentualEducacaoBasicaContinuada}</td>
                </tr>
                <tr>
                    <td class="td-results td-results-border-right" style="font-weight: bold;">Resultado do Cumprimento da Aplicação da RLCC em Gratuidade Regulamentar⁷</td>
                    <td class="td-results">${data.cumprimentoAplicacaoGratuidadeRegulamentar}</td>
                </tr>
                <tr>
                    <td class="td-results td-results-border-right" style="font-weight: bold;">Percentual da RLCC aplicada em Gratuidade Regulamentar</td>
                    <td class="td-results">${data.percentualAplicacaoGratuidadeRegulamentar}%</td>
                </tr>
            `;

            $('#tbody-resultado-gratuidade').html(tableContent);
        },
        error: function (xhr, status, error) {
            console.error("Erro ao buscar dados da API: ", error);
        }
    });

});

