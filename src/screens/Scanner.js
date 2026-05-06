import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconC from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../theme/colours';
import Layout from '../layout/layout';

// ── Data ──
const RECENT_SCANS = [
  {id: '1', title: 'Bullish Golden Crossover (SMA)', tag: 'Bullish Breakout', tagColor: Colors.green, up: true},
  {id: '2', title: 'RSI Oversold Bounce', tag: 'Reversal Signal', tagColor: Colors.amber, up: true},
];

const POPULAR_SCANS = [
  {id: '1', title: 'Bullish Golden\nCrossover (SMA)', tag: 'Bullish Breakout', tagColor: Colors.green, up: true},
  {id: '2', title: 'Morning Star\nPattern', tag: 'Bullish', tagColor: Colors.green, up: true},
  {id: '3', title: 'Hammer\nCandle', tag: 'Bullish Reversal', tagColor: Colors.green, up: true},
  {id: '4', title: 'Bearish\nEngulfing', tag: 'Bearish', tagColor: Colors.red, up: false},
];

const RECOMMENDED_SCANS = [
  {id: '1', title: 'Sharp Price Gain on Large Vol', tag: 'Price-Vol Breakout, Bullish', tagColor: Colors.green, up: true},
  {id: '2', title: 'Sharp Fall in Price after a long Uptrend', tag: 'Bearish Trend Reversal', tagColor: Colors.red, up: false},
  {id: '3', title: 'MACD Bullish Crossover', tag: 'Momentum, Bullish', tagColor: Colors.green, up: true},
  {id: '4', title: 'Near 52 Week High Breakout', tag: 'Breakout, Bullish', tagColor: Colors.green, up: true},
];

const TUTORIALS = [
  {id: '1', title: 'Scanning for Breakouts\nNarrow Range strategy'},
  {id: '2', title: 'Scanning Breakout Strategies\nGap & Opening Range Breakout'},
  {id: '3', title: 'Scanning for 4 Avg\nVolume Strategies'},
];

const ALL_SCAN_CATEGORIES = [
  {id: '1', title: 'Price Scans', count: 26, icon: 'trending-up'},
  {id: '2', title: 'Volume Scans', count: 4, icon: 'bar-chart'},
  {id: '3', title: 'Breakout Scans', count: 5, icon: 'flash-on'},
  {id: '4', title: 'Intraday Scans', count: 6, icon: 'access-time'},
  {id: '5', title: 'Technical Scans', count: 90, icon: 'show-chart'},
  {id: '6', title: 'Combination Scans', count: 8, icon: 'merge-type'},
  {id: '7', title: 'Candlestick Pattern Scans', count: 21, icon: 'candlestick-chart'},
];

// ── Sub Components ──

function SectionHeader({title, showView, onView}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {showView && (
        <TouchableOpacity style={styles.viewBtn} onPress={onView}>
          <Text style={styles.viewBtnText}>VIEW</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function RecentCard({item}) {
  return (
    <TouchableOpacity style={styles.recentCard} activeOpacity={0.8}>
      <Text style={styles.scanCardTitle}>{item.title}</Text>
      <View style={styles.tagRow}>
        <View style={[styles.tagDot, {backgroundColor: item.tagColor}]} />
        <Text style={[styles.tagText, {color: item.tagColor}]}>{item.tag}</Text>
      </View>
    </TouchableOpacity>
  );
}

function PopularCard({item}) {
  return (
    <TouchableOpacity style={styles.popularCard} activeOpacity={0.8}>
      <Text style={styles.scanCardTitle}>{item.title}</Text>
      <View style={styles.tagRow}>
        <View style={[styles.tagDot, {backgroundColor: item.tagColor}]} />
        <Text style={[styles.tagText, {color: item.tagColor}]}>{item.tag}</Text>
      </View>
    </TouchableOpacity>
  );
}

function RecommendedCard({item}) {
  return (
    <TouchableOpacity style={styles.recommendedCard} activeOpacity={0.8}>
      <Text style={styles.scanCardTitle}>{item.title}</Text>
      <View style={styles.tagRow}>
        <View style={[styles.tagDot, {backgroundColor: item.tagColor}]} />
        <Text style={[styles.tagText, {color: item.tagColor}]}>{item.tag}</Text>
      </View>
    </TouchableOpacity>
  );
}

function TutorialCard({item}) {
  return (
    <TouchableOpacity style={styles.tutorialCard} activeOpacity={0.8}>
      {/* Fake chart bg lines */}
      <View style={styles.tutorialBg}>
        <IconC name="chart-line" size={40} color={'#ffffff10'} />
      </View>
      <View style={styles.tutorialContent}>
        <View style={styles.tutorialAccent} />
        <Text style={styles.tutorialText}>{item.title}</Text>
      </View>
      <View style={styles.ytBtn}>
        <Icon name="play-circle-filled" size={28} color={'#FF0000'} />
      </View>
    </TouchableOpacity>
  );
}

function AllScanRow({item}) {
  return (
    <TouchableOpacity style={styles.allScanRow} activeOpacity={0.8}>
      <View style={styles.allScanLeft}>
        <View style={styles.allScanIconBox}>
          <Icon name={item.icon} size={18} color={Colors.primary} />
        </View>
        <Text style={styles.allScanTitle}>{item.title}</Text>
        <View style={styles.allScanCountBadge}>
          <Text style={styles.allScanCount}>{item.count}</Text>
        </View>
      </View>
      <View style={styles.allScanArrow}>
        <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
}

// ── Main Screen ──
export default function ScreenerScreen() {
  const [activeTab, setActiveTab] = useState('foryou');

  return (
    <Layout scrollable={false}>

      {/* Top Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('foryou')}>
          <Text style={[styles.tabText, activeTab === 'foryou' && styles.tabTextActive]}>
            FOR YOU
          </Text>
          {activeTab === 'foryou' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('allscans')}>
          <Text style={[styles.tabText, activeTab === 'allscans' && styles.tabTextActive]}>
            ALL SCANS (160)
          </Text>
          {activeTab === 'allscans' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      {activeTab === 'foryou' ? (
        /* ── FOR YOU TAB ── */
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* RECENT */}
          <SectionHeader title="RECENT" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}>
            {RECENT_SCANS.map(item => (
              <RecentCard key={item.id} item={item} />
            ))}
          </ScrollView>

          {/* POPULAR */}
          <SectionHeader title="POPULAR" showView onView={() => {}} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}>
            {POPULAR_SCANS.map(item => (
              <PopularCard key={item.id} item={item} />
            ))}
          </ScrollView>

          {/* RECOMMENDED */}
          <SectionHeader title="RECOMMENDED" showView onView={() => {}} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}>
            {RECOMMENDED_SCANS.map(item => (
              <RecommendedCard key={item.id} item={item} />
            ))}
          </ScrollView>

          {/* TUTORIALS */}
          <SectionHeader title="TUTORIALS" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}>
            {TUTORIALS.map(item => (
              <TutorialCard key={item.id} item={item} />
            ))}
          </ScrollView>

          <View style={{height: 30}} />
        </ScrollView>
      ) : (
        /* ── ALL SCANS TAB ── */
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.allScansContainer}>
            {ALL_SCAN_CATEGORIES.map((item, idx) => (
              <View key={item.id}>
                <AllScanRow item={item} />
                {idx < ALL_SCAN_CATEGORIES.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
          <View style={{height: 30}} />
        </ScrollView>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  // ── Tabs ──
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    paddingHorizontal: 16,
  },
  tabItem: {
    marginRight: 24,
    paddingVertical: 14,
    position: 'relative',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: Colors.textPrimary,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },

  // ── Section Header ──
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
  },
  viewBtn: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  viewBtnText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // ── Horizontal Scroll ──
  hScroll: {
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 4,
  },

  // ── Recent Card ──
  recentCard: {
    width: 200,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },

  // ── Popular Card ──
  popularCard: {
    width: 160,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },

  // ── Recommended Card ──
  recommendedCard: {
    width: 180,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },

  scanCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },

  // ── Tutorial Card ──
  tutorialCard: {
    width: 190,
    height: 110,
    backgroundColor: '#1A1A2A',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.border,
    justifyContent: 'flex-end',
  },
  tutorialBg: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  tutorialContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 8,
  },
  tutorialAccent: {
    width: 3,
    height: '100%',
    minHeight: 36,
    backgroundColor: Colors.green,
    borderRadius: 2,
  },
  tutorialText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textPrimary,
    fontWeight: '500',
    lineHeight: 17,
  },
  ytBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },

  // ── All Scans ──
  allScansContainer: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  allScanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  allScanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  allScanIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary + '18',
    justifyContent: 'center',
    alignItems: 'center',
  },
  allScanTitle: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '400',
    flex: 1,
  },
  allScanCountBadge: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  allScanCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  allScanArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.border,
  },
});