import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, Edit3, LogOut } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { CustomerDetails } from '@/types/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      setError(null);
      const data = await apiService.getCustomerDetails();
      setCustomer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCustomerData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(auth)/login')}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Account</Text>
        <TouchableOpacity style={styles.accountIcon}>
          <User size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {error && <ErrorMessage message={error} />}

        {customer && (
          <View style={styles.content}>
            {/* Your Majestic Account Details Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Majestic Account Details</Text>
              
              <View style={styles.accountDetails}>
                <View style={styles.profileImageContainer}>
                  <View style={styles.profileImage}>
                    <Text style={styles.profileImageText}>
                      {`${(customer.firstName || customer.email || '?').charAt(0)}`.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.accountInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>First Name</Text>
                    <Text style={styles.infoValue}>{customer.firstName || '—'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Last Name</Text>
                    <Text style={styles.infoValue}>{customer.lastName || '—'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{customer.email || '—'}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Tel Number</Text>
                    <Text style={styles.infoValue}>{customer.mobilePhone || '—'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>DOB</Text>
                    <Text style={styles.infoValue}>17/03/1991</Text>
                  </View>
                  
                  <View style={styles.twoColumnInfo}>
                    <View style={styles.column}>
                      <Text style={styles.infoLabel}>Your Local Store</Text>
                      <Text style={styles.infoValue}>Jersey</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.infoLabel}>Your Wine Expert</Text>
                      <Text style={styles.infoValue}>Jake Dunster</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity style={styles.editButton}>
                    <Edit3 size={16} color="#FFFFFF" />
                    <Text style={styles.editButtonText}>Edit your details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Address Section */}
            <View style={styles.section}>
              <View style={styles.addressContainer}>
                <View style={styles.addressBlock}>
                  <Text style={styles.addressTitle}>Delivery Address</Text>
                  <Text style={styles.addressText}>13 La Carriere</Text>
                  <Text style={styles.addressText}>Le Mont</Text>
                  <Text style={styles.addressText}>Jersey</Text>
                  <Text style={styles.addressText}>JE3 3AA</Text>
                </View>
                
                <View style={styles.addressBlock}>
                  <Text style={styles.addressTitle}>Billing Address</Text>
                  <Text style={styles.addressText}>Flat 5, 19, Midvale Road</Text>
                  <Text style={styles.addressText}>ST. HELIER</Text>
                  <Text style={styles.addressText}>JERSEY</Text>
                  <Text style={styles.addressText}>JE2 3YR</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.editButton}>
                <Edit3 size={16} color="#FFFFFF" />
                <Text style={styles.editButtonText}>Edit your addresses</Text>
              </TouchableOpacity>
            </View>

            {/* Benefits Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Don't miss your exclusive benefits</Text>
              <Text style={styles.benefitsText}>
                Our marketing subscribers enjoy special benefits, like Loyalty Vouchers, Special Offers, Exclusive Deals, Private Tastings, Special Events and News about Majestic's Wines, Beers and Spirits.
              </Text>
            </View>

            {/* Special Offers Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Special offers & exclusive products</Text>
              <Text style={styles.benefitsText}>
                It's our job to help you discover beers, wines and spirits that you'll love. From time to time, we'll send you brochures and leaflets.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },
  accountDetails: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2D3748',
  },
  accountInfo: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#718096',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  twoColumnInfo: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  column: {
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addressContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  addressBlock: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 2,
  },
  benefitsText: {
    fontSize: 16,
    color: '#2D3748',
    lineHeight: 24,
  },
});