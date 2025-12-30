// src/pages/AdminDashboard/AdminDashboard.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  Modal,
  Animated,
  Dimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../feature/auth/hooks/useAuth";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get('window');

const AdminDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const navigation = useNavigation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(screenWidth * 0.8));
  const [overlayAnim] = useState(new Animated.Value(0));


  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout },
    ]);
  };

 const toggleSidebar = () => {
  if (sidebarVisible) {
    // Close
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: screenWidth * 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setSidebarVisible(false));
  } else {
    // Open
    setSidebarVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }
};


 const closeSidebar = () => {
  Animated.parallel([
    Animated.timing(slideAnim, {
      toValue: screenWidth * 0.8,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.timing(overlayAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }),
  ]).start(() => setSidebarVisible(false));
};


  const handleDeleteUser = () => {
    closeSidebar();
    Alert.alert(
      "Delete User",
      "This will navigate to user management where you can delete users.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Go to User Management",
          onPress: () => navigation.navigate("manageUsers" as never),
        },
      ]
    );
  };

  const handleSettings = () => {
    closeSidebar();
    Alert.alert("Settings", "Settings functionality coming soon...");
  };

  const handleReports = () => {
    closeSidebar();
    Alert.alert("Reports", "Reports functionality coming soon...");
  };

  const getInitials = (name?: string) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const renderSidebar = () => (
    <Modal
      visible={sidebarVisible}
      transparent={true}
      animationType="none"
      onRequestClose={closeSidebar}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
  style={[
    styles.modalBackground,
    { opacity: overlayAnim },
  ]}
>
  <TouchableOpacity
    style={{ flex: 1 }}
    activeOpacity={1}
    onPress={closeSidebar}
  />
</Animated.View>

        <Animated.View
          style={[
            styles.sidebar,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profilePicLarge}>
              <Text style={styles.profileInitialsLarge}>
                {getInitials(user?.name)}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.name || "Admin"}</Text>
            <Text style={styles.userRole}>Admin</Text>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeSidebar();
                navigation.navigate("manageUsers" as never);
              }}
            >
              {/* <Text style={styles.menuIcon}>👥</Text> */}
              <Text style={styles.menuText}>Manage Users</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleDeleteUser}
            >
              {/* <Text style={styles.menuIcon}>🗑️</Text> */}
              <Text style={styles.menuText}>Delete Users</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleReports}
            >
              {/* <Text style={styles.menuIcon}>📊</Text> */}
              <Text style={styles.menuText}>View Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleSettings}
            >
              {/* <Text style={styles.menuIcon}>⚙️</Text> */}
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={[styles.menuItem, styles.logoutMenuItem]}
              onPress={() => {
                closeSidebar();
                handleLogout();
              }}
            >
              {/* <Text style={styles.menuIcon}>🚪</Text> */}
              <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>सोने भाव (Sone Bhav) | Admin</Text>
          <TouchableOpacity style={styles.profilePic} onPress={toggleSidebar}>
            <Text style={styles.profileInitials}>
              {getInitials(user?.name)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
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

        {/* Reports 
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
      */}
        {/* Penalties
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
       */}
       
      </ScrollView>
      
      {/* Sidebar */}
      {renderSidebar()}
    </View>
  </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fdf2f8",
  },
  container: { flex: 1, backgroundColor: "#fdf2f8" },
  header: {
    backgroundColor: "#a855f7",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#fff", flex: 1 },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ec4899",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInitials: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  content: { 
    padding: 16, 
    paddingBottom: 30 
  },
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
  
  // Sidebar styles
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sidebar: {
    width: screenWidth * 0.8,
    backgroundColor: "#fff",
    height: "100%",
    elevation: 5,
    right: 0,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileSection: {
    backgroundColor: "#a855f7",
    padding: 20,
    alignItems: "center",
    paddingTop: 60,
  },
  profilePicLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ec4899",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileInitialsLarge: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
  },
  userName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userRole: {
    color: "#e5e7eb",
    fontSize: 14,
  },
  menuSection: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
  },
  menuText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#d1d5db",
    marginVertical: 10,
  },
  logoutMenuItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: "#ef4444",
  },
});