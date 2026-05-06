import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    StatusBar,
    Animated,
} from 'react-native';

// ── Theme ─────────────────────────────────────────────────────────────────────
const C = {
    bg:           '#0A0A0F',
    surface:      '#12121A',
    card:         '#1A1A26',
    cardBorder:   '#2A2A3A',
    accent:       '#4F6EF7',
    accentSoft:   '#4F6EF720',
    green:        '#00D4A3',
    greenSoft:    '#00D4A320',
    red:          '#FF4C6A',
    redSoft:      '#FF4C6A20',
    amber:        '#FFB830',
    amberSoft:    '#FFB83020',
    purple:       '#A855F7',
    purpleSoft:   '#A855F720',
    textPrimary:  '#F0F0FF',
    textSecondary:'#7070A0',
    textMuted:    '#40405A',
    divider:      '#1E1E2E',
};

// ── Mock Data ─────────────────────────────────────────────────────────────────
const ACTIVE_ALERTS = [
    {
        id: 1,
        symbol: 'NIFTY 50',
        exchange: 'NSE',
        condition: 'price_above',
        conditionLabel: 'Price Above',
        value: '24,500',
        note: 'Breakout zone',
        createdAt: '05 May, 09:15',
        active: true,
        color: C.green,
    },
    {
        id: 2,
        symbol: 'RELIANCE',
        exchange: 'NSE',
        condition: 'price_below',
        conditionLabel: 'Price Below',
        value: '2,850',
        note: 'Stop loss level',
        createdAt: '04 May, 14:30',
        active: true,
        color: C.red,
    },
    {
        id: 3,
        symbol: 'GOLD',
        exchange: 'MCX',
        condition: 'percent_up',
        conditionLabel: '% Change Up',
        value: '+2.5%',
        note: '',
        createdAt: '03 May, 11:00',
        active: false,
        color: C.amber,
    },
    {
        id: 4,
        symbol: 'BANKNIFTY',
        exchange: 'NSE',
        condition: 'price_above',
        conditionLabel: 'Price Above',
        value: '52,000',
        note: 'Weekly resistance',
        createdAt: '02 May, 16:45',
        active: true,
        color: C.green,
    },
];

const TRIGGERED_ALERTS = [
    {
        id: 5,
        symbol: 'TCS',
        exchange: 'NSE',
        conditionLabel: 'Price Above',
        value: '3,900',
        triggeredAt: '01 May, 10:22',
        color: C.green,
    },
    {
        id: 6,
        symbol: 'CRUDE OIL',
        exchange: 'MCX',
        conditionLabel: 'Price Below',
        value: '6,200',
        triggeredAt: '30 Apr, 15:05',
        color: C.red,
    },
];

// ── Condition Icons (text-based) ──────────────────────────────────────────────
const CONDITION_ICONS = {
    price_above: '↑',
    price_below: '↓',
    percent_up:  '%',
    percent_down:'%',
    default:     '~',
};

// ── Alert Card ────────────────────────────────────────────────────────────────
function AlertCard({ item, onToggle, onDelete }) {
    return (
        <View style={[styles.card, { borderLeftColor: item.color }]}>
            {/* Top row */}
            <View style={styles.cardTop}>
                <View style={styles.cardLeft}>
                    <View style={[styles.conditionBadge, { backgroundColor: item.color + '20' }]}>
                        <Text style={[styles.conditionIcon, { color: item.color }]}>
                            {CONDITION_ICONS[item.condition] ?? CONDITION_ICONS.default}
                        </Text>
                    </View>
                    <View>
                        <View style={styles.symbolRow}>
                            <Text style={styles.cardSymbol}>{item.symbol}</Text>
                            <View style={styles.exchangePill}>
                                <Text style={styles.exchangeText}>{item.exchange}</Text>
                            </View>
                        </View>
                        <Text style={styles.conditionLabel}>{item.conditionLabel}</Text>
                    </View>
                </View>

                <View style={styles.cardActions}>
                    <Switch
                        value={item.active}
                        onValueChange={() => onToggle(item.id)}
                        trackColor={{ false: C.cardBorder, true: C.accent + '80' }}
                        thumbColor={item.active ? C.accent : C.textMuted}
                        style={{ transform: [{ scale: 0.8 }] }}
                    />
                    <TouchableOpacity
                        onPress={() => onDelete(item.id)}
                        style={styles.deleteBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Text style={styles.deleteBtnText}>✕</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Value */}
            <View style={styles.cardValueRow}>
                <Text style={[styles.cardValue, { color: item.color }]}>₹{item.value}</Text>
                {item.note ? (
                    <View style={styles.notePill}>
                        <Text style={styles.noteText}>📝 {item.note}</Text>
                    </View>
                ) : null}
            </View>

            {/* Footer */}
            <Text style={styles.cardDate}>Created {item.createdAt}</Text>
        </View>
    );
}

// ── Triggered Card ────────────────────────────────────────────────────────────
function TriggeredCard({ item }) {
    return (
        <View style={[styles.card, { borderLeftColor: C.textMuted, opacity: 0.8 }]}>
            <View style={styles.cardTop}>
                <View style={styles.cardLeft}>
                    <View style={[styles.conditionBadge, { backgroundColor: C.textMuted + '20' }]}>
                        <Text style={[styles.conditionIcon, { color: C.textMuted }]}>✓</Text>
                    </View>
                    <View>
                        <View style={styles.symbolRow}>
                            <Text style={styles.cardSymbol}>{item.symbol}</Text>
                            <View style={styles.exchangePill}>
                                <Text style={styles.exchangeText}>{item.exchange}</Text>
                            </View>
                        </View>
                        <Text style={styles.conditionLabel}>{item.conditionLabel}</Text>
                    </View>
                </View>
                <View style={[styles.triggeredBadge]}>
                    <Text style={styles.triggeredBadgeText}>TRIGGERED</Text>
                </View>
            </View>
            <View style={styles.cardValueRow}>
                <Text style={[styles.cardValue, { color: C.textSecondary }]}>₹{item.value}</Text>
            </View>
            <Text style={styles.cardDate}>Triggered {item.triggeredAt}</Text>
        </View>
    );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ tab }) {
    return (
        <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>{tab === 'triggered' ? '🔕' : '🔔'}</Text>
            <Text style={styles.emptyTitle}>
                {tab === 'triggered' ? 'No triggered alerts' : 'No active alerts'}
            </Text>
            <Text style={styles.emptySubtitle}>
                {tab === 'triggered'
                    ? 'Your triggered alerts will appear here'
                    : 'Tap + to create your first alert'}
            </Text>
        </View>
    );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
const TABS = ['ACTIVE', 'TRIGGERED'];

export default function AlertScreen() {
    const [activeTab, setActiveTab] = useState('ACTIVE');
    const [alerts, setAlerts] = useState(ACTIVE_ALERTS);
    const maxTriggers = 20;
    const usedTriggers = alerts.filter(a => a.active).length;

    const toggleAlert = (id) => {
        setAlerts(prev =>
            prev.map(a => a.id === id ? { ...a, active: !a.active } : a)
        );
    };

    const deleteAlert = (id) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    const progressPercent = (usedTriggers / maxTriggers) * 100;

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor={C.bg} />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Alerts</Text>
                    <Text style={styles.headerSub}>Manage your price alerts</Text>
                </View>
                <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
                    <Text style={styles.addBtnText}>＋</Text>
                </TouchableOpacity>
            </View>

            {/* Trigger counter */}
            <View style={styles.counterCard}>
                <View style={styles.counterTop}>
                    <View style={styles.counterLeft}>
                        <View style={styles.counterDot} />
                        <Text style={styles.counterLabel}>Triggers Active</Text>
                    </View>
                    <Text style={styles.counterValue}>
                        <Text style={{ color: C.accent }}>{usedTriggers}</Text>
                        <Text style={{ color: C.textMuted }}>/{maxTriggers}</Text>
                    </Text>
                </View>
                {/* Progress bar */}
                <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
                {TABS.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={styles.tabBtn}
                        onPress={() => setActiveTab(tab)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                            {tab}
                            {tab === 'ACTIVE' && alerts.length > 0 && (
                                <Text style={styles.tabBadge}> {alerts.length}</Text>
                            )}
                        </Text>
                        {activeTab === tab && <View style={styles.tabUnderline} />}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === 'ACTIVE' && (
                    alerts.length === 0
                        ? <EmptyState tab="active" />
                        : alerts.map(item => (
                            <AlertCard
                                key={item.id}
                                item={item}
                                onToggle={toggleAlert}
                                onDelete={deleteAlert}
                            />
                        ))
                )}

                {activeTab === 'TRIGGERED' && (
                    TRIGGERED_ALERTS.length === 0
                        ? <EmptyState tab="triggered" />
                        : TRIGGERED_ALERTS.map(item => (
                            <TriggeredCard key={item.id} item={item} />
                        ))
                )}
            </ScrollView>
        </View>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: C.bg,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: C.textPrimary,
        letterSpacing: -0.5,
    },
    headerSub: {
        fontSize: 12,
        color: C.textSecondary,
        marginTop: 2,
    },
    addBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: C.accent,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: C.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    addBtnText: {
        fontSize: 22,
        color: '#fff',
        lineHeight: 26,
        fontWeight: '300',
    },

    // Counter card
    counterCard: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: C.surface,
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: C.cardBorder,
    },
    counterTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    counterLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    counterDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: C.accent,
        shadowColor: C.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    counterLabel: {
        fontSize: 13,
        color: C.textSecondary,
        fontWeight: '500',
    },
    counterValue: {
        fontSize: 15,
        fontWeight: '700',
    },
    progressBg: {
        height: 4,
        backgroundColor: C.cardBorder,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: C.accent,
        borderRadius: 2,
    },

    // Tabs
    tabRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 16,
        gap: 24,
    },
    tabBtn: {
        paddingBottom: 8,
        position: 'relative',
    },
    tabText: {
        fontSize: 13,
        fontWeight: '700',
        color: C.textMuted,
        letterSpacing: 0.8,
    },
    tabTextActive: {
        color: C.textPrimary,
    },
    tabBadge: {
        color: C.accent,
        fontWeight: '800',
    },
    tabUnderline: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: C.accent,
        borderRadius: 1,
    },

    // Scroll
    scroll: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
        gap: 10,
    },

    // Alert Card
    card: {
        backgroundColor: C.card,
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: C.cardBorder,
        borderLeftWidth: 3,
        marginBottom: 2,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    conditionBadge: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    conditionIcon: {
        fontSize: 16,
        fontWeight: '800',
    },
    symbolRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2,
    },
    cardSymbol: {
        fontSize: 15,
        fontWeight: '700',
        color: C.textPrimary,
        letterSpacing: -0.3,
    },
    exchangePill: {
        backgroundColor: C.cardBorder,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    exchangeText: {
        fontSize: 9,
        fontWeight: '700',
        color: C.textSecondary,
        letterSpacing: 0.5,
    },
    conditionLabel: {
        fontSize: 11,
        color: C.textSecondary,
        fontWeight: '500',
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    deleteBtn: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: C.redSoft,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteBtnText: {
        fontSize: 11,
        color: C.red,
        fontWeight: '700',
    },
    cardValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    cardValue: {
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    notePill: {
        backgroundColor: C.surface,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: C.cardBorder,
    },
    noteText: {
        fontSize: 11,
        color: C.textSecondary,
    },
    cardDate: {
        fontSize: 11,
        color: C.textMuted,
    },

    // Triggered
    triggeredBadge: {
        backgroundColor: C.textMuted + '20',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    triggeredBadgeText: {
        fontSize: 9,
        fontWeight: '800',
        color: C.textMuted,
        letterSpacing: 1,
    },

    // Empty
    emptyWrap: {
        alignItems: 'center',
        paddingTop: 60,
        gap: 10,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 4,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: C.textPrimary,
    },
    emptySubtitle: {
        fontSize: 13,
        color: C.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});