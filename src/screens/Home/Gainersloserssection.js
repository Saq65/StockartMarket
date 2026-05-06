import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colours';
import { useNavigation } from '@react-navigation/native';

const GAINERS = [
    {
        symbol: 'TATASTEEL',
        name: 'Tata Steel',
        price: '167.45',
        change: '+8.23%',
        rawChange: 13.45,
        rawChangePercent: 8.23,
        up: true,
        logo: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj1C_hT2vRp1jYZ0rBaMk9REIRVWL8mItBEA&s' },
    },
    {
        symbol: 'HINDALCO',
        name: 'Hindalco Industries',
        price: '672.30',
        change: '+5.41%',
        rawChange: 34.50,
        rawChangePercent: 5.41,
        up: true,
        logo: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJHG7CA3Lv2S4uowl_MxYWPTki-joAfWRAZg&s' },
    },
    {
        symbol: 'JSWSTEEL',
        name: 'JSW Steel',
        price: '932.10',
        change: '+4.87%',
        rawChange: 43.35,
        rawChangePercent: 4.87,
        up: true,
        logo: { uri: 'https://www.google.com/s2/favicons?domain=jsw.in&sz=64' },
    },
    {
        symbol: 'COALINDIA',
        name: 'Coal India',
        price: '458.75',
        change: '+3.92%',
        rawChange: 17.30,
        rawChangePercent: 3.92,
        up: true,
        logo: { uri: 'https://www.uxdt.nic.in/wp-content/uploads/2020/06/Preview-25.png' },
    },
    {
        symbol: 'ONGC',
        name: 'ONGC',
        price: '274.60',
        change: '+3.45%',
        rawChange: 9.15,
        rawChangePercent: 3.45,
        up: true,
        logo: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-wDryiNgKp4WuaAOr696cqYToEGbvyzFoXw&s' },
    },
];

const LOSERS = [
    {
        symbol: 'WIPRO',
        name: 'Wipro',
        price: '456.20',
        change: '-3.21%',
        rawChange: -15.10,
        rawChangePercent: -3.21,
        up: false,
        logo: { uri: 'https://www.google.com/s2/favicons?domain=wipro.com&sz=64' },
    },
    {
        symbol: 'HCLTECH',
        name: 'HCL Technologies',
        price: '1432.50',
        change: '-2.87%',
        rawChange: -42.30,
        rawChangePercent: -2.87,
        up: false,
        logo: { uri: 'https://www.google.com/s2/favicons?domain=hcltech.com&sz=64' },
    },
    {
        symbol: 'TECHM',
        name: 'Tech Mahindra',
        price: '1287.30',
        change: '-2.54%',
        rawChange: -33.55,
        rawChangePercent: -2.54,
        up: false,
        logo: { uri: 'https://www.google.com/s2/favicons?domain=techmahindra.com&sz=64' },
    },
    {
        symbol: 'INFY',
        name: 'Infosys',
        price: '1678.40',
        change: '-2.12%',
        rawChange: -36.30,
        rawChangePercent: -2.12,
        up: false,
        logo: { uri: 'https://www.google.com/s2/favicons?domain=infosys.com&sz=64' },
    },
    {
        symbol: 'TCS',
        name: 'TCS',
        price: '3892.60',
        change: '-1.98%',
        rawChange: -78.60,
        rawChangePercent: -1.98,
        up: false,
        logo: { uri: 'https://www.google.com/s2/favicons?domain=tcs.com&sz=64' },
    },
];

function StockRow({ item }) {
    const [imgError, setImgError] = useState(false);
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('Chart', {
            symbol: item.symbol,
            name: item.name,
            price: parseFloat(item.price.replace(/,/g, '')),
            stock: {
                symbol:        item.symbol,
                name:          item.name,
                change:        item.rawChange,
                changePercent: item.rawChangePercent,
            },
        });
    };

    return (
        <TouchableOpacity style={styles.stockRow} onPress={handlePress} activeOpacity={0.75}>
            <View style={[styles.symbolBox, { backgroundColor: item.up ? Colors.green + '22' : Colors.red + '22' }]}>
                {imgError ? (
                    <Text style={[styles.symbolText, { color: item.up ? Colors.green : Colors.red }]}>
                        {item.symbol.charAt(0)}
                    </Text>
                ) : (
                    <Image
                        source={item.logo}
                        style={{ width: 28, height: 28, borderRadius: 4 }}
                        resizeMode="contain"
                        onError={() => setImgError(true)}
                    />
                )}
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.stockSymbol}>{item.symbol}</Text>
                <Text style={styles.stockName} numberOfLines={1}>{item.name}</Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.stockPrice}>₹{item.price}</Text>
                <Text style={[styles.stockChange, { color: item.up ? Colors.green : Colors.red }]}>
                    {item.change}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

export default function GainersLosersSection() {
    const [activeTab, setActiveTab] = useState('gainers');

    return (
        <View style={styles.section}>
            <View style={styles.tabRow}>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'gainers' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('gainers')}>
                    <Text style={[styles.tabText, activeTab === 'gainers' && styles.tabTextActive]}>
                         Top Gainers
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'losers' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('losers')}>
                    <Text style={[styles.tabText, activeTab === 'losers' && styles.tabTextActive]}>
                         Top Losers
                    </Text>
                </TouchableOpacity>
            </View>

            {(activeTab === 'gainers' ? GAINERS : LOSERS).map(item => (
                <StockRow key={item.symbol} item={item} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    tabRow: {
        flexDirection: 'row',
        backgroundColor: Colors.card,
        borderRadius: 10,
        padding: 4,
        marginBottom: 12,
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    tabBtnActive: {
        backgroundColor: Colors.primary,
    },
    tabText: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    tabTextActive: {
        color: Colors.white,
        fontWeight: '600',
    },
    stockRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        borderWidth: 0.5,
        borderColor: Colors.border,
    },
    symbolBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    symbolText: {
        fontSize: 16,
        fontWeight: '700',
    },
    stockSymbol: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    stockName: {
        fontSize: 11,
        color: Colors.textSecondary,
        marginTop: 1,
    },
    stockPrice: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    stockChange: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 2,
    },
});