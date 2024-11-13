import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { CreateIcon } from "@/assets/images/create";
import { NotificationIcon } from "@/assets/images/Notification";

const Header = () => {
  const params = useLocalSearchParams();

  const title = params.title || 'Home';

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.iconContainer}>
        <NotificationIcon />
        <CreateIcon />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconContainer: {
    width: '20%',
    overflow: 'visible',
    flexDirection: 'row',
  },
});



export default Header;
