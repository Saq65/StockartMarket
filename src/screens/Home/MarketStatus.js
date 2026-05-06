import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colours';

export default function MarketStatus() {
    return (
        <View style={styles.marketStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Market Open</Text>
            <Text style={styles.statusTime}>  •  Closes at 3:30 PM</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    marketStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.green,
        marginRight: 6,
    },
    statusText: {
        fontSize: 13,
        color: Colors.green,
        fontWeight: '500',
    },
    statusTime: {
        fontSize: 12,
        color: Colors.textMuted,
    },
});