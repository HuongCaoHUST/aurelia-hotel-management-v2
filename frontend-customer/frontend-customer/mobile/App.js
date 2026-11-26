import React, { useMemo, useRef, useState } from 'react';
import { requestReservation } from './shared/bookingApi';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.15:4000').replace(/\/$/, '');

const ROOMS = [
  { name: 'Standard Room', price: 119, guests: 2, image: require('./assets/room-standard.webp'), description: 'A calm and comfortable room for a relaxing stay.' },
  { name: 'Deluxe Room', price: 129, guests: 2, image: require('./assets/room-deluxe.webp'), description: 'Extra space and refined details for your trip.' },
  { name: 'Premier Room', price: 139, guests: 2, image: require('./assets/room-premier.webp'), description: 'A premium room with a thoughtfully designed interior.' },
  { name: 'Family Suite', price: 149, guests: 4, image: require('./assets/room-standard.webp'), description: 'More space for a memorable family holiday.' },
  { name: 'Luxury Suite', price: 179, guests: 2, image: require('./assets/room-deluxe.webp'), description: 'A spacious suite for a special occasion.' },
  { name: 'Presidential Suite', price: 199, guests: 2, image: require('./assets/room-premier.webp'), description: 'Our signature suite for an exceptional stay.' },
];

const INITIAL_FORM = {
  checkIn: '',
  checkOut: '',
  adults: 1,
  children: 0,
  roomCount: 1,
  roomType: ROOMS[0].name,
  name: '',
  email: '',
  phone: '',
  message: '',
};

function Field({ label, value, onChangeText, placeholder, keyboardType = 'default', autoCapitalize = 'none', multiline = false, helperText, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8b918d"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.multilineInput]}
        {...props}
      />
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
    </View>
  );
}

function Counter({ label, value, min, max, onChange }) {
  return (
    <View style={styles.counterWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.counter}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Decrease ${label}`} onPress={() => onChange(Math.max(min, value - 1))} style={styles.counterButton}>
          <Text style={styles.counterButtonText}>−</Text>
        </Pressable>
        <Text style={styles.counterValue}>{value}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`Increase ${label}`} onPress={() => onChange(Math.min(max, value + 1))} style={styles.counterButton}>
          <Text style={styles.counterButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.sectionHeading}>{title}</Text>
      {description ? <Text style={styles.sectionDescription}>{description}</Text> : null}
    </View>
  );
}

function formatMoney(value) {
  return `$${Number(value).toLocaleString('en-US')} USD`;
}

export default function App() {
  const scrollRef = useRef(null);
  const [bookingY, setBookingY] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedRoom = ROOMS.find((room) => room.name === form.roomType) || ROOMS[0];
  const estimatedTotal = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(form.checkOut)) return null;
    const nights = (Date.parse(`${form.checkOut}T00:00:00Z`) - Date.parse(`${form.checkIn}T00:00:00Z`)) / 86400000;
    return nights > 0 ? nights * selectedRoom.price * form.roomCount : null;
  }, [form.checkIn, form.checkOut, form.roomCount, selectedRoom.price]);

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
  }

  async function submitReservation() {
    setError('');
    if (!form.checkIn || !form.checkOut || !form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Please complete your dates, name, email and phone number.');
      return;
    }
    setIsSubmitting(true);
    try {
      const savedReservation = await requestReservation(API_BASE_URL, form);
      setReservation(savedReservation);
    } catch (submitError) {
      setError(`${submitError.message || 'Could not connect to the booking server.'} API: ${API_BASE_URL}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setReservation(null);
    setForm(INITIAL_FORM);
    setError('');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.safeArea} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.navbar}>
              <View>
                <Text style={styles.brand}>AURELIA</Text>
                <Text style={styles.brandSub}>HOTEL · HA LONG</Text>
              </View>
              <Text style={styles.navTag}>A PLACE TO UNWIND</Text>
            </View>

            <ImageBackground source={require('./assets/hero.jpg')} resizeMode="cover" imageStyle={styles.heroImage} style={styles.hero}>
              <View style={styles.heroOverlay} />
              <View style={styles.heroContent}>
                <Text style={styles.heroEyebrow}>WELCOME TO AURELIA HOTEL</Text>
                <Text style={styles.heroTitle}>A slower pace. A finer stay.</Text>
                <Text style={styles.heroDescription}>Find your moment of calm in the heart of Ha Long Bay.</Text>
                <Pressable onPress={() => scrollRef.current?.scrollTo({ y: Math.max(0, bookingY - 12), animated: true })} style={styles.heroButton}>
                  <Text style={styles.heroButtonText}>EXPLORE YOUR STAY</Text>
                </Pressable>
              </View>
            </ImageBackground>

            <View style={styles.intro}>
              <Text style={styles.eyebrow}>YOUR PRIVATE ESCAPE</Text>
              <Text style={styles.introTitle}>Comfort, thoughtfully considered.</Text>
              <Text style={styles.bodyText}>From restful rooms to attentive hospitality, Aurelia is designed to make every part of your stay feel effortless.</Text>
            </View>

            <View style={styles.section}>
              <SectionTitle eyebrow="LUXURY ACCOMMODATION" title="Find your room" description="Choose the room that best suits your stay." />
              <View style={styles.roomGrid}>
                {ROOMS.map((room) => {
                  const active = form.roomType === room.name;
                  return (
                    <Pressable key={room.name} onPress={() => update('roomType', room.name)} style={[styles.roomCard, active && styles.roomCardActive]}>
                      <Image source={room.image} style={styles.roomImage} resizeMode="cover" />
                      <View style={styles.roomCardBody}>
                        <Text style={styles.roomName}>{room.name}</Text>
                        <Text style={styles.roomMeta}>Up to {room.guests} guests</Text>
                        <Text style={styles.roomDescription}>{room.description}</Text>
                        <View style={styles.roomBottom}>
                          <Text style={styles.roomPrice}>{formatMoney(room.price)}<Text style={styles.perNight}> / night</Text></Text>
                          <Text style={[styles.selectText, active && styles.selectTextActive]}>{active ? 'SELECTED ✓' : 'SELECT'}</Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View nativeID="booking" onLayout={(event) => setBookingY(event.nativeEvent.layout.y)} style={styles.bookingSection}>
              <SectionTitle eyebrow="MAKE A RESERVATION" title="Plan your stay" description="Complete the details below. Your reservation is saved to the Aurelia booking database." />
              {reservation ? (
                <View style={styles.successCard}>
                  <Text style={styles.successEyebrow}>RESERVATION SAVED</Text>
                  <Text style={styles.successTitle}>Thank you, {reservation.name}.</Text>
                  <Text style={styles.bodyText}>Your booking details have been stored successfully.</Text>
                  <View style={styles.bookingCodeBox}>
                    <Text style={styles.bookingCodeLabel}>YOUR BOOKING CODE</Text>
                    <Text selectable style={styles.bookingCode}>{reservation.bookingCode}</Text>
                  </View>
                  <Text style={styles.summaryText}>{reservation.roomType} · {reservation.nights} night(s) · {reservation.roomCount} room(s)</Text>
                  <Text style={styles.summaryText}>{reservation.checkIn} to {reservation.checkOut}</Text>
                  <Text style={styles.totalText}>Total: {formatMoney(reservation.totalPrice)}</Text>
                  <Pressable onPress={resetForm} style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>MAKE ANOTHER RESERVATION</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.formCard}>
                  <Text style={styles.formGroupTitle}>1. Dates of stay</Text>
                  <View style={styles.formRow}>
                    <View style={styles.formColumn}>
                      <Field label="CHECK-IN · YYYY-MM-DD" value={form.checkIn} onChangeText={(value) => update('checkIn', value)} placeholder="2026-12-01" autoCapitalize="none" />
                    </View>
                    <View style={styles.formColumn}>
                      <Field label="CHECK-OUT · YYYY-MM-DD" value={form.checkOut} onChangeText={(value) => update('checkOut', value)} placeholder="2026-12-03" autoCapitalize="none" />
                    </View>
                  </View>
                  <Text style={styles.formGroupTitle}>2. Guests and rooms</Text>
                  <View style={styles.formRow}>
                    <View style={styles.formColumn}><Counter label="ADULTS" value={form.adults} min={1} max={20} onChange={(value) => update('adults', value)} /></View>
                    <View style={styles.formColumn}><Counter label="CHILDREN" value={form.children} min={0} max={20} onChange={(value) => update('children', value)} /></View>
                    <View style={styles.formColumn}><Counter label="ROOMS" value={form.roomCount} min={1} max={10} onChange={(value) => update('roomCount', value)} /></View>
                  </View>
                  <Text style={styles.formGroupTitle}>3. Your room</Text>
                  <View style={styles.roomChoiceList}>
                    {ROOMS.map((room) => (
                      <Pressable key={room.name} onPress={() => update('roomType', room.name)} style={[styles.roomChoice, form.roomType === room.name && styles.roomChoiceActive]}>
                        <View style={styles.choiceRadio}>{form.roomType === room.name ? <View style={styles.choiceRadioDot} /> : null}</View>
                        <View style={styles.choiceDetails}>
                          <Text style={styles.choiceName}>{room.name}</Text>
                          <Text style={styles.choiceMeta}>Up to {room.guests} guests</Text>
                        </View>
                        <Text style={styles.choicePrice}>${room.price}<Text style={styles.perNight}> / night</Text></Text>
                      </Pressable>
                    ))}
                  </View>
                  {estimatedTotal !== null ? <Text style={styles.estimate}>Estimated total: {formatMoney(estimatedTotal)}</Text> : null}
                  <Text style={styles.formGroupTitle}>4. Contact details</Text>
                  <Field label="FULL NAME" value={form.name} onChangeText={(value) => update('name', value)} placeholder="Your full name" autoCapitalize="words" />
                  <Field label="EMAIL ADDRESS" value={form.email} onChangeText={(value) => update('email', value)} placeholder="you@example.com" keyboardType="email-address" />
                  <Field label="PHONE NUMBER" value={form.phone} onChangeText={(value) => update('phone', value)} placeholder="Your phone number" keyboardType="phone-pad" />
                  <Field label="SPECIAL REQUESTS (OPTIONAL)" value={form.message} onChangeText={(value) => update('message', value)} placeholder="Let us know if you have any requests..." multiline />
                  {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}
                  <Pressable onPress={submitReservation} disabled={isSubmitting} style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}>
                    {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.primaryButtonText}>CONFIRM RESERVATION</Text>}
                  </Pressable>
                  <Text style={styles.formFootnote}>Your booking is not confirmed until the server returns a booking code.</Text>
                </View>
              )}
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerBrand}>AURELIA</Text>
              <Text style={styles.footerText}>A memorable stay begins with a thoughtful welcome.</Text>
              <Text style={styles.footerText}>Ha Long, Quang Ninh · Vietnam</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f6f2' },
  page: { alignItems: 'center', paddingBottom: 0 },
  content: { width: '100%', maxWidth: 1180, paddingHorizontal: 20 },
  navbar: { minHeight: 78, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { color: '#243e3b', fontSize: 25, letterSpacing: 5, fontWeight: '700' },
  brandSub: { color: '#8a774e', fontSize: 9, letterSpacing: 3, marginTop: 4 },
  navTag: { color: '#68716c', fontSize: 10, letterSpacing: 2 },
  hero: { minHeight: Platform.OS === 'web' ? 410 : 390, justifyContent: 'flex-end', overflow: 'hidden', borderRadius: 4, backgroundColor: '#243e3b' },
  heroImage: { borderRadius: 4 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10, 28, 27, 0.54)' },
  heroContent: { paddingHorizontal: 28, paddingVertical: 40, maxWidth: 700 },
  heroEyebrow: { color: '#dfc28c', fontSize: 10, letterSpacing: 3, fontWeight: '700', marginBottom: 14 },
  heroTitle: { color: '#ffffff', fontSize: Platform.OS === 'web' ? 48 : 36, lineHeight: Platform.OS === 'web' ? 56 : 43, fontWeight: '500', maxWidth: 600 },
  heroDescription: { color: '#f1efea', fontSize: 15, lineHeight: 24, marginTop: 12, maxWidth: 430 },
  heroButton: { alignSelf: 'flex-start', backgroundColor: '#c7a66b', paddingHorizontal: 19, paddingVertical: 14, marginTop: 23, borderRadius: 2 },
  heroButtonText: { color: '#172d2a', fontSize: 10, letterSpacing: 1.5, fontWeight: '800' },
  intro: { maxWidth: 680, alignSelf: 'center', alignItems: 'center', paddingTop: 64, paddingBottom: 38 },
  eyebrow: { color: '#a1844e', fontSize: 10, letterSpacing: 3, fontWeight: '700', textAlign: 'center' },
  introTitle: { color: '#253d39', fontSize: 31, lineHeight: 39, textAlign: 'center', marginTop: 12, fontWeight: '500' },
  bodyText: { color: '#6f7772', fontSize: 14, lineHeight: 23, textAlign: 'center', marginTop: 10 },
  section: { paddingTop: 30, paddingBottom: 50 },
  sectionTitle: { alignItems: 'center', maxWidth: 650, alignSelf: 'center', marginBottom: 26 },
  sectionHeading: { color: '#243e3b', fontSize: 32, lineHeight: 40, textAlign: 'center', marginTop: 10, fontWeight: '500' },
  sectionDescription: { color: '#727b75', fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: 8 },
  roomGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  roomCard: { width: Platform.OS === 'web' ? '31%' : '100%', maxWidth: Platform.OS === 'web' ? 350 : 520, minWidth: Platform.OS === 'web' ? 260 : undefined, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e9e5dc', borderRadius: 4, overflow: 'hidden' },
  roomCardActive: { borderColor: '#ae8d51', borderWidth: 2 },
  roomImage: { width: '100%', height: 180, backgroundColor: '#e2ddd3' },
  roomCardBody: { padding: 17 },
  roomName: { color: '#243e3b', fontSize: 18, fontWeight: '600' },
  roomMeta: { color: '#9a804d', fontSize: 11, marginTop: 5 },
  roomDescription: { color: '#747c77', fontSize: 12, lineHeight: 19, marginTop: 10, minHeight: 38 },
  roomBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, gap: 8 },
  roomPrice: { color: '#243e3b', fontSize: 14, fontWeight: '700' },
  perNight: { color: '#818982', fontSize: 10, fontWeight: '400' },
  selectText: { color: '#8b774f', fontSize: 10, letterSpacing: 1, fontWeight: '700' },
  selectTextActive: { color: '#243e3b' },
  bookingSection: { paddingTop: 45, paddingBottom: 65, width: '100%', maxWidth: 820, alignSelf: 'center' },
  formCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e9e5dc', borderRadius: 5, padding: Platform.OS === 'web' ? 30 : 18 },
  formGroupTitle: { color: '#243e3b', fontSize: 16, fontWeight: '700', marginTop: 17, marginBottom: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eeeae2' },
  formRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  formColumn: { flex: 1, minWidth: 100 },
  field: { marginBottom: 14 },
  label: { color: '#69736e', fontSize: 10, letterSpacing: 1, fontWeight: '700', marginBottom: 7 },
  input: { minHeight: 48, width: '100%', borderWidth: 1, borderColor: '#dedfd9', borderRadius: 3, paddingHorizontal: 13, paddingVertical: 11, fontSize: 14, color: '#253d39', backgroundColor: '#fff' },
  multilineInput: { minHeight: 92 },
  helperText: { color: '#828b85', fontSize: 11, marginTop: 6 },
  counterWrap: { marginBottom: 14 },
  counter: { height: 48, borderWidth: 1, borderColor: '#dedfd9', borderRadius: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  counterButton: { width: 42, height: 46, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f4ef' },
  counterButtonText: { color: '#263e3a', fontSize: 22 },
  counterValue: { color: '#263e3a', fontSize: 15, fontWeight: '700' },
  roomChoiceList: { gap: 8 },
  roomChoice: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#e4e1d9', borderRadius: 3, gap: 10 },
  roomChoiceActive: { borderColor: '#b39359', backgroundColor: '#fbf9f4' },
  choiceRadio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: '#a58a5a', justifyContent: 'center', alignItems: 'center' },
  choiceRadioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#a58a5a' },
  choiceDetails: { flex: 1 },
  choiceName: { color: '#263e3a', fontSize: 13, fontWeight: '700' },
  choiceMeta: { color: '#848b85', fontSize: 11, marginTop: 3 },
  choicePrice: { color: '#263e3a', fontSize: 13, fontWeight: '700' },
  estimate: { color: '#816b43', fontSize: 14, textAlign: 'right', marginTop: 13, marginBottom: 5, fontWeight: '700' },
  primaryButton: { minHeight: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: '#253f3b', paddingVertical: 15, paddingHorizontal: 18, marginTop: 8, borderRadius: 3 },
  primaryButtonText: { color: '#ffffff', fontSize: 11, letterSpacing: 1.4, fontWeight: '800', textAlign: 'center' },
  buttonDisabled: { opacity: 0.65 },
  formFootnote: { color: '#878e89', fontSize: 11, textAlign: 'center', lineHeight: 17, marginTop: 13 },
  errorBox: { padding: 12, borderRadius: 3, backgroundColor: '#fff0ed', borderWidth: 1, borderColor: '#f1c3bb', marginBottom: 8 },
  errorText: { color: '#9b3428', fontSize: 12, lineHeight: 18 },
  successCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dfd7c7', padding: 26, alignItems: 'center', borderRadius: 4 },
  successEyebrow: { color: '#917449', fontSize: 10, letterSpacing: 2, fontWeight: '800' },
  successTitle: { color: '#243e3b', fontSize: 25, fontWeight: '600', textAlign: 'center', marginTop: 10 },
  bookingCodeBox: { marginVertical: 20, padding: 18, backgroundColor: '#f5f2eb', width: '100%', alignItems: 'center', borderRadius: 3 },
  bookingCodeLabel: { color: '#82714e', fontSize: 9, letterSpacing: 2, fontWeight: '700' },
  bookingCode: { color: '#243e3b', fontSize: 23, letterSpacing: 2, fontWeight: '800', marginTop: 7 },
  summaryText: { color: '#65716a', fontSize: 13, marginTop: 5, textAlign: 'center' },
  totalText: { color: '#243e3b', fontSize: 16, marginTop: 12, fontWeight: '800' },
  footer: { backgroundColor: '#203a36', paddingVertical: 34, paddingHorizontal: 20, alignItems: 'center', marginHorizontal: -20 },
  footerBrand: { color: '#e3c68e', fontSize: 22, letterSpacing: 5, fontWeight: '700' },
  footerText: { color: '#d8dfda', fontSize: 12, marginTop: 8, textAlign: 'center' },
});
