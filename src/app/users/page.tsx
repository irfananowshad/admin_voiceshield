'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { SAMPLE_USERS } from '@/lib/data/sampleData';
import { AdminUser, UserRole, UserStatus } from '@/lib/types/admin';
import { SampleDataPill } from '@/components/common/SampleDataPill';
import { Badge } from '@/components/common/Badge';

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(SAMPLE_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('Analyst');
  const [newDept, setNewDept] = useState('');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (userId: string, currentStatus: UserStatus) => {
    const nextStatus: UserStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
    );
    if (selectedUser?.id === userId) {
      setSelectedUser((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newUser: AdminUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'Active',
      department: newDept || 'General Telephony Security',
      analysesCount: 0,
      lastActive: 'Just invited',
      createdAt: new Date().toISOString().split('T')[0],
      avatarBg: newRole === 'Administrator' ? '#5542F6' : newRole === 'Analyst' ? '#059669' : '#2563EB'
    };

    setUsers([newUser, ...users]);
    setNewName('');
    setNewEmail('');
    setNewDept('');
    setIsAddUserModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="users-page">
        {/* Header Hero Card */}
        <div className="page-hero-card">
          <div className="page-hero-left">
            <div className="card-title-pill-row">
              <h1 className="page-hero-title">User Management</h1>
              <SampleDataPill />
            </div>
            <p className="page-hero-subtitle">
              Manage platform team members, fraud analysts, and RBAC authorization tiers.
            </p>
          </div>

          <div className="page-hero-actions">
            <button
              className="btn-primary"
              onClick={() => setIsAddUserModalOpen(true)}
            >
              + Add New User
            </button>
          </div>
        </div>

        {/* Users Table Card */}
        <div className="table-card">
          <div className="table-toolbar">
            <div className="table-search-input">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, email, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="table-filters">
              <select
                className="table-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Administrator">Administrator</option>
                <option value="Analyst">Analyst</option>
                <option value="End User">End User</option>
              </select>

              <select
                className="table-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department / Team</th>
                  <th>Status</th>
                  <th>Analyses Run</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px' }}>
                      No matching users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              backgroundColor: user.avatarBg || '#5542F6',
                              color: '#FFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 600,
                              fontSize: '13px',
                              flexShrink: 0
                            }}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge
                          status={user.role}
                          variant={user.role === 'Administrator' ? 'purple' : user.role === 'Analyst' ? 'healthy' : 'neutral'}
                          showDot={false}
                        />
                      </td>
                      <td>{user.department}</td>
                      <td>
                        <Badge status={user.status} />
                      </td>
                      <td style={{ fontWeight: 600 }}>{user.analysesCount.toLocaleString()}</td>
                      <td style={{ color: 'var(--text-light)', fontSize: '12.5px' }}>{user.lastActive}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span
                            className="table-action-link"
                            onClick={() => setSelectedUser(user)}
                          >
                            View
                          </span>
                          <span
                            style={{
                              fontSize: '12px',
                              cursor: 'pointer',
                              color: user.status === 'Active' ? '#DC2626' : '#059669',
                              fontWeight: 500
                            }}
                            onClick={() => handleToggleStatus(user.id, user.status)}
                          >
                            {user.status === 'Active' ? 'Suspend' : 'Activate'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-pagination-footer">
            <span className="pagination-info">
              Showing 1 to {filteredUsers.length} of {users.length} registered demo accounts
            </span>
            <div className="pagination-controls">
              <button className="pagination-btn" disabled>Previous</button>
              <button className="pagination-btn pagination-page-active">1</button>
              <button className="pagination-btn" disabled>Next</button>
            </div>
          </div>
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="search-modal-backdrop" onClick={() => setSelectedUser(null)}>
            <div className="search-modal-box" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
              <div className="search-modal-header" style={{ justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>User Profile Details</h3>
                <span className="search-modal-esc" onClick={() => setSelectedUser(null)}>ESC</span>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: selectedUser.avatarBg || '#5542F6',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '18px'
                    }}
                  >
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{selectedUser.name}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selectedUser.email}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F2F4F7' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Role Assignment:</span>
                    <Badge status={selectedUser.role} showDot={false} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F2F4F7' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Account Status:</span>
                    <Badge status={selectedUser.status} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F2F4F7' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Department:</span>
                    <span style={{ fontWeight: 600 }}>{selectedUser.department}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F2F4F7' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Analyses Conducted:</span>
                    <span style={{ fontWeight: 600 }}>{selectedUser.analysesCount} cases</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F2F4F7' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Member Since:</span>
                    <span>{selectedUser.createdAt}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Last Activity:</span>
                    <span>{selectedUser.lastActive}</span>
                  </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button className="btn-secondary" onClick={() => setSelectedUser(null)}>Close</button>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      handleToggleStatus(selectedUser.id, selectedUser.status);
                    }}
                  >
                    {selectedUser.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {isAddUserModalOpen && (
          <div className="search-modal-backdrop" onClick={() => setIsAddUserModalOpen(false)}>
            <div className="search-modal-box" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
              <div className="search-modal-header" style={{ justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Add New Platform User</h3>
                <span className="search-modal-esc" onClick={() => setIsAddUserModalOpen(false)}>ESC</span>
              </div>
              <form onSubmit={handleAddUser} style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-card)',
                        backgroundColor: '#FFFFFF'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. vikram@voiceshield.ai"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-card)',
                        backgroundColor: '#FFFFFF'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      Role Assignment
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as UserRole)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-card)',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <option value="Analyst">Analyst (Investigate cases & feedback)</option>
                      <option value="Administrator">Administrator (Full cluster management)</option>
                      <option value="End User">End User (Read-only)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      Department
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Fraud Investigation Unit"
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-card)',
                        backgroundColor: '#FFFFFF'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn-secondary" onClick={() => setIsAddUserModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

