import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
    Text,
    Card,
    Button,
    Chip,
    Divider,
    TouchableRipple,
} from "react-native-paper";

import { apiOficina } from "../api/api";
export default function OrcamentosScreen({ navigation }) {
    const [servicos, setServicos] = useState([]);

    useFocusEffect(
        useCallback(() => {
            carregarServicos();
        }, [])
    );

    async function carregarServicos() {
        try {
            const response = await apiOficina.get("/servicos");

            // Aqui remove da tela de Orçamentos tudo que já foi finalizado
            const listaSemFinalizados = response.data.filter(
                (item) => item.status !== "SERVICO_FINALIZADO"
            );

            setServicos(listaSemFinalizados);
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível carregar os orçamentos.");
        }
    }

    function formatarMoeda(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    function nomeStatus(status) {
        if (status === "ORCAMENTO_PENDENTE") return "Pendente";
        if (status === "ORCAMENTO_APROVADO") return "Aprovado";
        if (status === "SERVICO_EM_ANDAMENTO") return "Em andamento";
        if (status === "SERVICO_FINALIZADO") return "Finalizado";
        if (status === "CANCELADO") return "Cancelado";

        return status;
    }

    function corStatus(status) {
        if (status === "ORCAMENTO_PENDENTE") return styles.chipPendente;
        if (status === "ORCAMENTO_APROVADO") return styles.chipAprovado;
        if (status === "SERVICO_EM_ANDAMENTO") return styles.chipAndamento;
        if (status === "SERVICO_FINALIZADO") return styles.chipFinalizado;
        if (status === "CANCELADO") return styles.chipCancelado;

        return styles.chipFinalizado;
    }

    async function alterarStatus(id, novoStatus) {
        try {
            await apiOficina.put(`/servicos/${id}/status`, null, {
                params: {
                    status: novoStatus,
                },
            });

            if (novoStatus === "SERVICO_FINALIZADO") {
                setServicos((listaAtual) =>
                    listaAtual.filter((item) => item.id !== id)
                );

                Alert.alert(
                    "Sucesso",
                    "Serviço finalizado e enviado para o histórico!"
                );

                return;
            }

            carregarServicos();
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível alterar o status.");
        }
    }

    function confirmarCancelar(id) {
        Alert.alert(
            "Cancelar orçamento",
            "Tem certeza que deseja cancelar este orçamento?",
            [
                {
                    text: "Não",
                    style: "cancel",
                },
                {
                    text: "Sim, cancelar",
                    style: "destructive",
                    onPress: () => alterarStatus(id, "CANCELADO"),
                },
            ]
        );
    }

    function confirmarExcluir(id) {
        Alert.alert(
            "Excluir",
            "Tem certeza que deseja excluir definitivamente?",
            [
                {
                    text: "Não",
                    style: "cancel",
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => deletarServico(id),
                },
            ]
        );
    }

    async function deletarServico(id) {
        try {
            await apiOficina.delete(`/servicos/${id}`);
            carregarServicos();
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível excluir.");
        }
    }

    function editarOrcamento(item) {
        navigation.navigate("NovoOrcamento", {
            orcamento: item,
            servicoId: item.id,
            modoEdicao: true,
        });
    }

    return (
        <ScrollView style={styles.container}>
            <Text variant="headlineMedium" style={styles.titulo}>
                Orçamentos
            </Text>

            <Text style={styles.subTexto}>
                Controle os orçamentos pendentes, aprovados e serviços em andamento.
            </Text>

            {servicos.length === 0 ? (
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.textoVazio}>
                            Nenhum orçamento ou serviço em andamento cadastrado.
                        </Text>
                    </Card.Content>
                </Card>
            ) : (
                servicos.map((item) => (
                    <TouchableRipple
                        key={item.id}
                        rippleColor="rgba(0,0,0,0.08)"
                        style={styles.ripple}
                    >
                        <Card style={styles.cardOrcamento} mode="elevated">
                            <Card.Content>
                                <View style={styles.topoCard}>
                                    <Text style={styles.nomeCliente}>
                                        {item.cliente?.nome || "Cliente não informado"}
                                    </Text>

                                    <Chip
                                        style={corStatus(item.status)}
                                        textStyle={styles.chipTexto}
                                    >
                                        {nomeStatus(item.status)}
                                    </Chip>
                                </View>

                                <Text style={styles.info}>
                                    🚗 Carro: {item.veiculo?.marca} {item.veiculo?.modelo}
                                </Text>

                                <Text style={styles.info}>
                                    🔖 Placa: {item.veiculo?.placa}
                                </Text>

                                <Text style={styles.info}>
                                    📝 Serviço: {item.descricao}
                                </Text>

                                <Text style={styles.info}>
                                    🔧 Observação: {item.observacao}
                                </Text>

                                <Divider style={styles.divider} />

                                <Text style={styles.valor}>
                                    Valor total: {formatarMoeda(item.valorTotal || item.valor)}
                                </Text>

                                <View style={styles.areaBotoes}>
                                    <Button
                                        mode="outlined"
                                        style={styles.botaoAcao}
                                        textColor="#0f5132"
                                        onPress={() => editarOrcamento(item)}
                                    >
                                        Editar
                                    </Button>

                                    {item.status === "ORCAMENTO_PENDENTE" && (
                                        <Button
                                            mode="contained"
                                            style={styles.botaoAprovar}
                                            onPress={() =>
                                                alterarStatus(item.id, "ORCAMENTO_APROVADO")
                                            }
                                        >
                                            Aprovar
                                        </Button>
                                    )}

                                    {item.status === "ORCAMENTO_APROVADO" && (
                                        <Button
                                            mode="contained"
                                            style={styles.botaoIniciar}
                                            onPress={() =>
                                                alterarStatus(item.id, "SERVICO_EM_ANDAMENTO")
                                            }
                                        >
                                            Iniciar serviço
                                        </Button>
                                    )}

                                    {item.status === "SERVICO_EM_ANDAMENTO" && (
                                        <Button
                                            mode="contained"
                                            style={styles.botaoFinalizar}
                                            onPress={() =>
                                                alterarStatus(item.id, "SERVICO_FINALIZADO")
                                            }
                                        >
                                            Finalizar
                                        </Button>
                                    )}

                                    {item.status !== "CANCELADO" && (
                                        <Button
                                            mode="outlined"
                                            textColor="#b00020"
                                            style={styles.botaoCancelar}
                                            onPress={() => confirmarCancelar(item.id)}
                                        >
                                            Cancelar
                                        </Button>
                                    )}

                                    <Button
                                        mode="outlined"
                                        textColor="#b00020"
                                        style={styles.botaoExcluir}
                                        onPress={() => confirmarExcluir(item.id)}
                                    >
                                        Excluir
                                    </Button>
                                </View>
                            </Card.Content>
                        </Card>
                    </TouchableRipple>
                ))
            )}
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
        marginTop: 10,
    },

    subTexto: {
        color: "#555",
        marginTop: 5,
        marginBottom: 16,
        fontSize: 15,
    },

    ripple: {
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 16,
    },

    card: {
        borderRadius: 18,
        backgroundColor: "#fff",
    },

    cardOrcamento: {
        borderRadius: 20,
        backgroundColor: "#fff",
        elevation: 5,
    },

    topoCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        gap: 10,
    },

    nomeCliente: {
        flex: 1,
        fontSize: 20,
        fontWeight: "bold",
        color: "#0f5132",
    },

    chipPendente: {
        backgroundColor: "#ffc107",
    },

    chipAprovado: {
        backgroundColor: "#198754",
    },

    chipAndamento: {
        backgroundColor: "#0d6efd",
    },

    chipFinalizado: {
        backgroundColor: "#212529",
    },

    chipCancelado: {
        backgroundColor: "#b00020",
    },

    chipTexto: {
        color: "#fff",
        fontWeight: "bold",
    },

    info: {
        color: "#444",
        marginBottom: 5,
        fontSize: 15,
    },

    divider: {
        marginVertical: 12,
    },

    valor: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0f5132",
        marginBottom: 14,
    },

    areaBotoes: {
        gap: 8,
    },

    botaoAcao: {
        borderRadius: 12,
        borderColor: "#0f5132",
    },

    botaoAprovar: {
        borderRadius: 12,
        backgroundColor: "#198754",
    },

    botaoIniciar: {
        borderRadius: 12,
        backgroundColor: "#0d6efd",
    },

    botaoFinalizar: {
        borderRadius: 12,
        backgroundColor: "#212529",
    },

    botaoCancelar: {
        borderRadius: 12,
        borderColor: "#b00020",
    },

    botaoExcluir: {
        borderRadius: 12,
        borderColor: "#b00020",
    },

    textoVazio: {
        color: "#777",
    },
});