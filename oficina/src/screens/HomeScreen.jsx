import React, { useCallback, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Text, Card, Divider } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import api from "../api/api";

export default function HomeScreen({ navigation, telaTemporaria, titulo, descricao }) {
  const [servicos, setServicos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const subirAnim = useRef(new Animated.Value(20)).current;

  useFocusEffect(
    useCallback(() => {
      carregarResumo();
      animarTela();
    }, [])
  );

  function animarTela() {
    fadeAnim.setValue(0);
    subirAnim.setValue(20);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(subirAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }

  async function carregarResumo() {
    try {
      setCarregando(true);

      const servicosResponse = await api.get("/servicos");
      const agendamentosResponse = await api.get("/agendamentos/proximos");

      setServicos(servicosResponse.data);
      setAgendamentos(agendamentosResponse.data.slice(0, 3));
    } catch (error) {
      console.log("Erro ao carregar resumo:", error);
    } finally {
      setCarregando(false);
    }
  }

  if (telaTemporaria) {
    return (
      <View style={styles.telaTemporaria}>
        <MaterialCommunityIcons name="package-variant-closed" size={56} color="#0f5132" />
        <Text style={styles.tituloTemporario}>{titulo}</Text>
        <Text style={styles.textoTemporario}>{descricao}</Text>
      </View>
    );
  }

  const pendentes = servicos.filter(
    (item) => item.status === "ORCAMENTO_PENDENTE"
  ).length;

  const aprovados = servicos.filter(
    (item) => item.status === "ORCAMENTO_APROVADO"
  ).length;

  const andamento = servicos.filter(
    (item) => item.status === "SERVICO_EM_ANDAMENTO"
  ).length;

  function avisoEmBreve(nome) {
    Alert.alert("Em breve", `${nome} será criado na próxima etapa.`);
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={carregando} onRefresh={carregarResumo} />
      }
    >
      <LinearGradient
        colors={["#0f5132", "#198754"]}
        style={styles.header}
      >
        <Text style={styles.saudacao}>Bom trabalho, Bruno 👊</Text>
        <Text style={styles.logo}>Mecânica Sabino</Text>
        <Text style={styles.subtitulo}>Painel do dia da oficina</Text>
      </LinearGradient>

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: subirAnim }],
        }}
      >
        <Card style={styles.resumoCard}>
          <Card.Content>
            <View style={styles.tituloLinha}>
              <Text style={styles.tituloSecao}>Resumo rápido</Text>
              <Text style={styles.atualizarTexto}>Puxe para atualizar</Text>
            </View>

            <View style={styles.resumoGrid}>
              <TouchableOpacity
                style={styles.resumoItem}
                onPress={() => navigation.navigate("Oficina")}
              >
                <MaterialCommunityIcons name="file-clock-outline" size={24} color="#0f5132" />
                <Text style={styles.resumoNumero}>{pendentes}</Text>
                <Text style={styles.resumoTexto}>Pendentes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resumoItem}
                onPress={() => navigation.navigate("Oficina")}
              >
                <MaterialCommunityIcons name="check-decagram-outline" size={24} color="#0f5132" />
                <Text style={styles.resumoNumero}>{aprovados}</Text>
                <Text style={styles.resumoTexto}>Aprovados</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resumoItem}
                onPress={() => navigation.navigate("Oficina")}
              >
                <MaterialCommunityIcons name="tools" size={24} color="#0f5132" />
                <Text style={styles.resumoNumero}>{andamento}</Text>
                <Text style={styles.resumoTexto}>Andamento</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.secao}>
          <Text style={styles.tituloSecaoFora}>Ações principais</Text>

          <View style={styles.acoesGrid}>
            <TouchableOpacity
              style={styles.acaoPrincipal}
              onPress={() =>
                navigation.navigate("Oficina", { screen: "NovoOrcamento" })
              }
            >
              <MaterialCommunityIcons name="plus-box-outline" size={32} color="#fff" />
              <Text style={styles.acaoTituloClaro}>Novo orçamento</Text>
              <Text style={styles.acaoSubClaro}>Criar OS completa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acaoCard}
              onPress={() =>
                navigation.navigate("Oficina", { screen: "Clientes" })
              }
            >
              <MaterialCommunityIcons name="account-plus-outline" size={32} color="#0f5132" />
              <Text style={styles.acaoTitulo}>Cliente</Text>
              <Text style={styles.acaoSub}>Cadastrar ou editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acaoCard}
              onPress={() =>
                navigation.navigate("Oficina", { screen: "Carros" })
              }
            >
              <MaterialCommunityIcons name="car-outline" size={32} color="#0f5132" />
              <Text style={styles.acaoTitulo}>Carro</Text>
              <Text style={styles.acaoSub}>Veículos cadastrados</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acaoEscura}
              onPress={() => navigation.navigate("IA Peças")}
            >
              <MaterialCommunityIcons name="robot-outline" size={32} color="#fff" />
              <Text style={styles.acaoTituloClaro}>IA Peças</Text>
              <Text style={styles.acaoSubClaro}>Pesquisar peças</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Card style={styles.agendaContainer}>
          <Card.Content>
            <View style={styles.agendaHeader}>
              <View>
                <Text style={styles.agendaTitulo}>Agendamentos próximos</Text>
                <Text style={styles.agendaSubtitulo}>
                  Clientes marcados para os próximos dias
                </Text>
              </View>

              <TouchableOpacity
                style={styles.agendaNovo}
                onPress={() => navigation.navigate("Agendamentos")}
              >
                <Text style={styles.agendaNovoTexto}>+ Novo</Text>
              </TouchableOpacity>
            </View>

            <Divider style={styles.divider} />

            {agendamentos.length === 0 ? (
              <View style={styles.agendamentoVazio}>
                <MaterialCommunityIcons name="calendar-clock" size={42} color="#0f5132" />

                <Text style={styles.agendamentoTitulo}>
                  Nenhum agendamento cadastrado
                </Text>

                <Text style={styles.agendamentoTexto}>
                  Aqui vão aparecer os próximos clientes, com botões para marcar se vieram ou não.
                </Text>

                <TouchableOpacity
                  style={styles.botaoVerTodos}
                  onPress={() => navigation.navigate("Agendamentos")}
                >
                  <Text style={styles.botaoVerTodosTexto}>Ver todos</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.listaAgendamentosHome}>
                {agendamentos.map((item) => (
                  <View key={item.id} style={styles.cardAgendamentoHome}>
                    <View style={styles.linhaAgendamentoHome}>
                      <MaterialCommunityIcons
                        name="calendar-clock"
                        size={24}
                        color="#0f5132"
                      />

                      <View style={{ flex: 1 }}>
                        <Text style={styles.agendamentoClienteHome}>
                          {item.cliente?.nome || "Cliente não informado"}
                        </Text>

                        <Text style={styles.agendamentoCarroHome}>
                          {item.veiculo?.marca} {item.veiculo?.modelo} -{" "}
                          {item.veiculo?.placa || "Sem placa"}
                        </Text>

                        <Text style={styles.agendamentoDataHome}>
                          {new Date(item.dataHora).toLocaleString("pt-BR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </Text>

                        <Text style={styles.agendamentoDescricaoHome} numberOfLines={2}>
                          {item.descricao}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.botaoVerTodos}
                  onPress={() => navigation.navigate("Agendamentos")}
                >
                  <Text style={styles.botaoVerTodosTexto}>Ver todos</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card.Content>
        </Card>

        <View style={styles.secao}>
          <Text style={styles.tituloSecaoFora}>Atalhos financeiros</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalLista}
          >
            <TouchableOpacity
              style={styles.cardHorizontal}
              onPress={() =>
                navigation.navigate("Financeiro", { screen: "HistoricoHome" })
              }
            >
              <MaterialCommunityIcons name="history" size={30} color="#0f5132" />
              <Text style={styles.horizontalTitulo}>Histórico</Text>
              <Text style={styles.horizontalTexto}>
                Serviços finalizados e PDFs
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cardHorizontal}
              onPress={() => avisoEmBreve("Dashboard financeiro")}
            >
              <MaterialCommunityIcons name="chart-line" size={30} color="#0f5132" />
              <Text style={styles.horizontalTitulo}>Dashboard</Text>
              <Text style={styles.horizontalTexto}>
                Visão geral da oficina
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cardHorizontal}
              onPress={() => avisoEmBreve("Lucro mensal")}
            >
              <MaterialCommunityIcons name="cash-multiple" size={30} color="#0f5132" />
              <Text style={styles.horizontalTitulo}>Lucro mensal</Text>
              <Text style={styles.horizontalTexto}>
                Faturamento e gastos
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d8ccb3",
  },

  header: {
    paddingTop: 44,
    paddingBottom: 84,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },

  saudacao: {
    color: "#d1e7dd",
    fontSize: 15,
    marginBottom: 6,
  },

  logo: {
    color: "#fff",
    fontSize: 31,
    fontWeight: "bold",
  },

  subtitulo: {
    color: "#d1e7dd",
    marginTop: 6,
    fontSize: 15,
  },

  resumoCard: {
    marginHorizontal: 16,
    marginTop: -54,
    borderRadius: 26,
    backgroundColor: "#ffffff",
    elevation: 7,
  },

  tituloLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tituloSecao: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#0f5132",
    marginBottom: 14,
  },

  atualizarTexto: {
    color: "#777",
    fontSize: 12,
    marginBottom: 14,
  },

  resumoGrid: {
    flexDirection: "row",
    gap: 10,
  },

  resumoItem: {
    flex: 1,
    backgroundColor: "#e9f5ee",
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
  },

  resumoNumero: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#0f5132",
    marginTop: 5,
  },

  resumoTexto: {
    fontSize: 12,
    color: "#333",
    marginTop: 3,
    textAlign: "center",
  },

  secao: {
    marginTop: 22,
    paddingHorizontal: 16,
  },

  tituloSecaoFora: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f3d2e",
    marginBottom: 12,
  },

  acoesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  acaoPrincipal: {
    width: "48%",
    backgroundColor: "#198754",
    borderRadius: 24,
    padding: 17,
    elevation: 5,
    minHeight: 135,
    justifyContent: "space-between",
  },

  acaoCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 17,
    elevation: 4,
    minHeight: 135,
    justifyContent: "space-between",
  },

  acaoEscura: {
    width: "48%",
    backgroundColor: "#212529",
    borderRadius: 24,
    padding: 17,
    elevation: 5,
    minHeight: 135,
    justifyContent: "space-between",
  },

  acaoTitulo: {
    color: "#0f3d2e",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 10,
  },

  acaoSub: {
    color: "#555",
    marginTop: 4,
    fontSize: 13,
  },

  acaoTituloClaro: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 10,
  },

  acaoSubClaro: {
    color: "#e9f5ee",
    marginTop: 4,
    fontSize: 13,
  },

  agendaContainer: {
    margin: 16,
    marginTop: 24,
    borderRadius: 28,
    backgroundColor: "#fff",
    elevation: 6,
  },

  agendaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  agendaTitulo: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#0f5132",
  },

  agendaSubtitulo: {
    color: "#555",
    marginTop: 4,
    maxWidth: 220,
  },

  agendaNovo: {
    backgroundColor: "#0f5132",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 15,
  },

  agendaNovoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },

  divider: {
    marginVertical: 16,
  },

  agendamentoVazio: {
    backgroundColor: "#f1f5f2",
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
  },

  agendamentoTitulo: {
    color: "#0f5132",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
    marginTop: 8,
  },

  agendamentoTexto: {
    color: "#555",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },

  botaoVerTodos: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#0f5132",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 15,
  },

  botaoVerTodosTexto: {
    color: "#0f5132",
    fontWeight: "bold",
  },

  horizontalLista: {
    paddingRight: 16,
    paddingBottom: 20,
  },

  cardHorizontal: {
    width: 170,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    marginRight: 12,
    elevation: 4,
    minHeight: 140,
  },

  horizontalTitulo: {
    color: "#0f3d2e",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 12,
  },

  horizontalTexto: {
    color: "#555",
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },

  telaTemporaria: {
    flex: 1,
    backgroundColor: "#d8ccb3",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  tituloTemporario: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0f5132",
    marginTop: 12,
  },

  textoTemporario: {
    color: "#555",
    textAlign: "center",
    marginTop: 8,
    fontSize: 16,
  },

  listaAgendamentosHome: {
    gap: 10,
  },

  cardAgendamentoHome: {
    backgroundColor: "#f1f5f2",
    borderRadius: 18,
    padding: 12,
  },

  linhaAgendamentoHome: {
    flexDirection: "row",
    gap: 10,
  },

  agendamentoClienteHome: {
    color: "#0f3d2e",
    fontWeight: "bold",
    fontSize: 16,
  },

  agendamentoCarroHome: {
    color: "#555",
    marginTop: 2,
  },

  agendamentoDataHome: {
    color: "#0f5132",
    fontWeight: "bold",
    marginTop: 4,
  },

  agendamentoDescricaoHome: {
    color: "#555",
    marginTop: 4,
    lineHeight: 18,
  },
});