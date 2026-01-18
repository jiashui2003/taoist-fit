import { DailyReport } from './ReportGenerator';

/**
 * ImageExportService - 修炼卡片图片生成服务
 * 
 * Uses HTML5 Canvas to generate cultivation-themed shareable cards.
 */
export class ImageExportService {
    private static readonly CARD_WIDTH = 400;
    private static readonly CARD_HEIGHT = 520;

    /**
     * Generate daily report card as data URL
     */
    static async generateDailyCard(report: DailyReport): Promise<string> {
        const canvas = document.createElement('canvas');
        canvas.width = this.CARD_WIDTH;
        canvas.height = this.CARD_HEIGHT;
        const ctx = canvas.getContext('2d')!;

        // Background
        ctx.fillStyle = '#FDFCF8';
        ctx.fillRect(0, 0, this.CARD_WIDTH, this.CARD_HEIGHT);

        // Border
        ctx.strokeStyle = '#D4CEB0';
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 10, this.CARD_WIDTH - 20, this.CARD_HEIGHT - 20);

        // Header background
        ctx.fillStyle = '#9C7D3C';
        ctx.fillRect(10, 10, this.CARD_WIDTH - 20, 50);

        // Header text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`🧘 修炼日报 ${report.date}`, this.CARD_WIDTH / 2, 42);

        // Body text settings
        ctx.fillStyle = '#1A1A1A';
        ctx.textAlign = 'left';
        ctx.font = '16px "Microsoft YaHei", sans-serif';

        let y = 90;
        const x = 30;
        const lineHeight = 28;

        // Level info
        ctx.font = 'bold 18px "Microsoft YaHei", sans-serif';
        ctx.fillText(`📍 境界: ${this.getStageName(report.level.stage)} 第${report.level.layer}层`, x, y);
        y += lineHeight + 5;

        // Cultivation stats
        ctx.font = '16px "Microsoft YaHei", sans-serif';
        ctx.fillText(`⏱️ 今日修炼: ${report.cultivationHours} 小时`, x, y);
        y += lineHeight;
        ctx.fillText(`⚡ 灵气获得: ${report.lingQi}`, x, y);
        y += lineHeight + 10;

        // Divider
        ctx.strokeStyle = '#E6E2D0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(this.CARD_WIDTH - x, y);
        ctx.stroke();
        y += 20;

        // Health metrics
        const metrics = [
            { icon: '❤️', label: '心率', value: `${report.metrics.heartRate} bpm` },
            { icon: '🧘', label: '压力', value: `${report.metrics.stress}` },
            { icon: '💤', label: '睡眠', value: `${report.metrics.sleepHours}h` },
            { icon: '🔋', label: '电量', value: `${report.metrics.bodyBattery}%` },
        ];

        metrics.forEach(m => {
            ctx.fillText(`${m.icon} ${m.label}: ${m.value}`, x, y);
            y += lineHeight;
        });

        y += 10;
        // Divider
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(this.CARD_WIDTH - x, y);
        ctx.stroke();
        y += 20;

        // Five elements
        ctx.font = 'bold 16px "Microsoft YaHei", sans-serif';
        ctx.fillText(`☯️ 五行平衡: ${report.fiveElements.score}%`, x, y);
        y += lineHeight;

        // Five elements bars
        ctx.font = '14px "Microsoft YaHei", sans-serif';
        const balance = report.fiveElements.balance;
        const elementKeys = ['金', '木', '水', '火', '土'] as const;
        const barWidth = 50;
        const barHeight = 8;
        let barX = x;

        elementKeys.forEach((el, i) => {
            // Element name
            ctx.fillStyle = this.getElementColor(el);
            ctx.fillText(`${el}`, barX + (i * 70), y);

            // Bar background
            ctx.fillStyle = '#E6E2D0';
            ctx.fillRect(barX + (i * 70), y + 5, barWidth, barHeight);

            // Bar fill
            ctx.fillStyle = this.getElementColor(el);
            ctx.fillRect(barX + (i * 70), y + 5, barWidth * (balance[el] / 100), barHeight);
        });
        y += 35;

        // Achievements
        if (report.newUnlocks.length > 0) {
            ctx.fillStyle = '#1A1A1A';
            ctx.font = 'bold 16px "Microsoft YaHei", sans-serif';
            ctx.fillText(`✨ 今日解锁:`, x, y);
            y += lineHeight;

            ctx.font = '15px "Microsoft YaHei", sans-serif';
            report.newUnlocks.slice(0, 2).forEach(a => {
                ctx.fillText(`  ${a.icon} ${a.name}`, x, y);
                y += lineHeight;
            });
        }

        // Footer
        ctx.fillStyle = '#9C7D3C';
        ctx.fillRect(10, this.CARD_HEIGHT - 40, this.CARD_WIDTH - 20, 30);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Taoist Fit · 修仙健身', this.CARD_WIDTH / 2, this.CARD_HEIGHT - 20);

        return canvas.toDataURL('image/png');
    }

    /**
     * Generate achievement card
     */
    static generateAchievementCard(
        achievement: { name: string; icon: string; description: string; tier: string }
    ): string {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 200;
        const ctx = canvas.getContext('2d')!;

        // Background gradient
        const tierColors: Record<string, string[]> = {
            bronze: ['#CD7F32', '#A0522D'],
            silver: ['#C0C0C0', '#808080'],
            gold: ['#FFD700', '#DAA520'],
            special: ['#9C27B0', '#6A1B9A']
        };
        const colors = tierColors[achievement.tier] || tierColors.bronze;

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);

        ctx.fillStyle = gradient;
        ctx.roundRect(0, 0, canvas.width, canvas.height, 16);
        ctx.fill();

        // Icon
        ctx.font = '48px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(achievement.icon, canvas.width / 2, 70);

        // Name
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px "Microsoft YaHei", sans-serif';
        ctx.fillText(achievement.name, canvas.width / 2, 110);

        // Description
        ctx.font = '14px "Microsoft YaHei", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(achievement.description, canvas.width / 2, 140);

        // Badge
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.font = 'bold 12px "Microsoft YaHei", sans-serif';
        ctx.fillText('🏆 已解锁', canvas.width / 2, 175);

        return canvas.toDataURL('image/png');
    }

    /**
     * Download image from data URL
     */
    static downloadImage(dataUrl: string, filename: string): void {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Get element color
     */
    private static getElementColor(element: string): string {
        const colors: Record<string, string> = {
            '金': '#DAA520',
            '木': '#228B22',
            '水': '#4169E1',
            '火': '#DC143C',
            '土': '#8B4513'
        };
        return colors[element] || '#666666';
    }

    /**
     * Get stage name
     */
    private static getStageName(stage: string): string {
        const names: Record<string, string> = {
            'qi-refining': '炼气期',
            'foundation': '筑基期',
            'golden-core': '金丹期',
            'nascent-soul': '元婴期'
        };
        return names[stage] || stage;
    }
}
