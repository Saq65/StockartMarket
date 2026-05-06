import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colours';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

const MENU_ITEMS = [
    { icon: 'home', label: 'Home', screen: 'Home' },
    { icon: 'favorite', label: 'Watchlist', screen: 'Watchlist' },
    { icon: 'search', label: 'Screener', screen: 'Screener' },
    { icon: 'article', label: 'News', screen: 'News' },
    { icon: 'notifications', label: 'Alerts', screen: 'Alerts' },
    { icon: 'bar-chart', label: 'Charts', screen: 'Chart' },
];

const BOTTOM_ITEMS = [
    { icon: 'settings', label: 'Settings' },
    { icon: 'help-outline', label: 'Help & Support' },
    { icon: 'logout', label: 'Logout' },
];

export default function Header() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;
    const insets = useSafeAreaInsets();
    const navigation =  useNavigation();
    
    const openDrawer = () => {
        setDrawerOpen(true);
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 280,
                useNativeDriver: true,
            }),
            Animated.timing(overlayAnim, {
                toValue: 1,
                duration: 280,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeDrawer = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -DRAWER_WIDTH,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(overlayAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => setDrawerOpen(false));
    };

    const handleNavigate = screen => {
        closeDrawer();
        if (navigation) {
            setTimeout(() => navigation.navigate(screen), 250);
        }
    };

    return (
        <>
            {/* ── Main Header ── */}
            <View style={styles.header}>
                <TouchableOpacity onPress={openDrawer} style={styles.menuBtn}>
                    <Icon name="menu" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.centerInfo}>
                    <Text style={styles.headerGreet}>Good Morning 👋</Text>
                    <Text style={styles.headerTitle}>Stockart Market</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Notification')} style={styles.notifBtn}>
                    <Icon name="notifications-none" size={22} color={Colors.textPrimary} />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>3</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* ── Drawer Overlay + Panel ── */}
            {drawerOpen && (
                <>
                    {/* Dark overlay */}
                    <TouchableWithoutFeedback onPress={closeDrawer}>
                        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
                    </TouchableWithoutFeedback>

                    {/* Drawer panel */}
                    <Animated.View
                        style={[
                            styles.drawer,
                            {
                                transform: [{ translateX: slideAnim }],
                                paddingTop: insets.top + 12,
                                paddingBottom: insets.bottom + 16,
                            },
                        ]}>

                        {/* Drawer Header */}
                        <View style={styles.drawerHeader}>
                            <View style={styles.avatarCircle}>
                                <Text style={styles.avatarText}>S</Text>
                            </View>
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={styles.drawerName}>saqlain shaikh</Text>
                                <Text style={styles.drawerEmail}>saqlain@stockart.in</Text>
                            </View>
                            <TouchableOpacity onPress={closeDrawer}>
                                <Icon name="close" size={22} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Premium badge */}
                        <TouchableOpacity style={styles.premiumBadge}>
                            <Icon name="workspace-premium" size={16} color="#FFD700" />
                            <Text style={styles.premiumText}>Upgrade to Pro</Text>
                            <Icon name="arrow-forward-ios" size={12} color="#FFD700" />
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Menu items */}
                        <View style={styles.menuList}>
                            {MENU_ITEMS.map(item => (
                                <TouchableOpacity
                                    key={item.label}
                                    style={styles.menuItem}
                                    onPress={() => handleNavigate(item.screen)}
                                    activeOpacity={0.7}>
                                    <View style={styles.menuIconBox}>
                                        <Icon name={item.icon} size={20} color={Colors.primary} />
                                    </View>
                                    <Text style={styles.menuLabel}>{item.label}</Text>
                                    <Icon name="chevron-right" size={18} color={Colors.textMuted} style={{ marginLeft: 'auto' }} />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.divider} />

                        {/* Bottom items */}
                        <View style={styles.menuList}>
                            {BOTTOM_ITEMS.map(item => (
                                <TouchableOpacity
                                    key={item.label}
                                    style={styles.menuItem}
                                    activeOpacity={0.7}>
                                    <View style={[styles.menuIconBox, { backgroundColor: Colors.surface }]}>
                                        <Icon
                                            name={item.icon}
                                            size={20}
                                            color={item.label === 'Logout' ? Colors.red : Colors.textSecondary}
                                        />
                                    </View>
                                    <Text
                                        style={[
                                            styles.menuLabel,
                                            item.label === 'Logout' && { color: Colors.red },
                                        ]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* App version */}
                        <Text style={styles.version}>Stockart Market v1.0.0</Text>
                    </Animated.View>
                </>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    // ── Header ──
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: responsiveHeight(3),
        paddingBottom: responsiveHeight(2),
        backgroundColor: Colors.background,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.border,
    },
    menuBtn: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: Colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: Colors.border,
    },
    centerInfo: {
        flex: 1,
        alignItems: 'center',
    },
    headerGreet: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontFamily: 'Poppins-Bold',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    notifBtn: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: Colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: Colors.border,
    },
    badge: {
        position: 'absolute',
        top: -3,
        right: -3,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.red,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 9,
        color: '#fff',
        fontWeight: '700',
    },

    // ── Overlay ──
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 998,
    },

    // ── Drawer ──
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        backgroundColor: Colors.surface,
        zIndex: 999,
        borderRightWidth: 0.5,
        borderRightColor: Colors.border,
        elevation: 20,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    drawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    avatarCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    drawerName: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    drawerEmail: {
        fontSize: 12,
        color: Colors.textMuted,
        marginTop: 2,
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginHorizontal: 20,
        backgroundColor: '#2A2210',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 0.5,
        borderColor: '#FFD70044',
    },
    premiumText: {
        flex: 1,
        fontSize: 13,
        fontWeight: '600',
        color: '#FFD700',
    },
    divider: {
        height: 0.5,
        backgroundColor: Colors.border,
        marginHorizontal: 20,
        marginVertical: 14,
    },
    menuList: {
        paddingHorizontal: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 11,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 2,
        gap: 12,
    },
    menuIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: Colors.primary + '18',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    version: {
        fontSize: 11,
        color: Colors.textMuted,
        textAlign: 'center',
        marginTop: 'auto',
        paddingTop: 16,
    },
});