import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../../../shared/services/apiClient";
import { useAuth } from "../../../feature/auth/hooks/useAuth";

interface User {
  name?: string;
  id?: number;
  role?: string;
  wholesalerId?: number;
}

const CreateUserForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState<"ADMIN" | "WHOLESALER" | "RETAILER">(
    "RETAILER"
  );
  const [wholesalers, setWholesalers] = useState<any[]>([]);
  const [selectedWholesaler, setSelectedWholesaler] = useState<string>("");

  const { user } = useAuth() as { user: User | null };
  const navigation = useNavigation();

  // Fetch wholesalers only if ADMIN is creating a RETAILER
  useEffect(() => {
    if (user?.role === "ADMIN" && role === "RETAILER") {
      apiClient
        .get("/api/admin/listWholesalers")
        .then((res) => {
          setWholesalers(res.data || []);
        })
        .catch((err) => {
          console.error("❌ Wholesalers fetch error:", err);
          Alert.alert("Error", "Failed to fetch wholesalers");
        });
    }
  }, [role, user]);

  // Auto-assign wholesaler if current user is WHOLESALER
  useEffect(() => {
    if (user?.role === "WHOLESALER") {
      setRole("RETAILER"); // wholesalers can create only retailers
      setSelectedWholesaler(String(user.wholesalerId));
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!name || !mobile) {
      Alert.alert("Validation", "Name and Mobile are required");
      return;
    }
    if (role === "RETAILER" && !selectedWholesaler) {
      Alert.alert("Validation", "Wholesaler not selected");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name,
        mobile,
        role,
        wholesalerId:
          role === "RETAILER" ? Number(selectedWholesaler) : undefined,
      };

      console.log("📤 Sending payload:", payload);

      await apiClient.post("/api/user/createUser", payload);

      Alert.alert("Success", "User created successfully");

      // Reset form
      setName("");
      setMobile("");
      if (user?.role === "ADMIN") {
        setRole("RETAILER");
        setSelectedWholesaler("");
      }
    } catch (err: any) {
      console.error("❌ Create user error:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.error || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.leftButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>User Management</Text>
        <View style={styles.headerButtons}></View>
      </View>

      <Text style={styles.title}>Create User</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        maxLength={10}
        value={mobile}
        onChangeText={(text) => setMobile(text.replace(/\D/g, ""))}
      />

      {/* Role selection → only if user is ADMIN */}
      {user?.role === "ADMIN" && (
        <>
          <Text style={styles.label}>Role:</Text>
          <View style={styles.roleContainer}>
            {["ADMIN", "WHOLESALER", "RETAILER"].map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleButton, role === r && styles.roleSelected]}
                onPress={() => setRole(r as any)}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === r && styles.roleTextSelected,
                  ]}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Wholesaler Selection Logic */}
      {role === "RETAILER" && (
        <View>
          <Text style={styles.label}>Select Wholesaler:</Text>
          {user?.role === "ADMIN" ? (
            wholesalers.length ? (
              wholesalers.map((w, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.roleButton,
                    selectedWholesaler === String(w.wholesaler?.id) &&
                      styles.roleSelected,
                  ]}
                  onPress={() =>
                    setSelectedWholesaler(String(w.wholesaler?.id))
                  }
                >
                  <Text
                    style={[
                      styles.roleText,
                      selectedWholesaler === String(w.wholesaler?.id) &&
                        styles.roleTextSelected,
                    ]}
                  >
                    {w.wholesaler?.name || "Unnamed"}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ color: "#888", marginTop: 5 }}>
                No wholesalers available
              </Text>
            )
          ) : (
            <Text style={{ fontWeight: "bold", color: "#6b21a8" }}>
              Linked to your wholesaler (ID: {user?.wholesalerId}){" "} {user?.name}
            </Text>
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Create User</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateUserForm;


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
header: {
  marginBottom: 16,
  padding: 12,
  borderRadius: 12,
  backgroundColor: "#f3e8ff",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
},
headerText: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#6b21a8",
  flex: 1,
  textAlign: "center",
},
leftButton: {
  backgroundColor: "#a855f7",
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 8,
  marginRight: 8,
},
headerButtons: {
  flexDirection: "row",
  marginLeft: 8,
},
buttonText: { color: "#fff", fontWeight: "600" },
  button: {
    backgroundColor: "#a855f7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6b21a8",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  label: { fontSize: 14, fontWeight: "bold", marginVertical: 6 },
  roleContainer: { flexDirection: "row", marginBottom: 12, flexWrap: "wrap" },
  roleButton: {
    borderWidth: 1,
    borderColor: "#a855f7",
    padding: 8,
    marginRight: 10,
    marginTop: 5,
    borderRadius: 6,
  },
  roleSelected: { backgroundColor: "#a855f7" },
  roleText: { color: "#6b21a8", fontWeight: "bold" },
  roleTextSelected: { color: "#fff" },
  submitBtn: {
    backgroundColor: "#a855f7",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "bold" },
});
