import React, { useState, useEffect } from 'react';
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from './api';
import StatCards from './components/StatCards';
import CustomerForm from './components/CustomerForm';
import CustomerTable from './components/CustomerTable';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchCustomerList = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setErrorMessage(
        'Unable to connect to the backend server. Please verify Express is running on port 3200.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerList();
  }, []);

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (editingCustomer) {
        const updatedCustomer = await updateCustomer(editingCustomer.id, formData);
        setCustomers((prevCustomers) =>
          prevCustomers.map((c) =>
            c.id === editingCustomer.id ? updatedCustomer : c
          )
        );
        setEditingCustomer(null);
        setSuccessMessage(`Customer "${updatedCustomer.name}" updated successfully!`);
      } else {
        const createdCustomer = await createCustomer(formData);
        setCustomers((prevCustomers) => [...prevCustomers, createdCustomer]);
        setSuccessMessage(`Customer "${createdCustomer.name}" added successfully!`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage(error.message || 'Failed to save customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (id) => {
    setErrorMessage(null);
    try {
      await deleteCustomer(id);
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.id !== id)
      );

      if (editingCustomer && editingCustomer.id === id) {
        setEditingCustomer(null);
      }

      setSuccessMessage('Customer deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMessage(error.message || 'Failed to delete customer');
    }
  };

  const handleStartEdit = (customer) => {
    setEditingCustomer(customer);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
  };

  const filteredCustomers = customers.filter((customer) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      (customer.name && customer.name.toLowerCase().includes(term)) ||
      (customer.email && customer.email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="crm-app">
      <header className="app-header">
        <div className="header-container">
          <div className="logo-badge">CRM</div>
          <div>
            <h1 className="app-title">Mini CRM</h1>
            <p className="app-subtitle">Customer Relationship Management</p>
          </div>
        </div>
      </header>

      <main className="main-content">
        {errorMessage && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span className="alert-text">{errorMessage}</span>
            <button
              type="button"
              className="btn-retry"
              onClick={fetchCustomerList}
            >
              🔄 Retry
            </button>
            <button
              type="button"
              className="alert-dismiss"
              onClick={() => setErrorMessage(null)}
            >
              ✕
            </button>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            <span className="alert-text">{successMessage}</span>
            <button
              type="button"
              className="alert-dismiss"
              onClick={() => setSuccessMessage(null)}
            >
              ✕
            </button>
          </div>
        )}

        <StatCards
          totalCount={customers.length}
          filteredCount={filteredCustomers.length}
          isSearching={Boolean(searchTerm.trim())}
          isConnected={!errorMessage && !isLoading}
        />

        <CustomerForm
          onSubmit={handleFormSubmit}
          editingCustomer={editingCustomer}
          onCancelEdit={handleCancelEdit}
          isSubmitting={isSubmitting}
        />

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <CustomerTable
          customers={filteredCustomers}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onEdit={handleStartEdit}
          onDelete={handleDeleteCustomer}
          activeEditingId={editingCustomer ? editingCustomer.id : null}
        />
      </main>

      <footer className="app-footer">
        <p>Mini CRM &bull; React + Node.js + Express + PostgreSQL</p>
      </footer>
    </div>
  );
}

export default App;