import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colours';
import Layout from '../layout/layout';

const CATEGORIES = [
  { label: 'All', icon: 'view-grid' },
  { label: 'Market', icon: 'trending-up' },
  { label: 'Economy', icon: 'bank' },
  { label: 'Earnings', icon: 'cash' },
  { label: 'IPO', icon: 'rocket-launch' },
  { label: 'FII/DII', icon: 'swap-horizontal' },
  { label: 'Commodity', icon: 'gold' },
  { label: 'Crypto', icon: 'bitcoin' },
];

const NEWS_DATA = [
  {
    id: '1',
    category: 'Market',
    categoryIcon: 'trending-up',
    title: 'Sensex surges 600 points, Nifty reclaims 22,500 as bulls take charge',
    summary:
      'Indian equity markets rallied sharply on Monday led by banking and metal stocks. Broader markets also participated in the rally with midcap and smallcap indices gaining over 1%.',
    source: 'Economic Times',
    time: '15 min ago',
    isTop: true,
    bgColor: '#1B3A2D',
    iconColor: '#00C076',
    icon: 'trending-up',
  },
  {
    id: '2',
    category: 'Economy',
    categoryIcon: 'bank',
    title: 'RBI keeps repo rate unchanged at 6.5% for 7th consecutive time',
    summary:
      'The Reserve Bank of India monetary policy committee unanimously decided to keep the benchmark lending rate unchanged while maintaining its stance on withdrawal of accommodation.',
    source: 'Moneycontrol',
    time: '1h ago',
    isTop: true,
    bgColor: '#1A2A3F',
    iconColor: '#1B59F8',
    icon: 'bank',
  },
  {
    id: '3',
    category: 'Earnings',
    categoryIcon: 'cash',
    title: 'Tata Steel Q3 profit jumps 34% YoY to ₹3,430 crore on strong domestic demand',
    summary:
      'Tata Steel reported a 34% year-on-year jump in consolidated net profit for the third quarter, beating street estimates.',
    source: 'Business Standard',
    time: '2h ago',
    isTop: false,
    bgColor: '#2A1F1A',
    iconColor: '#F5A623',
    icon: 'cash-multiple',
  },
  {
    id: '4',
    category: 'FII/DII',
    categoryIcon: 'swap-horizontal',
    title: 'FIIs turn net buyers, pump ₹4,200 crore into Indian equities in single session',
    summary:
      'Foreign institutional investors turned net buyers of Indian equities after a brief selling spree.',
    source: 'Mint',
    time: '3h ago',
    isTop: false,
    bgColor: '#1A2A3F',
    iconColor: '#1B59F8',
    icon: 'swap-horizontal',
  },
  {
    id: '5',
    category: 'IPO',
    categoryIcon: 'rocket-launch',
    title: 'Hyundai India IPO subscribed 2.37x on Day 2, QIB portion fully booked',
    summary:
      'The much-awaited Hyundai Motor India IPO received strong response from institutional investors.',
    source: 'CNBC TV18',
    time: '4h ago',
    isTop: false,
    bgColor: '#1F1A2A',
    iconColor: '#9B59B6',
    icon: 'rocket-launch',
  },
  {
    id: '6',
    category: 'Commodity',
    categoryIcon: 'gold',
    title: 'Gold hits record high of ₹75,000 per 10 grams amid global uncertainty',
    summary:
      'Gold prices in India touched a new all-time high driven by safe haven demand amid rising geopolitical tensions.',
    source: 'Reuters',
    time: '5h ago',
    isTop: false,
    bgColor: '#2A2A1A',
    iconColor: '#F5A623',
    icon: 'gold',
  },
  {
    id: '7',
    category: 'Market',
    categoryIcon: 'trending-up',
    title: 'Reliance Industries shares hit 52-week high after strong Q3 results',
    summary:
      'Shares of Reliance Industries rose to a 52-week high after the company reported better-than-expected quarterly results.',
    source: 'Economic Times',
    time: '6h ago',
    isTop: false,
    bgColor: '#1B3A2D',
    iconColor: '#00C076',
    icon: 'oil',
  },
  {
    id: '8',
    category: 'Crypto',
    categoryIcon: 'bitcoin',
    title: 'Bitcoin crosses $65,000 mark, altcoins rally as crypto market heats up',
    summary:
      'Bitcoin surged past the $65,000 level for the first time in months, triggering a broad rally across the cryptocurrency market.',
    source: 'CoinDesk',
    time: '7h ago',
    isTop: false,
    bgColor: '#2A1F1A',
    iconColor: '#F5A623',
    icon: 'bitcoin',
  },
  {
    id: '9',
    category: 'Economy',
    categoryIcon: 'bank',
    title: "India's GDP growth forecast raised to 7.2% by IMF for FY25",
    summary:
      'The International Monetary Fund raised its growth forecast for India to 7.2% for the current fiscal year.',
    source: 'Bloomberg',
    time: '8h ago',
    isTop: false,
    bgColor: '#1A2A3F',
    iconColor: '#1B59F8',
    icon: 'earth',
  },
  {
    id: '10',
    category: 'Earnings',
    categoryIcon: 'cash',
    title: 'Infosys raises FY25 revenue guidance to 4.5-5% after strong Q3 show',
    summary:
      'IT major Infosys raised its revenue growth guidance for FY25 after posting a better-than-expected third quarter performance.',
    source: 'Moneycontrol',
    time: '9h ago',
    isTop: false,
    bgColor: '#1F1A2A',
    iconColor: '#9B59B6',
    icon: 'laptop',
  },
];

const MARKET_EVENTS = [
  { date: 'Today', event: 'RBI Policy Decision', time: '10:00 AM', tag: 'Economy', icon: 'bank' },
  { date: 'Tomorrow', event: 'Infosys Q4 Results', time: 'After Market', tag: 'Earnings', icon: 'cash-multiple' },
  { date: '10 May', event: 'CPI Inflation Data', time: '05:30 PM', tag: 'Economy', icon: 'chart-line' },
  { date: '15 May', event: 'Wipro Board Meeting', time: 'TBA', tag: 'Corporate', icon: 'account-group' },
];

function getTagColor(tag) {
  switch (tag) {
    case 'Economy': return Colors.amber;
    case 'Earnings': return Colors.green;
    case 'Corporate': return Colors.primary;
    default: return Colors.textSecondary;
  }
}

function getCategoryColor(cat) {
  switch (cat) {
    case 'Market': return Colors.green;
    case 'Economy': return Colors.primary;
    case 'Earnings': return Colors.amber;
    case 'IPO': return '#9B59B6';
    case 'FII/DII': return '#17A2B8';
    case 'Commodity': return Colors.amber;
    case 'Crypto': return '#F7931A';
    default: return Colors.primary;
  }
}

function TopNewsCard({ item }) {
  return (
    <TouchableOpacity style={styles.topCard} activeOpacity={0.85}>
      {/* Left colored accent */}
      <View style={[styles.topCardAccent, { backgroundColor: item.iconColor }]} />

      {/* Icon Box */}
      <View style={[styles.topIconBox, { backgroundColor: item.bgColor }]}>
        <Icon name={item.icon} size={24} color={item.iconColor} />
      </View>

      <View style={styles.topCardContent}>
        {/* Category badge */}
        <View style={[styles.catBadge, { backgroundColor: getCategoryColor(item.category) + '22' }]}>
          <Icon name={item.categoryIcon} size={10} color={getCategoryColor(item.category)} style={{ marginRight: 4 }} />
          <Text style={[styles.catBadgeText, { color: getCategoryColor(item.category) }]}>
            {item.category}
          </Text>
        </View>

        <Text style={styles.topCardTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.metaRow}>
          <Icon name="newspaper-variant" size={11} color={Colors.textMuted} style={{ marginRight: 4 }} />
          <Text style={styles.sourceName}>{item.source}</Text>
          <Text style={styles.metaDot}> · </Text>
          <Icon name="clock-outline" size={11} color={Colors.textMuted} style={{ marginRight: 3 }} />
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>

      <Icon name="chevron-right" size={18} color={Colors.textMuted} style={{ alignSelf: 'center' }} />
    </TouchableOpacity>
  );
}

function NewsCard({ item }) {
  return (
    <TouchableOpacity style={styles.newsCard} activeOpacity={0.85}>
      <View style={styles.newsCardLeft}>
        <View style={[styles.catBadge, { backgroundColor: getCategoryColor(item.category) + '22' }]}>
          <Icon name={item.categoryIcon} size={10} color={getCategoryColor(item.category)} style={{ marginRight: 4 }} />
          <Text style={[styles.catBadgeText, { color: getCategoryColor(item.category) }]}>
            {item.category}
          </Text>
        </View>

        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.newsSummary} numberOfLines={2}>
          {item.summary}
        </Text>

        <View style={styles.metaRow}>
          <Icon name="newspaper-variant" size={11} color={Colors.textMuted} style={{ marginRight: 4 }} />
          <Text style={styles.sourceName}>{item.source}</Text>
          <Text style={styles.metaDot}> · </Text>
          <Icon name="clock-outline" size={11} color={Colors.textMuted} style={{ marginRight: 3 }} />
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>

      <View style={[styles.newsIconBox, { backgroundColor: item.bgColor }]}>
        <Icon name={item.icon} size={22} color={item.iconColor} />
      </View>
    </TouchableOpacity>
  );
}

function EventCard({ item }) {
  return (
    <TouchableOpacity style={styles.eventCard} activeOpacity={0.85}>
      <View style={[styles.eventDateBox, { backgroundColor: getTagColor(item.tag) + '18' }]}>
        <Icon name="calendar" size={14} color={getTagColor(item.tag)} />
        <Text style={[styles.eventDate, { color: getTagColor(item.tag) }]}>{item.date}</Text>
      </View>

      <View style={styles.eventContent}>
        <View style={styles.eventRow}>
          <Icon name={item.icon} size={14} color={Colors.textSecondary} style={{ marginRight: 5 }} />
          <Text style={styles.eventName}>{item.event}</Text>
        </View>
        <View style={styles.eventTimeRow}>
          <Icon name="clock-outline" size={11} color={Colors.textMuted} style={{ marginRight: 4 }} />
          <Text style={styles.eventTime}>{item.time}</Text>
        </View>
      </View>

      <View style={[styles.eventTag, { backgroundColor: getTagColor(item.tag) + '22' }]}>
        <Text style={[styles.eventTagText, { color: getTagColor(item.tag) }]}>{item.tag}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NewsScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('news');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const filteredNews =
    activeCategory === 'All'
      ? NEWS_DATA
      : NEWS_DATA.filter(n => n.category === activeCategory);

  const topNews = filteredNews.filter(n => n.isTop);
  const restNews = filteredNews.filter(n => !n.isTop);

  return (
    <Layout>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <Icon name="newspaper-variant-multiple" size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.headerTitle}>News & Events</Text>
              <Text style={styles.headerSub}>Stay market informed</Text>
            </View>
          </View>
        
        </View>

        {/* Main Tabs */}
        <View style={styles.mainTabRow}>
          <TouchableOpacity
            style={[styles.mainTab, activeTab === 'news' && styles.mainTabActive]}
            onPress={() => setActiveTab('news')}>
            <Icon
              name="newspaper"
              size={15}
              color={activeTab === 'news' ? Colors.white : Colors.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.mainTabText, activeTab === 'news' && styles.mainTabTextActive]}>
              Latest News
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mainTab, activeTab === 'events' && styles.mainTabActive]}
            onPress={() => setActiveTab('events')}>
            <Icon
              name="calendar-month"
              size={15}
              color={activeTab === 'events' ? Colors.white : Colors.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.mainTabText, activeTab === 'events' && styles.mainTabTextActive]}>
              Market Events
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'news' ? (
          <>
            {/* Category Filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.label}
                  style={[styles.catChip, activeCategory === cat.label && styles.catChipActive]}
                  onPress={() => setActiveCategory(cat.label)}>
                  <Icon
                    name={cat.icon}
                    size={13}
                    color={activeCategory === cat.label ? Colors.white : Colors.textSecondary}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={[styles.catChipText, activeCategory === cat.label && styles.catChipTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
              }>

              {/* Top Stories */}
              {topNews.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Icon name="fire" size={18} color={Colors.red} style={{ marginRight: 6 }} />
                    <Text style={styles.sectionTitle}>Top Stories</Text>
                  </View>
                  {topNews.map(item => <TopNewsCard key={item.id} item={item} />)}
                </View>
              )}

              <View style={styles.divider} />

              {/* Latest Updates */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Icon name="lightning-bolt" size={18} color={Colors.amber} style={{ marginRight: 6 }} />
                  <Text style={styles.sectionTitle}>Latest Updates</Text>
                </View>
                {restNews.map(item => <NewsCard key={item.id} item={item} />)}
              </View>

              <View style={{ height: 30 }} />
            </ScrollView>
          </>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.eventsContainer}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="calendar-clock" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.sectionTitle}>Upcoming Events</Text>
              </View>
              {MARKET_EVENTS.map((item, idx) => <EventCard key={idx} item={item} />)}
            </View>
            <View style={{ height: 30 }} />
          </ScrollView>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary + '22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  mainTabRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  mainTab: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTabActive: {
    backgroundColor: Colors.primary,
  },
  mainTabText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  mainTabTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 14,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  catChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catChipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  catChipTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
    marginVertical: 16,
  },
  // Top News
  topCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: Colors.border,
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  topCardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 2,
  },
  topIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginLeft: 6,
  },
  topCardContent: {
    flex: 1,
  },
  topCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 7,
  },
  // Regular News
  newsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: Colors.border,
    gap: 12,
    alignItems: 'center',
  },
  newsCardLeft: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 19,
    marginBottom: 4,
  },
  newsSummary: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginBottom: 7,
  },
  newsIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceName: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  metaDot: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  timeText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  // Events
  eventsContainer: {
    paddingTop: 8,
    paddingBottom: 30,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: Colors.border,
    gap: 12,
  },
  eventDateBox: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 72,
    alignItems: 'center',
    gap: 3,
  },
  eventDate: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  eventContent: {
    flex: 1,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  eventName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  eventTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  eventTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  eventTagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});