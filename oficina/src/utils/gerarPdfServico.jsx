import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function formatarData(data) {
    if (!data) return new Date().toLocaleDateString("pt-BR");
    return new Date(data).toLocaleDateString("pt-BR");
}

function calcularTotalPecasVenda(servico) {
    return (servico.pecas || []).reduce(
        (total, peca) => total + Number(peca.precoVenda || 0),
        0
    );
}

function calcularTotalPecasCusto(servico) {
    return (servico.pecas || []).reduce(
        (total, peca) => total + Number(peca.precoCusto || 0),
        0
    );
}

function modeloBase(titulo, conteudo) {
    return `
        <html>
            <head>
                <meta charset="utf-8" />

                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 30px;
                        color: #222;
                    }

                    .cabecalho {
                        background-color: #0f5132;
                        color: white;
                        padding: 22px;
                        border-radius: 12px;
                        text-align: center;
                    }

                    .empresa {
                        font-size: 28px;
                        font-weight: bold;
                    }

                    .titulo {
                        font-size: 20px;
                        margin-top: 8px;
                    }

                    .box {
                        border: 1px solid #ddd;
                        border-radius: 10px;
                        padding: 14px;
                        margin-top: 18px;
                    }

                    .linha {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 8px;
                    }

                    .label {
                        font-weight: bold;
                        color: #0f5132;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 18px;
                    }

                    th {
                        background-color: #0f5132;
                        color: white;
                        padding: 10px;
                        text-align: left;
                    }

                    td {
                        border: 1px solid #ddd;
                        padding: 10px;
                    }

                    .total {
                        background-color: #0f5132;
                        color: white;
                        padding: 16px;
                        text-align: right;
                        font-size: 22px;
                        font-weight: bold;
                        margin-top: 20px;
                        border-radius: 10px;
                    }

                    .alerta {
                        background-color: #fff3cd;
                        padding: 12px;
                        border-radius: 8px;
                        margin-top: 15px;
                        color: #664d03;
                        font-size: 14px;
                    }
                </style>
            </head>

            <body>
                <div class="cabecalho">
                    <div class="empresa">MECÂNICA SABINO</div>
                    <div class="titulo">${titulo}</div>
                </div>

                ${conteudo}
            </body>
        </html>
    `;
}

async function compartilharHtml(html) {
    const arquivo = await Print.printToFileAsync({
        html,
        base64: false,
    });

    await Sharing.shareAsync(arquivo.uri);
}

export async function gerarPdfCliente(servico) {
    const totalPecas = calcularTotalPecasVenda(servico);
    const totalGeral =
        Number(servico.valorTotal || servico.valor || 0) ||
        totalPecas + Number(servico.valorMaoObra || 0);

    const pecasHtml =
        servico.pecas && servico.pecas.length > 0
            ? servico.pecas
                  .map(
                      (peca) => `
                        <tr>
                            <td>${peca.nome || ""}</td>
                            <td>${formatarMoeda(peca.precoVenda)}</td>
                        </tr>
                    `
                  )
                  .join("")
            : `
                <tr>
                    <td>Nenhuma peça cadastrada</td>
                    <td>${formatarMoeda(0)}</td>
                </tr>
            `;

    const conteudo = `
        <div class="box">
            <div class="linha">
                <span><span class="label">Cliente:</span> ${
                    servico.cliente?.nome || "Não informado"
                }</span>
                <span><span class="label">Data:</span> ${formatarData(
                    servico.dataFim || servico.dataInicio
                )}</span>
            </div>

            <div class="linha">
                <span><span class="label">Veículo:</span> ${
                    servico.veiculo?.marca || ""
                } ${servico.veiculo?.modelo || ""}</span>
                <span><span class="label">Placa:</span> ${
                    servico.veiculo?.placa || "Não informada"
                }</span>
            </div>
        </div>

        <div class="box">
            <span class="label">Descrição:</span>
            <p>${servico.descricao || "Sem descrição informada."}</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Peça / Serviço</th>
                    <th>Valor cobrado</th>
                </tr>
            </thead>

            <tbody>
                ${pecasHtml}

                <tr>
                    <td><strong>Total das peças</strong></td>
                    <td><strong>${formatarMoeda(totalPecas)}</strong></td>
                </tr>

                <tr>
                    <td><strong>Mão de obra</strong></td>
                    <td><strong>${formatarMoeda(servico.valorMaoObra)}</strong></td>
                </tr>
            </tbody>
        </table>

        <div class="total">
            Total para o cliente: ${formatarMoeda(totalGeral)}
        </div>
    `;

    await compartilharHtml(modeloBase("Orçamento / Fechamento para Cliente", conteudo));
}

export async function gerarPdfInterno(servico) {
    const totalCusto = calcularTotalPecasCusto(servico);
    const totalVendaPecas = calcularTotalPecasVenda(servico);
    const maoObra = Number(servico.valorMaoObra || 0);

    const totalFaturado =
        Number(servico.valorTotal || servico.valor || 0) ||
        totalVendaPecas + maoObra;

    const lucroPecas = totalVendaPecas - totalCusto;
    const lucroTotal = totalFaturado - totalCusto;

    const pecasHtml =
        servico.pecas && servico.pecas.length > 0
            ? servico.pecas
                  .map((peca) => {
                      const custo = Number(peca.precoCusto || 0);
                      const venda = Number(peca.precoVenda || 0);
                      const lucro = venda - custo;

                      return `
                        <tr>
                            <td>${peca.nome || ""}</td>
                            <td>${formatarMoeda(custo)}</td>
                            <td>${formatarMoeda(venda)}</td>
                            <td>${formatarMoeda(lucro)}</td>
                        </tr>
                    `;
                  })
                  .join("")
            : `
                <tr>
                    <td>Nenhuma peça cadastrada</td>
                    <td>${formatarMoeda(0)}</td>
                    <td>${formatarMoeda(0)}</td>
                    <td>${formatarMoeda(0)}</td>
                </tr>
            `;

    const conteudo = `
        <div class="alerta">
            Documento interno da oficina. Não enviar para o cliente.
        </div>

        <div class="box">
            <div class="linha">
                <span><span class="label">Cliente:</span> ${
                    servico.cliente?.nome || "Não informado"
                }</span>
                <span><span class="label">Data:</span> ${formatarData(
                    servico.dataFim || servico.dataInicio
                )}</span>
            </div>

            <div class="linha">
                <span><span class="label">Veículo:</span> ${
                    servico.veiculo?.marca || ""
                } ${servico.veiculo?.modelo || ""}</span>
                <span><span class="label">Placa:</span> ${
                    servico.veiculo?.placa || "Não informada"
                }</span>
            </div>
        </div>

        <div class="box">
            <span class="label">Descrição:</span>
            <p>${servico.descricao || "Sem descrição informada."}</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Peça</th>
                    <th>Custo oficina</th>
                    <th>Valor cobrado</th>
                    <th>Lucro</th>
                </tr>
            </thead>

            <tbody>
                ${pecasHtml}
            </tbody>
        </table>

        <table>
            <tbody>
                <tr>
                    <td><strong>Total gasto em peças</strong></td>
                    <td>${formatarMoeda(totalCusto)}</td>
                </tr>

                <tr>
                    <td><strong>Total cobrado em peças</strong></td>
                    <td>${formatarMoeda(totalVendaPecas)}</td>
                </tr>

                <tr>
                    <td><strong>Lucro nas peças</strong></td>
                    <td>${formatarMoeda(lucroPecas)}</td>
                </tr>

                <tr>
                    <td><strong>Mão de obra</strong></td>
                    <td>${formatarMoeda(maoObra)}</td>
                </tr>

                <tr>
                    <td><strong>Total faturado</strong></td>
                    <td>${formatarMoeda(totalFaturado)}</td>
                </tr>

                <tr>
                    <td><strong>Lucro total estimado</strong></td>
                    <td>${formatarMoeda(lucroTotal)}</td>
                </tr>
            </tbody>
        </table>

        <div class="total">
            Lucro total: ${formatarMoeda(lucroTotal)}
        </div>
    `;

    await compartilharHtml(modeloBase("Relatório Interno da Oficina", conteudo));
}