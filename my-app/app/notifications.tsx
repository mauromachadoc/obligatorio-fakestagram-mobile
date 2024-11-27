import React, { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { getNotifications } from "../api/notifications";
import { Notification as NotificationType } from "@/types";
import Notification from "@/components/notification";

interface NotificationsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Notifications: FC<NotificationsProps> = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const handleGetNotifications = async () => {
    const response = await getNotifications();
    setNotifications(response);
  };

  useEffect(() => {
    handleGetNotifications();
  }, []);

  const closeNotifications = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={closeNotifications}>
          <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
        renderItem={({ item }: { item: NotificationType }) => (
          <Notification
            profilePic={item?.fromUserId?.profilePicture}
            type={item.type}
            createdAt={item.createdAt}
            userFrom={item?.fromUserId}
            postId={item?.postId}
          />
        )}
        keyExtractor={(item, index) => `${item._id || index}`}
        contentContainerStyle={styles.notificationsList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
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
