import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Image } from "react-native";
import {
    Text,
    Card,
    TextInput,
    Button,
    Divider,
    IconButton,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

export default function CarrosScreen() {
    const [cliente, setCliente] = useState("");
    const [placa, setPlaca] = useState("");
    const [modelo, setModelo] = useState("");
    const [marca, setMarca] = useState("");
    const [ano, setAno] = useState("");
    const [fotosCarro, setFotoCarro] = useState([]);

    const [carros, setCarros] = useState([]);

    async function tirarFotoCarro() {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissao.granted) {
            alert("Você precisa permitir o uso da câmera.");
            return;
        }

        const resultado = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.8,
        });

        if (!resultado.canceled) {
            setFotoCarro(resultado.assets[0].uri);
        }
    }

    async function escolherFotoCarro() {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissao.granted) {
            alert("Você precisa permitir o acesso à galeria.");
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!resultado.canceled) {
            setFotoCarro(resultado.assets[0].uri);
        }
    }

    function cadastrarCarro() {
        if (!cliente || !placa || !modelo) {
            alert("Preencha pelo menos cliente, placa e modelo.");
            return;
        }

        const novoCarro = {
            id: Date.now().toString(),
            cliente,
            placa: placa.toUpperCase(),
            modelo,
            marca,
            ano,
            foto: fotosCarro,
        };

        setCarros([...carros, novoCarro]);

        setCliente("");
        setPlaca("");
        setModelo("");
        setMarca("");
        setAno("");
        setFotoCarro(null);
    }

    function excluirCarro(id) {
        const novaLista = carros.filter((carro) => carro.id !== id);
        setCarros(novaLista);
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.titulo}>Cadastro de Carros</Text>
                <Text style={styles.subtitulo}>
                    Cadastre os veículos dos clientes com foto para identificar melhor quando entrarem na oficina.
                </Text>
            </View>

            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.cardTitulo}>Dados do veículo</Text>

                    <TextInput
                        label="Nome do cliente"
                        value={cliente}
                        onChangeText={setCliente}
                        mode="outlined"
                        style={styles.input}
                    />

                    <TextInput
                        label="Placa"
                        value={placa}
                        onChangeText={setPlaca}
                        mode="outlined"
                        autoCapitalize="characters"
                        style={styles.input}
                    />

                    <TextInput
                        label="Modelo"
                        value={modelo}
                        onChangeText={setModelo}
                        mode="outlined"
                        style={styles.input}
                    />

                    <TextInput
                        label="Marca"
                        value={marca}
                        onChangeText={setMarca}
                        mode="outlined"
                        style={styles.input}
                    />

                    <TextInput
                        label="Ano"
                        value={ano}
                        onChangeText={setAno}
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    <View style={styles.areaFoto}>
                        {fotoCarro ? (
                            <Image source={{ uri: fotoCarro }} style={styles.fotoCarro} />
                        ) : (
                            <View style={styles.semFoto}>
                                <Text style={styles.textoSemFoto}>
                                    Nenhuma foto selecionada
                                </Text>
                            </View>
                        )}

                        <Button
                            mode="contained"
                            onPress={tirarFotoCarro}
                            buttonColor="#0f5132"
                            style={styles.botaoFoto}
                        >
                            Tirar foto
                        </Button>

                        <Button
                            mode="outlined"
                            onPress={escolherFotoCarro}
                            textColor="#0f5132"
                            style={styles.botaoFoto}
                        >
                            Escolher da galeria
                        </Button>
                    </View>

                    <Button
                        mode="contained"
                        onPress={cadastrarCarro}
                        buttonColor="#198754"
                        style={styles.botaoCadastrar}
                    >
                        Cadastrar carro
                    </Button>
                </Card.Content>
            </Card>

            <View style={styles.listaArea}>
                <Text style={styles.listaTitulo}>Carros cadastrados</Text>

                {carros.length === 0 && (
                    <Text style={styles.listaVazia}>
                        Nenhum carro cadastrado ainda.
                    </Text>
                )}

                {carros.map((carro) => (
                    <Card key={carro.id} style={styles.cardCarro}>
                        <Card.Content>
                            {carro.foto ? (
                                <Image source={{ uri: carro.foto }} style={styles.fotoLista} />
                            ) : (
                                <View style={styles.fotoListaVazia}>
                                    <Text style={styles.textoSemFoto}>Sem foto</Text>
                                </View>
                            )}

                            <View style={styles.linhaTitulo}>
                                <Text style={styles.nomeCarro}>
                                    {carro.modelo}
                                </Text>

                                <IconButton
                                    icon="delete"
                                    iconColor="#dc3545"
                                    size={24}
                                    onPress={() => excluirCarro(carro.id)}
                                />
                            </View>

                            <Divider style={styles.divisor} />

                            <Text style={styles.info}>Cliente: {carro.cliente}</Text>
                            <Text style={styles.info}>Placa: {carro.placa}</Text>
                            <Text style={styles.info}>Marca: {carro.marca || "Não informado"}</Text>
                            <Text style={styles.info}>Ano: {carro.ano || "Não informado"}</Text>
                        </Card.Content>
                    </Card>
                ))}
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
        backgroundColor: "#0f5132",
        padding: 26,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },

    titulo: {
        color: "#fff",
        fontSize: 25,
        fontWeight: "bold",
    },

    subtitulo: {
        color: "#d1e7dd",
        marginTop: 8,
        fontSize: 15,
        lineHeight: 22,
    },

    card: {
        margin: 20,
        borderRadius: 20,
        backgroundColor: "#fff",
    },

    cardTitulo: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0f5132",
        marginBottom: 14,
    },

    input: {
        marginBottom: 12,
        backgroundColor: "#fff",
    },

    areaFoto: {
        marginTop: 10,
        marginBottom: 15,
    },

    fotoCarro: {
        width: "100%",
        height: 200,
        borderRadius: 16,
        marginBottom: 12,
    },

    semFoto: {
        width: "100%",
        height: 170,
        borderRadius: 16,
        backgroundColor: "#e9ecef",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#adb5bd",
        borderStyle: "dashed",
    },

    textoSemFoto: {
        color: "#6c757d",
        fontSize: 15,
    },

    botaoFoto: {
        borderRadius: 12,
        marginBottom: 10,
    },

    botaoCadastrar: {
        borderRadius: 12,
        paddingVertical: 5,
        marginTop: 5,
    },

    listaArea: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },

    listaTitulo: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#0f5132",
        marginBottom: 12,
    },

    listaVazia: {
        color: "#555",
        fontSize: 15,
        marginBottom: 20,
    },

    cardCarro: {
        borderRadius: 20,
        backgroundColor: "#fff",
        marginBottom: 16,
    },

    fotoLista: {
        width: "100%",
        height: 180,
        borderRadius: 16,
        marginBottom: 12,
    },

    fotoListaVazia: {
        width: "100%",
        height: 130,
        borderRadius: 16,
        backgroundColor: "#e9ecef",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },

    linhaTitulo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    nomeCarro: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#212529",
    },

    divisor: {
        marginVertical: 10,
    },

    info: {
        fontSize: 15,
        color: "#444",
        marginBottom: 5,
    },
});