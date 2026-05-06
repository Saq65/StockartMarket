import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconC from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../theme/colours';
import Layout from '../layout/layout';

const WATCHLISTS = ['Default', 'My List 1', 'My List 2'];

const INDICES = [
  {id: '1', symbol: 'NIFTY 50', price: '24,103.30', change: '105.75', percent: '0.44%', up: true},
  {id: '2', symbol: 'Gold', price: '4,577.96', change: '-35.96', percent: '-0.78%', up: false},
  {id: '3', symbol: 'USDINR', price: '94.949', change: '0.088', percent: '0.09%', up: true},
];

const CASH_STOCKS = [
  {id: '4', symbol: 'RELIANCE', price: '1460.80', change: '30.00', percent: '2.10%', up: true},
  {id: '5', symbol: 'SBIN', price: '1071.20', change: '2.75', percent: '0.26%', up: true},
  {id: '6', symbol: 'INFY', price: '1678.40', change: '-22.30', percent: '-1.31%', up: false},
  {id: '7', symbol: 'TCS', price: '3892.60', change: '-45.10', percent: '-1.14%', up: false},
];

const FNO_STOCKS = [
  {id: '8', symbol: 'Crude Oil\n18May', price: '9,826.00', change: '161.00', percent: '1.67%', up: true},
  {id: '9', symbol: 'BANKNIFTY\n18May', price: '52,340.00', change: '-120.50', percent: '-0.23%', up: false},
  {id: '10', symbol: 'NIFTY\n22May CE', price: '245.30', change: '18.40', percent: '8.11%', up: true},
];

function StockGridCard({item}) {
  return (
    <TouchableOpacity style={styles.gridCard} activeOpacity={0.8}>
      {/* Left colored bar */}
      <View style={[styles.cardBar, {backgroundColor: item.up ? Colors.green : Colors.red}]} />

      <Text style={styles.cardSymbol}>{item.symbol}</Text>
      <Text style={styles.cardPrice}>{item.price}</Text>

      <View style={styles.cardChangeRow}>
        <Icon
          name={item.up ? 'arrow-drop-up' : 'arrow-drop-down'}
          size={16}
          color={item.up ? Colors.green : Colors.red}
        />
        <Text style={[styles.cardChange, {color: item.up ? Colors.green : Colors.red}]}>
          {item.change} ({item.percent})
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function SectionLabel({title}) {
  return (
    <View style={styles.sectionLabelRow}>
      <View style={styles.sectionLine} />
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

export default function WatchlistScreen() {
  const [selectedList, setSelectedList] = useState('Default');
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastUpdated] = useState('14:14:58');

  const renderGrid = items => {
    const rows = [];
    for (let i = 0; i < items.length; i += 3) {
      rows.push(items.slice(i, i + 3));
    }
    return rows.map((row, idx) => (
      <View key={idx} style={styles.gridRow}>
        {row.map(item => (
          <StockGridCard key={item.id} item={item} />
        ))}
        {row.length < 3 &&
          [...Array(3 - row.length)].map((_, i) => (
            <View
              key={`empty-${i}`}
              style={[
                styles.gridCard,
                {backgroundColor: 'transparent', borderColor: 'transparent'},
              ]}
            />
          ))}
      </View>
    ));
  };

  return (
    <Layout scrollable={false}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Toolbar */}
      <View style={styles.toolbar}>

        {/* Dropdown */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowDropdown(!showDropdown)}
          activeOpacity={0.8}>
          <IconC name="format-list-bulleted" size={16} color={Colors.textSecondary} />
          <Text style={styles.dropdownText}>{selectedList}</Text>
          <Icon
            name={showDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={20}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.toolbarActions}>
          <TouchableOpacity style={styles.toolBtn}>
            <Icon name="add" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolBtn}>
            <Icon name="edit" size={17} color={Colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolBtn}>
            <Icon name="tune" size={17} color={Colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolBtn}>
            <IconC name="share-variant" size={17} color={Colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolBtn}>
            <Icon name="visibility" size={17} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Menu */}
      {showDropdown && (
        <View style={styles.dropdownMenu}>
          {WATCHLISTS.map((list, idx) => (
            <TouchableOpacity
              key={list}
              style={[
                styles.dropdownItem,
                idx === WATCHLISTS.length - 1 && {borderBottomWidth: 0},
              ]}
              onPress={() => {
                setSelectedList(list);
                setShowDropdown(false);
              }}>
              <IconC
                name="format-list-bulleted"
                size={15}
                color={selectedList === list ? Colors.green : Colors.textMuted}
                style={{marginRight: 10}}
              />
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedList === list && {color: Colors.green, fontWeight: '600'},
                ]}>
                {list}
              </Text>
              {selectedList === list && (
                <Icon
                  name="check"
                  size={16}
                  color={Colors.green}
                  style={{marginLeft: 'auto'}}
                />
              )}
            </TouchableOpacity>
          ))}

          {/* Create new list */}
          <TouchableOpacity style={styles.dropdownAddBtn}>
            <Icon name="add-circle-outline" size={16} color={Colors.primary} style={{marginRight: 8}} />
            <Text style={styles.dropdownAddText}>Create New List</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false}>

        {renderGrid(INDICES)}

        <SectionLabel title="Cash" />
        {renderGrid(CASH_STOCKS)}

        <SectionLabel title="FNO Near Month" />
        {renderGrid(FNO_STOCKS)}

        <View style={{height: 30}} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Icon name="access-time" size={13} color={Colors.textMuted} style={{marginRight: 5}} />
        <Text style={styles.bottomText}>Prices updated at: {lastUpdated}</Text>
        <TouchableOpacity style={styles.refreshBtn}>
          <Icon name="refresh" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: Colors.border,
    gap: 6,
  },
  dropdownText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  toolbarActions: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    justifyContent: 'flex-end',
  },
  toolBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 62,
    left: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
    zIndex: 999,
    minWidth: 200,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  dropdownItemText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  dropdownAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  dropdownAddText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  sectionLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: Colors.border,
  },
  sectionLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  gridRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 8,
  },
  gridCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  cardSymbol: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  cardChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardChange: {
    fontSize: 10,
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    gap: 4,
  },
  bottomText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  refreshBtn: {
    marginLeft: 8,
  },
});