import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Wallet, TrendingUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import ConfettiCannon from 'react-native-confetti-cannon';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { aggregateTodaySpend } from '../database/db';
import { useStore } from '../store/useStore';
import { generateDailyRoast } from '../utils/gemini';
import RoastCard from '../components/RoastCard';

export default function DashboardScreen() {
    const navigation = useNavigation<any>();
    const [spentToday, setSpentToday] = useState<number | null>(null);
    const [roastMessage, setRoastMessage] = useState<string | null>(null);
    const [isLoadingRoast, setIsLoadingRoast] = useState(true);
    const trigger = useStore(state => state.hasCompletedOnboarding);

    useEffect(() => {
        const loadData = async () => {
            setIsLoadingRoast(true);
            try {
                const aggregated = await aggregateTodaySpend();
                let displaySpend = aggregated.total_spent;

                // For UI testing purposes, use dummy data if 0
                if (displaySpend === 0) {
                    displaySpend = 47382;
                }

                setSpentToday(displaySpend);

                if (displaySpend > 0) {
                    // Inject a mock aggregated data object to get a good roast
                    const roast = await generateDailyRoast({
                        total_spent: displaySpend,
                        transactions: [
                            { merchant: 'Zomato', amount: 950 },
                            { merchant: 'Myntra', amount: 3400 },
                            { merchant: 'Starbucks', amount: 450 }
                        ]
                    });
                    setRoastMessage(roast);
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
            {spentToday === 0 && (
                <ConfettiCannon
                    count={200}
                    origin={{ x: -10, y: 0 }}
                    fadeOut={true}
                    colors={['#FF3366', '#FF9933', '#00EAFF', '#ffffff']}
                />
            )}
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Wallet color="#FFFFFF" size={24} />
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={[typography.h2, styles.dashboardTitle]}>Dashboard</Text>
                        <Text style={[typography.body, styles.dateSubtitle]}>March 2026</Text>
                    </View>
                </View>

                {/* Total Spend Card Clickable Area */}
                <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('RoastDetail')}>
                    <View style={styles.spendCard}>
                        <Text style={[typography.body, styles.spendLabel]}>Total Spend</Text>

                        {spentToday === null ? (
                            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
                        ) : (
                            <MaskedView
                                style={styles.maskedView}
                                maskElement={
                                    <Text style={[typography.h1, styles.amountMaskText]}>
                                        ₹{spentToday.toLocaleString('en-IN')}
                                    </Text>
                                }
                            >
                                <LinearGradient
                                    colors={['#FF3366', '#FF9933']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.gradientFill}
                                />
                            </MaskedView>
                        )}

                        <View style={styles.trendContainer}>
                            <TrendingUp color="#FF3366" size={16} />
                            <Text style={[typography.body, styles.trendText]}> +34% from last month</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* AI Shareable Roast Card wrapper to navigate to detail */}
                <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('RoastDetail')}>
                    <RoastCard
                        roastMessage={roastMessage}
                        spentToday={spentToday}
                        isLoading={isLoadingRoast}
                    />
                </TouchableOpacity>

                {/* Top Categories */}
                <View style={styles.categoriesSection}>
                    <Text style={[typography.h3, styles.categoriesTitle]}>Top Categories</Text>

                    <View style={styles.categoryRow}>
                        <View style={[styles.categoryIconBg, { backgroundColor: '#3b2826' }]}>
                            <Text style={styles.emoji}>🍔</Text>
                        </View>
                        <Text style={[typography.body, styles.categoryName]}>Food & Dining</Text>
                        <Text style={[typography.body, styles.categoryAmount, { color: '#FF3366' }]}>₹18,240</Text>
                    </View>

                    <View style={styles.categoryRow}>
                        <View style={[styles.categoryIconBg, { backgroundColor: '#2a3b26' }]}>
                            <Text style={styles.emoji}>🛍️</Text>
                        </View>
                        <Text style={[typography.body, styles.categoryName]}>Shopping</Text>
                        <Text style={[typography.body, styles.categoryAmount, { color: '#FF9933' }]}>₹14,920</Text>
                    </View>

                    <View style={styles.categoryRow}>
                        <View style={[styles.categoryIconBg, { backgroundColor: '#262f3b' }]}>
                            <Text style={styles.emoji}>🎮</Text>
                        </View>
                        <Text style={[typography.body, styles.categoryName]}>Entertainment</Text>
                        <Text style={[typography.body, styles.categoryAmount, { color: '#FFB800' }]}>₹8,150</Text>
                    </View>
                </View>

                {/* Pagination Dots (Like your Figma) */}
                <View style={styles.paginationContainer}>
                    <View style={[styles.dot, styles.activeDot]} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
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
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#FF3B30',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    headerTextContainer: {
        flex: 1,
    },
    dashboardTitle: {
        color: colors.text,
        fontSize: 28,
        lineHeight: 34,
    },
    dateSubtitle: {
        color: colors.textMuted,
        fontSize: 14,
    },
    spendCard: {
        backgroundColor: '#161618',
        borderRadius: 20,
        padding: 24,
        marginBottom: 30,
    },
    spendLabel: {
        color: colors.textMuted,
        marginBottom: 8,
    },
    maskedView: {
        height: 60,
        marginBottom: 8,
    },
    amountMaskText: {
        fontSize: 52,
        lineHeight: 60,
        color: 'black', // required for mask
        backgroundColor: 'transparent',
    },
    gradientFill: {
        flex: 1,
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    trendText: {
        color: '#FF3366',
        fontSize: 14,
        marginLeft: 4,
    },
    categoriesSection: {
        marginBottom: 20,
    },
    categoriesTitle: {
        color: colors.textMuted,
        fontSize: 16,
        marginBottom: 16,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111111',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#222222',
    },
    categoryIconBg: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    emoji: {
        fontSize: 20,
    },
    categoryName: {
        color: colors.text,
        flex: 1,
        fontSize: 16,
    },
    categoryAmount: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#333', // Dark dots for inactive
    },
    activeDot: {
        width: 24, // Longer dot for the current screen
        backgroundColor: '#FF4D88', // Pink from your Figma
    },
});
