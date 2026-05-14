import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import OficinaScreen from "../screens/OficinaScreen";
import BuscaPecasIAScreen from "../screens/BuscaPecasIAScreen";
import HistoricoScreen from "../screens/HistoricoScreen";

import OrcamentosScreen from "../screens/OrcamentosScreen";
import NovoOrcamentoScreen from "../screens/NovoOrcamentoScreen";
import ClientesScreen from "../screens/ClientesScreen";
import CarrosScreen from "../screens/CarrosScreen";
import DetalhesHistoricoScreen from "../screens/DetalhesHistoricoScreen";
import AgendamentosScreen from "../screens/AgendamentosScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function OficinaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OficinaHome" component={OficinaScreen} />

      <Stack.Screen name="OrcamentosLista" component={OrcamentosScreen} />

      <Stack.Screen name="NovoOrcamento" component={NovoOrcamentoScreen} />

      <Stack.Screen name="Clientes" component={ClientesScreen} />

      <Stack.Screen name="Carros" component={CarrosScreen} />
    </Stack.Navigator>
  );
}

function FinanceiroStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistoricoHome" component={HistoricoScreen} />

      <Stack.Screen name="DetalhesHistorico" component={DetalhesHistoricoScreen} />

      <Stack.Screen name="NovoOrcamento" component={NovoOrcamentoScreen} />
    </Stack.Navigator>
  );
}

function EstoqueScreen() {
  return (
    <HomeScreen
      telaTemporaria
      titulo="Estoque"
      descricao="Tela reservada para o estoque da oficina."
    />
  );
}

function InicioStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePrincipal" component={HomeScreen} />

      <Stack.Screen
        name="Agendamentos"
        component={AgendamentosScreen}
      />
    </Stack.Navigator>
  );
}

export default function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          height: 72,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
        },

        tabBarActiveTintColor: "#0f5132",
        tabBarInactiveTintColor: "#777",
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={InicioStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-variant"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Oficina"
        component={OficinaStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="garage" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="IA Peças"
        component={BuscaPecasIAScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="robot-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Financeiro"
        component={FinanceiroStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="finance" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Estoque"
        component={EstoqueScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="package-variant-closed"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}