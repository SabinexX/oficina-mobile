import React, { useCallback, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Text, Card, Chip, Button, Divider } from "react-native-paper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useFocusEffect } from "@react-navigation/native";

import { apiOficina } from "../api/api";;

const TopTab = createMaterialTopTabNavigator();

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
  return status;
}

function ListaServicos({ navigation, status, titulo, vazio }) {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarServicos();
    }, [])
  );

  async function carregarServicos() {
    try {
      setCarregando(true);
      const response = await apiOficina.get("/servicos");

      const filtrados = response.data
        .filter((item) => item.status === status)
        .sort((a, b) => {
          const dataA = new Date(a.dataInicio || a.createdAt || 0);
          const dataB = new Date(b.dataInicio || b.createdAt || 0);
          return dataB - dataA;
        });

      setServicos(filtrados);
    } catch (error) {
      console.log("Erro ao carregar serviços:", error);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView
      style={styles.listaContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={carregando} onRefresh={carregarServicos} />
      }
    >
      <View style={styles.headerLista}>
        <Text style={styles.tituloLista}>{titulo}</Text>

        <Button
          mode="contained"
          buttonColor="#0f5132"
          style={styles.botaoNovo}
          onPress={() => navigation.navigate("NovoOrcamento")}
        >
          Novo
        </Button>
      </View>

      {servicos.length === 0 ? (
        <Card style={styles.cardVazio}>
          <Card.Content>
            <Text style={styles.textoVazio}>{vazio}</Text>
          </Card.Content>
        </Card>
      ) : (
        servicos.map((item) => (
          <Card key={item.id} style={styles.cardServico}>
            <Card.Content>
              <View style={styles.topoCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.nomeCliente}>
                    {item.cliente?.nome || "Cliente não informado"}
                  </Text>

                  <Text style={styles.carroTexto}>
                    {item.veiculo?.marca} {item.veiculo?.modelo} -{" "}
                    {item.veiculo?.placa || "Sem placa"}
                  </Text>
                </View>

                <Chip style={styles.chip} textStyle={styles.chipTexto}>
                  {nomeStatus(item.status)}
                </Chip>
              </View>

              <Divider style={styles.divider} />

              <Text style={styles.descricao} numberOfLines={2}>
                {item.descricao || "Sem descrição"}
              </Text>

              <Text style={styles.valor}>
                Total: {formatarMoeda(item.valorTotal || item.valor)}
              </Text>

              <View style={styles.areaBotoes}>
                <TouchableOpacity
                  style={styles.botaoEditar}
                  onPress={() =>
                    navigation.navigate("NovoOrcamento", {
                      orcamento: item,
                      servicoId: item.id,
                      modoEdicao: true,
                    })
                  }
                >
                  <Text style={styles.textoEditar}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoAbrir}
                  onPress={() => navigation.navigate("OrcamentosLista")}
                >
                  <Text style={styles.textoAbrir}>Abrir lista</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

function PendentesScreen({ navigation }) {
  return (
    <ListaServicos
      navigation={navigation}
      status="ORCAMENTO_PENDENTE"
      titulo="Orçamentos pendentes"
      vazio="Nenhum orçamento pendente."
    />
  );
}

function AprovadosScreen({ navigation }) {
  return (
    <ListaServicos
      navigation={navigation}
      status="ORCAMENTO_APROVADO"
      titulo="Orçamentos aprovados"
      vazio="Nenhum orçamento aprovado."
    />
  );
}

function AndamentoScreen({ navigation }) {
  return (
    <ListaServicos
      navigation={navigation}
      status="SERVICO_EM_ANDAMENTO"
      titulo="Serviços em andamento"
      vazio="Nenhum serviço em andamento."
    />
  );
}

export default function OficinaScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Oficina</Text>
        <Text style={styles.subtitulo}>
          Arraste para o lado para trocar as etapas
        </Text>
      </View>

      <TopTab.Navigator
        screenOptions={{
          swipeEnabled: true,
          tabBarActiveTintColor: "#0f5132",
          tabBarInactiveTintColor: "#777",
          tabBarIndicatorStyle: {
            backgroundColor: "#0f5132",
            height: 3,
            borderRadius: 10,
          },
          tabBarStyle: {
            backgroundColor: "#d8ccb3",
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
            textTransform: "none",
          },
        }}
      >
        <TopTab.Screen name="Pendentes" component={PendentesScreen} />
        <TopTab.Screen name="Aprovados" component={AprovadosScreen} />
        <TopTab.Screen name="Andamento" component={AndamentoScreen} />
      </TopTab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d8ccb3",
  },

  header: {
    paddingTop: 42,
    paddingHorizontal: 18,
    paddingBottom: 12,
    backgroundColor: "#d8ccb3",
  },

  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0f3d2e",
  },

  subtitulo: {
    color: "#555",
    marginTop: 4,
  },

  listaContainer: {
    flex: 1,
    backgroundColor: "#d8ccb3",
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  headerLista: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  tituloLista: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f3d2e",
    flex: 1,
  },

  botaoNovo: {
    borderRadius: 12,
  },

  cardVazio: {
    borderRadius: 18,
    backgroundColor: "#fff",
  },

  textoVazio: {
    color: "#666",
    textAlign: "center",
  },

  cardServico: {
    borderRadius: 20,
    backgroundColor: "#fff",
    marginBottom: 14,
    elevation: 4,
  },

  topoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  nomeCliente: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f3d2e",
  },

  carroTexto: {
    color: "#555",
    marginTop: 4,
  },

  chip: {
    backgroundColor: "#e9f5ee",
  },

  chipTexto: {
    color: "#0f5132",
    fontWeight: "bold",
    fontSize: 11,
  },

  divider: {
    marginVertical: 12,
  },

  descricao: {
    color: "#444",
    lineHeight: 20,
  },

  valor: {
    color: "#0f5132",
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 10,
  },

  areaBotoes: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  botaoEditar: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#0f5132",
    padding: 11,
    borderRadius: 12,
    alignItems: "center",
  },

  textoEditar: {
    color: "#0f5132",
    fontWeight: "bold",
  },

  botaoAbrir: {
    flex: 1,
    backgroundColor: "#0f5132",
    padding: 11,
    borderRadius: 12,
    alignItems: "center",
  },

  textoAbrir: {
    color: "#fff",
    fontWeight: "bold",
  },
});