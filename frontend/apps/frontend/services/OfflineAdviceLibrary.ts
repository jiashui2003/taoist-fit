/**
 * 离线 AI 建议库
 * 当无法访问 Gemini API 时提供预设的修仙风格建议
 */

interface OfflineAdvice {
    category: string;
    condition: string;
    advice: string;
}

// 基于五行不平衡的建议
export const FIVE_ELEMENTS_ADVICE: OfflineAdvice[] = [
    // 心火系列
    {
        category: '心火',
        condition: '心火过旺',
        advice: '心火过旺，宜静心调息。每日午时（11-13点）闭目养神15分钟，晚间练习腹式呼吸，避免剧烈运动。可饮用菊花茶、绿豆汤以清心火。'
    },
    {
        category: '心火',
        condition: '心火不足',
        advice: '心火不足，精力欠佳。适当增加有氧运动，如慢跑、游泳，每周3-4次，每次30分钟。早晨可饮红茶、姜茶以振奋阳气。'
    },

    // 肾水系列
    {
        category: '肾水',
        condition: '肾水充盈',
        advice: '肾水充盈，休息充足。继续保持良好作息，子时前（23点前）入睡，可练习八段锦以固本培元。'
    },
    {
        category: '肾水',
        condition: '肾水不足',
        advice: '肾水不足，神识恍惚。需增加深度睡眠，建议每晚23点前入睡，睡前避免使用电子设备。可食用黑芝麻、核桃等补肾之物。'
    },

    // 肝木系列
    {
        category: '肝木',
        condition: '肝木调和',
        advice: '肝木调和，情绪稳定。继续保持良好心态，可练习瑜伽、太极以舒肝理气，保持身心平衡。'
    },
    {
        category: '肝木',
        condition: '肝木失调',
        advice: '肝木失调，压力较大。建议进行舒缓的拉伸运动，多接触自然，练习冥想或听舒缓音乐。避免熬夜和暴饮暴食。'
    },

    // 肺金系列
    {
        category: '肺金',
        condition: '肺金饱满',
        advice: '肺金饱满，呼吸深长。气血运行通畅，可练习站桩功深化呼吸，每日清晨深呼吸50次以养肺气。'
    },
    {
        category: '肺金',
        condition: '肺金亏虚',
        advice: '肺金亏虚，呼吸浅促。建议练习腹式呼吸，每日3次，每次10分钟。多做户外活动，呼吸新鲜空气。可食银耳、百合等润肺之物。'
    },

    // 脾土系列
    {
        category: '脾土',
        condition: '脾土厚实',
        advice: '脾土厚实，根基稳固。日常活动充足，继续保持每日8000步以上的运动量，可适当增加力量训练以强健筋骨。'
    },
    {
        category: '脾土',
        condition: '脾土虚弱',
        advice: '脾土虚弱，行动不足。需增加日常步行，从每日3000步开始，逐步增至8000步。饮食规律，细嚼慢咽，避免久坐不动。'
    }
];

// 基于健康指标的通用建议
export const GENERAL_HEALTH_ADVICE: OfflineAdvice[] = [
    {
        category: '心率',
        condition: '心率偏高',
        advice: '心率偏高，建议减缓运动强度，多做深呼吸练习。避免咖啡因摄入，保证充足睡眠。若持续异常请就医检查。'
    },
    {
        category: '心率',
        condition: '心率偏低',
        advice: '心率偏低，可能为运动员心脏或休息状态。如无不适无需担心。若伴有头晕乏力，建议医院检查。'
    },
    {
        category: '压力',
        condition: '压力过大',
        advice: '压力指数偏高，建议：1)每日冥想10-15分钟 2)适量运动释放压力 3)保证7-8小时睡眠 4)与朋友家人倾诉。'
    },
    {
        category: '睡眠',
        condition: '睡眠不足',
        advice: '睡眠时长不足7小时。建议建立规律作息，23点前入睡；睡前1小时远离屏幕；保持卧室温度18-22°C；避免睡前进食。'
    },
    {
        category: '睡眠',
        condition: '睡眠过多',
        advice: '睡眠时长超过9小时，可能导致疲倦感。建议逐步调整至7-8小时，增加白天活动量，固定起床时间。'
    },
    {
        category: '血氧',
        condition: '血氧偏低',
        advice: '血氧饱和度低于95%，建议：1)增加深呼吸练习 2)保持室内通风 3)适量有氧运动 4)若持续偏低请就医。'
    },
    {
        category: 'HRV',
        condition: 'HRV偏低',
        advice: '心率变异性偏低，表示自主神经系统疲劳。建议减少训练强度，增加恢复时间，进行瑜伽、冥想等放松活动。'
    },
    {
        category: '步数',
        condition: '运动不足',
        advice: '日均步数不足6000步。建议设定每日目标，从小目标开始逐步增加。可利用碎片时间：爬楼梯、饭后散步、提前下车步行。'
    }
];

// 境界突破建议
export const BREAKTHROUGH_ADVICE: OfflineAdvice[] = [
    {
        category: '炼气期',
        condition: '初期',
        advice: '初入道途，贵在坚持。每日运动30分钟，保持规律作息。万丈高楼平地起，勿急于求成。'
    },
    {
        category: '炼气期',
        condition: '中期',
        advice: '炼气中期，气血渐盛。可逐步增加运动强度，尝试间歇训练。配合饮食调理，多食五谷杂粮。'
    },
    {
        category: '炼气期',
        condition: '后期',
        advice: '炼气将成，筑基在望。保持当前修炼节奏，注意劳逸结合，避免过度训练。即将突破，静待时机。'
    },
    {
        category: '筑基期',
        condition: '突破',
        advice: '恭喜突破筑基！根基既稳，可探索更高强度训练。建议加入力量训练，每周3次，配合有氧运动打造强健体魄。'
    },
    {
        category: '金丹期',
        condition: '突破',
        advice: '金丹凝成，修为大进！此时应注重身心合一，练习瑜伽、太极等内外兼修之法。运动与冥想并重，方可更上层楼。'
    }
];


// 时辰养生建议（基于中医理论）
export const HOUR_BASED_ADVICE: OfflineAdvice[] = [
    {
        category: '子时',
        condition: '23:00-1:00',
        advice: '子时胆经当令，此时应熟睡以养胆气。建议23点前入睡，睡前泡脚15分钟助眠。切忌熬夜伤肝胆。'
    },
    {
        category: '丑时',
        condition: '1:00-3:00',
        advice: '丑时肝经当令，深度睡眠排毒时段。保证此时熟睡可养肝血、排毒素。若此时醒来可能肝火旺，应调整作息。'
    },
    {
        category: '寅时',
        condition: '3:00-5:00',
        advice: '寅时肺经当令，肺朝百脉。此时深睡可养肺气。若经常此时咳醒，需注意肺部健康，戒烟、远离污染。'
    },
    {
        category: '卯时',
        condition: '5:00-7:00',
        advice: '卯时大肠经当令，排浊最佳时机。建议此时起床，饮温水一杯，排便通畅。可练八段锦或简单拉伸。'
    },
    {
        category: '辰时',
        condition: '7:00-9:00',
        advice: '辰时胃经当令，早餐最佳时间。务必吃早餐，宜温热、营养丰富。此时吸收最佳，不吃早餐易伤脾胃。'
    },
    {
        category: '巳时',
        condition: '9:00-11:00',
        advice: '巳时脾经当令，工作学习最佳时段。精力旺盛，适合高强度脑力工作。可食少量坚果补充能量。'
    },
    {
        category: '午时',
        condition: '11:00-13:00',
        advice: '午时心经当令，阴阳交替之时。建议午餐后小憩15-30分钟养心气。午餐七八分饱，忌过饱。'
    },
    {
        category: '未时',
        condition: '13:00-15:00',
        advice: '未时小肠经当令，营养吸收分配。适合轻度运动如散步。多饮温水助消化，避免剧烈运动。'
    },
    {
        category: '申时',
        condition: '15:00-17:00',
        advice: '申时膀胱经当令，排尿最佳时段。多饮水促进代谢，可进行中等强度运动。此时学习记忆力佳。'
    },
    {
        category: '酉时',
        condition: '17:00-19:00',
        advice: '酉时肾经当令，强度训练最佳时间。可进行力量训练、跑步等。晚餐宜清淡，八分饱。'
    },
    {
        category: '戌时',
        condition: '19:00-21:00',
        advice: '戌时心包经当令，放松时段。可散步、做轻度瑜伽。避免剧烈运动，准备入睡。睡前泡脚养生。'
    },
    {
        category: '亥时',
        condition: '21:00-23:00',
        advice: '亥时三焦经当令，准备入睡。21点后停止剧烈活动，放下手机，可读书、冥想。22点入睡最佳。'
    }
];

/**
 * 根据当前状态获取离线建议
 */
export function getOfflineAdvice(context: {
    element?: string;
    elementScore?: number;
    hour?: number;
    cultivationStage?: string;
}): string {
    const { element, elementScore, hour, cultivationStage } = context;

    // 优先返回五行建议
    if (element && elementScore !== undefined) {
        const condition = elementScore > 80
            ? `${element}调和`
            : elementScore < 40
                ? `${element}虚弱`
                : `${element}平和`;

        const advice = FIVE_ELEMENTS_ADVICE.find(
            a => a.category.includes(element) && a.condition.includes(condition.slice(1))
        );

        if (advice) return advice.advice;
    }

    // 时辰建议
    if (hour !== undefined) {
        const timeAdvice = HOUR_BASED_ADVICE.find(a => {
            const [start, end] = a.condition.split('-').map(t => parseInt(t));
            return hour >= start && hour < end;
        });
        if (timeAdvice) return timeAdvice.advice;
    }

    // 境界建议
    if (cultivationStage) {
        const stageAdvice = BREAKTHROUGH_ADVICE.find(
            a => a.category.includes(cultivationStage)
        );
        if (stageAdvice) return stageAdvice.advice;
    }

    // 默认通用建议
    return '五行相对平衡，保持现有修炼节奏。日常坚持运动，规律作息，饮食有节，心态平和，假以时日必有所成。';
}

/**
 * 获取随机修仙格言
 */
export function getRandomWisdom(): string {
    const wisdoms = [
        '道法自然，顺应天时，强健体魄，延年益寿。',
        '修行之道，在于坚持。每日精进，必有所成。',
        '心平气和，呼吸深长，气血调和，百病不生。',
        '劳逸结合，张弛有度，过犹不及，适可而止。',
        '晨起锻炼，精神焕发；规律作息，百病消除。',
        '运动养身，冥想养心，饮食养命，睡眠养神。',
        '筑基之时，莫急莫躁；水到渠成，自然突破。',
        '五行调和，身心合一；内外兼修，长生久视。'
    ];
    return wisdoms[Math.floor(Math.random() * wisdoms.length)];
}
