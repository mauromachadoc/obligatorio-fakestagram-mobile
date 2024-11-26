import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import ShowEditButton from './ShowEditButton';

const ProfileButtons = ({ profileId, userAdded, handleAddUser, handleEditProfile }) => {

  return (
    <View style={styles.profileButtons}>
      {profileId ? (
        <TouchableOpacity style={styles.button} onPress={handleAddUser}>
          <Text style={styles.buttonText}>{userAdded ? 'Desagregar' : 'Agregar'}</Text>
        </TouchableOpacity>
      ) : (
        <ShowEditButton handleEditProfile={handleEditProfile} />
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
