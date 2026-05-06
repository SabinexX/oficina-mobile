import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Text,
  Card,
  Button,
  Chip,
  Divider,
  TouchableRipple,
} from "react-native-paper";

export default function OrcamentosScreen() {
  const [orcamentos, setOrcamentos] = useState([
    {
      id: "1",
      cliente: "Qualita",
      carro: "Fiat Punto",
      placa: "MFB3J28",
      valor: 450,
      status: "Pendente",
      data: "06/05/2026",
    },
    {
      id: "2",
      cliente: "Luiz",
      carro: "Sandero",
      placa: "JSO7F28",
      valor: 1280,
      status: "Aprovado",
      data: "06/05/2026",
    },
  ]);

  function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function alterarStatus(id, novoStatus) {
    const listaAtualizada = orcamentos.map((orcamento) =>
      orcamento.id === id
        ? { ...orcamento, status: novoStatus }
        : orcamento
    );

    setOrcamentos(listaAtualizada);
  }

  function removerOrcamento(id) {
    const listaAtualizada = orcamentos.filter(
      (orcamento) => orcamento.id !== id
    );

    setOrcamentos(listaAtualizada);
  }

  function corStatus(status) {
    if (status === "Pendente") return styles.chipPendente;
    if (status === "Aprovado") return styles.chipAprovado;
    return styles.chipFinalizado;
  }

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.titulo}>
        Orçamentos
      </Text>

      <Text style={styles.subTexto}>
        Controle os orçamentos pendentes, aprovados e finalizados.
      </Text>

      {orcamentos.length === 0 ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.textoVazio}>
              Nenhum orçamento cadastrado.
            </Text>
          </Card.Content>
        </Card>
      ) : (
        orcamentos.map((orcamento) => (
          <TouchableRipple
            key={orcamento.id}
            rippleColor="rgba(0,0,0,0.08)"
            style={styles.ripple}
          >
            <Card style={styles.cardOrcamento} mode="elevated">
              <Card.Content>
                <View style={styles.topoCard}>
                  <Text style={styles.nomeCliente}>
                    {orcamento.cliente}
                  </Text>

                  <Chip
                    style={corStatus(orcamento.status)}
                    textStyle={styles.chipTexto}
                  >
                    {orcamento.status}
                  </Chip>
                </View>

                <Text style={styles.info}>🚗 Carro: {orcamento.carro}</Text>
                <Text style={styles.info}>🔖 Placa: {orcamento.placa}</Text>
                <Text style={styles.info}>📅 Data: {orcamento.data}</Text>

                <Divider style={styles.divider} />

                <Text style={styles.valor}>
                  Valor total: {formatarMoeda(orcamento.valor)}
                </Text>

                <Text style={styles.statusTitulo}>
                  Alterar status
                </Text>

                <View style={styles.areaStatus}>
                  <Button
                    mode={
                      orcamento.status === "Pendente"
                        ? "contained"
                        : "outlined"
                    }
                    style={styles.botaoStatus}
                    onPress={() =>
                      alterarStatus(orcamento.id, "Pendente")
                    }
                  >
                    Pendente
                  </Button>

                  <Button
                    mode={
                      orcamento.status === "Aprovado"
                        ? "contained"
                        : "outlined"
                    }
                    style={styles.botaoStatus}
                    onPress={() =>
                      alterarStatus(orcamento.id, "Aprovado")
                    }
                  >
                    Aprovado
                  </Button>

                  <Button
                    mode={
                      orcamento.status === "Finalizado"
                        ? "contained"
                        : "outlined"
                    }
                    style={styles.botaoStatus}
                    onPress={() =>
                      alterarStatus(orcamento.id, "Finalizado")
                    }
                  >
                    Finalizado
                  </Button>
                </View>

                <Button
                  mode="outlined"
                  textColor="#b00020"
                  style={styles.botaoRemover}
                  onPress={() => removerOrcamento(orcamento.id)}
                >
                  Remover
                </Button>
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
  },

  nomeCliente: {
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

  chipFinalizado: {
    backgroundColor: "#212529",
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

  statusTitulo: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },

  areaStatus: {
    gap: 8,
  },

  botaoStatus: {
    borderRadius: 12,
  },

  botaoRemover: {
    marginTop: 12,
    borderColor: "#b00020",
    borderRadius: 12,
  },

  textoVazio: {
    color: "#777",
  },
});