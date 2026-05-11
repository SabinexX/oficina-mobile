import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    Text,
    Card,
    TouchableRipple,
    List,
    Divider,
} from "react-native-paper";

export default function HomeScreen({ navigation }) {
    const agenda = [
        {
            id: "1",
            cliente: "Qualita",
            data: "10/05/2026",
            horario: "08:30",
            descricao:
                "Trazer o Fiat Punto para troca dos selos, silicone e verificação do escape.",
        },
        {
            id: "2",
            cliente: "Luiz",
            data: "12/05/2026",
            horario: "14:00",
            descricao:
                "Trazer o Sandero para revisão da suspensão e conferência do motor.",
        },
        {
            id: "3",
            cliente: "Duda Machado",
            data: "15/05/2026",
            horario: "09:00",
            descricao:
                "Verificar óleo 5w40, filtro de óleo e solda do cano.",
        },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={styles.logo}>
                    MECÂNICA SABINO
                </Text>

                <Text variant="bodyLarge" style={styles.subtitulo}>
                    Gestão Inteligente da Oficina
                </Text>
            </View>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="headlineSmall" style={styles.tituloCard}>
                        Bem-vindo, Bruno 👋
                    </Text>

                    <Text style={styles.textoCard}>
                        Gerencie orçamentos, clientes e fechamentos da oficina.
                    </Text>
                </Card.Content>
            </Card>

            <View style={styles.areaBotoes}>
                <TouchableRipple
                    onPress={() => navigation.navigate("NovoOrcamento")}
                    rippleColor="rgba(255,255,255,0.25)"
                    style={styles.ripple}
                >
                    <Card style={styles.cardBotao} mode="elevated">
                        <Card.Content>
                            <Text style={styles.cardBotaoTitulo}>Novo Orçamento</Text>
                            <Text style={styles.cardBotaoTexto}>
                                Criar orçamento com peças e lucro
                            </Text>
                        </Card.Content>
                    </Card>
                </TouchableRipple>

                <TouchableRipple
                    onPress={() => navigation.navigate("BuscaPecasIA")}
                    rippleColor="rgba(255,255,255,0.25)"
                    style={styles.ripple}
                >
                    <Card style={styles.cardBotaoEscuro} mode="elevated">
                        <Card.Content>
                            <Text style={styles.cardBotaoTitulo}>Buscar Peças com IA</Text>
                            <Text style={styles.cardBotaoTexto}>
                                Consultar veículo pela placa e comparar peças
                            </Text>
                        </Card.Content>
                    </Card>
                </TouchableRipple>

                <TouchableRipple
                    onPress={() => navigation.navigate("Clientes")}
                    rippleColor="rgba(255,255,255,0.25)"
                    style={styles.ripple}
                >
                    <Card style={styles.cardBotao} mode="elevated">
                        <Card.Content>
                            <Text style={styles.cardBotaoTitulo}>Clientes</Text>
                            <Text style={styles.cardBotaoTexto}>
                                Cadastro e gerenciamento
                            </Text>
                        </Card.Content>
                    </Card>
                </TouchableRipple>

                <TouchableRipple
                    onPress={() => navigation.navigate("Carros")}
                    rippleColor="rgba(255,255,255,0.25)"
                    style={styles.ripple}
                >
                    <Card style={styles.cardBotaoEscuro} mode="elevated">
                        <Card.Content>
                            <Text style={styles.cardBotaoTitulo}>
                                Carros
                            </Text>

                            <Text style={styles.cardBotaoTexto}>
                                Cadastre os veículos dos clientes com foto
                            </Text>
                        </Card.Content>
                    </Card>
                </TouchableRipple>

                <TouchableRipple
                    onPress={() => navigation.navigate("Historico")}
                    rippleColor="rgba(255,255,255,0.25)"
                    style={styles.ripple}
                >
                    <Card style={styles.cardBotao} mode="elevated">
                        <Card.Content>
                            <Text style={styles.cardBotaoTitulo}>Histórico</Text>
                            <Text style={styles.cardBotaoTexto}>
                                Ver orçamentos e fechamentos
                            </Text>
                        </Card.Content>
                    </Card>
                </TouchableRipple>

                <TouchableRipple
                    onPress={() => navigation.navigate("Orcamentos")}
                    rippleColor="rgba(255,255,255,0.25)"
                    style={styles.ripple}
                >
                    <Card style={styles.cardBotaoEscuro} mode="elevated">
                        <Card.Content>
                            <Text style={styles.cardBotaoTitulo}>Orçamentos</Text>
                            <Text style={styles.cardBotaoTexto}>
                                Acompanhar pendentes, aprovados e finalizados
                            </Text>
                        </Card.Content>
                    </Card>
                </TouchableRipple>
            </View>

            <Card style={styles.cardAgenda}>
                <Card.Content>
                    <Text variant="titleLarge" style={styles.infoTitulo}>
                        Próximos agendamentos
                    </Text>

                    {agenda.map((item) => (
                        <View key={item.id}>
                            <List.Accordion
                                title={`${item.data} às ${item.horario}`}
                                description={item.cliente}
                                titleStyle={styles.agendaData}
                                descriptionStyle={styles.agendaCliente}
                                style={styles.agendaItem}
                            >
                                <Text style={styles.agendaDescricaoTexto}>
                                    {item.descricao}
                                </Text>
                            </List.Accordion>

                            <Divider />
                        </View>
                    ))}
                </Card.Content>
            </Card>

            <Card style={styles.cardInfo}>
                <Card.Content>
                    <Text variant="titleLarge" style={styles.infoTitulo}>
                        Resumo da Oficina
                    </Text>

                    <Text style={styles.infoTexto}>
                        Crie orçamentos com cálculo de custo, venda e lucro.
                    </Text>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#d8ccb3",
    },

    header: {
        backgroundColor: "#0f5132",
        padding: 28,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },

    logo: {
        color: "#fff",
        fontWeight: "bold",
    },

    subtitulo: {
        color: "#d1e7dd",
        marginTop: 6,
    },

    card: {
        margin: 20,
        borderRadius: 20,
        backgroundColor: "#fff",
    },

    tituloCard: {
        color: "#0f5132",
        fontWeight: "bold",
    },

    textoCard: {
        marginTop: 8,
        color: "#555",
        fontSize: 15,
    },

    areaBotoes: {
        paddingHorizontal: 20,
    },

    ripple: {
        marginBottom: 14,
        borderRadius: 18,
        overflow: "hidden",
    },

    cardBotao: {
        backgroundColor: "#198754",
        borderRadius: 18,
        elevation: 6,
    },

    cardBotaoEscuro: {
        backgroundColor: "#212529",
        borderRadius: 18,
        elevation: 6,
    },

    cardBotaoTitulo: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },

    cardBotaoTexto: {
        color: "#d1e7dd",
        marginTop: 4,
        fontSize: 14,
    },

    cardAgenda: {
        margin: 20,
        borderRadius: 20,
        backgroundColor: "#fff",
    },

    agendaItem: {
        backgroundColor: "#f1f5f2",
        borderRadius: 12,
        marginTop: 10,
    },

    agendaData: {
        color: "#0f5132",
        fontWeight: "bold",
    },

    agendaCliente: {
        color: "#555",
    },

    agendaDescricaoTexto: {
        backgroundColor: "#f8f9fa",
        padding: 14,
        color: "#444",
        lineHeight: 22,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },

    cardInfo: {
        margin: 20,
        marginBottom: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
    },

    infoTitulo: {
        color: "#0f5132",
        fontWeight: "bold",
    },

    infoTexto: {
        marginTop: 8,
        color: "#555",
    },
});