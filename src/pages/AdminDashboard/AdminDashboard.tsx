// src/pages/AdminDashboard/AdminDashboard.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../feature/auth/hooks/useAuth";

const AdminDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Gold Rate Broadcast | Admin</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>
          Welcome, {user?.name || "Admin"}
        </Text>

        {/* User Management */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Management</Text>
          <Text style={styles.cardDesc}>
            Approve new wholesalers and manage existing ones.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("manageUsers" as never)}
          >
            <Text style={styles.buttonText}>Manage Users</Text>
          </TouchableOpacity>
        </View>

        {/* Reports */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Reports</Text>
          <Text style={styles.cardDesc}>
            View system-wide reports and analytics.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Alert.alert("Reports", "Loading reports...")}
          >
            <Text style={styles.buttonText}>View Reports</Text>
          </TouchableOpacity>
        </View>

        {/* Penalties */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Penalty Management</Text>
          <Text style={styles.cardDesc}>
            Review and waive penalties for retailers.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Alert.alert("Penalties", "Opening penalties...")}
          >
            <Text style={styles.buttonText}>Manage Penalties</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf2f8" },
  header: {
    backgroundColor: "#a855f7",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  logoutBtn: { padding: 8 },
  logoutText: { color: "#fff", fontWeight: "bold" },
  content: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#6b21a8" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#6b21a8" },
  cardDesc: { fontSize: 14, color: "#4b5563", marginVertical: 8 },
  button: {
    backgroundColor: "#a855f7",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
