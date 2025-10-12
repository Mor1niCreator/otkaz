export interface DailyTask {
  id: string;
  code: string;
  nameEn: string;
  nameRu: string;
  descriptionEn: string;
  descriptionRu: string;
  points: number;
  type: 'daily' | 'referral' | 'streak' | 'amount' | 'category';
  target?: number;
  category?: string;
  isActive: boolean;
}

export interface UserDailyTask {
  id: string;
  userId: string;
  taskId: string;
  completedAt: Date;
  pointsEarned: number;
  task: DailyTask;
}

// Ежедневные задания (по 2 на каждый день недели)
export const DAILY_TASKS: Omit<DailyTask, 'id'>[] = [
  // Понедельник
  {
    code: 'monday_save_20',
    nameEn: 'Monday Money Saver',
    nameRu: 'Понедельничный Экономист',
    descriptionEn: 'Save at least $20 today',
    descriptionRu: 'Сэкономьте минимум $20 сегодня',
    points: 15,
    type: 'amount',
    target: 20,
    isActive: true
  },
  {
    code: 'monday_3_entries',
    nameEn: 'Monday Triple',
    nameRu: 'Понедельничная Тройка',
    descriptionEn: 'Make 3 refusal entries today',
    descriptionRu: 'Сделайте 3 записи об отказе сегодня',
    points: 10,
    type: 'daily',
    target: 3,
    isActive: true
  },

  // Вторник
  {
    code: 'tuesday_habits',
    nameEn: 'Tuesday Habit Breaker',
    nameRu: 'Вторничный Борец с Привычками',
    descriptionEn: 'Refuse 2 habit-related purchases',
    descriptionRu: 'Откажитесь от 2 покупок, связанных с привычками',
    points: 12,
    type: 'category',
    target: 2,
    category: 'habits',
    isActive: true
  },
  {
    code: 'tuesday_early_bird',
    nameEn: 'Tuesday Early Bird',
    nameRu: 'Вторничная Ранняя Пташка',
    descriptionEn: 'Make your first entry before 10 AM',
    descriptionRu: 'Сделайте первую запись до 10 утра',
    points: 8,
    type: 'daily',
    target: 1,
    isActive: true
  },

  // Среда
  {
    code: 'wednesday_food',
    nameEn: 'Wednesday Food Fighter',
    nameRu: 'Средний Борец с Едой',
    descriptionEn: 'Refuse 3 food-related purchases',
    descriptionRu: 'Откажитесь от 3 покупок, связанных с едой',
    points: 15,
    type: 'category',
    target: 3,
    category: 'food',
    isActive: true
  },
  {
    code: 'wednesday_streak',
    nameEn: 'Wednesday Streak',
    nameRu: 'Средняя Серия',
    descriptionEn: 'Maintain a 3-day saving streak',
    descriptionRu: 'Поддерживайте 3-дневную серию экономии',
    points: 20,
    type: 'streak',
    target: 3,
    isActive: true
  },

  // Четверг
  {
    code: 'thursday_drinks',
    nameEn: 'Thursday Thirst Quencher',
    nameRu: 'Четверговый Утолитель Жажды',
    descriptionEn: 'Refuse 2 drink purchases',
    descriptionRu: 'Откажитесь от 2 покупок напитков',
    points: 10,
    type: 'category',
    target: 2,
    category: 'drinks',
    isActive: true
  },
  {
    code: 'thursday_high_value',
    nameEn: 'Thursday High Roller',
    nameRu: 'Четверговый Высокий Роллер',
    descriptionEn: 'Save at least $30 in one entry',
    descriptionRu: 'Сэкономьте минимум $30 в одной записи',
    points: 18,
    type: 'amount',
    target: 30,
    isActive: true
  },

  // Пятница
  {
    code: 'friday_entertainment',
    nameEn: 'Friday Fun Fighter',
    nameRu: 'Пятничный Борец с Развлечениями',
    descriptionEn: 'Refuse 2 entertainment purchases',
    descriptionRu: 'Откажитесь от 2 покупок развлечений',
    points: 12,
    type: 'category',
    target: 2,
    category: 'entertainment',
    isActive: true
  },
  {
    code: 'friday_weekend_prep',
    nameEn: 'Friday Weekend Prep',
    nameRu: 'Пятничная Подготовка к Выходным',
    descriptionEn: 'Make 5 entries today',
    descriptionRu: 'Сделайте 5 записей сегодня',
    points: 15,
    type: 'daily',
    target: 5,
    isActive: true
  },

  // Суббота
  {
    code: 'saturday_shopping',
    nameEn: 'Saturday Shopping Stopper',
    nameRu: 'Субботний Остановщик Покупок',
    descriptionEn: 'Refuse 3 shopping purchases',
    descriptionRu: 'Откажитесь от 3 покупок в магазинах',
    points: 15,
    type: 'category',
    target: 3,
    category: 'shopping',
    isActive: true
  },
  {
    code: 'saturday_big_save',
    nameEn: 'Saturday Big Saver',
    nameRu: 'Субботний Большой Экономист',
    descriptionEn: 'Save at least $50 today',
    descriptionRu: 'Сэкономьте минимум $50 сегодня',
    points: 25,
    type: 'amount',
    target: 50,
    isActive: true
  },

  // Воскресенье
  {
    code: 'sunday_reflection',
    nameEn: 'Sunday Reflection',
    nameRu: 'Воскресное Размышление',
    descriptionEn: 'Make 4 entries and review your week',
    descriptionRu: 'Сделайте 4 записи и проанализируйте неделю',
    points: 12,
    type: 'daily',
    target: 4,
    isActive: true
  },
  {
    code: 'sunday_clean_slate',
    nameEn: 'Sunday Clean Slate',
    nameRu: 'Воскресный Чистый Лист',
    descriptionEn: 'Complete all daily tasks this week',
    descriptionRu: 'Выполните все ежедневные задания на этой неделе',
    points: 30,
    type: 'streak',
    target: 7,
    isActive: true
  },

  // Специальное задание - пригласить друга
  {
    code: 'invite_friend',
    nameEn: 'Friend Inviter',
    nameRu: 'Приглашатель Друзей',
    descriptionEn: 'Invite 1 friend to join the app',
    descriptionRu: 'Пригласите 1 друга присоединиться к приложению',
    points: 20,
    type: 'referral',
    target: 1,
    isActive: true
  }
];

// Функция для получения заданий на сегодня
export function getTodaysTasks(dayOfWeek: number): Omit<DailyTask, 'id'>[] {
  const tasks: Omit<DailyTask, 'id'>[] = [];
  
  // Добавляем 2 задания для текущего дня недели (0 = воскресенье, 1 = понедельник, и т.д.)
  const dayTasks = DAILY_TASKS.filter(task => {
    const dayCode = task.code.split('_')[0];
    const dayMap: { [key: number]: string } = {
      0: 'sunday',
      1: 'monday', 
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };
    return dayCode === dayMap[dayOfWeek];
  });
  
  tasks.push(...dayTasks);
  
  // Всегда добавляем задание пригласить друга
  const referralTask = DAILY_TASKS.find(task => task.code === 'invite_friend');
  if (referralTask) {
    tasks.push(referralTask);
  }
  
  return tasks;
}

// Функция для проверки выполнения задания
export function checkTaskCompletion(
  task: DailyTask,
  userStats: {
    todayEntries: number;
    todayAmount: number;
    weekStreak: number;
    categoryCounts: { [key: string]: number };
    hasReferrals: boolean;
  }
): boolean {
  switch (task.type) {
    case 'daily':
      return userStats.todayEntries >= (task.target || 0);
    
    case 'amount':
      return userStats.todayAmount >= (task.target || 0);
    
    case 'streak':
      return userStats.weekStreak >= (task.target || 0);
    
    case 'category':
      return (userStats.categoryCounts[task.category || ''] || 0) >= (task.target || 0);
    
    case 'referral':
      return userStats.hasReferrals;
    
    default:
      return false;
  }
}