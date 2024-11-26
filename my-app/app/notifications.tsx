import React, { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Notification from "../components/notification"; 
import { getNotifications } from "../api/notifications";

interface NotificationsProps {
  isOpen: boolean; 
  setIsOpen: (isOpen: boolean) => void;
}

const Notifications: FC<NotificationsProps> = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);

  const handleGetNotifications = async () => {
    const response = await getNotifications();
    setNotifications(response);
  };

  useEffect(() => {
    handleGetNotifications();
  }, []);

  const renderNotification = ({ item }: { item: any }) => (
    <Notification
      profilePic={item.fromUserId.profilePicture}
      type={item.type}
      createdAt={item.createdAt}
      userFrom={item.fromUserId}
    />
  );

  const closeNotifications = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={closeNotifications}>
          <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item, index) => `${item._id || index}`}
        contentContainerStyle={styles.notificationsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    fontSize: 16,
    color: "#007BFF",
  },
  notificationsList: {
    padding: 20,
  },
});

export default Notifications;
