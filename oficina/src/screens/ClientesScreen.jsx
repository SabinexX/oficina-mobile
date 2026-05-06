import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, TextInput, Button, Card, Divider } from "react-native-paper";

export default function ClientesScreen() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");

  const [clientes, setClientes] = useState([]);

  function adicionarCliente() {
    if (!nome || !telefone) {
      alert("Preencha pelo menos nome e telefone.");
      return;
    }

    const novoCliente = {
      id: Date.now().toString(),
      nome,
      telefone,
      cpf,
    };

    setClientes([...clientes, novoCliente]);

    setNome("");
    setTelefone("");
    setCpf("");
  }

  function removerCliente(id) {
    const listaAtualizada = clientes.filter((cliente) => cliente.id !== id);
    setClientes(listaAtualizada);
  }

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.titulo}>
        Clientes
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.subtitulo}>
            Cadastrar cliente
          </Text>

          <TextInput
            label="Nome do cliente"
            value={nome}
            onChangeText={setNome}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            label="CPF opcional"
            value={cpf}
            onChangeText={setCpf}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={adicionarCliente}
            style={styles.botaoAdicionar}
          >
            Salvar cliente
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.subtitulo}>
            Clientes cadastrados
          </Text>

          {clientes.length === 0 ? (
            <Text style={styles.textoVazio}>Nenhum cliente cadastrado.</Text>
          ) : (
            clientes.map((cliente) => (
              <View key={cliente.id} style={styles.clienteItem}>
                <Text style={styles.nomeCliente}>{cliente.nome}</Text>

                <Text style={styles.infoCliente}>
                  Telefone: {cliente.telefone}
                </Text>

                {cliente.cpf ? (
                  <Text style={styles.infoCliente}>CPF: {cliente.cpf}</Text>
                ) : null}

                <Button
                  mode="outlined"
                  onPress={() => removerCliente(cliente.id)}
                  style={styles.botaoRemover}
                  textColor="#b00020"
                >
                  Remover
                </Button>

                <Divider style={styles.divider} />
              </View>
            ))
          )}
        </Card.Content>
      </Card>
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

  card: {
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: "#fff",
  },

  subtitulo: {
    color: "#0f5132",
    fontWeight: "bold",
    marginBottom: 12,
  },

  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  botaoAdicionar: {
    backgroundColor: "#198754",
    borderRadius: 12,
    paddingVertical: 5,
  },

  textoVazio: {
    color: "#777",
  },

  clienteItem: {
    marginBottom: 12,
  },

  nomeCliente: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0f5132",
    marginBottom: 4,
  },

  infoCliente: {
    color: "#444",
    marginBottom: 3,
  },

  botaoRemover: {
    marginTop: 8,
    borderColor: "#b00020",
  },

  divider: {
    marginTop: 12,
  },
});