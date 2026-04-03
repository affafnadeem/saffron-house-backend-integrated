import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  TextInput,
  ScrollView
} from 'react-native';

// IMPORTANT: Change this to your laptop's IP address
// Find your IP: On Windows run 'ipconfig', on Mac/Linux run 'ifconfig'
// Then replace 192.168.x.x with your actual IP
const API_URL = 'http://192.168.1.14:3000';

interface MenuItem {
  id: number;
  name: string;
  arabicName: string;
  price: number;
  category: string;
  imageUrl: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function App() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/catalog`);
      const data = await response.json();
      if (data.success) {
        setMenu(data.products);
      } else {
        Alert.alert('Error', 'Failed to load menu');
      }
    } catch (error) {
      Alert.alert('Connection Error', `Cannot connect to ${API_URL}. Make sure server is running on your laptop.`);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    Alert.alert('Added', `${item.name} added to cart 🌙`);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      if (item && item.quantity === 1) {
        return prev.filter(i => i.id !== id);
      }
      return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const getTotal = () => {
    return cart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2);
  };

  const getItemCount = () => {
    return cart.reduce((sum, i) => sum + i.quantity, 0);
  };

  const placeOrder = async () => {
    if (!customerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!tableNumber.trim()) {
      Alert.alert('Error', 'Please enter table number');
      return;
    }
    if (cart.length === 0) {
      Alert.alert('Error', 'Cart is empty');
      return;
    }

    const orderDetails = {
      customerName: customerName,
      tableNumber: parseInt(tableNumber),
      items: cart.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
      total: parseFloat(getTotal()),
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(`${API_URL}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails)
      });
      const result = await response.json();
      if (result.success) {
        Alert.alert('Success', `Order placed! Thank you ${customerName} 🌙`);
        setCart([]);
        setCustomerName('');
        setTableNumber('');
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to place order');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Make sure server is running.');
    }
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.menuImage} />
      <View style={styles.menuInfo}>
        <Text style={styles.menuArabic}>{item.arabicName}</Text>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuCategory}>{item.category}</Text>
        <Text style={styles.menuPrice}>AED {item.price}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
          <Text style={styles.addButtonText}>Add to Cart 🛒</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={styles.loadingText}>Loading Saffron House Menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerArabic}>بيت الزعفران</Text>
        <Text style={styles.headerTitle}>SAFFRON HOUSE</Text>
        <Text style={styles.headerSubtitle}>Authentic Arabian Cuisine</Text>
      </View>

      {/* Menu List */}
      <FlatList
        data={menu}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.menuList}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <TouchableOpacity style={styles.cartButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.cartButtonText}>🛒 Cart ({getItemCount()}) - AED {getTotal()}</Text>
        </TouchableOpacity>
      )}

      {/* Cart Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🛒 Your Order</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {cart.length === 0 ? (
                <Text style={styles.emptyCartText}>Your cart is empty</Text>
              ) : (
                <>
                  {cart.map(item => (
                    <View key={item.id} style={styles.cartItem}>
                      <View style={styles.cartItemInfo}>
                        <Text style={styles.cartItemName}>{item.name}</Text>
                        <Text style={styles.cartItemPrice}>AED {item.price}</Text>
                      </View>
                      <View style={styles.cartItemControls}>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.qtyButton}>
                          <Text style={styles.qtyButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => addToCart(item)} style={styles.qtyButton}>
                          <Text style={styles.qtyButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}

                  <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total Amount:</Text>
                    <Text style={styles.totalAmount}>AED {getTotal()}</Text>
                  </View>

                  <View style={styles.formContainer}>
                    <Text style={styles.formLabel}>Your Name *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your name"
                      placeholderTextColor="#666"
                      value={customerName}
                      onChangeText={setCustomerName}
                    />

                    <Text style={styles.formLabel}>Table Number *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter table number"
                      placeholderTextColor="#666"
                      value={tableNumber}
                      onChangeText={setTableNumber}
                      keyboardType="numeric"
                    />
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeModalText}>Continue Shopping</Text>
              </TouchableOpacity>
              {cart.length > 0 && (
                <TouchableOpacity style={styles.placeOrderButton} onPress={placeOrder}>
                  <Text style={styles.placeOrderText}>Place Order 🌙</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#D4AF37',
  },
  header: {
    backgroundColor: '#1A1A1A',
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D4AF37',
  },
  headerArabic: {
    color: '#D4AF37',
    fontSize: 24,
    writingDirection: 'rtl',
    marginBottom: 4,
  },
  headerTitle: {
    color: '#D4AF37',
    fontSize: 16,
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: '#888',
    fontSize: 10,
    marginTop: 4,
  },
  menuList: {
    padding: 15,
  },
  menuCard: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    marginBottom: 15,
    padding: 12,
    overflow: 'hidden',
  },
  menuImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  menuInfo: {
    flex: 1,
    marginLeft: 15,
  },
  menuArabic: {
    color: '#D4AF37',
    fontSize: 14,
    writingDirection: 'rtl',
  },
  menuName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  menuCategory: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  menuPrice: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#D4AF37',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#0A0A0A',
    fontWeight: 'bold',
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#D4AF37',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  modalTitle: {
    color: '#D4AF37',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#D4AF37',
    fontSize: 24,
  },
  modalBody: {
    padding: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  cartItemInfo: {
    flex: 2,
  },
  cartItemName: {
    color: '#FFF',
    fontSize: 14,
  },
  cartItemPrice: {
    color: '#D4AF37',
    fontSize: 12,
    marginTop: 2,
  },
  cartItemControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  qtyButton: {
    width: 30,
    height: 30,
    backgroundColor: '#D4AF37',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    color: '#0A0A0A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qtyText: {
    color: '#FFF',
    fontSize: 16,
    marginHorizontal: 15,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#D4AF37',
  },
  totalLabel: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    color: '#D4AF37',
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 20,
  },
  formLabel: {
    color: '#D4AF37',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    padding: 12,
    color: '#FFF',
    fontSize: 14,
  },
  emptyCartText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    padding: 40,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
    gap: 10,
  },
  closeModalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4AF37',
    alignItems: 'center',
  },
  closeModalText: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  placeOrderButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#0A0A0A',
    fontWeight: 'bold',
    fontSize: 16,
  },
});