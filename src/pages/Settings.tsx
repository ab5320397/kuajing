import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuthContext } from '@/contexts/authContext.tsx';
import { toast } from 'sonner';

// Define payment method type
type PaymentMethod = {
  id: string;
  type: 'credit_card' | 'paypal';
  details: {
    // Credit card details
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    bankName?: string;
    
    // PayPal details
    email?: string;
    name?: string;
  };
  isDefault: boolean;
};

export default function Settings() {
  const { t, language } = useLanguage();
  const { user } = useContext(AuthContext);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isAddingMethod, setIsAddingMethod] = useState(false);
  const [newMethodType, setNewMethodType] = useState<'credit_card' | 'paypal'>('credit_card');
  // Contact information state
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: '',
    hours: ''
  });
  
  // Load contact information from localStorage
  useEffect(() => {
    try {
      const savedContactInfo = localStorage.getItem('contactInfo');
      if (savedContactInfo) {
        setContactInfo(JSON.parse(savedContactInfo));
      }
    } catch (error) {
      console.error('Failed to load contact information:', error);
    }
  }, []);
  
  // Save contact information to localStorage
  const saveContactInfo = () => {
    try {
      localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
      toast.success('Contact information saved successfully');
    } catch (error) {
      console.error('Failed to save contact information:', error);
      toast.error('Failed to save contact information');
    }
  };
  
  const [formData, setFormData] = useState({
    // Credit card form
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    bankName: '',
    
    // PayPal form
    paypalEmail: '',
    paypalName: '',
    
    // Common
    isDefault: false
  });

  // Load payment methods from localStorage
  useEffect(() => {
    try {
      const savedMethods = localStorage.getItem('paymentMethods');
      if (savedMethods) {
        setPaymentMethods(JSON.parse(savedMethods));
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
      toast.error('Failed to load payment methods');
    }
  }, []);

  // Save payment methods to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
    } catch (error) {
      console.error('Failed to save payment methods:', error);
      toast.error('Failed to save payment methods');
    }
  }, [paymentMethods]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle adding a new payment method
  const handleAddPaymentMethod = () => {
    // Form validation
    if (newMethodType === 'credit_card') {
      if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate || !formData.cvv || !formData.bankName) {
        toast.error('Please fill in all credit card information');
        return;
      }
      
      // Simple card number validation (only show last four digits)
      const lastFourDigits = formData.cardNumber.slice(-4);
      const maskedCardNumber = '**** **** **** ' + lastFourDigits;
      
      // Create new credit card
      const newMethod: PaymentMethod = {
        id: 'credit_' + Date.now(),
        type: 'credit_card',
        details: {
          cardNumber: maskedCardNumber,
          cardHolder: formData.cardHolder,
          expiryDate: formData.expiryDate,
          bankName: formData.bankName
        },
        isDefault: formData.isDefault
      };
      
      addMethodAndUpdateDefaults(newMethod);
    } else {
      // PayPal validation
      if (!formData.paypalEmail || !formData.paypalName) {
        toast.error('Please fill in all PayPal information');
        return;
      }
      
      // Create new PayPal account
      const newMethod: PaymentMethod = {
        id: 'paypal_' + Date.now(),
        type: 'paypal',
        details: {
          email: formData.paypalEmail,
          name: formData.paypalName
        },
        isDefault: formData.isDefault
      };
      
      addMethodAndUpdateDefaults(newMethod);
    }
    
    // Reset form and close add mode
    resetForm();
    setIsAddingMethod(false);
    toast.success('Payment method added successfully');
  };

  // Add new method and update defaults
  const addMethodAndUpdateDefaults = (newMethod: PaymentMethod) => {
    let updatedMethods = [...paymentMethods, newMethod];
    
    // If set as default, update other methods to non-default
    if (newMethod.isDefault) {
      updatedMethods = updatedMethods.map(method => ({
        ...method,
        isDefault: method.id === newMethod.id
      }));
    }
    
    setPaymentMethods(updatedMethods);
  };

  // Delete payment method
  const handleDeletePaymentMethod = (id: string) => {
    const updatedMethods = paymentMethods.filter(method => method.id !== id);
    setPaymentMethods(updatedMethods);
    toast.success('Payment method deleted');
  };

  // Set default payment method
  const handleSetDefault = (id: string) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    setPaymentMethods(updatedMethods);
    toast.success('Default payment method updated');
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
      bankName: '',
      paypalEmail: '',
      paypalName: '',
      isDefault: false
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-light">Account Settings</h1>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
          
          {/* User Profile Section */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <h2 className="text-xl font-medium mb-6 pb-4 border-b border-gray-100">Profile</h2>
            
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                  {user?.name ? (
                    <span className="text-xl font-medium text-gray-700">{user.name.charAt(0).toUpperCase()}</span>
                  ) : (
                    <i className="fa-solid fa-user text-xl text-gray-400"></i>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-1">{user?.name || 'User'}</h3>
                  <p className="text-gray-500 mb-4">{user?.email || 'user@example.com'}</p>
                  <button className="text-sm text-[var(--color-accent)] hover:text-black transition-colors">
                    Change profile picture
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name?.split(' ')[0] || 'First'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name?.split(' ')[1] || 'Last'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email || 'user@example.com'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                  <button className="text-sm text-[var(--color-accent)] hover:text-black transition-colors mt-2">
                    Change password
                  </button>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button className="bg-[var(--color-primary)] hover:bg-black text-white font-medium py-2 px-6 rounded-md transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
          
          {/* Address Management */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-medium">Addresses</h2>
              <button className="text-sm text-[var(--color-accent)] hover:text-black transition-colors flex items-center">
                Add New Address <i className="fa-solid fa-plus ml-2 text-xs"></i>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 border border-gray-200 rounded-md relative">
                <div className="absolute top-6 right-6">
                  <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded">Default</span>
                </div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p className="text-gray-700 mb-1">{user?.name || 'User'}</p>
                <p className="text-gray-700 mb-1">123 Fashion Avenue</p>
                <p className="text-gray-700 mb-3">New York, NY 10001</p>
                <p className="text-gray-700 mb-4">+1 (555) 123-4567</p>
                <div className="flex space-x-3">
                  <button className="text-sm text-gray-600 hover:text-black transition-colors">Edit</button>
                  <button className="text-sm text-gray-600 hover:text-black transition-colors">Remove</button>
                </div>
              </div>
              
              <div className="p-6 border border-gray-200 rounded-md">
                <h3 className="font-medium mb-2">Billing Address</h3>
                <p className="text-gray-700 mb-1">{user?.name || 'User'}</p>
                <p className="text-gray-700 mb-1">123 Fashion Avenue</p>
                <p className="text-gray-700 mb-3">New York, NY 10001</p>
                <div className="flex space-x-3">
                  <button className="text-sm text-gray-600 hover:text-black transition-colors">Edit</button>
                  <button className="text-sm text-gray-600 hover:text-black transition-colors">Remove</button>
                  <button className="text-sm text-gray-600 hover:text-black transition-colors">Set as Default</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-medium">Payment Methods</h2>
              <button 
                onClick={() => setIsAddingMethod(true)}
                className="text-sm text-[var(--color-accent)] hover:text-black transition-colors flex items-center"
              >
                Add Payment Method <i className="fa-solid fa-plus ml-2 text-xs"></i>
              </button>
            </div>
            
            <div className="space-y-6">
              {paymentMethods.length > 0 ? (
                paymentMethods.map(method => (
                  <div 
                    key={method.id} 
                    className="p-6 border border-gray-200 rounded-md hover:border-[var(--color-accent)] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        {method.type === 'credit_card' ? (
                          <i className="fa-brands fa-cc-visa text-xl mr-3"></i>
                        ) : (
                          <i className="fa-brands fa-paypal text-xl mr-3"></i>
                        )}
                        <div>
                          <div className="font-medium">
                            {method.type === 'credit_card' ? `${method.details.bankName} Credit Card` : 'PayPal'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {method.type === 'credit_card' 
                              ? method.details.cardNumber 
                              : method.details.email
                            }
                          </div>
                        </div>
                      </div>
                      {method.isDefault && (
                        <span className="text-xs font-medium bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between">
                      <button 
                        onClick={() => handleSetDefault(method.id)}
                        disabled={method.isDefault}
                        className={`text-sm transition-colors ${
                          method.isDefault ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        Set as Default
                      </button>
                      
                      <div className="flex space-x-4">
                        <button className="text-sm text-gray-600 hover:text-black transition-colors">Edit</button>
                        <button 
                          onClick={() => handleDeletePaymentMethod(method.id)}
                          className="text-sm text-red-600 hover:text-red-800 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <i className="fa-solid fa-credit-card text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 mb-6">No payment methods added yet</p>
                  <button 
                    onClick={() => setIsAddingMethod(true)}
                    className="bg-[var(--color-primary)] hover:bg-black text-white font-medium py-2 px-6 rounded-md transition-colors inline-block"
                  >
                    Add Payment Method
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Communication Preferences */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <h2 className="text-xl font-medium mb-6 pb-4 border-b border-gray-100">Communication Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive updates about new collections and special offers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-accent)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                </label>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">SMS Updates</h3>
                  <p className="text-sm text-gray-500">Get text messages about order updates and shipping notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-accent)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                </label>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">AI Recommendations</h3>
                  <p className="text-sm text-gray-500">Receive personalized product recommendations based on your preferences</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-accent)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                </label>
              </div>
              
              <div className="pt-4">
                <button className="w-full bg-[var(--color-primary)] hover:bg-black text-white font-medium py-2 px-6 rounded-md transition-colors">
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
          
          {/* Language and Currency */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <h2 className="text-xl font-medium mb-6 pb-4 border-b border-gray-100">Language & Currency</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Language</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
                  <option value="en" selected>English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="zh">中文</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Currency</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
                  <option value="USD" selected>USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="CNY">CNY - Chinese Yuan</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button className="w-full bg-[var(--color-primary)] hover:bg-black text-white font-medium py-2 px-6 rounded-md transition-colors">
                Save Changes
              </button>
            </div>
          </div>
          
          {/* Add Payment Method Form */}
          {isAddingMethod && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium">Add Payment Method</h2>
                    <button 
                      onClick={() => {
                        setIsAddingMethod(false);
                        resetForm();
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <i className="fa-solid fa-times text-xl"></i>
                    </button>
                  </div>
                  
                  {/* Payment method selector */}
                  <div className="mb-6">
                    <div className="flex border rounded-lg overflow-hidden mb-6">
                      <button
                        onClick={() => setNewMethodType('credit_card')}
                        className={`flex-1 py-2 px-4 font-medium ${
                          newMethodType === 'credit_card' 
                            ? 'bg-[var(--color-primary)] text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <i className="fa-brands fa-cc-visa mr-2"></i>Credit Card
                      </button>
                      <button
                        onClick={() => setNewMethodType('paypal')}
                        className={`flex-1 py-2 px-4 font-medium ${
                          newMethodType === 'paypal' 
                            ? 'bg-[var(--color-primary)] text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <i className="fa-brands fa-paypal mr-2"></i>PayPal
                      </button>
                    </div>
                    
                    {/* Credit card form */}
                    {newMethodType === 'credit_card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            name="cardHolder"
                            value={formData.cardHolder}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                            placeholder="Enter cardholder name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Expiry Date (MM/YY)
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                              placeholder="123"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                            placeholder="Enter bank name"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* PayPal form */}
                    {newMethodType === 'paypal' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="paypalName"
                            value={formData.paypalName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                            placeholder="Enter your full name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            PayPal Email
                          </label>
                          <input
                            type="email"
                            name="paypalEmail"
                            value={formData.paypalEmail}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                            placeholder="Enter your PayPal email address"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={formData.isDefault}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-[var(--color-accent)] focus:ring-[var(--color-accent)] border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Set as default payment method</span>
                      </label>
                    </div>
                    
                    <div className="mt-6 flex space-x-4">
                      <button
                        onClick={() => {
                          setIsAddingMethod(false);
                          resetForm();
                        }}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                      
                      <button
                        onClick={handleAddPaymentMethod}
                        className="flex-1 bg-[var(--color-primary)] hover:bg-black text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}