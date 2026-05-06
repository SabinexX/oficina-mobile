import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import NovoOrcamentoScreen from "../screens/NovoOrcamentoScreen";
import ClientesScreen from "../screens/ClientesScreen";
import HistoricoScreen from "../screens/HistoricoScreen";
import OrcamentosScreen from "../screens/OrcamentosScreen";

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
    return (
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
        </Stack.Navigator>
    );
}