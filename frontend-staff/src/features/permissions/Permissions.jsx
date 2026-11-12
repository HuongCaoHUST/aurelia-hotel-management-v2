import { useCallback, useEffect, useMemo, useState } from 'react';
import { hasPermission } from '../../app/access.js';
import { accessApi } from '../../app/api.js';

const groupDefinitions = [
  { id: 'overview', label: 'Overview', description: 'Hotel-wide visibility', icon: 'grid', matches: (code) => code.startsWith('DASHBOARD_') },
  { id: 'people', label: 'People & access', description: 'Team administration', icon: 'users', matches: (code) => code.startsWith('STAFF_') || code.startsWith('ROLE_') || code.startsWith('ACCESS_') },
  { id: 'rooms', label: 'Rooms', description: 'Inventory & availability', icon: 'bed', matches: (code) => code.startsWith('ROOM_') || code.startsWith('ROOMS_') },
  { id: 'amenities', label: 'Amenities', description: 'Guest-facing services', icon: 'sparkle', matches: (code) => code.startsWith('AMENITY_') || code.startsWith('AMENITIES_') },
];

const roleMeta = {
  ADMIN: { name: 'Administrator', icon: 'crown', tone: 'gold', description: 'Full access to hotel operations' },
  MANAGER: { name: 'Hotel manager', icon: 'briefcase', tone: 'blue', description: 'Oversees daily hotel performance' },
  RECEPTIONIST: { name: 'Front desk', icon: 'key', tone: 'teal', description: 'Reservations and guest arrivals' },
  HOUSEKEEPER: { name: 'Housekeeping', icon: 'sparkle', tone: 'rose', description: 'Room readiness and service' },
  TECHNICIAN: { name: 'Maintenance', icon: 'tool', tone: 'slate', description: 'Repairs and room operations' },
};

function titleCase(value) {
  return String(value || '')
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizePermission(permission) {
  return {
    id: permission.id,
    code: permission.code || '',
    name: permission.name || titleCase(permission.code),
    description: permission.description || 'No description provided.',
  };
}

function normalizeRole(role) {
  const code = String(role.name || '').toUpperCase();
  const metadata = roleMeta[code] || { name: titleCase(role.name), icon: 'briefcase', tone: 'blue', description: 'Role access profile' };
  return {
    id: role.id,
    code,
    name: metadata.name,
    description: role.description || metadata.description,
    icon: metadata.icon,
    tone: metadata.tone,
    permissions: (role.permissions || []).map(normalizePermission).filter((permission) => permission.id != null),
  };
}

function toRolePermissions(roles) {
  return Object.fromEntries(roles.map((role) => [role.id, role.permissions.map((permission) => permission.id)]));
}

function serializeRolePermissions(rolePermissions) {
  return Object.keys(rolePermissions).sort().map((roleId) => [roleId, [...rolePermissions[roleId]].sort()]);
}

function PermissionIcon({ name, size = 17 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="3" width="6" height="6" rx="1" /><rect x="3" y="15" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    bed: <><path d="M3 19v-8h18v8M3 15h18M7 11V8h5a3 3 0 0 1 3 3M3 19v2M21 19v2" /></>,
    sparkle: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
    crown: <><path d="m3 7 4 4 5-7 5 7 4-4-2 12H5L3 7Z" /><path d="M5 19h14" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></>,
    key: <><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9M16 6l2 2M13 9l2 2" /></>,
    tool: <><path d="m14.7 6.3 3-3a4.2 4.2 0 0 0 0 5.9l-8.5 8.5a2 2 0 0 1-2.8-2.8l8.5-8.5a4.2 4.2 0 0 0 5.9 0Z" /><path d="m5 5 3 3M4 4l1 1" /></>,
    check: <><path d="m5 12 4 4L19 6" /><circle cx="12" cy="12" r="9" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    refresh: <><path d="M20 11a8 8 0 0 0-14.9-3M4 4v4h4M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    edit: <><path d="m4 16 9.5-9.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /><path d="m14 7 3 3" /></>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function Permissions({ user, onNotice }) {
  const [roleList, setRoleList] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [rolePermissions, setRolePermissions] = useState({});
  const [savedPermissions, setSavedPermissions] = useState({});
  const [search, setSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [roleModal, setRoleModal] = useState(null);
  const [isRoleSaving, setRoleSaving] = useState(false);
  const [deletingRoleId, setDeletingRoleId] = useState(null);
  const [error, setError] = useState('');

  const loadAccessData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [roleResponse, permissionResponse] = await Promise.all([accessApi.roles(), accessApi.permissions()]);
      const nextPermissions = (permissionResponse || []).map(normalizePermission).filter((permission) => permission.id != null);
      const nextRoles = (roleResponse || []).map(normalizeRole).filter((role) => role.id != null);
      const nextRolePermissions = toRolePermissions(nextRoles);
      setPermissions(nextPermissions);
      setRoleList(nextRoles);
      setRolePermissions(nextRolePermissions);
      setSavedPermissions(nextRolePermissions);
      setSelectedRoleId((current) => nextRoles.some((role) => role.id === current) ? current : nextRoles[0]?.id || null);
    } catch (requestError) {
      const message = requestError.message || 'Không thể tải dữ liệu phân quyền.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccessData();
  }, [loadAccessData]);

  const selectedRole = roleList.find((role) => role.id === selectedRoleId) || null;
  const selectedPermissionIds = selectedRole ? (rolePermissions[selectedRole.id] || []) : [];
  const isDirty = JSON.stringify(serializeRolePermissions(rolePermissions)) !== JSON.stringify(serializeRolePermissions(savedPermissions));
  const assignedCount = Object.values(rolePermissions).reduce((total, ids) => total + ids.length, 0);
  const coverage = roleList.length && permissions.length
    ? Math.round((assignedCount / (roleList.length * permissions.length)) * 100)
    : 0;
  const canCreateRole = !user || hasPermission(user, 'ROLE_CREATE');
  const canUpdateRole = !user || hasPermission(user, 'ROLE_UPDATE');
  const canDeleteRole = !user || hasPermission(user, 'ROLE_DELETE');
  const canManagePermissions = !user || hasPermission(user, 'ROLE_MANAGE_PERMISSIONS');

  const visibleRoles = useMemo(() => {
    const query = roleSearch.trim().toLowerCase();
    if (!query) return roleList;
    return roleList.filter((role) => [role.name, role.code, role.description].some((value) => value.toLowerCase().includes(query)));
  }, [roleList, roleSearch]);

  const visibleGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    return groupDefinitions.map((group) => ({
      ...group,
      permissions: permissions.filter((permission) => group.matches(permission.code) && (!query || [permission.name, permission.code, permission.description].some((value) => value.toLowerCase().includes(query)))),
    })).filter((group) => group.permissions.length);
  }, [permissions, search]);

  function isPermissionEnabled(permissionId) {
    return selectedPermissionIds.includes(permissionId);
  }

  function togglePermission(permissionId) {
    if (!selectedRole) return;
    setRolePermissions((current) => {
      const currentPermissions = current[selectedRole.id] || [];
      const nextPermissions = currentPermissions.includes(permissionId)
        ? currentPermissions.filter((id) => id !== permissionId)
        : [...currentPermissions, permissionId];
      return { ...current, [selectedRole.id]: nextPermissions };
    });
  }

  function toggleGroup(group) {
    if (!selectedRole) return;
    const groupIds = group.permissions.map((permission) => permission.id);
    const hasEveryPermission = groupIds.every((id) => selectedPermissionIds.includes(id));
    setRolePermissions((current) => {
      const currentPermissions = current[selectedRole.id] || [];
      const nextPermissions = hasEveryPermission
        ? currentPermissions.filter((id) => !groupIds.includes(id))
        : [...new Set([...currentPermissions, ...groupIds])];
      return { ...current, [selectedRole.id]: nextPermissions };
    });
  }

  async function saveChanges() {
    if (!selectedRole || !isDirty) return;
    setSaving(true);
    try {
      const response = await accessApi.replaceRolePermissions(selectedRole.id, selectedPermissionIds);
      const savedRole = normalizeRole(response);
      const nextRolePermissions = { ...rolePermissions, [selectedRole.id]: savedRole.permissions.map((permission) => permission.id) };
      setRolePermissions(nextRolePermissions);
      setSavedPermissions((current) => ({ ...current, [selectedRole.id]: nextRolePermissions[selectedRole.id] }));
      setRoleList((current) => current.map((role) => role.id === savedRole.id ? savedRole : role));
      onNotice?.(`Đã lưu quyền cho ${selectedRole.name}.`, 'success');
    } catch (requestError) {
      onNotice?.(requestError.message || 'Không thể lưu quyền cho role.', 'error');
    } finally {
      setSaving(false);
    }
  }

  function discardChanges() {
    setRolePermissions(savedPermissions);
  }

  async function saveRole(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') || '').trim(),
      description: String(form.get('description') || '').trim(),
      permissionIds: roleModal.mode === 'edit' ? (rolePermissions[roleModal.role.id] || []) : [],
    };
    setRoleSaving(true);
    try {
      const response = roleModal.mode === 'edit'
        ? await accessApi.updateRole(roleModal.role.id, payload)
        : await accessApi.createRole(payload);
      const savedRole = normalizeRole(response);
      const savedRoleIds = savedRole.permissions.map((permission) => permission.id);
      setRoleList((current) => roleModal.mode === 'edit'
        ? current.map((role) => role.id === savedRole.id ? savedRole : role)
        : [...current, savedRole]);
      setRolePermissions((current) => ({ ...current, [savedRole.id]: savedRoleIds }));
      setSavedPermissions((current) => ({ ...current, [savedRole.id]: savedRoleIds }));
      setSelectedRoleId(savedRole.id);
      setRoleModal(null);
      onNotice?.(roleModal.mode === 'edit' ? `Đã cập nhật role ${savedRole.name}.` : `Đã tạo role ${savedRole.name}.`, 'success');
    } catch (requestError) {
      onNotice?.(requestError.message || 'Không thể lưu role.', 'error');
    } finally {
      setRoleSaving(false);
    }
  }

  async function deleteRole(role) {
    if (role.code === 'ADMIN' || deletingRoleId) return;
    if (!window.confirm(`Xóa role ${role.name}? Thao tác này không thể hoàn tác.`)) return;
    setDeletingRoleId(role.id);
    try {
      await accessApi.deleteRole(role.id);
      const nextRoles = roleList.filter((item) => item.id !== role.id);
      const nextRolePermissions = { ...rolePermissions };
      const nextSavedPermissions = { ...savedPermissions };
      delete nextRolePermissions[role.id];
      delete nextSavedPermissions[role.id];
      setRoleList(nextRoles);
      setRolePermissions(nextRolePermissions);
      setSavedPermissions(nextSavedPermissions);
      if (selectedRoleId === role.id) setSelectedRoleId(nextRoles[0]?.id || null);
      onNotice?.(`Đã xóa role ${role.name}.`, 'success');
    } catch (requestError) {
      onNotice?.(requestError.message || 'Không thể xóa role.', 'error');
    } finally {
      setDeletingRoleId(null);
    }
  }

  if (isLoading) {
    return <div className="permissions-state"><span className="permissions-state-icon"><PermissionIcon name="refresh" size={20} /></span><h2>Loading access policy</h2><p>Reading roles and permissions from the hotel database.</p></div>;
  }

  if (error) {
    return <div className="permissions-state permissions-state-error"><span className="permissions-state-icon"><PermissionIcon name="refresh" size={20} /></span><h2>Could not load permissions</h2><p>{error}</p><button className="secondary-button" type="button" onClick={loadAccessData}><PermissionIcon name="refresh" size={16} /> Try again</button></div>;
  }

  return <>
    <div className="page-heading permissions-heading">
      <div>
        <p className="eyebrow">People & access <span className="heading-dot" /> Role governance</p>
        <h1>Permissions</h1>
        <p>Control what each team role can see and manage across Aurelia Hotel.</p>
      </div>
      <div className="permissions-heading-actions">
        <button className="secondary-button" type="button" onClick={() => setRoleModal({ mode: 'create' })} disabled={!canCreateRole}><PermissionIcon name="plus" size={16} /> Create role</button>
        {isDirty && <span className="unsaved-label"><span /> Unsaved changes</span>}
        <button className="secondary-button" type="button" onClick={discardChanges} disabled={!isDirty || isSaving}>Discard</button>
        <button className="primary-button" type="button" onClick={saveChanges} disabled={!isDirty || isSaving || !canManagePermissions}><PermissionIcon name="check" size={16} />{isSaving ? 'Saving…' : 'Save changes'}</button>
      </div>
    </div>

    <section className="permissions-overview" aria-label="Permission overview">
      <article className="permissions-stat-card"><span className="permissions-stat-icon gold"><PermissionIcon name="briefcase" /></span><p>Active roles</p><strong>{roleList.length}</strong><small>From the hotel database</small></article>
      <article className="permissions-stat-card"><span className="permissions-stat-icon teal"><PermissionIcon name="key" /></span><p>Permission rules</p><strong>{permissions.length}</strong><small>Loaded from the API</small></article>
      <article className="permissions-stat-card"><span className="permissions-stat-icon blue"><PermissionIcon name="check" /></span><p>Access coverage</p><strong>{coverage}%</strong><small>{assignedCount} assignments in total</small></article>
      <div className="permissions-info-card"><span className="permissions-info-mark">i</span><div><strong>Least privilege by default</strong><p>Only roles and permissions stored in the hotel database appear in this workspace.</p></div></div>
    </section>

    {!roleList.length || !permissions.length ? <div className="panel permissions-state permissions-state-empty"><span className="permissions-state-icon"><PermissionIcon name="key" size={20} /></span><h2>No access policy found</h2><p>{!roleList.length ? 'No roles have been created in the database yet.' : 'No permissions have been created in the database yet.'}</p></div> : <div className="permissions-layout">
      <section className="panel role-list-panel">
        <div className="permissions-panel-heading"><div><p className="eyebrow">Access profiles</p><h2>Roles <span>{roleList.length}</span></h2></div></div>
        <label className="permissions-search"><PermissionIcon name="search" size={16} /><input value={roleSearch} onChange={(event) => setRoleSearch(event.target.value)} placeholder="Search roles" aria-label="Search roles" /></label>
        <div className="role-list">
          {visibleRoles.map((role) => {
            const count = rolePermissions[role.id]?.length || 0;
            return <div className={`role-list-item ${selectedRoleId === role.id ? 'is-selected' : ''}`} key={role.id}>
              <button className="role-list-select" type="button" onClick={() => setSelectedRoleId(role.id)}>
                <span className={`role-avatar ${role.tone}`}><PermissionIcon name={role.icon} size={17} /></span>
                <span className="role-list-copy"><strong>{role.name}</strong><small>{role.description}</small></span>
                <span className="role-list-count">{count}<small>/{permissions.length}</small></span>
              </button>
              <span className="role-list-actions">
                <button className="role-card-action" type="button" onClick={() => setRoleModal({ mode: 'edit', role })} disabled={!canUpdateRole} aria-label={`Edit ${role.name}`} title={canUpdateRole ? `Edit ${role.name}` : 'Missing ROLE_UPDATE permission'}><PermissionIcon name="edit" size={14} /></button>
                <button className="role-card-action is-danger" type="button" onClick={() => deleteRole(role)} disabled={!canDeleteRole || role.code === 'ADMIN' || deletingRoleId === role.id} aria-label={`Delete ${role.name}`} title={role.code === 'ADMIN' ? 'ADMIN cannot be deleted' : canDeleteRole ? `Delete ${role.name}` : 'Missing ROLE_DELETE permission'}>{deletingRoleId === role.id ? '…' : <PermissionIcon name="trash" size={14} />}</button>
              </span>
            </div>;
          })}
          {!visibleRoles.length && <p className="permissions-empty-copy">No roles match your search.</p>}
        </div>
      </section>

      {selectedRole && <section className="panel permission-matrix-panel">
        <div className="permission-matrix-header"><div className="permission-role-heading"><span className={`role-avatar ${selectedRole.tone}`}><PermissionIcon name={selectedRole.icon} size={19} /></span><div><p className="eyebrow">Editing access for</p><h2>{selectedRole.name}</h2><p>{selectedRole.description}</p></div></div><div className="permission-role-summary"><strong>{selectedPermissionIds.length}<span>/{permissions.length}</span></strong><small>permissions enabled</small></div></div>
        <div className="permission-toolbar"><label className="permissions-search"><PermissionIcon name="search" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search permissions" aria-label="Search permissions" /></label></div>
        <div className="permission-groups">
          {visibleGroups.map((group) => {
            const enabledInGroup = group.permissions.filter((permission) => isPermissionEnabled(permission.id)).length;
            const groupIsComplete = enabledInGroup === group.permissions.length;
            return <section className="permission-group" key={group.id}>
              <div className="permission-group-heading"><div><span className="permission-group-icon"><PermissionIcon name={group.icon} size={16} /></span><div><h3>{group.label}</h3><p>{group.description}</p></div></div><button className={`permission-switch permission-group-toggle ${groupIsComplete ? 'is-on' : ''}`} type="button" role="switch" aria-checked={groupIsComplete} aria-label={`${groupIsComplete ? 'Disable' : 'Enable'} all ${group.label} permissions`} title={`${groupIsComplete ? 'Disable' : 'Enable'} all ${group.label} permissions`} onClick={() => toggleGroup(group)}><span /></button></div>
              <div className="permission-rows">{group.permissions.map((permission) => <div className={`permission-row ${isPermissionEnabled(permission.id) ? 'is-enabled' : ''}`} key={permission.id}><div className="permission-row-copy"><strong>{permission.name}</strong><p>{permission.description}</p><code>{permission.code}</code></div><button className={`permission-switch ${isPermissionEnabled(permission.id) ? 'is-on' : ''}`} type="button" role="switch" aria-checked={isPermissionEnabled(permission.id)} aria-label={`${isPermissionEnabled(permission.id) ? 'Disable' : 'Enable'} ${permission.name}`} onClick={() => togglePermission(permission.id)}><span /></button></div>)}</div>
            </section>;
          })}
          {!visibleGroups.length && <div className="permission-empty-state"><span><PermissionIcon name="search" size={21} /></span><h3>No permissions found</h3><p>Try searching for a different permission or code.</p></div>}
        </div>
        <div className="permission-matrix-footer"><span className="status-dot" /> Changes apply to every staff account assigned to this role <span>·</span> Last reviewed from the database</div>
      </section>}
    </div>}
    {roleModal && <RoleModal mode={roleModal.mode} role={roleModal.role} isSaving={isRoleSaving} onClose={() => setRoleModal(null)} onSubmit={saveRole} />}
  </>;
}

function RoleModal({ mode, role, isSaving, onClose, onSubmit }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="account-modal role-modal" role="dialog" aria-modal="true" aria-labelledby="role-modal-title">
      <div className="modal-heading"><div><p className="eyebrow">People & access</p><h2 id="role-modal-title">{mode === 'edit' ? 'Edit role' : 'Create role'}</h2><p>{mode === 'edit' ? 'Update the role details without changing its current permissions.' : 'Create an empty role, then assign permissions from the matrix.'}</p></div><button className="close-button" type="button" onClick={onClose} aria-label="Close"><PermissionIcon name="close" /></button></div>
      <form className="account-form" onSubmit={onSubmit}>
        <label htmlFor="role-name">Role name<input id="role-name" name="name" defaultValue={role?.code || ''} placeholder="e.g. Night auditor" required maxLength="80" /></label>
        <label htmlFor="role-description">Description<span className="field-hint">Optional</span><textarea id="role-description" name="description" defaultValue={role?.description || ''} placeholder="What is this role responsible for?" maxLength="500" /></label>
        <div className="form-actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit" disabled={isSaving}>{isSaving ? 'Saving…' : mode === 'edit' ? 'Save role' : 'Create role'}</button></div>
      </form>
    </div>
  </div>;
}
