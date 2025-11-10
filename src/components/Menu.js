import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ModalConfirmacao from "./ModalConfirmacao";
import * as SecureStore from "expo-secure-store";

export default function Menu({ visible, onClose }) {
  const navigation = useNavigation();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [tipo, setTipo] = useState("user");

  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    const fetchTipo = async () => {
      const tipo = await SecureStore.getItemAsync("tipo");
      setTipo(tipo || "user");
    };
    fetchTipo();
  }, []);

  const handleNavigate = (screen) => {
    onClose();
    navigation.navigate(screen);
  };

  const abrirModal = () => {
    setConfirmVisible(true);
  };

  const confirmar = () => {
    setConfirmVisible(false);
    handleNavigate("Login");
  };

  const cancelar = () => {
    setConfirmVisible(false);
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <SafeAreaView style={styles.overlay}>
        <View
          style={[
            styles.menu,
            {
              width: width * 0.7, // 70% da largura da tela
              paddingTop: Platform.OS === "android" ? height * 0.03 : height * 0.02,
            },
          ]}
        >
          <TouchableOpacity onPress={() => handleNavigate("Home")}>
            <Text style={styles.item}>HOME</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleNavigate("Perfil")}>
            <Text style={styles.item}>PERFIL</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleNavigate("MinhasReservas")}>
            <Text style={styles.item}>MINHAS RESERVAS</Text>
          </TouchableOpacity>

          {tipo === "admin" && (
            <>
              <TouchableOpacity onPress={() => handleNavigate("TodasReservas")}>
                <Text style={styles.item}>TODAS RESERVAS</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleNavigate("Cadastro")}>
                <Text style={styles.item}>CADASTRAR USUÁRIO</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleNavigate("ListUser")}>
                <Text style={styles.item}>VISUALIZAR USUÁRIOS</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleNavigate("CriarSala")}>
                <Text style={styles.item}>CRIAR SALA</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={abrirModal}>
            <Text style={[styles.item, { borderBottomWidth: 0 }]}>SAIR</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.closeArea} onPress={onClose} />

        <ModalConfirmacao
          visible={confirmVisible}
          onConfirm={confirmar}
          onCancel={cancelar}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menu: {
    backgroundColor: "#CC1E1E",
    paddingHorizontal: 20,
    paddingBottom: 30,
    justifyContent: "flex-start",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 10,
  },
  closeArea: {
    flex: 1,
  },
  item: {
    color: "#fff",
    fontSize: 18,
    marginVertical: 10,
    paddingVertical: 8,
    borderBottomWidth: 0.6,
    borderBottomColor: "rgba(255,255,255,0.6)",
  },
});
