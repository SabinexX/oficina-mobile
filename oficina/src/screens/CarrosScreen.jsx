import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    Image,
} from "react-native";

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

    // ================================
    // ESTADOS DOS INPUTS
    // ================================

    const [cliente, setCliente] = useState("");
    const [placa, setPlaca] = useState("");
    const [modelo, setModelo] = useState("");
    const [marca, setMarca] = useState("");
    const [ano, setAno] = useState("");

    // ARRAY DE FOTOS
    const [fotosCarro, setFotosCarro] = useState([]);

    // LISTA DOS CARROS
    const [carros, setCarros] = useState([]);



    // ================================
    // FUNÇÃO PARA TIRAR FOTO
    // ================================

    async function tirarFotoCarro() {

        // pede permissão para câmera
        const permissao =
            await ImagePicker.requestCameraPermissionsAsync();

        // verifica se permitiu
        if (!permissao.granted) {

            alert("Permissão da câmera negada.");
            return;
        }

        // abre câmera
        const resultado =
            await ImagePicker.launchCameraAsync({

                allowsEditing: true,
                quality: 0.8,
            });

        // verifica se tirou foto
        if (!resultado.canceled) {

            // pega a foto nova
            const novaFoto =
                resultado.assets[0].uri;

            // adiciona no array
            setFotosCarro([
                ...fotosCarro,
                novaFoto
            ]);
        }
    }



    // ================================
    // ESCOLHER FOTO DA GALERIA
    // ================================

    async function escolherFotoCarro() {

        // pede permissão da galeria
        const permissao =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        // verifica permissão
        if (!permissao.granted) {

            alert("Permissão da galeria negada.");
            return;
        }

        // abre galeria
        const resultado =
            await ImagePicker.launchImageLibraryAsync({

                mediaTypes:
                    ImagePicker.MediaTypeOptions.Images,

                allowsMultipleSelection: true,

                quality: 0.8,
            });

        // verifica se selecionou
        if (!resultado.canceled) {

            // pega todas fotos selecionadas
            const novasFotos =
                resultado.assets.map(
                    (item) => item.uri
                );

            // adiciona no array
            setFotosCarro([
                ...fotosCarro,
                ...novasFotos
            ]);
        }
    }



    // ================================
    // CADASTRAR CARRO
    // ================================

    function cadastrarCarro() {

        // validação
        if (
            !cliente ||
            !placa ||
            !modelo
        ) {

            alert(
                "Preencha cliente, placa e modelo."
            );

            return;
        }

        // cria objeto
        const novoCarro = {

            id: Date.now().toString(),

            cliente,

            placa: placa.toUpperCase(),

            modelo,

            marca,

            ano,

            // ARRAY DE FOTOS
            fotos: fotosCarro,
        };

        // adiciona na lista
        setCarros([
            ...carros,
            novoCarro
        ]);

        // limpa campos
        setCliente("");
        setPlaca("");
        setModelo("");
        setMarca("");
        setAno("");

        // limpa fotos
        setFotosCarro([]);
    }



    // ================================
    // EXCLUIR CARRO
    // ================================

    function excluirCarro(id) {

        const novaLista =
            carros.filter(
                (carro) => carro.id !== id
            );

        setCarros(novaLista);
    }



    // ================================
    // TELA
    // ================================

    return (

        <ScrollView style={styles.container}>

            {/* HEADER */}

            <View style={styles.header}>

                <Text style={styles.titulo}>
                    Cadastro de Carros
                </Text>

                <Text style={styles.subtitulo}>
                    Cadastre veículos com várias fotos
                    para acompanhar entrada,
                    avarias e etapas do serviço.
                </Text>

            </View>



            {/* FORMULÁRIO */}

            <Card style={styles.card}>

                <Card.Content>

                    <Text style={styles.cardTitulo}>
                        Dados do veículo
                    </Text>



                    {/* CLIENTE */}

                    <TextInput
                        label="Cliente"
                        value={cliente}
                        onChangeText={setCliente}
                        mode="outlined"
                        style={styles.input}
                    />



                    {/* PLACA */}

                    <TextInput
                        label="Placa"
                        value={placa}
                        onChangeText={setPlaca}
                        mode="outlined"
                        autoCapitalize="characters"
                        style={styles.input}
                    />



                    {/* MODELO */}

                    <TextInput
                        label="Modelo"
                        value={modelo}
                        onChangeText={setModelo}
                        mode="outlined"
                        style={styles.input}
                    />



                    {/* MARCA */}

                    <TextInput
                        label="Marca"
                        value={marca}
                        onChangeText={setMarca}
                        mode="outlined"
                        style={styles.input}
                    />



                    {/* ANO */}

                    <TextInput
                        label="Ano"
                        value={ano}
                        onChangeText={setAno}
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                    />



                    {/* GALERIA DE FOTOS */}

                    <View style={styles.areaFoto}>


                        {/* MOSTRA TODAS AS FOTOS */}

                        {fotosCarro.length > 0 ? (

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            >

                                {fotosCarro.map((foto, index) => (

                                    <Image
                                        key={index}
                                        source={{ uri: foto }}
                                        style={styles.fotoMiniatura}
                                    />

                                ))}

                            </ScrollView>

                        ) : (

                            <View style={styles.semFoto}>

                                <Text style={styles.textoSemFoto}>
                                    Nenhuma foto selecionada
                                </Text>

                            </View>

                        )}



                        {/* BOTÃO CÂMERA */}

                        <Button
                            mode="contained"
                            buttonColor="#0f5132"
                            style={styles.botaoFoto}
                            onPress={tirarFotoCarro}
                        >
                            Tirar foto
                        </Button>



                        {/* BOTÃO GALERIA */}

                        <Button
                            mode="outlined"
                            textColor="#0f5132"
                            style={styles.botaoFoto}
                            onPress={escolherFotoCarro}
                        >
                            Escolher da galeria
                        </Button>

                    </View>



                    {/* BOTÃO CADASTRAR */}

                    <Button
                        mode="contained"
                        buttonColor="#198754"
                        style={styles.botaoCadastrar}
                        onPress={cadastrarCarro}
                    >
                        Cadastrar carro
                    </Button>

                </Card.Content>

            </Card>



            {/* LISTA */}

            <View style={styles.listaArea}>

                <Text style={styles.listaTitulo}>
                    Carros cadastrados
                </Text>



                {carros.length === 0 && (

                    <Text style={styles.listaVazia}>
                        Nenhum carro cadastrado.
                    </Text>

                )}



                {carros.map((carro) => (

                    <Card
                        key={carro.id}
                        style={styles.cardCarro}
                    >

                        <Card.Content>



                            {/* GALERIA DAS FOTOS */}

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            >

                                {carro.fotos.map((foto, index) => (

                                    <Image
                                        key={index}
                                        source={{ uri: foto }}
                                        style={styles.fotoLista}
                                    />

                                ))}

                            </ScrollView>



                            {/* TÍTULO */}

                            <View style={styles.linhaTitulo}>

                                <Text style={styles.nomeCarro}>
                                    {carro.modelo}
                                </Text>

                                <IconButton
                                    icon="delete"
                                    iconColor="#dc3545"
                                    size={24}
                                    onPress={() =>
                                        excluirCarro(carro.id)
                                    }
                                />

                            </View>



                            <Divider style={styles.divisor} />



                            {/* INFOS */}

                            <Text style={styles.info}>
                                Cliente: {carro.cliente}
                            </Text>

                            <Text style={styles.info}>
                                Placa: {carro.placa}
                            </Text>

                            <Text style={styles.info}>
                                Marca: {carro.marca || "Não informado"}
                            </Text>

                            <Text style={styles.info}>
                                Ano: {carro.ano || "Não informado"}
                            </Text>

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
        fontSize: 26,
        fontWeight: "bold",
    },



    subtitulo: {
        color: "#d1e7dd",
        marginTop: 8,
        lineHeight: 22,
        fontSize: 15,
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
        marginBottom: 15,
    },



    input: {
        marginBottom: 12,
        backgroundColor: "#fff",
    },



    areaFoto: {
        marginTop: 10,
        marginBottom: 15,
    },



    fotoMiniatura: {
        width: 150,
        height: 150,
        borderRadius: 16,
        marginRight: 10,
        marginBottom: 12,
    },



    semFoto: {
        width: "100%",
        height: 160,

        borderRadius: 16,

        backgroundColor: "#e9ecef",

        alignItems: "center",
        justifyContent: "center",

        borderWidth: 1,
        borderColor: "#adb5bd",
        borderStyle: "dashed",

        marginBottom: 12,
    },



    textoSemFoto: {
        color: "#6c757d",
        fontSize: 15,
    },



    botaoFoto: {
        marginBottom: 10,
        borderRadius: 12,
    },



    botaoCadastrar: {
        borderRadius: 12,
        paddingVertical: 5,
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
    },



    cardCarro: {
        borderRadius: 20,
        backgroundColor: "#fff",
        marginBottom: 16,
    },



    fotoLista: {
        width: 150,
        height: 150,
        borderRadius: 14,
        marginRight: 10,
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