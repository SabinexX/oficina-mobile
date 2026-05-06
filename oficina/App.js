import React from "react";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";

import AppRoutes from "./src/routes/AppRoutes";
import HomeScreen from "./src/screens/HomeScreen";
import NovoOrcamentoScreen from "./src/screens/NovoOrcamentoScreen";

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </PaperProvider>
  );
}