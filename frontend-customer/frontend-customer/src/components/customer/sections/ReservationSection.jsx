import { useMemo, useState } from "react";
import { createReservation } from "../../../lib/api.js";

const ROOMS = [
  { name: "Standard Room", price: 119, guests: 2 },
  { name: "Deluxe Room", price: 129, guests: 2 },
  { name: "Premier Room", price: 139, guests: 2 },
  { name: "Family Suite", price: 149, guests: 4 },
  { name: "Luxury Suite", price: 179, guests: 2 },
  { name: "Presidential Suite", price: 199, guests: 2 },
];

function getLocalDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function createInitialForm() {
  return {
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    roomCount: 1,
    roomType: ROOMS[0].name,
    name: "",
    email: "",
    phone: "",
    message: "",
  };
}

export default function ReservationSection() {
  const [form, setForm] = useState(createInitialForm);
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedRoom = ROOMS.find((room) => room.name === form.roomType) || ROOMS[0];

  const estimatedTotal = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return null;
    const nights = (Date.parse(`${form.checkOut}T00:00:00`) - Date.parse(`${form.checkIn}T00:00:00`)) / 86_400_000;
    if (!Number.isInteger(nights) || nights < 1) return null;
    return nights * selectedRoom.price * Number(form.roomCount || 1);
  }, [form.checkIn, form.checkOut, form.roomCount, selectedRoom.price]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const saved = await createReservation({
        ...form,
        adults: Number(form.adults),
        children: Number(form.children),
        roomCount: Number(form.roomCount),
      });
      setReservation(saved);
    } catch (submitError) {
      setError(submitError.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startAnotherReservation() {
    setReservation(null);
    setError("");
    setForm(createInitialForm());
  }

  return (
    <section id="section_form" className="relative">
      <div className="container">
        <div className="row g-4">
          <div id="booking_form_title" className="col-lg-8 offset-lg-2 text-center">
            <div className="subtitle id-color wow fadeInUp mb-3">Make a</div>
            <h2 className="wow fadeInUp">Reservation</h2>
            <p>Reserve your stay at Aurelia Hotel. Your booking details will be saved securely on the booking server.</p>
          </div>

          <div className="col-lg-6 offset-lg-3">
            {reservation ? (
              <div id="success_message" className="text-center" role="status">
                <h2>Your reservation has been saved.</h2>
                <p>Keep this booking code for your records.</p>
                <div className="p-4 mb-4 rounded" style={{ background: "#f4f1eb" }}>
                  <h3 className="mb-2">{reservation.bookingCode}</h3>
                  <p className="mb-1"><strong>{reservation.roomType}</strong> · {reservation.nights} night(s) · {reservation.roomCount} room(s)</p>
                  <p className="mb-1">{reservation.checkIn} – {reservation.checkOut}</p>
                  <p className="mb-0"><strong>Total: ${reservation.totalPrice.toLocaleString("en-US")} USD</strong></p>
                </div>
                <button type="button" className="btn-main" onClick={startAnotherReservation}>Make another reservation</button>
              </div>
            ) : (
              <div id="booking_form" className="wow fadeInUp">
                <form name="contactForm" id="contact_form" className="form-border" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-12">
                      <h4>Choose Dates</h4>
                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <label className="form-label" htmlFor="checkIn">Check-in</label>
                          <input id="checkIn" type="date" className="form-control" name="checkIn" value={form.checkIn} min={getLocalDate()} onChange={updateField} required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label" htmlFor="checkOut">Check-out</label>
                          <input id="checkOut" type="date" className="form-control" name="checkOut" value={form.checkOut} min={form.checkIn || getLocalDate()} onChange={updateField} required />
                        </div>
                      </div>

                      <div className="guests-n-rooms mb-4">
                        <div className="row g-3">
                          {[
                            { label: "Adults", name: "adults", min: 1, max: 20 },
                            { label: "Children", name: "children", min: 0, max: 20 },
                            { label: "Rooms", name: "roomCount", min: 1, max: 10 },
                          ].map((item) => (
                            <div className="col-md-4" key={item.name}>
                              <label className="form-label" htmlFor={item.name}>{item.label}</label>
                              <input id={item.name} type="number" className="form-control" name={item.name} min={item.min} max={item.max} step="1" value={form[item.name]} onChange={updateField} required />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="select-room mb-4">
                    <h4>Select Room</h4>
                    <select name="roomType" className="form-control" value={form.roomType} onChange={updateField}>
                      {ROOMS.map((room) => (
                        <option key={room.name} value={room.name}>
                          {`${room.name} | $${room.price}/night | ${room.guests} Guests`}
                        </option>
                      ))}
                    </select>
                    {estimatedTotal !== null && (
                      <p className="mt-2 mb-0">Estimated total: <strong>${estimatedTotal.toLocaleString("en-US")} USD</strong></p>
                    )}
                  </div>

                  <div id="step-2" className="row g-3">
                    <h4 className="col-12 mb-0">Enter your details</h4>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="reservation-name">Full name</label>
                      <input type="text" name="name" id="reservation-name" className="form-control" placeholder="Your Name" autoComplete="name" minLength={2} maxLength={120} value={form.name} onChange={updateField} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="reservation-email">Email</label>
                      <input type="email" name="email" id="reservation-email" className="form-control" placeholder="Your Email" autoComplete="email" value={form.email} onChange={updateField} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="reservation-phone">Phone</label>
                      <input type="tel" name="phone" id="reservation-phone" className="form-control" placeholder="Your Phone" autoComplete="tel" value={form.phone} onChange={updateField} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="reservation-message">Special requests (optional)</label>
                      <textarea name="message" id="reservation-message" className="form-control" placeholder="Your Message" rows="3" maxLength={2000} value={form.message} onChange={updateField} />
                    </div>
                    {error && <div className="col-12" role="alert"><p className="error mb-0">{error}</p></div>}
                    <div className="col-md-12">
                      <button type="submit" className="btn-main" disabled={isSubmitting}>
                        {isSubmitting ? "Saving reservation..." : "Submit reservation"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
