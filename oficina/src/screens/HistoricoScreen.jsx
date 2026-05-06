import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Text,
  Card,
  Button,
  Divider,
  Chip,
  TouchableRipple,
} from "react-native-paper";

export default function HistoricoScreen() {

  // DADOS EXEMPLO
  const [historico, setHistorico] = useState([
    {
      id: "1",
      cliente: "Qualita",
      carro: "Fiat Punto",
      placa: "MFB3J28",
      valor: 850,
      lucro: 320,
      status: "Finalizado",
      data: "05/05/2026",
    },

    {
      id: "2",
      cliente: "Charles",
      carro: "Gol G5",
      placa: "MJD2789",
      valor: 420,
      lucro: 180,
      status: "Orçamento",
      data: "04/05/2026",
    },
  ]);

  function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function removerItem(id) {
    const listaAtualizada = historico.filter(
      (item) => item.id !== id
    );

    setHistorico(listaAtualizada);
  }

  return (
    <ScrollView style={styles.container}>

      <Text variant="headlineMedium" style={styles.titulo}>
        Histórico
      </Text>

      {historico.length === 0 ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.textoVazio}>
              Nenhum orçamento encontrado.
            </Text>
          </Card.Content>
        </Card>
      ) : (
        historico.map((item) => (
          <TouchableRipple
            key={item.id}
            rippleColor="rgba(0,0,0,0.08)"
            style={styles.ripple}
          >

            <Card style={styles.cardHistorico} mode="elevated">
              <Card.Content>

                <View style={styles.topoCard}>

                  <Text style={styles.nomeCliente}>
                    {item.cliente}
                  </Text>

                  <Chip
                    style={
                      item.status === "Finalizado"
                        ? styles.chipFinalizado
                        : styles.chipOrcamento
                    }
                    textStyle={styles.chipTexto}
                  >
                    {item.status}
                  </Chip>

                </View>

                <Text style={styles.info}>
                  🚗 {item.carro}
                </Text>

                <Text style={styles.info}>
                  🔖 {item.placa}
                </Text>

                <Text style={styles.info}>
                  📅 {item.data}
                </Text>

                <Divider style={styles.divider} />

                <Text style={styles.valor}>
                  Valor: {formatarMoeda(item.valor)}
                </Text>

                <Text style={styles.lucro}>
                  Lucro: {formatarMoeda(item.lucro)}
                </Text>

                <View style={styles.areaBotoes}>

                  <Button
                    mode="contained"
                    style={styles.botaoAbrir}
                  >
                    Abrir
                  </Button>

                  <Button
                    mode="contained"
                    style={styles.botaoPdf}
                  >
                    PDF
                  </Button>

                  <Button
                    mode="outlined"
                    textColor="#b00020"
                    style={styles.botaoExcluir}
                    onPress={() => removerItem(item.id)}
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
    marginBottom: 16,
    marginTop: 10,
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

  cardHistorico: {
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 5,
  },

  topoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  nomeCliente: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f5132",
  },

  chipFinalizado: {
    backgroundColor: "#198754",
  },

  chipOrcamento: {
    backgroundColor: "#ffc107",
  },

  chipTexto: {
    color: "#fff",
    fontWeight: "bold",
  },

  info: {
    color: "#444",
    marginBottom: 4,
    fontSize: 15,
  },

  divider: {
    marginVertical: 12,
  },

  valor: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f5132",
  },

  lucro: {
    fontSize: 17,
    color: "#198754",
    marginTop: 4,
    fontWeight: "bold",
  },

  areaBotoes: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  botaoAbrir: {
    flex: 1,
    backgroundColor: "#198754",
  },

  botaoPdf: {
    flex: 1,
    backgroundColor: "#0f5132",
  },

  botaoExcluir: {
    flex: 1,
    borderColor: "#b00020",
  },

  textoVazio: {
    color: "#777",
  },

});