import React from 'react';

function CustomerTable({
  customers,
  isLoading,
  searchTerm,
  onEdit,
  onDelete,
  activeEditingId,
}) {
  const handleDeleteClick = (customer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete customer "${customer.name}" (ID: ${customer.id})?`
    );
    if (confirmed) {
      onDelete(customer.id);
    }
  };

  return (
    <div className="table-card">
      <div className="table-header">
        <h3>📋 Customer Directory</h3>
        <span className="customer-count-badge">
          {customers.length} {customers.length === 1 ? 'Customer' : 'Customers'}
        </span>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading customers from PostgreSQL...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{searchTerm ? '🔍' : '📭'}</div>
          <h4>
            {searchTerm
              ? `No customers found matching "${searchTerm}"`
              : 'No customers in the database yet'}
          </h4>
          <p>
            {searchTerm
              ? 'Try adjusting your search terms or clearing the search bar.'
              : 'Use the form above to add your first customer!'}
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="customer-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className={activeEditingId === customer.id ? 'row-editing' : ''}
                >
                  <td className="id-cell">
                    <span className="id-tag">#{customer.id}</span>
                  </td>
                  <td className="name-cell">
                    <strong>{customer.name}</strong>
                  </td>
                  <td className="email-cell">
                    <a href={`mailto:${customer.email}`} className="email-link">
                      {customer.email}
                    </a>
                  </td>
                  <td className="actions-cell text-right">
                    <button
                      type="button"
                      className="btn-action btn-edit"
                      onClick={() => onEdit(customer)}
                      title="Edit Customer"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteClick(customer)}
                      title="Delete Customer"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CustomerTable;

