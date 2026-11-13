import { useEffect, useMemo, useState } from 'react';
import { amenityApi } from '../../app/api.js';

const emptyGroup = { name: '', description: '', active: true };
const emptyAmenity = { name: '', icon: '', description: '', status: 'ACTIVE', groupId: '' };

const statusLabels = {
  ACTIVE: 'Active',
  MAINTENANCE: 'Maintenance',
  INACTIVE: 'Inactive',
};

function AmenityIcon({ name, size = 17 }) {
  const paths = {
    sparkle: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    refresh: <><path d="M20 11a8 8 0 0 0-14.9-3M4 4v4h4M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4" /></>,
    edit: <><path d="m4 16 9.5-9.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /><path d="m14 7 3 3" /></>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l-1-14M9 7V4h6v3" /></>,
    pause: <><path d="M8 5v14M16 5v14" /></>,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    check: <><path d="m5 12 4 4L19 6" /><circle cx="12" cy="12" r="9" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function Amenities({ onNotice }) {
  const [groups, setGroups] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groupSearch, setGroupSearch] = useState('');
  const [amenitySearch, setAmenitySearch] = useState('');
  const [groupForm, setGroupForm] = useState(null);
  const [amenityForm, setAmenityForm] = useState(null);
  const [updatingAmenityId, setUpdatingAmenityId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [groupData, amenityData] = await Promise.all([amenityApi.groups(), amenityApi.list()]);
      setGroups(groupData || []);
      setAmenities(amenityData || []);
    } catch (requestError) {
      const message = requestError.message || 'Unable to load amenities.';
      setError(message);
      onNotice?.(message, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setSelectedGroupId((current) => groups.some((group) => group.id === current) ? current : groups[0]?.id || null);
  }, [groups]);

  useEffect(() => {
    if (!groupForm && !amenityForm) return undefined;
    function handleKeyDown(event) {
      if (event.key !== 'Escape') return;
      if (amenityForm) setAmenityForm(null);
      else setGroupForm(null);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [groupForm, amenityForm]);

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) || null;
  const visibleGroups = useMemo(() => {
    const query = groupSearch.trim().toLowerCase();
    if (!query) return groups;
    return groups.filter((group) => [group.name, group.description || ''].some((value) => value.toLowerCase().includes(query)));
  }, [groups, groupSearch]);
  const selectedGroupAmenities = useMemo(() => amenities.filter((amenity) => amenity.groupId === selectedGroupId), [amenities, selectedGroupId]);
  const visibleAmenities = useMemo(() => {
    const query = amenitySearch.trim().toLowerCase();
    if (!query) return selectedGroupAmenities;
    return selectedGroupAmenities.filter((amenity) => [amenity.name, amenity.description || '', amenity.icon || ''].some((value) => value.toLowerCase().includes(query)));
  }, [selectedGroupAmenities, amenitySearch]);
  const activeGroupCount = groups.filter((group) => group.active !== false).length;
  const activeAmenityCount = amenities.filter((amenity) => amenity.status === 'ACTIVE').length;

  async function saveGroup(event) {
    event.preventDefault();
    const payload = { name: groupForm.name, description: groupForm.description, active: groupForm.active };
    try {
      const saved = groupForm.id ? await amenityApi.updateGroup(groupForm.id, payload) : await amenityApi.createGroup(payload);
      setGroups((current) => (groupForm.id
        ? current.map((item) => item.id === saved.id ? saved : item)
        : [...current, saved].sort((first, second) => first.name.localeCompare(second.name))));
      setSelectedGroupId(saved.id);
      setGroupForm(null);
      onNotice?.('Amenity group saved.');
    } catch (requestError) {
      onNotice?.(requestError.message || 'Unable to save amenity group.', 'error');
    }
  }

  async function saveAmenity(event) {
    event.preventDefault();
    const payload = { name: amenityForm.name, icon: amenityForm.icon, description: amenityForm.description, status: amenityForm.status, groupId: Number(amenityForm.groupId) };
    try {
      const saved = amenityForm.id ? await amenityApi.update(amenityForm.id, payload) : await amenityApi.create(payload);
      setAmenities((current) => (amenityForm.id
        ? current.map((item) => item.id === saved.id ? saved : item)
        : [...current, saved].sort((first, second) => first.name.localeCompare(second.name))));
      setSelectedGroupId(saved.groupId);
      setAmenityForm(null);
      onNotice?.('Amenity saved.');
    } catch (requestError) {
      onNotice?.(requestError.message || 'Unable to save amenity.', 'error');
    }
  }

  async function toggleGroup(group) {
    try {
      const saved = await amenityApi.updateGroup(group.id, { name: group.name, description: group.description || '', active: group.active === false });
      setGroups((current) => current.map((item) => item.id === saved.id ? saved : item));
      onNotice?.(`Group ${saved.active ? 'activated' : 'deactivated'}.`);
    } catch (requestError) {
      onNotice?.(requestError.message || 'Unable to update group status.', 'error');
    }
  }

  async function toggleAmenity(amenity) {
    setUpdatingAmenityId(amenity.id);
    try {
      const saved = await amenityApi.update(amenity.id, { name: amenity.name, icon: amenity.icon || '', description: amenity.description || '', status: amenity.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE', groupId: amenity.groupId });
      setAmenities((current) => current.map((item) => item.id === saved.id ? saved : item));
      onNotice?.(`${saved.name} ${saved.status === 'ACTIVE' ? 'activated' : 'deactivated'}.`);
    } catch (requestError) {
      onNotice?.(requestError.message || 'Unable to update amenity status.', 'error');
    } finally {
      setUpdatingAmenityId(null);
    }
  }

  async function removeGroup(group) {
    if (!window.confirm(`Delete the ${group.name} group?`)) return;
    try {
      await amenityApi.deleteGroup(group.id);
      setGroups((current) => current.filter((item) => item.id !== group.id));
      onNotice?.('Amenity group deleted.');
    } catch (requestError) {
      onNotice?.(requestError.message || 'Unable to delete group.', 'error');
    }
  }

  async function removeAmenity(amenity) {
    if (!window.confirm(`Delete ${amenity.name}?`)) return;
    try {
      await amenityApi.delete(amenity.id);
      setAmenities((current) => current.filter((item) => item.id !== amenity.id));
      onNotice?.('Amenity deleted.');
    } catch (requestError) {
      onNotice?.(requestError.message || 'Unable to delete amenity.', 'error');
    }
  }

  function editGroup(group) {
    setGroupForm({ id: group.id, name: group.name, description: group.description || '', active: group.active !== false });
  }

  function editAmenity(amenity) {
    setAmenityForm({ id: amenity.id, name: amenity.name, icon: amenity.icon || '', description: amenity.description || '', status: amenity.status || 'ACTIVE', groupId: amenity.groupId });
  }

  if (loading) {
    return <div className="permissions-state"><span className="permissions-state-icon"><AmenityIcon name="refresh" size={20} /></span><h2>Loading amenities</h2><p>Reading amenity groups and services from the hotel database.</p></div>;
  }

  if (error) {
    return <div className="permissions-state permissions-state-error"><span className="permissions-state-icon"><AmenityIcon name="refresh" size={20} /></span><h2>Could not load amenities</h2><p>{error}</p><button className="secondary-button" type="button" onClick={load}><AmenityIcon name="refresh" size={16} /> Try again</button></div>;
  }

  return <>
    <div className="page-heading permissions-heading"><div><h1>Amenities</h1></div><button className="primary-button" type="button" onClick={() => setAmenityForm({ ...emptyAmenity, groupId: selectedGroupId || groups[0]?.id || '' })} disabled={!groups.length}><AmenityIcon name="plus" size={16} /> Add amenity</button></div>

    <section className="permissions-overview" aria-label="Amenity overview">
      <article className="permissions-stat-card"><span className="permissions-stat-icon gold"><AmenityIcon name="sparkle" /></span><p>Active groups</p><strong>{activeGroupCount}</strong><small>{groups.length} groups in the database</small></article>
      <article className="permissions-stat-card"><span className="permissions-stat-icon teal"><AmenityIcon name="sparkle" /></span><p>Amenity catalog</p><strong>{amenities.length}</strong><small>Loaded from the API</small></article>
      <article className="permissions-stat-card"><span className="permissions-stat-icon blue"><AmenityIcon name="check" /></span><p>Active services</p><strong>{activeAmenityCount}</strong><small>{amenities.length ? Math.round((activeAmenityCount / amenities.length) * 100) : 0}% currently available</small></article>
    </section>

    {!groups.length ? <div className="panel permissions-state permissions-state-empty"><span className="permissions-state-icon"><AmenityIcon name="sparkle" size={20} /></span><h2>No amenity groups found</h2><p>Create the first group to start organizing hotel services.</p><button className="primary-button" type="button" onClick={() => setGroupForm({ ...emptyGroup })}><AmenityIcon name="plus" size={16} /> Create group</button></div> : <div className="permissions-layout amenities-permissions-layout">
      <section className="panel role-list-panel">
        <div className="permissions-panel-heading"><div><p className="eyebrow">Service catalog</p><h2>Amenity groups <span>{groups.length}</span></h2></div><button className="role-create-icon-button" type="button" onClick={() => setGroupForm({ ...emptyGroup })} aria-label="Create amenity group" title="Create amenity group"><AmenityIcon name="plus" size={17} /></button></div>
        <label className="permissions-search"><AmenityIcon name="search" size={16} /><input value={groupSearch} onChange={(event) => setGroupSearch(event.target.value)} placeholder="Search groups" aria-label="Search amenity groups" /></label>
        <div className="role-list">
          {visibleGroups.map((group) => {
            const count = amenities.filter((amenity) => amenity.groupId === group.id).length;
            return <div className={`role-list-item ${selectedGroupId === group.id ? 'is-selected' : ''} ${group.active === false ? 'amenity-group-list-item-is-disabled' : ''}`} key={group.id}>
              <button className="role-list-select" type="button" onClick={() => setSelectedGroupId(group.id)}><span className="role-avatar gold"><AmenityIcon name="sparkle" size={17} /></span><span className="role-list-copy"><strong>{group.name}</strong><small>{group.description || 'No description provided.'}</small></span><span className="role-list-count">{count}<small> services</small></span></button>
              <span className="role-list-actions"><button className="role-card-action" type="button" onClick={() => editGroup(group)} aria-label={`Edit ${group.name}`} title={`Edit ${group.name}`}><AmenityIcon name="edit" size={14} /></button><button className="role-card-action" type="button" onClick={() => toggleGroup(group)} aria-label={`${group.active === false ? 'Activate' : 'Deactivate'} ${group.name}`} title={`${group.active === false ? 'Activate' : 'Deactivate'} ${group.name}`}><AmenityIcon name={group.active === false ? 'play' : 'pause'} size={14} /></button><button className="role-card-action is-danger" type="button" onClick={() => removeGroup(group)} aria-label={`Delete ${group.name}`} title={`Delete ${group.name}`}><AmenityIcon name="trash" size={14} /></button></span>
            </div>;
          })}
          {!visibleGroups.length && <p className="permissions-empty-copy">No groups match your search.</p>}
        </div>
      </section>

      {selectedGroup && <section className="panel permission-matrix-panel">
        <div className="permission-matrix-header"><div className="permission-role-heading"><span className="role-avatar gold"><AmenityIcon name="sparkle" size={19} /></span><div><p className="eyebrow">Managing amenity group</p><h2>{selectedGroup.name}</h2><p>{selectedGroup.description || 'Services available to hotel guests.'}</p></div></div><div className="permission-role-summary"><strong>{selectedGroupAmenities.length}</strong><small>amenities in group</small></div></div>
        <div className="permission-toolbar"><label className="permissions-search"><AmenityIcon name="search" size={16} /><input value={amenitySearch} onChange={(event) => setAmenitySearch(event.target.value)} placeholder="Search amenities" aria-label="Search amenities" /></label><button className="secondary-button" type="button" onClick={() => setAmenityForm({ ...emptyAmenity, groupId: selectedGroup.id })}><AmenityIcon name="plus" size={16} /> Add amenity</button></div>
        <div className="permission-groups"><section className="permission-group"><div className="permission-group-heading amenities-group-heading"><div><span className="permission-group-icon"><AmenityIcon name="sparkle" size={16} /></span><div><h3>{selectedGroup.name} services</h3><p>{selectedGroupAmenities.length} amenities · {selectedGroup.active === false ? 'Group inactive' : 'Group active'}</p></div></div><span className={`pill ${selectedGroup.active === false ? 'suspended' : 'active'}`}>{selectedGroup.active === false ? 'Inactive' : 'Active'}</span></div><div className="permission-rows">
          {visibleAmenities.map((amenity) => {
            const isActive = amenity.status === 'ACTIVE';
            return <div className={`permission-row amenity-permission-row ${isActive ? 'is-enabled' : ''}`} key={amenity.id}><div className="amenity-permission-copy"><span className="amenity-icon">{amenity.icon || '✦'}</span><div className="permission-row-copy"><strong>{amenity.name}</strong><p>{amenity.description || 'No description provided.'}</p><code>{statusLabels[amenity.status] || amenity.status}</code></div></div><div className="amenity-permission-actions"><span className={`pill ${amenity.status.toLowerCase()}`}>{statusLabels[amenity.status] || amenity.status}</span><button className={`permission-switch ${isActive ? 'is-on' : ''}`} type="button" role="switch" aria-checked={isActive} aria-label={`${isActive ? 'Disable' : 'Enable'} ${amenity.name}`} onClick={() => toggleAmenity(amenity)} disabled={updatingAmenityId === amenity.id}><span /></button><button className="role-card-action" type="button" onClick={() => editAmenity(amenity)} aria-label={`Edit ${amenity.name}`} title={`Edit ${amenity.name}`}><AmenityIcon name="edit" size={14} /></button><button className="role-card-action is-danger" type="button" onClick={() => removeAmenity(amenity)} aria-label={`Delete ${amenity.name}`} title={`Delete ${amenity.name}`}><AmenityIcon name="trash" size={14} /></button></div></div>;
          })}
          {!visibleAmenities.length && <div className="permission-empty-state"><span><AmenityIcon name="search" size={21} /></span><h3>No amenities found</h3><p>{selectedGroupAmenities.length ? 'Try searching for a different amenity.' : 'Add the first amenity to this group.'}</p></div>}
        </div></section></div>
      </section>}
    </div>}

    {groupForm && <GroupModal value={groupForm} onChange={setGroupForm} onClose={() => setGroupForm(null)} onSubmit={saveGroup} />}
    {amenityForm && <AmenityModal value={amenityForm} groups={groups} onChange={setAmenityForm} onClose={() => setAmenityForm(null)} onSubmit={saveAmenity} />}
  </>;
}

function GroupModal({ value, onChange, onClose, onSubmit }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="account-modal" role="dialog" aria-modal="true" aria-labelledby="amenity-group-modal-title"><div className="modal-heading"><div><p className="eyebrow">Amenities</p><h2 id="amenity-group-modal-title">{value.id ? 'Edit amenity group' : 'Create amenity group'}</h2><p>Organize guest services into a clear catalog group.</p></div><button className="close-button" type="button" onClick={onClose} aria-label="Close"><AmenityIcon name="close" /></button></div><form className="account-form" onSubmit={onSubmit}><label>Group name<input value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} placeholder="Wellness" maxLength="120" required /></label><label>Description<textarea value={value.description || ''} onChange={(event) => onChange({ ...value, description: event.target.value })} placeholder="Services related to wellness and relaxation." maxLength="500" /></label><label className="checkbox-field"><input type="checkbox" checked={value.active} onChange={(event) => onChange({ ...value, active: event.target.checked })} /> Active group</label><div className="form-actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">{value.id ? 'Save group' : 'Create group'}</button></div></form></div></div>;
}

function AmenityModal({ value, groups, onChange, onClose, onSubmit }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="account-modal" role="dialog" aria-modal="true" aria-labelledby="amenity-modal-title"><div className="modal-heading"><div><p className="eyebrow">Amenities</p><h2 id="amenity-modal-title">{value.id ? 'Edit amenity' : 'Create amenity'}</h2><p>Add a service and place it in the right amenity group.</p></div><button className="close-button" type="button" onClick={onClose} aria-label="Close"><AmenityIcon name="close" /></button></div><form className="account-form" onSubmit={onSubmit}><label>Amenity name<input value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} placeholder="Airport transfer" maxLength="120" required /></label><div className="form-row"><label>Group<select value={value.groupId} onChange={(event) => onChange({ ...value, groupId: event.target.value })} required><option value="" disabled>Select group</option>{groups.map((group) => <option value={group.id} key={group.id}>{group.name}</option>)}</select></label><label>Status<select value={value.status} onChange={(event) => onChange({ ...value, status: event.target.value })}><option value="ACTIVE">Active</option><option value="MAINTENANCE">Maintenance</option><option value="INACTIVE">Inactive</option></select></label></div><label>Icon or symbol<input value={value.icon || ''} onChange={(event) => onChange({ ...value, icon: event.target.value })} placeholder="✦, wifi, pool" maxLength="80" /></label><label>Description<textarea value={value.description || ''} onChange={(event) => onChange({ ...value, description: event.target.value })} placeholder="Short description for staff and guest operations." maxLength="500" /></label><div className="form-actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">{value.id ? 'Save amenity' : 'Create amenity'}</button></div></form></div></div>;
}
