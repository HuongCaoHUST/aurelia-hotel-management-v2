import { useEffect, useState } from 'react';
import { roomTypeApi } from '../../app/api.js';

const emptyRoomType = {
  name: '',
  description: '',
  basePrice: '',
  maxOccupancy: 2,
  sizeInSquareMeters: '',
  bedType: '',
};

export function RoomTypes({ onNotice }) {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);

  async function loadRoomTypes() {
    setLoading(true);
    try {
      setRoomTypes(await roomTypeApi.list());
    } catch (error) {
      onNotice(error.message || 'Could not load room types.', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRoomTypes();
  }, []);

  async function createRoomType(event) {
    event.preventDefault();
    try {
      const saved = await roomTypeApi.create({
        name: form.name,
        description: form.description,
        basePrice: Number(form.basePrice),
        maxOccupancy: Number(form.maxOccupancy),
        sizeInSquareMeters: form.sizeInSquareMeters ? Number(form.sizeInSquareMeters) : null,
        bedType: form.bedType,
      });
      setRoomTypes((current) => [...current, saved].sort((first, second) => first.name.localeCompare(second.name)));
      setForm(null);
      onNotice('Room type added.');
    } catch (error) {
      onNotice(error.message || 'Could not add room type.', 'error');
    }
  }

  return <>
    <div className="page-heading room-types-heading">
      <div>
        <p className="eyebrow">Hotel operations <span className="heading-dot" /> Room inventory</p>
        <h1>Room type management</h1>
        <p>View room types and the number of rooms assigned to each type.</p>
      </div>
      <button className="primary-button" type="button" onClick={() => setForm({ ...emptyRoomType })}>+ Add room type</button>
    </div>

    <section className="panel room-types-panel">
      <div className="panel-heading"><div><p className="eyebrow">Inventory</p><h2>Room types</h2></div><span className="room-type-count">{roomTypes.length} types</span></div>
      {loading ? <p className="room-type-empty">Loading room types…</p> : roomTypes.length ? <div className="room-type-table">
        <div className="room-type-row room-type-head"><span>Room type</span><span>Base price</span><span>Occupancy</span><span>Area</span><span>Rooms</span></div>
        {roomTypes.map((roomType) => <div className="room-type-row" key={roomType.id}>
          <span><strong>{roomType.name}</strong><small>{roomType.bedType || 'Not updated'}{roomType.description ? ` · ${roomType.description}` : ''}</small></span>
          <span>{formatCurrency(roomType.basePrice)}</span>
          <span>{roomType.maxOccupancy} guests</span>
          <span>{roomType.sizeInSquareMeters ? `${roomType.sizeInSquareMeters} m²` : '—'}</span>
          <strong className="room-count-value">{roomType.roomCount}</strong>
        </div>)}
      </div> : <div className="room-type-empty"><span>⌂</span><h3>No room types yet</h3><p>Add your first room type to start managing inventory.</p></div>}
    </section>

    {form && <RoomTypeModal value={form} onChange={setForm} onClose={() => setForm(null)} onSubmit={createRoomType} />}
  </>;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value || 0);
}

function RoomTypeModal({ value, onChange, onClose, onSubmit }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="account-modal" role="dialog" aria-modal="true" aria-labelledby="room-type-modal-title">
      <div className="modal-heading"><div><p className="eyebrow">Room inventory</p><h2 id="room-type-modal-title">Add room type</h2><p>Enter the basic information for this room type.</p></div><button className="close-button" type="button" onClick={onClose} aria-label="Close">×</button></div>
      <form className="account-form" onSubmit={onSubmit}>
        <label>Room type name<input value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} placeholder="Deluxe room" maxLength="120" required /></label>
        <label>Description<textarea value={value.description} onChange={(event) => onChange({ ...value, description: event.target.value })} placeholder="Short room type description" maxLength="1500" /></label>
        <div className="form-row"><label>Base price<input type="number" value={value.basePrice} onChange={(event) => onChange({ ...value, basePrice: event.target.value })} min="0" step="1000" placeholder="1200000" required /></label><label>Max occupancy<input type="number" value={value.maxOccupancy} onChange={(event) => onChange({ ...value, maxOccupancy: event.target.value })} min="1" step="1" required /></label></div>
        <div className="form-row"><label>Area (m²)<input type="number" value={value.sizeInSquareMeters} onChange={(event) => onChange({ ...value, sizeInSquareMeters: event.target.value })} min="1" step="1" placeholder="32" /></label><label>Bed type<input value={value.bedType} onChange={(event) => onChange({ ...value, bedType: event.target.value })} maxLength="80" placeholder="King bed" /></label></div>
        <div className="form-actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Save room type</button></div>
      </form>
    </div>
  </div>;
}
