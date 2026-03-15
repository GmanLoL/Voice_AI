import { useState, useEffect, FormEvent, ChangeEvent } from "react";

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: string;
  category: string;
  spicy?: boolean;
  nutrition: {
    protein: string;
    fats: string;
    carbs: string;
    ingredients: string[];
    allergens: string[];
  };
  reviews: Review[];
  averageRating: number;
}

// Интерфейс для профиля пользователя
interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  balance: number;
  auto_purchase_enabled: boolean;
  allergies: string[];
  created_at: string;
}
// Добавить в интерфейсы
interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  balance: number;
  auto_purchase_enabled: boolean;
  allergies: string[];
  created_at: string;
  role: 'user' | 'cook' | 'admin';
}

interface MealIssuance {
  id: string;
  userId: string;
  userName: string;
  mealType: 'breakfast' | 'lunch';
  date: string;
  timestamp: string;
  mealName: string;
  price: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: 'овощи' | 'мясо' | 'молочные' | 'крупы' | 'напитки' | 'прочее';
  unit: 'кг' | 'л' | 'шт' | 'уп' | 'г';
  currentQuantity: number;
  minQuantity: number;
  lastUpdate: string;
}

interface PreparedDish {
  id: string;
  dishId: string;
  dishName: string;
  quantity: number;
  maxQuantity: number;
  preparedDate: string;
  expiresDate: string;
  status: 'fresh' | 'warning' | 'expired';
}


// Список возможных аллергенов
const ALL_ALLERGENS = [
  "глютен",
  "яйцо",
  "молочная продукция",
  "рыба",
  "арахис",
  "орехи",
  "соя",
  "горчица",
  "сельдерей",
  "кунжут",
  "моллюски",
  "ракообразные",
  "люпин",
  "сульфиты"
];

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Омлет с сыром",
    price: "150р",
    category: "Завтрак",
    nutrition: {
      protein: "12.7г",
      fats: "15.3г",
      carbs: "2.4г",
      ingredients: [
        "яйца",
        "молоко",
        "сыр",
        "масло сливочное",
        "соль",
      ],
      allergens: ["яйцо", "молочная продукция"],
    },
    reviews: [
      {
        id: "1",
        author: "Иван",
        rating: 4,
        comment: "Вкусный омлет, хорошая порция!",
        date: "04.02.2026",
      },
      {
        id: "2",
        author: "Мария",
        rating: 5,
        comment: "Отличный завтрак!",
        date: "03.02.2026",
      },
      {
        id: "3",
        author: "Алекс",
        rating: 3,
        comment: "Немного пересушен",
        date: "02.02.2026",
      },
    ],
    averageRating: 4.0,
  },
  {
    id: "2",
    name: "Каша овсяная",
    price: "90р",
    category: "Завтрак",
    nutrition: {
      protein: "3.2г",
      fats: "4.1г",
      carbs: "27.3г",
      ingredients: [
        "овсяные хлопья",
        "молоко",
        "сахар",
        "масло сливочное",
      ],
      allergens: ["молочная продукция"],
    },
    reviews: [
      {
        id: "4",
        author: "Петр",
        rating: 5,
        comment: "Как у бабушки!",
        date: "04.02.2026",
      },
      {
        id: "5",
        author: "Елена",
        rating: 4,
        comment: "Вкусно и полезно",
        date: "03.02.2026",
      },
    ],
    averageRating: 4.5,
  },
  {
    id: "3",
    name: "Сырники со сметаной",
    price: "140р",
    category: "Завтрак",
    nutrition: {
      protein: "11.2г",
      fats: "8.6г",
      carbs: "32.1г",
      ingredients: [
        "творог",
        "яйцо",
        "мука",
        "сахар",
        "сметана",
      ],
      allergens: ["глютен", "яйцо", "молочная продукция"],
    },
    reviews: [
      {
        id: "6",
        author: "Ольга",
        rating: 5,
        comment: "Самые вкусные сырники!",
        date: "04.02.2026",
      },
      {
        id: "7",
        author: "Дмитрий",
        rating: 5,
        comment: "Обожаю!",
        date: "02.02.2026",
      },
    ],
    averageRating: 5.0,
  },
  {
    id: "4",
    name: "Борщ с мясом",
    price: "180р",
    category: "Обед",
    nutrition: {
      protein: "8.3г",
      fats: "9.5г",
      carbs: "15.6г",
      ingredients: [
        "свёкла",
        "говядина",
        "капуста",
        "морковь",
        "картофель",
        "лук",
        "томатная паста",
      ],
      allergens: [],
    },
    reviews: [
      {
        id: "8",
        author: "Сергей",
        rating: 5,
        comment: "Настоящий борщ!",
        date: "04.02.2026",
      },
      {
        id: "9",
        author: "Наталья",
        rating: 4,
        comment: "Очень вкусный!",
        date: "03.02.2026",
      },
      {
        id: "10",
        author: "Андрей",
        rating: 5,
        comment: "Лучший в городе!",
        date: "01.02.2026",
      },
    ],
    averageRating: 4.7,
  },
  {
    id: "5",
    name: "Котлеты куриные",
    price: "160р",
    category: "Обед",
    nutrition: {
      protein: "18.2г",
      fats: "14.3г",
      carbs: "8.6г",
      ingredients: [
        "куриный фарш",
        "хлеб",
        "яйцо",
        "лук",
        "специи",
      ],
      allergens: ["глютен", "яйцо"],
    },
    reviews: [
      {
        id: "11",
        author: "Виктор",
        rating: 4,
        comment: "Сочные и вкусные!",
        date: "04.02.2026",
      },
      {
        id: "12",
        author: "Светлана",
        rating: 5,
        comment: "Отличные котлеты!",
        date: "03.02.2026",
      },
    ],
    averageRating: 4.5,
  },
  {
    id: "6",
    name: "Рыба запеченая",
    price: "220р",
    category: "Обед",
    nutrition: {
      protein: "22.5г",
      fats: "7.3г",
      carbs: "2.1г",
      ingredients: [
        "филе рыбы",
        "лимон",
        "специи",
        "масло оливковое",
      ],
      allergens: ["рыба"],
    },
    reviews: [
      {
        id: "13",
        author: "Михаил",
        rating: 4,
        comment: "Свежая рыба!",
        date: "04.02.2026",
      },
      {
        id: "14",
        author: "Юлия",
        rating: 5,
        comment: "Очень вкусно!",
        date: "02.02.2026",
      },
    ],
    averageRating: 4.5,
  },
  {
    id: "7",
    name: "Пельмени",
    price: "130р",
    category: "Обед",
    nutrition: {
      protein: "14.1г",
      fats: "8.7г",
      carbs: "28.4г",
      ingredients: ["мясной фарш", "тесто", "лук", "специи"],
      allergens: ["глютен"],
    },
    reviews: [
      {
        id: "15",
        author: "Игорь",
        rating: 5,
        comment: "Домашние, как надо!",
        date: "04.02.2026",
      },
      {
        id: "16",
        author: "Анна",
        rating: 4,
        comment: "Вкусные пельмени!",
        date: "03.02.2026",
      },
    ],
    averageRating: 4.5,
  },
  {
    id: "8",
    name: "Винегрет",
    price: "80р",
    category: "Ужин",
    nutrition: {
      protein: "2.1г",
      fats: "4.2г",
      carbs: "12.7г",
      ingredients: [
        "картофель",
        "свёкла",
        "морковь",
        "огурцы",
        "капуста",
        "масло",
      ],
      allergens: [],
    },
    reviews: [
      {
        id: "17",
        author: "Денис",
        rating: 4,
        comment: "Свежий салат!",
        date: "04.02.2026",
      },
      {
        id: "18",
        author: "Марина",
        rating: 5,
        comment: "Отличный!",
        date: "02.02.2026",
      },
    ],
    averageRating: 4.5,
  },
  {
    id: "9",
    name: "Куриный суп",
    price: "120р",
    category: "Ужин",
    nutrition: {
      protein: "8.1г",
      fats: "3.2г",
      carbs: "18.7г",
      ingredients: [
        "курица",
        "картофель",
        "морковь",
        "лук",
        "вермишель",
      ],
      allergens: ["глютен"],
    },
    reviews: [
      {
        id: "19",
        author: "Александр",
        rating: 5,
        comment: "Легкий и вкусный!",
        date: "04.02.2026",
      },
      {
        id: "20",
        author: "Оксана",
        rating: 4,
        comment: "Хороший суп!",
        date: "03.02.2026",
      },
    ],
    averageRating: 4.5,
  },
  {
    id: "10",
    name: "Гречка с грибами",
    price: "110р",
    category: "Ужин",
    nutrition: {
      protein: "5.4г",
      fats: "4.3г",
      carbs: "32.2г",
      ingredients: [
        "гречка",
        "грибы",
        "лук",
        "морковь",
        "масло",
      ],
      allergens: [],
    },
    reviews: [
      {
        id: "21",
        author: "Татьяна",
        rating: 5,
        comment: "Вкусно и сытно!",
        date: "04.02.2026",
      },
      {
        id: "22",
        author: "Владимир",
        rating: 4,
        comment: "Отличная гречка!",
        date: "01.02.2026",
      },
    ],
    averageRating: 4.5,
  },
  {
    id: "11",
    name: "Компот",
    price: "50р",
    category: "Напитки",
    nutrition: {
      protein: "0.2г",
      fats: "0г",
      carbs: "12.5г",
      ingredients: ["сухофрукты", "сахар", "вода"],
      allergens: [],
    },
    reviews: [
      {
        id: "23",
        author: "Роман",
        rating: 5,
        comment: "Освежающий!",
        date: "04.02.2026",
      },
    ],
    averageRating: 5.0,
  },
  {
    id: "12",
    name: "Чай",
    price: "30р",
    category: "Напитки",
    nutrition: {
      protein: "0г",
      fats: "0г",
      carbs: "0г",
      ingredients: ["чайный лист", "вода"],
      allergens: [],
    },
    reviews: [
      {
        id: "24",
        author: "Ирина",
        rating: 4,
        comment: "Крепкий чай!",
        date: "04.02.2026",
      },
    ],
    averageRating: 4.0,
  },
];
export default function App() {
  // Состояние входа пользователя
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Проверка при загрузке, есть ли сохраненный вход
  useEffect(() => {
    const savedLogin = localStorage.getItem("isLoggedIn");
    const savedName = localStorage.getItem("userName");
    const savedToken = localStorage.getItem("userToken");
    
    if (savedLogin === "true" && savedName && savedToken) {
      setIsLoggedIn(true);
      setUserName(savedName);
      // Загружаем профиль пользователя
      fetchUserProfile(savedToken);
    }
  }, []);
  // Добавить в интерфейсы
interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  balance: number;
  auto_purchase_enabled: boolean;
  allergies: string[];
  created_at: string;
  role: 'user' | 'cook' | 'admin'; // Добавляем поле роли
}

// Добавить состояния
const [showAdminPanel, setShowAdminPanel] = useState(false);
const [newMenuItem, setNewMenuItem] = useState({
  name: '',
  price: '',
  category: 'Завтрак',
  spicy: false,
  nutrition: {
    protein: '',
    fats: '',
    carbs: '',
    ingredients: [] as string[],
    allergens: [] as string[],
  }
});
const [ingredientInput, setIngredientInput] = useState('');
const [allergenInput, setAllergenInput] = useState('');
const [orders, setOrders] = useState<any[]>([]); // Для управления заказами
// Функция для открытия админ-панели
const handleAdminPanelClick = () => {
  setShowAdminPanel(true);
  triggerGlitch();
};
// Функция для добавления нового блюда
const handleAddMenuItem = () => {
  if (!newMenuItem.name || !newMenuItem.price) {
    alert('Заполните обязательные поля!');
    return;
  }

  const newItem: MenuItem = {
    id: (menuItems.length + 1).toString(),
    name: newMenuItem.name,
    price: newMenuItem.price,
    category: newMenuItem.category,
    spicy: newMenuItem.spicy,
    nutrition: { ...newMenuItem.nutrition },
    reviews: [],
    averageRating: 0,
  };

  setNewMenuItems([...menuItems, newItem]);
  
  // Сброс формы
  setNewMenuItem({
    name: '',
    price: '',
    category: 'Завтрак',
    spicy: false,
    nutrition: {
      protein: '',
      fats: '',
      carbs: '',
      ingredients: [],
      allergens: [],
    }
  });
  setIngredientInput('');
  setAllergenInput('');
  
  alert('Блюдо добавлено!');
};


// Функция для удаления блюда
const handleDeleteMenuItem = (id: string) => {
  if (window.confirm('Вы уверены, что хотите удалить это блюдо?')) {
    setMenuItems(menuItems.filter(item => item.id !== id));
  }
};

// Функция для добавления ингредиента
const handleAddIngredient = () => {
  if (ingredientInput.trim()) {
    setNewMenuItem({
      ...newMenuItem,
      nutrition: {
        ...newMenuItem.nutrition,
        ingredients: [...newMenuItem.nutrition.ingredients, ingredientInput.trim()]
      }
    });
    setIngredientInput('');
  }
};

// Функция для добавления аллергена
const handleAddAllergen = () => {
  if (allergenInput.trim()) {
    setNewMenuItem({
      ...newMenuItem,
      nutrition: {
        ...newMenuItem.nutrition,
        allergens: [...newMenuItem.nutrition.allergens, allergenInput.trim()]
      }
    });
    setAllergenInput('');
  }
};

// Функция для удаления ингредиента
const handleRemoveIngredient = (index: number) => {
  const newIngredients = [...newMenuItem.nutrition.ingredients];
  newIngredients.splice(index, 1);
  setNewMenuItem({
    ...newMenuItem,
    nutrition: {
      ...newMenuItem.nutrition,
      ingredients: newIngredients
    }
  });
};

// Функция для удаления аллергена
const handleRemoveAllergen = (index: number) => {
  const newAllergens = [...newMenuItem.nutrition.allergens];
  newAllergens.splice(index, 1);
  setNewMenuItem({
    ...newMenuItem,
    nutrition: {
      ...newMenuItem.nutrition,
      allergens: newAllergens
    }
  });
};
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  // Состояния для формы входа
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Состояния для формы регистрации
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  
  // Состояния для сброса пароля
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  
  // Состояния для профиля
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [autoPurchase, setAutoPurchase] = useState(false);
  const [balance, setBalance] = useState(0);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("ВСЕ");
  const [rushLevel, setRushLevel] = useState(67);
  const [studentsServed, setStudentsServed] = useState(342);
  const [glitchElements, setGlitchElements] = useState<number[]>([]);
  const [showMailPopup, setShowMailPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showZablPopup, setShowZablPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showNewAccPopup, setShowNewAccPopup] = useState(false);

  const getBaseUrl = () => {
    // В продакшене будет другой URL
    if (import.meta.env.PROD) {
      return 'http://0.0.0.0:8000/api';
    }
    // В разработке используем текущий IP
    return `http://${window.location.hostname}:8000/api`;
  };

  const API_BASE_URL = getBaseUrl();

  // Функция для загрузки профиля пользователя
  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки профиля: ${response.status}`);
      }

      const data = await response.json();
      setUserProfile(data);
      setSelectedAllergies(data.allergies || []);
      setAutoPurchase(data.auto_purchase_enabled || false);
      setBalance(data.balance || 0);
    } catch (error) {
      console.error("Ошибка при загрузке профиля:", error);
    }
  };
  const [activeCookTab, setActiveCookTab] = useState<'issuance' | 'inventory' | 'prepared'>('issuance');
const [mealIssuances, setMealIssuances] = useState<MealIssuance[]>([
  {
    id: '1',
    userId: 'user1',
    userName: 'Иван Петров',
    mealType: 'breakfast',
    date: '05.02.2026',
    timestamp: '08:30',
    mealName: 'Омлет с сыром',
    price: '150р'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Мария Сидорова',
    mealType: 'lunch',
    date: '05.02.2026',
    timestamp: '12:15',
    mealName: 'Борщ с мясом',
    price: '180р'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Алексей Иванов',
    mealType: 'breakfast',
    date: '05.02.2026',
    timestamp: '08:45',
    mealName: 'Сырники со сметаной',
    price: '140р'
  },
]);

const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
  {
    id: '1',
    name: 'Картофель',
    category: 'овощи',
    unit: 'кг',
    currentQuantity: 25.5,
    minQuantity: 10,
    lastUpdate: '04.02.2026'
  },
  {
    id: '2',
    name: 'Говядина',
    category: 'мясо',
    unit: 'кг',
    currentQuantity: 8.2,
    minQuantity: 5,
    lastUpdate: '04.02.2026'
  },
  {
    id: '3',
    name: 'Молоко',
    category: 'молочные',
    unit: 'л',
    currentQuantity: 12.5,
    minQuantity: 8,
    lastUpdate: '05.02.2026'
  },
  {
    id: '4',
    name: 'Яйца',
    category: 'прочее',
    unit: 'шт',
    currentQuantity: 180,
    minQuantity: 100,
    lastUpdate: '05.02.2026'
  },
  {
    id: '5',
    name: 'Овсяные хлопья',
    category: 'крупы',
    unit: 'кг',
    currentQuantity: 15.3,
    minQuantity: 8,
    lastUpdate: '03.02.2026'
  },
  {
    id: '6',
    name: 'Сыр',
    category: 'молочные',
    unit: 'кг',
    currentQuantity: 4.2,
    minQuantity: 3,
    lastUpdate: '05.02.2026'
  },
  {
    id: '7',
    name: 'Хлеб',
    category: 'прочее',
    unit: 'шт',
    currentQuantity: 25,
    minQuantity: 15,
    lastUpdate: '05.02.2026'
  },
]);

const [preparedDishes, setPreparedDishes] = useState<PreparedDish[]>([
  {
    id: '1',
    dishId: '1',
    dishName: 'Омлет с сыром',
    quantity: 18,
    maxQuantity: 25,
    preparedDate: '05.02.2026',
    expiresDate: '05.02.2026',
    status: 'fresh'
  },
  {
    id: '2',
    dishId: '4',
    dishName: 'Борщ с мясом',
    quantity: 15,
    maxQuantity: 20,
    preparedDate: '05.02.2026',
    expiresDate: '05.02.2026',
    status: 'fresh'
  },
  {
    id: '3',
    dishId: '5',
    dishName: 'Котлеты куриные',
    quantity: 12,
    maxQuantity: 20,
    preparedDate: '05.02.2026',
    expiresDate: '05.02.2026',
    status: 'fresh'
  },
  {
    id: '4',
    dishId: '3',
    dishName: 'Сырники со сметаной',
    quantity: 8,
    maxQuantity: 15,
    preparedDate: '04.02.2026',
    expiresDate: '05.02.2026',
    status: 'warning'
  },
  {
    id: '5',
    dishId: '2',
    dishName: 'Каша овсяная',
    quantity: 22,
    maxQuantity: 30,
    preparedDate: '05.02.2026',
    expiresDate: '05.02.2026',
    status: 'fresh'
  },
]);

const [newIssuance, setNewIssuance] = useState({
  userId: '',
  userName: '',
  mealType: 'breakfast' as 'breakfast' | 'lunch',
  mealId: '',
  mealName: '',
});

const [newInventoryItem, setNewInventoryItem] = useState({
  name: '',
  category: 'овощи' as InventoryItem['category'],
  unit: 'кг' as InventoryItem['unit'],
  currentQuantity: 0,
  minQuantity: 0,
});

const [newPreparedDish, setNewPreparedDish] = useState({
  dishId: '',
  dishName: '',
  quantity: 0,
  maxQuantity: 0,
});

// Функции для работы с учетом выдачи
const handleAddMealIssuance = () => {
  if (!newIssuance.userId || !newIssuance.userName || !newIssuance.mealName) {
    alert('Заполните все поля!');
    return;
  }

  const issuance: MealIssuance = {
    id: (mealIssuances.length + 1).toString(),
    userId: newIssuance.userId,
    userName: newIssuance.userName,
    mealType: newIssuance.mealType,
    date: new Date().toLocaleDateString('ru-RU'),
    timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    mealName: newIssuance.mealName,
    price: menuItems.find(item => item.id === newIssuance.mealId)?.price || '0р'
  };

  setMealIssuances([issuance, ...mealIssuances]);
  
  // Уменьшаем количество приготовленного блюда
  setPreparedDishes(prev => prev.map(dish => {
    if (dish.dishId === newIssuance.mealId && dish.quantity > 0) {
      return { ...dish, quantity: dish.quantity - 1 };
    }
    return dish;
  }));

  // Сброс формы
  setNewIssuance({
    userId: '',
    userName: '',
    mealType: 'breakfast',
    mealId: '',
    mealName: '',
  });
};

// Функции для работы с инвентарем
const handleAddInventoryItem = () => {
  if (!newInventoryItem.name || newInventoryItem.currentQuantity <= 0) {
    alert('Заполните обязательные поля!');
    return;
  }

  const item: InventoryItem = {
    id: (inventoryItems.length + 1).toString(),
    name: newInventoryItem.name,
    category: newInventoryItem.category,
    unit: newInventoryItem.unit,
    currentQuantity: newInventoryItem.currentQuantity,
    minQuantity: newInventoryItem.minQuantity,
    lastUpdate: new Date().toLocaleDateString('ru-RU')
  };

  setInventoryItems([...inventoryItems, item]);
  setNewInventoryItem({
    name: '',
    category: 'овощи',
    unit: 'кг',
    currentQuantity: 0,
    minQuantity: 0,
  });
};

const handleUpdateInventoryQuantity = (id: string, change: number) => {
  setInventoryItems(prev => prev.map(item => {
    if (item.id === id) {
      const newQuantity = Math.max(0, item.currentQuantity + change);
      return {
        ...item,
        currentQuantity: newQuantity,
        lastUpdate: new Date().toLocaleDateString('ru-RU')
      };
    }
    return item;
  }));
};

// Функции для работы с приготовленными блюдами
const handleAddPreparedDish = () => {
  if (!newPreparedDish.dishName || newPreparedDish.quantity <= 0) {
    alert('Заполните обязательные поля!');
    return;
  }

  const dish: PreparedDish = {
    id: (preparedDishes.length + 1).toString(),
    dishId: newPreparedDish.dishId || Date.now().toString(),
    dishName: newPreparedDish.dishName,
    quantity: newPreparedDish.quantity,
    maxQuantity: newPreparedDish.maxQuantity,
    preparedDate: new Date().toLocaleDateString('ru-RU'),
    expiresDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
    status: 'fresh'
  };

  setPreparedDishes([...preparedDishes, dish]);
  setNewPreparedDish({
    dishId: '',
    dishName: '',
    quantity: 0,
    maxQuantity: 0,
  });
};

const handleUpdatePreparedDishQuantity = (id: string, change: number) => {
  setPreparedDishes(prev => prev.map(dish => {
    if (dish.id === id) {
      const newQuantity = Math.max(0, Math.min(dish.maxQuantity, dish.quantity + change));
      return {
        ...dish,
        quantity: newQuantity,
        status: newQuantity <= 5 ? 'warning' : 'fresh'
      };
    }
    return dish;
  }));
};

const handleRemoveExpiredDish = (id: string) => {
  if (window.confirm('Удалить это блюдо как испорченное?')) {
    setPreparedDishes(prev => prev.filter(dish => dish.id !== id));
  }
};

// Функция для получения статистики
const getIssuanceStats = () => {
  const today = new Date().toLocaleDateString('ru-RU');
  const todayIssuances = mealIssuances.filter(issuance => issuance.date === today);
  
  const breakfastCount = todayIssuances.filter(i => i.mealType === 'breakfast').length;
  const lunchCount = todayIssuances.filter(i => i.mealType === 'lunch').length;
  
  const breakfastItems = todayIssuances
    .filter(i => i.mealType === 'breakfast')
    .reduce((acc, item) => {
      acc[item.mealName] = (acc[item.mealName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  const lunchItems = todayIssuances
    .filter(i => i.mealType === 'lunch')
    .reduce((acc, item) => {
      acc[item.mealName] = (acc[item.mealName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  return {
    totalToday: todayIssuances.length,
    breakfastCount,
    lunchCount,
    breakfastItems,
    lunchItems
  };
};

  // Функция для сохранения профиля пользователя
  const saveUserProfile = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(false);

    try {
      const profileData = {
        allergies: selectedAllergies,
        auto_purchase_enabled: autoPurchase,
        balance: balance
      };

      const response = await fetch(`${API_BASE_URL}/user/profile/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`Ошибка сохранения профиля: ${response.status}`);
      }

      const data = await response.json();
      setUserProfile(data);
      setProfileSuccess(true);
      
      // Автоматически скрываем сообщение об успехе через 3 секунды
      setTimeout(() => {
        setProfileSuccess(false);
      }, 3000);
      
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "Неизвестная ошибка");
      console.error("Ошибка при сохранении профиля:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  // Функция для входа
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
// Добавить состояние для отображения панели повара
const [showCookPanel, setShowCookPanel] = useState(false);
    try {
      const loginData = {
        username: loginUsername,
        password: loginPassword,
      };

      console.log("Отправка данных для входа:", loginData);
      
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setSuccess(true);
      console.log("Успешный вход:", data);
      
      // Сохраняем данные входа в localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", loginUsername);
      localStorage.setItem("userToken", data.access_token || data.token || "demo-token");
      
      // Загружаем профиль пользователя
      await fetchUserProfile(data.access_token || data.token || "demo-token");
      
      // Обновляем состояние
      setIsLoggedIn(true);
      setUserName(loginUsername);
      
      setShowLoginPopup(false);
      
      // Сброс формы
      setLoginUsername("");
      setLoginPassword("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Неизвестная ошибка");
      console.error("Ошибка при входе:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для выхода
  const handleLogout = () => {
    // Удаляем данные из localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userToken");
    
    // Обновляем состояние
    setIsLoggedIn(false);
    setUserName("");
    setUserProfile(null);
    setSelectedAllergies([]);
    setAutoPurchase(false);
    setBalance(0);
    
    triggerGlitch();
  };

  // Функция для открытия профиля
  const handleProfileClick = () => {
    const token = localStorage.getItem("userToken");
    if (token) {
      fetchUserProfile(token);
    }
    setShowProfilePopup(true);
    triggerGlitch();
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRegisterError(null);
    setRegisterSuccess(false);
    

    // Валидация пароля
    if (registerPassword.length < 6) {
      setRegisterError("Пароль должен содержать минимум 6 символов");
      setIsLoading(false);
      return;
    }

    try {
      const formData = {
        name: registerName,
        email: registerEmail,
        username: registerUsername,
        password: registerPassword,
      };

      console.log("Отправка данных для регистрации:", formData);
      
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Обработка ошибок от сервера
        throw new Error(data.message || data.detail || `Ошибка: ${response.status} ${response.statusText}`);
      }

      // Успешная регистрация
      console.log("Успешная регистрация:", data);
      setRegisterSuccess(true);
      
      // Закрываем попап регистрации и открываем попап успеха
      setTimeout(() => {
        setShowRegisterPopup(false);
        setShowNewAccPopup(true);
      }, 1000);
      
      // Сброс формы
      setRegisterName("");
      setRegisterEmail("");
      setRegisterUsername("");
      setRegisterPassword("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
      setRegisterError(errorMessage);
      console.error("Ошибка при регистрации:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const CheckTwoPass = (pass1: string, pass2: string) => {
    return pass1 === pass2;
  };

  const SwitchToPassword = () => {
    setShowMailPopup(false);
    setShowPasswordPopup(true);
  };

  const SwitchToZabl = () => {
    setShowLoginPopup(false);
    setShowZablPopup(true);
  };

  const SwitchToEmail = () => {
    setShowZablPopup(false);
    setShowMailPopup(true);
  };

  const categories = ["ВСЕ", "Завтрак", "Обед", "Ужин"];

  // Обработчик для сброса пароля (шаг 1 - email)
  const handleResetEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const resetData = { email: resetEmail };
      console.log("Запрос сброса пароля для email:", resetEmail);
      
      // Здесь будет реальный запрос к API
      const response = await fetch(`${API_BASE_URL}/auth/reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetData),
      });
      
      if (response.ok) {
        SwitchToEmail();
      }
    } catch (error) {
      console.error("Ошибка при запросе сброса пароля:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик для сброса пароля (шаг 2 - код)
  const handleResetCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Проверка кода
    console.log("Проверка кода:", resetCode);
    
    // Если код верный
    SwitchToPassword();
  };

  // Обработчик для сброса пароля (шаг 3 - новый пароль)
  const handleNewPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!CheckTwoPass(newPassword, repeatPassword)) {
      alert("Пароли не совпадают!");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const passwordData = {
        email: resetEmail,
        code: resetCode,
        newPassword: newPassword,
      };
      
      console.log("Установка нового пароля:", passwordData);
      
      // Здесь будет реальный запрос к API
      const response = await fetch(`${API_BASE_URL}/auth/password-update/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });
      
      if (response.ok) {
        setShowPasswordPopup(false);
        alert("Пароль успешно изменен!");
        
        // Сброс всех полей сброса пароля
        setResetEmail("");
        setResetCode("");
        setNewPassword("");
        setRepeatPassword("");
      }
    } catch (error) {
      console.error("Ошибка при смене пароля:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems =
    selectedCategory === "ВСЕ"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const SwithParametrButton = () => {
    setShowLoginPopup(false);
    setShowRegisterPopup(true);
    setRegisterError(null);
  };

  const triggerGlitch = () => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 200);
  };

  // Обработчик изменения выбора аллергии
  const handleAllergyChange = (allergy: string) => {
    setSelectedAllergies(prev => {
      if (prev.includes(allergy)) {
        return prev.filter(a => a !== allergy);
      } else {
        return [...prev, allergy];
      }
    });
  };

  // Simulate fluctuating rush level
  useEffect(() => {
    const interval = setInterval(() => {
      setRushLevel((prev) =>
        Math.max(
          30,
          Math.min(95, prev + (Math.random() - 0.5) * 10),
        ),
      );
      setStudentsServed(
        (prev) => prev + Math.floor(Math.random() * 3),
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Random glitch effect with big cooldown
  useEffect(() => {
    const triggerRandomGlitch = () => {
      // Pick 2-4 random elements to glitch
      const numGlitches = Math.floor(Math.random() * 3) + 2;
      const glitched = Array.from({ length: numGlitches }, () =>
        Math.floor(Math.random() * 100),
      );
      setGlitchElements(glitched);

      setTimeout(() => {
        setGlitchElements([]);
      }, 150);
    };
    
    // Trigger glitch every 8-15 seconds
    const scheduleNextGlitch = () => {
      const delay = 8000 + Math.random() * 7000;
      return setTimeout(triggerRandomGlitch, delay);
    };

    let timeout = scheduleNextGlitch();

    return () => clearTimeout(timeout);
  }, [glitchElements]);

  return (
    <div className="size-full min-h-screen bg-black text-white overflow-x-hidden">
      {/* Scanline effect */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff00 2px, #00ff00 4px)",
        }}
      />

      {/* Shimmer overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-40 opacity-20"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,0,0,0.1) 25%, rgba(0,255,0,0.1) 50%, rgba(255,0,0,0.1) 75%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 3s linear infinite",
        }}
      />

      <style>{`
        @keyframes glow {
          0%, 100% { 
            text-shadow: 0 0 8px currentColor, 0 0 15px currentColor, 0 0 25px currentColor; 
          }
          50% { 
            text-shadow: 0 0 12px currentColor, 0 0 25px currentColor, 0 0 40px currentColor, 0 0 60px currentColor; 
          }
        }
        @keyframes nixie-glow {
          0%, 100% { 
            filter: brightness(1) drop-shadow(0 0 8px currentColor);
          }
          50% { 
            filter: brightness(1.3) drop-shadow(0 0 15px currentColor) drop-shadow(0 0 25px currentColor);
          }
        }
        .glitch-element {
          animation: glitch 0.15s steps(2, end);
        }
        @keyframes glitch {
          0% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          20% {
            transform: translate(-3px, 2px);
            filter: hue-rotate(90deg);
          }
          40% {
            transform: translate(3px, -2px);
            filter: hue-rotate(180deg);
          }
          60% {
            transform: translate(-2px, -3px);
            filter: hue-rotate(270deg);
          }
          80% {
            transform: translate(2px, 3px);
            filter: hue-rotate(360deg);
          }
          100% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
        }
      `}</style>

      {/* Header */}
      <header className="relative border-b-4 border-red-600 p-6 bg-black">
        <div
          className={`max-w-7xl mx-auto ${glitchActive ? "animate-pulse" : ""}`}
        >
          <div className="flex justify-between items-start mb-4">
            <h1
              className="text-6xl md:text-8xl tracking-tighter relative shimmer-text"
              style={{
                fontFamily: 'Impact, "Arial Black", sans-serif',
                textShadow:
                  "3px 3px 0px #ff0000, 6px 6px 0px #00ff00",
                transform: "skew(-5deg)",
              }}
              onMouseEnter={triggerGlitch}
            >
              <span className="text-white">СТОЛОВАЯ</span>
              <span className="text-red-600">//</span>
              <span className="text-green-500">ЕДА</span>
            </h1>

            {/* Account Button - изменено в зависимости от состояния входа */}
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleProfileClick}
                  className="border-2 border-green-500 bg-black text-green-500 px-6 py-3 hover:border-red-600 hover:text-red-600 transition-all relative overflow-hidden group"
                  style={{
                    clipPath: "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
                    fontFamily: "monospace",
                  }}
                >
                  <span className="relative z-10 tracking-wider text-sm">
                    [{userName.toUpperCase()}]
                  </span>
                  <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                </button>
                <button
                  onClick={handleLogout}
                  className="border-2 border-red-600 bg-black text-red-600 px-6 py-3 hover:bg-red-600 hover:text-black transition-all relative overflow-hidden group"
                  style={{
                    clipPath: "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
                    fontFamily: "monospace",
                  }}
                >
                  <span className="relative z-10 tracking-wider text-sm">
                    [ВЫХОД]
                  </span>
                  <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-20 transition-opacity" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowLoginPopup(true);
                  triggerGlitch();
                }}
                className="border-2 border-green-500 bg-black text-green-500 px-6 py-3 hover:bg-red-600 hover:border-red-600 hover:text-black transition-all relative overflow-hidden group"
                style={{
                  clipPath: "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
                  fontFamily: "monospace",
                }}
              >
                <span className="relative z-10 tracking-wider text-sm">
                  [АККАУНТ]
                </span>
                <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="px-3 py-1 bg-red-600 text-black transform -skew-x-12">
              <span className="block transform skew-x-12 text-sm">
                ОТКРЫТО 11:00-15:00
              </span>
            </div>
            <div className="px-3 py-1 bg-green-500 text-black transform skew-x-12">
              <span className="block transform -skew-x-12 text-sm">
                ПН-ПТ
              </span>
            </div>
            <div className="text-red-600 text-2xl animate-pulse">
              ◆
            </div>
            <div className="text-green-500 text-sm">
              НАЛИЧНЫЕ//КАРТА//СТУД_БИЛЕТ
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Gas Discharge Indicator Panel */}
        <section className="mb-12">
          <div
            className="border-4 border-green-500 bg-black p-6 relative"
            style={{
              boxShadow:
                "inset 0 0 20px rgba(0,255,0,0.2), 0 0 20px rgba(0,255,0,0.3)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Students Served Counter */}
              <div>
                <div
                  className="text-green-500 text-xs mb-3 tracking-widest"
                  style={{ fontFamily: "monospace" }}
                >
                  [ОБСЛУЖЕНО_СЕГОДНЯ]
                </div>
                <div className="flex gap-3 items-center justify-center">
                  {studentsServed
                    .toString()
                    .padStart(4, "0")
                    .split("")
                    .map((digit, i) => (
                      <div
                        key={i}
                        className="relative bg-gradient-to-b from-zinc-950 to-black rounded-sm overflow-hidden"
                        style={{
                          width: "70px",
                          height: "100px",
                          boxShadow:
                            "inset 0 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,0,0,0.4)",
                        }}
                      >
                        {/* Glass reflection effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-20" />

                        {/* Nixie tube glow background */}
                        <div
                          className="absolute inset-0 opacity-30"
                          style={{
                            background:
                              "radial-gradient(ellipse at center, rgba(255,0,0,0.6) 0%, transparent 70%)",
                          }}
                        />

                        {/* The digit itself */}
                        <div
                          className="absolute inset-0 flex items-center justify-center text-6xl"
                          style={{
                            fontFamily:
                              '"Courier New", monospace',
                            color: "#ff3300",
                            textShadow: `
                            0 0 10px #ff0000,
                            0 0 20px #ff0000,
                            0 0 30px #ff0000,
                            0 0 40px #ff3300,
                            0 0 70px #ff3300,
                            0 0 80px #ff3300
                          `,
                            fontWeight: "bold",
                            animation:
                              "nixie-glow 2s ease-in-out infinite",
                            animationDelay: `${i * 0.15}s`,
                          }}
                        >
                          {digit}
                        </div>

                        {/* Pulsing glow overlay */}
                        <div
                          className="absolute inset-0 animate-pulse"
                          style={{
                            background:
                              "radial-gradient(ellipse at center, rgba(255,50,0,0.2) 0%, transparent 60%)",
                            animationDuration: "2s",
                            animationDelay: `${i * 0.15}s`,
                          }}
                        />

                        {/* Tube segments/cathodes */}
                        <div className="absolute inset-0 pointer-events-none opacity-10">
                          <div className="absolute top-2 left-2 right-2 h-px bg-red-600" />
                          <div className="absolute bottom-2 left-2 right-2 h-px bg-red-600" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Rush Level Meter */}
              <div>
                <div
                  className="text-green-500 text-xs mb-3 tracking-widest"
                  style={{ fontFamily: "monospace" }}
                >
                  [УРОВЕНЬ_НАГРУЗКИ]
                </div>
                <div className="relative">
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const isActive =
                        (i / 20) * 100 < rushLevel;
                      const isHigh = i >= 15;
                      const isMedium = i >= 10 && i < 15;
                      return (
                        <div
                          key={i}
                          className={`flex-1 h-12 border border-green-500 transition-all ${isActive
                              ? isHigh
                                ? "bg-red-600"
                                : isMedium
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              : "bg-black"
                            }`}
                          style={{
                            boxShadow: isActive
                              ? `0 0 10px ${isHigh ? "#ff0000" : isMedium ? "#ffff00" : "#00ff00"}`
                              : "none",
                            opacity: isActive ? 1 : 0.3,
                          }}
                        />
                      );
                    })}
                  </div>
                  <div
                    className="text-right text-3xl text-white"
                    style={{ fontFamily: "monospace" }}
                  >
                    {Math.round(rushLevel)}%
                    <span
                      className={`ml-2 text-sm ${rushLevel >= 75
                          ? "text-red-600"
                          : rushLevel >= 50
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                    >
                      {rushLevel >= 75
                        ? "[КРИТИЧНО]"
                        : rushLevel >= 50
                          ? "[УМЕРЕННО]"
                          : "[НОРМАЛЬНО]"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
{showCookPanel && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
    <div
      className="relative bg-black border-4 border-yellow-500 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      style={{
        boxShadow: "0 0 30px rgba(255,165,0,0.5), inset 0 0 20px rgba(255,165,0,0.2)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="border-b-4 border-orange-500 p-4 bg-gradient-to-r from-black via-zinc-900 to-black relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-orange-500 opacity-50" />
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-3xl text-yellow-500 mb-1" style={{ fontFamily: "Impact, sans-serif", textShadow: "2px 2px 0px #ff4500" }}>
              [ПАНЕЛЬ_ПОВАРА]
            </h3>
            <div className="text-sm text-orange-500" style={{ fontFamily: "monospace" }}>
              {userProfile?.role === 'admin' ? 'АДМИНИСТРАТОР_И_ПОВАР' : 'ПОВАР'}
            </div>
          </div>
          <button onClick={() => setShowCookPanel(false)} className="text-yellow-500 hover:text-white border-2 border-yellow-500 hover:bg-yellow-500 px-3 py-1 transition-all" style={{ fontFamily: "monospace" }}>
            [X]
          </button>
        </div>
      </div>

      {/* Статистика за сегодня */}
      <div className="p-4 border-b-2 border-yellow-500 bg-black/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border-2 border-green-500 p-3">
            <div className="text-xs text-green-500 mb-1" style={{ fontFamily: "monospace" }}>[ВСЕГО_ВЫДАНО]</div>
            <div className="text-2xl text-white text-center" style={{ fontFamily: "monospace" }}>{getIssuanceStats().totalToday}</div>
          </div>
          <div className="border-2 border-yellow-500 p-3">
            <div className="text-xs text-yellow-500 mb-1" style={{ fontFamily: "monospace" }}>[ЗАВТРАКОВ]</div>
            <div className="text-2xl text-white text-center" style={{ fontFamily: "monospace" }}>{getIssuanceStats().breakfastCount}</div>
          </div>
          <div className="border-2 border-orange-500 p-3">
            <div className="text-xs text-orange-500 mb-1" style={{ fontFamily: "monospace" }}>[ОБЕДОВ]</div>
            <div className="text-2xl text-white text-center" style={{ fontFamily: "monospace" }}>{getIssuanceStats().lunchCount}</div>
          </div>
          <div className="border-2 border-red-500 p-3">
            <div className="text-xs text-red-500 mb-1" style={{ fontFamily: "monospace" }}>[НИЗКИЕ_ОСТАТКИ]</div>
            <div className="text-2xl text-white text-center" style={{ fontFamily: "monospace" }}>
              {inventoryItems.filter(item => item.currentQuantity <= item.minQuantity).length}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Вкладки */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setActiveCookTab('issuance')}
            className={`px-4 py-2 border-2 transition-all ${activeCookTab === 'issuance' ? 'bg-yellow-500 border-yellow-500 text-black' : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black'}`}
            style={{ fontFamily: "monospace" }}
          >
            [УЧЕТ_ВЫДАЧИ]
          </button>
          <button
            onClick={() => setActiveCookTab('inventory')}
            className={`px-4 py-2 border-2 transition-all ${activeCookTab === 'inventory' ? 'bg-green-500 border-green-500 text-black' : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black'}`}
            style={{ fontFamily: "monospace" }}
          >
            [СКЛАД_ПРОДУКТОВ]
          </button>
          <button
            onClick={() => setActiveCookTab('prepared')}
            className={`px-4 py-2 border-2 transition-all ${activeCookTab === 'prepared' ? 'bg-blue-500 border-blue-500 text-black' : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-black'}`}
            style={{ fontFamily: "monospace" }}
          >
            [ГОТОВЫЕ_БЛЮДА]
          </button>
        </div>

        {/* Вкладка Учета выдачи */}
        {activeCookTab === 'issuance' && (
          <div className="space-y-6">
            <div className="border-2 border-yellow-500 p-4">
              <div className="text-xs text-yellow-500 mb-4 tracking-widest" style={{ fontFamily: "monospace" }}>
                [НОВАЯ_ВЫДАЧА]
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [ID_ПОЛЬЗОВАТЕЛЯ]
                  </label>
                  <input
                    type="text"
                    value={newIssuance.userId}
                    onChange={(e) => setNewIssuance({...newIssuance, userId: e.target.value})}
                    className="w-full p-3 bg-black border-2 border-green-500 text-white focus:border-red-600 focus:outline-none transition-colors"
                    style={{ fontFamily: "monospace" }}
                    placeholder="ВВЕДИТЕ_ID"
                  />
                </div>
                
                <div>
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [ИМЯ_ПОЛЬЗОВАТЕЛЯ]
                  </label>
                  <input
                    type="text"
                    value={newIssuance.userName}
                    onChange={(e) => setNewIssuance({...newIssuance, userName: e.target.value})}
                    className="w-full p-3 bg-black border-2 border-green-500 text-white focus:border-red-600 focus:outline-none transition-colors"
                    style={{ fontFamily: "monospace" }}
                    placeholder="ВВЕДИТЕ_ИМЯ"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [ТИП_ПИТАНИЯ]
                  </label>
                  <select
                    value={newIssuance.mealType}
                    onChange={(e) => setNewIssuance({...newIssuance, mealType: e.target.value as 'breakfast' | 'lunch'})}
                    className="w-full p-3 bg-black border-2 border-green-500 text-white focus:border-red-600 focus:outline-none transition-colors"
                    style={{ fontFamily: "monospace" }}
                  >
                    <option value="breakfast">ЗАВТРАК</option>
                    <option value="lunch">ОБЕД</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [БЛЮДО]
                  </label>
                  <select
                    value={newIssuance.mealId}
                    onChange={(e) => {
                      const selected = menuItems.find(item => item.id === e.target.value);
                      setNewIssuance({
                        ...newIssuance,
                        mealId: e.target.value,
                        mealName: selected?.name || ''
                      });
                    }}
                    className="w-full p-3 bg-black border-2 border-green-500 text-white focus:border-red-600 focus:outline-none transition-colors"
                    style={{ fontFamily: "monospace" }}
                  >
                    <option value="">ВЫБЕРИТЕ_БЛЮДО</option>
                    {menuItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                onClick={handleAddMealIssuance}
                className="w-full p-4 bg-yellow-500 text-black border-2 border-yellow-500 hover:bg-orange-500 hover:border-orange-500 transition-all relative overflow-hidden group"
                style={{ fontFamily: "monospace" }}
              >
                <span className="block text-lg tracking-widest">[ЗАФИКСИРОВАТЬ_ВЫДАЧУ]</span>
              </button>
            </div>

            {/* История выдачи за сегодня */}
            <div className="border-2 border-yellow-500 p-4">
              <div className="text-xs text-yellow-500 mb-4 tracking-widest" style={{ fontFamily: "monospace" }}>
                [ВЫДАЧА_ЗА_СЕГОДНЯ]
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-white" style={{ fontFamily: "monospace" }}>
                  <thead>
                    <tr className="border-b-2 border-yellow-500">
                      <th className="p-3 text-left text-sm">ВРЕМЯ</th>
                      <th className="p-3 text-left text-sm">ПОЛЬЗОВАТЕЛЬ</th>
                      <th className="p-3 text-left text-sm">ТИП</th>
                      <th className="p-3 text-left text-sm">БЛЮДО</th>
                      <th className="p-3 text-left text-sm">СТАТУС</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mealIssuances
                      .filter(issuance => issuance.date === new Date().toLocaleDateString('ru-RU'))
                      .map(issuance => (
                        <tr key={issuance.id} className="border-b border-gray-700 hover:bg-yellow-500/10">
                          <td className="p-3 text-sm">{issuance.timestamp}</td>
                          <td className="p-3 text-sm">
                            <div>{issuance.userName}</div>
                            <div className="text-xs text-gray-400">ID: {issuance.userId}</div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs ${issuance.mealType === 'breakfast' ? 'bg-yellow-500 text-black' : 'bg-orange-500 text-black'}`}>
                              {issuance.mealType === 'breakfast' ? 'ЗАВТРАК' : 'ОБЕД'}
                            </span>
                          </td>
                          <td className="p-3 text-sm">{issuance.mealName}</td>
                          <td className="p-3">
                            <span className="text-green-500 text-xs">✓ ВЫДАНО</span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Вкладка Склад продуктов */}
        {activeCookTab === 'inventory' && (
          <div className="space-y-6">
            <div className="border-2 border-green-500 p-4">
              <div className="text-xs text-green-500 mb-4 tracking-widest" style={{ fontFamily: "monospace" }}>
                [ДОБАВИТЬ_ПРОДУКТ]
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [НАЗВАНИЕ]
                  </label>
                  <input
                    type="text"
                    value={newInventoryItem.name}
                    onChange={(e) => setNewInventoryItem({...newInventoryItem, name: e.target.value})}
                    className="w-full p-3 bg-black border-2 border-green-500 text-white focus:border-red-600 focus:outline-none transition-colors"
                    style={{ fontFamily: "monospace" }}
                    placeholder="НАЗВАНИЕ_ПРОДУКТА"
                  />
                </div>
                
                <div>
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [КАТЕГОРИЯ]
                  </label>
                  <select
                    value={newInventoryItem.category}
                    onChange={(e) => setNewInventoryItem({...newInventoryItem, category: e.target.value as InventoryItem['category']})}
                    className="w-full p-3 bg-black border-2 border-green-500 text-white focus:border-red-600 focus:outline-none transition-colors"
                    style={{ fontFamily: "monospace" }}
                  >
                    <option value="овощи">ОВОЩИ</option>
                    <option value="мясо">МЯСО</option>
                    <option value="молочные">МОЛОЧНЫЕ</option>
                    <option value="крупы">КРУПЫ</option>
                    <option value="напитки">НАПИТКИ</option>
                    <option value="прочее">ПРОЧЕЕ</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [ЕДИНИЦА]
                  </label>
                  <select
                    value={newInventoryItem.unit}
                    onChange={(e) => setNewInventoryItem({...newInventoryItem, unit: e.target.value as InventoryItem['unit']})}
                    className="w-full p-3 bg-black border-2 border-green-500 text-white focus:border-red-600 focus:outline-none transition-colors"
                    style={{ fontFamily: "monospace" }}
                  >
                    <option value="кг">КГ</option>
                    <option value="л">Л</option>
                    <option value="шт">ШТ</option>
                    <option value="уп">УП</option>
                    <option value="г">Г</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                      [КОЛ-ВО]
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newInventoryItem.currentQuantity}
                      onChange={(e) => setNewInventoryItem({...newInventoryItem, currentQuantity: parseFloat(e.target.value) || 0})}
                      className="w-full p-3 bg-black border-2 border-green-500 text-white focus:border-red-600 focus:outline-none transition-colors"
                      style={{ fontFamily: "monospace" }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                      [МИНИМУМ]
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newInventoryItem.minQuantity}
                      onChange={(e) => setNewInventoryItem({...newInventoryItem, minQuantity: parseFloat(e.target.value) || 0})}
                      className="w-full p-3 bg-black border-2 border-green-500 text-white focus:border-red-600 focus:outline-none transition-colors"
                      style={{ fontFamily: "monospace" }}
                    />
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleAddInventoryItem}
                className="w-full p-4 bg-green-500 text-black border-2 border-green-500 hover:bg-red-600 hover:border-red-600 transition-all relative overflow-hidden group"
                style={{ fontFamily: "monospace" }}
              >
                <span className="block text-lg tracking-widest">[ДОБАВИТЬ_НА_СКЛАД]</span>
              </button>
            </div>

            {/* Таблица продуктов с низким остатком */}
            <div className="border-2 border-red-500 p-4">
              <div className="text-xs text-red-500 mb-4 tracking-widest" style={{ fontFamily: "monospace" }}>
                [НИЗКИЕ_ОСТАТКИ ⚠]
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-white" style={{ fontFamily: "monospace" }}>
                  <thead>
                    <tr className="border-b-2 border-red-500">
                      <th className="p-3 text-left text-sm">ПРОДУКТ</th>
                      <th className="p-3 text-left text-sm">КАТЕГОРИЯ</th>
                      <th className="p-3 text-left text-sm">ТЕКУЩЕЕ</th>
                      <th className="p-3 text-left text-sm">МИНИМУМ</th>
                      <th className="p-3 text-left text-sm">СТАТУС</th>
                      <th className="p-3 text-left text-sm">ДЕЙСТВИЯ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryItems
                      .filter(item => item.currentQuantity <= item.minQuantity)
                      .map(item => (
                        <tr key={item.id} className="border-b border-gray-700 hover:bg-red-500/10">
                          <td className="p-3 text-sm">{item.name}</td>
                          <td className="p-3 text-sm">
                            <span className="px-2 py-1 text-xs bg-gray-700 rounded">{item.category}</span>
                          </td>
                          <td className="p-3 text-sm">{item.currentQuantity} {item.unit}</td>
                          <td className="p-3 text-sm">{item.minQuantity} {item.unit}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 text-xs bg-red-600 text-black">СРОЧНО_ЗАКАЗАТЬ</span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleUpdateInventoryQuantity(item.id, 10)}
                              className="px-2 py-1 mr-2 bg-green-500 text-black text-xs hover:bg-green-600"
                            >
                              +10
                            </button>
                            <button
                              onClick={() => handleUpdateInventoryQuantity(item.id, 5)}
                              className="px-2 py-1 bg-yellow-500 text-black text-xs hover:bg-yellow-600"
                            >
                              +5
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Полный список продуктов */}
            <div className="border-2 border-green-500 p-4">
              <div className="text-xs text-green-500 mb-4 tracking-widest" style={{ fontFamily: "monospace" }}>
                [ВСЕ_ПРОДУКТЫ]
              </div>
              
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-white" style={{ fontFamily: "monospace" }}>
                  <thead>
                    <tr className="border-b-2 border-green-500 sticky top-0 bg-black">
                      <th className="p-3 text-left text-sm">ПРОДУКТ</th>
                      <th className="p-3 text-left text-sm">КАТЕГОРИЯ</th>
                      <th className="p-3 text-left text-sm">ТЕКУЩЕЕ</th>
                      <th className="p-3 text-left text-sm">МИНИМУМ</th>
                      <th className="p-3 text-left text-sm">ОБНОВЛЕНО</th>
                      <th className="p-3 text-left text-sm">КОРРЕКЦИЯ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryItems.map(item => (
                      <tr key={item.id} className="border-b border-gray-700 hover:bg-green-500/10">
                        <td className="p-3 text-sm">{item.name}</td>
                        <td className="p-3 text-sm">
                          <span className="px-2 py-1 text-xs bg-gray-700 rounded">{item.category}</span>
                        </td>
                        <td className="p-3 text-sm">{item.currentQuantity} {item.unit}</td>
                        <td className="p-3 text-sm">{item.minQuantity} {item.unit}</td>
                        <td className="p-3 text-sm text-gray-400">{item.lastUpdate}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleUpdateInventoryQuantity(item.id, 1)}
                              className="px-2 py-1 bg-green-500 text-black text-xs hover:bg-green-600"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleUpdateInventoryQuantity(item.id, -1)}
                              className="px-2 py-1 bg-red-500 text-black text-xs hover:bg-red-600"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleUpdateInventoryQuantity(item.id, 5)}
                              className="px-2 py-1 bg-yellow-500 text-black text-xs hover:bg-yellow-600"
                            >
                              +5
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Вкладка Готовые блюда */}
        {activeCookTab === 'prepared' && (
          <div className="space-y-6">
            <div className="border-2 border-blue-500 p-4">
              <div className="text-xs text-blue-500 mb-4 tracking-widest" style={{ fontFamily: "monospace" }}>
                [ДОБАВИТЬ_ГОТОВОЕ_БЛЮДО]
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [НАЗВАНИЕ]
                  </label>
                  <select
                    value={newPreparedDish.dishId}
                    onChange={(e) => {
                      const selected = menuItems.find(item => item.id === e.target.value);
                      setNewPreparedDish({
                        ...newPreparedDish,
                        dishId: e.target.value,
                        dishName: selected?.name || ''
                      });
                    }}
                    className="w-full p-3 bg-black border-2 border-green-500 text-white focus:border-red-600 focus:outline-none transition-colors"
                    style={{ fontFamily: "monospace" }}
                  >
                    <option value="">ВЫБЕРИТЕ_БЛЮДО</option>
                    {menuItems.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [КОЛИЧЕСТВО]
                  </label>
                  <input
                    type="number"
                    value={newPreparedDish.quantity}
                    onChange={(e) => setNewPreparedDish({...newPreparedDish, quantity: parseInt(e.target.value) || 0})}
                    className="w-full p-3 bg-black border-2 border-green-500 text-white focus:border-red-600 focus:outline-none transition-colors"
                    style={{ fontFamily: "monospace" }}
                    placeholder="КОЛ-ВО_ПОРЦИЙ"
                  />
                </div>
                
                <div>
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [МАКСИМУМ]
                  </label>
                  <input
                    type="number"
                    value={newPreparedDish.maxQuantity}
                    onChange={(e) => setNewPreparedDish({...newPreparedDish, maxQuantity: parseInt(e.target.value) || 0})}
                    className="w-full p-3 bg-black border-2 border-green-500 text-white focus:border-red-600 focus:outline-none transition-colors"
                    style={{ fontFamily: "monospace" }}
                    placeholder="МАКС_ПОРЦИЙ"
                  />
                </div>
              </div>
              
              <button
                onClick={handleAddPreparedDish}
                className="w-full p-4 bg-blue-500 text-black border-2 border-blue-500 hover:bg-green-500 hover:border-green-500 transition-all relative overflow-hidden group"
                style={{ fontFamily: "monospace" }}
              >
                <span className="block text-lg tracking-widest">[ДОБАВИТЬ_В_ГОТОВЫЕ]</span>
              </button>
            </div>

            {/* Готовые блюда с предупреждениями */}
            <div className="border-2 border-red-500 p-4">
              <div className="text-xs text-red-500 mb-4 tracking-widest" style={{ fontFamily: "monospace" }}>
                [БЛЮДА_СРОК_ГОДНОСТИ ⚠]
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-white" style={{ fontFamily: "monospace" }}>
                  <thead>
                    <tr className="border-b-2 border-red-500">
                      <th className="p-3 text-left text-sm">БЛЮДО</th>
                      <th className="p-3 text-left text-sm">ОСТАЛОСЬ</th>
                      <th className="p-3 text-left text-sm">ГОТОВЛЕНО</th>
                      <th className="p-3 text-left text-sm">ГОДНО_ДО</th>
                      <th className="p-3 text-left text-sm">СТАТУС</th>
                      <th className="p-3 text-left text-sm">ДЕЙСТВИЯ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preparedDishes
                      .filter(dish => dish.status === 'warning' || dish.status === 'expired')
                      .map(dish => (
                        <tr key={dish.id} className="border-b border-gray-700 hover:bg-red-500/10">
                          <td className="p-3 text-sm">{dish.dishName}</td>
                          <td className="p-3 text-sm">
                            <span className={`px-2 py-1 text-xs ${dish.quantity <= 5 ? 'bg-red-500 text-black' : 'bg-yellow-500 text-black'}`}>
                              {dish.quantity} порций
                            </span>
                          </td>
                          <td className="p-3 text-sm text-gray-400">{dish.preparedDate}</td>
                          <td className="p-3 text-sm text-gray-400">{dish.expiresDate}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs ${dish.status === 'expired' ? 'bg-red-600 text-black' : 'bg-yellow-600 text-black'}`}>
                              {dish.status === 'expired' ? 'ПРОСРОЧЕНО' : 'СКОРО_СРОК'}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleRemoveExpiredDish(dish.id)}
                              className="px-2 py-1 bg-red-600 text-black text-xs hover:bg-red-700"
                            >
                              УДАЛИТЬ
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Все готовые блюда */}
            <div className="border-2 border-blue-500 p-4">
              <div className="text-xs text-blue-500 mb-4 tracking-widest" style={{ fontFamily: "monospace" }}>
                [ВСЕ_ГОТОВЫЕ_БЛЮДА]
              </div>
              
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-white" style={{ fontFamily: "monospace" }}>
                  <thead>
                    <tr className="border-b-2 border-blue-500 sticky top-0 bg-black">
                      <th className="p-3 text-left text-sm">БЛЮДО</th>
                      <th className="p-3 text-left text-sm">ОСТАЛОСЬ/МАКС</th>
                      <th className="p-3 text-left text-sm">ГОТОВЛЕНО</th>
                      <th className="p-3 text-left text-sm">СТАТУС</th>
                      <th className="p-3 text-left text-sm">КОРРЕКЦИЯ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preparedDishes.map(dish => (
                      <tr key={dish.id} className="border-b border-gray-700 hover:bg-blue-500/10">
                        <td className="p-3 text-sm">{dish.dishName}</td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-700 rounded-full h-2.5 mr-3">
                              <div 
                                className={`h-2.5 rounded-full ${dish.quantity <= 5 ? 'bg-red-500' : 'bg-green-500'}`}
                                style={{ width: `${(dish.quantity / dish.maxQuantity) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">
                              {dish.quantity}/{dish.maxQuantity}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-gray-400">{dish.preparedDate}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-xs ${
                            dish.status === 'fresh' ? 'bg-green-500 text-black' :
                            dish.status === 'warning' ? 'bg-yellow-500 text-black' :
                            'bg-red-600 text-black'
                          }`}>
                            {dish.status === 'fresh' ? 'СВЕЖЕЕ' :
                             dish.status === 'warning' ? 'МАЛО' : 'ПРОСРОЧЕНО'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleUpdatePreparedDishQuantity(dish.id, 1)}
                              className="px-2 py-1 bg-green-500 text-black text-xs hover:bg-green-600"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleUpdatePreparedDishQuantity(dish.id, -1)}
                              className="px-2 py-1 bg-red-500 text-black text-xs hover:bg-red-600"
                              disabled={dish.quantity <= 0}
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleUpdatePreparedDishQuantity(dish.id, 5)}
                              className="px-2 py-1 bg-yellow-500 text-black text-xs hover:bg-yellow-600"
                            >
                              +5
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}

        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  triggerGlitch();
                }}
                className={`px-5 py-2 border-2 transition-all transform hover:scale-105 relative overflow-hidden ${selectedCategory === cat
                    ? "bg-red-600 border-red-600 text-black"
                    : "bg-black border-green-500 text-green-500 hover:border-red-600 hover:text-red-600"
                  }`}
                style={{
                  clipPath:
                    "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
                  fontFamily: "monospace",
                }}
              >
                {cat}
                {selectedCategory === cat && (
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s linear infinite",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Menu Grid */}
        <section>
          <h2
            className="text-4xl mb-6 text-white relative inline-block shimmer-text"
            style={{
              fontFamily: 'Impact, "Arial Black", sans-serif',
              textShadow: "2px 2px 0px #ff0000",
            }}
          >
            {">"} МЕНЮ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`border-2 border-white bg-black p-5 relative group hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer overflow-hidden ${glitchElements.includes(index + 10) ? "glitch-element" : ""}`}
                style={{
                  transform: `rotate(${index % 3 === 0 ? -1 : index % 3 === 1 ? 1 : 0}deg)`,
                }}
                onMouseEnter={triggerGlitch}
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-green-500 group-hover:text-black tracking-wider">
                      {item.category}
                    </div>
                    {item.spicy && (
                      <span className="text-red-600 group-hover:text-green-500 text-lg">
                        🔥
                      </span>
                    )}
                  </div>
                  <div
                    className="text-xl mb-3 tracking-tight group-hover:text-black"
                    style={{ fontFamily: "Impact, sans-serif" }}
                  >
                    {item.name}
                  </div>
                  <div
                    className="text-2xl text-red-600 group-hover:text-green-500"
                    style={{ fontFamily: "monospace" }}
                  >
                    {item.price}
                  </div>
                </div>
                <div
                  className="absolute inset-0 border-2 border-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ transform: "translate(4px, 4px)" }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Footer Info */}
        <footer className="mt-16 mb-8 border-t-2 border-red-600 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3
                className="text-green-500 mb-3 tracking-wider"
                style={{ fontFamily: "monospace" }}
              >
                [ЛОКАЦИЯ]
              </h3>
              <p className="text-sm">КОРПУС_А</p>
              <p className="text-sm">ЭТАЖ_1</p>
              <p className="text-sm">ГЛАВНЫЙ_ЗАЛ</p>
            </div>
            <div>
              <h3
                className="text-green-500 mb-3 tracking-wider"
                style={{ fontFamily: "monospace" }}
              >
                [ЧАСЫ_РАБОТЫ]
              </h3>
              <p className="text-sm">ЗАВТРАК: 08:00-09:30</p>
              <p className="text-sm">ОБЕД: 11:00-15:00</p>
              <p className="text-sm text-red-600">
                ВЫХОДНЫЕ: ЗАКРЫТО
              </p>
            </div>
            <div>
              <h3
                className="text-green-500 mb-3 tracking-wider"
                style={{ fontFamily: "monospace" }}
              >
                [ПРАВИЛА]
              </h3>
              <p className="text-sm">БЕЗ ОЧЕРЕДИ</p>
              <p className="text-sm">УБЕРИ ЗА СОБОЙ</p>
              <p className="text-sm">УВАЖАЙ ПЕРСОНАЛ</p>
            </div>
          </div>
          <div
            className="mt-8 text-center text-xs text-green-500 tracking-widest"
            style={{ fontFamily: "monospace" }}
          >
            СТОЛОВАЯ//2026//ЕШЬ_ИЛИ_БУДЕШЬ_СЪЕДЕН
          </div>
        </footer>
      </div>

      {/* Nutrition Info Popup */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Popup Window */}
          <div
            className="relative bg-black border-4 border-red-600 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{
              boxShadow:
                "0 0 30px rgba(255,0,0,0.5), inset 0 0 20px rgba(255,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Window header */}
            <div className="border-b-4 border-green-500 p-4 bg-gradient-to-r from-black via-zinc-900 to-black relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-green-500 opacity-50" />
              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className="text-3xl text-red-600 mb-1"
                    style={{
                      fontFamily: "Impact, sans-serif",
                      textShadow: "2px 2px 0px #00ff00",
                    }}
                  >
                    {selectedItem.name}
                  </h3>
                  <div
                    className="text-sm text-green-500 tracking-wider"
                    style={{ fontFamily: "monospace" }}
                  >
                    [{selectedItem.category}] //{" "}
                    {selectedItem.price}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-red-600 hover:text-white border-2 border-red-600 hover:bg-red-600 px-3 py-1 transition-all"
                  style={{ fontFamily: "monospace" }}
                >
                  [X]
                </button>
              </div>
            </div>

            {/* Nutrition Content */}
            <div className="p-6">
              {/* Macros Section */}
              <div className="mb-6">
                <h4
                  className="text-green-500 text-sm mb-4 tracking-widest"
                  style={{ fontFamily: "monospace" }}
                >
                  [ПИЩЕВАЯ_ЦЕННОСТЬ]
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border-2 border-green-500 p-4 relative overflow-hidden group hover:border-red-600 transition-colors">
                    <div
                      className="text-xs text-green-500 group-hover:text-red-600 mb-1"
                      style={{ fontFamily: "monospace" }}
                    >
                      БЕЛКИ
                    </div>
                    <div
                      className="text-3xl text-white"
                      style={{
                        fontFamily: "Impact, sans-serif",
                      }}
                    >
                      {selectedItem.nutrition.protein}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 group-hover:bg-red-600 transition-colors" />
                  </div>
                  <div className="border-2 border-green-500 p-4 relative overflow-hidden group hover:border-red-600 transition-colors">
                    <div
                      className="text-xs text-green-500 group-hover:text-red-600 mb-1"
                      style={{ fontFamily: "monospace" }}
                    >
                      ЖИРЫ
                    </div>
                    <div
                      className="text-3xl text-white"
                      style={{
                        fontFamily: "Impact, sans-serif",
                      }}
                    >
                      {selectedItem.nutrition.fats}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 group-hover:bg-red-600 transition-colors" />
                  </div>
                  <div className="border-2 border-green-500 p-4 relative overflow-hidden group hover:border-red-600 transition-colors">
                    <div
                      className="text-xs text-green-500 group-hover:text-red-600 mb-1"
                      style={{ fontFamily: "monospace" }}
                    >
                      УГЛЕВОДЫ
                    </div>
                    <div
                      className="text-3xl text-white"
                      style={{
                        fontFamily: "Impact, sans-serif",
                      }}
                    >
                      {selectedItem.nutrition.carbs}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 group-hover:bg-red-600 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Ingredients Section */}
              <div className="mb-6">
                <h4
                  className="text-green-500 text-sm mb-4 tracking-widest"
                  style={{ fontFamily: "monospace" }}
                >
                  [СОСТАВ]
                </h4>
                <div className="border-2 border-white p-4 bg-black">
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.nutrition.ingredients.map(
                      (ingredient, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-black border border-green-500 text-white text-sm"
                          style={{
                            fontFamily: "monospace",
                            clipPath:
                              "polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)",
                          }}
                        >
                          {ingredient}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Allergens Section */}
              <div className="mb-6">
                <h4
                  className="text-red-600 text-sm mb-4 tracking-widest"
                  style={{ fontFamily: "monospace" }}
                >
                  [АЛЛЕРГЕНЫ]
                </h4>
                <div className="border-2 border-red-600 p-4 bg-black relative overflow-hidden">
                  {selectedItem.nutrition.allergens.length >
                    0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.nutrition.allergens.map(
                        (allergen, i) => (
                          <span
                            key={i}
                            className="px-3 py-2 bg-red-600 text-black transform -skew-x-6"
                            style={{
                              fontFamily: "monospace",
                            }}
                          >
                            <span className="block transform skew-x-6">
                              ⚠ {allergen}
                            </span>
                          </span>
                        ),
                      )}
                    </div>
                  ) : (
                    <div
                      className="text-green-500 text-center"
                      style={{ fontFamily: "monospace" }}
                    >
                      НЕТ_АЛЛЕРГЕНОВ
                    </div>
                  )}
                  <div className="absolute top-0 right-0 w-16 h-16 border-l-2 border-b-2 border-red-600 opacity-30" />
                </div>
              </div>

              {/* Reviews Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4
                    className="text-green-500 text-sm tracking-widest"
                    style={{ fontFamily: "monospace" }}
                  >
                    [ОТЗЫВЫ]
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-2xl ${i <
                            Math.floor(
                              selectedItem.averageRating,
                            )
                              ? "text-yellow-500"
                              : i < selectedItem.averageRating
                                ? "text-yellow-500 opacity-50"
                                : "text-gray-600"
                            }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span
                      className="text-white text-xl"
                      style={{ fontFamily: "monospace" }}
                    >
                      {selectedItem.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="border-2 border-green-500 p-4 bg-black space-y-4">
                  {selectedItem.reviews.map((review, i) => (
                    <div
                      key={review.id}
                      className="border-l-2 border-red-600 pl-4 relative"
                      style={{
                        clipPath:
                          "polygon(0 0, 100% 0, 100% 100%, 8px 100%)",
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div
                            className="text-white text-sm"
                            style={{ fontFamily: "monospace" }}
                          >
                            {review.author}
                          </div>
                          <div
                            className="text-green-500 text-xs"
                            style={{ fontFamily: "monospace" }}
                          >
                            {review.date}
                          </div>
                        </div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map(
                            (_, starIndex) => (
                              <span
                                key={starIndex}
                                className={`text-sm ${starIndex < review.rating
                                    ? "text-yellow-500"
                                    : "text-gray-600"
                                  }`}
                              >
                                ★
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {review.comment}
                      </p>
                      {i < selectedItem.reviews.length - 1 && (
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-green-500 opacity-20" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Review Form */}
                <div className="mt-6 border-t-2 border-red-600 pt-6">
                  <h5
                    className="text-red-600 text-sm mb-4 tracking-widest"
                    style={{ fontFamily: 'monospace' }}
                  >
                    [ДОБАВИТЬ_ОТЗЫВ]
                  </h5>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const author = formData.get('author') as string;
                      const rating = Number(formData.get('rating'));
                      const comment = formData.get('comment') as string;

                      // TODO: Add review to database (see DATABASE_SETUP.md)
                      console.log('Review submitted:', { author, rating, comment, dishId: selectedItem.id });

                      // Reset form
                      e.currentTarget.reset();

                      // Show success message (you can replace with toast notification)
                      alert('Отзыв отправлен!');
                    }}
                    className="space-y-4"
                  >
                    {/* Author Name Input */}
                    <div>
                      <label
                        className="block text-green-500 text-xs mb-2 tracking-widest"
                        style={{ fontFamily: 'monospace' }}
                      >
                        [ИМЯ]
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="author"
                          required
                          placeholder="ВВЕДИТЕ_ИМЯ"
                          className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors"
                          style={{
                            fontFamily: 'monospace',
                            clipPath: 'polygon(0 0, 98% 0, 100% 15%, 100% 100%, 0 100%)',
                          }}
                        />
                        <div className="absolute top-0 right-0 w-2 h-2 bg-red-600" />
                      </div>
                    </div>

                    {/* Rating Selection */}
                    <div>
                      <label
                        className="block text-green-500 text-xs mb-2 tracking-widest"
                        style={{ fontFamily: 'monospace' }}
                      >
                        [ОЦЕНКА]
                      </label>
                      <div className="relative">
                        <select
                          name="rating"
                          required
                          className="w-full p-3 bg-black border-2 border-green-500 text-white focus:border-red-600 focus:outline-none transition-colors"
                          style={{
                            fontFamily: 'monospace',
                            clipPath: 'polygon(0 0, 98% 0, 100% 15%, 100% 100%, 0 100%)',
                          }}
                        >
                          <option value="">ВЫБЕРИТЕ_ОЦЕНКУ</option>
                          <option value="5">★★★★★ (5)</option>
                          <option value="4">★★★★☆ (4)</option>
                          <option value="3">★★★☆☆ (3)</option>
                          <option value="2">★★☆☆☆ (2)</option>
                          <option value="1">★☆☆☆☆ (1)</option>
                        </select>
                        <div className="absolute top-0 right-0 w-2 h-2 bg-red-600" />
                      </div>
                    </div>

                    {/* Comment Textarea */}
                    <div>
                      <label
                        className="block text-green-500 text-xs mb-2 tracking-widest"
                        style={{ fontFamily: 'monospace' }}
                      >
                        [КОММЕНТАРИЙ]
                      </label>
                      <div className="relative">
                        <textarea
                          name="comment"
                          required
                          placeholder="ВАШ_ОТЗЫВ"
                          rows={4}
                          className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors resize-none"
                          style={{
                            fontFamily: 'monospace',
                            clipPath: 'polygon(0 0, 98% 0, 100% 8%, 100% 100%, 0 100%)',
                          }}
                        />
                        <div className="absolute top-0 right-0 w-2 h-2 bg-red-600" />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full p-4 bg-red-600 text-black border-2 border-red-600 hover:bg-green-500 hover:border-green-500 transition-all relative overflow-hidden group"
                      style={{
                        fontFamily: 'monospace',
                        clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)',
                      }}
                    >
                      <span className="block text-base tracking-widest">
                        [ОТПРАВИТЬ_ОТЗЫВ]
                      </span>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Footer accent */}
            <div className="border-t-2 border-green-500 p-3 bg-black">
              <div
                className="text-center text-xs text-green-500"
                style={{ fontFamily: "monospace" }}
              >
                НАЖМИТЕ_ЧТОБЫ_ЗАКРЫТЬ
              </div>
            </div>
          </div>
        </div>
      )}
      

      {/* Profile Popup */}
      {showProfilePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative bg-black border-4 border-green-500 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{
              boxShadow: "0 0 30px rgba(0,255,0,0.5), inset 0 0 20px rgba(0,255,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b-4 border-red-600 p-4 bg-gradient-to-r from-black via-zinc-900 to-black relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-red-600 opacity-50" />
              <div className="flex justify-between items-start">
                <h3 className="text-3xl text-green-500 mb-1" style={{ fontFamily: "Impact, sans-serif", textShadow: "2px 2px 0px #ff0000" }}>
                  [ПРОФИЛЬ_ПОЛЬЗОВАТЕЛЯ]
                </h3>
                <button onClick={() => setShowProfilePopup(false)} className="text-green-500 hover:text-white border-2 border-green-500 hover:bg-green-500 px-3 py-1 transition-all" style={{ fontFamily: "monospace" }}>
                  [X]
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Информация о пользователе */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-green-500 p-4">
                    <div className="text-xs text-green-500 mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                      [ИНФОРМАЦИЯ]
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm text-gray-400">Имя:</div>
                        <div className="text-white" style={{ fontFamily: "monospace" }}>{userProfile?.name || userName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Логин:</div>
                        <div className="text-white" style={{ fontFamily: "monospace" }}>{userProfile?.username || userName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Email:</div>
                        <div className="text-white" style={{ fontFamily: "monospace" }}>{userProfile?.email || "Не указан"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Баланс */}
                  <div className="border-2 border-green-500 p-4">
                    <div className="text-xs text-green-500 mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                      [БАЛАНС]
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl text-white" style={{ fontFamily: "monospace" }}>
                        {balance}₽
                      </div>
                      <button
                        onClick={() => {
                          // TODO: Добавить функцию пополнения баланса
                          const amount = prompt("Введите сумму для пополнения (в рублях):");
                          if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
                            setBalance(prev => prev + Number(amount));
                          }
                        }}
                        className="border-2 border-red-600 text-red-600 px-4 py-2 hover:bg-red-600 hover:text-black transition-all"
                        style={{ fontFamily: "monospace" }}
                      >
                        [ПОПОЛНИТЬ]
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Сообщения об успехе/ошибке */}
              {profileSuccess && (
                <div className="mb-4 p-3 border-2 border-green-500 bg-green-500/10 text-green-500 text-center" style={{ fontFamily: "monospace" }}>
                  ✓ ПРОФИЛЬ_СОХРАНЕН
                </div>
              )}
              {profileError && (
                <div className="mb-4 p-3 border-2 border-red-600 bg-red-600/10 text-red-600" style={{ fontFamily: "monospace" }}>
                  [ОШИБКА]: {profileError}
                </div>
              )}

              {/* Автоматическая закупка */}
              <div className="mb-6">
                <div className="flex items-center justify-between border-2 border-green-500 p-4">
                  <div>
                    <div className="text-xs text-green-500 mb-1 tracking-widest" style={{ fontFamily: "monospace" }}>
                      [АВТОМАТИЧЕСКАЯ_ЗАКУПКА]
                    </div>
                    <div className="text-sm text-gray-400">
                      Автоматическая покупка выбранных блюд при низком балансе
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoPurchase}
                      onChange={(e) => setAutoPurchase(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>

              {/* Аллергии */}
              <div className="mb-8">
                <div className="border-2 border-green-500 p-4">
                  <div className="text-xs text-green-500 mb-4 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [ВАШИ_АЛЛЕРГИИ]
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {ALL_ALLERGENS.map((allergy) => (
                      <label
                        key={allergy}
                        className={`flex items-center p-3 border-2 cursor-pointer transition-all ${selectedAllergies.includes(allergy)
                            ? "border-red-600 bg-red-600/10"
                            : "border-green-500 hover:border-red-600"
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAllergies.includes(allergy)}
                          onChange={() => handleAllergyChange(allergy)}
                          className="mr-2 w-4 h-4 text-red-600 bg-black border-green-500 rounded focus:ring-red-500 focus:ring-2"
                        />
                        <span className="text-sm" style={{ fontFamily: "monospace" }}>
                          {allergy}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-4">
                <button
                  onClick={saveUserProfile}
                  disabled={profileLoading}
                  className="flex-1 p-4 bg-red-600 text-black border-2 border-red-600 hover:bg-green-500 hover:border-green-500 transition-all relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "monospace", clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}
                >
                  <span className="block text-lg tracking-widest">
                    {profileLoading ? "[СОХРАНЕНИЕ...]" : "[СОХРАНИТЬ_ПРОФИЛЬ]"}
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
                <button
                  onClick={() => setShowProfilePopup(false)}
                  className="px-6 py-4 border-2 border-green-500 text-green-500 hover:border-red-600 hover:text-red-600 transition-all"
                  style={{ fontFamily: "monospace", clipPath: "polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0% 50%)" }}
                >
                  [ЗАКРЫТЬ]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative bg-black border-4 border-green-500 max-w-md w-full"
            style={{
              boxShadow: "0 0 30px rgba(0,255,0,0.5), inset 0 0 20px rgba(0,255,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b-4 border-red-600 p-4 bg-gradient-to-r from-black via-zinc-900 to-black relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-red-600 opacity-50" />
              <div className="flex justify-between items-start">
                <h3 className="text-3xl text-green-500 mb-1" style={{ fontFamily: "Impact, sans-serif", textShadow: "2px 2px 0px #ff0000" }}>
                  [ВХОД_В_СИСТЕМУ]
                </h3>
                <button onClick={() => setShowLoginPopup(false)} className="text-green-500 hover:text-white border-2 border-green-500 hover:bg-green-500 px-3 py-1 transition-all" style={{ fontFamily: "monospace" }}>
                  [X]
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-6">
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [ЛОГИН]
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="ВВЕДИТЕ_ЛОГИН"
                      value={loginUsername}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginUsername(e.target.value)}
                      className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors"
                      style={{ fontFamily: "monospace", clipPath: "polygon(0 0, 98% 0, 100% 20%, 100% 100%, 0 100%)" }}
                    />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-600" />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [ПАРОЛЬ]
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="ВВЕДИТЕ_ПАРОЛЬ"
                      value={loginPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginPassword(e.target.value)}
                      className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors"
                      style={{ fontFamily: "monospace", clipPath: "polygon(0 0, 98% 0, 100% 20%, 100% 100%, 0 100%)" }}
                    />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-600" />
                  </div>
                </div>

                <button type="submit" className="w-full p-4 bg-red-600 text-black border-2 border-red-600 hover:bg-green-500 hover:border-green-500 transition-all relative overflow-hidden group" style={{ fontFamily: "monospace", clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}>
                  <span className="block text-lg tracking-widest">[ВОЙТИ]</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>

                <div className="mt-6 flex justify-between items-center">
                  <button onClick={SwitchToZabl} type="button" className="text-green-500 text-xs hover:text-red-600 transition-colors" style={{ fontFamily: "monospace" }}>
                    [ЗАБЫЛИ_ПАРОЛЬ?]
                  </button>
                  <button
                    onClick={SwithParametrButton}
                    type="button"
                    className="text-green-500 text-xs hover:text-red-600 transition-colors"
                    style={{ fontFamily: "monospace" }}
                  >
                    [РЕГИСТРАЦИЯ]
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    

      {/* Password Reset Step 1 - Email */}
      {showZablPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative bg-black border-4 border-green-500 max-w-md w-full"
            style={{
              boxShadow: "0 0 30px rgba(0,255,0,0.5), inset 0 0 20px rgba(0,255,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b-4 border-red-600 p-4 bg-gradient-to-r from-black via-zinc-900 to-black relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-red-600 opacity-50" />
              <div className="flex justify-between items-start">
                <h3 className="text-3xl text-green-500 mb-1" style={{ fontFamily: "Impact, sans-serif", textShadow: "2px 2px 0px #ff0000" }}>
                  [СБРОС_ПАРОЛЯ]
                </h3>
                <button onClick={() => setShowZablPopup(false)} className="text-green-500 hover:text-white border-2 border-green-500 hover:bg-green-500 px-3 py-1 transition-all" style={{ fontFamily: "monospace" }}>
                  [X]
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleResetEmailSubmit}>
                <div className="mb-6">
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [EMAIL]
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="ВВЕДИТЕ_EMAIL"
                      value={resetEmail}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setResetEmail(e.target.value)}
                      className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors"
                      style={{ fontFamily: "monospace", clipPath: "polygon(0 0, 98% 0, 100% 20%, 100% 100%, 0 100%)" }}
                    />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-600" />
                  </div>
                </div>

                <button type="submit" className="w-full p-4 bg-red-600 text-black border-2 border-red-600 hover:bg-green-500 hover:border-green-500 transition-all relative overflow-hidden group" style={{ fontFamily: "monospace", clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}>
                  <span className="block text-lg tracking-widest">[СБРОСИТЬ_ПАРОЛЬ]</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      

      {/* Password Reset Step 2 - Code */}
      {showMailPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative bg-black border-4 border-green-500 max-w-md w-full"
            style={{
              boxShadow: "0 0 30px rgba(0,255,0,0.5), inset 0 0 20px rgba(0,255,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b-4 border-red-600 p-4 bg-gradient-to-r from-black via-zinc-900 to-black relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-red-600 opacity-50" />
              <div className="flex justify-between items-start">
                <h3 className="text-3xl text-green-500 mb-1" style={{ fontFamily: "Impact, sans-serif", textShadow: "2px 2px 0px #ff0000" }}>
                  [СБРОС_ПАРОЛЯ]
                </h3>
                <button onClick={() => setShowMailPopup(false)} className="text-green-500 hover:text-white border-2 border-green-500 hover:bg-green-500 px-3 py-1 transition-all" style={{ fontFamily: "monospace" }}>
                  [X]
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleResetCodeSubmit}>
                <div className="mb-6">
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [КОД]
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="ВВЕДИТЕ_КОД_C_ПОЧТЫ"
                      value={resetCode}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setResetCode(e.target.value)}
                      className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors"
                      style={{ fontFamily: "monospace", clipPath: "polygon(0 0, 98% 0, 100% 20%, 100% 100%, 0 100%)" }}
                    />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-600" />
                  </div>
                </div>

                <button type="submit" className="w-full p-4 bg-red-600 text-black border-2 border-red-600 hover:bg-green-500 hover:border-green-500 transition-all relative overflow-hidden group" style={{ fontFamily: "monospace", clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}>
                  <span className="block text-lg tracking-widest">[ПРОВЕРИТЬ_КОД]</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      

      {/* Password Reset Step 3 - New Password */}
      {showPasswordPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative bg-black border-4 border-green-500 max-w-md w-full"
            style={{
              boxShadow: "0 0 30px rgba(0,255,0,0.5), inset 0 0 20px rgba(0,255,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b-4 border-red-600 p-4 bg-gradient-to-r from-black via-zinc-900 to-black relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-red-600 opacity-50" />
              <div className="flex justify-between items-start">
                <h3 className="text-3xl text-green-500 mb-1" style={{ fontFamily: "Impact, sans-serif", textShadow: "2px 2px 0px #ff0000" }}>
                  [СБРОС_ПАРОЛЯ]
                </h3>
                <button onClick={() => setShowPasswordPopup(false)} className="text-green-500 hover:text-white border-2 border-green-500 hover:bg-green-500 px-3 py-1 transition-all" style={{ fontFamily: "monospace" }}>
                  [X]
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleNewPasswordSubmit}>
                <div className="mb-8">
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [НОВЫЙ_ПАРОЛЬ]
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="ПРИДУМАЙТЕ_ПАРОЛЬ"
                      value={newPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                      className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors"
                      style={{ fontFamily: "monospace", clipPath: "polygon(0 0, 98% 0, 100% 20%, 100% 100%, 0 100%)" }}
                    />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-600" />
                  </div>
                </div>

                <div className="mb-9">
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [ПОВТОРЕНИЕ_ПАРОЛЯ]
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="ПОВТОРИТЕ_ПАРОЛЬ"
                      value={repeatPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)}
                      className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors"
                      style={{ fontFamily: "monospace", clipPath: "polygon(0 0, 98% 0, 100% 20%, 100% 100%, 0 100%)" }}
                    />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-600" />
                  </div>
                </div>

                <button type="submit" className="w-full p-4 bg-red-600 text-black border-2 border-red-600 hover:bg-green-500 hover:border-green-500 transition-all relative overflow-hidden group" style={{ fontFamily: "monospace", clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}>
                  <span className="block text-lg tracking-widest">[СБРОСИТЬ_ПАРОЛЬ]</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {showRegisterPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative bg-black border-4 border-green-500 max-w-md w-full"
            style={{
              boxShadow: "0 0 30px rgba(0,255,0,0.5), inset 0 0 20px rgba(0,255,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b-4 border-red-600 p-4 bg-gradient-to-r from-black via-zinc-900 to-black relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-red-600 opacity-50" />
              <div className="flex justify-between items-start">
                <h3 className="text-3xl text-green-500 mb-1" style={{ fontFamily: "Impact, sans-serif", textShadow: "2px 2px 0px #ff0000" }}>
                  [РЕГИСТРАЦИЯ_АККАУНТА]
                </h3>
                <button
                  onClick={() => {
                    setShowRegisterPopup(false);
                    setRegisterError(null);
                  }}
                  className="text-green-500 hover:text-white border-2 border-green-500 hover:bg-green-500 px-3 py-1 transition-all"
                  style={{ fontFamily: "monospace" }}
                >
                  [X]
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Отображение успешной регистрации */}
              {registerSuccess && (
                <div className="mb-4 p-3 border-2 border-green-500 bg-green-500/10 text-green-500 text-center" style={{ fontFamily: "monospace" }}>
                  ✓ РЕГИСТРАЦИЯ_УСПЕШНА
                </div>
              )}

              {/* Отображение ошибки регистрации */}
              {registerError && (
                <div className="mb-4 p-3 border-2 border-red-600 bg-red-600/10 text-red-600" style={{ fontFamily: "monospace" }}>
                  [ОШИБКА]: {registerError}
                </div>
              )}
// Добавить компонент AdminPanelPopup в конец JSX
{showAdminPanel && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
    <div
      className="relative bg-black border-4 border-purple-500 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      style={{
        boxShadow: "0 0 30px rgba(128,0,128,0.5), inset 0 0 20px rgba(128,0,128,0.2)",
      }}
      onClick={(e) => e.stopPropagation()}
      
    >
      <div className="border-b-4 border-yellow-500 p-4 bg-gradient-to-r from-black via-zinc-900 to-black relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-yellow-500 opacity-50" />
        <div className="flex justify-between items-start">
          <h3 className="text-3xl text-purple-500 mb-1" style={{ fontFamily: "Impact, sans-serif", textShadow: "2px 2px 0px #ffd700" }}>
            [ПАНЕЛЬ_УПРАВЛЕНИЯ]
          </h3>
          <button onClick={() => setShowAdminPanel(false)} className="text-purple-500 hover:text-white border-2 border-purple-500 hover:bg-purple-500 px-3 py-1 transition-all" style={{ fontFamily: "monospace" }}>
            [X]
          </button>
        </div>
        <div className="text-sm text-yellow-500 mt-2" style={{ fontFamily: "monospace" }}>
          РОЛЬ: {userProfile?.role === 'admin' ? 'АДМИНИСТРАТОР' : 'ПОВАР'}
        </div>
      </div>

      <div className="p-6">
        {/* Вкладки */}
        <div className="flex gap-3 mb-6">
          <button className="px-4 py-2 border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-black transition-all" style={{ fontFamily: "monospace" }}>
            [УПРАВЛЕНИЕ_МЕНЮ]
          </button>
          <button className="px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-all" style={{ fontFamily: "monospace" }}>
            [ЗАКАЗЫ]
          </button>
          <button className="px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-black transition-all" style={{ fontFamily: "monospace" }}>
            [СТАТИСТИКА]
          </button>
        </div>

        {/* Форма добавления нового блюда */}
        <div className="mb-8 border-2 border-purple-500 p-4">
          <div className="text-xs text-purple-500 mb-4 tracking-widest" style={{ fontFamily: "monospace" }}>
            [ДОБАВИТЬ_НОВОЕ_БЛЮДО]
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                [НАЗВАНИЕ]
              </label>
              <input
                type="text"
                value={newMenuItem.name}
                onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors"
                style={{ fontFamily: "monospace" }}
                placeholder="НАЗВАНИЕ_БЛЮДА"
              />
            </div>
            
            <div>
              <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                [ЦЕНА]
              </label>
              <input
                type="text"
                value={newMenuItem.price}
                onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors"
                style={{ fontFamily: "monospace" }}
                placeholder="150р"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                [КАТЕГОРИЯ]
              </label>
              <select
                value={newMenuItem.category}
                onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                className="w-full p-3 bg-black border-2 border-green-500 text-white focus:border-red-600 focus:outline-none transition-colors"
                style={{ fontFamily: "monospace" }}
              >
                <option value="Завтрак">Завтрак</option>
                <option value="Обед">Обед</option>
                <option value="Ужин">Ужин</option>
                <option value="Напитки">Напитки</option>
              </select>
            </div>
            
            <div>
              <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                [БЕЛКИ]
              </label>
              <input
                type="text"
                value={newMenuItem.nutrition.protein}
                onChange={(e) => setNewMenuItem({
                  ...newMenuItem,
                  nutrition: {...newMenuItem.nutrition, protein: e.target.value}
                })}
                className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors"
                style={{ fontFamily: "monospace" }}
                placeholder="12.7г"
              />
            </div>
            
            <div>
              <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                [ЖИРЫ]
              </label>
              <input
                type="text"
                value={newMenuItem.nutrition.fats}
                onChange={(e) => setNewMenuItem({
                  ...newMenuItem,
                  nutrition: {...newMenuItem.nutrition, fats: e.target.value}
                })}
                className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors"
                style={{ fontFamily: "monospace" }}
                placeholder="15.3г"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                [УГЛЕВОДЫ]
              </label>
              <input
                type="text"
                value={newMenuItem.nutrition.carbs}
                onChange={(e) => setNewMenuItem({
                  ...newMenuItem,
                  nutrition: {...newMenuItem.nutrition, carbs: e.target.value}
                })}
                className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors"
                style={{ fontFamily: "monospace" }}
                placeholder="2.4г"
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newMenuItem.spicy}
                  onChange={(e) => setNewMenuItem({...newMenuItem, spicy: e.target.checked})}
                  className="mr-2 w-5 h-5 text-red-600 bg-black border-green-500 rounded focus:ring-red-500 focus:ring-2"
                />
                <span className="text-green-500 text-sm" style={{ fontFamily: "monospace" }}>
                  [ОСТРОЕ]
                </span>
              </label>
            </div>
          </div>

          {/* Ингредиенты */}
          <div className="mb-6">
            <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
              [ИНГРЕДИЕНТЫ]
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                className="flex-1 p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors"
                style={{ fontFamily: "monospace" }}
                placeholder="ДОБАВИТЬ_ИНГРЕДИЕНТ"
                onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
              />
              <button
                onClick={handleAddIngredient}
                className="px-4 py-3 bg-green-500 text-black hover:bg-red-600 transition-all"
                style={{ fontFamily: "monospace" }}
              >
                [+]
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newMenuItem.nutrition.ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-black border border-green-500 text-white text-sm flex items-center"
                  style={{ fontFamily: "monospace" }}
                >
                  {ingredient}
                  <button
                    onClick={() => handleRemoveIngredient(index)}
                    className="ml-2 text-red-600 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Аллергены */}
          <div className="mb-6">
            <label className="block text-red-600 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
              [АЛЛЕРГЕНЫ]
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={allergenInput}
                onChange={(e) => setAllergenInput(e.target.value)}
                className="flex-1 p-3 bg-black border-2 border-red-600 text-white placeholder-red-900 focus:border-green-500 focus:outline-none transition-colors"
                style={{ fontFamily: "monospace" }}
                placeholder="ДОБАВИТЬ_АЛЛЕРГЕН"
                onKeyPress={(e) => e.key === 'Enter' && handleAddAllergen()}
              />
              <button
                onClick={handleAddAllergen}
                className="px-4 py-3 bg-red-600 text-black hover:bg-green-500 transition-all"
                style={{ fontFamily: "monospace" }}
              >
                [+]
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newMenuItem.nutrition.allergens.map((allergen, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-600 text-black text-sm flex items-center"
                  style={{ fontFamily: "monospace" }}
                >
                  ⚠ {allergen}
                  <button
                    onClick={() => handleRemoveAllergen(index)}
                    className="ml-2 text-black hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddMenuItem}
            className="w-full p-4 bg-purple-600 text-black border-2 border-purple-600 hover:bg-yellow-500 hover:border-yellow-500 transition-all relative overflow-hidden group"
            style={{ fontFamily: "monospace" }}
          >
            <span className="block text-lg tracking-widest">
              [ДОБАВИТЬ_БЛЮДО_В_МЕНЮ]
            </span>
          </button>
        </div>

        {/* Список существующих блюд с возможностью удаления */}
        <div className="border-2 border-yellow-500 p-4">
          <div className="text-xs text-yellow-500 mb-4 tracking-widest" style={{ fontFamily: "monospace" }}>
            [УПРАВЛЕНИЕ_СУЩЕСТВУЮЩИМИ_БЛЮДАМИ]
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {menuItems.map(item => (
              <div key={item.id} className="border-2 border-green-500 p-4 flex justify-between items-center">
                <div>
                  <div className="text-white text-lg" style={{ fontFamily: "Impact, sans-serif" }}>
                    {item.name}
                  </div>
                  <div className="text-green-500 text-sm" style={{ fontFamily: "monospace" }}>
                    {item.category} • {item.price}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-black transition-all text-sm" style={{ fontFamily: "monospace" }}>
                    [РЕДАКТИРОВАТЬ]
                  </button>
                  <button
                    onClick={() => handleDeleteMenuItem(item.id)}
                    className="px-3 py-1 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-black transition-all text-sm"
                    style={{ fontFamily: "monospace" }}
                  >
                    [УДАЛИТЬ]
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Статистика (только для админов) */}
        {userProfile?.role === 'admin' && (
          <div className="mt-8 border-2 border-blue-500 p-4">
            <div className="text-xs text-blue-500 mb-4 tracking-widest" style={{ fontFamily: "monospace" }}>
              [СТАТИСТИКА]
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-2 border-green-500 p-4">
                <div className="text-sm text-green-500 mb-2" style={{ fontFamily: "monospace" }}>
                  [ВСЕГО_БЛЮД]
                </div>
                <div className="text-3xl text-white text-center" style={{ fontFamily: "monospace" }}>
                  {menuItems.length}
                </div>
              </div>
              
              <div className="border-2 border-yellow-500 p-4">
                <div className="text-sm text-yellow-500 mb-2" style={{ fontFamily: "monospace" }}>
                  [СТУДЕНТОВ_ОБСЛУЖЕНО]
                </div>
                <div className="text-3xl text-white text-center" style={{ fontFamily: "monospace" }}>
                  {studentsServed}
                </div>
              </div>
              
              <div className="border-2 border-red-500 p-4">
                <div className="text-sm text-red-500 mb-2" style={{ fontFamily: "monospace" }}>
                  [ЗАГРУЗКА_СТОЛОВОЙ]
                </div>
                <div className="text-3xl text-white text-center" style={{ fontFamily: "monospace" }}>
                  {rushLevel}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}
<div className="mb-4">
  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
    [РОЛЬ]
  </label>
  <div className="relative">
    <select
      name="role"
      required
      className="w-full p-3 bg-black border-2 border-green-500 text-white focus:border-red-600 focus:outline-none transition-colors"
      style={{ fontFamily: "monospace", clipPath: "polygon(0 0, 98% 0, 100% 15%, 100% 100%, 0 100%)" }}
      value={registerRole}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => setRegisterRole(e.target.value)}
    >
      <option value="user">ПОЛЬЗОВАТЕЛЬ</option>
      <option value="cook">ПОВАР</option>
      <option value="admin">АДМИНИСТРАТОР</option>
    </select>
    <div className="absolute top-0 right-0 w-2 h-2 bg-red-600" />
  </div>
</div>
              <form onSubmit={handleRegisterSubmit}>
                <div className="mb-1">
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [ФИО]
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="ВВЕДИТЕ_ФИО"
                      value={registerName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setRegisterName(e.target.value)}
                      disabled={isLoading || registerSuccess}
                      className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors disabled:opacity-50"
                      style={{ fontFamily: "monospace", clipPath: "polygon(0 0, 98% 0, 100% 20%, 100% 100%, 0 100%)" }}
                    />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-600" />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [EMAIL]
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="ВВЕДИТЕ_EMAIL"
                      value={registerEmail}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setRegisterEmail(e.target.value)}
                      disabled={isLoading || registerSuccess}
                      className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors disabled:opacity-50"
                      style={{ fontFamily: "monospace", clipPath: "polygon(0 0, 98% 0, 100% 20%, 100% 100%, 0 100%)" }}
                    />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-600" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [ЛОГИН]
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="ПРИДУМАЙТЕ_ЛОГИН"
                      value={registerUsername}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setRegisterUsername(e.target.value)}
                      disabled={isLoading || registerSuccess}
                      className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors disabled:opacity-50"
                      style={{ fontFamily: "monospace", clipPath: "polygon(0 0, 98% 0, 100% 20%, 100% 100%, 0 100%)" }}
                    />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-600" />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-green-500 text-sm mb-2 tracking-widest" style={{ fontFamily: "monospace" }}>
                    [ПАРОЛЬ]
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="ПРИДУМАЙТЕ_ПАРОЛЬ (мин. 6 символов)"
                      value={registerPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setRegisterPassword(e.target.value)}
                      disabled={isLoading || registerSuccess}
                      className="w-full p-3 bg-black border-2 border-green-500 text-white placeholder-green-900 focus:border-red-600 focus:outline-none transition-colors disabled:opacity-50"
                      style={{ fontFamily: "monospace", clipPath: "polygon(0 0, 98% 0, 100% 20%, 100% 100%, 0 100%)" }}
                    />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-600" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || registerSuccess}
                  className="w-full p-4 bg-red-600 text-black border-2 border-red-600 hover:bg-green-500 hover:border-green-500 transition-all relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "monospace", clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}
                >
                  <span className="block text-lg tracking-widest">
                    {isLoading ? "[ОБРАБОТКА...]" : registerSuccess ? "[УСПЕШНО!]" : "[ЗАРЕГИСТРИРОВАТЬСЯ]"}
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {showNewAccPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative bg-black border-4 border-green-500 max-w-md w-full"
            style={{
              boxShadow: "0 0 30px rgba(0,255,0,0.5), inset 0 0 20px rgba(0,255,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b-4 border-red-600 p-4 bg-gradient-to-r from-black via-zinc-900 to-black relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-red-600 opacity-50" />
              <div className="flex justify-between items-start">
                <h3 className="text-3xl text-green-500 mb-1" style={{ fontFamily: "Impact, sans-serif", textShadow: "2px 2px 0px #ff0000" }}>
                  [АККАУНТ_УСПЕШНО_СОЗДАН!]
                </h3>
                <button
                  onClick={() => {
                    setShowNewAccPopup(false);
                    // Можно автоматически авторизовать пользователя или переключить на форму входа
                    setShowLoginPopup(true);
                  }}
                  className="text-green-500 hover:text-white border-2 border-green-500 hover:bg-green-500 px-3 py-1 transition-all"
                  style={{ fontFamily: "monospace" }}
                >
                  [X]
                </button>
              </div>
            </div>

            <div className="p-6 text-center">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <p className="text-white text-lg mb-6" style={{ fontFamily: "monospace" }}>
                АККАУНТ_УСПЕШНО_СОЗДАН
              </p>
              <p className="text-gray-400 text-sm mb-8">
                Теперь вы можете войти в систему, используя свои учетные данные
              </p>
              <button
                onClick={() => {
                  setShowNewAccPopup(false);
                  setShowLoginPopup(true);
                }}
                className="w-full p-4 bg-red-600 text-black border-2 border-red-600 hover:bg-green-500 hover:border-green-500 transition-all relative overflow-hidden group"
                style={{ fontFamily: "monospace", clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}
              >
                <span className="block text-lg tracking-widest">[ВОЙТИ_В_СИСТЕМУ]</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      // В Header добавить кнопку для админов/поваров
{isLoggedIn && (userProfile?.role === 'admin' || userProfile?.role === 'cook') && (
  <button
    onClick={handleAdminPanelClick}
    className="border-2 border-purple-500 bg-black text-purple-500 px-6 py-3 hover:border-yellow-500 hover:text-yellow-500 transition-all relative overflow-hidden group ml-4"
    style={{
      clipPath: "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
      fontFamily: "monospace",
    }}
        
  >
    <span className="relative z-10 tracking-wider text-sm">
      [ПАНЕЛЬ_УПРАВЛЕНИЯ]
    </span>
    <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
  </button>
)}

    </div>
  );
}