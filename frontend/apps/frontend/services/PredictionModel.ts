import { CultivationLevel } from "../types";

/**
 * A simple client-side prediction model.
 * In a real scenario, this could use TensorFlow.js for more complex patterns.
 * Here we use a linear projection based on recent "Qi" (Calorie) accumulation rates.
 */
export const PredictionModel = {
    // History of caloric gain samples [timestamp, totalCalories]
    history: [] as Array<{ time: number; calories: number }>,

    track(currentCalories: number) {
        const now = Date.now();
        this.history.push({ time: now, calories: currentCalories });
        // Keep only last 10 minutes of data for immediate trend
        if (this.history.length > 20) {
            this.history.shift();
        }
    },

    /**
     * Predicts minutes remaining to reach maxExp based on current rate of gain.
     */
    predictTimeToBreakthrough(level: CultivationLevel): number {
        if (this.history.length < 2) return -1; // Not enough data

        const first = this.history[0];
        const last = this.history[this.history.length - 1];

        const timeDiffMinutes = (last.time - first.time) / 1000 / 60;
        const calorieDiff = last.calories - first.calories;

        if (timeDiffMinutes <= 0 || calorieDiff <= 0) return -1; // No gain or too fast

        const ratePerMinute = calorieDiff / timeDiffMinutes;
        const remainingExp = level.maxExp - level.currentExp;

        if (remainingExp <= 0) return 0;

        return Math.ceil(remainingExp / ratePerMinute);
    }
};
