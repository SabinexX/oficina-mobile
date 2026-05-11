import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
} from "react-native";
import {
    Text,
    TextInput,
    Button,
    Card,
    SegmentedButtons,
    Divider,
} from "react-native-paper";
import api from "../api/api";
import {
    gerarPdfCliente,
    gerarPdfInterno,
} from "../utils/gerarPdfServico";

export default function NovoOrcamentoScreen({ route, navigation }) {
    const orcamentoEdicao = route.params?.orcamento;
    const modoEdicao = route.params?.modoEdicao || false;

    const [clientes, setClientes] = useState([]);
    const [veiculos, setVeiculos] = useState([]);

    const [pesquisaCliente, setPesquisaCliente] = useState("");
    const [pesquisaPlaca, setPesquisaPlaca] = useState("");

    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);

    const [descricao, setDescricao] = useState("");
    const [maoObra, setMaoObra] = useState("");

    const [nomePeca, setNomePeca] = useState("");
    const [precoCusto, setPrecoCusto] = useState("");
    const [tipoAcrescimo, setTipoAcrescimo] = useState("porcentagem");
    const [acrescimo, setAcrescimo] = useState("");

    const [pecas, setPecas] = useState([]);

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        if (modoEdicao && orcamentoEdicao) {
            setClienteSelecionado(orcamentoEdicao.cliente);
            setVeiculoSelecionado(orcamentoEdicao.veiculo);

            setPesquisaCliente(orcamentoEdicao.cliente?.nome || "");
            setPesquisaPlaca(orcamentoEdicao.veiculo?.placa || "");

            setDescricao(orcamentoEdicao.descricao || "");

            if (orcamentoEdicao.pecas) {
                setPecas(orcamentoEdicao.pecas);
            }

            const valorFormatado = Number(
                orcamentoEdicao.valor || 0
            ).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            });

            setMaoObra(valorFormatado);
        }
    }, [modoEdicao, orcamentoEdicao]);

    async function carregarDados() {
        try {
            const clientesResponse = await api.get("/clientes");
            const veiculosResponse = await api.get("/veiculos");

            setClientes(clientesResponse.data);
            setVeiculos(veiculosResponse.data);
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível carregar clientes e veículos.");
        }
    }

    const clientesFiltrados = clientes.filter((cliente) => {
        const texto = pesquisaCliente.toLowerCase();

        return (
            cliente.nome?.toLowerCase().includes(texto) ||
            cliente.cpf?.includes(pesquisaCliente) ||
            cliente.telefone?.includes(pesquisaCliente)
        );
    });

    const veiculosDoCliente = veiculos.filter(
        (veiculo) => veiculo.cliente?.id === clienteSelecionado?.id
    );

    const veiculosFiltradosPorPlaca = veiculos.filter((veiculo) => {
        const placaDigitada = pesquisaPlaca.toUpperCase().replace(/\s/g, "");
        const placaBanco = veiculo.placa?.toUpperCase().replace(/\s/g, "");

        return placaDigitada.length > 0 && placaBanco?.startsWith(placaDigitada);
    });

    function selecionarCliente(cliente) {
        setClienteSelecionado(cliente);
        setPesquisaCliente(cliente.nome);
        setVeiculoSelecionado(null);
        setPesquisaPlaca("");

        Keyboard.dismiss();
    }

    function selecionarVeiculo(veiculo) {
        setVeiculoSelecionado(veiculo);
        setPesquisaPlaca(veiculo.placa || "");

        if (veiculo.cliente) {
            setClienteSelecionado(veiculo.cliente);
            setPesquisaCliente(veiculo.cliente.nome || "");
        }

        Keyboard.dismiss();
    }

    function buscarPorPlaca(texto) {
        setPesquisaPlaca(texto.toUpperCase());
        setVeiculoSelecionado(null);
    }

    function limparClienteSelecionado() {
        setClienteSelecionado(null);
        setVeiculoSelecionado(null);
        setPesquisaCliente("");
        setPesquisaPlaca("");
    }

    function formatarInputMoeda(texto) {
        const apenasNumeros = texto.replace(/\D/g, "");
        const numero = Number(apenasNumeros) / 100;

        return numero.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    function converterMoedaParaNumero(valor) {
        const apenasNumeros = valor.replace(/\D/g, "");
        return Number(apenasNumeros) / 100 || 0;
    }

    function converterPorcentagem(valor) {
        return Number(valor.replace(",", ".")) || 0;
    }

    function calcularValorVenda(custo, tipo, acrescimoValor) {
        if (tipo === "porcentagem") {
            return custo + (custo * acrescimoValor) / 100;
        }

        return custo + acrescimoValor;
    }

    function adicionarPeca() {
        const custo = converterMoedaParaNumero(precoCusto);

        const acrescimoNumero =
            tipoAcrescimo === "porcentagem"
                ? converterPorcentagem(acrescimo)
                : converterMoedaParaNumero(acrescimo);

        if (!nomePeca || custo <= 0) {
            Alert.alert("Atenção", "Preencha o nome da peça e o preço de custo.");
            return;
        }

        const valorVenda = calcularValorVenda(
            custo,
            tipoAcrescimo,
            acrescimoNumero
        );

        const novaPeca = {
            id: Date.now().toString(),
            nome: nomePeca,
            custo,
            tipoAcrescimo,
            acrescimo: acrescimoNumero,
            valorVenda,
            lucro: valorVenda - custo,
        };

        setPecas([...pecas, novaPeca]);

        setNomePeca("");
        setPrecoCusto("");
        setAcrescimo("");
        setTipoAcrescimo("porcentagem");

        Keyboard.dismiss();
    }

    function removerPeca(id) {
        setPecas(pecas.filter((peca) => peca.id !== id));
    }

    const totalCustoPecas = pecas.reduce((total, peca) => total + peca.custo, 0);

    const totalVendaPecas = pecas.reduce(
        (total, peca) => total + peca.valorVenda,
        0
    );

    const valorMaoObra = converterMoedaParaNumero(maoObra);

    const faturamentoTotal = totalVendaPecas + valorMaoObra;

    const lucroTotal = faturamentoTotal - totalCustoPecas;

    function formatarMoeda(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    function montarServicoParaPdf() {
        return {
            cliente: clienteSelecionado,
            veiculo: veiculoSelecionado,
            descricao: descricao,
            observacao: pecas.length > 0
                ? `Peças: ${pecas.map((peca) => peca.nome).join(", ")}`
                : "Sem peças adicionadas.",
            pecas: pecas.map((peca) => ({
                nome: peca.nome,
                precoCusto: peca.custo || peca.precoCusto || 0,
                precoVenda: peca.valorVenda || peca.precoVenda || 0,
            })),
            valorMaoObra: valorMaoObra,
            valorTotal: faturamentoTotal,
            dataInicio: new Date(),
        };
    }

    async function salvarOrcamento() {
        if (!clienteSelecionado) {
            Alert.alert("Atenção", "Selecione um cliente.");
            return;
        }

        if (!veiculoSelecionado) {
            Alert.alert("Atenção", "Selecione um veículo.");
            return;
        }

        if (!descricao) {
            Alert.alert("Atenção", "Digite uma descrição do serviço.");
            return;
        }

        try {
            const nomesPecas = pecas.map((peca) => peca.nome).join(", ");

            const servico = {
                descricao,
                observacao: nomesPecas
                    ? `Peças: ${nomesPecas}`
                    : "Sem peças adicionadas.",
                valor: faturamentoTotal,
                status: modoEdicao
                    ? orcamentoEdicao.status
                    : "ORCAMENTO_PENDENTE",
                cliente: {
                    id: clienteSelecionado.id,
                },
                veiculo: {
                    id: veiculoSelecionado.id,
                },
                pecas: pecas.map((peca) => ({
                    nome: peca.nome,
                    custo: peca.custo,
                    tipoAcrescimo: peca.tipoAcrescimo,
                    acrescimo: peca.acrescimo,
                    valorVenda: peca.valorVenda,
                    lucro: peca.lucro,
                })),
            };

            if (modoEdicao) {
                await api.put(`/servicos/${orcamentoEdicao.id}`, servico);

                Alert.alert("Sucesso", "Orçamento atualizado com sucesso.");
            } else {
                await api.post("/servicos", servico);

                Alert.alert("Sucesso", "Orçamento salvo como pendente.");
            }

            limparClienteSelecionado();
            setDescricao("");
            setMaoObra("");
            setPecas([]);

            Keyboard.dismiss();

            navigation.navigate("Orcamentos");
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível salvar o orçamento.");
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    style={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text variant="headlineMedium" style={styles.titulo}>
                        {modoEdicao ? "Editar Orçamento" : "Novo Orçamento"}
                    </Text>

                    <Card style={styles.card}>
                        <Card.Content>
                            <Text variant="titleLarge" style={styles.subtitulo}>
                                Cliente e veículo
                            </Text>

                            <TextInput
                                label="Pesquisar cliente por nome, CPF ou telefone"
                                value={pesquisaCliente}
                                onChangeText={(texto) => {
                                    setPesquisaCliente(texto);
                                    setClienteSelecionado(null);
                                    setVeiculoSelecionado(null);
                                }}
                                mode="outlined"
                                style={styles.input}
                            />

                            <TextInput
                                label="Pesquisar pela placa"
                                value={pesquisaPlaca}
                                onChangeText={buscarPorPlaca}
                                mode="outlined"
                                style={styles.input}
                                autoCapitalize="characters"
                            />

                            {!clienteSelecionado && pesquisaCliente.length > 0 && (
                                <View style={styles.listaClientes}>
                                    {clientesFiltrados.length === 0 ? (
                                        <Text style={styles.textoVazio}>
                                            Nenhum cliente encontrado.
                                        </Text>
                                    ) : (
                                        clientesFiltrados.map((cliente) => (
                                            <Button
                                                key={cliente.id}
                                                mode="outlined"
                                                onPress={() => selecionarCliente(cliente)}
                                                style={styles.botaoCliente}
                                            >
                                                {cliente.nome}
                                            </Button>
                                        ))
                                    )}
                                </View>
                            )}

                            {!veiculoSelecionado && pesquisaPlaca.length > 0 && (
                                <View style={styles.listaClientes}>
                                    {veiculosFiltradosPorPlaca.length === 0 ? (
                                        <Text style={styles.textoVazio}>
                                            Nenhum veículo encontrado com essa placa.
                                        </Text>
                                    ) : (
                                        veiculosFiltradosPorPlaca.map((veiculo) => (
                                            <Button
                                                key={veiculo.id}
                                                mode="outlined"
                                                onPress={() => selecionarVeiculo(veiculo)}
                                                style={styles.botaoVeiculo}
                                            >
                                                {veiculo.placa} - {veiculo.marca} {veiculo.modelo}
                                            </Button>
                                        ))
                                    )}
                                </View>
                            )}

                            {clienteSelecionado && (
                                <View style={styles.clienteSelecionadoBox}>
                                    <Text style={styles.clienteNome}>
                                        Cliente: {clienteSelecionado.nome}
                                    </Text>

                                    <Text style={styles.clienteInfo}>
                                        CPF: {clienteSelecionado.cpf}
                                    </Text>

                                    <Text style={styles.clienteInfo}>
                                        Telefone: {clienteSelecionado.telefone}
                                    </Text>

                                    <Button
                                        mode="outlined"
                                        onPress={limparClienteSelecionado}
                                        style={styles.botaoTrocarCliente}
                                    >
                                        Trocar cliente/veículo
                                    </Button>
                                </View>
                            )}

                            {clienteSelecionado && (
                                <>
                                    <Text style={styles.label}>
                                        Escolha o veículo desse cliente
                                    </Text>

                                    {veiculosDoCliente.length === 0 ? (
                                        <Text style={styles.textoVazio}>
                                            Esse cliente ainda não possui veículo cadastrado.
                                        </Text>
                                    ) : (
                                        veiculosDoCliente.map((veiculo) => (
                                            <Button
                                                key={veiculo.id}
                                                mode={
                                                    veiculoSelecionado?.id === veiculo.id
                                                        ? "contained"
                                                        : "outlined"
                                                }
                                                onPress={() => selecionarVeiculo(veiculo)}
                                                style={styles.botaoVeiculo}
                                            >
                                                {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                                            </Button>
                                        ))
                                    )}
                                </>
                            )}

                            <TextInput
                                label="Placa"
                                value={veiculoSelecionado?.placa || ""}
                                mode="outlined"
                                style={styles.input}
                                editable={false}
                            />

                            <TextInput
                                label="Carro selecionado"
                                value={
                                    veiculoSelecionado
                                        ? `${veiculoSelecionado.marca} ${veiculoSelecionado.modelo}`
                                        : ""
                                }
                                mode="outlined"
                                style={styles.input}
                                editable={false}
                            />
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content>
                            <Text variant="titleLarge" style={styles.subtitulo}>
                                Adicionar peça
                            </Text>

                            <TextInput
                                label="Nome da peça"
                                value={nomePeca}
                                onChangeText={setNomePeca}
                                mode="outlined"
                                style={styles.input}
                            />

                            <TextInput
                                label="Preço que você pagou"
                                value={precoCusto}
                                onChangeText={(texto) =>
                                    setPrecoCusto(formatarInputMoeda(texto))
                                }
                                mode="outlined"
                                keyboardType="numeric"
                                style={styles.input}
                            />

                            <Text style={styles.label}>Tipo de acréscimo</Text>

                            <SegmentedButtons
                                value={tipoAcrescimo}
                                onValueChange={setTipoAcrescimo}
                                buttons={[
                                    { value: "porcentagem", label: "%" },
                                    { value: "valor", label: "R$" },
                                ]}
                                style={styles.segmented}
                            />

                            <TextInput
                                label={
                                    tipoAcrescimo === "porcentagem"
                                        ? "Porcentagem adicionada"
                                        : "Valor adicionado"
                                }
                                value={acrescimo}
                                onChangeText={(texto) => {
                                    if (tipoAcrescimo === "porcentagem") {
                                        setAcrescimo(texto);
                                    } else {
                                        setAcrescimo(formatarInputMoeda(texto));
                                    }
                                }}
                                mode="outlined"
                                keyboardType="numeric"
                                style={styles.input}
                            />

                            <Button
                                mode="contained"
                                onPress={adicionarPeca}
                                style={styles.botaoAdicionar}
                            >
                                Adicionar peça
                            </Button>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content>
                            <Text variant="titleLarge" style={styles.subtitulo}>
                                Peças adicionadas
                            </Text>

                            {pecas.length === 0 ? (
                                <Text style={styles.textoVazio}>
                                    Nenhuma peça adicionada.
                                </Text>
                            ) : (
                                pecas.map((peca) => (
                                    <View key={peca.id} style={styles.pecaItem}>
                                        <Text style={styles.nomePeca}>{peca.nome}</Text>

                                        <Text>
                                            Custo: {formatarMoeda(peca.custo)}
                                        </Text>

                                        <Text>
                                            Venda: {formatarMoeda(peca.valorVenda)}
                                        </Text>

                                        <Text>
                                            Lucro: {formatarMoeda(peca.lucro)}
                                        </Text>

                                        <Button
                                            mode="outlined"
                                            onPress={() => removerPeca(peca.id)}
                                            style={styles.botaoRemover}
                                        >
                                            Remover
                                        </Button>

                                        <Divider style={styles.divider} />
                                    </View>
                                ))
                            )}
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content>
                            <Text variant="titleLarge" style={styles.subtitulo}>
                                Serviço
                            </Text>

                            <TextInput
                                label="Mão de obra"
                                value={maoObra}
                                onChangeText={(texto) =>
                                    setMaoObra(formatarInputMoeda(texto))
                                }
                                mode="outlined"
                                keyboardType="numeric"
                                style={styles.input}
                            />

                            <TextInput
                                label="Descrição do serviço"
                                value={descricao}
                                onChangeText={setDescricao}
                                mode="outlined"
                                multiline
                                numberOfLines={4}
                                style={styles.input}
                            />
                        </Card.Content>
                    </Card>

                    <Card style={styles.resumoCard}>
                        <Card.Content>
                            <Text variant="titleLarge" style={styles.resumoTitulo}>
                                Resumo interno
                            </Text>

                            <Text style={styles.resumoLinha}>
                                Custo das peças: {formatarMoeda(totalCustoPecas)}
                            </Text>

                            <Text style={styles.resumoLinha}>
                                Venda das peças: {formatarMoeda(totalVendaPecas)}
                            </Text>

                            <Text style={styles.resumoLinha}>
                                Mão de obra: {formatarMoeda(valorMaoObra)}
                            </Text>

                            <Text style={styles.resumoLinha}>
                                Faturamento total: {formatarMoeda(faturamentoTotal)}
                            </Text>

                            <Text style={styles.lucro}>
                                Lucro estimado: {formatarMoeda(lucroTotal)}
                            </Text>
                        </Card.Content>
                    </Card>

                    <Button
                        mode="contained"
                        onPress={salvarOrcamento}
                        style={styles.botaoSalvar}
                    >
                        {modoEdicao ? "Salvar Alterações" : "Salvar Orçamento"}
                    </Button>

                    <Button
                        mode="contained"
                        style={styles.botaoPdfCliente}
                        onPress={() => gerarPdfCliente(montarServicoParaPdf())}
                    >
                        Gerar PDF Cliente
                    </Button>

                    <Button
                        mode="contained"
                        style={styles.botaoPdfInterno}
                        onPress={() => gerarPdfInterno(montarServicoParaPdf())}
                    >
                        Gerar PDF Interno
                    </Button>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#d8ccb3",
        padding: 16,
    },

    titulo: {
        color: "#0f5132",
        fontWeight: "bold",
        marginBottom: 16,
        marginTop: 10,
    },

    card: {
        marginBottom: 16,
        borderRadius: 18,
        backgroundColor: "#fff",
    },

    subtitulo: {
        color: "#0f5132",
        fontWeight: "bold",
        marginBottom: 12,
    },

    input: {
        marginBottom: 12,
        backgroundColor: "#fff",
    },

    label: {
        marginBottom: 8,
        marginTop: 8,
        color: "#333",
        fontWeight: "bold",
    },

    listaClientes: {
        marginBottom: 12,
    },

    botaoCliente: {
        marginBottom: 8,
        borderRadius: 10,
    },

    clienteSelecionadoBox: {
        backgroundColor: "#e9f5ee",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },

    clienteNome: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#0f5132",
        marginBottom: 4,
    },

    clienteInfo: {
        color: "#333",
        marginBottom: 2,
    },

    botaoTrocarCliente: {
        marginTop: 10,
        borderRadius: 10,
    },

    botaoVeiculo: {
        marginBottom: 8,
        borderRadius: 10,
    },

    segmented: {
        marginBottom: 12,
    },

    botaoAdicionar: {
        backgroundColor: "#198754",
        borderRadius: 12,
        paddingVertical: 5,
    },

    textoVazio: {
        color: "#777",
        marginBottom: 12,
    },

    pecaItem: {
        marginBottom: 12,
    },

    nomePeca: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#0f5132",
        marginBottom: 5,
    },

    botaoRemover: {
        marginTop: 8,
        borderColor: "#b00020",
    },

    divider: {
        marginTop: 12,
    },

    resumoCard: {
        marginBottom: 16,
        borderRadius: 18,
        backgroundColor: "#0f5132",
    },

    resumoTitulo: {
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 12,
    },

    resumoLinha: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 6,
    },

    lucro: {
        color: "#d1e7dd",
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10,
    },

    botaoSalvar: {
        backgroundColor: "#0f5132",
        borderRadius: 14,
        paddingVertical: 6,
        marginBottom: 12,
    },

    botaoPdfCliente: {
        backgroundColor: "#198754",
        borderRadius: 14,
        paddingVertical: 6,
        marginBottom: 12,
    },

    botaoPdfInterno: {
        backgroundColor: "#212529",
        borderRadius: 14,
        paddingVertical: 6,
        marginBottom: 40,
    },
});