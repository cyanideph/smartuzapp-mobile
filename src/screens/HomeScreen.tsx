
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const MenuButton = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <Feather name={icon} size={24} color="#1ab94d" />
      <Text style={styles.menuButtonText}>{label}</Text>
    </TouchableOpacity>
  );
};

const NavButton = ({ icon, label, active, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.navButton, active && styles.navButtonActive]}
      onPress={onPress}
    >
      <Feather name={icon} size={20} color={active ? "#1ab94d" : "#666"} />
      <Text style={[
        styles.navButtonText,
        active && styles.navButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  
  const menuCategories = [
    {
      title: "Communication",
      items: [
        { icon: "users", label: "Buddies", onPress: () => console.log('Buddies pressed') },
        { icon: "user-plus", label: "Add Buddy", onPress: () => console.log('Add Buddy pressed') },
        { icon: "message-square", label: "Messages", onPress: () => console.log('Messages pressed') },
        { icon: "users", label: "Chatrooms", onPress: () => console.log('Chatrooms pressed') },
        { icon: "plus-circle", label: "Create Room", onPress: () => console.log('Create Room pressed') },
        { icon: "globe", label: "Connections", onPress: () => console.log('Connections pressed') },
      ]
    },
    {
      title: "Account",
      items: [
        { icon: "user", label: "Profile", onPress: () => console.log('Profile pressed') },
        { icon: "settings", label: "Settings", onPress: () => console.log('Settings pressed') },
        { icon: "message-circle", label: "Status", onPress: () => console.log('Status pressed') },
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome, User!</Text>
        <Text style={styles.headerSubtitle}>What would you like to do today?</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {menuCategories.map((category, idx) => (
          <View key={idx} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.menuGrid}>
              {category.items.map((menuItem, i) => (
                <MenuButton
                  key={i}
                  icon={menuItem.icon}
                  label={menuItem.label}
                  onPress={menuItem.onPress}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.navbar}>
        <NavButton
          icon="user"
          label="Profile"
          active={activeTab === 'profile'}
          onPress={() => setActiveTab('profile')}
        />
        <NavButton
          icon="users"
          label="Buddies"
          active={activeTab === 'buddies'}
          onPress={() => setActiveTab('buddies')}
        />
        <NavButton
          icon="message-square"
          label="Chat"
          active={activeTab === 'chat'}
          onPress={() => setActiveTab('chat')}
        />
        <NavButton
          icon="settings"
          label="Settings"
          active={activeTab === 'settings'}
          onPress={() => setActiveTab('settings')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1ab94d',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuButton: {
    backgroundColor: 'white',
    width: '48%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuButtonText: {
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  navbar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  navButtonActive: {
    backgroundColor: 'rgba(26, 185, 77, 0.1)',
  },
  navButtonText: {
    fontSize: 12,
    marginTop: 2,
    color: '#666',
  },
  navButtonTextActive: {
    color: '#1ab94d',
    fontWeight: '500',
  },
});

export default HomeScreen;
