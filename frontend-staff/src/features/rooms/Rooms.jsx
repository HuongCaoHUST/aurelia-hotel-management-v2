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
  const [selectedRoom, setSelectedRoom] = useState(null);

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

  useEffect(() => {
    if (!isFormOpen && !selectedRoom) return undefined;
    function handleKeyDown(event) {
      if (event.key !== 'Escape') return;
      if (selectedRoom) setSelectedRoom(null);
      else setFormOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFormOpen, selectedRoom]);

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
        <h1>Room management</h1>
      </div>
      <button className="primary-button" type="button" onClick={() => setFormOpen(true)}><svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg> Add room</button>
    </div>

    {loading ? <p className="rooms-empty">Loading rooms…</p> : groups.length ? <div className="room-groups">
      {groups.map((group) => <section className="room-group" key={group.id}>
        <div className="room-group-heading"><div><p className="eyebrow">Room type</p><h2>{group.name}</h2></div><span>{group.rooms.length} rooms</span></div>
        {group.rooms.length ? <div className="room-card-grid">{group.rooms.map((room) => <RoomCard key={room.id} room={room} onOpen={() => setSelectedRoom(room)} />)}</div> : <p className="room-group-empty">No rooms in this type yet.</p>}
      </section>)}
    </div> : <section className="panel rooms-empty"><span>⌂</span><h2>No rooms yet</h2><p>Create a room type first, then add rooms to your inventory.</p></section>}

    {isFormOpen && <RoomModal roomTypes={roomTypes} onClose={() => setFormOpen(false)} onSubmit={createRoom} />}
    {selectedRoom && <RoomDetailsModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />}
  </>;
}

function RoomCard({ room, onOpen }) {
  const photoCount = room.photos?.length || 0;
  return <article className="room-card" role="button" tabIndex="0" aria-label={`View room ${room.roomNumber}`} onClick={onOpen} onKeyDown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen();
    }
  }}>
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

function RoomImage({ room, photo, className = 'room-card-image', loadingClassName = 'room-card-image-loading' }) {
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

  return source ? <img className={className} src={source} alt={`${room.roomNumber} - ${photo.originalFilename || 'room image'}`} /> : <div className={loadingClassName} />;
}

function RoomDetailsModal({ room, onClose }) {
  const photoCount = room.photos?.length || 0;
  const [activeIndex, setActiveIndex] = useState(0);
  const activePhoto = room.photos?.[activeIndex];
  const thumbnailStart = Math.min(Math.max(activeIndex - 2, 0), Math.max(photoCount - 5, 0));
  const thumbnails = room.photos?.slice(thumbnailStart, thumbnailStart + 5) || [];

  function movePhoto(step) {
    setActiveIndex((current) => (current + step + photoCount) % photoCount);
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="room-details-modal" role="dialog" aria-modal="true" aria-labelledby="room-details-title">
      <div className="modal-heading"><div><p className="eyebrow">Room details</p><h2 id="room-details-title">Room {room.roomNumber}</h2><p>{room.roomTypeName}</p></div><button className="close-button" type="button" onClick={onClose} aria-label="Close"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m6 6 12 12M18 6 6 18" /></svg></button></div>
      <div className="room-details-content">
        <div className="room-details-album">
          <div className="room-details-main">
            {activePhoto ? <RoomImage key={activePhoto.id} room={room} photo={activePhoto} className="room-details-main-image" loadingClassName="room-details-main-loading" /> : <div className="room-details-no-image"><span>⌂</span><p>No room images</p></div>}
            {photoCount > 1 && <><button className="room-details-nav room-details-nav-prev" type="button" onClick={() => movePhoto(-1)} aria-label="Previous image">‹</button><button className="room-details-nav room-details-nav-next" type="button" onClick={() => movePhoto(1)} aria-label="Next image">›</button></>}
          </div>
          {photoCount > 1 && <div className="room-details-thumbnails" aria-label="Room image gallery">{thumbnails.map((photo, index) => {
            const actualIndex = thumbnailStart + index;
            return <button className={`room-details-thumbnail ${actualIndex === activeIndex ? 'is-active' : ''}`} type="button" key={photo.id} onClick={() => setActiveIndex(actualIndex)} aria-label={`View image ${actualIndex + 1}`}><RoomImage room={room} photo={photo} className="room-details-thumbnail-image" loadingClassName="room-details-thumbnail-loading" /></button>;
          })}</div>}
          {photoCount > 5 && <p className="room-details-photo-count">Showing image {activeIndex + 1} of {photoCount}</p>}
        </div>
        <div className="room-details-info">
          <div className="room-details-status"><span className={`room-status room-status-${room.status.toLowerCase()}`}>{statusLabels[room.status] || room.status}</span><span>{photoCount} photos</span></div>
          <dl className="room-details-list"><div><dt>Room number</dt><dd>{room.roomNumber}</dd></div><div><dt>Room type</dt><dd>{room.roomTypeName}</dd></div><div><dt>Floor</dt><dd>{room.floor}</dd></div><div><dt>Status</dt><dd>{statusLabels[room.status] || room.status}</dd></div></dl>
          {room.notes && <div className="room-details-notes"><span>Notes</span><p>{room.notes}</p></div>}
        </div>
      </div>
    </div>
  </div>;
}

function RoomModal({ roomTypes, onClose, onSubmit }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="account-modal" role="dialog" aria-modal="true" aria-labelledby="room-modal-title">
      <div className="modal-heading"><div><p className="eyebrow">Room inventory</p><h2 id="room-modal-title">Add room</h2><p>Add a room number, room type and room images.</p></div><button className="close-button" type="button" onClick={onClose} aria-label="Close"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m6 6 12 12M18 6 6 18" /></svg></button></div>
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
