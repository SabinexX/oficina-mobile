import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Linking } from "react-native";
import {
    Text,
    Card,
    TextInput,
    Button,
    Chip,
    Divider,
} from "react-native-paper";

export default function BuscaPecasIAScreen() {
    const [placa, setPlaca] = useState("");
    const [peca, setPeca] = useState("");
    const [carroEncontrado, setCarroEncontrado] = useState(null);
    const [resultados, setResultados] = useState([]);

    function buscarVeiculo() {
        setCarroEncontrado({
            placa: placa.toUpperCase(),
            modelo: "Ford Ka",
            motor: "1.5 3cc 12V Dragon",
            ano: "2019",
            combustivel: "Flex",
        });
    }

    function pesquisarPeca() {
        setResultados([
            {
                id: "1",
                tipo: "Mais em conta",
                nome: `${peca} - Marca Econômica`,
                marca: "Similar",
                preco: "R$ 185,00",
                loja: "Auto Peças Brasil",
                link: "https://www.mercadolivre.com.br",
            },
            {
                id: "2",
                tipo: "Melhor qualidade",
                nome: `${peca} - Marca Genuina`,
                marca: "Original / Premium",
                preco: "R$ 320,00",
                loja: "Peças Online",
                link: "https://www.mercadolivre.com.br/correia-dentada--tensor-fiesta-ka-eco-focus-15-16-sigma/up/MLBU3027998900?pdp_filters=item_id%3AMLB5293498778&from=gshop&matt_tool=99302748&matt_word=&matt_source=google&matt_campaign_id=22090193915&matt_ad_group_id=174661990484&matt_match_type=&matt_network=g&matt_device=c&matt_creative=727914181621&matt_keyword=&matt_ad_position=&matt_ad_type=pla&matt_merchant_id=5678056849&matt_product_id=MLBU3027998900&matt_product_partition_id=2389849241885&matt_target_id=aud-1966873223882:pla-2389849241885&cq_src=google_ads&cq_cmp=22090193915&cq_net=g&cq_plt=gp&cq_med=pla&gad_source=1&gad_campaignid=22090193915&gbraid=0AAAAAD93qcDwOeQmA9L7NWKAsjfn_JuEI&gclid=Cj0KCQjwk_bPBhDXARIsACiq8R2UFG-fniUayym4uDSQlEmFXa_otdy3sUph4wc-cXAXyXM9t9pVNkYaArAsEALw_wcB",
            },
            {
                id: "3",
                tipo: "Outra marca",
                nome: `${peca} - Marca Alternativa`,
                marca: "Paralela",
                preco: "R$ 240,00",
                loja: "Marketplace",
                link: "https://www.mercadolivre.com.br",
            },
        ]);
    }

    function abrirLink(link) {
        Linking.openURL(link);
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.titulo}>Busca Inteligente de Peças</Text>
                <Text style={styles.subtitulo}>
                    Simulação da tela com IA para encontrar peças pela placa do veículo.
                </Text>
            </View>

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
                    >
                        Buscar dados do veículo
                    </Button>
                </Card.Content>
            </Card>

            {carroEncontrado && (
                <Card style={styles.cardVeiculo}>
                    <Card.Content>
                        <Text style={styles.cardTitulo}>Veículo encontrado</Text>

                        <Text style={styles.info}>Placa: {carroEncontrado.placa}</Text>
                        <Text style={styles.info}>Modelo: {carroEncontrado.modelo}</Text>
                        <Text style={styles.info}>Motor: {carroEncontrado.motor}</Text>
                        <Text style={styles.info}>Ano: {carroEncontrado.ano}</Text>
                        <Text style={styles.info}>
                            Combustível: {carroEncontrado.combustivel}
                        </Text>
                    </Card.Content>
                </Card>
            )}

            {carroEncontrado && (
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.cardTitulo}>2. Pesquisar peça</Text>

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
                        >
                            Procurar peça com IA
                        </Button>
                    </Card.Content>
                </Card>
            )}

            {resultados.length > 0 && (
                <View style={styles.resultadosArea}>
                    <Text style={styles.resultadosTitulo}>Resultados encontrados</Text>

                    {resultados.map((item) => (
                        <Card key={item.id} style={styles.cardResultado}>
                            <Card.Content>
                                <View style={styles.linhaTopo}>
                                    <Chip style={styles.chip}>{item.tipo}</Chip>
                                </View>

                                <Text style={styles.nomePeca}>{item.nome}</Text>

                                <Divider style={styles.divisor} />

                                <Text style={styles.info}>Marca: {item.marca}</Text>
                                <Text style={styles.info}>Loja: {item.loja}</Text>
                                <Text style={styles.preco}>{item.preco}</Text>

                                <Button
                                    mode="contained"
                                    onPress={() => abrirLink(item.link)}
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