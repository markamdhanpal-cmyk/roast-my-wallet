export interface ParsedSMS {
    amount: number;
    merchant: string;
    date: string;
    type: 'debit' | 'credit';
}

// Regex patterns provided
const upiRegex = /(?:Rs\.?|INR)\s*([\d,]+\.?\d*).*(?:debited|spent|paid|sent).*(?:VPA|UPI|to)\s+([A-Za-z0-9@.-]+)/i;
const hdfcRegex = /INR\s([\d,]+\.\d{2})\sdebited.*to\sVPA\s([a-zA-Z0-9@.-]+)/i;
const sbiRegex = /Debited\sby\sRs\s?([\d,]+\.\d{2}).*transfer\sto\s([a-zA-Z0-9@.-]+)/i;
const iciciRegex = /debited\swith\sINR\s([\d,]+\.\d{2}).*Info:\s(?:VPA|UPI)\/([a-zA-Z0-9@.-]+)/i;

/**
 * Parses an SMS string to extract transaction details.
 * Returns ParsedSMS object or null if not a matching transaction SMS.
 */
export const parseBankSMS = (smsBody: string, timestamp?: number): ParsedSMS | null => {
    let match = smsBody.match(hdfcRegex) || smsBody.match(sbiRegex) || smsBody.match(iciciRegex) || smsBody.match(upiRegex);

    if (match && match.length >= 3) {
        const amountStr = match[1].replace(/,/g, '');
        const amount = parseFloat(amountStr);
        const merchant = match[2];

        // Fallback to current date if timestamp is not provided
        const date = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();

        if (!isNaN(amount)) {
            return {
                amount,
                merchant,
                date,
                type: 'debit',
            };
        }
    }

    return null;
};
