import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../../../shared/services/apiClient";

type User = {
  id: number;
  name: string;
  mobile: string;
  role: string;
  retailerLinks?: {
    wholesaler?: {
      name: string;
    };
    wholesalerId?: number;
  }[];
};

const RoleUserList = () => {
  const navigation = useNavigation();
  const [activeRole, setActiveRole] = useState<"wholesalers" | "retailers" | "admins">("wholesalers");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const roleApiMap = {
    wholesalers: "listWholesalers",
    retailers: "listRetailers",
    admins: "listAdmins",
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const endpoint = roleApiMap[activeRole];
        const res = await apiClient.get(`/api/admin/${endpoint}`);
        console.log("Fetched users:", res.data);
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch users:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [activeRole]);

 const columnsMap = {
  wholesalers: [
    { key: "no", label: "No." },
    { key: "name", label: "Name" },
    { key: "mobile", label: "Mobile" },
  ],
  retailers: [
    { key: "no", label: "No." },
    { key: "name", label: "Name" },
    { key: "mobile", label: "Mobile" },
    { key: "wholesaler", label: "Wholesaler" }, // Only for retailers
  ],
  admins: [
    { key: "no", label: "No." },
    { key: "name", label: "Name" },
    { key: "mobile", label: "Mobile" },
  ],
};

const getCellValue = (item: User, key: string) => {
  switch (key) {
    case "no":
      return null; // Will be handled in renderUser
    case "name":
      return item.name;
    case "mobile":
      return item.mobile;
    case "role":
      return item.role;
    case "wholesaler":
      return item.retailerLinks && item.retailerLinks[0]?.wholesaler?.name
        ? item.retailerLinks[0].wholesaler.name
        : "--";
    default:
      return "";
  }
};

const renderUser = ({ item, index }: { item: User; index: number }) => (
  <View style={styles.row}>
    {columnsMap[activeRole].map((col) => (
      <Text
        style={[styles.cell, col.key === "no" && styles.cellNo]}
        key={col.key}
      >
        {col.key === "no" ? index + 1 : getCellValue(item, col.key)}
      </Text>
    ))}
  </View>
);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>User Management</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("createUser" as never)}
          >
            <Text style={styles.buttonText}>Create User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Role Tabs */}
      <View style={styles.tabContainer}>
        {(["wholesalers", "retailers", "admins"] as const).map((role) => (
          <TouchableOpacity
            key={role}
            style={[
              styles.tab,
              activeRole === role ? styles.tabActive : styles.tabInactive,
            ]}
            onPress={() => setActiveRole(role)}
          >
            <Text
              style={
                activeRole === role ? styles.tabTextActive : styles.tabTextInactive
              }
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    {/* User Table */}
{loading ? (
  <ActivityIndicator size="large" color="#9333ea" style={{ marginTop: 20 }} />
) : users.length === 0 ? (
  <Text style={styles.noData}>No {activeRole} found.</Text>
) : (
  <View style={styles.table}>
   <View style={[styles.row, styles.headerRow]}>
  {columnsMap[activeRole].map((col) => (
    <Text
      style={[styles.cell, col.key === "no" && styles.cellNo]}
      key={col.key}
    >
      {col.label}
    </Text>
  ))}
</View>
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderUser}
    />
  </View>
)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f3e8ff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#6b21a8" },
  headerButtons: { flexDirection: "row", gap: 8 },
  button: {
    backgroundColor: "#a855f7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  tabContainer: { flexDirection: "row", marginBottom: 16, gap: 8 },
  tab: { flex: 1, padding: 10, borderRadius: 8, alignItems: "center" },
  tabActive: { backgroundColor: "#a855f7" },
  tabInactive: { backgroundColor: "#f3e8ff" },
  tabTextActive: { color: "#fff", fontWeight: "bold" },
  tabTextInactive: { color: "#6b21a8", fontWeight: "bold" },
  table: { borderWidth: 1, borderColor: "#f0abfc", borderRadius: 8 },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3e8ff",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerRow: { backgroundColor: "#f3e8ff" },
  cell: { flex: 1, textAlign: "center" },
   cellNo: { flex: 0.4 },
  noData: { textAlign: "center", marginTop: 20, color: "#6b7280" },
});

export default RoleUserList;
