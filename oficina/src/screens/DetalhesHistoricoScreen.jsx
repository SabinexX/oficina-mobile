import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Card, Divider, Button } from "react-native-paper";
import { apiOficina } from "../api/api";
import { gerarPdfCliente, gerarPdfInterno } from "../utils/gerarPdfServico";

export default function DetalhesHistoricoScreen({ route, navigation }) {
  const { servicoId } = route.params;

  const [servico, setServico] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDetalhes();
  }, []);

  async function carregarDetalhes() {
    try {
      setCarregando(true);
      const resposta = await apiOficina.get(`/servicos/${servicoId}`);
      setServico(resposta.data);
    } catch (erro) {
      console.log("Erro ao carregar detalhes:", erro);
    } finally {
      setCarregando(false);
    }
  }

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function pegarCusto(peca) {
    return Number(peca.custo || peca.precoCusto || 0);
  }

  function pegarVenda(peca) {
    return Number(peca.valorVenda || peca.precoVenda || 0);
  }

  function calcularTotalPecas() {
    if (!servico?.pecas || servico.pecas.length === 0) return 0;

    return servico.pecas.reduce((total, peca) => {
      return total + pegarVenda(peca);
    }, 0);
  }

  function calcularTotalCustoPecas() {
    if (!servico?.pecas || servico.pecas.length === 0) return 0;

    return servico.pecas.reduce((total, peca) => {
      return total + pegarCusto(peca);
    }, 0);
  }

  function calcularLucroPecas() {
    return calcularTotalPecas() - calcularTotalCustoPecas();
  }

  function calcularTotalGeral() {
    return Number(servico?.valorTotal || servico?.valor || 0);
  }

  function calcularLucroTotal() {
    return calcularTotalGeral() - calcularTotalCustoPecas();
  }

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0f7b3f" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!servico) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Serviço não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Detalhes do Serviço</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subtitulo}>Cliente</Text>

          <Text style={styles.info}>
            Nome: {servico.cliente?.nome || "Não informado"}
          </Text>

          <Text style={styles.info}>
            CPF: {servico.cliente?.cpf || "Não informado"}
          </Text>

          <Text style={styles.info}>
            Telefone: {servico.cliente?.telefone || "Não informado"}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subtitulo}>Veículo</Text>

          <Text style={styles.info}>
            Modelo: {servico.veiculo?.modelo || "Não informado"}
          </Text>

          <Text style={styles.info}>
            Marca: {servico.veiculo?.marca || "Não informado"}
          </Text>

          <Text style={styles.info}>
            Placa: {servico.veiculo?.placa || "Não informado"}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subtitulo}>Resumo financeiro</Text>

          <Text style={styles.info}>
            Total gasto em peças: {formatarMoeda(calcularTotalCustoPecas())}
          </Text>

          <Text style={styles.info}>
            Total cobrado em peças: {formatarMoeda(calcularTotalPecas())}
          </Text>

          <Text style={styles.info}>
            Lucro nas peças: {formatarMoeda(calcularLucroPecas())}
          </Text>

          <Text style={styles.info}>
            Mão de obra: {formatarMoeda(servico.valorMaoObra || 0)}
          </Text>

          <Text style={styles.total}>
            Total geral: {formatarMoeda(calcularTotalGeral())}
          </Text>

          <Text style={styles.lucro}>
            Lucro total estimado: {formatarMoeda(calcularLucroTotal())}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subtitulo}>Serviço realizado</Text>

          <Text style={styles.descricao}>
            {servico.descricao || "Sem descrição"}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subtitulo}>Peças usadas</Text>

          {!servico.pecas || servico.pecas.length === 0 ? (
            <Text style={styles.info}>Nenhuma peça cadastrada.</Text>
          ) : (
            servico.pecas.map((peca, index) => (
              <View key={peca.id || index} style={styles.pecaBox}>
                <Text style={styles.nomePeca}>{peca.nome}</Text>

                <Text style={styles.info}>
                  Custo: {formatarMoeda(pegarCusto(peca))}
                </Text>

                <Text style={styles.info}>
                  Venda: {formatarMoeda(pegarVenda(peca))}
                </Text>

                <Text style={styles.lucro}>
                  Lucro: {formatarMoeda(pegarVenda(peca) - pegarCusto(peca))}
                </Text>
              </View>
            ))
          )}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        buttonColor="#0f7b3f"
        style={styles.botaoPdf}
        onPress={() => gerarPdfCliente(servico)}
      >
        Gerar PDF Cliente
      </Button>

      <Button
        mode="contained"
        buttonColor="#212529"
        style={styles.botaoPdf}
        onPress={() => gerarPdfInterno(servico)}
      >
        Gerar PDF Interno
      </Button>

      <Button
        mode="outlined"
        textColor="#0f7b3f"
        style={styles.botaoVoltar}
        onPress={() => navigation.goBack()}
      >
        Voltar
      </Button>
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
    textAlign: "center",
    marginBottom: 16,
  },

  botaoPdf: {
    borderRadius: 10,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 14,
    elevation: 3,
  },

  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f7b3f",
    marginBottom: 8,
  },

  info: {
    fontSize: 15,
    color: "#555",
    marginBottom: 5,
  },

  descricao: {
    fontSize: 15,
    color: "#444",
    marginBottom: 8,
  },

  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f7b3f",
    marginTop: 8,
  },

  pecaBox: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  nomePeca: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 5,
  },

  lucro: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0f7b3f",
    marginTop: 5,
  },

  botaoVoltar: {
    borderColor: "#0f7b3f",
    borderRadius: 10,
    marginBottom: 30,
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
});