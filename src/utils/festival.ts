/**
 * 判断当前日期是否在指定日期范围内
 * @param currentDate 当前日期
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns boolean
 */
const isDateInRange = (
  currentDate: Date,
  startDate: Date,
  endDate: Date
): boolean => {
  return currentDate >= startDate && currentDate <= endDate;
};

/**
 * 获取当前节日信息
 * @returns { name: string; date: string; isToday: boolean } | null
 */
export const getCurrentFestival = (): {
  name: string;
  date: string;
  isToday: boolean;
} | null => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  // 定义节日列表
  const festivals = [
    {
      name: "元旦",
      date: `${currentYear}-01-01`,
      duration: 1, // 持续天数
    },
    {
      name: "春节",
      date: getLunarNewYear(currentYear), // 农历春节
      duration: 7,
    },
    {
      name: "清明节",
      date: getQingmingDate(currentYear),
      duration: 3,
    },
    {
      name: "劳动节",
      date: `${currentYear}-05-01`,
      duration: 5,
    },
    {
      name: "端午节",
      date: getDragonBoatDate(currentYear),
      duration: 3,
    },
    {
      name: "中秋节",
      date: getMidAutumnDate(currentYear),
      duration: 3,
    },
    {
      name: "国庆节",
      date: `${currentYear}-10-01`,
      duration: 7,
    },
  ];

  // 检查每个节日
  for (const festival of festivals) {
    const festivalDate = new Date(festival.date);
    const startDate = new Date(festivalDate);
    const endDate = new Date(festivalDate);
    endDate.setDate(startDate.getDate() + festival.duration - 1);

    if (isDateInRange(now, startDate, endDate)) {
      return {
        name: festival.name,
        date: festival.date,
        isToday: now.toDateString() === festivalDate.toDateString(),
      };
    }
  }

  return null;
};

/**
 * 获取农历春节日期（简化版，实际需要农历转换）
 * @param year 年份
 * @returns string
 */
const getLunarNewYear = (year: number): string => {
  // 这里使用简化版的春节日期计算
  // 实际项目中应该使用农历转换库
  const springFestivalDates: Record<number, string> = {
    2024: "2024-02-10",
    2025: "2025-01-29",
    2026: "2026-02-17",
  };
  return springFestivalDates[year] || `${year}-02-01`;
};

/**
 * 获取清明节日期
 * @param year 年份
 * @returns string
 */
const getQingmingDate = (year: number): string => {
  return `${year}-04-04`;
};

/**
 * 获取端午节日期（简化版）
 * @param year 年份
 * @returns string
 */
const getDragonBoatDate = (year: number): string => {
  const dragonBoatDates: Record<number, string> = {
    2024: "2024-06-10",
    2025: "2025-05-31",
    2026: "2026-06-19",
  };
  return dragonBoatDates[year] || `${year}-06-01`;
};

/**
 * 获取中秋节日期（简化版）
 * @param year 年份
 * @returns string
 */
const getMidAutumnDate = (year: number): string => {
  const midAutumnDates: Record<number, string> = {
    2024: "2024-09-17",
    2025: "2025-10-06",
    2026: "2026-09-25",
  };
  return midAutumnDates[year] || `${year}-09-15`;
};
