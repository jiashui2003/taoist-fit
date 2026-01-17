import { openDB, DBSchema, IDBPDatabase } from 'idb';
import {
    ExtendedHealthMetrics,
    CultivationLevel,
    ShopItem,
    ActivityEntry,
    MentorshipStatus,
    MetricConfig,
    MetricHistory, // NEW: Phase 2
    MetricStatistics, // NEW: Phase 2
    MetricKey // NEW: Phase 2
} from '../types';

interface TaoistFitDB extends DBSchema {
    // 用户健康数据 (按日期存储)
    healthMetrics: {
        key: string; // 日期: YYYY-MM-DD
        value: ExtendedHealthMetrics & { date: string; timestamp: number };
        indexes: { 'by-timestamp': number };
    };

    // 境界等级
    cultivationLevel: {
        key: 'current';
        value: CultivationLevel & { lastUpdated: number };
    };

    // 商城物品
    shopItems: {
        key: string; // item.id
        value: ShopItem;
        indexes: { 'by-owned': boolean };
    };

    // 活动日志
    activityLog: {
        key: string; // entry.id
        value: ActivityEntry & { id: string };
        indexes: { 'by-timestamp': number };
    };

    // 拜师状态
    mentorship: {
        key: 'status';
        value: MentorshipStatus & { lastUpdated: number };
    };

    // 指标配置
    metricConfigs: {
        key: string; // config.key
        value: MetricConfig;
    };

    // NEW: Phase 2 - 指标历史数据
    metricHistory: {
        key: string; // `${timestamp}_${metricKey}`
        value: MetricHistory;
        indexes: { 'by-metric': string; 'by-timestamp': number; 'by-date': string };
    };

    // 应用设置
    settings: {
        key: string;
        value: any;
    };
}

const DB_NAME = 'taoist-fit-db';
const DB_VERSION = 2; // NEW: Updated to v2 for metricHistory table

export class DatabaseService {
    private db: IDBPDatabase<TaoistFitDB> | null = null;
    private initialized = false;

    async init(): Promise<void> {
        if (this.initialized) return;

        this.db = await openDB<TaoistFitDB>(DB_NAME, DB_VERSION, {
            upgrade(db, oldVersion, newVersion, transaction) {
                console.log(`📦 升级数据库从 v${oldVersion} 到 v${newVersion}`);

                // 创建 healthMetrics store
                if (!db.objectStoreNames.contains('healthMetrics')) {
                    const healthStore = db.createObjectStore('healthMetrics', {
                        keyPath: 'date'
                    });
                    healthStore.createIndex('by-timestamp', 'timestamp');
                }

                // 创建 cultivationLevel store
                if (!db.objectStoreNames.contains('cultivationLevel')) {
                    db.createObjectStore('cultivationLevel');
                }

                // 创建 shopItems store
                if (!db.objectStoreNames.contains('shopItems')) {
                    const shopStore = db.createObjectStore('shopItems', { keyPath: 'id' });
                    shopStore.createIndex('by-owned', 'owned');
                }

                // 创建 activityLog store
                if (!db.objectStoreNames.contains('activityLog')) {
                    const activityStore = db.createObjectStore('activityLog', {
                        keyPath: 'id'
                    });
                    activityStore.createIndex('by-timestamp', 'timestamp');
                }

                // 创建 mentorship store
                if (!db.objectStoreNames.contains('mentorship')) {
                    db.createObjectStore('mentorship');
                }

                // 创建 metricConfigs store
                if (!db.objectStoreNames.contains('metricConfigs')) {
                    db.createObjectStore('metricConfigs', { keyPath: 'key' });
                }

                // 创建 settings store
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings');
                }

                // NEW: Phase 2 - 创建 metricHistory store
                if (!db.objectStoreNames.contains('metricHistory')) {
                    const historyStore = db.createObjectStore('metricHistory', { keyPath: 'id' });
                    historyStore.createIndex('by-metric', 'metricKey');
                    historyStore.createIndex('by-timestamp', 'timestamp');
                    historyStore.createIndex('by-date', 'date');
                    console.log('📊 创建 metricHistory 表');
                }
            }
        });

        this.initialized = true;
        console.log('✅ IndexedDB 初始化完成');
    }

    // ==================== Health Metrics ====================

    async saveHealthMetrics(
        date: string,
        metrics: ExtendedHealthMetrics
    ): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.put('healthMetrics', {
            ...metrics,
            date,
            timestamp: Date.now()
        });
    }

    async getHealthMetrics(
        date: string
    ): Promise<ExtendedHealthMetrics | undefined> {
        if (!this.db) throw new Error('Database not initialized');
        const result = await this.db.get('healthMetrics', date);
        if (!result) return undefined;
        const { date: _, timestamp, ...metrics } = result;
        return metrics as ExtendedHealthMetrics;
    }

    async getRecentHealthMetrics(days: number = 7): Promise<Array<ExtendedHealthMetrics & { date: string }>> {
        if (!this.db) throw new Error('Database not initialized');
        const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
        const index = this.db.transaction('healthMetrics').store.index('by-timestamp');
        const results = await index.getAll(IDBKeyRange.lowerBound(cutoffTime));
        return results.map(({ date, timestamp, ...metrics }) => ({
            date,
            ...metrics as ExtendedHealthMetrics
        }));
    }

    // ==================== Cultivation Level ====================

    async saveCultivationLevel(level: CultivationLevel): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.put('cultivationLevel', {
            ...level,
            lastUpdated: Date.now()
        }, 'current');
    }

    async getCultivationLevel(): Promise<CultivationLevel | undefined> {
        if (!this.db) throw new Error('Database not initialized');
        const result = await this.db.get('cultivationLevel', 'current');
        if (!result) return undefined;
        const { lastUpdated, ...level } = result;
        return level as CultivationLevel;
    }

    // ==================== Shop Items ====================

    async saveShopItems(items: ShopItem[]): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        const tx = this.db.transaction('shopItems', 'readwrite');
        await Promise.all(items.map(item => tx.store.put(item)));
        await tx.done;
    }

    async getAllShopItems(): Promise<ShopItem[]> {
        if (!this.db) throw new Error('Database not initialized');
        return await this.db.getAll('shopItems');
    }

    async getOwnedShopItems(): Promise<ShopItem[]> {
        if (!this.db) throw new Error('Database not initialized');
        const index = this.db.transaction('shopItems').store.index('by-owned');
        return await index.getAll(IDBKeyRange.only(true));
    }

    // ==================== Activity Log ====================

    async addActivityEntry(entry: ActivityEntry): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        const entryWithId = {
            ...entry,
            id: entry.id || `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        await this.db.put('activityLog', entryWithId);
    }

    async getRecentActivities(limit: number = 20): Promise<ActivityEntry[]> {
        if (!this.db) throw new Error('Database not initialized');
        const index = this.db.transaction('activityLog').store.index('by-timestamp');
        const results = await index.getAll();
        return results
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit)
            .map(({ id, ...entry }) => entry as ActivityEntry);
    }

    async clearOldActivities(daysToKeep: number = 30): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;
        const tx = this.db.transaction('activityLog', 'readwrite');
        const index = tx.store.index('by-timestamp');
        const oldEntries = await index.getAllKeys(IDBKeyRange.upperBound(cutoffTime));
        await Promise.all(oldEntries.map((key) => tx.store.delete(key)));
        await tx.done;
    }

    // ==================== Mentorship ====================

    async saveMentorshipStatus(status: MentorshipStatus): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.put('mentorship', {
            ...status,
            lastUpdated: Date.now()
        }, 'status');
    }

    async getMentorshipStatus(): Promise<MentorshipStatus | undefined> {
        if (!this.db) throw new Error('Database not initialized');
        const result = await this.db.get('mentorship', 'status');
        if (!result) return undefined;
        const { lastUpdated, ...status } = result;
        return status as MentorshipStatus;
    }

    // ==================== Metric Configs ====================

    async saveMetricConfigs(configs: MetricConfig[]): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        const tx = this.db.transaction('metricConfigs', 'readwrite');
        await tx.store.clear(); // 清空旧配置
        await Promise.all(configs.map(config => tx.store.put(config)));
        await tx.done;
    }

    async getMetricConfigs(): Promise<MetricConfig[]> {
        if (!this.db) throw new Error('Database not initialized');
        return await this.db.getAll('metricConfigs');
    }

    // ==================== Metric History (Phase 2) ====================

    async saveMetricHistory(
        metricKey: MetricKey,
        value: number,
        source: 'manual' | 'sensor' | 'simulated' = 'simulated'
    ): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        const now = Date.now();
        const date = new Date(now).toISOString().split('T')[0];
        const id = `${now}_${metricKey}`;
        await this.db.put('metricHistory', { id, metricKey, value, timestamp: now, date, source });
    }

    async getMetricHistory(
        metricKey: MetricKey,
        startDate?: string,
        endDate?: string
    ): Promise<MetricHistory[]> {
        if (!this.db) throw new Error('Database not initialized');
        const index = this.db.transaction('metricHistory').store.index('by-metric');
        let results = await index.getAll(IDBKeyRange.only(metricKey));
        if (startDate || endDate) {
            results = results.filter((item) => {
                if (startDate && item.date < startDate) return false;
                if (endDate && item.date > endDate) return false;
                return true;
            });
        }
        return results.sort((a, b) => b.timestamp - a.timestamp);
    }

    async getRecentMetricHistory(metricKey: MetricKey, days: number = 7): Promise<MetricHistory[]> {
        if (!this.db) throw new Error('Database not initialized');
        const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
        const index = this.db.transaction('metricHistory').store.index('by-metric');
        const allForMetric = await index.getAll(IDBKeyRange.only(metricKey));
        return allForMetric
            .filter((item) => item.timestamp >= cutoffTime)
            .sort((a, b) => b.timestamp - a.timestamp);
    }

    async getMetricStatistics(metricKey: MetricKey, days: number = 7): Promise<MetricStatistics | null> {
        const history = await this.getRecentMetricHistory(metricKey, days);
        if (history.length === 0) return null;
        const values = history.map((h) => h.value);
        const count = values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);
        const sum = values.reduce((a, b) => a + b, 0);
        const mean = sum / count;
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
        const squareDiffs = values.map((v) => Math.pow(v - mean, 2));
        const variance = squareDiffs.reduce((a, b) => a + b, 0) / count;
        const stdDev = Math.sqrt(variance);
        return {
            metricKey, count, max, min, mean, median, stdDev, variance,
            latest: history[0].value,
            period: days === 1 ? '24 hours' : `${days} days`
        };
    }

    async clearOldMetricHistory(daysToKeep: number = 90): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;
        const tx = this.db.transaction('metricHistory', 'readwrite');
        const index = tx.store.index('by-timestamp');
        const oldEntries = await index.getAllKeys(IDBKeyRange.upperBound(cutoffTime));
        await Promise.all(oldEntries.map((key) => tx.store.delete(key)));
        await tx.done;
        console.log(`🗑️ 清理了 ${oldEntries.length} 条过期指标历史`);
    }

    // ==================== Settings ====================

    async saveSetting(key: string, value: any): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.put('settings', value, key);
    }

    async getSetting<T>(key: string): Promise<T | undefined> {
        if (!this.db) throw new Error('Database not initialized');
        return await this.db.get('settings', key);
    }

    // ==================== Utility Methods ====================

    async clearAllData(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        const storeNames: Array<keyof TaoistFitDB> = [
            'healthMetrics',
            'cultivationLevel',
            'shopItems',
            'activityLog',
            'mentorship',
            'metricConfigs',
            'metricHistory', // NEW: Phase 2
            'settings'
        ];

        for (const storeName of storeNames) {
            await this.db.clear(storeName);
        }
        console.log('🗑️ 所有数据已清空');
    }

    async exportData(): Promise<string> {
        if (!this.db) throw new Error('Database not initialized');
        const data = {
            healthMetrics: await this.db.getAll('healthMetrics'),
            cultivationLevel: await this.db.get('cultivationLevel', 'current'),
            shopItems: await this.db.getAll('shopItems'),
            activityLog: await this.db.getAll('activityLog'),
            mentorship: await this.db.get('mentorship', 'status'),
            metricConfigs: await this.db.getAll('metricConfigs'),
            settings: await this.db.getAll('settings'),
            exportedAt: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    }
}

// 单例导出
export const db = new DatabaseService();
