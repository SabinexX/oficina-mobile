import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    Text,
    TextInput,
    Button,
    Card,
    SegmentedButtons,
    Divider,
} from "react-native-paper";

export default function NovoOrcamentoScreen() {
    const [cliente, setCliente] = useState("");
    const [carro, setCarro] = useState("");
    const [placa, setPlaca] = useState("");
    const [descricao, setDescricao] = useState("");
    const [maoObra, setMaoObra] = useState("");

    const [nomePeca, setNomePeca] = useState("");
    const [precoCusto, setPrecoCusto] = useState("");
    const [tipoAcrescimo, setTipoAcrescimo] = useState("porcentagem");
    const [acrescimo, setAcrescimo] = useState("");

    const [pecas, setPecas] = useState([]);

    // FORMATA O VALOR DIGITADO PARA R$ 0,00
    function formatarInputMoeda(texto) {
        const apenasNumeros = texto.replace(/\D/g, "");
        const numero = Number(apenasNumeros) / 100;

        return numero.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    // CONVERTE R$ 250,00 PARA 250
    function converterMoedaParaNumero(valor) {
        const apenasNumeros = valor.replace(/\D/g, "");
        return Number(apenasNumeros) / 100 || 0;
    }

    // CONVERTE PORCENTAGEM NORMAL
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
            alert("Preencha o nome da peça e o preço de custo.");
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
    }

    function removerPeca(id) {
        const listaAtualizada = pecas.filter((peca) => peca.id !== id);
        setPecas(listaAtualizada);
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
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    return (
        <ScrollView style={styles.container}>
            <Text variant="headlineMedium" style={styles.titulo}>
                Novo Orçamento
            </Text>

            {/* DADOS DO CLIENTE */}
            <Card style={styles.card}>
                <Card.Content>

                    <Text variant="titleLarge" style={styles.subtitulo}>
                        Dados do cliente
                    </Text>

                    <TextInput
                        label="Nome do cliente"
                        value={cliente}
                        onChangeText={setCliente}
                        mode="outlined"
                        style={styles.input}
                    />

                    <TextInput
                        label="Carro"
                        value={carro}
                        onChangeText={setCarro}
                        mode="outlined"
                        style={styles.input}
                    />

                    <TextInput
                        label="Placa"
                        value={placa}
                        onChangeText={setPlaca}
                        mode="outlined"
                        style={styles.input}
                        autoCapitalize="characters"
                    />

                </Card.Content>
            </Card>

            {/* ADICIONAR PEÇA */}
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

                    <Text style={styles.label}>
                        Tipo de acréscimo
                    </Text>

                    <SegmentedButtons
                        value={tipoAcrescimo}
                        onValueChange={setTipoAcrescimo}
                        buttons={[
                            {
                                value: "porcentagem",
                                label: "%",
                            },
                            {
                                value: "valor",
                                label: "R$",
                            },
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

            {/* PEÇAS ADICIONADAS */}
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

                                <Text style={styles.nomePeca}>
                                    {peca.nome}
                                </Text>

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

            {/* SERVIÇO */}
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
                        label="Descrição opcional"
                        value={descricao}
                        onChangeText={setDescricao}
                        mode="outlined"
                        multiline
                        numberOfLines={4}
                        style={styles.input}
                    />

                </Card.Content>
            </Card>

            {/* RESUMO */}
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

            {/* BOTÕES PDF */}
            <Button
                mode="contained"
                style={styles.botaoPdfCliente}
            >
                Gerar PDF Cliente
            </Button>

            <Button
                mode="contained"
                style={styles.botaoPdfInterno}
            >
                Gerar PDF Interno
            </Button>

        </ScrollView>
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
            color: "#333",
            fontWeight: "bold",
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