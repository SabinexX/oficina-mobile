import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import NovoOrcamentoScreen from "../screens/NovoOrcamentoScreen";
import ClientesScreen from "../screens/ClientesScreen";
import HistoricoScreen from "../screens/HistoricoScreen";
import OrcamentosScreen from "../screens/OrcamentosScreen";
import BuscaPecasIAScreen from "../screens/BuscaPecasIAScreen";
import CarrosScreen from "../screens/CarrosScreen";
import { NavigationContainer } from "@react-navigation/native";
import DetalhesHistoricoScreen from "../screens/DetalhesHistoricoScreen";

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="NovoOrcamento"
                    component={NovoOrcamentoScreen}
                    options={{
                        title: "Novo Orçamento",
                        headerStyle: {
                            backgroundColor: "#0f5132",
                        },
                        headerTintColor: "#fff",
                    }}
                />

                <Stack.Screen
                    name="Clientes"
                    component={ClientesScreen}
                    options={{
                        title: "Clientes",
                        headerStyle: {
                            backgroundColor: "#0f5132",
                        },
                        headerTintColor: "#fff",
                    }}
                />

                <Stack.Screen
                    name="Historico"
                    component={HistoricoScreen}
                    options={{
                        title: "Histórico",
                        headerStyle: {
                            backgroundColor: "#0f5132",
                        },
                        headerTintColor: "#fff",
                    }}
                />

                <Stack.Screen
                    name="DetalhesHistorico"
                    component={DetalhesHistoricoScreen}
                    options={{ title: "Detalhes do Serviço" }}
                />

                <Stack.Screen
                    name="Orcamentos"
                    component={OrcamentosScreen}
                    options={{
                        title: "Orçamentos",
                        headerStyle: {
                            backgroundColor: "#0f5132",
                        },
                        headerTintColor: "#fff",
                    }}
                />

                <Stack.Screen
                    name="BuscaPecasIA"
                    component={BuscaPecasIAScreen}
                    options={{
                        title: "Busca de Peças com IA",
                        headerStyle: {
                            backgroundColor: "#0f5132",
                        },
                        headerTintColor: "#fff",
                    }}
                />

                <Stack.Screen
                    name="Carros"
                    component={CarrosScreen}
                    options={{
                        title: "Carros",
                        headerStyle: {
                            backgroundColor: "#0f5132",
                        },
                        headerTintColor: "#fff",
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}