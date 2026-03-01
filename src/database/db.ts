import * as SQLite from 'expo-sqlite';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// Open the database synchronously
let db: SQLite.SQLiteDatabase | null = null;

export const initDB = async () => {
    if (db) return;
    db = await SQLite.openDatabaseAsync('transactions.db');

    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY NOT NULL,
      amount REAL NOT NULL,
      merchant TEXT NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL
    );
  `);
};

export interface Transaction {
    id: string;
    amount: number;
    merchant: string;
    date: string;
    type: 'debit' | 'credit';
}

export const insertTransaction = async (
    amount: number,
    merchant: string,
    date: string,
    type: 'debit' | 'credit' = 'debit'
) => {
    if (!db) await initDB();

    const id = uuidv4();
    await db!.runAsync(
        'INSERT INTO transactions (id, amount, merchant, date, type) VALUES (?, ?, ?, ?, ?)',
        id, amount, merchant, date, type
    );
    return id;
};

export const fetchTodayTotalSpend = async (): Promise<number> => {
    if (!db) await initDB();

    // Get start of today in local time ISO string prefix
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfTodayIso = today.toISOString();

    // Assuming dates are stored as ISO strings
    const result = await db!.getAllAsync(
        'SELECT SUM(amount) as total FROM transactions WHERE date >= ? AND type = ?',
        startOfTodayIso, 'debit'
    );

    return (result[0] as any)?.total || 0;
};

export const fetchRecentTransactions = async (limit: number = 20): Promise<Transaction[]> => {
    if (!db) await initDB();
    const rows = await db!.getAllAsync('SELECT * FROM transactions ORDER BY date DESC LIMIT ?', limit);
    // Ensure the generic getAllAsync returns Transaction type
    return rows as unknown as Transaction[];
};

export const aggregateTodaySpend = async () => {
    if (!db) await initDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfTodayIso = today.toISOString();

    const totalResult = await fetchTodayTotalSpend();

    const transactionsRaw = await db!.getAllAsync(
        'SELECT merchant, amount FROM transactions WHERE date >= ? AND type = ?',
        startOfTodayIso, 'debit'
    );

    const transactions = (transactionsRaw as unknown as { merchant: string; amount: number }[]).map(t => ({
        merchant: t.merchant,
        amount: t.amount,
    }));

    return {
        total_spent: totalResult,
        transactions,
    };
};

export const injectDummyTransactions = async () => {
    if (!db) await initDB();

    const dummyData = [
        { amount: 950.00, merchant: 'Zomato (Late Night)', type: 'debit' },
        { amount: 4500.00, merchant: 'Myntra', type: 'debit' },
        { amount: 154.00, merchant: 'Blinkit', type: 'debit' },
        { amount: 5000.00, merchant: 'Zerodha Broking', type: 'debit' },
        { amount: 650.00, merchant: 'Uber India', type: 'debit' },
        { amount: 20.00, merchant: 'Tapri Chai VPA', type: 'debit' }
    ];

    const today = new Date().toISOString();

    for (const tx of dummyData) {
        const id = uuidv4();
        await db!.runAsync(
            'INSERT INTO transactions (id, amount, merchant, date, type) VALUES (?, ?, ?, ?, ?)',
            id, tx.amount, tx.merchant, today, tx.type
        );
    }

    console.log('✅ Chaotic spending data injected successfully!');
};
