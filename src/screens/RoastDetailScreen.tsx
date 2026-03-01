import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Share2, MoreHorizontal } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function RoastDetailScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Back Button */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={{ color: '#fff', fontSize: 16 }}>← Back</Text>
                </TouchableOpacity>

                {/* Main Roast Card */}
                <View style={styles.roastCard}>
                    <View style={styles.fireIconContainer}>
                        <Text style={{ fontSize: 32 }}>🔥</Text>
                    </View>

                    <Text style={[typography.h3, styles.roastHeadline]}>
                        "Beta, ₹950 ka Zomato?"
                    </Text>

                    <Text style={[typography.body, styles.roastBody]}>
                        Ghar mein khaana nahi banta kya? Tumhare Papa ko pata chala toh heart attack aa jayega.
                    </Text>

                    <Text style={[typography.body, styles.roastPunchline]}>
                        Itne mein poora grocery ho jaata! 🤦‍♂️
                    </Text>

                    <View style={styles.divider} />

                    <Text style={styles.parentSignature}>— Disappointed Desi Parent</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={[typography.h2, { color: '#fff' }]}>₹950</Text>
                            <Text style={styles.statLabel}>Wasted</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={[typography.h2, { color: '#FF3366' }]}>3x</Text>
                            <Text style={styles.statLabel}>This Week</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={[typography.h2, { color: '#FF9933' }]}>100%</Text>
                            <Text style={styles.statLabel}>Regret</Text>
                        </View>
                    </View>
                </View>

                {/* Interactive Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.instagramButton}
                        activeOpacity={0.8}
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                            console.log("Sharing to IG Story...");
                        }}
                    >
                        <LinearGradient
                            colors={['#833ab4', '#fd1d1d', '#fcb045']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientButton}
                        >
                            <Text style={{ color: '#fff', fontSize: 18, marginRight: 8 }}>📷</Text>
                            <Text style={styles.buttonText}>Share to Instagram Story</Text>
                            <Text style={{ color: '#fff', fontSize: 18, marginLeft: 8 }}>✨</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.whatsappButton}
                        activeOpacity={0.8}
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                            console.log("Sharing to WhatsApp...");
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 18, marginRight: 8 }}>💬</Text>
                        <Text style={styles.buttonText}>Share to WhatsApp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.moreOptionsButton}>
                        <Share2 color="#fff" size={20} style={{ marginRight: 8 }} />
                        <Text style={styles.buttonText}>More Options</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.trendingContainer}>
                    <View style={styles.trendingHeader}>
                        <Text style={styles.trendingTitle}>Trending Roasts</Text>
                        <Text style={styles.hotBadge}>↗ Hot</Text>
                    </View>
                    <Text style={styles.trendingStat}>❤️ 2.4k shares today</Text>
                    <Text style={styles.trendingStat}>💬 890 people got roasted</Text>
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
        paddingHorizontal: 20,
    },
    backButton: {
        marginTop: 10,
        marginBottom: 20,
    },
    roastCard: {
        backgroundColor: '#161618',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        marginBottom: 24,
    },
    fireIconContainer: {
        marginBottom: 16,
    },
    roastHeadline: {
        color: '#FF3366',
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 22,
    },
    roastBody: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 24,
    },
    roastPunchline: {
        color: '#FF9933',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        width: '100%',
        marginBottom: 16,
    },
    parentSignature: {
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    statBox: {
        alignItems: 'center',
    },
    statLabel: {
        color: '#666',
        marginTop: 4,
        fontSize: 12,
    },
    buttonContainer: {
        gap: 12,
        marginBottom: 24,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
    },
    instagramButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    whatsappButton: {
        backgroundColor: '#25D366',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
    },
    moreOptionsButton: {
        backgroundColor: '#222',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    trendingContainer: {
        backgroundColor: '#161618',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    trendingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    trendingTitle: {
        color: '#999',
        fontSize: 14,
    },
    hotBadge: {
        color: '#FF9933',
        fontSize: 12,
        fontWeight: 'bold',
    },
    trendingStat: {
        color: '#666',
        fontSize: 14,
        marginBottom: 8,
    },
});
