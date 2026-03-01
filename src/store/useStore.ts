import { create } from 'zustand';

interface UserState {
    hasCompletedOnboarding: boolean;
    dailyLimit: number;
    setHasCompletedOnboarding: (val: boolean) => void;
    setDailyLimit: (limit: number) => void;
}

export const useStore = create<UserState>((set) => ({
    hasCompletedOnboarding: false,
    dailyLimit: 2000, // Default 2000 INR
    setHasCompletedOnboarding: (val) => set({ hasCompletedOnboarding: val }),
    setDailyLimit: (limit) => set({ dailyLimit: limit }),
}));
