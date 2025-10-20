import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import MenuLateral from "./Menu";

export default function Header({ header }) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View>
      {header === 1 ? (
        <View style={styles.header} />
      ) : (
        <View style={styles.headerLogo}>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <FontAwesome name="user-circle-o" size={26} color="white" style={styles.icon} />
          </TouchableOpacity>
          <MenuLateral visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#CC1E1E",
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogo: {
    flexDirection: "row",
    backgroundColor: "#CC1E1E",
    width: "100%",
    height: 70,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  icon: {
    marginLeft: 10,
    marginBottom: 7,
  },
});
