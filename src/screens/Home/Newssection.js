import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colours';

const NEWS = [
    { id: '1', title: 'RBI keeps repo rate unchanged at 6.5% for 7th consecutive time', time: '2h ago', tag: 'Economy' },
    { id: '2', title: 'Tata Steel Q3 profit jumps 34% YoY on strong domestic demand', time: '3h ago', tag: 'Earnings' },
    { id: '3', title: 'Sensex hits all-time high, Nifty crosses 22,500 mark', time: '4h ago', tag: 'Markets' },
    { id: '4', title: 'FIIs turn buyers, pump Rs 4,200 crore into Indian equities', time: '5h ago', tag: 'FII/DII' },
];

function NewsCard({ item }) {
    return (
        <TouchableOpacity style={styles.newsCard}>
            <View style={styles.newsTag}>
                <Text style={styles.newsTagText}>{item.tag}</Text>
            </View>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsTime}>{item.time}</Text>
        </TouchableOpacity>
    );
}

export default function NewsSection() {
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Latest News</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>
            {NEWS.map(item => (
                <NewsCard key={item.id} item={item} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    seeAll: {
        fontSize: 13,
        color: Colors.primary,
    },
    newsCard: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 0.5,
        borderColor: Colors.border,
    },
    newsTag: {
        backgroundColor: Colors.primary + '22',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        marginBottom: 8,
    },
    newsTagText: {
        fontSize: 10,
        color: Colors.primary,
        fontWeight: '600',
    },
    newsTitle: {
        fontSize: 13,
        color: Colors.textPrimary,
        lineHeight: 19,
        fontWeight: '500',
    },
    newsTime: {
        fontSize: 11,
        color: Colors.textMuted,
        marginTop: 6,
    },
});