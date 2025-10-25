import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "native-base";

const ManageUsers: React.FC = () => {
  const navigation = useNavigation();
  return (
     <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back to Admin</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Manage Users</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("createUser" as never)}
        >
          <Text style={styles.buttonText}>Create New User</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("roleUserList" as never)}
        >
          <Text style={styles.buttonText}>View Users by Role</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ManageUsers;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fdf2f8",
  },
  container: {
    flex: 1,
    backgroundColor: "#fdf2f8"
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  backBtn: {
    alignSelf: "flex-start",
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  backBtnText: {
    color: "#a855f7",
    fontWeight: "bold",
    fontSize: 16,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#6b21a8" },
  button: {
    backgroundColor: "#a855f7",
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});