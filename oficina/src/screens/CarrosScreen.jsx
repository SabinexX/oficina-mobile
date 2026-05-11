import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import api from "../api/api";

export default function CarrosScreen() {
  const [carros, setCarros] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [cor, setCor] = useState("");

  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [pesquisaCliente, setPesquisaCliente] = useState("");

  const [carroEditando, setCarroEditando] = useState(null);

  const [mostrarPesquisa, setMostrarPesquisa] = useState(false);
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const carrosResponse = await api.get("/veiculos");
      const clientesResponse = await api.get("/clientes");

      setCarros(carrosResponse.data);
      setClientes(clientesResponse.data);
    } catch (error) {
      console.log("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar carros e clientes.");
    }
  }

  function limparFormulario() {
    setMarca("");
    setModelo("");
    setPlaca("");
    setCor("");
    setClienteSelecionado(null);
    setPesquisaCliente("");
    setCarroEditando(null);
    Keyboard.dismiss();
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

  function selecionarCliente(cliente) {
    setClienteSelecionado(cliente);
    setPesquisaCliente(cliente.nome || "");
    Keyboard.dismiss();
  }

  function placaDuplicada() {
    return carros.find((carro) => {
      if (carroEditando && carro.id === carroEditando.id) {
        return false;
      }

      const placaAtual = placa.trim().toUpperCase();
      const placaBanco = carro.placa?.trim().toUpperCase();

      return placaAtual !== "" && placaAtual === placaBanco;
    });
  }

  async function salvarCarro() {
    if (!marca || !modelo || !placa || !clienteSelecionado) {
      Alert.alert(
        "Atenção",
        "Preencha marca, modelo, placa e selecione um cliente."
      );
      return;
    }

    const duplicado = placaDuplicada();

    if (duplicado) {
      Alert.alert("Atenção", "Já existe um carro cadastrado com essa placa.");
      return;
    }

    try {
      const dadosCarro = {
        marca,
        modelo,
        placa: placa.toUpperCase(),
        cor,
        cliente: {
          id: clienteSelecionado.id,
        },
      };

      if (carroEditando) {
        await api.put(`/veiculos/${carroEditando.id}`, dadosCarro);
        Alert.alert("Sucesso", "Carro atualizado com sucesso.");
      } else {
        await api.post("/veiculos", dadosCarro);
        Alert.alert("Sucesso", "Carro cadastrado com sucesso.");
      }

      limparFormulario();
      carregarDados();
    } catch (error) {
      console.log("Erro ao salvar carro:", error);
      Alert.alert("Erro", "Não foi possível salvar o carro.");
    }
  }

  function editarCarro(carro) {
    setCarroEditando(carro);
    setMarca(carro.marca || "");
    setModelo(carro.modelo || "");
    setPlaca(carro.placa || "");
    setCor(carro.cor || "");

    if (carro.cliente) {
      setClienteSelecionado(carro.cliente);
      setPesquisaCliente(carro.cliente.nome || "");
    }
  }

  function confirmarExcluir(carro) {
    Alert.alert(
      "Excluir carro",
      `Tem certeza que deseja excluir o carro ${carro.placa}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deletarCarro(carro.id),
        },
      ]
    );
  }

  async function deletarCarro(id) {
    try {
      await api.delete(`/veiculos/${id}`);
      carregarDados();
      Alert.alert("Sucesso", "Carro removido com sucesso.");
    } catch (error) {
      console.log("Erro ao deletar carro:", error);
      Alert.alert("Erro", "Não foi possível deletar o carro.");
    }
  }

  const carrosFiltrados = carros.filter((carro) => {
    const texto = pesquisa.toLowerCase();

    return (
      carro.placa?.toLowerCase().includes(texto) ||
      carro.marca?.toLowerCase().includes(texto) ||
      carro.modelo?.toLowerCase().includes(texto) ||
      carro.cor?.toLowerCase().includes(texto) ||
      carro.cliente?.nome?.toLowerCase().includes(texto)
    );
  });

  function renderCabecalho() {
    return (
      <>
        <Text style={styles.titulo}>Carros</Text>

        <View style={styles.formulario}>
          <Text style={styles.subtitulo}>
            {carroEditando ? "Editar carro" : "Cadastrar novo carro"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Marca"
            value={marca}
            onChangeText={setMarca}
          />

          <TextInput
            style={styles.input}
            placeholder="Modelo"
            value={modelo}
            onChangeText={setModelo}
          />

          <TextInput
            style={styles.input}
            placeholder="Placa"
            value={placa}
            onChangeText={(texto) => setPlaca(texto.toUpperCase())}
            autoCapitalize="characters"
          />

          <TextInput
            style={styles.input}
            placeholder="Cor opcional"
            value={cor}
            onChangeText={setCor}
          />

          <Text style={styles.label}>Dono do veículo</Text>

          <TextInput
            style={styles.input}
            placeholder="Pesquisar cliente por nome, CPF ou telefone"
            value={pesquisaCliente}
            onChangeText={(texto) => {
              setPesquisaCliente(texto);
              setClienteSelecionado(null);
            }}
          />

          {!clienteSelecionado && pesquisaCliente.length > 0 && (
            <View style={styles.listaClientes}>
              {clientesFiltrados.length === 0 ? (
                <Text style={styles.textoVazio}>Nenhum cliente encontrado.</Text>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <TouchableOpacity
                    key={cliente.id}
                    style={styles.itemCliente}
                    onPress={() => selecionarCliente(cliente)}
                  >
                    <Text style={styles.itemClienteNome}>{cliente.nome}</Text>
                    <Text style={styles.itemClienteInfo}>
                      {cliente.telefone} {cliente.cpf ? `- ${cliente.cpf}` : ""}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {clienteSelecionado && (
            <View style={styles.clienteSelecionadoBox}>
              <Text style={styles.clienteSelecionadoTexto}>
                Cliente selecionado: {clienteSelecionado.nome}
              </Text>

              <TouchableOpacity
                style={styles.botaoTrocarCliente}
                onPress={() => {
                  setClienteSelecionado(null);
                  setPesquisaCliente("");
                }}
              >
                <Text style={styles.textoTrocarCliente}>Trocar cliente</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.botaoCadastrar} onPress={salvarCarro}>
            <Text style={styles.textoBotao}>
              {carroEditando ? "Salvar Alterações" : "Cadastrar Carro"}
            </Text>
          </TouchableOpacity>

          {carroEditando && (
            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={limparFormulario}
            >
              <Text style={styles.textoCancelar}>Cancelar edição</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.botaoPesquisar}
          onPress={() => setMostrarPesquisa(!mostrarPesquisa)}
        >
          <Text style={styles.textoBotao}>
            {mostrarPesquisa ? "Fechar pesquisa" : "Pesquisar carros cadastrados"}
          </Text>
        </TouchableOpacity>

        {mostrarPesquisa && (
          <View style={styles.areaPesquisa}>
            <TextInput
              style={styles.input}
              placeholder="Pesquisar por placa, marca, modelo, cor ou cliente"
              value={pesquisa}
              onChangeText={setPesquisa}
              autoCapitalize="characters"
            />
          </View>
        )}

        <Text style={styles.contadorCarros}>
          Carros cadastrados: {(mostrarPesquisa ? carrosFiltrados : carros).length}
        </Text>
      </>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <FlatList
            data={mostrarPesquisa ? carrosFiltrados : carros}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderCabecalho}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.lista}
            ListEmptyComponent={
              <Text style={styles.textoVazio}>Nenhum carro encontrado.</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardTopo}>
                  <View style={styles.placaBox}>
                    <Text style={styles.placaTexto}>{item.placa || "SEM PLACA"}</Text>
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={styles.nomeCarro}>
                      {item.marca} {item.modelo}
                    </Text>

                    <Text style={styles.info}>
                      Cor: {item.cor ? item.cor : "Não informada"}
                    </Text>

                    <Text style={styles.info}>
                      Cliente: {item.cliente?.nome || "Não informado"}
                    </Text>
                  </View>
                </View>

                <View style={styles.areaBotoesCard}>
                  <TouchableOpacity
                    style={styles.botaoEditar}
                    onPress={() => editarCarro(item)}
                  >
                    <Text style={styles.textoEditar}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.botaoExcluir}
                    onPress={() => confirmarExcluir(item)}
                  >
                    <Text style={styles.textoExcluir}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#d8ccb3",
  },

  container: {
    flex: 1,
    backgroundColor: "#d8ccb3",
    paddingHorizontal: 20,
  },

  lista: {
    paddingTop: 20,
    paddingBottom: 50,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f3d2e",
    marginBottom: 16,
    textAlign: "center",
  },

  formulario: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 3,
  },

  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f3d2e",
    marginBottom: 12,
  },

  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0f3d2e",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
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

  botaoCadastrar: {
    backgroundColor: "#0f6b3f",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  textoBotao: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },

  botaoCancelar: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0f6b3f",
  },

  textoCancelar: {
    color: "#0f6b3f",
    fontWeight: "bold",
  },

  botaoPesquisar: {
    backgroundColor: "#0f3d2e",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  areaPesquisa: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },

  contadorCarros: {
    color: "#0f3d2e",
    fontWeight: "bold",
    marginBottom: 12,
    fontSize: 15,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
  },

  cardTopo: {
    flexDirection: "row",
    alignItems: "center",
  },

  placaBox: {
    width: 95,
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: "#0f6b3f",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    padding: 6,
  },

  placaTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },

  cardInfo: {
    flex: 1,
  },

  nomeCarro: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#0f3d2e",
  },

  info: {
    fontSize: 15,
    marginTop: 3,
    color: "#333333",
  },

  areaBotoesCard: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  botaoEditar: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#0f6b3f",
    padding: 11,
    borderRadius: 10,
    alignItems: "center",
  },

  textoEditar: {
    color: "#0f6b3f",
    fontWeight: "bold",
  },

  botaoExcluir: {
    flex: 1,
    backgroundColor: "#b00020",
    padding: 11,
    borderRadius: 10,
    alignItems: "center",
  },

  textoExcluir: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  textoVazio: {
    color: "#555",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 12,
    fontSize: 16,
  },
});