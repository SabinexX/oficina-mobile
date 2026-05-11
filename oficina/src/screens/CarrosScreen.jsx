import React, { useEffect, useState } from "react";

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

export default function CarrosScreen() {

    const [veiculos, setVeiculos] = useState([]);
    const [clientes, setClientes] = useState([]);

    const [placa, setPlaca] = useState("");
    const [modelo, setModelo] = useState("");
    const [marca, setMarca] = useState("");
    const [ano, setAno] = useState("");
    const [motor, setMotor] = useState("");
    const [quilometragem, setQuilometragem] = useState("");

    const [clienteSelecionado, setClienteSelecionado] = useState(null);

    async function carregarVeiculos() {

        try {

            const response = await api.get("/veiculos");

            setVeiculos(response.data);

        } catch (error) {

            console.log(error);

            Alert.alert(
                "Erro",
                "Não foi possível carregar os veículos."
            );
        }
    }

    async function carregarClientes() {

        try {

            const response = await api.get("/clientes");

            setClientes(response.data);

        } catch (error) {

            console.log(error);
        }
    }

    async function cadastrarVeiculo() {

        if (
            !placa ||
            !modelo ||
            !marca ||
            !clienteSelecionado
        ) {

            Alert.alert(
                "Atenção",
                "Preencha os campos obrigatórios."
            );

            return;
        }

        try {

            const novoVeiculo = {

                placa,
                modelo,
                marca,
                ano: Number(ano),
                motor,
                quilometragem: Number(quilometragem),

                cliente: {
                    id: clienteSelecionado.id,
                },
            };

            await api.post("/veiculos", novoVeiculo);

            setPlaca("");
            setModelo("");
            setMarca("");
            setAno("");
            setMotor("");
            setQuilometragem("");
            setClienteSelecionado(null);

            carregarVeiculos();

            Alert.alert(
                "Sucesso",
                "Veículo cadastrado."
            );

        } catch (error) {

            console.log(error);

            Alert.alert(
                "Erro",
                "Não foi possível cadastrar."
            );
        }
    }

    async function deletarVeiculo(id) {

        try {

            await api.delete(`/veiculos/${id}`);

            carregarVeiculos();

        } catch (error) {

            console.log(error);

            Alert.alert(
                "Erro",
                "Não foi possível deletar."
            );
        }
    }

    useEffect(() => {

        carregarVeiculos();
        carregarClientes();

    }, []);

    return (

        <View style={styles.container}>

            <Text style={styles.titulo}>
                Veículos
            </Text>

            <View style={styles.formulario}>

                <TextInput
                    style={styles.input}
                    placeholder="Placa"
                    value={placa}
                    onChangeText={setPlaca}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Modelo"
                    value={modelo}
                    onChangeText={setModelo}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Marca"
                    value={marca}
                    onChangeText={setMarca}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Ano"
                    value={ano}
                    onChangeText={setAno}
                    keyboardType="numeric"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Motor"
                    value={motor}
                    onChangeText={setMotor}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Quilometragem"
                    value={quilometragem}
                    onChangeText={setQuilometragem}
                    keyboardType="numeric"
                />

                <Text style={styles.subtitulo}>
                    Selecionar Cliente
                </Text>

                <FlatList
                    horizontal
                    data={clientes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (

                        <TouchableOpacity
                            style={[
                                styles.clienteBotao,

                                clienteSelecionado?.id === item.id &&
                                styles.clienteSelecionado
                            ]}
                            onPress={() => setClienteSelecionado(item)}
                        >

                            <Text style={styles.textoCliente}>
                                {item.nome}
                            </Text>

                        </TouchableOpacity>
                    )}
                />

                <TouchableOpacity
                    style={styles.botaoCadastrar}
                    onPress={cadastrarVeiculo}
                >

                    <Text style={styles.textoBotao}>
                        Cadastrar Veículo
                    </Text>

                </TouchableOpacity>

            </View>

            <FlatList
                data={veiculos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (

                    <View style={styles.card}>

                        <Text style={styles.modelo}>
                            {item.modelo}
                        </Text>

                        <Text>
                            Marca: {item.marca}
                        </Text>

                        <Text>
                            Placa: {item.placa}
                        </Text>

                        <Text>
                            Ano: {item.ano}
                        </Text>

                        <Text>
                            Motor: {item.motor}
                        </Text>

                        <Text>
                            KM: {item.quilometragem}
                        </Text>

                        <Text style={styles.dono}>
                            Dono: {item.cliente?.nome}
                        </Text>

                        <TouchableOpacity
                            style={styles.botaoExcluir}
                            onPress={() => deletarVeiculo(item.id)}
                        >

                            <Text style={styles.textoExcluir}>
                                Excluir
                            </Text>

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
        backgroundColor: "#d8ccb3",
        padding: 20,
    },

    titulo: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#0f5132",
        marginBottom: 20,
        textAlign: "center",
    },

    formulario: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        backgroundColor: "#f9f9f9",
    },

    subtitulo: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 10,
        color: "#0f5132",
    },

    clienteBotao: {
        backgroundColor: "#ddd",
        padding: 10,
        borderRadius: 8,
        marginRight: 10,
        marginBottom: 15,
    },

    clienteSelecionado: {
        backgroundColor: "#0f5132",
    },

    textoCliente: {
        color: "#000",
        fontWeight: "bold",
    },

    botaoCadastrar: {
        backgroundColor: "#0f5132",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },

    textoBotao: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },

    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
    },

    modelo: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0f5132",
    },

    dono: {
        marginTop: 8,
        fontWeight: "bold",
        color: "#0f5132",
    },

    botaoExcluir: {
        backgroundColor: "#b00020",
        padding: 10,
        borderRadius: 8,
        marginTop: 12,
        alignItems: "center",
    },

    textoExcluir: {
        color: "#fff",
        fontWeight: "bold",
    },
});