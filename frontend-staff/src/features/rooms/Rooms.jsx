import { useEffect, useMemo, useState } from 'react';
import { roomApi, roomTypeApi } from '../../app/api.js';

const statusLabels = {
  AVAILABLE: 'Available',
  OCCUPIED: 'Occupied',
  RESERVED: 'Reserved',
  CLEANING: 'Cleaning',
  MAINTENANCE: 'Maintenance',
  OUT_OF_SERVICE: 'Out of service',
};

export function Rooms({ onNotice }) {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setFormOpen] = useState(false);

  async function loadRooms() {
    setLoading(true);
    try {
      const [roomData, roomTypeData] = await Promise.all([roomApi.list(), roomTypeApi.list()]);
      setRooms(roomData);
      setRoomTypes(roomTypeData);
    } catch (error) {
      onNotice(error.message || 'Could not load rooms.', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  const groups = useMemo(() => {
    const grouped = roomTypes.map((roomType) => ({
      id: roomType.id,
      name: roomType.name,
      rooms: rooms.filter((room) => room.roomTypeId === roomType.id),
    }));
    const unlinkedRooms = rooms.filter((room) => !roomTypes.some((roomType) => roomType.id === room.roomTypeId));
    if (unlinkedRooms.length) grouped.push({ id: 'unlinked', name: 'Other rooms', rooms: unlinkedRooms });
    return grouped;
  }, [roomTypes, rooms]);

  async function createRoom(event) {
    event.preventDefault();
    try {
      const saved = await roomApi.create(new FormData(event.currentTarget));
      setRooms((current) => [...current, saved].sort((first, second) => (
        first.roomTypeName.localeCompare(second.roomTypeName) || first.roomNumber.localeCompare(second.roomNumber)
      )));
      setFormOpen(false);
      onNotice('Room added.');
    } catch (error) {
      onNotice(error.message || 'Could not add room.', 'error');
    }
  }

  return <>
    <div className="page-heading rooms-heading">
      <div>
        <p className="eyebrow">Hotel operations <span className="heading-dot" /> Room inventory</p>
        <h1>Room management</h1>
        <p>Manage rooms by number, room type and operational status.</p>
      </div>
      <button className="primary-button" type="button" onClick={() => setFormOpen(true)}>+ Add room</button>
    </div>

    {loading ? <p className="rooms-empty">Loading rooms…</p> : groups.length ? <div className="room-groups">
      {groups.map((group) => <section className="room-group" key={group.id}>
        <div className="room-group-heading"><div><p className="eyebrow">Room type</p><h2>{group.name}</h2></div><span>{group.rooms.length} rooms</span></div>
        {group.rooms.length ? <div className="room-card-grid">{group.rooms.map((room) => <RoomCard key={room.id} room={room} />)}</div> : <p className="room-group-empty">No rooms in this type yet.</p>}
      </section>)}
    </div> : <section className="panel rooms-empty"><span>⌂</span><h2>No rooms yet</h2><p>Create a room type first, then add rooms to your inventory.</p></section>}

    {isFormOpen && <RoomModal roomTypes={roomTypes} onClose={() => setFormOpen(false)} onSubmit={createRoom} />}
  </>;
}

function RoomCard({ room }) {
  const photoCount = room.photos?.length || 0;
  return <article className="room-card">
    <div className={`room-card-gallery room-card-gallery-${Math.min(photoCount, 3)}`}>
      {photoCount ? room.photos.map((photo) => <RoomImage key={photo.id} room={room} photo={photo} />) : <div className="room-card-no-image"><span>⌂</span><small>No image</small></div>}
    </div>
    <div className="room-card-body">
      <div className="room-card-top"><div><p className="eyebrow">Room</p><h3>{room.roomNumber}</h3></div><span className={`room-status room-status-${room.status.toLowerCase()}`}>{statusLabels[room.status] || room.status}</span></div>
      <div className="room-card-meta"><span>Floor {room.floor}</span><span>{room.photos?.length || 0} photos</span></div>
      {room.notes && <p className="room-card-notes">{room.notes}</p>}
    </div>
  </article>;
}

function RoomImage({ room, photo }) {
  const [source, setSource] = useState(null);

  useEffect(() => {
    let active = true;
    let objectUrl;
    roomApi.image(room.id, photo.id)
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        if (active) setSource(objectUrl);
      })
      .catch(() => setSource(null));
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [room.id, photo.id]);

  return source ? <img className="room-card-image" src={source} alt={`${room.roomNumber} - ${photo.originalFilename || 'room image'}`} /> : <div className="room-card-image-loading" />;
}

function RoomModal({ roomTypes, onClose, onSubmit }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="account-modal" role="dialog" aria-modal="true" aria-labelledby="room-modal-title">
      <div className="modal-heading"><div><p className="eyebrow">Room inventory</p><h2 id="room-modal-title">Add room</h2><p>Add a room number, room type and room images.</p></div><button className="close-button" type="button" onClick={onClose} aria-label="Close">×</button></div>
      {!roomTypes.length ? <div className="room-modal-empty"><p>Create a room type before adding a room.</p><button className="secondary-button" type="button" onClick={onClose}>Close</button></div> : <form className="account-form" onSubmit={onSubmit}>
        <div className="form-row"><label>Room number<input name="roomNumber" placeholder="101" maxLength="20" required /></label><label>Floor<input name="floor" type="number" min="0" step="1" placeholder="1" required /></label></div>
        <label>Room type<select name="roomTypeId" defaultValue="" required><option value="" disabled>Select room type</option>{roomTypes.map((roomType) => <option value={roomType.id} key={roomType.id}>{roomType.name}</option>)}</select></label>
        <label>Status<select name="status" defaultValue="AVAILABLE"><option value="AVAILABLE">Available</option><option value="CLEANING">Cleaning</option><option value="MAINTENANCE">Maintenance</option><option value="OUT_OF_SERVICE">Out of service</option></select></label>
        <label>Room images <span className="field-hint">Up to 10 images, 5 MB each</span><input name="images" type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple /></label>
        <label>Notes<textarea name="notes" placeholder="Optional room notes" maxLength="500" /></label>
        <div className="form-actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Save room</button></div>
      </form>}
    </div>
  </div>;
}
