import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EditarUsuario() {
  const [cpf, setCpf] = useState("***.***.***-**");
  const [email, setEmail] = useState("adriano@docente.senai.br");
  const [senha, setSenha] = useState("******");

  return (
    <View style={styles.content}>
      <View style={styles.card}>
        {/* Ícone de usuário */}
        <Ionicons name="person-circle-outline" size={90} color="white" />
        <Text style={styles.nome}>NOME</Text>

        {/* Campo CPF */}
        <Text style={styles.label}>CPF</Text>
        <TextInput
          style={styles.input}
          value={cpf}
          editable={false} // CPF não editável
        />

        {/* Campo Email */}
        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        {/* Campo Senha */}
        <Text style={styles.label}>SENHA</Text>
        <TextInput
          style={styles.input}
          value={senha}
          secureTextEntry={true}
          onChangeText={setSenha}
        />

        {/* Botões */}
        <TouchableOpacity style={styles.btnEditar}>
          <Text style={styles.txtBtn}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnDeletar}>
          <Text style={styles.txtBtn}>Deletar Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#FCECEC", // fundo rosado claro
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#CC1E1E", // vermelho do card
    width: "90%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  nome: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  label: {
    alignSelf: "flex-start",
    color: "white",
    fontSize: 12,
    marginTop: 10,
    marginLeft: 5,
  },
  input: {
    backgroundColor: "#F5F5F5",
    width: "100%",
    borderRadius: 15,
    padding: 10,
    marginTop: 5,
  },
  btnEditar: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  btnDeletar: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  txtBtn: {
    color: "#CC1E1E",
    fontWeight: "bold",
  },
});
