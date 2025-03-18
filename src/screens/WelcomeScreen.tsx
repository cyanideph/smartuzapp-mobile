import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  useColorScheme,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Placeholder for logo component
const UzzapLogo = ({ size = "lg", showBeta = true }) => {
  return (
    <View style={styles.logoContainer}>
      <Text style={styles.logoText}>Uzzap</Text>
      {showBeta && <Text style={styles.betaText}>BETA</Text>}
    </View>
  );
};

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [theme, setTheme] = useState(isDark ? 'dark' : 'light');
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const menuOptions = [
    { 
      id: 'login', 
      label: 'Login to Network', 
      onPress: () => navigation.navigate('Login')
    },
    { 
      id: 'register', 
      label: 'Register a New Account', 
      onPress: () => console.log('Register pressed') 
    },
    { 
      id: 'forgot', 
      label: 'Forgotten ID/Password', 
      onPress: () => console.log('Forgot password pressed') 
    },
    { 
      id: 'help', 
      label: 'Help', 
      onPress: () => console.log('Help pressed') 
    },
    { 
      id: 'about', 
      label: 'About Uzzap', 
      onPress: () => console.log('About pressed') 
    },
    { 
      id: 'exit', 
      label: 'Exit Application', 
      onPress: () => Platform.OS === 'web' ? window.close() : console.log('Exit pressed') 
    },
  ];

  const backgroundColor = theme === 'dark' ? '#121212' : '#f5f5f5';
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.themeToggleContainer}>
        <TouchableOpacity 
          style={[styles.themeToggle, { backgroundColor: theme === 'dark' ? '#333' : '#e0e0e0' }]} 
          onPress={toggleTheme}
        >
          <Text>{theme === 'dark' ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.logoWrapper}>
          <UzzapLogo size="lg" showBeta={true} />
        </View>
        
        <View style={styles.menuContainer}>
          {menuOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.button,
                { backgroundColor: theme === 'dark' ? '#333' : '#fff' }
              ]}
              onPress={option.onPress}
            >
              <View style={styles.bulletPoint}>
                <View style={styles.bulletInner} />
              </View>
              <Text style={[styles.buttonText, { color: textColor }]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme === 'dark' ? '#888' : '#666' }]}>
          © 2023 Uzzap Messenger
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoWrapper: {
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1ab94d',
  },
  betaText: {
    fontSize: 12,
    color: '#1ab94d',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  menuContainer: {
    width: '100%',
    maxWidth: 400,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  bulletPoint: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bulletInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});

export default WelcomeScreen;
