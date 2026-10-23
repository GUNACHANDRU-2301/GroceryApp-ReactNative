
import 'react-native-gesture-handler';

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';

import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  useWindowDimensions,
} from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  NavigationContainer,
  createNavigationContainerRef,
  DrawerActions,
} from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

// ====================================================
// THEME AND DEMO DATA
// ====================================================

const COLORS = {
  bg: '#EAF7D2',
  cream: '#FFF8E8',
  yellow: '#F4D933',
  dark: '#293A20',
  muted: '#6D7964',
  olive: '#A6B487',
  white: '#FFFFFF',
  border: '#D5E0C4',
  red: '#E85C62',
};

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = '123456';


const PHOTOS = {
  Banana:
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500',

  Orange:
    'https://images.unsplash.com/photo-1547514701-42782101795e?w=500',

  Apple:
    'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500',

  Pineapple:
    'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500',

  Mango:
    'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500',

    
Tomato:
  'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',

Capsicum:
  'https://images.unsplash.com/photo-1621953723422-6023013f659d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
 

  Carrot:
    'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=500',

   Cabbage:
    'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500',
};


const START_PRODUCTS = [
  {
    id: '1',
    name: 'Banana',
    category: 'Fruits',
    price: 50,
    stock: 30,
    emoji: '🍌',
    description: 'Fresh, naturally sweet bananas.',
  },
  {
    id: '2',
    name: 'Orange',
    category: 'Fruits',
    price: 70,
    stock: 25,
    emoji: '🍊',
    description: 'Juicy oranges rich in vitamin C.',
  },
  {
    id: '3',
    name: 'Apple',
    category: 'Fruits',
    price: 150,
    stock: 20,
    emoji: '🍎',
    description: 'Crisp and delicious red apples.',
  },
  {
    id: '4',
    name: 'Pineapple',
    category: 'Fruits',
    price: 120,
    stock: 15,
    emoji: '🍍',
    description: 'Fresh tropical pineapple.',
  },
  {
    id: '5',
    name: 'Mango',
    category: 'Fruits',
    price: 140,
    stock: 20,
    emoji: '🥭',
    description: 'Sweet and juicy mangoes.',
  },
  {
    id: '6',
    name: 'Tomato',
    category: 'Vegetables',
    price: 40,
    stock: 35,
    emoji: '🍅',
    description: 'Fresh ripe tomatoes.',
  },
  {
    id: '7',
    name: 'Carrot',
    category: 'Vegetables',
    price: 60,
    stock: 25,
    emoji: '🥕',
    description: 'Crunchy healthy carrots.',
  },
  {
    id: '8',
    name: 'Capsicum',
    category: 'Vegetables',
    price: 100,
    stock: 20,
    emoji: '🫑',
    description: 'Fresh green capsicum.',
  },
  {
    id: '9',
    name: 'Cabbage',
    category: 'Vegetables',
    price: 30,
    stock: 40,
    emoji: '🥬',
    description: 'Fresh leafy cabbage.',
  },
];

// ====================================================
// NAVIGATION AND CONTEXT
// ====================================================

const Store = createContext(null);
const useStore = () => useContext(Store);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const navigationRef = createNavigationContainerRef();

const money = (n) => `₹${Number(n).toFixed(2)}`;

const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

// ====================================================
// REUSABLE COMPONENTS
// ====================================================

function Btn({
  title,
  onPress,
  secondary = false,
  danger = false,
  disabled = false,
  style,
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.btn,
        secondary && styles.btnSecondary,
        danger && styles.btnDanger,
        disabled && { opacity: 0.45 },
        style,
      ]}
    >
      <Text
        style={[
          styles.btnText,
          danger && { color: '#FFFFFF' },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function Field({
  label,
  value,
  onChangeText,
  secure = false,
  numeric = false,
  email = false,
}) {
  return (
    <View style={{ marginBottom: 13 }}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        placeholder={label}
        placeholderTextColor="#929A89"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        autoCapitalize={
          email || secure ? 'none' : 'sentences'
        }
        keyboardType={
          email
            ? 'email-address'
            : numeric
            ? 'numeric'
            : 'default'
        }
      />
    </View>
  );
}

function Page({ children }) {
  return (
    <SafeAreaView
      style={styles.screen}
      edges={['top', 'bottom']}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

function Header({
  navigation,
  title,
  back = false,
}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.round}
        onPress={() =>
          back
            ? navigation.goBack()
            : navigation.dispatch(
                DrawerActions.openDrawer()
              )
        }
      >
        <Text style={styles.headerIcon}>
          {back ? '‹' : '☰'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>
        {title}
      </Text>

      <Text style={{ fontSize: 24 }}>🛍️</Text>
    </View>
  );
}

function Empty({
  emoji = '🛒',
  message,
}) {
  return (
    <View style={styles.empty}>
      <Text style={{ fontSize: 60 }}>
        {emoji}
      </Text>

      <Text style={styles.muted}>
        {message}
      </Text>
    </View>
  );
}

function Photo({
  product,
  large = false,
}) {
  const [failed, setFailed] = useState(false);

  const uri =
    product.image || PHOTOS[product.name];

  useEffect(() => {
    setFailed(false);
  }, [uri]);

  if (!uri || failed) {
    return (
      <View
        style={[
          styles.photoFallback,
          large && styles.photoLarge,
        ]}
      >
        <Text
          style={{
            fontSize: large ? 110 : 65,
          }}
        >
          {product.emoji || '🥬'}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      resizeMode="contain"
      onError={() => setFailed(true)}
      style={[
        styles.photo,
        large && styles.photoLarge,
      ]}
    />
  );
}

// ====================================================
// WELCOME SCREEN
// ====================================================


function Welcome({ navigation }) {
  const { width } = useWindowDimensions();

  const scrollRef = useRef(null);
  const currentSlide = useRef(0);

  const [activeSlide, setActiveSlide] = useState(0);

  // 3 REAL FRUIT IMAGES
  const slides = [
    {
      id: 1,
      image:
        'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=900',
      title: 'Grocery Shop',
      subtitle:
        'The easiest way to buy your\ngrocery shopping',
    },
    {
      id: 2,
      image:
        'https://images.pexels.com/photos/264537/pexels-photo-264537.jpeg?auto=compress&cs=tinysrgb&w=900',
      title: 'Fresh & Healthy',
      subtitle:
        'Fresh fruits and vegetables\ndelivered with care',
    },
    {
      id: 3,
      image:
        'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=900',
      title: 'Shop Your Favorites',
      subtitle:
        'Choose fresh groceries\nanytime, anywhere',
    },
  ];

  // AUTOMATIC CAROUSEL - EVERY 3 SECONDS
  useEffect(() => {
    const timer = setInterval(() => {
      const next = (currentSlide.current + 1) % slides.length;

      currentSlide.current = next;
      setActiveSlide(next);

      scrollRef.current?.scrollTo({
        x: next * width,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [width]);

  // MANUAL SWIPE
  const handleScrollEnd = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );

    const safeIndex = Math.max(
      0,
      Math.min(index, slides.length - 1)
    );

    currentSlide.current = safeIndex;
    setActiveSlide(safeIndex);
  };

  // DOT CLICK
  const goToSlide = (index) => {
    currentSlide.current = index;
    setActiveSlide(index);

    scrollRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFF1D9',
      }}
    >
      {/* HIDE STATUS BAR FOR FULL SCREEN */}
      <StatusBar hidden />

      {/* IMAGE CAROUSEL */}
      <View
        style={{
          height: '57%',
          width: '100%',
          backgroundColor: '#E9F7CF',
          overflow: 'hidden',
        }}
      >
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
        >
          {slides.map((slide) => (
            <View
              key={slide.id}
              style={{
                width,
                height: '100%',
              }}
            >
              <Image
                source={{ uri: slide.image }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="cover"
                onError={(e) =>
                  console.log(
                    'Carousel image error:',
                    slide.id,
                    e.nativeEvent.error
                  )
                }
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* BOTTOM CONTENT */}
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFF1D9',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
      >
        {/* SLIDER DOTS */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 24,
            gap: 7,
          }}
        >
          {slides.map((slide, index) => (
            <TouchableOpacity
              key={slide.id}
              onPress={() => goToSlide(index)}
              style={{
                width: activeSlide === index ? 34 : 8,
                height: 8,
                borderRadius: 10,
                backgroundColor:
                  activeSlide === index
                    ? '#292929'
                    : '#B9B5A8',
              }}
            />
          ))}
        </View>

        {/* DYNAMIC TITLE */}
        <Text
          style={{
            fontSize: 29,
            fontWeight: '900',
            color: '#171717',
            textAlign: 'center',
            marginTop: 27,
          }}
        >
          {slides[activeSlide].title}
        </Text>

        {/* DYNAMIC SUBTITLE */}
        <Text
          style={{
            fontSize: 15,
            color: '#77736B',
            textAlign: 'center',
            lineHeight: 22,
            marginTop: 10,
          }}
        >
          {slides[activeSlide].subtitle}
        </Text>

        {/* GET STARTED BUTTON */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Login')}
          style={{
            width: '100%',
            backgroundColor: '#D3C12B',
            borderRadius: 35,
            paddingVertical: 17,
            alignItems: 'center',
            marginTop: 'auto',
            marginBottom: 28,
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 17,
              fontWeight: '800',
            }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


// ====================================================
// LOGIN AND REGISTRATION
// ====================================================


function Auth({ navigation, register = false }) {
  const { login, signup } = useStore();

  const [role, setRole] = useState('Customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const GREEN = '#263D29';
  const CREAM = '#F7F5EC';
  const YELLOW = '#D6C52B';

  // LOGIN / REGISTER VALIDATION
  const submit = () => {
    const mail = email.trim().toLowerCase();

    if (register && name.trim().length < 2) {
      Alert.alert('Validation', 'Enter your full name.');
      return;
    }

    if (!isEmail(mail)) {
      Alert.alert('Validation', 'Enter a valid email.');
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Validation',
        'Password must have at least 6 characters.'
      );
      return;
    }

    if (register && password !== confirm) {
      Alert.alert(
        'Validation',
        'Passwords do not match.'
      );
      return;
    }

    const result = register
      ? signup(name.trim(), mail, password)
      : login(role, mail, password);

    if (!result.ok) {
      Alert.alert('Error', result.message);
      return;
    }

    navigation.replace('Main');
  };

  // REUSABLE INPUT FIELD
  const renderInput = (
    label,
    value,
    setter,
    placeholder,
    options = {}
  ) => (
    <View style={{ marginBottom: 17 }}>
      <Text
        style={{
          color: GREEN,
          fontSize: 13,
          fontWeight: '800',
          marginBottom: 8,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FAFBF8',
          borderWidth: 1,
          borderColor: '#DEE5D6',
          borderRadius: 14,
          paddingHorizontal: 15,
        }}
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#A2AA9C"
          value={value}
          onChangeText={setter}
          autoCapitalize={
            options.email || options.secure
              ? 'none'
              : 'words'
          }
          autoCorrect={false}
          keyboardType={
            options.email
              ? 'email-address'
              : 'default'
          }
          secureTextEntry={
            !!options.secure && !showPassword
          }
          style={{
            flex: 1,
            minHeight: 53,
            color: GREEN,
            fontSize: 15,
          }}
        />

        {options.secure && (
          <TouchableOpacity
            onPress={() =>
              setShowPassword(!showPassword)
            }
            style={{ padding: 8 }}
          >
            <Text
              style={{
                color: '#66765E',
                fontSize: 12,
                fontWeight: '800',
              }}
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: CREAM,
      }}
      edges={['top', 'bottom']}
    >
      <StatusBar
        hidden={false}
        barStyle="dark-content"
        backgroundColor={CREAM}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 25,
        }}
      >
        {/* REAL FRUIT IMAGE HEADER */}
        <View
          style={{
            height: 230,
            backgroundColor: '#DDEBC8',
            overflow: 'hidden',
            borderBottomLeftRadius: 35,
            borderBottomRightRadius: 35,
          }}
        >
          {!imageFailed && (
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=900',
              }}
              resizeMode="cover"
              style={{
                width: '100%',
                height: '100%',
              }}
              onError={(e) => {
                console.log(
                  'Login image error:',
                  e.nativeEvent.error
                );
                setImageFailed(true);
              }}
            />
          )}

          {/* DARK OVERLAY */}
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(19,43,20,0.35)',
            }}
          />

          {/* BACK BUTTON */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              top: 17,
              left: 20,
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: 'rgba(255,255,255,0.92)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 29,
                color: GREEN,
              }}
            >
              ‹
            </Text>
          </TouchableOpacity>

          {/* HEADER TEXT */}
          <View
            style={{
              position: 'absolute',
              bottom: 35,
              left: 25,
              right: 20,
            }}
          >
            <Text
              style={{
                color: '#E6F5C6',
                fontSize: 12,
                fontWeight: '900',
                letterSpacing: 2,
                marginBottom: 7,
              }}
            >
              FRESH GROCERY
            </Text>

            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 30,
                fontWeight: '900',
              }}
            >
              {register
                ? 'Join the Fresh Life.'
                : 'Welcome Back.'}
            </Text>

            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 14,
                marginTop: 6,
              }}
            >
              Fresh picks. Better living.
            </Text>
          </View>
        </View>

        {/* FLOATING LOGIN CARD */}
        <View
          style={{
            marginHorizontal: 18,
            marginTop: -20,
            backgroundColor: '#FFFFFF',
            borderRadius: 26,
            padding: 23,
            elevation: 5,
            shadowColor: GREEN,
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 12,
          }}
        >
          <Text
            style={{
              color: GREEN,
              fontSize: 23,
              fontWeight: '900',
              marginBottom: 5,
            }}
          >
            {register
              ? 'Create your account'
              : 'Sign in to your account'}
          </Text>

          <Text
            style={{
              color: '#82907B',
              fontSize: 13,
              marginBottom: 22,
            }}
          >
            {register
              ? 'Start your fresh shopping journey'
              : 'Good to have you back with us'}
          </Text>

          {/* CUSTOMER / ADMIN SELECTOR */}
          {!register && (
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#F0F4E9',
                borderRadius: 15,
                padding: 5,
                marginBottom: 22,
              }}
            >
              {['Customer', 'Admin'].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setRole(item)}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: 13,
                    borderRadius: 11,
                    backgroundColor:
                      role === item
                        ? '#DDEDBA'
                        : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      color: GREEN,
                      fontSize: 14,
                      fontWeight: '800',
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* FULL NAME */}
          {register &&
            renderInput(
              'Full Name',
              name,
              setName,
              'Enter your full name'
            )}

          {/* EMAIL */}
          {renderInput(
            'Email Address',
            email,
            setEmail,
            'Enter your email',
            { email: true }
          )}

          {/* PASSWORD */}
          {renderInput(
            'Password',
            password,
            setPassword,
            'Enter your password',
            { secure: true }
          )}

          {/* CONFIRM PASSWORD */}
          {register &&
            renderInput(
              'Confirm Password',
              confirm,
              setConfirm,
              'Confirm your password',
              { secure: true }
            )}

          {/* SIGN IN / REGISTER BUTTON */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={submit}
            style={{
              backgroundColor: YELLOW,
              borderRadius: 30,
              paddingVertical: 17,
              alignItems: 'center',
              marginTop: 5,
            }}
          >
            <Text
              style={{
                color: GREEN,
                fontSize: 16,
                fontWeight: '900',
              }}
            >
              {register
                ? 'Create Account →'
                : 'Sign In →'}
            </Text>
          </TouchableOpacity>

          {/* LOGIN / REGISTER LINK */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                register ? 'Login' : 'Register'
              )
            }
            style={{
              marginTop: 22,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: '#7D8875',
                textAlign: 'center',
              }}
            >
              {register
                ? 'Already have an account? '
                : "Don't have an account? "}

              <Text
                style={{
                  color: GREEN,
                  fontWeight: '900',
                }}
              >
                {register
                  ? 'Sign In'
                  : 'Register Now'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* DEMO ADMIN DETAILS */}
        {!register && role === 'Admin' && (
          <View
            style={{
              backgroundColor: '#E5EFCF',
              borderRadius: 16,
              padding: 16,
              marginHorizontal: 20,
              marginTop: 18,
            }}
          >
            <Text
              style={{
                color: GREEN,
                fontWeight: '900',
                marginBottom: 8,
              }}
            >
              Demo Admin Login
            </Text>

            <Text style={{ color: GREEN }}>
              Email: admin@gmail.com
            </Text>

            <Text style={{ color: GREEN }}>
              Password: 123456
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================
// LOGIN SCREEN - FIX FOR MISSING COMPONENT
// ==========================================

function Login(props) {
  return <Auth {...props} register={false} />;
}

// ==========================================
// REGISTER SCREEN
// ==========================================

function Register(props) {
  return <Auth {...props} register={true} />;
}


// ====================================================
// PRODUCT CARD
// ====================================================

function ProductCard({
  product,
  navigation,
}) {
  const {
    user,
    favorites,
    toggleFavorite,
    addToCart,
  } = useStore();

  return (
    <View style={styles.productCard}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Details', {
            id: product.id,
          })
        }
      >
        <Photo product={product} />

        <Text style={styles.bold}>
          {product.name}
        </Text>

        <Text style={styles.muted}>
          {product.category}
        </Text>

        <Text style={styles.price}>
          {money(product.price)}/kg
        </Text>
      </TouchableOpacity>

      <View style={styles.between}>
        {user?.role === 'Customer' && (
          <TouchableOpacity
            onPress={() =>
              toggleFavorite(product.id)
            }
          >
            <Text style={{ fontSize: 23 }}>
              {favorites.includes(product.id)
                ? '❤️'
                : '♡'}
            </Text>
          </TouchableOpacity>
        )}

        {user?.role === 'Customer' && (
          <TouchableOpacity
            style={styles.plus}
            onPress={() =>
              addToCart(product.id)
            }
          >
            <Text style={styles.plusText}>
              +
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function Grid({
  products,
  navigation,
}) {
  return (
    <View style={styles.grid}>
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          navigation={navigation}
        />
      ))}
    </View>
  );
}

// ====================================================
// CUSTOMER HOME
// ====================================================

function Home({ navigation }) {
  const { user, products } = useStore();

  const [category, setCategory] =
    useState('Fruits');

  const [search, setSearch] =
    useState('');

  const list = products.filter(
    (p) =>
      p.category === category &&
      p.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <Page>
      <Header
        navigation={navigation}
        title="Grocery Shop"
      />

      <Text style={styles.muted}>
        Hello, {user?.name?.split(' ')[0]} 👋
      </Text>

      <Text style={styles.bigTitle}>
        Daily Grocery Food
      </Text>

      <View
        style={[
          styles.banner,
          styles.between,
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.bold}>
            FRESH & HEALTHY
          </Text>

          <Text style={styles.bigTitle}>
            Up to 30% OFF
          </Text>

          <Text>
            Fresh fruits and vegetables
          </Text>
        </View>

        <Text style={{ fontSize: 67 }}>
          🥭
        </Text>
      </View>

      <TextInput
        style={styles.input}
        value={search}
        onChangeText={setSearch}
        placeholder="🔎 Search products..."
        placeholderTextColor="#929A89"
      />

      <View style={styles.rowGap}>
        {['Fruits', 'Vegetables'].map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.chip,
              category === c &&
                styles.chipActive,
            ]}
            onPress={() => setCategory(c)}
          >
            <Text style={styles.bold}>
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Fresh {category}
      </Text>

      {list.length ? (
        <Grid
          products={list}
          navigation={navigation}
        />
      ) : (
        <Empty
          emoji="🔎"
          message="No products found."
        />
      )}
    </Page>
  );
}

// ====================================================
// PRODUCT DETAILS
// ====================================================

function Details({
  navigation,
  route,
}) {
  const {
    products,
    user,
    favorites,
    toggleFavorite,
    addToCart,
  } = useStore();

  const product = products.find(
    (p) => p.id === route.params?.id
  );

  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <Page>
        <Header
          navigation={navigation}
          title="Details"
          back
        />
        <Empty message="Product not found." />
      </Page>
    );
  }

  return (
    <Page>
      <Header
        navigation={navigation}
        title="Product Details"
        back
      />

      <Photo
        product={product}
        large
      />

      <View style={styles.panel}>
        <Text style={styles.bigTitle}>
          {product.name}
        </Text>

        <Text style={styles.price}>
          {money(product.price)}/kg
        </Text>

        <Text style={styles.sectionTitle}>
          Description
        </Text>

        <Text style={styles.muted}>
          {product.description}
        </Text>

        <Text style={styles.muted}>
          Available stock: {product.stock} kg
        </Text>

        {user?.role === 'Customer' && (
          <>
            <View
              style={[
                styles.rowGap,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              <Btn
                title="−"
                onPress={() =>
                  setQty(Math.max(1, qty - 1))
                }
              />

              <Text style={styles.bold}>
                {qty} kg
              </Text>

              <Btn
                title="+"
                onPress={() =>
                  setQty(
                    Math.min(
                      Math.max(1, product.stock),
                      qty + 1
                    )
                  )
                }
              />
            </View>

            <Text style={styles.sectionTitle}>
              Total: {money(qty * product.price)}
            </Text>

            <Btn
              title="Add to Cart 🛒"
              disabled={product.stock < 1}
              onPress={() =>
                addToCart(product.id, qty)
              }
            />

            <Btn
              title={
                favorites.includes(product.id)
                  ? 'Remove Favorite ❤️'
                  : 'Add to Favorites ♡'
              }
              secondary
              style={{ marginTop: 12 }}
              onPress={() =>
                toggleFavorite(product.id)
              }
            />
          </>
        )}
      </View>
    </Page>
  );
}

// ====================================================
// FAVORITES
// ====================================================

function Favorites({ navigation }) {
  const {
    products,
    favorites,
  } = useStore();

  const list = products.filter(
    (p) => favorites.includes(p.id)
  );

  return (
    <Page>
      <Header
        navigation={navigation}
        title="Favorites"
      />

      <Text style={styles.bigTitle}>
        My Favorites ❤️
      </Text>

      {list.length ? (
        <Grid
          products={list}
          navigation={navigation}
        />
      ) : (
        <Empty
          emoji="♡"
          message="No favorites yet."
        />
      )}
    </Page>
  );
}

// ====================================================
// SHOPPING CART
// ====================================================

function Cart({ navigation }) {
  const {
    products,
    cart,
    changeQuantity,
  } = useStore();

  const items = products.filter(
    (p) => (cart[p.id] || 0) > 0
  );

  const total = items.reduce(
    (sum, p) =>
      sum + p.price * cart[p.id],
    0
  );

  return (
    <Page>
      <Header
        navigation={navigation}
        title="Shopping Cart"
      />

      <Text style={styles.bigTitle}>
        My Cart 🛒
      </Text>

      {!items.length && (
        <Empty message="Your cart is empty." />
      )}

      {items.map((p) => (
        <View
          style={styles.cartCard}
          key={p.id}
        >
          <View style={{ width: 75 }}>
            <Photo product={p} />
          </View>

          <View
            style={{
              flex: 1,
              marginHorizontal: 10,
            }}
          >
            <Text style={styles.bold}>
              {p.name}
            </Text>

            <Text style={styles.muted}>
              {money(p.price)}/kg
            </Text>

            <Text style={styles.price}>
              {money(
                p.price * cart[p.id]
              )}
            </Text>
          </View>

          <View
            style={{
              alignItems: 'center',
              gap: 7,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                changeQuantity(p.id, 1)
              }
            >
              <Text style={styles.qty}>
                ＋
              </Text>
            </TouchableOpacity>

            <Text style={styles.bold}>
              {cart[p.id]}
            </Text>

            <TouchableOpacity
              onPress={() =>
                changeQuantity(p.id, -1)
              }
            >
              <Text style={styles.qty}>
                −
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View
        style={[
          styles.between,
          { marginVertical: 22 },
        ]}
      >
        <Text style={styles.sectionTitle}>
          Total
        </Text>

        <Text style={styles.sectionTitle}>
          {money(total)}
        </Text>
      </View>

      <Btn
        title="Proceed to Payment →"
        disabled={!items.length}
        onPress={() =>
          navigation.navigate('Payment')
        }
      />
    </Page>
  );
}

// ====================================================
// PAYMENT SCREEN - DEMO ONLY
// ====================================================

function Payment({ navigation }) {
  const {
    user,
    products,
    cart,
    placeOrder,
  } = useStore();

  const [method, setMethod] =
    useState('UPI');

  const lock = useRef(false);
  const [busy, setBusy] = useState(false);

  const items = products.filter(
    (p) => (cart[p.id] || 0) > 0
  );

  const total = items.reduce(
    (sum, p) =>
      sum + p.price * cart[p.id],
    0
  );

  const confirm = () => {
    if (lock.current) return;

    lock.current = true;
    setBusy(true);

    const result = placeOrder(method);

    if (!result.ok) {
      lock.current = false;
      setBusy(false);

      return Alert.alert(
        'Order Error',
        result.message
      );
    }

    navigation.replace('OrderSuccess', {
      order: result.order,
    });
  };

  if (user?.role !== 'Customer') {
    return (
      <Page>
        <Header
          navigation={navigation}
          title="Payment"
          back
        />

        <Empty
          emoji="🔒"
          message="Customers only."
        />
      </Page>
    );
  }

  return (
    <Page>
      <Header
        navigation={navigation}
        title="Payment"
        back
      />

      <Text style={styles.bigTitle}>
        Checkout 💳
      </Text>

      <Text style={styles.muted}>
        Demo payment only. No real money will be charged.
      </Text>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>
          Order Summary
        </Text>

        {items.map((p) => (
          <View
            key={p.id}
            style={styles.between}
          >
            <Text style={styles.muted}>
              {p.name} × {cart[p.id]} kg
            </Text>

            <Text style={styles.bold}>
              {money(
                p.price * cart[p.id]
              )}
            </Text>
          </View>
        ))}

        <View
          style={[
            styles.between,
            { marginTop: 18 },
          ]}
        >
          <Text style={styles.sectionTitle}>
            Total
          </Text>

          <Text style={styles.sectionTitle}>
            {money(total)}
          </Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>
          Select Payment Method
        </Text>

        {[
          {
            id: 'UPI',
            icon: '📱',
            label: 'UPI (Demo)',
          },
          {
            id: 'Card',
            icon: '💳',
            label: 'Debit / Credit Card (Demo)',
          },
          {
            id: 'COD',
            icon: '💵',
            label: 'Cash on Delivery',
          },
        ].map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() =>
              setMethod(option.id)
            }
            style={[
              styles.paymentOption,
              method === option.id &&
                styles.selectedOption,
            ]}
          >
            <Text style={{ fontSize: 24 }}>
              {option.icon}
            </Text>

            <Text
              style={[
                styles.bold,
                { flex: 1 },
              ]}
            >
              {option.label}
            </Text>

            <Text>
              {method === option.id
                ? '🔘'
                : '⚪'}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.muted}>
          {method === 'COD'
            ? 'COD is simulated. No delivery will actually be scheduled.'
            : 'This is a simulation; no bank or card details are needed.'}
        </Text>
      </View>

      <Btn
        title={
          busy
            ? 'Processing...'
            : `Confirm Demo Order • ${money(total)}`
        }
        disabled={busy || !items.length}
        onPress={confirm}
      />
    </Page>
  );
}

// ====================================================
// ORDER SUCCESS SCREEN
// ====================================================

function OrderSuccess({
  navigation,
  route,
}) {
  const order = route.params?.order;

  return (
    <Page>
      <View
        style={[
          styles.panel,
          {
            alignItems: 'center',
            marginTop: 60,
            paddingVertical: 45,
          },
        ]}
      >
        <Text style={{ fontSize: 85 }}>
          ✅
        </Text>

        <Text style={styles.bigTitle}>
          Order Placed!
        </Text>

        <Text style={styles.muted}>
          Your demo order was confirmed.
        </Text>

        {!!order && (
          <>
            <Text
              style={[
                styles.bold,
                { marginTop: 20 },
              ]}
            >
              Order #{order.id}
            </Text>

            <Text style={styles.price}>
              {money(order.total)}
            </Text>

            <Text style={styles.muted}>
              {order.method === 'COD'
                ? 'Cash on Delivery'
                : `${order.method} (Demo)`}
            </Text>

            <Text style={styles.muted}>
              {order.status}
            </Text>
          </>
        )}
      </View>

      <Btn
        title="Back to Grocery Home →"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          })
        }
      />
    </Page>
  );
}

// ====================================================
// MY ORDERS / ADMIN ALL ORDERS
// ====================================================

function Orders({ navigation }) {
  const {
    orders,
    user,
  } = useStore();

  const list =
    user?.role === 'Admin'
      ? orders
      : orders.filter(
          (o) => o.email === user?.email
        );

  return (
    <Page>
      <Header
        navigation={navigation}
        title={
          user?.role === 'Admin'
            ? 'All Orders'
            : 'My Orders'
        }
      />

      <Text style={styles.bigTitle}>
        {user?.role === 'Admin'
          ? 'Customer Orders'
          : 'My Orders'}{' '}
        📦
      </Text>

      {!list.length && (
        <Empty
          emoji="📦"
          message="No orders yet."
        />
      )}

      {list.map((o) => (
        <View
          key={o.id}
          style={styles.panel}
        >
          <Text style={styles.bold}>
            Order #{o.id}
          </Text>

          <Text style={styles.muted}>
            {o.date}
          </Text>

          {user?.role === 'Admin' && (
            <Text style={styles.muted}>
              Customer: {o.email}
            </Text>
          )}

          {o.items.map((item) => (
            <Text
              key={item.id}
              style={styles.muted}
            >
              {item.name} × {item.quantity} kg —{' '}
              {money(
                item.price * item.quantity
              )}
            </Text>
          ))}

          <Text style={styles.price}>
            {money(o.total)}
          </Text>

          <Text style={styles.muted}>
            {o.method === 'COD'
              ? 'Cash on Delivery'
              : `${o.method} (Demo)`}
          </Text>

          <Text style={styles.muted}>
            Status: {o.status}
          </Text>
        </View>
      ))}
    </Page>
  );
}

// ====================================================
// PROFILE
// ====================================================

function Profile({ navigation }) {
  const {
    user,
    logout,
  } = useStore();

  return (
    <Page>
      <Header
        navigation={navigation}
        title="My Profile"
      />

      <View
        style={[
          styles.panel,
          {
            alignItems: 'center',
            paddingVertical: 35,
          },
        ]}
      >
        <Text style={{ fontSize: 70 }}>
          👤
        </Text>

        <Text style={styles.bigTitle}>
          {user?.name}
        </Text>

        <Text style={styles.muted}>
          {user?.email}
        </Text>

        <Text style={styles.price}>
          {user?.role}
        </Text>
      </View>

      {user?.role === 'Customer' && (
        <>
          <Btn
            title="✎ Edit Profile"
            onPress={() =>
              navigation.navigate('EditProfile')
            }
          />

          <Btn
            title="📦 My Orders"
            secondary
            style={{ marginTop: 12 }}
            onPress={() =>
              navigation.navigate('Orders')
            }
          />
        </>
      )}

      <Btn
        title="Logout"
        danger
        style={{ marginTop: 16 }}
        onPress={() =>
          Alert.alert(
            'Logout',
            'Are you sure?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Logout',
                onPress: logout,
              },
            ]
          )
        }
      />
    </Page>
  );
}

function EditProfile({ navigation }) {
  const {
    user,
    updateProfile,
  } = useStore();

  const [name, setName] =
    useState(user?.name || '');

  const [email, setEmail] =
    useState(user?.email || '');

  const save = () => {
    if (
      name.trim().length < 2 ||
      !isEmail(email)
    ) {
      return Alert.alert(
        'Validation',
        'Enter valid name and email.'
      );
    }

    const result = updateProfile(
      name.trim(),
      email.trim().toLowerCase()
    );

    if (!result.ok) {
      return Alert.alert(
        'Error',
        result.message
      );
    }

    Alert.alert(
      'Success',
      'Profile updated.'
    );

    navigation.goBack();
  };

  return (
    <Page>
      <Header
        navigation={navigation}
        title="Edit Profile"
        back
      />

      <Text style={styles.bigTitle}>
        Update Profile
      </Text>

      <Field
        label="Full Name"
        value={name}
        onChangeText={setName}
      />

      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        email
      />

      <Btn
        title="Save Changes"
        onPress={save}
      />
    </Page>
  );
}

// ====================================================
// ADMIN DASHBOARD
// ====================================================

function Stat({
  icon,
  number,
  title,
}) {
  return (
    <View style={styles.stat}>
      <Text style={{ fontSize: 30 }}>
        {icon}
      </Text>

      <Text style={styles.bigTitle}>
        {number}
      </Text>

      <Text style={styles.muted}>
        {title}
      </Text>
    </View>
  );
}

function Dashboard({ navigation }) {
  const {
    products,
    customers,
    orders,
  } = useStore();

  const stock = products.reduce(
    (sum, p) => sum + p.stock,
    0
  );

  const lowStock = products.filter(
    (p) => p.stock <= 5
  );

  return (
    <Page>
      <Header
        navigation={navigation}
        title="Admin Dashboard"
      />

      <Text style={styles.bigTitle}>
        Welcome, Admin 🛡️
      </Text>

      <View
        style={[
          styles.banner,
          styles.between,
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>
            Manage Your Store
          </Text>

          <Text>
            Products, customers, stock and orders
          </Text>
        </View>

        <Text style={{ fontSize: 56 }}>
          📦
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        Store Overview
      </Text>

      <View style={styles.grid}>
        <Stat
          icon="📦"
          number={products.length}
          title="Products"
        />

        <Stat
          icon="👥"
          number={customers.length}
          title="Customers"
        />

        <Stat
          icon="🥬"
          number={stock}
          title="Total Stock (kg)"
        />

        <Stat
          icon="🧾"
          number={orders.length}
          title="Demo Orders"
        />
      </View>

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <Btn
        title="📦 Manage Products"
        onPress={() =>
          navigation.navigate('ManageProducts')
        }
      />

      <Btn
        title="➕ Add New Product"
        secondary
        style={{ marginTop: 12 }}
        onPress={() =>
          navigation.navigate('ProductForm')
        }
      />

      <Btn
        title="👥 View Customers"
        secondary
        style={{ marginTop: 12 }}
        onPress={() =>
          navigation.navigate('Customers')
        }
      />

      <Btn
        title="🧾 View Orders"
        secondary
        style={{ marginTop: 12 }}
        onPress={() =>
          navigation.navigate('Orders')
        }
      />

      <Btn
        title="🧭 Navigation Demo"
        secondary
        style={{ marginTop: 12 }}
        onPress={() =>
          navigation.navigate('NavigationDemo')
        }
      />

      {!!lowStock.length && (
        <View style={styles.panel}>
          <Text style={styles.bold}>
            ⚠️ Low Stock
          </Text>

          {lowStock.map((p) => (
            <Text
              key={p.id}
              style={styles.muted}
            >
              {p.name}: {p.stock} kg
            </Text>
          ))}
        </View>
      )}
    </Page>
  );
}

// ====================================================
// ADMIN MANAGE PRODUCTS
// ====================================================

function ManageProducts({ navigation }) {
  const {
    products,
    deleteProduct,
  } = useStore();

  const confirmDelete = (p) =>
    Alert.alert(
      'Delete Product',
      `Delete ${p.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            deleteProduct(p.id),
        },
      ]
    );

  return (
    <Page>
      <Header
        navigation={navigation}
        title="Manage Products"
      />

      <Btn
        title="+ Add New Product"
        onPress={() =>
          navigation.navigate('ProductForm')
        }
      />

      <Text style={styles.sectionTitle}>
        Products ({products.length})
      </Text>

      {products.map((p) => (
        <View
          style={styles.cartCard}
          key={p.id}
        >
          <View style={{ width: 70 }}>
            <Photo product={p} />
          </View>

          <View
            style={{
              flex: 1,
              marginHorizontal: 10,
            }}
          >
            <Text style={styles.bold}>
              {p.name}
            </Text>

            <Text style={styles.price}>
              {money(p.price)}/kg
            </Text>

            <Text style={styles.muted}>
              Stock: {p.stock} kg
            </Text>
          </View>

          <View style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  'ProductForm',
                  { id: p.id }
                )
              }
            >
              <Text style={styles.link}>
                Edit ✎
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                confirmDelete(p)
              }
            >
              <Text
                style={{
                  color: COLORS.red,
                  fontWeight: '900',
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </Page>
  );
}

// ====================================================
// ADMIN ADD / EDIT PRODUCT
// ====================================================

function ProductForm({
  navigation,
  route,
}) {
  const {
    products,
    saveProduct,
    user,
  } = useStore();

  const old = products.find(
    (p) => p.id === route.params?.id
  );

  const [name, setName] =
    useState(old?.name || '');

  const [price, setPrice] =
    useState(old ? String(old.price) : '');

  const [stock, setStock] =
    useState(old ? String(old.stock) : '');

  const [category, setCategory] =
    useState(old?.category || 'Fruits');

  const [emoji, setEmoji] =
    useState(old?.emoji || '🍎');

  const [description, setDescription] =
    useState(old?.description || '');

  const [image, setImage] =
    useState(old?.image || '');

  const save = () => {
    const p = Number(price);
    const st = Number(stock);

    if (user?.role !== 'Admin') {
      return Alert.alert(
        'Access Denied',
        'Admin only.'
      );
    }

    if (
      !name.trim() ||
      !description.trim() ||
      !emoji.trim() ||
      !price.trim() ||
      !stock.trim() ||
      !Number.isFinite(p) ||
      p <= 0 ||
      !Number.isInteger(st) ||
      st < 0
    ) {
      return Alert.alert(
        'Validation',
        'Enter valid name, price, stock and description.'
      );
    }

    if (
      image.trim() &&
      !/^https?:\/\/\S+$/i.test(image.trim())
    ) {
      return Alert.alert(
        'Validation',
        'Image URL must start with http:// or https://'
      );
    }

    saveProduct({
      id:
        old?.id ||
        `${Date.now()}-${Math.random()}`,
      name: name.trim(),
      price: p,
      stock: st,
      category,
      emoji: emoji.trim(),
      description: description.trim(),
      image: image.trim(),
    });

    Alert.alert(
      'Success',
      old
        ? 'Product updated.'
        : 'Product added.'
    );

    navigation.goBack();
  };

  return (
    <Page>
      <Header
        navigation={navigation}
        title={
          old ? 'Edit Product' : 'Add Product'
        }
        back
      />

      <Text style={styles.bigTitle}>
        {old ? 'Edit Product' : 'New Product'}
      </Text>

      <Field
        label="Product Name"
        value={name}
        onChangeText={setName}
      />

      <Field
        label="Price Per KG"
        value={price}
        onChangeText={setPrice}
        numeric
      />

      <Field
        label="Stock (KG)"
        value={stock}
        onChangeText={setStock}
        numeric
      />

      <Text style={styles.label}>
        Category
      </Text>

      <View style={styles.rowGap}>
        {['Fruits', 'Vegetables'].map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.chip,
              category === c &&
                styles.chipActive,
            ]}
            onPress={() =>
              setCategory(c)
            }
          >
            <Text style={styles.bold}>
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Field
        label="Emoji"
        value={emoji}
        onChangeText={setEmoji}
      />

      <Field
        label="Description"
        value={description}
        onChangeText={setDescription}
      />

      <Field
        label="Image URL (Optional)"
        value={image}
        onChangeText={setImage}
      />

      <Btn
        title={
          old
            ? 'Update Product'
            : 'Save Product'
        }
        onPress={save}
      />
    </Page>
  );
}

// ====================================================
// ADMIN CUSTOMERS
// ====================================================

function Customers({ navigation }) {
  const { customers } = useStore();

  return (
    <Page>
      <Header
        navigation={navigation}
        title="Customers"
      />

      <Text style={styles.bigTitle}>
        Registered Customers
      </Text>

      {!customers.length && (
        <Empty
          emoji="👥"
          message="No customers registered yet."
        />
      )}

      {customers.map((c) => (
        <View
          key={c.email}
          style={styles.panel}
        >
          <Text style={styles.bold}>
            👤 {c.name}
          </Text>

          <Text style={styles.muted}>
            {c.email}
          </Text>
        </View>
      ))}
    </Page>
  );
}


function StackDemoTwo({ navigation }) {
  return (
    <Page>
      <Header
        navigation={navigation}
        title="Stack Screen 2"
        back
      />

      <View style={styles.panel}>
        <Text
          style={{
            fontSize: 75,
            textAlign: 'center',
          }}
        >
          📚
        </Text>

        <Text style={styles.bigTitle}>
          Stack Navigation Works!
        </Text>

        <Btn
          title="← Go Back"
          onPress={() =>
            navigation.goBack()
          }
        />
      </View>
    </Page>
  );
}

// ====================================================
// BOTTOM TAB NAVIGATION
// ====================================================

function BottomTabs() {
  const { user } = useStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.dark,
        tabBarInactiveTintColor: '#747C62',
        tabBarStyle: {
          backgroundColor: '#F4DF75',
          height: 65,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
        },
        tabBarIcon: () => (
          <Text style={{ fontSize: 20 }}>
            {({
              Home: '🏠',
              Dashboard: '📊',
              Favorites: '❤️',
              Cart: '🛒',
              Profile: '👤',
            })[route.name]}
          </Text>
        ),
      })}
    >
      {user?.role === 'Admin' ? (
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
        />
      ) : (
        <>
          <Tab.Screen
            name="Home"
            component={Home}
          />

          <Tab.Screen
            name="Favorites"
            component={Favorites}
          />

          <Tab.Screen
            name="Cart"
            component={Cart}
          />
        </>
      )}

      <Tab.Screen
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
}

// ====================================================
// DRAWER NAVIGATION
// ====================================================

function MainDrawer() {
  const { user } = useStore();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: COLORS.dark,
        drawerActiveBackgroundColor: COLORS.bg,
        drawerStyle: {
          backgroundColor: COLORS.cream,
        },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomTabs}
        options={{
          drawerLabel:
            user?.role === 'Admin'
              ? '📊 Admin Dashboard'
              : '🏠 Grocery Home',
        }}
      />

      {user?.role === 'Admin' && (
        <>
          <Drawer.Screen
            name="ManageProducts"
            component={ManageProducts}
            options={{
              drawerLabel: '📦 Manage Products',
            }}
          />

          <Drawer.Screen
            name="Customers"
            component={Customers}
            options={{
              drawerLabel: '👥 Customers',
            }}
          />
        </>
      )}

      <Drawer.Screen
        name="Orders"
        component={Orders}
        options={{
          drawerLabel:
            user?.role === 'Admin'
              ? '🧾 All Orders'
              : '📦 My Orders',
        }}
      />

      
    </Drawer.Navigator>
  );
}

// ====================================================
// MAIN APP AND STATE MANAGEMENT
// ====================================================

export default function App() {
  const [user, setUser] =
    useState(null);

  const [customers, setCustomers] =
    useState([]);

  const [products, setProducts] =
    useState(START_PRODUCTS);

  const [favorites, setFavorites] =
    useState([]);

  const [cart, setCart] =
    useState({});

  const [orders, setOrders] =
    useState([]);

  // --------------------
  // SIGNUP
  // --------------------

  function signup(name, email, password) {
    if (
      email === ADMIN_EMAIL ||
      customers.some(
        (c) => c.email === email
      )
    ) {
      return {
        ok: false,
        message: 'Email already registered or reserved.',
      };
    }

    setCustomers((prev) => [
      ...prev,
      {
        name,
        email,
        password,
        role: 'Customer',
      },
    ]);

    setUser({
      name,
      email,
      role: 'Customer',
    });

    setFavorites([]);
    setCart({});

    return { ok: true };
  }

  // --------------------
  // LOGIN
  // --------------------

  function login(role, email, password) {
    if (role === 'Admin') {
      if (
        email !== ADMIN_EMAIL ||
        password !== ADMIN_PASSWORD
      ) {
        return {
          ok: false,
          message: 'Incorrect admin credentials.',
        };
      }

      setUser({
        name: 'Grocery Admin',
        email,
        role: 'Admin',
      });
    } else {
      const account = customers.find(
        (c) =>
          c.email === email &&
          c.password === password
      );

      if (!account) {
        return {
          ok: false,
          message: 'Invalid customer email or password.',
        };
      }

      setUser({
        name: account.name,
        email: account.email,
        role: 'Customer',
      });
    }

    setFavorites([]);
    setCart({});

    return { ok: true };
  }

  // --------------------
  // LOGOUT
  // --------------------

  function logout() {
    setUser(null);
    setFavorites([]);
    setCart({});

    if (navigationRef.isReady()) {
      navigationRef.resetRoot({
        index: 0,
        routes: [
          { name: 'Welcome' },
        ],
      });
    }
  }

  // --------------------
  // UPDATE PROFILE
  // --------------------

  function updateProfile(name, email) {
    if (user?.role !== 'Customer') {
      return {
        ok: false,
        message: 'Customer only.',
      };
    }

    if (
      email === ADMIN_EMAIL ||
      customers.some(
        (c) =>
          c.email === email &&
          c.email !== user.email
      )
    ) {
      return {
        ok: false,
        message: 'Email already in use.',
      };
    }

    setCustomers((prev) =>
      prev.map((c) =>
        c.email === user.email
          ? {
              ...c,
              name,
              email,
            }
          : c
      )
    );

    setUser((prev) => ({
      ...prev,
      name,
      email,
    }));

    return { ok: true };
  }

  // --------------------
  // ADMIN PRODUCT CRUD
  // --------------------

  function saveProduct(product) {
    if (user?.role !== 'Admin') {
      return;
    }

    setProducts((prev) =>
      prev.some(
        (p) => p.id === product.id
      )
        ? prev.map((p) =>
            p.id === product.id
              ? product
              : p
          )
        : [...prev, product]
    );

    setCart((prev) => ({
      ...prev,
      [product.id]: Math.min(
        prev[product.id] || 0,
        product.stock
      ),
    }));
  }

  function deleteProduct(id) {
    if (user?.role !== 'Admin') {
      return;
    }

    setProducts((prev) =>
      prev.filter(
        (p) => p.id !== id
      )
    );

    setFavorites((prev) =>
      prev.filter(
        (x) => x !== id
      )
    );

    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  // --------------------
  // FAVORITES
  // --------------------

  function toggleFavorite(id) {
    if (user?.role !== 'Customer') {
      return;
    }

    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter(
            (x) => x !== id
          )
        : [...prev, id]
    );
  }

  // --------------------
  // ADD TO CART
  // --------------------

  function addToCart(id, quantity = 1) {
    if (user?.role !== 'Customer') {
      return;
    }

    const p = products.find(
      (item) => item.id === id
    );

    if (
      !p ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      (cart[id] || 0) + quantity > p.stock
    ) {
      return Alert.alert(
        'Stock Limit',
        `Only ${p?.stock ?? 0} kg available.`
      );
    }

    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + quantity,
    }));

    Alert.alert(
      'Added',
      `${p.name} added to cart.`
    );
  }

  // --------------------
  // CHANGE CART QUANTITY
  // --------------------

  function changeQuantity(id, delta) {
    if (user?.role !== 'Customer') {
      return;
    }

    const p = products.find(
      (item) => item.id === id
    );

    if (!p) return;

    const next = Math.max(
      0,
      (cart[id] || 0) + delta
    );

    if (next > p.stock) {
      return Alert.alert(
        'Stock Limit',
        'Not enough stock.'
      );
    }

    setCart((prev) => ({
      ...prev,
      [id]: next,
    }));
  }

  // ==================================================
  // DEMO PAYMENT AND ORDER PLACEMENT
  // ==================================================

  function placeOrder(method) {
    if (user?.role !== 'Customer') {
      return {
        ok: false,
        message: 'Customers only.',
      };
    }

    if (
      !['UPI', 'Card', 'COD'].includes(method)
    ) {
      return {
        ok: false,
        message: 'Select a payment method.',
      };
    }

    const items = products
      .filter(
        (p) => (cart[p.id] || 0) > 0
      )
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: cart[p.id],
        stock: p.stock,
      }));

    if (!items.length) {
      return {
        ok: false,
        message: 'Your cart is empty.',
      };
    }

    if (
      items.some(
        (item) =>
          !Number.isInteger(item.quantity) ||
          item.quantity > item.stock
      )
    ) {
      return {
        ok: false,
        message:
          'Not enough stock for one or more items.',
      };
    }

    const total = items.reduce(
      (sum, item) =>
        sum +
        item.price * item.quantity,
      0
    );

    const order = {
      id: String(Date.now()),
      email: user.email,
      date: new Date().toLocaleString(),

      items: items.map(
        ({
          id,
          name,
          price,
          quantity,
        }) => ({
          id,
          name,
          price,
          quantity,
        })
      ),

      total,
      method,

      status:
        method === 'COD'
          ? 'COD Pending (Demo)'
          : 'Demo Payment Confirmed',
    };

    // Reduce product stock
    setProducts((prev) =>
      prev.map((p) => {
        const ordered = items.find(
          (item) => item.id === p.id
        );

        return ordered
          ? {
              ...p,
              stock:
                p.stock -
                ordered.quantity,
            }
          : p;
      })
    );

    // Save order in app state
    setOrders((prev) => [
      order,
      ...prev,
    ]);

    // Clear cart
    setCart({});

    return {
      ok: true,
      order,
    };
  }

  // ==================================================
  // CONTEXT AND NAVIGATION
  // ==================================================

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
    >
      <Store.Provider
        value={{
          user,
          customers,
          products,
          favorites,
          cart,
          orders,

          signup,
          login,
          logout,
          updateProfile,

          saveProduct,
          deleteProduct,

          toggleFavorite,
          addToCart,
          changeQuantity,
          placeOrder,
        }}
      >
        <SafeAreaProvider>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={COLORS.bg}
          />

          <NavigationContainer
            ref={navigationRef}
          >
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName="Welcome"
            >
              <Stack.Screen
                name="Welcome"
                component={Welcome}
              />

              <Stack.Screen
                name="Login"
                component={Login}
              />

              <Stack.Screen
                name="Register"
                component={Register}
              />

              <Stack.Screen
                name="Main"
                component={MainDrawer}
              />

              <Stack.Screen
                name="Details"
                component={Details}
              />

              <Stack.Screen
                name="EditProfile"
                component={EditProfile}
              />

              <Stack.Screen
                name="ProductForm"
                component={ProductForm}
              />

              <Stack.Screen
                name="Payment"
                component={Payment}
              />

              <Stack.Screen
                name="OrderSuccess"
                component={OrderSuccess}
              />

              <Stack.Screen
                name="StackDemoTwo"
                component={StackDemoTwo}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </Store.Provider>
    </GestureHandlerRootView>
  );
}

// ====================================================
// COMPLETE STYLES
// ====================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  page: {
    flexGrow: 1,
    padding: 18,
    paddingBottom: 35,
  },

  btn: {
    backgroundColor: COLORS.yellow,
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnSecondary: {
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.yellow,
  },

  btnDanger: {
    backgroundColor: COLORS.red,
  },

  btnText: {
    color: COLORS.dark,
    fontSize: 15,
    fontWeight: '900',
  },

  label: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 7,
  },

  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    padding: 14,
    fontSize: 15,
    color: COLORS.dark,
    marginBottom: 8,
  },

  bold: {
    color: COLORS.dark,
    fontSize: 15,
    fontWeight: '900',
  },

  bigTitle: {
    color: COLORS.dark,
    fontSize: 27,
    fontWeight: '900',
    marginBottom: 15,
  },

  sectionTitle: {
    color: COLORS.dark,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 12,
    marginBottom: 14,
  },

  price: {
    color: COLORS.dark,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 8,
  },

  muted: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 21,
  },

  link: {
    color: COLORS.dark,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  headerTitle: {
    color: COLORS.dark,
    fontSize: 17,
    fontWeight: '900',
  },

  headerIcon: {
    fontSize: 25,
    color: COLORS.dark,
    fontWeight: '900',
  },

  round: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: {
    minHeight: 220,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },

  panel: {
    backgroundColor: COLORS.cream,
    borderRadius: 18,
    padding: 18,
    marginVertical: 12,
    gap: 8,
  },

  banner: {
    backgroundColor: COLORS.yellow,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  rowGap: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 17,
  },

  chip: {
    backgroundColor: COLORS.olive,
    borderRadius: 22,
    paddingHorizontal: 19,
    paddingVertical: 12,
    alignItems: 'center',
    flexGrow: 1,
  },

  chipActive: {
    backgroundColor: COLORS.yellow,
  },

  between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },

  productCard: {
    width: '48%',
    backgroundColor: COLORS.cream,
    padding: 12,
    borderRadius: 17,
    justifyContent: 'space-between',
    minHeight: 215,
  },

  photo: {
    width: '100%',
    height: 108,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 8,
  },

  photoFallback: {
    width: '100%',
    height: 108,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  photoLarge: {
    height: 250,
    borderRadius: 20,
    marginVertical: 14,
  },

  plus: {
    backgroundColor: COLORS.yellow,
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  plusText: {
    color: COLORS.dark,
    fontSize: 25,
    fontWeight: '900',
  },

  cartCard: {
    backgroundColor: COLORS.cream,
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  qty: {
    fontSize: 23,
    fontWeight: '900',
    color: COLORS.dark,
  },

  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 10,
  },

  selectedOption: {
    backgroundColor: COLORS.bg,
    borderColor: COLORS.dark,
  },

  stat: {
    width: '48%',
    backgroundColor: COLORS.cream,
    borderRadius: 17,
    alignItems: 'center',
    padding: 18,
  },
});
