import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";

import api from "../api/api";

export default function ClientesScreen() {
  const [clientes, setClientes] = useState([]);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");

  async function carregarClientes() {
    try {
      const response = await api.get("/clientes");

      setClientes(response.data);
    } catch (error) {
      console.log("Erro ao buscar clientes:", error);
      Alert.alert("Erro", "Não foi possível carregar os clientes.");
    }
  }

  async function cadastrarCliente() {
    if (!nome || !telefone || !cpf) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    try {
      const novoCliente = {
        nome: nome,
        telefone: telefone,
        cpf: cpf,
      };

      await api.post("/clientes", novoCliente);

      setNome("");
      setTelefone("");
      setCpf("");

      carregarClientes();

      Alert.alert("Sucesso", "Cliente cadastrado com sucesso.");
    } catch (error) {
      console.log("Erro ao cadastrar cliente:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o cliente.");
    }
  }

  async function deletarCliente(id) {
    try {
      await api.delete(`/clientes/${id}`);

      carregarClientes();

      Alert.alert("Sucesso", "Cliente removido com sucesso.");
    } catch (error) {
      console.log("Erro ao deletar cliente:", error);
      Alert.alert("Erro", "Não foi possível deletar o cliente.");
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Clientes</Text>

      <View style={styles.formulario}>
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
          placeholder="CPF"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.botaoCadastrar} onPress={cadastrarCliente}>
          <Text style={styles.textoBotao}>Cadastrar Cliente</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.info}>Telefone: {item.telefone}</Text>
            <Text style={styles.info}>CPF: {item.cpf}</Text>

            <TouchableOpacity
              style={styles.botaoExcluir}
              onPress={() => deletarCliente(item.id)}
            >
              <Text style={styles.textoExcluir}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#d8ccb3",
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f3d2e",
    marginBottom: 20,
    textAlign: "center",
  },

  formulario: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },

  botaoCadastrar: {
    backgroundColor: "#0f6b3f",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  textoBotao: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  nome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f3d2e",
  },

  info: {
    fontSize: 15,
    marginTop: 4,
    color: "#333333",
  },

  botaoExcluir: {
    backgroundColor: "#b00020",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },

  textoExcluir: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});