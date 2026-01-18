/**
 * VoiceService - 道家风格语音播报服务
 * 基于Web Speech API
 */

// 道家风格的播报文案
const VOICE_TEMPLATES = {
    dailySummary: [
        '今日修炼，步行{steps}步，消耗灵气{calories}点，心境平和。',
        '道友今日功德圆满，共积累{steps}步修为，灵气{calories}。',
        '一日之功，{steps}步行脚，{calories}灵气入怀，修为渐进。',
    ],

    achievementUnlock: [
        '恭喜道友！成就"{name}"已解锁，修为大进！',
        '善哉！道友获得成就"{name}"，离大道更近一步！',
        '妙哉！"{name}"成就达成，天道酬勤！',
    ],

    heartRateAlert: [
        '道友心率偏高，建议调息片刻。',
        '心跳急促，宜静坐调神。',
    ],

    stressAlert: [
        '压力过重，宜放空心神，休养生息。',
        '心神不宁，建议行气导引，排解浊气。',
    ],

    morningGreeting: [
        '新日初升，道友早安，今日修炼可期。',
        '晨曦微露，正是修行好时辰。',
    ],

    eveningGreeting: [
        '日落西山，今日修炼圆满，且歇息调养。',
        '暮色渐浓，功课暂歇，养精蓄锐。',
    ],
};

export class VoiceService {
    private static synth: SpeechSynthesis | null = null;
    private static voice: SpeechSynthesisVoice | null = null;
    private static isInitialized = false;

    /**
     * 初始化语音服务
     */
    static init(): boolean {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            console.warn('⚠️ 语音合成不支持');
            return false;
        }

        this.synth = window.speechSynthesis;
        this.isInitialized = true;

        // 加载中文语音
        const loadVoices = () => {
            const voices = this.synth?.getVoices() || [];
            // 优先选择中文语音
            this.voice = voices.find(v => v.lang.startsWith('zh')) || voices[0] || null;
            console.log('🔊 语音服务已初始化，可用语音:', this.voice?.name);
        };

        if (this.synth.getVoices().length > 0) {
            loadVoices();
        } else {
            this.synth.onvoiceschanged = loadVoices;
        }

        return true;
    }

    /**
     * 检查语音服务是否可用
     */
    static isAvailable(): boolean {
        return this.isInitialized && this.synth !== null;
    }

    /**
     * 播报文本
     */
    static speak(text: string, options?: { rate?: number; pitch?: number }): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.synth) {
                reject(new Error('语音服务未初始化'));
                return;
            }

            // 停止当前播放
            this.synth.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = this.voice;
            utterance.lang = 'zh-CN';
            utterance.rate = options?.rate ?? 0.9; // 稍慢一点更有道家韵味
            utterance.pitch = options?.pitch ?? 1;
            utterance.volume = 1;

            utterance.onend = () => resolve();
            utterance.onerror = (e) => reject(e);

            this.synth.speak(utterance);
        });
    }

    /**
     * 停止播报
     */
    static stop(): void {
        this.synth?.cancel();
    }

    /**
     * 随机选择模板
     */
    private static pickTemplate(templates: string[]): string {
        return templates[Math.floor(Math.random() * templates.length)];
    }

    /**
     * 播报每日修炼总结
     */
    static speakDailySummary(steps: number, calories: number): Promise<void> {
        const template = this.pickTemplate(VOICE_TEMPLATES.dailySummary);
        const text = template
            .replace('{steps}', steps.toLocaleString())
            .replace('{calories}', calories.toLocaleString());
        return this.speak(text);
    }

    /**
     * 播报成就解锁
     */
    static speakAchievementUnlock(achievementName: string): Promise<void> {
        const template = this.pickTemplate(VOICE_TEMPLATES.achievementUnlock);
        const text = template.replace('{name}', achievementName);
        return this.speak(text);
    }

    /**
     * 播报心率提醒
     */
    static speakHeartRateAlert(): Promise<void> {
        return this.speak(this.pickTemplate(VOICE_TEMPLATES.heartRateAlert));
    }

    /**
     * 播报压力提醒
     */
    static speakStressAlert(): Promise<void> {
        return this.speak(this.pickTemplate(VOICE_TEMPLATES.stressAlert));
    }

    /**
     * 播报问候语
     */
    static speakGreeting(): Promise<void> {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            return this.speak(this.pickTemplate(VOICE_TEMPLATES.morningGreeting));
        } else if (hour >= 18 || hour < 5) {
            return this.speak(this.pickTemplate(VOICE_TEMPLATES.eveningGreeting));
        }
        return this.speak('道友好，修炼愉快。');
    }

    /**
     * 播报自定义文本
     */
    static speakCustom(text: string): Promise<void> {
        return this.speak(text);
    }
}

// 自动初始化
if (typeof window !== 'undefined') {
    VoiceService.init();
}
