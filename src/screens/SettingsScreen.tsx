import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { injectDummyTransactions } from '../database/db';
import { useStore } from '../store/useStore';

export default function SettingsScreen() {
    const triggerRefresh = () => {
        useStore.setState({ hasCompletedOnboarding: !useStore.getState().hasCompletedOnboarding });
    };

    const handleInject = async () => {
        await injectDummyTransactions();
        triggerRefresh();
        Alert.alert("Success", "Dummy data injected! Check your Dashboard.");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={[typography.h2, styles.title]}>Settings</Text>

                <View style={styles.section}>
                    <TouchableOpacity style={styles.row}>
                        <Text style={[typography.body, styles.rowText]}>Daily Spend Limit</Text>
                        <Text style={[typography.body, styles.rowValue]}>₹2,000</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row}>
                        <Text style={[typography.body, styles.rowText]}>SMS Permissions</Text>
                        <Text style={[typography.body, styles.rowValue, { color: colors.primary }]}>Granted</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row}>
                        <Text style={[typography.body, styles.rowText]}>AI Roast Severity</Text>
                        <Text style={[typography.body, styles.rowValue]}>Unhinged</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[typography.caption, { color: colors.textMuted, marginTop: 40, marginBottom: 8 }]}>DEBUG ACTIONS</Text>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.row} onPress={handleInject}>
                        <Text style={[typography.body, styles.rowText, { color: colors.primary }]}>Inject Dummy Data</Text>
                    </TouchableOpacity>
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
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    title: {
        color: colors.text,
        marginBottom: 32,
    },
    section: {
        backgroundColor: colors.card,
        borderRadius: 16,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    rowText: {
        color: colors.text,
    },
    rowValue: {
        color: colors.textMuted,
    },
});
