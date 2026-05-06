import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, StyleSheet,
    TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native';
import { Colors } from '../../theme/colours';
import { useNavigation } from '@react-navigation/native';

const INDICES_CONFIG = [
    { name: 'NIFTY 50', symbol: 'NIFTY', yahooSymbol: '^NSEI' },
    { name: 'SENSEX', symbol: 'SENSEX', yahooSymbol: '^BSESN' },
    { name: 'BANK NIFTY', symbol: 'BANKNIFTY', yahooSymbol: '^NSEBANK' },
    { name: 'MIDCAP', symbol: 'NIFTY_MID', yahooSymbol: '^NSEMDCP50' },
];

const REFRESH_INTERVAL_MS = 30000; 

async function fetchIndexData(yahooSymbol) {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`;
    const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) throw new Error('No data');

    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose ?? meta.previousClose;
    const change = price - prevClose;
    const changePercent = (change / prevClose) * 100;

    return {
        value: price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        change: (change >= 0 ? '+' : '') + change.toFixed(2),
        percent: (change >= 0 ? '+' : '') + changePercent.toFixed(2) + '%',
        up: change >= 0,
        // Raw numerics for Chart screen
        numericPrice: price,
        numericChange: change,
        numericChangePercent: changePercent,
    };
}

function IndexCard({ item }) {
    const navigation = useNavigation();

    const handlePress = () => {
        if (!item.data) return;
        navigation.navigate('Chart', {
            symbol: item.symbol,
            name: item.name,
            price: item.data.numericPrice,
            stock: {
                symbol: item.symbol,
                name: item.name,
                change: item.data.numericChange,
                changePercent: item.data.numericChangePercent,
            },
        });
    };

    const isLoading = !item.data && !item.error;
    const hasError = !!item.error;

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={styles.indexCard}
            disabled={isLoading || hasError}
        >
            <Text style={styles.indexName}>{item.name}</Text>

            {isLoading ? (
                <ActivityIndicator size="small" color={Colors.textSecondary} style={{ marginVertical: 10 }} />
            ) : hasError ? (
                <>
                    <Text style={styles.errorText}>—</Text>
                    <Text style={styles.errorSubText}>Unavailable</Text>
                </>
            ) : (
                <>
                    <Text style={styles.indexValue}>{item.data.value}</Text>
                    <View style={[
                        styles.changeBadge,
                        { backgroundColor: item.data.up ? Colors.green + '22' : Colors.red + '22' }
                    ]}>
                        <Text style={[styles.indexChange, { color: item.data.up ? Colors.green : Colors.red }]}>
                            {item.data.change} ({item.data.percent})
                        </Text>
                    </View>
                </>
            )}
        </TouchableOpacity>
    );
}

export default function IndicesSection() {
    const [indices, setIndices] = useState(
        INDICES_CONFIG.map(cfg => ({ ...cfg, data: null, error: null }))
    );
    const [refreshing, setRefreshing] = useState(false);

    const loadAll = useCallback(async (isManual = false) => {
        if (isManual) setRefreshing(true);

        const results = await Promise.allSettled(
            INDICES_CONFIG.map(cfg => fetchIndexData(cfg.yahooSymbol))
        );

        setIndices(INDICES_CONFIG.map((cfg, i) => ({
            ...cfg,
            data: results[i].status === 'fulfilled' ? results[i].value : null,
            error: results[i].status === 'rejected' ? results[i].reason : null,
        })));

        if (isManual) setRefreshing(false);
    }, []);

    useEffect(() => { loadAll(); }, [loadAll]);

    useEffect(() => {
        const timer = setInterval(() => loadAll(), REFRESH_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [loadAll]);

    return (
        <View style={styles.wrapper}>
            {indices.map(item => (
                <IndexCard key={item.name} item={item} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10 ,alignContent:'center',justifyContent:'center'},
    indexCard: {
        backgroundColor: Colors.card, borderRadius: 12, padding: 14, width: '47%',
        borderWidth: 0.5, borderColor: Colors.border
    },
    indexName: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4, fontWeight: '500' },
    indexValue: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
    changeBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3, alignSelf: 'flex-start' },
    indexChange: { fontSize: 11, fontWeight: '600' },
    errorText: { fontSize: 18, fontWeight: '700', color: Colors.textSecondary, marginBottom: 4 },
    errorSubText: { fontSize: 11, color: Colors.textSecondary },
});

