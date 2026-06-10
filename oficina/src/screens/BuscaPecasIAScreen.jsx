import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    Linking,
    Image,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import {
    Text,
    Card,
    TextInput,
    Button,
    Chip,
    Divider,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { apiOficina, apiIA } from "../api/api";

export default function BuscaPecasIAScreen() {
    const [placa, setPlaca] = useState("");
    const [peca, setPeca] = useState("");
    const [carroEncontrado, setCarroEncontrado] = useState(null);
    const [resultados, setResultados] = useState([]);
    const [fotoPeca, setFotoPeca] = useState(null);
    const [loadingVeiculo, setLoadingVeiculo] = useState(false);
    const [loadingPeca, setLoadingPeca] = useState(false);
    const [pecaIdentificada, setPecaIdentificada] = useState(null);

    // ─── Câmera / Galeria ────────────────────────────────────────────────────

    async function abrirCamera() {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permissão negada",
                "Precisamos de acesso à câmera para fotografar a peça."
            );
            return;
        }

        const resultado = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!resultado.canceled) {
            setFotoPeca(resultado.assets[0].uri);
            setPeca("");
            setResultados([]);
            setPecaIdentificada(null);
        }
    }

    async function abrirGaleria() {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permissão negada",
                "Precisamos de acesso à galeria para selecionar uma foto."
            );
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!resultado.canceled) {
            setFotoPeca(resultado.assets[0].uri);
            setPeca("");
            setResultados([]);
            setPecaIdentificada(null);
        }
    }

    function removerFoto() {
        setFotoPeca(null);
        setPecaIdentificada(null);
        setResultados([]);
    }

    // ─── API Real ─────────────────────────────────────────────────────────────

    async function buscarVeiculo() {
    if (!placa.trim()) {
        Alert.alert("Atenção", "Digite a placa do veículo.");
        return;
    }

    setLoadingVeiculo(true);
    setCarroEncontrado(null);
    setResultados([]);

    try {
        const { data } = await apiOficina.get("/veiculos");

        const placaDigitada = placa.trim().toUpperCase().replace(/\s/g, "");

        const veiculo = data.find(
            (v) => v.placa?.toUpperCase().replace(/\s/g, "") === placaDigitada
        );

        if (!veiculo) {
            Alert.alert("Não encontrado", "Nenhum veículo cadastrado com essa placa.");
            return;
        }

        setCarroEncontrado({
            placa: veiculo.placa,
            marca: veiculo.marca,
            modelo: veiculo.modelo,
            ano: veiculo.ano,
            motor: veiculo.motor,
            cor: veiculo.cor,
        });

    } catch (err) {
        Alert.alert("Erro", "Não foi possível buscar os veículos.");
    } finally {
        setLoadingVeiculo(false);
    }
}

    async function pesquisarPeca() {
        if (!peca.trim() && !fotoPeca) {
            Alert.alert(
                "Atenção",
                "Digite o nome da peça ou tire uma foto dela."
            );
            return;
        }

        setLoadingPeca(true);
        setResultados([]);
        setPecaIdentificada(null);

        try {
            let data;

            if (fotoPeca) {
                // Busca por foto (IA Vision)
                const formData = new FormData();
                formData.append("image", {
                    uri: fotoPeca,
                    name: "peca.jpg",
                    type: "image/jpeg",
                });
                if (carroEncontrado?.marca)
                    formData.append("vehicle_brand", carroEncontrado.marca);
                if (carroEncontrado?.modelo)
                    formData.append("vehicle_model", carroEncontrado.modelo);
                if (carroEncontrado?.ano)
                    formData.append(
                        "vehicle_year",
                        String(carroEncontrado.ano)
                    );
                if (placa.trim())
                    formData.append(
                        "vehicle_plate",
                        placa.trim().toUpperCase()
                    );

                const resp = await apiIA.post(
                    "/api/v1/search/by-image",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                data = resp.data;
                setPecaIdentificada(data.part);
            } else {
                // Busca por texto
                const query = encodeURIComponent(peca.trim());
                const resp = await apiIA.post(
                    `/api/v1/search/by-text?query=${query}`,
                    {
                        vehicle_brand: carroEncontrado?.marca,
                        vehicle_model: carroEncontrado?.modelo,
                        vehicle_year: carroEncontrado?.ano
                            ? Number(carroEncontrado.ano)
                            : undefined,
                    }
                );
                data = resp.data;
                setPecaIdentificada(data.part);
            }

            setResultados(data.offers || []);

            if (!data.offers || data.offers.length === 0) {
                Alert.alert("Sem resultados", "Nenhuma oferta encontrada para essa peça.");
            }
        } catch (err) {
            Alert.alert(
                "Erro na busca",
                "Não foi possível conectar à IA. Verifique se o servidor está rodando."
            );
        } finally {
            setLoadingPeca(false);
        }
    }

    function abrirLink(link) {
        Linking.openURL(link);
    }

    function formatarPreco(preco) {
        if (!preco) return "—";
        return `R$ ${Number(preco).toFixed(2).replace(".", ",")}`;
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.titulo}>Busca Inteligente de Peças</Text>
                <Text style={styles.subtitulo}>
                    Use a IA para encontrar peças pela placa do veículo ou foto
                    da peça.
                </Text>
            </View>

            {/* Card: consulta de veículo */}
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.cardTitulo}>1. Consultar veículo</Text>

                    <TextInput
                        label="Digite a placa"
                        value={placa}
                        onChangeText={setPlaca}
                        mode="outlined"
                        autoCapitalize="characters"
                        style={styles.input}
                    />

                    <Button
                        mode="contained"
                        onPress={buscarVeiculo}
                        buttonColor="#0f5132"
                        style={styles.botao}
                        disabled={loadingVeiculo}
                    >
                        {loadingVeiculo ? "Buscando..." : "Buscar dados do veículo"}
                    </Button>

                    {loadingVeiculo && (
                        <ActivityIndicator
                            color="#0f5132"
                            style={{ marginTop: 12 }}
                        />
                    )}
                </Card.Content>
            </Card>

            {/* Card: veículo encontrado */}
            {carroEncontrado && (
                <Card style={styles.cardVeiculo}>
                    <Card.Content>
                        <Text style={styles.cardTitulo}>Veículo encontrado</Text>
                        <Text style={styles.info}>Placa: {carroEncontrado.placa}</Text>
                        <Text style={styles.info}>Marca: {carroEncontrado.marca}</Text>
                        <Text style={styles.info}>Modelo: {carroEncontrado.modelo}</Text>
                        <Text style={styles.info}>Ano: {carroEncontrado.ano}</Text>
                        {carroEncontrado.cor && (
                            <Text style={styles.info}>Cor: {carroEncontrado.cor}</Text>
                        )}
                        {carroEncontrado.municipio && (
                            <Text style={styles.info}>Município: {carroEncontrado.municipio}</Text>
                        )}
                    </Card.Content>
                </Card>
            )}

            {/* Card: pesquisa de peça */}
            {carroEncontrado && (
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.cardTitulo}>2. Pesquisar peça</Text>

                        {/* Seção de foto */}
                        <Text style={styles.labelSecao}>
                            📷 Fotografar a peça (opcional)
                        </Text>

                        {fotoPeca ? (
                            <View style={styles.previewContainer}>
                                <Image
                                    source={{ uri: fotoPeca }}
                                    style={styles.previewImagem}
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    style={styles.botaoRemoverFoto}
                                    onPress={removerFoto}
                                >
                                    <Text style={styles.textoRemoverFoto}>
                                        ✕ Remover foto
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.botoesCamera}>
                                <Button
                                    mode="outlined"
                                    onPress={abrirCamera}
                                    textColor="#0f5132"
                                    style={styles.botaoCamera}
                                    icon="camera"
                                >
                                    Câmera
                                </Button>
                                <Button
                                    mode="outlined"
                                    onPress={abrirGaleria}
                                    textColor="#0f5132"
                                    style={styles.botaoCamera}
                                    icon="image"
                                >
                                    Galeria
                                </Button>
                            </View>
                        )}

                        {/* Divisor "ou" */}
                        <View style={styles.ouContainer}>
                            <View style={styles.linhaOu} />
                            <Text style={styles.textoOu}>
                                {fotoPeca ? "ou adicione o nome também" : "ou"}
                            </Text>
                            <View style={styles.linhaOu} />
                        </View>

                        {/* Campo de texto */}
                        <TextInput
                            label="Ex: kit correia dentada, filtro de óleo..."
                            value={peca}
                            onChangeText={setPeca}
                            mode="outlined"
                            style={styles.input}
                        />

                        <Button
                            mode="contained"
                            onPress={pesquisarPeca}
                            buttonColor="#198754"
                            style={styles.botao}
                            icon="magnify"
                            disabled={loadingPeca}
                        >
                            {loadingPeca ? "Buscando com IA..." : "Procurar peça com IA"}
                        </Button>

                        {loadingPeca && (
                            <ActivityIndicator
                                color="#198754"
                                style={{ marginTop: 12 }}
                            />
                        )}
                    </Card.Content>
                </Card>
            )}

            {/* Peça identificada pela IA (quando vier da foto) */}
            {pecaIdentificada && (
                <Card style={styles.cardPecaIA}>
                    <Card.Content>
                        <Text style={styles.cardTitulo}>🤖 Peça identificada pela IA</Text>
                        <Text style={styles.info}>Nome: {pecaIdentificada.name}</Text>
                        {pecaIdentificada.brand && (
                            <Text style={styles.info}>Marca: {pecaIdentificada.brand}</Text>
                        )}
                        {pecaIdentificada.part_number && (
                            <Text style={styles.info}>Part number: {pecaIdentificada.part_number}</Text>
                        )}
                        {pecaIdentificada.confidence && (
                            <Text style={styles.info}>
                                Confiança: {Math.round(pecaIdentificada.confidence * 100)}%
                            </Text>
                        )}
                    </Card.Content>
                </Card>
            )}

            {/* Resultados */}
            {resultados.length > 0 && (
                <View style={styles.resultadosArea}>
                    <Text style={styles.resultadosTitulo}>
                        {resultados.length} resultado{resultados.length > 1 ? "s" : ""} encontrado{resultados.length > 1 ? "s" : ""}
                    </Text>

                    {resultados.map((item, index) => (
                        <Card key={item.id || index} style={styles.cardResultado}>
                            <Card.Content>
                                <View style={styles.linhaTopo}>
                                    <Chip style={styles.chip}>
                                        {item.seller_reputation
                                            ? item.seller_reputation.toUpperCase()
                                            : `#${index + 1}`}
                                    </Chip>
                                    {item.score && (
                                        <Chip style={[styles.chip, { marginLeft: 8 }]}>
                                            Score: {(item.score * 100).toFixed(0)}%
                                        </Chip>
                                    )}
                                </View>

                                <Text style={styles.nomePeca}>{item.title}</Text>

                                <Divider style={styles.divisor} />

                                {item.seller_name && (
                                    <Text style={styles.info}>Loja: {item.seller_name}</Text>
                                )}
                                {item.total_price && (
                                    <Text style={styles.preco}>
                                        {formatarPreco(item.total_price)}
                                    </Text>
                                )}

                                <Button
                                    mode="contained"
                                    onPress={() => abrirLink(item.url)}
                                    buttonColor="#0f5132"
                                    style={styles.botaoComprar}
                                >
                                    Ver produto
                                </Button>
                            </Card.Content>
                        </Card>
                    ))}
                </View>
            )}
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

    cardVeiculo: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 20,
        backgroundColor: "#e9f7ef",
    },

    cardPecaIA: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 20,
        backgroundColor: "#e8f4fd",
    },

    cardTitulo: {
        color: "#0f5132",
        fontSize: 19,
        fontWeight: "bold",
        marginBottom: 12,
    },

    input: {
        marginBottom: 14,
        backgroundColor: "#fff",
    },

    botao: {
        borderRadius: 12,
        paddingVertical: 4,
    },

    info: {
        fontSize: 15,
        color: "#444",
        marginBottom: 6,
    },

    // Câmera
    labelSecao: {
        fontSize: 15,
        color: "#0f5132",
        fontWeight: "600",
        marginBottom: 10,
    },

    botoesCamera: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 4,
    },

    botaoCamera: {
        flex: 1,
        borderColor: "#0f5132",
        borderRadius: 12,
    },

    previewContainer: {
        alignItems: "center",
        marginBottom: 4,
    },

    previewImagem: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        marginBottom: 8,
    },

    botaoRemoverFoto: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        backgroundColor: "#f8d7da",
        borderRadius: 8,
    },

    textoRemoverFoto: {
        color: "#842029",
        fontWeight: "600",
        fontSize: 13,
    },

    ouContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 14,
    },

    linhaOu: {
        flex: 1,
        height: 1,
        backgroundColor: "#ccc",
    },

    textoOu: {
        marginHorizontal: 10,
        color: "#888",
        fontSize: 13,
    },

    // Resultados
    resultadosArea: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },

    resultadosTitulo: {
        color: "#0f5132",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 14,
    },

    cardResultado: {
        borderRadius: 20,
        backgroundColor: "#fff",
        marginBottom: 16,
    },

    linhaTopo: {
        flexDirection: "row",
        marginBottom: 10,
    },

    chip: {
        backgroundColor: "#d1e7dd",
    },

    nomePeca: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#212529",
    },

    divisor: {
        marginVertical: 12,
    },

    preco: {
        fontSize: 22,
        color: "#198754",
        fontWeight: "bold",
        marginTop: 8,
    },

    botaoComprar: {
        marginTop: 14,
        borderRadius: 12,
        paddingVertical: 4,
    },
});