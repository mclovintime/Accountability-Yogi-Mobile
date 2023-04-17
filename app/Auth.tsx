import React, { useState, ReactNode, useEffect } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

//fix the error Binding element 'route' implicitly has an 'any' on the route prop
interface AuthProps {
  setIsLoggedIn: (loggedIn: boolean) => void;
}

const Auth: React.FC<AuthProps> = ({ setIsLoggedIn }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500, // Change the duration to control the speed of the fade-in
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.status === 200) {
        const user = await response.json();
        console.log('Logged in:', user);
        // Handle successful login here
        setIsLoggedIn(true)

      } else {
        const error = await response.json();
        console.log('Login error:', error);
        // Handle login error
      }
    } catch (error) {
      console.log('Login error:', error);
      // Handle login error
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        mode: 'cors', // Add this line
        credentials: 'same-origin', // Add this line
      });
  
      if (response.status === 201) {
        const newUser = await response.json();
        console.log('Signed up:', newUser);
        // Handle successful signup
      } else {
        const error = await response.json();
        console.log('Signup error:', error);
        // Handle signup error
      }
    } catch (error) {
      console.log('Signup error:', error);
      // Handle signup error
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.container, opacity }}>
      <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={isSignUp ? handleSignUp : handleLogin}
        >
          <Text style={styles.submitButtonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
          
          
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchButton} onPress={toggleForm}>
          <Text style={styles.switchButtonText}>
            {isSignUp ? 'Switch to Login' : 'Switch to Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Helvetica Neue',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    width: 250,
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#333',
    borderRadius: 4,
    padding: 10,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  switchButton: {
    marginTop: 10,
  },
  switchButtonText: {
    color: '#333',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default Auth;