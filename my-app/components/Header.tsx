import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import { CreateIcon } from "@/assets/images/create";
import { NotificationIcon } from "@/assets/images/Notification";
import { useData } from "@/contexts/userData";
import { useRoute } from "@react-navigation/native";

const Header = () => {
  const { data } = useData();

  const title = data.title || 'home';

  const handlePressCreate = () => {
    router.push('/createPost')
  }

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.iconContainer}>
        <NotificationIcon />
        <Pressable onPress={handlePressCreate} >
          <CreateIcon />
        </Pressable>
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
    gap: 16,
    flexDirection: 'row',
  },
});



export default Header;
