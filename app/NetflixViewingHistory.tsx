import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';

interface ViewingHistoryItem {
  title: string;
  movieID: number;
}

export default function NetflixViewingHistory() {
  const [viewingHistory, setViewingHistory] = useState<ViewingHistoryItem[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const fetchViewingHistory = async () => {
    try {
      const response = await fetch('http://localhost:3000/viewing-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const history = await response.json();
      setViewingHistory(history);
    } catch (error) {
      setError(error as Error);
    }
  };

  useEffect(() => {
    // Removed fetchViewingHistory() call from here
  }, []);

  const handleFetch = () => {
    fetchViewingHistory();
  };

  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={handleFetch}>
        <Text>Fetch Viewing History</Text>
      </TouchableOpacity>
      <FlatList
        data={viewingHistory}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
          </View>
        )}
        keyExtractor={(item) => item.movieID.toString()}
      />
    </View>
  );
}