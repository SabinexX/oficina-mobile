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
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { apiOficina } from "../api/api";

export default function ClientesScreen() {
  const [clientes, setClientes] = useState([]);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");

  const [clienteEditando, setClienteEditando] = useState(null);

  const [mostrarPesquisa, setMostrarPesquisa] = useState(false);
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      const response = await apiOficina.get("/clientes");
      setClientes(response.data);
    } catch (error) {
      console.log("ERRO COMPLETO:");
      console.log(error);

      console.log("STATUS:");
      console.log(error.response?.status);

      console.log("DATA:");
      console.log(error.response?.data);

      console.log("MESSAGE:");
      console.log(error.message);

      Alert.alert("Erro", "Não foi possível carregar os clientes.");
    }
  }

  function limparFormulario() {
    setNome("");
    setTelefone("");
    setCpf("");
    setClienteEditando(null);
    Keyboard.dismiss();
  }

  function clienteDuplicado() {
    return clientes.find((cliente) => {
      if (clienteEditando && cliente.id === clienteEditando.id) {
        return false;
      }

      const telefoneIgual =
        telefone.trim() !== "" &&
        cliente.telefone?.trim() === telefone.trim();

      const cpfIgual =
        cpf.trim() !== "" &&
        cliente.cpf?.trim() === cpf.trim();

      return telefoneIgual || cpfIgual;
    });
  }

  async function salvarCliente() {
    if (!nome || !telefone) {
      Alert.alert("Atenção", "Preencha pelo menos nome e telefone.");
      return;
    }

    const duplicado = clienteDuplicado();

    if (duplicado) {
      Alert.alert(
        "Atenção",
        "Já existe um cliente cadastrado com esse telefone ou CPF."
      );
      return;
    }

    try {
      const dadosCliente = {
        nome,
        telefone,
        cpf,
      };

      if (clienteEditando) {
        await apiOficina.put(
          `/clientes/${clienteEditando.id}`,
          dadosCliente
        );

        Alert.alert("Sucesso", "Cliente atualizado com sucesso.");
      } else {
        await apiOficina.post("/clientes", dadosCliente);

        Alert.alert("Sucesso", "Cliente cadastrado com sucesso.");
      }

      limparFormulario();
      carregarClientes();
    } catch (error) {
      console.log("ERRO COMPLETO:");
      console.log(error);

      console.log("STATUS:");
      console.log(error.response?.status);

      console.log("DATA:");
      console.log(error.response?.data);

      console.log("MESSAGE:");
      console.log(error.message);

      Alert.alert("Erro", "Não foi possível salvar o cliente.");
    }
  }

  function editarCliente(cliente) {
    setClienteEditando(cliente);

    setNome(cliente.nome || "");
    setTelefone(cliente.telefone || "");
    setCpf(cliente.cpf || "");
  }

  function confirmarExcluir(cliente) {
    Alert.alert(
      "Excluir cliente",
      `Tem certeza que deseja excluir ${cliente.nome}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deletarCliente(cliente.id),
        },
      ]
    );
  }

  async function deletarCliente(id) {
    try {
      await apiOficina.delete(`/clientes/${id}`);

      carregarClientes();

      Alert.alert("Sucesso", "Cliente removido com sucesso.");
    } catch (error) {
      console.log("Erro ao deletar cliente:", error);

      Alert.alert("Erro", "Não foi possível deletar o cliente.");
    }
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const texto = pesquisa.toLowerCase();

    return (
      cliente.nome?.toLowerCase().includes(texto) ||
      cliente.cpf?.toLowerCase().includes(texto) ||
      cliente.telefone?.toLowerCase().includes(texto)
    );
  });

  function renderCabecalho() {
    return (
      <>
        <Text style={styles.titulo}>Clientes</Text>

        <View style={styles.formulario}>
          <Text style={styles.subtitulo}>
            {clienteEditando
              ? "Editar cliente"
              : "Cadastrar novo cliente"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do cliente"
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={styles.input}
            placeholder="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="CPF opcional"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.botaoCadastrar}
            onPress={salvarCliente}
          >
            <Text style={styles.textoBotao}>
              {clienteEditando
                ? "Salvar Alterações"
                : "Cadastrar Cliente"}
            </Text>
          </TouchableOpacity>

          {clienteEditando && (
            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={limparFormulario}
            >
              <Text style={styles.textoCancelar}>
                Cancelar edição
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.botaoPesquisar}
          onPress={() => setMostrarPesquisa(!mostrarPesquisa)}
        >
          <Text style={styles.textoBotao}>
            {mostrarPesquisa
              ? "Fechar pesquisa"
              : "Pesquisar clientes cadastrados"}
          </Text>
        </TouchableOpacity>

        {mostrarPesquisa && (
          <View style={styles.areaPesquisa}>
            <TextInput
              style={styles.input}
              placeholder="Pesquisar por nome, CPF ou telefone"
              value={pesquisa}
              onChangeText={setPesquisa}
            />
          </View>
        )}

        <Text style={styles.contadorClientes}>
          Clientes cadastrados: {clientesFiltrados.length}
        </Text>
      </>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>

        <FlatList
          data={mostrarPesquisa ? clientesFiltrados : clientes}
          ListHeaderComponent={renderCabecalho()}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.textoVazio}>
              Nenhum cliente encontrado.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTopo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarTexto}>
                    {item.nome
                      ? item.nome.charAt(0).toUpperCase()
                      : "C"}
                  </Text>
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.nome}>{item.nome}</Text>

                  <Text style={styles.info}>
                    Telefone: {item.telefone}
                  </Text>

                  <Text style={styles.info}>
                    CPF:{" "}
                    {item.cpf
                      ? item.cpf
                      : "Não informado"}
                  </Text>
                </View>
              </View>

              <View style={styles.areaBotoesCard}>
                <TouchableOpacity
                  style={styles.botaoEditar}
                  onPress={() => editarCliente(item)}
                >
                  <Text style={styles.textoEditar}>
                    Editar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoExcluir}
                  onPress={() => confirmarExcluir(item)}
                >
                  <Text style={styles.textoExcluir}>
                    Excluir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

      </View>
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
    paddingTop: 20,
  },

  lista: {
    paddingBottom: 10,
    paddingTop: 20,
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

  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
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

  contadorClientes: {
    color: "#0f3d2e",
    fontWeight: "bold",
    marginBottom: 12,
    fontSize: 15,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 28,
    marginBottom: 18,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  cardTopo: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0f6b3f",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },

  cardInfo: {
    flex: 1,
  },

  nome: {
    fontSize: 20,
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
    fontSize: 16,
  },
});