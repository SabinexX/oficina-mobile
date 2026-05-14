import React, { useCallback, useState } from "react";

import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Platform,
  Keyboard,
} from "react-native";

import {
  Text,
  Card,
  Divider,
  TextInput,
  Button,
} from "react-native-paper";

import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import api from "../api/api";

export default function AgendamentosScreen() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [veiculos, setVeiculos] = useState([]);

  const [pesquisaCliente, setPesquisaCliente] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);

  const [descricao, setDescricao] = useState("");
  const [dataHora, setDataHora] = useState(new Date());

  const [mostrarData, setMostrarData] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);

  const [carregando, setCarregando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarTudo();
    }, [])
  );

  async function carregarTudo() {
    try {
      setCarregando(true);

      const agendamentosResponse = await api.get("/agendamentos/proximos");
      const clientesResponse = await api.get("/clientes");
      const veiculosResponse = await api.get("/veiculos");

      setAgendamentos(agendamentosResponse.data);
      setClientes(clientesResponse.data);
      setVeiculos(veiculosResponse.data);
    } catch (error) {
      console.log("Erro ao carregar agendamentos:", error);
    } finally {
      setCarregando(false);
    }
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const texto = pesquisaCliente.toLowerCase();

    return (
      pesquisaCliente.length > 0 &&
      (cliente.nome?.toLowerCase().includes(texto) ||
        cliente.cpf?.toLowerCase().includes(texto) ||
        cliente.telefone?.toLowerCase().includes(texto))
    );
  });

  const veiculosDoCliente = veiculos.filter(
    (veiculo) => veiculo.cliente?.id === clienteSelecionado?.id
  );

  function selecionarCliente(cliente) {
    setClienteSelecionado(cliente);
    setPesquisaCliente(cliente.nome || "");
    setVeiculoSelecionado(null);
    Keyboard.dismiss();
  }

  function limparCliente() {
    setClienteSelecionado(null);
    setVeiculoSelecionado(null);
    setPesquisaCliente("");
  }

  function formatarDataHoraInput(data) {
    return data.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  function selecionarData(event, selectedDate) {
    setMostrarData(false);

    if (selectedDate) {
      const novaData = new Date(dataHora);

      novaData.setFullYear(selectedDate.getFullYear());
      novaData.setMonth(selectedDate.getMonth());
      novaData.setDate(selectedDate.getDate());

      setDataHora(novaData);
    }
  }

  function selecionarHora(event, selectedTime) {
    setMostrarHora(false);

    if (selectedTime) {
      const novaData = new Date(dataHora);

      novaData.setHours(selectedTime.getHours());
      novaData.setMinutes(selectedTime.getMinutes());
      novaData.setSeconds(0);

      setDataHora(novaData);
    }
  }

  async function criarAgendamento() {
    if (!clienteSelecionado) {
      Alert.alert("Atenção", "Selecione um cliente.");
      return;
    }

    if (!veiculoSelecionado) {
      Alert.alert("Atenção", "Selecione um carro.");
      return;
    }

    if (!descricao) {
      Alert.alert("Atenção", "Digite a descrição combinada.");
      return;
    }

    try {
      await api.post("/agendamentos", {
        descricao,
        dataHora: dataHora.toISOString(),
        cliente: {
          id: clienteSelecionado.id,
        },
        veiculo: {
          id: veiculoSelecionado.id,
        },
      });

      Alert.alert("Sucesso", "Agendamento criado.");

      limparCliente();
      setDescricao("");
      setDataHora(new Date());

      carregarTudo();
    } catch (error) {
      console.log("Erro ao criar agendamento:", error);
      Alert.alert("Erro", "Não foi possível criar o agendamento.");
    }
  }

  async function alterarStatus(id, status) {
    try {
      await api.put(`/agendamentos/${id}/status`, null, {
        params: {
          status,
        },
      });

      carregarTudo();
    } catch (error) {
      console.log("Erro ao alterar status:", error);
      Alert.alert("Erro", "Não foi possível alterar o status.");
    }
  }

  function formatarData(data) {
    if (!data) return "";

    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl refreshing={carregando} onRefresh={carregarTudo} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.titulo}>Agendamentos</Text>

        <Text style={styles.subtitulo}>
          Controle dos próximos clientes da oficina
        </Text>
      </View>

      <Card style={styles.cardNovo}>
        <Card.Content>
          <Text style={styles.tituloSecao}>Novo agendamento</Text>

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

          {!clienteSelecionado && pesquisaCliente.length > 0 && (
            <View style={styles.listaClientes}>
              {clientesFiltrados.length === 0 ? (
                <Text style={styles.textoVazio}>
                  Nenhum cliente encontrado.
                </Text>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <TouchableOpacity
                    key={cliente.id}
                    style={styles.itemCliente}
                    onPress={() => selecionarCliente(cliente)}
                  >
                    <Text style={styles.itemClienteNome}>{cliente.nome}</Text>

                    <Text style={styles.itemClienteInfo}>
                      {cliente.telefone}{" "}
                      {cliente.cpf ? `- ${cliente.cpf}` : ""}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {clienteSelecionado && (
            <View style={styles.clienteSelecionadoBox}>
              <Text style={styles.clienteSelecionadoTexto}>
                Cliente: {clienteSelecionado.nome}
              </Text>

              <TouchableOpacity
                style={styles.botaoTrocarCliente}
                onPress={limparCliente}
              >
                <Text style={styles.textoTrocarCliente}>Trocar cliente</Text>
              </TouchableOpacity>
            </View>
          )}

          {clienteSelecionado && (
            <>
              <Text style={styles.label}>Escolha o carro</Text>

              {veiculosDoCliente.length === 0 ? (
                <Text style={styles.textoVazio}>
                  Esse cliente ainda não possui carro cadastrado.
                </Text>
              ) : (
                veiculosDoCliente.map((veiculo) => (
                  <TouchableOpacity
                    key={veiculo.id}
                    style={
                      veiculoSelecionado?.id === veiculo.id
                        ? styles.carroSelecionado
                        : styles.carroOpcao
                    }
                    onPress={() => setVeiculoSelecionado(veiculo)}
                  >
                    <Text
                      style={
                        veiculoSelecionado?.id === veiculo.id
                          ? styles.carroTextoSelecionado
                          : styles.carroTexto
                      }
                    >
                      {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </>
          )}

          <TextInput
            label="Data e hora"
            value={formatarDataHoraInput(dataHora)}
            mode="outlined"
            style={styles.input}
            editable={false}
          />

          <View style={styles.linhaBotoesData}>
            <Button
              mode="outlined"
              textColor="#0f5132"
              style={styles.botaoData}
              onPress={() => setMostrarData(true)}
            >
              Escolher data
            </Button>

            <Button
              mode="outlined"
              textColor="#0f5132"
              style={styles.botaoData}
              onPress={() => setMostrarHora(true)}
            >
              Escolher hora
            </Button>
          </View>

          {mostrarData && (
            <DateTimePicker
              value={dataHora}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={selecionarData}
            />
          )}

          {mostrarHora && (
            <DateTimePicker
              value={dataHora}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={selecionarHora}
            />
          )}

          <TextInput
            label="Descrição combinada"
            value={descricao}
            onChangeText={setDescricao}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <Button
            mode="contained"
            buttonColor="#0f5132"
            style={styles.botaoCriar}
            onPress={criarAgendamento}
          >
            Criar agendamento
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.timeline}>
        {agendamentos.length === 0 ? (
          <Card style={styles.cardVazio}>
            <Card.Content>
              <Text style={styles.textoVazio}>
                Nenhum agendamento encontrado.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          agendamentos.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={styles.timelineLinha}>
                <View style={styles.timelineBolinha} />

                {index !== agendamentos.length - 1 && (
                  <View style={styles.timelineRisco} />
                )}
              </View>

              <Card style={styles.cardAgenda}>
                <Card.Content>
                  <View style={styles.topoAgenda}>
                    <MaterialCommunityIcons
                      name="calendar-clock"
                      size={24}
                      color="#0f5132"
                    />

                    <Text style={styles.dataAgenda}>
                      {formatarData(item.dataHora)}
                    </Text>
                  </View>

                  <Divider style={styles.divider} />

                  <Text style={styles.nomeCliente}>
                    {item.cliente?.nome || "Cliente não informado"}
                  </Text>

                  <Text style={styles.infoCarro}>
                    {item.veiculo?.marca} {item.veiculo?.modelo} -{" "}
                    {item.veiculo?.placa || "Sem placa"}
                  </Text>

                  <Text style={styles.descricao}>{item.descricao}</Text>

                  <View style={styles.areaBotoes}>
                    <TouchableOpacity
                      style={styles.botaoVeio}
                      onPress={() => alterarStatus(item.id, "COMPARECEU")}
                    >
                      <Text style={styles.textoBotao}>Cliente veio</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.botaoNaoVeio}
                      onPress={() => alterarStatus(item.id, "NAO_COMPARECEU")}
                    >
                      <Text style={styles.textoBotao}>Não veio</Text>
                    </TouchableOpacity>
                  </View>
                </Card.Content>
              </Card>
            </View>
          ))
        )}
      </View>
    </ScrollView>
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
    paddingBottom: 16,
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

  cardNovo: {
    marginHorizontal: 16,
    borderRadius: 24,
    backgroundColor: "#fff",
    elevation: 5,
  },

  tituloSecao: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#0f5132",
    marginBottom: 14,
  },

  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0f3d2e",
    marginBottom: 8,
  },

  listaClientes: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
  },

  itemCliente: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dddddd",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },

  itemClienteNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f3d2e",
  },

  itemClienteInfo: {
    color: "#555",
    marginTop: 3,
  },

  clienteSelecionadoBox: {
    backgroundColor: "#e9f5ee",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  clienteSelecionadoTexto: {
    color: "#0f3d2e",
    fontWeight: "bold",
    marginBottom: 8,
  },

  botaoTrocarCliente: {
    borderWidth: 1,
    borderColor: "#0f6b3f",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  textoTrocarCliente: {
    color: "#0f6b3f",
    fontWeight: "bold",
  },

  carroOpcao: {
    borderWidth: 1,
    borderColor: "#0f5132",
    padding: 11,
    borderRadius: 12,
    marginBottom: 8,
  },

  carroSelecionado: {
    backgroundColor: "#0f5132",
    padding: 11,
    borderRadius: 12,
    marginBottom: 8,
  },

  carroTexto: {
    color: "#0f5132",
    fontWeight: "bold",
  },

  carroTextoSelecionado: {
    color: "#fff",
    fontWeight: "bold",
  },

  linhaBotoesData: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  botaoData: {
    flex: 1,
    borderRadius: 12,
    borderColor: "#0f5132",
  },

  botaoCriar: {
    borderRadius: 14,
    paddingVertical: 4,
  },

  timeline: {
    padding: 16,
    paddingBottom: 40,
  },

  timelineItem: {
    flexDirection: "row",
    marginBottom: 18,
  },

  timelineLinha: {
    width: 30,
    alignItems: "center",
  },

  timelineBolinha: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#0f5132",
    marginTop: 14,
  },

  timelineRisco: {
    width: 3,
    flex: 1,
    backgroundColor: "#0f5132",
    marginTop: 4,
  },

  cardAgenda: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: "#fff",
    elevation: 4,
  },

  topoAgenda: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  dataAgenda: {
    color: "#0f5132",
    fontWeight: "bold",
    fontSize: 15,
  },

  nomeCliente: {
    color: "#0f3d2e",
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 4,
  },

  infoCarro: {
    color: "#555",
    marginBottom: 8,
  },

  divider: {
    marginVertical: 12,
  },

  descricao: {
    color: "#444",
    lineHeight: 21,
    fontSize: 15,
  },

  areaBotoes: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  botaoVeio: {
    flex: 1,
    backgroundColor: "#198754",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  botaoNaoVeio: {
    flex: 1,
    backgroundColor: "#b00020",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },

  cardVazio: {
    borderRadius: 20,
    backgroundColor: "#fff",
  },

  textoVazio: {
    textAlign: "center",
    color: "#666",
    marginBottom: 8,
  },
});