import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { aggregateTodaySpend } from '../database/db';
import { useStore } from '../store/useStore';
import { generateDailyRoast } from '../utils/gemini';
import RoastCard from '../components/RoastCard';

export default function DashboardScreen() {
    const [spentToday, setSpentToday] = useState<number | null>(null);
    const [roastMessage, setRoastMessage] = useState<string | null>(null);
    const [isLoadingRoast, setIsLoadingRoast] = useState(true);
    const trigger = useStore(state => state.hasCompletedOnboarding);

    useEffect(() => {
        const loadData = async () => {
            setIsLoadingRoast(true);
            try {
                const aggregated = await aggregateTodaySpend();
                setSpentToday(aggregated.total_spent);

                if (aggregated.total_spent > 0) {
                    const roast = await generateDailyRoast(aggregated);
                    setRoastMessage(roast);
                } else {
                    setRoastMessage("0 spent today? Are you dead or simply bed rotting?");
                }
            } catch (err) {
                console.error("Error loading dashboard data", err);
            } finally {
                setIsLoadingRoast(false);
            }
        };
        loadData();
    }, [trigger]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[typography.h3, styles.greeting]}>Hey Waster,</Text>
                    <Text style={[typography.body, styles.subtitle]}>Here's today's damage.</Text>
                </View>

                {/* AI Shareable Roast Card */}
                <RoastCard
                    roastMessage={roastMessage}
                    spentToday={spentToday}
                    isLoading={isLoadingRoast}
                />

                {/* Today's Spend */}
                <View style={styles.spendContainer}>
                    {spentToday === null ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                        <Text style={[typography.h1, styles.amountText]}>₹{spentToday.toLocaleString('en-IN')}</Text>
                    )}
                    <Text style={[typography.caption, styles.spendLabel]}>Spent Today</Text>
                </View>
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
        padding: 24,
    },
    header: {
        marginTop: 20,
        marginBottom: 40,
    },
    greeting: {
        color: colors.text,
    },
    subtitle: {
        color: colors.textMuted,
        marginTop: 4,
    },
    spendContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    amountText: {
        color: colors.expense,
        marginBottom: 8,
    },
    spendLabel: {
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
});
