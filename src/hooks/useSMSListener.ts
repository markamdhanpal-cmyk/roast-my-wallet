import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
// @ts-ignore
import SmsListener from 'react-native-android-sms-listener';
import { parseBankSMS } from '../utils/smsParser';
import { insertTransaction } from '../database/db';
import { useStore } from '../store/useStore';

export const requestSMSPermissions = async () => {
    if (Platform.OS !== 'android') return false;

    try {
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        ]);

        return (
            granted['android.permission.READ_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.RECEIVE_SMS'] === PermissionsAndroid.RESULTS.GRANTED
        );
    } catch (err) {
        console.warn(err);
        return false;
    }
};

export const useSMSListener = () => {
    const refreshTrigger = useStore((state) => state.setHasCompletedOnboarding); // Reusing context trigger or create a real refresh

    useEffect(() => {
        if (Platform.OS !== 'android') return;

        let subscription: { remove: () => void } | null = null;

        const setupListener = async () => {
            const permsGranted = await requestSMSPermissions();
            if (!permsGranted) {
                console.log('SMS permissions denied');
                return;
            }

            console.log('Setting up SMS Listener...');
            subscription = SmsListener.addListener(async (message: any) => {
                console.log('New SMS received:', message);

                const parsed = parseBankSMS(message.body, message.timestamp);

                if (parsed) {
                    console.log('Parsed Transaction:', parsed);
                    await insertTransaction(parsed.amount, parsed.merchant, parsed.date, parsed.type);

                    // Trigger a re-render in our UI by updating store randomly.
                    // In a real app we'd have a specific `lastRefreshTime` piece of state.
                    useStore.setState({ hasCompletedOnboarding: !useStore.getState().hasCompletedOnboarding });
                }
            });
        };

        setupListener();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);
};
