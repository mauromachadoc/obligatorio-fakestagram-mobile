import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';

import { login } from "../../api/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const loginResponse = await login(form);

      AsyncStorage.setItem('user', JSON.stringify(loginResponse));
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <View style={styles.field}>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(text) => handleChange('email', text)}
          placeholder="Email Address"
        />
      </View>
      <View style={styles.field}>
        <TextInput
          style={styles.input}
          value={form.password}
          onChangeText={(text) => handleChange('password', text)}
          placeholder="Password"
          secureTextEntry
        />
      </View>
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Pressable style={styles.pressable} onPress={() => router.push({
        pathname: '/register',
      })}>
        <Text style={styles.text}>Don't have an account? <Text style={styles.highlightedText}>Register</Text></Text>
      </Pressable>


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
    justifyContent: 'center',
    paddingHorizontal: 20,
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
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Login;
