import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  Modal,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon5 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon6 from 'react-native-vector-icons/MaterialIcons';
import Icon7 from 'react-native-vector-icons/FontAwesome';


// ─── Fallback stubs (remove once you wire real imports above) ─────────────────
const colors = { primary: '#004aad', success: '#00C087' };
const lightTheme = { background: '#F8F9FA', card: '#FFFFFF', text: '#1A1A1A' };
const darkTheme = { background: '#0A0A0A', card: '#111111', text: '#FFFFFF' };
const useTheme = () => ({ darkMode: false });
const ScalpingPanel = ({ onClose }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
    <Text>ScalpingPanel</Text>
    <TouchableOpacity onPress={onClose}><Text style={{ color: 'blue' }}>Close</Text></TouchableOpacity>
  </View>
);
const addToWatchlist = async () => { };
const removeFromWatchlist = async () => { };
const isInWatchlist = async () => false;
const getAllWatchlists = async () => ({});
const removeStockFromAllWatchlists = async () => { };
const isStockInAnyWatchlist = async () => false;
// ─────────────────────────────────────────────────────────────────────────────

const TIME_PERIODS = [
  { label: '1m', interval: '1m', range: '1d' },
  { label: '2m', interval: '2m', range: '1d' },
  { label: '3m', interval: '3m', range: '1d' },
  { label: '5m', interval: '5m', range: '1d' },
  { label: '15m', interval: '15m', range: '1d' },
  { label: '30m', interval: '30m', range: '5d' },
  { label: '1h', interval: '60m', range: '1mo' },
  { label: '1D', interval: '1d', range: '1mo' },
  { label: '1W', interval: '1wk', range: '6mo' },
  { label: '1M', interval: '1mo', range: '1y' },
  { label: '3M', interval: '1d', range: '3mo' },
  { label: '6M', interval: '1d', range: '6mo' },
  { label: '1Y', interval: '1d', range: '1y' },
  { label: '5Y', interval: '1wk', range: '5y' },
  { label: 'All', interval: '1mo', range: 'max' },
];

const MCX_SYMBOLS = {
  GOLD: 'GC=F', SILVER: 'SI=F', COPPER: 'HG=F',
  'CRUDE OIL': 'CL=F', 'NATURAL GAS': 'NG=F', 'BRENT OIL': 'BZ=F',
  PLATINUM: 'PL=F', PALLADIUM: 'PA=F', ALUMINIUM: 'ALI=F',
  NICKEL: 'NI=F', LEAD: 'PB=F', WHEAT: 'ZW=F', SOYBEAN: 'ZS=F',
  MAIZE: 'ZC=F', COTTON: 'CT=F', SUGAR: 'SB=F', COFFEE: 'KC=F',
  'BEAN OIL': 'ZL=F', 'SOY MEAL': 'ZM=F', RICE: 'ZR=F',
};

const getBaseSymbol = (sym) => {
  const symbolMap = {
    NIFTY: { base: '^NSEI', nse: true, bse: false, exchange: 'NSE' },
    '^NSEI': { base: '^NSEI', nse: true, bse: false, exchange: 'NSE' },
    SENSEX: { base: '^BSESN', nse: false, bse: true, exchange: 'BSE' },
    '^BSESN': { base: '^BSESN', nse: false, bse: true, exchange: 'BSE' },
    BANKNIFTY: { base: '^NSEBANK', nse: true, bse: false, exchange: 'NSE' },
    '^NSEBANK': { base: '^NSEBANK', nse: true, bse: false, exchange: 'NSE' },
  };
  return symbolMap[sym] || { base: sym, nse: true, bse: true, exchange: 'NSE' };
};

// ─── Alert Condition Options ──────────────────────────────────────────────────
const ALERT_CONDITIONS = [
  { id: 'price_above', label: 'Price Above', icon: 'trending-up', color: '#00C087' },
  { id: 'price_below', label: 'Price Below', icon: 'trending-down', color: '#FF5252' },
  { id: 'price_equal', label: 'Price Equal To', icon: 'minus', color: '#2196F3' },
  { id: 'percent_change_up', label: '% Change Up', icon: 'arrow-up-circle', color: '#00C087' },
  { id: 'percent_change_down', label: '% Change Down', icon: 'arrow-down-circle', color: '#FF5252' },
  { id: 'volume_above', label: 'Volume Above', icon: 'bar-chart-2', color: '#9C27B0' },
];

const ALERT_FREQUENCIES = [
  { id: 'once', label: 'Once' },
  { id: 'daily', label: 'Daily' },
  { id: 'always', label: 'Always' },
];

// ─── Alert Modal Styles ───────────────────────────────────────────────────────
const getAlertStyles = (theme, darkMode) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.52)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: theme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: hp(90), minHeight: hp(55), paddingBottom: 24 },
  handle: { width: 38, height: 4, borderRadius: 2, backgroundColor: darkMode ? '#444' : '#DDDDDD', alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: 0.5, borderColor: darkMode ? '#333' : '#EBEBEB' },
  headerTitle: { fontSize: responsiveFontSize(2.1), fontWeight: '700', color: theme.text },
  headerSub: { fontSize: responsiveFontSize(1.45), color: darkMode ? '#AAA' : '#888', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  priceBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: darkMode ? '#1a2a3a' : '#F0F6FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 0.5, borderColor: darkMode ? '#2a4a6a' : '#DDE6FF' },
  liveSmallDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#1D9E75' },
  priceBadgeText: { fontSize: responsiveFontSize(1.5), fontWeight: '700', color: '#185FA5' },
  closeBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: darkMode ? '#2A2A2A' : '#F4F4F6', justifyContent: 'center', alignItems: 'center' },
  tabRow: { flexDirection: 'row', paddingHorizontal: 18, paddingVertical: 10, gap: 10, backgroundColor: darkMode ? '#111' : '#FAFAFA', borderBottomWidth: 0.5, borderColor: darkMode ? '#333' : '#EBEBEB' },
  tabBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 0.5, borderColor: darkMode ? '#444' : '#E0E0E0', backgroundColor: theme.card },
  tabBtnActive: { backgroundColor: darkMode ? '#1a2a3a' : '#E6F1FB', borderColor: '#B5D4F4' },
  tabBtnText: { fontSize: responsiveFontSize(1.5), color: '#AAA', fontWeight: '600' },
  tabBtnTextActive: { color: '#185FA5' },
  section: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  sectionLabel: { fontSize: responsiveFontSize(1.5), fontWeight: '700', color: darkMode ? '#888' : '#888', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  conditionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  conditionCard: { width: '30.5%', backgroundColor: darkMode ? '#1A1A1A' : '#F8F8FA', borderRadius: 12, borderWidth: 1, borderColor: darkMode ? '#333' : '#EBEBEB', padding: 12, alignItems: 'center', gap: 6, position: 'relative' },
  conditionIconWrap: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  conditionLabel: { fontSize: responsiveFontSize(1.35), color: darkMode ? '#CCC' : '#444', fontWeight: '600', textAlign: 'center' },
  conditionCheck: { position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  quickRow: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  quickChip: { flex: 1, backgroundColor: darkMode ? '#1A1A1A' : '#F8F8FA', borderRadius: 10, borderWidth: 1, paddingVertical: 8, alignItems: 'center' },
  quickChipTop: { fontSize: responsiveFontSize(1.35), fontWeight: '700' },
  quickChipVal: { fontSize: responsiveFontSize(1.2), color: darkMode ? '#AAA' : '#888', marginTop: 2 },
  step2Header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  backChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: darkMode ? '#1a2a3a' : '#E6F1FB', borderWidth: 0.5, borderColor: '#B5D4F4' },
  backChipText: { fontSize: responsiveFontSize(1.4), color: '#185FA5', fontWeight: '600' },
  selectedConditionChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  selectedConditionText: { fontSize: responsiveFontSize(1.5), fontWeight: '700' },
  valueInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: darkMode ? '#1A1A1A' : '#F8F8FA', borderRadius: 12, borderWidth: 1, borderColor: darkMode ? '#333' : '#E0E0E0', paddingHorizontal: 14, marginBottom: 16, height: 52 },
  valuePrefix: { fontSize: responsiveFontSize(2), color: '#BBBBBB', fontWeight: '600', marginRight: 8 },
  valueInput: { flex: 1, fontSize: responsiveFontSize(2.2), fontWeight: '700', color: theme.text, paddingVertical: 0 },
  useCurrentBtn: { backgroundColor: darkMode ? '#1a2a3a' : '#E6F1FB', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 0.5, borderColor: '#B5D4F4' },
  useCurrentBtnText: { fontSize: responsiveFontSize(1.35), color: '#185FA5', fontWeight: '600' },
  noteInput: { backgroundColor: darkMode ? '#1A1A1A' : '#F8F8FA', borderRadius: 12, borderWidth: 1, borderColor: darkMode ? '#333' : '#E0E0E0', paddingHorizontal: 14, paddingVertical: 12, fontSize: responsiveFontSize(1.7), color: theme.text, marginBottom: 16 },
  freqRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  freqChip: { flex: 1, paddingVertical: 9, borderRadius: 10, borderWidth: 1, borderColor: darkMode ? '#444' : '#E0E0E0', backgroundColor: darkMode ? '#1A1A1A' : '#F8F8FA', alignItems: 'center' },
  freqChipActive: { backgroundColor: darkMode ? '#1a2a3a' : '#E6F1FB', borderColor: '#185FA5' },
  freqChipText: { fontSize: responsiveFontSize(1.55), color: '#888', fontWeight: '600' },
  freqChipTextActive: { color: '#185FA5' },
  notifyRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  notifyChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9, borderRadius: 10, borderWidth: 1, borderColor: darkMode ? '#444' : '#E0E0E0', backgroundColor: darkMode ? '#1A1A1A' : '#F8F8FA' },
  notifyChipActive: { backgroundColor: darkMode ? '#1a2a3a' : '#E6F1FB', borderColor: '#B5D4F4' },
  notifyChipText: { fontSize: responsiveFontSize(1.5), color: '#AAA', fontWeight: '600' },
  notifyChipTextActive: { color: '#185FA5' },
  createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#185FA5', borderRadius: 14, paddingVertical: 14, marginTop: 4, elevation: 2, shadowColor: '#185FA5', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6 },
  createBtnText: { fontSize: responsiveFontSize(1.9), fontWeight: '700', color: '#fff' },
  emptyAlerts: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyAlertsText: { fontSize: responsiveFontSize(1.7), color: darkMode ? '#555' : '#CCCCCC' },
  alertCard: { flexDirection: 'row', backgroundColor: darkMode ? '#1A1A1A' : '#F8F8FA', borderRadius: 12, borderWidth: 0.5, borderColor: darkMode ? '#333' : '#EBEBEB', marginBottom: 10, overflow: 'hidden' },
  alertConditionBar: { width: 4 },
  alertCardContent: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 12 },
  alertConditionText: { fontSize: responsiveFontSize(1.4), color: darkMode ? '#AAA' : '#888', fontWeight: '600' },
  alertValueText: { fontSize: responsiveFontSize(1.9), fontWeight: '700', marginTop: 2 },
  alertNoteText: { fontSize: responsiveFontSize(1.3), color: '#AAA', marginTop: 2 },
  alertCardActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deleteBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: darkMode ? '#2a1a1a' : '#FFF0F0', justifyContent: 'center', alignItems: 'center' },
});

// ─── Alert Modal Component ────────────────────────────────────────────────────
function AlertModal({ visible, onClose, symbol, name, currentPrice }) {
  const { darkMode } = useTheme();
  const theme = darkMode ? darkTheme : lightTheme;
  const alertStyles = getAlertStyles(theme, darkMode);

  const [step, setStep] = useState(1);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [alertValue, setAlertValue] = useState('');
  const [alertNote, setAlertNote] = useState('');
  const [frequency, setFrequency] = useState('once');
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [existingAlerts, setExistingAlerts] = useState([
    { id: 1, condition: 'price_above', value: '20000', note: 'Breakout target', active: true },
    { id: 2, condition: 'price_below', value: '19500', note: 'Stop loss', active: true },
  ]);

  const handleClose = () => {
    setStep(1); setSelectedCondition(null); setAlertValue(''); setAlertNote(''); setFrequency('once');
    onClose();
  };

  const handleCreate = () => {
    if (!alertValue) { Alert.alert('Enter Value', 'Please enter a value for the alert.'); return; }
    const newAlert = { id: Date.now(), condition: selectedCondition.id, value: alertValue, note: alertNote, active: true };
    setExistingAlerts(prev => [newAlert, ...prev]);
    Alert.alert('Alert Set!', `Alert created for ${symbol} when ${selectedCondition.label} ${alertValue}`);
    handleClose();
  };

  const toggleAlert = (id) => setExistingAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  const deleteAlert = (id) => setExistingAlerts(prev => prev.filter(a => a.id !== id));

  const getConditionDisplay = (condId) => { const c = ALERT_CONDITIONS.find(x => x.id === condId); return c ? c.label : condId; };
  const getConditionColor = (condId) => { const c = ALERT_CONDITIONS.find(x => x.id === condId); return c ? c.color : '#666'; };

  const isVolumeCondition = selectedCondition?.id === 'volume_above';
  const isPercentCondition = selectedCondition?.id?.includes('percent');

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={alertStyles.overlay}>
          <View style={alertStyles.sheet}>
            <View style={alertStyles.handle} />

            {/* Header */}
            <View style={alertStyles.header}>
              <View>
                <Text style={alertStyles.headerTitle}>Set Alert</Text>
                <Text style={alertStyles.headerSub}>{name || symbol}</Text>
              </View>
              <View style={alertStyles.headerRight}>
                <View style={alertStyles.priceBadge}>
                  <View style={alertStyles.liveSmallDot} />
                  <Text style={alertStyles.priceBadgeText}>
                    ₹{currentPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '—'}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleClose} style={alertStyles.closeBtn}>
                  <Icon2 name="x" size={18} color={darkMode ? '#AAA' : '#555'} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Tabs */}
            <View style={alertStyles.tabRow}>
              <TouchableOpacity style={[alertStyles.tabBtn, step !== 0 && alertStyles.tabBtnActive]} onPress={() => setStep(1)}>
                <Icon2 name="plus-circle" size={14} color={step !== 0 ? '#185FA5' : '#AAA'} />
                <Text style={[alertStyles.tabBtnText, step !== 0 && alertStyles.tabBtnTextActive]}>New Alert</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[alertStyles.tabBtn, step === 0 && alertStyles.tabBtnActive]} onPress={() => setStep(0)}>
                <Icon2 name="bell" size={14} color={step === 0 ? '#185FA5' : '#AAA'} />
                <Text style={[alertStyles.tabBtnText, step === 0 && alertStyles.tabBtnTextActive]}>
                  Active ({existingAlerts.filter(a => a.active).length})
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} keyboardShouldPersistTaps="handled">

              {/* Active Alerts */}
              {step === 0 && (
                <View style={alertStyles.section}>
                  {existingAlerts.length === 0 ? (
                    <View style={alertStyles.emptyAlerts}>
                      <Icon2 name="bell-off" size={36} color={darkMode ? '#444' : '#DDD'} />
                      <Text style={alertStyles.emptyAlertsText}>No alerts set</Text>
                    </View>
                  ) : existingAlerts.map(alert => (
                    <View key={alert.id} style={alertStyles.alertCard}>
                      <View style={[alertStyles.alertConditionBar, { backgroundColor: getConditionColor(alert.condition) }]} />
                      <View style={alertStyles.alertCardContent}>
                        <View style={{ flex: 1 }}>
                          <Text style={alertStyles.alertConditionText}>{getConditionDisplay(alert.condition)}</Text>
                          <Text style={[alertStyles.alertValueText, { color: getConditionColor(alert.condition) }]}>₹{alert.value}</Text>
                          {alert.note ? <Text style={alertStyles.alertNoteText}>{alert.note}</Text> : null}
                        </View>
                        <View style={alertStyles.alertCardActions}>
                          <Switch
                            value={alert.active}
                            onValueChange={() => toggleAlert(alert.id)}
                            trackColor={{ false: darkMode ? '#333' : '#E0E0E0', true: '#B5D4F4' }}
                            thumbColor={alert.active ? '#185FA5' : darkMode ? '#555' : '#FFF'}
                            style={{ transform: [{ scale: 0.8 }] }}
                          />
                          <TouchableOpacity onPress={() => deleteAlert(alert.id)} style={alertStyles.deleteBtn}>
                            <Icon2 name="trash-2" size={15} color="#FF5252" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Step 1 — Choose Condition */}
              {step === 1 && (
                <View style={alertStyles.section}>
                  <Text style={alertStyles.sectionLabel}>Choose Condition</Text>
                  <View style={alertStyles.conditionGrid}>
                    {ALERT_CONDITIONS.map(cond => (
                      <TouchableOpacity
                        key={cond.id}
                        style={[alertStyles.conditionCard, selectedCondition?.id === cond.id && { borderColor: cond.color, backgroundColor: cond.color + '12' }]}
                        onPress={() => { setSelectedCondition(cond); setStep(2); }}
                        activeOpacity={0.75}
                      >
                        <View style={[alertStyles.conditionIconWrap, { backgroundColor: cond.color + '18' }]}>
                          <Icon2 name={cond.icon} size={18} color={cond.color} />
                        </View>
                        <Text style={[alertStyles.conditionLabel, selectedCondition?.id === cond.id && { color: cond.color, fontWeight: '700' }]}>
                          {cond.label}
                        </Text>
                        {selectedCondition?.id === cond.id && (
                          <View style={[alertStyles.conditionCheck, { backgroundColor: cond.color }]}>
                            <Icon2 name="check" size={10} color="#fff" />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={alertStyles.sectionLabel}>Quick Set</Text>
                  <View style={alertStyles.quickRow}>
                    {[
                      { label: '-5%', val: (currentPrice * 0.95).toFixed(2), color: '#FF5252' },
                      { label: '-2%', val: (currentPrice * 0.98).toFixed(2), color: '#FF8A65' },
                      { label: 'Current', val: currentPrice?.toFixed(2), color: '#185FA5' },
                      { label: '+2%', val: (currentPrice * 1.02).toFixed(2), color: '#66BB6A' },
                      { label: '+5%', val: (currentPrice * 1.05).toFixed(2), color: '#00C087' },
                    ].map(q => (
                      <TouchableOpacity
                        key={q.label}
                        style={[alertStyles.quickChip, { borderColor: q.color + '44' }]}
                        onPress={() => {
                          setAlertValue(q.val);
                          setSelectedCondition(
                            q.label.startsWith('+') ? ALERT_CONDITIONS[0] :
                              q.label.startsWith('-') ? ALERT_CONDITIONS[1] :
                                ALERT_CONDITIONS[2]
                          );
                          setStep(2);
                        }}
                      >
                        <Text style={[alertStyles.quickChipTop, { color: q.color }]}>{q.label}</Text>
                        <Text style={alertStyles.quickChipVal}>₹{q.val}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Step 2 — Value + Settings */}
              {step === 2 && selectedCondition && (
                <View style={alertStyles.section}>
                  <View style={alertStyles.step2Header}>
                    <TouchableOpacity onPress={() => setStep(1)} style={alertStyles.backChip}>
                      <Icon2 name="arrow-left" size={14} color="#185FA5" />
                      <Text style={alertStyles.backChipText}>Change</Text>
                    </TouchableOpacity>
                    <View style={[alertStyles.selectedConditionChip, { backgroundColor: selectedCondition.color + '15', borderColor: selectedCondition.color + '44' }]}>
                      <Icon2 name={selectedCondition.icon} size={13} color={selectedCondition.color} />
                      <Text style={[alertStyles.selectedConditionText, { color: selectedCondition.color }]}>{selectedCondition.label}</Text>
                    </View>
                  </View>

                  <Text style={alertStyles.sectionLabel}>
                    {isVolumeCondition ? 'Volume Value' : isPercentCondition ? 'Percentage (%)' : 'Price Value (₹)'}
                  </Text>
                  <View style={alertStyles.valueInputWrap}>
                    <Text style={alertStyles.valuePrefix}>{isVolumeCondition ? 'Vol' : isPercentCondition ? '%' : '₹'}</Text>
                    <TextInput
                      style={alertStyles.valueInput}
                      value={alertValue}
                      onChangeText={setAlertValue}
                      keyboardType="numeric"
                      placeholder={isVolumeCondition ? 'e.g. 5000000' : currentPrice?.toFixed(2)}
                      placeholderTextColor="#BBBBBB"
                      autoFocus
                    />
                    {!isVolumeCondition && !isPercentCondition && (
                      <TouchableOpacity style={alertStyles.useCurrentBtn} onPress={() => setAlertValue(currentPrice?.toFixed(2))}>
                        <Text style={alertStyles.useCurrentBtnText}>Use Current</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <Text style={alertStyles.sectionLabel}>Note (optional)</Text>
                  <TextInput
                    style={alertStyles.noteInput}
                    value={alertNote}
                    onChangeText={setAlertNote}
                    placeholder="e.g. Breakout target, Stop loss..."
                    placeholderTextColor="#BBBBBB"
                    maxLength={80}
                  />

                  <Text style={alertStyles.sectionLabel}>Alert Frequency</Text>
                  <View style={alertStyles.freqRow}>
                    {ALERT_FREQUENCIES.map(f => (
                      <TouchableOpacity key={f.id} style={[alertStyles.freqChip, frequency === f.id && alertStyles.freqChipActive]} onPress={() => setFrequency(f.id)}>
                        <Text style={[alertStyles.freqChipText, frequency === f.id && alertStyles.freqChipTextActive]}>{f.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={alertStyles.sectionLabel}>Notify Via</Text>
                  <View style={alertStyles.notifyRow}>
                    {[
                      { key: 'push', label: 'Push', icon: 'bell', val: notifyPush, set: setNotifyPush },
                      { key: 'sms', label: 'SMS', icon: 'message-square', val: notifySMS, set: setNotifySMS },
                      { key: 'email', label: 'Email', icon: 'mail', val: notifyEmail, set: setNotifyEmail },
                    ].map(n => (
                      <TouchableOpacity key={n.key} style={[alertStyles.notifyChip, n.val && alertStyles.notifyChipActive]} onPress={() => n.set(!n.val)}>
                        <Icon2 name={n.icon} size={14} color={n.val ? '#185FA5' : '#AAA'} />
                        <Text style={[alertStyles.notifyChipText, n.val && alertStyles.notifyChipTextActive]}>{n.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity style={alertStyles.createBtn} onPress={handleCreate} activeOpacity={0.85}>
                    <Icon2 name="bell" size={16} color="#fff" />
                    <Text style={alertStyles.createBtnText}>Create Alert</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Main ChartScreen Component ───────────────────────────────────────────────
export default function ChartScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    symbol,
    name,
    price: routePrice,
    stock: passedStock,
    stockInfo: routeStockInfo,
  } = route.params || {};

  const selectedStock = passedStock || {
    symbol,
    name,
    tradingSymbol: routeStockInfo?.tradingSymbol || passedStock?.tradingSymbol || symbol,
    type: routeStockInfo?.type || passedStock?.type || (routeStockInfo?.isMCX ? 'MCX' : null),
    exchange: routeStockInfo?.type || passedStock?.exchange || (routeStockInfo?.isMCX ? 'MCX' : null),
  };

  const [orientation, setOrientation] = useState('portrait');
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(routePrice || null);
  const [change, setChange] = useState(passedStock?.change || null);
  const [changePercent, setChangePercent] = useState(passedStock?.changePercent || null);
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [chartType, setChartType] = useState('area');
  const [stockInfo, setStockInfo] = useState(null);
  const [touchedPrice, setTouchedPrice] = useState(null);
  const [touchedTime, setTouchedTime] = useState(null);
  const [scalpingOpen, setScalpingOpen] = useState(false);
  const [activeStar, setActiveStar] = useState(false);
  const [watchlists, setWatchlists] = useState({});
  const [addWatchlistModalVisible, setAddWatchlistModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [watchlistsLoading, setWatchlistsLoading] = useState(false);
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [chartLoaded, setChartLoaded] = useState(false);
  const [optionsData, setOptionsData] = useState(null);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState(null);
  const [selectedExpiry, setSelectedExpiry] = useState(null);
  const [expiryDates, setExpiryDates] = useState([]);

  const { darkMode } = useTheme();
  const theme = darkMode ? darkTheme : lightTheme;

  const [selectedExchange, setSelectedExchange] = useState(() => {
    if (routeStockInfo?.type === 'MCX' || routeStockInfo?.isMCX ||
      passedStock?.type === 'MCX' || passedStock?.exchange === 'MCX') return 'MCX';
    const commodityNames = ['GOLD', 'SILVER', 'CRUDE', 'COPPER', 'NATURAL', 'WHEAT',
      'SOYBEAN', 'COTTON', 'PLATINUM', 'ALUMINIUM', 'NICKEL', 'BRENT', 'MAIZE', 'SUGAR',
      'COFFEE', 'RICE', 'ZINC', 'LEAD', 'MENTHA', 'CARDAMOM'];
    if (commodityNames.some(c => (name?.toUpperCase() || '').includes(c))) return 'MCX';
    return getBaseSymbol(symbol).exchange;
  });

  const intervalRef = useRef(null);
  const webViewRef = useRef(null);
  const optionsSheetRef = useRef(null);

  const isCommoditiesScreen = selectedExchange === 'MCX';
  const isLandscape = orientation === 'landscape';

  // Orientation
  useEffect(() => {
    const update = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
    };
    update();
    const sub = Dimensions.addEventListener('change', update);
    return () => sub?.remove();
  }, []);

  // Scalping reload
  useEffect(() => {
    if (scalpingOpen) { setChartLoaded(false); fetchStockData(selectedPeriod, false); }
  }, [scalpingOpen]);

  // Watchlist star
  useEffect(() => {
    const check = async () => {
      if (symbol) {
        try { setActiveStar(await isStockInAnyWatchlist(symbol)); }
        catch (_) { setActiveStar(false); }
      }
      loadWatchlists();
    };
    check();
  }, [symbol]);

  const loadWatchlists = async () => {
    try { setWatchlists(await getAllWatchlists()); }
    catch (e) { console.error('Error loading watchlists:', e); }
  };

  const handleAddToWatchlist = async (watchlistName) => {
    try {
      setWatchlistsLoading(true);
      await addToWatchlist({ symbol, name: name || symbol, logo: 'https://via.placeholder.com/100' }, watchlistName);
      setActiveStar(true);
      setAddWatchlistModalVisible(false);
      Alert.alert('Success', `${symbol} added to "${watchlistName}"`);
      loadWatchlists();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add');
    } finally {
      setWatchlistsLoading(false);
    }
  };

  const toggleStar = async () => {
    if (activeStar) {
      Alert.alert('Remove from Watchlist', `Remove ${symbol} from all watchlists?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive',
          onPress: async () => {
            try {
              if (removeStockFromAllWatchlists) await removeStockFromAllWatchlists(symbol);
              else await removeFromWatchlist(symbol);
              setActiveStar(false);
              await loadWatchlists();
              Alert.alert('Success', 'Removed from watchlists');
            } catch (e) { Alert.alert('Error', 'Failed to remove from watchlists'); }
          },
        },
      ]);
    } else {
      setAddWatchlistModalVisible(true);
    }
  };

  const getCommoditySymbol = (commodityName) => {
    const u = commodityName?.toUpperCase().replace(/ /g, '') || '';
    for (const key in MCX_SYMBOLS) if (u.includes(key)) return MCX_SYMBOLS[key];
    return 'GC=F';
  };

  const getYahooSymbol = (exchange) => {
    const mapped = getBaseSymbol(symbol);
    if (exchange === 'MCX') return getCommoditySymbol(name);
    if (exchange === 'BSE') {
      if (mapped.bse) return mapped.base;
      const base = mapped.base.replace('.NS', '');
      return base.startsWith('^') || base.endsWith('.BO') ? base : base + '.BO';
    }
    if (!mapped.base.startsWith('^') && !mapped.base.endsWith('.NS')) return mapped.base + '.NS';
    return mapped.base;
  };

  const fetchMCXDataFromBackend = async (tradingSymbol) => {
    try {
      setExchangeLoading(true); setLoading(true); setError(null);
      const token = null;
      if (!token) throw new Error('No authentication token found. Please login again.');
      const res = await fetch(`https://stockart-api.onrender.com/api/mcx/depth/${tradingSymbol}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (!result.success) throw new Error(result.message || 'Backend returned failure');
      const currentPrice = result.price || result.ohlc?.close || 0;
      setPrice(currentPrice);
      const ohlc = result.ohlc || {};
      const previousClose = ohlc.close || currentPrice;
      setChange(currentPrice - previousClose);
      setChangePercent(previousClose ? ((currentPrice - previousClose) / previousClose) * 100 : 0);
      setStockInfo({ open: ohlc.open || currentPrice, high: ohlc.high || currentPrice, low: ohlc.low || currentPrice, volume: result.volume || 0, marketCap: null, fiftyTwoWeekHigh: null, fiftyTwoWeekLow: null });
      setChartData((result.historicalData || []).map(item => ({
        time: item.time || item.timestamp,
        open: parseFloat(item.open) || currentPrice,
        high: parseFloat(item.high) || currentPrice,
        low: parseFloat(item.low) || currentPrice,
        close: parseFloat(item.close) || currentPrice,
        volume: parseInt(item.volume) || 0,
      })));
      setLoading(false); setExchangeLoading(false); setChartLoaded(true);
    } catch (err) {
      setError(err.message || 'Failed to load MCX data');
      setLoading(false); setExchangeLoading(false);
    }
  };

  const fetchStockData = async (periodIndex = selectedPeriod, isAutoRefresh = false) => {
    try {
      const isMCX = selectedExchange === 'MCX' || selectedStock?.type === 'MCX' ||
        selectedStock?.exchange === 'MCX' || routeStockInfo?.type === 'MCX' ||
        routeStockInfo?.isMCX || isCommoditiesScreen;

      if (isMCX) {
        const ts = selectedStock?.tradingSymbol || routeStockInfo?.tradingSymbol || passedStock?.tradingSymbol || symbol;
        if (ts) { await fetchMCXDataFromBackend(ts); return; }
      }

      const yahooSymbol = getYahooSymbol(selectedExchange);
      setExchangeLoading(true);
      if (!isAutoRefresh) setLoading(true);
      setError(null);

      const period = TIME_PERIODS[periodIndex];
      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=${period.interval}&range=${period.range}`,
        { headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.chart?.result?.[0]) throw new Error('No data');

      const result = json.chart.result[0];
      const meta = result.meta;
      const quotes = result.indicators.quote[0];
      const timestamps = result.timestamp || [];

      const lastPrice = meta.regularMarketPrice;
      const previousClose = meta.previousClose || meta.chartPreviousClose;
      setPrice(lastPrice);
      setChange(lastPrice - previousClose);
      setChangePercent(previousClose ? ((lastPrice - previousClose) / previousClose) * 100 : 0);

      const formattedData = timestamps.map((ts, i) => {
        if (!ts) return null;
        const date = new Date(ts * 1000);
        const timeValue = period.label === '1D' ? Math.floor(ts / 300) * 300 : date.toISOString().split('T')[0];
        return { time: timeValue, open: quotes.open[i] ?? 0, high: quotes.high[i] ?? 0, low: quotes.low[i] ?? 0, close: quotes.close[i] ?? 0, volume: quotes.volume[i] ?? 0 };
      }).filter(d => d && d.close > 0);

      setChartData(formattedData);
      setStockInfo({ open: meta.regularMarketOpen, high: meta.regularMarketDayHigh, low: meta.regularMarketDayLow, volume: meta.regularMarketVolume, marketCap: meta.marketCap, fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh, fiftyTwoWeekLow: meta.fiftyTwoWeekLow });

      if (!isAutoRefresh) setLoading(false);
      setExchangeLoading(false);

      if (chartLoaded && webViewRef.current && !isAutoRefresh)
        webViewRef.current.injectJavaScript(`if (window.updateChartData) { window.updateChartData(${JSON.stringify(formattedData)}); } true;`);
    } catch (err) {
      setError(err.message);
      if (!isAutoRefresh) setLoading(false);
      setExchangeLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
    const intraday = ['1m', '2m', '3m', '5m', '15m', '30m', '1h'].includes(TIME_PERIODS[selectedPeriod].label);
    if (intraday) intervalRef.current = setInterval(() => fetchStockData(selectedPeriod, true), 20000);
    return () => clearInterval(intervalRef.current);
  }, [selectedPeriod, selectedExchange]);

  const handlePeriodChange = (index) => {
    setSelectedPeriod(index); setTouchedPrice(null); setTouchedTime(null); setChartLoaded(false);
    clearInterval(intervalRef.current);
    if (['1m', '2m', '3m', '5m', '15m', '30m', '1h'].includes(TIME_PERIODS[index].label))
      intervalRef.current = setInterval(() => fetchStockData(index, true), 20000);
  };

  const handleExchangeChange = (exchange) => {
    if (exchange !== selectedExchange && !isCommoditiesScreen) {
      setSelectedExchange(exchange); setChartLoaded(false); clearInterval(intervalRef.current);
    }
  };

  const handleChartTypeChange = () => {
    const newType = chartType === 'area' ? 'candle' : 'area';
    setChartType(newType);
    webViewRef.current?.injectJavaScript(`if (window.updateChartType) window.updateChartType('${newType}');`);
  };

  const resetTouch = () => { setTouchedPrice(null); setTouchedTime(null); };

  const fetchOptionsChain = async () => {
    if (isCommoditiesScreen || getBaseSymbol(symbol).base === '^BSESN') {
      Alert.alert('Options Unavailable', 'Options not available for MCX or SENSEX.'); return;
    }
    try {
      setOptionsLoading(true); setOptionsError(null);
      setTimeout(() => {
        setOptionsLoading(false);
        const strikes = [];
        for (let i = -5; i <= 5; i++) strikes.push(Math.round(price) + i * 50);
        setExpiryDates(['2025-10-30']); setSelectedExpiry('2025-10-30');
        setOptionsData({ data: strikes.map(s => ({ strikePrice: s, expiryDate: '2025-10-30', CE: { lastPrice: 100, openInterest: 5000, change: 5 }, PE: { lastPrice: 80, openInterest: 4000, change: -2 } })) });
        optionsSheetRef.current?.open();
      }, 1000);
    } catch (err) { setOptionsError(err.message); }
  };

  const getFilteredOptions = () => {
    if (!optionsData || !selectedExpiry) return [];
    return (optionsData.data || []).filter(i => i.expiryDate === selectedExpiry).sort((a, b) => a.strikePrice - b.strikePrice);
  };

  const getChartHTML = (isDark = false) => {
    if (!chartData || chartData.length === 0) return '';
    const bg = isDark ? '#0A0A0A' : '#FFFFFF';
    const text = isDark ? '#888888' : '#333333';
    const grid = isDark ? '#1A1A1A' : '#F5F5F5';
    const border = isDark ? '#222222' : '#D1D4DC';
    const isArea = chartType === 'area';
    const useUnixTime = typeof chartData[0]?.time === 'number';

    return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js"></script>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body { width:100%; height:100%; overflow:hidden; background:${bg}; }
    #chart { width:100%; height:100%; }
  </style>
</head>
<body>
  <div id="chart"></div>
  <script>
    try {
      const chartData = ${JSON.stringify(chartData)};
      const chart = LightweightCharts.createChart(document.getElementById('chart'), {
        width: window.innerWidth, height: window.innerHeight,
        layout: { background: { color: '${bg}' }, textColor: '${text}' },
        grid: { vertLines: { color: '${grid}' }, horzLines: { color: '${grid}' } },
        crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
        timeScale: { timeVisible: true, secondsVisible: ${useUnixTime}, borderColor: '${border}' },
        rightPriceScale: { borderColor: '${border}' },
      });
      let series;
      if (${isArea}) {
        series = chart.addAreaSeries({ topColor: 'rgba(33,150,243,0.4)', bottomColor: 'rgba(33,150,243,0)', lineColor: '#2196F3', lineWidth: 2 });
        series.setData(chartData.map(d => ({ time: d.time, value: d.close })));
      } else {
        series = chart.addCandlestickSeries({ upColor:'#00C087', downColor:'#FF5252', borderUpColor:'#00C087', borderDownColor:'#FF5252', wickUpColor:'#00C087', wickDownColor:'#FF5252' });
        series.setData(chartData);
      }
      chart.timeScale().fitContent();
      chart.subscribeCrosshairMove(param => {
        if (param.time) {
          const d = param.seriesData.get(series);
          if (d) {
            const p = ${isArea} ? d.value : d.close;
            const t = ${useUnixTime} ? new Date(param.time * 1000).toLocaleString() : param.time;
            window.ReactNativeWebView.postMessage(JSON.stringify({ type:'priceUpdate', price:p, time:t }));
          }
        } else {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type:'priceReset' }));
        }
      });
      window.addEventListener('resize', () => chart.applyOptions({ width: window.innerWidth, height: window.innerHeight }));
      window.updateChartData = (d) => {
        series.setData(${isArea} ? d.map(x => ({ time:x.time, value:x.close })) : d);
        chart.timeScale().fitContent();
      };
      window.updateChartType = (t) => {
        chart.removeSeries(series);
        if (t === 'area') {
          series = chart.addAreaSeries({ topColor:'rgba(33,150,243,0.4)', bottomColor:'rgba(33,150,243,0)', lineColor:'#2196F3', lineWidth:2 });
          series.setData(chartData.map(d => ({ time:d.time, value:d.close })));
        } else {
          series = chart.addCandlestickSeries({ upColor:'#00C087', downColor:'#FF5252', borderUpColor:'#00C087', borderDownColor:'#FF5252', wickUpColor:'#00C087', wickDownColor:'#FF5252' });
          series.setData(chartData);
        }
        chart.timeScale().fitContent();
      };
      window.ReactNativeWebView.postMessage(JSON.stringify({ type:'chartLoaded' }));
    } catch(e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type:'chartError', error:e.message }));
    }
  </script>
</body>
</html>`;
  };

  const handleWebViewMessage = (e) => {
    try {
      const data = JSON.parse(e.nativeEvent.data);
      if (data.type === 'chartLoaded') setChartLoaded(true);
      else if (data.type === 'priceUpdate') { setTouchedPrice(data.price); setTouchedTime(data.time); }
      else if (data.type === 'priceReset') { setTouchedPrice(null); setTouchedTime(null); }
    } catch (_) { }
  };

  const formatPrice = (val) => val ? val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';
  const formatVolume = (val) => {
    if (!val) return '—';
    if (val >= 1e7) return `${(val / 1e7).toFixed(2)}Cr`;
    if (val >= 1e5) return `${(val / 1e5).toFixed(2)}L`;
    if (val >= 1e3) return `${(val / 1e3).toFixed(2)}K`;
    return val.toString();
  };

  const isPositive = change >= 0;
  const currency = '₹';
  const symbolInfo = getBaseSymbol(symbol);

  const renderWatchlistOption = ({ item: [watchlistName] }) => (
    <TouchableOpacity
      style={[styles.watchlistOption, { backgroundColor: darkMode ? '#1A1A1A' : '#f9fafb' }]}
      onPress={() => handleAddToWatchlist(watchlistName)}
      disabled={watchlistsLoading}
    >
      <Icon5 name="star-outline" size={20} color={colors.primary} />
      <Text style={[styles.watchlistOptionText, { color: theme.text }]}>{watchlistName}</Text>
      {watchlistsLoading && <ActivityIndicator size="small" color={colors.primary} />}
    </TouchableOpacity>
  );

  const renderOptionRow = ({ item }) => {
    const atm = price && Math.abs(item.strikePrice - price) < 100;
    return (
      <View style={[styles.optionRow, { backgroundColor: darkMode ? '#1A1A1A' : '#fff' }]}>
        <TouchableOpacity style={[styles.optionCell, styles.callCell, { borderRightColor: darkMode ? '#333' : '#F5F5F5' }]}>
          {item.CE ? (
            <>
              <Text style={[styles.oiText, { color: darkMode ? '#666' : '#999' }]}>{formatVolume(item.CE.openInterest)}</Text>
              <View style={styles.ltpSection}>
                <Text style={[styles.ltpValue, { color: theme.text }]}>₹{item.CE.lastPrice?.toFixed(2)}</Text>
                <Text style={[styles.changePercent, item.CE.change >= 0 ? styles.positiveChange : styles.negativeChange]}>
                  {item.CE.change >= 0 ? '+' : ''}{(item.CE.pChange || 0).toFixed(2)}%
                </Text>
              </View>
            </>
          ) : <Text style={styles.noDataCell}>—</Text>}
        </TouchableOpacity>
        <View style={[styles.strikeColumn, atm && styles.strikeColumnATM, { borderColor: darkMode ? '#333' : '#F5F5F5' }]}>
          <Text style={[styles.strikePrice, { color: darkMode ? '#CCC' : '#333' }, atm && styles.strikePriceATM]}>{item.strikePrice}</Text>
        </View>
        <TouchableOpacity style={[styles.optionCell, styles.putCell, { borderLeftColor: darkMode ? '#333' : '#F5F5F5' }]}>
          {item.PE ? (
            <>
              <View style={styles.ltpSection}>
                <Text style={[styles.ltpValue, { color: theme.text }]}>₹{item.PE.lastPrice?.toFixed(2)}</Text>
                <Text style={[styles.changePercent, item.PE.change >= 0 ? styles.positiveChange : styles.negativeChange]}>
                  {item.PE.change >= 0 ? '+' : ''}{(item.PE.pChange || 0).toFixed(2)}%
                </Text>
              </View>
              <Text style={[styles.oiText, { color: darkMode ? '#666' : '#999' }]}>{formatVolume(item.PE.openInterest)}</Text>
            </>
          ) : <Text style={styles.noDataCell}>—</Text>}
        </TouchableOpacity>
      </View>
    );
  };

  // Guard
  if (!symbol || !name) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={styles.errorText}>Invalid symbol or name</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── SCALPING MODE ─────────────────────────────────────────────────────────────
  if (scalpingOpen) {
    if (isLandscape) {
      return (
        <View style={scalpingStyles.rootLandscape}>
          <View style={scalpingStyles.leftPane}>
            <View style={scalpingStyles.headerLandscape}>
              <TouchableOpacity style={scalpingStyles.backBtn} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Main')}>
                <Icon2 name="arrow-left" size={16} color="#fff" />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={scalpingStyles.headerSymbol}>{symbol}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={scalpingStyles.headerPrice}>{currency}{price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                  {change !== null && (
                    <Text style={[scalpingStyles.headerChange, { color: change >= 0 ? '#00C087' : '#FF3B30' }]}>
                      {change >= 0 ? '+' : ''}{change?.toFixed(2)} ({changePercent?.toFixed(2)}%)
                    </Text>
                  )}
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity style={scalpingStyles.headerBtn} onPress={handleChartTypeChange}>
                  <Icon3 name={chartType === 'area' ? 'chart-waterfall' : 'chart-areaspline'} size={15} color="#aaa" />
                </TouchableOpacity>
                <TouchableOpacity style={scalpingStyles.headerBtn} onPress={() => setScalpingOpen(false)}>
                  <Icon2 name="x" size={15} color="#aaa" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              {loading ? (
                <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#2196F3" /></View>
              ) : chartData.length > 0 ? (
                <WebView ref={webViewRef} source={{ html: getChartHTML(true) }} style={{ flex: 1, backgroundColor: '#0A0A0A' }} javaScriptEnabled domStorageEnabled scrollEnabled={false} onMessage={handleWebViewMessage} />
              ) : (
                <View style={styles.loadingContainer}><Text style={{ color: '#666' }}>No chart data</Text></View>
              )}
            </View>
            <View style={scalpingStyles.periodRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 5, paddingHorizontal: 6, paddingVertical: 5 }}>
                {TIME_PERIODS.map((p, i) => (
                  <TouchableOpacity key={p.label} onPress={() => handlePeriodChange(i)} style={[scalpingStyles.periodChip, selectedPeriod === i && scalpingStyles.periodChipActive]}>
                    <Text style={[scalpingStyles.periodChipTxt, selectedPeriod === i && scalpingStyles.periodChipTxtActive]}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          <View style={scalpingStyles.dividerVertical}><View style={scalpingStyles.dividerVerticalPill} /></View>
          <View style={scalpingStyles.rightPane}>
            <ScalpingPanel price={price} symbol={symbol} name={name} onClose={() => setScalpingOpen(false)} embedded={true} isLandscape={true} />
          </View>
        </View>
      );
    }

    return (
      <View style={scalpingStyles.root}>
        <View style={scalpingStyles.topPane}>
          <View style={scalpingStyles.header}>
            <TouchableOpacity style={scalpingStyles.backBtn} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Main')}>
              <Icon2 name="arrow-left" size={18} color="#fff" />
            </TouchableOpacity>
            <View style={scalpingStyles.headerCenter}>
              <Text style={scalpingStyles.headerSymbol}>{symbol}</Text>
              <Text style={scalpingStyles.headerPrice}>{currency}{price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              {change !== null && (
                <Text style={[scalpingStyles.headerChange, { color: change >= 0 ? '#00C087' : '#FF3B30' }]}>
                  {change >= 0 ? '+' : ''}{change?.toFixed(2)} ({changePercent?.toFixed(2)}%)
                </Text>
              )}
            </View>
            <View style={scalpingStyles.headerRight}>
              <TouchableOpacity style={scalpingStyles.headerBtn} onPress={handleChartTypeChange}>
                <Icon3 name={chartType === 'area' ? 'chart-waterfall' : 'chart-areaspline'} size={16} color="#aaa" />
              </TouchableOpacity>
              <TouchableOpacity style={scalpingStyles.headerBtn} onPress={() => setScalpingOpen(false)}>
                <Icon2 name="x" size={16} color="#aaa" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            {loading ? (
              <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#2196F3" /></View>
            ) : chartData.length > 0 ? (
              <WebView ref={webViewRef} source={{ html: getChartHTML(true) }} style={{ flex: 1, backgroundColor: '#0A0A0A' }} javaScriptEnabled domStorageEnabled scrollEnabled={false} onMessage={handleWebViewMessage} />
            ) : (
              <View style={styles.loadingContainer}><Text style={{ color: '#666' }}>No chart data</Text></View>
            )}
          </View>
          <View style={scalpingStyles.periodRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingHorizontal: 8, paddingVertical: 6 }}>
              {TIME_PERIODS.map((p, i) => (
                <TouchableOpacity key={p.label} onPress={() => handlePeriodChange(i)} style={[scalpingStyles.periodChip, selectedPeriod === i && scalpingStyles.periodChipActive]}>
                  <Text style={[scalpingStyles.periodChipTxt, selectedPeriod === i && scalpingStyles.periodChipTxtActive]}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        <View style={scalpingStyles.divider}><View style={scalpingStyles.dividerPill} /></View>
        <View style={scalpingStyles.bottomPane}>
          <ScalpingPanel price={price} symbol={symbol} name={name} onClose={() => setScalpingOpen(false)} embedded={true} isLandscape={false} />
        </View>
      </View>
    );
  }

  // ── NORMAL MODE ───────────────────────────────────────────────────────────────
  return (
    <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Zone 1 — Top Nav */}
        <View style={[styles.firstPart, { backgroundColor: theme.card, borderColor: darkMode ? '#333' : '#EBEBEB' }]}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: darkMode ? '#1A1A1A' : '#F5F5F5', borderColor: darkMode ? '#333' : '#EBEBEB' }]}
            onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Main')}
          >
            <Icon2 name="arrow-left" size={responsiveHeight(2.8)} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerSymbolLabel, { color: theme.text }]} numberOfLines={1}>{name || symbol}</Text>
          <View style={[styles.headerActions, { backgroundColor: theme.card }]}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: darkMode ? '#1A1A1A' : '#F5F5F5', borderColor: darkMode ? '#333' : '#EBEBEB' }]}
              onPress={() => setAlertModalVisible(true)}
              activeOpacity={0.75}
            >
              <Icon6 name="alarm" size={responsiveHeight(2.6)} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleStar}
              style={[styles.iconButton, { backgroundColor: darkMode ? '#1A1A1A' : '#F5F5F5', borderColor: darkMode ? '#333' : '#EBEBEB' }]}
            >
              <Icon name={activeStar ? 'star' : 'star-o'} size={responsiveHeight(2.8)} color={activeStar ? '#F5A623' : theme.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: darkMode ? '#1A1A1A' : '#F5F5F5', borderColor: darkMode ? '#333' : '#EBEBEB' }, chartType === 'candle' && styles.iconButtonActive]}
              onPress={handleChartTypeChange}
            >
              <Icon3 name={chartType === 'area' ? 'chart-waterfall' : 'chart-areaspline'} size={responsiveHeight(2.8)} color={chartType === 'candle' ? '#fff' : theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Zone 2 — Exchange / Price */}
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <View style={styles.exchangeAndOptionsRow}>
            <View style={styles.exchangeRow}>
              {isCommoditiesScreen ? (
                <View style={[styles.exchangeBadge, styles.exchangeBadgeActive, { backgroundColor: theme.text }]}>
                  <Text style={styles.exchangeBadgeTextActive}>MCX</Text>
                </View>
              ) : symbolInfo.nse && !symbolInfo.bse ? (
                <View style={[styles.exchangeBadge, styles.exchangeBadgeActive, { backgroundColor: theme.text }]}>
                  <Text style={styles.exchangeBadgeTextActive}>NSE</Text>
                </View>
              ) : symbolInfo.bse && !symbolInfo.nse ? (
                <View style={[styles.exchangeBadge, styles.exchangeBadgeActive, { backgroundColor: theme.text }]}>
                  <Text style={styles.exchangeBadgeTextActive}>BSE</Text>
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={[styles.exchangeBadge, { backgroundColor: darkMode ? '#1A1A1A' : '#F0F0F0', borderColor: darkMode ? '#444' : '#F0F0F0' }, selectedExchange === 'NSE' && styles.exchangeBadgeActive]}
                    onPress={() => handleExchangeChange('NSE')} disabled={exchangeLoading}
                  >
                    <Text style={[styles.exchangeBadgeText, { color: darkMode ? '#AAA' : '#666' }, selectedExchange === 'NSE' && styles.exchangeBadgeTextActive]}>NSE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.exchangeBadge, { backgroundColor: darkMode ? '#1A1A1A' : '#F0F0F0', borderColor: darkMode ? '#444' : '#F0F0F0' }, selectedExchange === 'BSE' && styles.exchangeBadgeActive]}
                    onPress={() => handleExchangeChange('BSE')} disabled={exchangeLoading}
                  >
                    <Text style={[styles.exchangeBadgeText, { color: darkMode ? '#AAA' : '#666' }, selectedExchange === 'BSE' && styles.exchangeBadgeTextActive]}>BSE</Text>
                  </TouchableOpacity>
                </>
              )}
              {exchangeLoading && <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 8 }} />}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity onPress={() => setScalpingOpen(true)} activeOpacity={0.8}>
                <Icon7 name="bolt" size={responsiveHeight(2.8)} color={theme.text} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.optionbtn, { borderColor: darkMode ? '#555' : '#000' }]} onPress={fetchOptionsChain} disabled={optionsLoading}>
                {optionsLoading
                  ? <ActivityIndicator size="small" color={theme.text} />
                  : <Text style={[styles.optionBtnText, { color: theme.text }]}>Options Chain</Text>}
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>{name || symbol}</Text>

          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: theme.text }]}>{currency}{formatPrice(touchedPrice ?? price)}</Text>
            {change !== null && (
              <View style={[styles.changeChip, isPositive ? styles.changeChipPositive : styles.changeChipNegative]}>
                <Icon2 name={isPositive ? 'trending-up' : 'trending-down'} size={responsiveFontSize(1.6)} color="#fff" />
              </View>
            )}
          </View>

          {touchedPrice !== null ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <Text style={[styles.touchedTimeText, { color: darkMode ? '#AAA' : '#666' }]}>{touchedTime}</Text>
              <TouchableOpacity onPress={resetTouch} style={[styles.resetButton, { backgroundColor: darkMode ? '#2A2A2A' : '#F0F0F0' }]}>
                <Text style={[styles.resetButtonText, { color: darkMode ? '#AAA' : '#666' }]}>Reset</Text>
              </TouchableOpacity>
            </View>
          ) : change !== null && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <Text style={[styles.changeText, isPositive ? styles.positiveText : styles.negativeText]}>
                {isPositive ? '+' : ''}{currency}{formatPrice(Math.abs(change))}
              </Text>
              <View style={[styles.periodBadge, { backgroundColor: darkMode ? '#2A2A2A' : '#F0F0F0' }]}>
                <Text style={[styles.periodBadgeText, { color: darkMode ? '#AAA' : '#666' }]}>{TIME_PERIODS[selectedPeriod].label}</Text>
              </View>
            </View>
          )}

          {['1m', '2m', '3m', '5m', '15m', '30m', '1h'].includes(TIME_PERIODS[selectedPeriod].label) && touchedPrice === null && !loading && (
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live • {isCommoditiesScreen ? 'MCX' : selectedExchange}</Text>
            </View>
          )}
        </View>

        {/* Zone 3 — Chart */}
        <View style={[styles.chartContainer, { backgroundColor: theme.card }]}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: darkMode ? '#AAA' : '#666' }]}>Loading chart...</Text>
            </View>
          ) : error ? (
            <View style={styles.loadingContainer}>
              <Icon3 name="alert-circle" size={40} color="#FF5252" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchStockData}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : chartData.length > 0 ? (
            <WebView
              ref={webViewRef}
              source={{ html: getChartHTML(darkMode) }}
              style={[styles.webview, { backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF' }]}
              javaScriptEnabled domStorageEnabled scrollEnabled={false}
              onMessage={handleWebViewMessage}
            />
          ) : (
            <View style={styles.loadingContainer}>
              <Icon3 name="alert-circle" size={40} color="#FFB020" />
              <Text style={styles.errorText}>No chart data available</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchStockData}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Period Selector */}
        <View style={[styles.periodContainer, { backgroundColor: theme.card }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.periodScrollContent}>
            {TIME_PERIODS.map((p, i) => (
              <TouchableOpacity
                key={p.label}
                style={[styles.periodButton, { borderColor: darkMode ? '#333' : '#E0E0E0' }, selectedPeriod === i && styles.periodButtonActive]}
                onPress={() => handlePeriodChange(i)}
              >
                <Text style={[styles.periodText, { color: darkMode ? '#888' : '#666' }, selectedPeriod === i && styles.periodTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Zone 4 — Overview */}
        <View style={[styles.overviewContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.overviewTitle, { color: theme.text, borderBottomColor: darkMode ? '#333' : '#E0E0E0' }]}>Overview</Text>
          {stockInfo && (
            <View style={styles.statsGrid}>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Icon3 name="circle-outline" size={20} color="#00C087" />
                  <Text style={[styles.statLabel, { color: darkMode ? '#AAA' : '#666' }]}>Open</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>{currency}{formatPrice(stockInfo.open)}</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon3 name="arrow-up-circle-outline" size={20} color="#00C087" />
                  <Text style={[styles.statLabel, { color: darkMode ? '#AAA' : '#666' }]}>High</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>{currency}{formatPrice(stockInfo.high)}</Text>
                </View>
              </View>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Icon3 name="arrow-down-circle-outline" size={20} color="#FF5252" />
                  <Text style={[styles.statLabel, { color: darkMode ? '#AAA' : '#666' }]}>Low</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>{currency}{formatPrice(stockInfo.low)}</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon3 name="chart-bar" size={20} color="#4A90E2" />
                  <Text style={[styles.statLabel, { color: darkMode ? '#AAA' : '#666' }]}>Volume</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>{formatVolume(stockInfo.volume)}</Text>
                </View>
              </View>
              <View style={[styles.divider, { backgroundColor: darkMode ? '#333' : '#E0E0E0' }]} />
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Icon3 name="trending-up" size={20} color="#FFB020" />
                  <Text style={[styles.statLabel, { color: darkMode ? '#AAA' : '#666' }]}>52W High</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>{currency}{formatPrice(stockInfo.fiftyTwoWeekHigh)}</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon3 name="trending-down" size={20} color="#FFB020" />
                  <Text style={[styles.statLabel, { color: darkMode ? '#AAA' : '#666' }]}>52W Low</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>{currency}{formatPrice(stockInfo.fiftyTwoWeekLow)}</Text>
                </View>
              </View>
              {stockInfo.marketCap && (
                <View style={styles.statRowSingle}>
                  <View style={styles.statItemLarge}>
                    <Icon3 name="domain" size={20} color="#7C3AED" />
                    <Text style={[styles.statLabel, { color: darkMode ? '#AAA' : '#666' }]}>Market Cap</Text>
                    <Text style={[styles.statValueLarge, { color: theme.text }]}>{formatVolume(stockInfo.marketCap)}</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

      </ScrollView>


      {/* Options Bottom Sheet */}
      <RBSheet
        ref={optionsSheetRef}
        height={isLandscape ? hp('70%') : hp('85%')}
        customStyles={{
          wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
          container: { borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: darkMode ? '#111' : '#F5F5F5' },
        }}
      >
        <View style={[styles.sheetContainer, { backgroundColor: darkMode ? '#111' : '#F5F5F5' }]}>
          <View style={[styles.sheetHeader, { backgroundColor: theme.card, borderBottomColor: darkMode ? '#333' : '#ECECEC' }]}>
            <View>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>Options Chain</Text>
              <Text style={[styles.sheetSubtitle, { color: darkMode ? '#AAA' : '#666' }]}>{name} • Spot: {currency}{formatPrice(price)}</Text>
            </View>
            <TouchableOpacity onPress={() => optionsSheetRef.current?.close()} style={[styles.closeButton, { backgroundColor: darkMode ? '#2A2A2A' : '#F5F5F5' }]}>
              <Icon2 name="x" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          <View style={[styles.filterRow, { backgroundColor: theme.card, borderBottomColor: darkMode ? '#333' : '#ECECEC' }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {expiryDates.map(exp => (
                <TouchableOpacity
                  key={exp}
                  style={[styles.expiryChip, { backgroundColor: darkMode ? '#1A1A1A' : '#F5F5F5', borderColor: darkMode ? '#444' : '#E0E0E0' }, selectedExpiry === exp && styles.expiryChipActive]}
                  onPress={() => setSelectedExpiry(exp)}
                >
                  <Text style={[styles.expiryChipText, { color: darkMode ? '#AAA' : '#666' }, selectedExpiry === exp && styles.expiryChipTextActive]}>
                    {new Date(exp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={[styles.tableHeader, { backgroundColor: theme.card, borderBottomColor: darkMode ? '#333' : '#ECECEC' }]}>
            <View style={styles.headerSection}>
              <Text style={[styles.headerTitle, { color: darkMode ? '#666' : '#999' }]}>OI</Text>
              <Text style={[styles.headerTitle, { color: darkMode ? '#666' : '#999' }]}>LTP</Text>
            </View>
            <View style={styles.headerCenter}>
              <Text style={[styles.headerTitleStrike, { color: darkMode ? '#888' : '#666' }]}>Strike</Text>
            </View>
            <View style={styles.headerSection}>
              <Text style={[styles.headerTitle, { color: darkMode ? '#666' : '#999' }]}>LTP</Text>
              <Text style={[styles.headerTitle, { color: darkMode ? '#666' : '#999' }]}>OI</Text>
            </View>
          </View>
          {optionsLoading ? (
            <View style={styles.sheetLoading}><ActivityIndicator size="large" color={colors.primary} /></View>
          ) : optionsError ? (
            <View style={styles.sheetLoading}>
              <Icon3 name="alert-circle" size={40} color="#FF5252" />
              <Text style={styles.errorText}>{optionsError}</Text>
            </View>
          ) : (
            <FlatList data={getFilteredOptions()} renderItem={renderOptionRow} keyExtractor={(_, i) => i.toString()} contentContainerStyle={styles.optionsList} />
          )}
        </View>
      </RBSheet>

      {/* Watchlist Modal */}
      <Modal visible={addWatchlistModalVisible} transparent animationType="fade" onRequestClose={() => setAddWatchlistModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Add to Watchlist</Text>
              <TouchableOpacity onPress={() => setAddWatchlistModalVisible(false)}>
                <Icon2 name="x" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={Object.entries(watchlists)}
              renderItem={renderWatchlistOption}
              keyExtractor={([n]) => n}
              scrollEnabled={Object.keys(watchlists).length > 3}
              style={styles.watchlistList}
              nestedScrollEnabled
            />
            <TouchableOpacity
              style={[styles.createNewWatchlistButton, { borderTopColor: darkMode ? '#333' : '#e5e7eb' }]}
              onPress={() => { setAddWatchlistModalVisible(false); navigation.navigate('MyWatchlists'); }}
            >
              <Icon5 name="plus" size={18} color={colors.primary} />
              <Text style={styles.createNewWatchlistText}>Create New Watchlist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Alert Modal */}
      <AlertModal
        visible={alertModalVisible}
        onClose={() => setAlertModalVisible(false)}
        symbol={symbol}
        name={name}
        currentPrice={price}
        currentVolume={stockInfo?.volume}
      />
    </View>
  );
}

// ─── SCALPING STYLES ──────────────────────────────────────────────────────────
const scalpingStyles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'column', backgroundColor: '#000000' },
  topPane: { flex: 0.44, flexDirection: 'column', backgroundColor: '#000000' },
  bottomPane: { flex: 0.56, backgroundColor: '#FFFFFF' },
  rootLandscape: { flex: 1, flexDirection: 'row', backgroundColor: '#000000' },
  leftPane: { flex: 0.50, flexDirection: 'column', backgroundColor: '#000000' },
  rightPane: { flex: 0.50, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#000000', borderBottomWidth: 1, borderBottomColor: '#1A1A1A', gap: 8 },
  headerLandscape: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6, backgroundColor: '#000000', borderBottomWidth: 1, borderBottomColor: '#1A1A1A', gap: 6 },
  backBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  headerSymbol: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  headerPrice: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  headerChange: { fontSize: 11, fontWeight: '600' },
  headerRight: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  headerBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  periodRow: { backgroundColor: '#000000', borderTopWidth: 1, borderTopColor: '#1A1A1A' },
  periodChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#2A2A2A', backgroundColor: '#1A1A1A' },
  periodChipActive: { backgroundColor: '#1565C0', borderColor: '#1E88E5' },
  periodChipTxt: { fontSize: 11, fontWeight: '700', color: '#666' },
  periodChipTxtActive: { color: '#FFFFFF' },
  divider: { height: 14, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E0E0E0' },
  dividerPill: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#CCCCCC' },
  dividerVertical: { width: 14, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#E0E0E0' },
  dividerVerticalPill: { width: 4, height: 36, borderRadius: 2, backgroundColor: '#CCCCCC' },
});

// ─── MAIN STYLES ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollView: { flex: 1 },
  container: { paddingBottom: hp('12%') },
  firstPart: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, paddingTop: 16, backgroundColor: '#fff', borderBottomWidth: 0.5, borderColor: '#EBEBEB' },
  headerSymbolLabel: { flex: 1, fontSize: responsiveFontSize(1.9), fontWeight: '700', color: '#1A1A1A', textAlign: 'center', marginHorizontal: 8 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: '#EBEBEB' },
  iconButtonActive: { backgroundColor: '#1A1A1A' },
  header: { padding: 12, backgroundColor: '#fff', marginBottom: 8 },
  exchangeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  exchangeBadge: { backgroundColor: '#F0F0F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 2, borderColor: '#F0F0F0' },
  exchangeBadgeActive: { backgroundColor: colors.primary, borderColor: '#004aad' },
  exchangeBadgeText: { fontSize: 12, fontWeight: '700', color: '#666' },
  exchangeBadgeTextActive: { color: '#fff' },
  optionbtn: { borderWidth: 1, borderColor: '#000', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  optionBtnText: { fontSize: 12, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: '600', color: '#000', marginBottom: 8, marginTop: 6 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  price: { fontSize: 30, fontWeight: '800', color: '#000' },
  changeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  changeChipPositive: { backgroundColor: '#00C087' },
  changeChipNegative: { backgroundColor: '#FF5252' },
  touchedTimeText: { fontSize: 14, color: '#666' },
  resetButton: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#F0F0F0', borderRadius: 6 },
  resetButtonText: { fontSize: 12, color: '#666', fontWeight: '600' },
  changeText: { fontSize: 14, fontWeight: '600' },
  positiveText: { color: '#00C087' },
  negativeText: { color: '#FF5252' },
  periodBadge: { backgroundColor: '#F0F0F0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  periodBadgeText: { fontSize: 12, color: '#666', fontWeight: '600' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00C087' },
  liveText: { fontSize: 12, color: '#00C087', fontWeight: '600' },
  chartContainer: { height: responsiveHeight(40), backgroundColor: '#fff', marginHorizontal: 8, borderRadius: 12, overflow: 'hidden', marginBottom: 8 },
  webview: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  errorText: { fontSize: 16, color: '#FF5252', textAlign: 'center', marginTop: 12 },
  retryButton: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#004aad', borderRadius: 8 },
  retryButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  periodContainer: { paddingHorizontal: 8, marginBottom: 8, backgroundColor: '#fff' },
  periodScrollContent: { paddingVertical: 12, gap: 8 },
  periodButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E0E0E0' },
  periodButtonActive: { backgroundColor: '#004aad', borderColor: '#004aad' },
  periodText: { fontSize: 14, color: '#666', fontWeight: '600' },
  periodTextActive: { color: '#fff' },
  overviewContainer: { backgroundColor: '#fff', marginHorizontal: 8, borderRadius: 12, padding: 8, marginBottom: 16 },
  overviewTitle: { fontSize: responsiveFontSize(1.9), fontWeight: '700', color: '#000', marginBottom: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  statsGrid: { gap: 12 },
  statRow: { flexDirection: 'row', gap: 16 },
  statRowSingle: { flexDirection: 'row' },
  statItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  statItemLarge: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  statLabel: { flex: 1, fontSize: 14, color: '#666', fontWeight: '500' },
  statValue: { fontSize: 14, fontWeight: '600', color: '#000', textAlign: 'right' },
  statValueLarge: { fontSize: 16, fontWeight: '700', color: '#000', textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 8 },
  footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: responsiveWidth(4), paddingVertical: responsiveHeight(1.5), borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  actionButton: { flex: 1, flexDirection: 'row', padding: responsiveHeight(2), alignItems: 'center', justifyContent: 'center', paddingVertical: responsiveHeight(2), borderRadius: 12, marginHorizontal: responsiveWidth(1) },
  buyButton: { backgroundColor: colors.success },
  sellButton: { backgroundColor: '#FF5252' },
  actionButtonText: { color: '#fff', fontSize: 18, fontWeight: '700', marginHorizontal: 8 },
  sheetContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ECECEC' },
  sheetTitle: { fontSize: 20, fontWeight: '700' },
  sheetSubtitle: { fontSize: 12, color: '#666', marginTop: 4 },
  closeButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  filterRow: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#ECECEC' },
  expiryChip: { paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, borderRadius: 6, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E0E0E0' },
  expiryChipActive: { backgroundColor: '#000', borderColor: '#000' },
  expiryChipText: { fontSize: 12, fontWeight: '600', color: '#666' },
  expiryChipTextActive: { color: '#fff' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 12, borderBottomWidth: 2, borderBottomColor: '#ECECEC' },
  headerSection: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  headerCenter: { width: 80, alignItems: 'center' },
  headerTitle: { fontSize: 10, fontWeight: '600', color: '#999' },
  headerTitleStrike: { fontSize: 10, fontWeight: '700', color: '#666' },
  sheetLoading: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  optionsList: { paddingHorizontal: 12, paddingTop: 4, paddingBottom: 32 },
  optionRow: { flexDirection: 'row', marginBottom: 1, backgroundColor: '#fff', minHeight: 60, alignItems: 'center' },
  optionCell: { flex: 1, paddingVertical: 8, paddingHorizontal: 12, justifyContent: 'center' },
  callCell: { alignItems: 'flex-start', borderRightWidth: 1, borderRightColor: '#F5F5F5' },
  putCell: { alignItems: 'flex-end', borderLeftWidth: 1, borderLeftColor: '#F5F5F5' },
  oiText: { fontSize: 12, color: '#999', fontWeight: '500', marginBottom: 4 },
  ltpSection: { alignItems: 'flex-start' },
  ltpValue: { fontSize: 14, fontWeight: '700', color: '#000' },
  changePercent: { fontSize: 10, fontWeight: '600' },
  positiveChange: { color: '#00C853' },
  negativeChange: { color: '#FF5252' },
  noDataCell: { fontSize: 14, color: '#DDD', textAlign: 'center' },
  strikeColumn: { width: 80, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#F5F5F5' },
  strikeColumnATM: { backgroundColor: '#5D4FB5' },
  strikePrice: { fontSize: 14, fontWeight: '700', color: '#333' },
  strikePriceATM: { color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: wp(4) },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: wp(5), maxHeight: hp(70), width: '100%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(2) },
  modalTitle: { fontSize: responsiveFontSize(2.2), fontWeight: '700', color: '#1f2937' },
  watchlistList: { maxHeight: hp(40), marginBottom: hp(1) },
  watchlistOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: hp(1.5), paddingHorizontal: wp(3), borderRadius: 10, backgroundColor: '#f9fafb', marginBottom: hp(1), gap: 12 },
  watchlistOptionText: { fontSize: responsiveFontSize(1.8), color: '#1f2937', fontWeight: '500', flex: 1 },
  createNewWatchlistButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: hp(1.5), borderTopWidth: 1, borderTopColor: '#e5e7eb', marginTop: hp(1) },
  createNewWatchlistText: { fontSize: responsiveFontSize(1.7), fontWeight: '600', color: colors.primary },
  exchangeAndOptionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
});