import React, { FC } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type ProfileButtonsProps = {
  profileId: string;
  userAdded: boolean;
  handleAddUser: () => void;
  handleEditProfile: () => void;
};

const ProfileButtons: FC<ProfileButtonsProps> = ({ profileId, userAdded, handleAddUser, handleEditProfile }) => {

  return (
    <View style={styles.profileButtons}>
      {profileId ? (
        <TouchableOpacity style={styles.button} onPress={handleAddUser}>
          <Text style={styles.buttonText}>{userAdded ? 'Desagregar' : 'Agregar'}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => handleEditProfile()}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ProfileButtons;
