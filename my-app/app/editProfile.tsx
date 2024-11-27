import { register } from '@/api/auth';
import { updateProfile } from '@/api/user';
import { getItem, removeItem, setItem } from '@/helpers/asyncStorage';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Image, Alert } from 'react-native';

type Form = {
  profilePicture: string;
  username: string;
};

const EditProfile = () => {
  const navigate = useNavigation();

  const [form, setForm] = useState<Form>({
    profilePicture: '',
    username: '',
  });

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getUserInfo = async () => {
    const user = await getItem('user');

    setForm(user);
  }

  const handleSubmit = async (form: Form) => {
    try {
      await updateProfile(form);

      await removeItem('user');
      await setItem('user', form);

      router.navigate('/');
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el perfil');
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    navigate.setOptions({
      headerRight: () => (
        <Pressable onPress={() => handleSubmit(form)}>
          <Text style={styles.headerButtonText}>Editar</Text>
        </Pressable>
      ),
    })
  }, [form]);

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Image
          source={{ uri: form.profilePicture }}
          style={{ width: 100, height: 100, borderRadius: 50, marginTop: 10 }}
        />
        <TextInput
          style={styles.input}
          value={form.profilePicture}
          onChangeText={(text) => handleChange('profilePicture', text)}
          placeholder="Foto de perfil"
        />
      </View>
      <View style={styles.field}>
        <TextInput
          style={styles.input}
          value={form.username}
          onChangeText={(text) => handleChange('username', text)}
          placeholder="Nombre de usuario"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    marginTop: 20,
  },
  text: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  highlightedText: {
    fontSize: 14,
    color: '#3897f0',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  field: {
    marginBottom: 20,
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
    alignItems: 'center',
    gap: 20,
    position: 'relative',
  },
  input: {
    borderColor: '#dbdbdb',
    borderWidth: 1,
    padding: 10,
    fontSize: 14,
    color: 'black',
    borderRadius: 3,
    backgroundColor: 'rgb(250, 250, 250)',
    width: '100%',
  },
  button: {
    backgroundColor: '#3897f0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    maxWidth: 300,
    alignSelf: 'center',
    width: '100%',
  },
  headerButtonText: {
    color: '#007AFF',
    fontSize: 16
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default EditProfile;
