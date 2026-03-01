import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Share2 } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface RoastCardProps {
    roastMessage: string | null;
    spentToday: number | null;
    isLoading: boolean;
}

export default function RoastCard({ roastMessage, spentToday, isLoading }: RoastCardProps) {
    const viewShotRef = useRef<ViewShot>(null);
    const [isSharing, setIsSharing] = useState(false);

    const handleShare = async () => {
        if (!viewShotRef.current?.capture) return;

        try {
            setIsSharing(true);
            const uri = await viewShotRef.current.capture();

            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'image/jpeg',
                    dialogTitle: 'Share your roast',
                });
            }
        } catch (error) {
            console.error('Error sharing roast:', error);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <View style={styles.container}>
            <ViewShot
                ref={viewShotRef}
                options={{ format: 'jpg', quality: 0.9 }}
                style={styles.shotContainer}
            >
                <Text style={[typography.h3, styles.title]}>Roast of the Day</Text>

                {isLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
                ) : (
                    <Text style={[typography.body, styles.roastText]}>
                        "{roastMessage || "No data yet. Go buy a coffee."}"
                    </Text>
                )}

                <View style={styles.footer}>
                    <Text style={[typography.caption, styles.brand]}>Roast My Wallet</Text>
                    {spentToday !== null && (
                        <Text style={[typography.caption, styles.damage]}>Today's Damage: ₹{spentToday.toLocaleString('en-IN')}</Text>
                    )}
                </View>
            </ViewShot>

            <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
                disabled={isSharing || isLoading || !roastMessage}
                activeOpacity={0.8}
            >
                <Share2 color={colors.background} size={20} style={{ marginRight: 8 }} />
                <Text style={[typography.body, styles.shareText]}>
                    {isSharing ? 'Capturing...' : 'Share to IG'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 40,
    },
    shotContainer: {
        backgroundColor: colors.card,
        padding: 24,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: colors.border,
    },
    loader: {
        marginVertical: 20,
    },
    title: {
        color: colors.primary,
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontSize: 14,
    },
    roastText: {
        color: colors.text,
        fontStyle: 'italic',
        lineHeight: 24,
        fontSize: 18,
        marginBottom: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 16,
    },
    brand: {
        color: colors.textMuted,
        fontWeight: 'bold',
    },
    damage: {
        color: colors.expense,
        fontWeight: 'bold',
    },
    shareButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    shareText: {
        color: colors.background,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
