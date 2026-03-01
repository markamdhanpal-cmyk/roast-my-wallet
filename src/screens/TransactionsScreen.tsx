import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { fetchRecentTransactions, Transaction } from '../database/db';
import { useStore } from '../store/useStore';

export default function TransactionsScreen() {
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);
    const trigger = useStore(state => state.hasCompletedOnboarding);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchRecentTransactions(50);
            setTransactions(data);
        };
        loadData();
    }, [trigger]);

    const renderItem = ({ item }: { item: Transaction }) => {
        const dateFormatted = new Date(item.date).toLocaleString('en-IN', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        return (
            <View style={styles.transactionItem}>
                <View>
                    <Text style={[typography.body, styles.merchantText]}>{item.merchant}</Text>
                    <Text style={[typography.caption, styles.dateText]}>{dateFormatted}</Text>
                </View>
                <Text style={[typography.h3, styles.amountText]}>
                    {item.type === 'debit' ? '-' : '+'}₹{item.amount.toLocaleString('en-IN')}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={[typography.h2, styles.title]}>Feed</Text>
                {transactions === null ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
                ) : transactions.length === 0 ? (
                    <Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: 20 }}>
                        No transactions yet. Waiting for SMS...
                    </Text>
                ) : (
                    <FlatList
                        data={transactions}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    title: {
        color: colors.text,
        marginBottom: 24,
    },
    listContent: {
        paddingBottom: 40,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    merchantText: {
        color: colors.text,
        fontWeight: '600',
        marginBottom: 4,
    },
    dateText: {
        color: colors.textMuted,
    },
    amountText: {
        color: colors.text,
    },
});
