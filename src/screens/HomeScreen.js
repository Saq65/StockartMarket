import React, { useState } from 'react';
import { StatusBar, RefreshControl, StyleSheet } from 'react-native';
import { Colors } from '../theme/colours';
import Layout from '../layout/layout';
import MarketStatus from '../screens/Home/MarketStatus';
import IndicesSection from '../screens/Home/Indicessection';
import GainersLosersSection from '../screens/Home/Gainersloserssection';
import NewsSection from '../screens/Home/Newssection';

export default function HomeScreen() {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    return (
        <Layout
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={Colors.primary}
                />
            }
        >
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <MarketStatus />
            <IndicesSection />
            <GainersLosersSection />
            <NewsSection />
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#000'
    }
})