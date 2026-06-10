import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Card, Button, Divider } from "react-native-paper";
import { apiOficina } from "../api/api";
export default function HistoricoScreen({ navigation }) {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarHistorico();
  }, []);

  async function carregarHistorico() {
    try {
      setCarregando(true);

      const resposta = await apiOficina.get("/servicos");

      const finalizados = resposta.data.filter(
        (servico) => servico.status === "SERVICO_FINALIZADO"
      );

      setServicos(finalizados);
    } catch (erro) {
      console.log("Erro ao carregar histórico:", erro);
    } finally {
      setCarregando(false);
    }
  }

  const servicosFiltrados = servicos.filter((servico) => {
    const texto = busca.toLowerCase();

    return (
      servico.cliente?.nome?.toLowerCase().includes(texto) ||
      servico.cliente?.cpf?.toLowerCase().includes(texto) ||
      servico.veiculo?.placa?.toLowerCase().includes(texto) ||
      servico.veiculo?.modelo?.toLowerCase().includes(texto)
    );
  });

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarData(data) {
    if (!data) return "Sem data";

    return new Date(data).toLocaleDateString("pt-BR");
  }

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0f7b3f" />
        <Text style={styles.loadingText}>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Histórico de Serviços</Text>

      <TextInput
        style={styles.inputBusca}
        placeholder="Pesquisar por cliente, CPF, placa ou veículo..."
        value={busca}
        onChangeText={setBusca}
      />

      {servicosFiltrados.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioTexto}>
            Nenhum serviço finalizado encontrado.
          </Text>
        </View>
      ) : (
        servicosFiltrados.map((servico) => (
          <Card key={servico.id} style={styles.card}>
            <Card.Content>
              <View style={styles.topoCard}>
                <View>
                  <Text style={styles.nomeCliente}>
                    {servico.cliente?.nome || "Cliente não informado"}
                  </Text>

                  <Text style={styles.info}>
                    {servico.veiculo?.modelo || "Veículo não informado"} -{" "}
                    {servico.veiculo?.placa || "Sem placa"}
                  </Text>
                </View>

                <View style={styles.statusBox}>
                  <Text style={styles.statusTexto}>Finalizado</Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              <Text style={styles.label}>Descrição:</Text>
              <Text style={styles.descricao}>
                {servico.descricao || "Sem descrição"}
              </Text>

              <Text style={styles.info}>
                Data início: {formatarData(servico.dataInicio)}
              </Text>

              <Text style={styles.info}>
                Data fim: {formatarData(servico.dataFim)}
              </Text>

              <Text style={styles.total}>
                Total: {formatarMoeda(servico.valorTotal || servico.valor)}
              </Text>

              <Button
                mode="contained"
                style={styles.botaoDetalhes}
                buttonColor="#0f7b3f"
                onPress={() =>
                  navigation.navigate("DetalhesHistorico", {
                    servicoId: servico.id,
                  })
                }
              >
                Ver detalhes
              </Button>

              <Button
                mode="outlined"
                textColor="#0f7b3f"
                style={styles.botaoEditar}
                onPress={() =>
                  navigation.navigate("NovoOrcamento", {
                    orcamento: servico,
                    servicoId: servico.id,
                    modoEdicao: true,
                    origem: "historico",
                  })
                }
              >
                Editar
              </Button>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 16,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f7b3f",
    marginBottom: 16,
    textAlign: "center",
  },

  inputBusca: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  card: {
    marginBottom: 14,
    borderRadius: 14,
    backgroundColor: "#fff",
    elevation: 3,
  },

  topoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },

  nomeCliente: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },

  info: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },

  statusBox: {
    backgroundColor: "#d8f3dc",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusTexto: {
    color: "#0f7b3f",
    fontWeight: "bold",
    fontSize: 12,
  },

  divider: {
    marginVertical: 12,
  },

  label: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },

  descricao: {
    color: "#555",
    marginBottom: 8,
  },

  total: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "bold",
    color: "#0f7b3f",
  },

  botaoDetalhes: {
    marginTop: 12,
    borderRadius: 10,
  },

  vazio: {
    marginTop: 40,
    alignItems: "center",
  },

  vazioTexto: {
    color: "#777",
    fontSize: 16,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },

  loadingText: {
    marginTop: 10,
    color: "#555",
  },

  botaoEditar: {
    marginTop: 8,
    borderRadius: 10,
    borderColor: "#0f7b3f",
  },
});