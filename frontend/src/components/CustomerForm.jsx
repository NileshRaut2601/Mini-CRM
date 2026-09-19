import React, { useState, useEffect } from 'react';

function CustomerForm({ onSubmit, editingCustomer, onCancelEdit, isSubmitting }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (editingCustomer) {
      setName(editingCustomer.name);
      setEmail(editingCustomer.email);
      setValidationErrors({});
    } else {
      setName('');
      setEmail('');
      setValidationErrors({});
    }
  }, [editingCustomer]);

  const validateForm = () => {
    const errors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      errors.name = 'Customer name is required';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (trimmedName.length > 100) {
      errors.name = 'Name must be 100 characters or fewer';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address (e.g. name@example.com)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      email: email.trim(),
    });
  };

  const handleCancel = () => {
    setName('');
    setEmail('');
    setValidationErrors({});
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <div className={`form-card ${editingCustomer ? 'editing-mode' : ''}`}>
      <div className="form-header">
        <h3>{editingCustomer ? '✏️ Edit Customer' : '➕ Add New Customer'}</h3>
        {editingCustomer && (
          <span className="badge edit-badge">Editing ID #{editingCustomer.id}</span>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="customer-name">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="customer-name"
              type="text"
              placeholder="e.g. Nilesh Raut"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (validationErrors.name) {
                  setValidationErrors({ ...validationErrors, name: null });
                }
              }}
              className={validationErrors.name ? 'input-error' : ''}
              disabled={isSubmitting}
            />
            {validationErrors.name && (
              <span className="error-text">{validationErrors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="customer-email">
              Email Address <span className="required">*</span>
            </label>
            <input
              id="customer-email"
              type="email"
              placeholder="e.g. nilesh@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) {
                  setValidationErrors({ ...validationErrors, email: null });
                }
              }}
              className={validationErrors.email ? 'input-error' : ''}
              disabled={isSubmitting}
            />
            {validationErrors.email && (
              <span className="error-text">{validationErrors.email}</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className={`btn ${editingCustomer ? 'btn-primary-update' : 'btn-primary'}`}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving...'
              : editingCustomer
              ? 'Update Customer'
              : 'Add Customer'}
          </button>

          {editingCustomer && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;
