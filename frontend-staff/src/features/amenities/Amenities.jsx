import { useEffect, useState } from 'react';
import { amenityApi } from '../../app/api.js';

const emptyGroup = { name: '', description: '', active: true };
const emptyAmenity = { name: '', icon: '', description: '', status: 'ACTIVE', groupId: '' };

export function Amenities({ onNotice }) {
  const [groups, setGroups] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [groupForm, setGroupForm] = useState(null);
  const [amenityForm, setAmenityForm] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [groupData, amenityData] = await Promise.all([amenityApi.groups(), amenityApi.list()]);
      setGroups(groupData);
      setAmenities(amenityData);
    } catch (error) {
      onNotice(error.message || 'Unable to load amenities.', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function saveGroup(event) {
    event.preventDefault();
    try {
      const saved = groupForm.id
        ? await amenityApi.updateGroup(groupForm.id, groupForm)
        : await amenityApi.createGroup(groupForm);
      setGroups((current) => groupForm.id ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
      setGroupForm(null);
      onNotice('Amenity group saved.');
    } catch (error) { onNotice(error.message || 'Unable to save amenity group.', 'error'); }
  }

  async function saveAmenity(event) {
    event.preventDefault();
    try {
      const payload = { ...amenityForm, groupId: amenityForm.groupId };
      const saved = amenityForm.id ? await amenityApi.update(amenityForm.id, payload) : await amenityApi.create(payload);
      setAmenities((current) => amenityForm.id ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
      setAmenityForm(null);
      onNotice('Amenity saved.');
    } catch (error) { onNotice(error.message || 'Unable to save amenity.', 'error'); }
  }

  async function toggleGroup(group) {
    try {
      const saved = await amenityApi.updateGroup(group.id, { name: group.name, description: group.description || '', active: !group.active });
      setGroups((current) => current.map((item) => item.id === saved.id ? saved : item));
      onNotice(`Group ${saved.active ? 'activated' : 'deactivated'}.`);
    } catch (error) { onNotice(error.message || 'Unable to update group status.', 'error'); }
  }

  async function removeGroup(group) {
    if (!window.confirm(`Delete the ${group.name} group?`)) return;
    try { await amenityApi.deleteGroup(group.id); setGroups((current) => current.filter((item) => item.id !== group.id)); onNotice('Amenity group deleted.'); }
    catch (error) { onNotice(error.message || 'Unable to delete group.', 'error'); }
  }

  async function removeAmenity(amenity) {
    if (!window.confirm(`Delete ${amenity.name}?`)) return;
    try { await amenityApi.delete(amenity.id); setAmenities((current) => current.filter((item) => item.id !== amenity.id)); onNotice('Amenity deleted.'); }
    catch (error) { onNotice(error.message || 'Unable to delete amenity.', 'error'); }
  }

  return <>
    <div className="page-heading amenities-heading"><div><p className="eyebrow">Hotel operations <span className="heading-dot" /> {groups.length} groups</p><h1>Amenities</h1><p>Manage hotel facilities, amenity groups, and service availability.</p></div><button className="primary-button" type="button" onClick={() => setAmenityForm({ ...emptyAmenity, groupId: groups[0]?.id || '' })}>+ Add amenity</button></div>
    <div className="amenity-layout">
      <section className="panel amenity-groups-panel"><div className="panel-heading"><div><p className="eyebrow">Organization</p><h2>Amenity groups</h2></div><button className="secondary-button" type="button" onClick={() => setGroupForm({ ...emptyGroup })}>+ New group</button></div>{loading ? <p className="amenity-empty">Loading amenities…</p> : groups.length ? groups.map((group) => <article className={`amenity-group-card ${group.active ? '' : 'is-disabled'}`} key={group.id}><div><strong>{group.name}</strong><small>{group.description || 'No description'} · {amenities.filter((item) => item.groupId === group.id).length} amenities</small></div><span className={`pill ${group.active ? 'active' : 'suspended'}`}>{group.active ? 'Active' : 'Inactive'}</span><div className="amenity-card-actions"><button type="button" className="row-action" onClick={() => setGroupForm(group)}>Edit</button><button type="button" className="row-action" onClick={() => toggleGroup(group)}>{group.active ? 'Deactivate' : 'Activate'}</button><button type="button" className="row-action row-action-muted" onClick={() => removeGroup(group)}>Delete</button></div></article>) : <p className="amenity-empty">No amenity groups yet.</p>}</section>
      <section className="panel amenities-list-panel"><div className="panel-heading"><div><p className="eyebrow">Service catalog</p><h2>All amenities</h2></div><span className="amenity-count">{amenities.length} services</span></div>{amenities.length ? <div className="amenity-table">{amenities.map((amenity) => <article className="amenity-row" key={amenity.id}><span className="amenity-icon">{amenity.icon || '✦'}</span><div><strong>{amenity.name}</strong><small>{amenity.groupName} · {amenity.description || 'No description'}</small></div><span className={`pill ${amenity.status.toLowerCase()}`}>{amenity.status === 'MAINTENANCE' ? 'Maintenance' : amenity.status === 'INACTIVE' ? 'Inactive' : 'Active'}</span><div className="amenity-card-actions"><button type="button" className="row-action" onClick={() => setAmenityForm(amenity)}>Edit</button><button type="button" className="row-action row-action-muted" onClick={() => removeAmenity(amenity)}>Delete</button></div></article>)}</div> : <p className="amenity-empty">No amenities yet. Add the first service to your catalog.</p>}</section>
    </div>
    {groupForm && <GroupModal value={groupForm} onChange={setGroupForm} onClose={() => setGroupForm(null)} onSubmit={saveGroup} />}
    {amenityForm && <AmenityModal value={amenityForm} groups={groups} onChange={setAmenityForm} onClose={() => setAmenityForm(null)} onSubmit={saveAmenity} />}
  </>;
}

function GroupModal({ value, onChange, onClose, onSubmit }) {
  return <div className="modal-backdrop" role="presentation"><div className="account-modal" role="dialog" aria-modal="true"><div className="modal-heading"><div><p className="eyebrow">Amenities</p><h2>{value.id ? 'Edit amenity group' : 'New amenity group'}</h2></div><button className="close-button" type="button" onClick={onClose}>×</button></div><form className="account-form" onSubmit={onSubmit}><label>Group name<input value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} required /></label><label>Description<textarea value={value.description || ''} onChange={(event) => onChange({ ...value, description: event.target.value })} /></label><label className="checkbox-field"><input type="checkbox" checked={value.active} onChange={(event) => onChange({ ...value, active: event.target.checked })} /> Active group</label><div className="form-actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Save group</button></div></form></div></div>;
}

function AmenityModal({ value, groups, onChange, onClose, onSubmit }) {
  return <div className="modal-backdrop" role="presentation"><div className="account-modal" role="dialog" aria-modal="true"><div className="modal-heading"><div><p className="eyebrow">Amenities</p><h2>{value.id ? 'Edit amenity' : 'New amenity'}</h2></div><button className="close-button" type="button" onClick={onClose}>×</button></div><form className="account-form" onSubmit={onSubmit}><label>Amenity name<input value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} required /></label><div className="form-row"><label>Group<select value={value.groupId} onChange={(event) => onChange({ ...value, groupId: event.target.value })} required><option value="">Select group</option>{groups.map((group) => <option value={group.id} key={group.id}>{group.name}</option>)}</select></label><label>Status<select value={value.status} onChange={(event) => onChange({ ...value, status: event.target.value })}><option value="ACTIVE">Active</option><option value="MAINTENANCE">Maintenance</option><option value="INACTIVE">Inactive</option></select></label></div><label>Icon or symbol<input value={value.icon || ''} onChange={(event) => onChange({ ...value, icon: event.target.value })} placeholder="wifi, pool, ✦" /></label><label>Description<textarea value={value.description || ''} onChange={(event) => onChange({ ...value, description: event.target.value })} /></label><div className="form-actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Save amenity</button></div></form></div></div>;
}
