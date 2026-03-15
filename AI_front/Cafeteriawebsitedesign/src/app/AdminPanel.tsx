import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  balance: number;
  created_at: string;
  last_login: string;
}

interface PurchaseRequest {
  id: string;
  user_id: string;
  user_name: string;
  dish_id: string;
  dish_name: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  request_date: string;
  processed_date?: string;
}

interface Payment {
  id: string;
  user_id: string;
  user_name: string;
  amount: number;
  method: "card" | "cash" | "student_card";
  transaction_date: string;
  status: "completed" | "failed" | "pending";
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  min_quantity: number;
  last_restock: string;
  supplier: string;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"users" | "purchases" | "payments" | "inventory">("users");
  
  // Состояния для таблиц
  const [users, setUsers] = useState<User[]>([]);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  
  // Состояния для форм редактирования
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');

  // Загружаем все данные без проверки на админа
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Загружаем все данные параллельно
        await Promise.all([
          fetchUsers(),
          fetchPurchaseRequests(),
          fetchPayments(),
          fetchInventory()
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Функции загрузки данных (без проверки токена)
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/`);
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users:", response.status);
        // Заглушка для демонстрации
        setUsers([
          { id: "1", username: "admin", email: "admin@example.com", name: "Администратор", role: "admin", balance: 1000, created_at: "2024-01-01", last_login: "2024-01-01" },
          { id: "2", username: "user1", email: "user1@example.com", name: "Пользователь 1", role: "user", balance: 500, created_at: "2024-01-02", last_login: "2024-01-02" }
        ]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // Заглушка для демонстрации
      setUsers([
        { id: "1", username: "admin", email: "admin@example.com", name: "Администратор", role: "admin", balance: 1000, created_at: "2024-01-01", last_login: "2024-01-01" },
        { id: "2", username: "user1", email: "user1@example.com", name: "Пользователь 1", role: "user", balance: 500, created_at: "2024-01-02", last_login: "2024-01-02" }
      ]);
    }
  };

  const fetchPurchaseRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/purchase-requests/`);
      
      if (response.ok) {
        const data = await response.json();
        setPurchaseRequests(data);
      } else {
        console.error("Failed to fetch purchase requests:", response.status);
        // Заглушка для демонстрации
        setPurchaseRequests([
          { id: "1", user_id: "1", user_name: "Иван Иванов", dish_id: "1", dish_name: "Омлет с сыром", amount: 150, status: "pending", request_date: "2024-01-01" },
          { id: "2", user_id: "2", user_name: "Мария Петрова", dish_id: "3", dish_name: "Сырники", amount: 140, status: "approved", request_date: "2024-01-01", processed_date: "2024-01-01" }
        ]);
      }
    } catch (error) {
      console.error("Error fetching purchase requests:", error);
      // Заглушка для демонстрации
      setPurchaseRequests([
        { id: "1", user_id: "1", user_name: "Иван Иванов", dish_id: "1", dish_name: "Омлет с сыром", amount: 150, status: "pending", request_date: "2024-01-01" },
        { id: "2", user_id: "2", user_name: "Мария Петрова", dish_id: "3", dish_name: "Сырники", amount: 140, status: "approved", request_date: "2024-01-01", processed_date: "2024-01-01" }
      ]);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/payments/`);
      
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      } else {
        console.error("Failed to fetch payments:", response.status);
        // Заглушка для демонстрации
        setPayments([
          { id: "1", user_id: "1", user_name: "Иван Иванов", amount: 1000, method: "card", transaction_date: "2024-01-01", status: "completed" },
          { id: "2", user_id: "2", user_name: "Мария Петрова", amount: 500, method: "cash", transaction_date: "2024-01-01", status: "completed" }
        ]);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      // Заглушка для демонстрации
      setPayments([
        { id: "1", user_id: "1", user_name: "Иван Иванов", amount: 1000, method: "card", transaction_date: "2024-01-01", status: "completed" },
        { id: "2", user_id: "2", user_name: "Мария Петрова", amount: 500, method: "cash", transaction_date: "2024-01-01", status: "completed" }
      ]);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chef/inventory/`);
      
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      } else {
        console.error("Failed to fetch inventory:", response.status);
        // Заглушка для демонстрации
        setInventory([
          { id: "1", name: "Яйца", category: "Продукты", quantity: 50, unit: "шт", min_quantity: 20, last_restock: "2024-01-01", supplier: "Ферма" },
          { id: "2", name: "Молоко", category: "Молочные", quantity: 10, unit: "л", min_quantity: 5, last_restock: "2024-01-01", supplier: "Молочный завод" }
        ]);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      // Заглушка для демонстрации
      setInventory([
        { id: "1", name: "Яйца", category: "Продукты", quantity: 50, unit: "шт", min_quantity: 20, last_restock: "2024-01-01", supplier: "Ферма" },
        { id: "2", name: "Молоко", category: "Молочные", quantity: 10, unit: "л", min_quantity: 5, last_restock: "2024-01-01", supplier: "Молочный завод" }
      ]);
    }
  };

  // Функции обновления данных (просто логируем, без реального API)
  const updateInventoryItem = async (id: string, data: Partial<InventoryItem>) => {
    console.log("Update inventory item:", id, data);
    // Просто обновляем локальное состояние для демонстрации
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, ...data } : item
    ));
    setEditingItem(null);
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    console.log("Update user:", id, data);
    // Просто обновляем локальное состояние для демонстрации
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...data } : user
    ));
    setEditingUser(null);
  };

  const updatePurchaseStatus = async (id: string, status: PurchaseRequest["status"]) => {
    console.log("Update purchase status:", id, status);
    // Просто обновляем локальное состояние для демонстрации
    setPurchaseRequests(prev => prev.map(request => 
      request.id === id ? { ...request, status } : request
    ));
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white p-6">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Заголовок */}
      <header className="mb-8 border-b-4 border-red-600 pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl text-green-500" style={{ fontFamily: "monospace" }}>
            [АДМИН_ПАНЕЛЬ]
          </h1>
          <button
            onClick={() => navigate("/")}
            className="border-2 border-red-600 px-4 py-2 hover:bg-red-600 transition-colors"
            style={{ fontFamily: "monospace" }}
          >
            [НАЗАД]
          </button>
        </div>
        <div className="mt-2 text-sm text-green-500" style={{ fontFamily: "monospace" }}>
          РЕЖИМ: ДЕМОНСТРАЦИЯ (БЕЗ ПРОВЕРКИ ПРАВ)
        </div>
      </header>

      {/* Навигация по табам */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 border-2 ${activeTab === "users" ? "border-red-600 bg-red-600" : "border-green-500 hover:border-red-600"}`}
          style={{ fontFamily: "monospace" }}
        >
          ПОЛЬЗОВАТЕЛИ
        </button>
        <button
          onClick={() => setActiveTab("purchases")}
          className={`px-4 py-2 border-2 ${activeTab === "purchases" ? "border-red-600 bg-red-600" : "border-green-500 hover:border-red-600"}`}
          style={{ fontFamily: "monospace" }}
        >
          ЗАЯВКИ
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2 border-2 ${activeTab === "payments" ? "border-red-600 bg-red-600" : "border-green-500 hover:border-red-600"}`}
          style={{ fontFamily: "monospace" }}
        >
          ПЛАТЕЖИ
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-4 py-2 border-2 ${activeTab === "inventory" ? "border-red-600 bg-red-600" : "border-green-500 hover:border-red-600"}`}
          style={{ fontFamily: "monospace" }}
        >
          ИНВЕНТАРЬ
        </button>
      </div>

      {/* Содержимое табов */}
      <div className="border-2 border-green-500 p-4">
        {/* Таблица пользователей */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-2xl text-green-500 mb-4" style={{ fontFamily: "monospace" }}>
              [ПОЛЬЗОВАТЕЛИ] (демо данные)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-green-500">
                <thead>
                  <tr className="bg-green-900">
                    <th className="border border-green-500 p-2">ID</th>
                    <th className="border border-green-500 p-2">Имя</th>
                    <th className="border border-green-500 p-2">Email</th>
                    <th className="border border-green-500 p-2">Роль</th>
                    <th className="border border-green-500 p-2">Баланс</th>
                    <th className="border border-green-500 p-2">Дата регистрации</th>
                    <th className="border border-green-500 p-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-800">
                      <td className="border border-green-500 p-2">{user.id}</td>
                      <td className="border border-green-500 p-2">{user.name}</td>
                      <td className="border border-green-500 p-2">{user.email}</td>
                      <td className="border border-green-500 p-2">
                        {editingUser?.id === user.id ? (
                          <select
                            value={editingUser.role}
                            onChange={(e) => setEditingUser({...editingUser as any, role: e.target.value})}
                            className="bg-black border border-red-600"
                          >
                            <option value="user">user</option>
                            <option value="chef">chef</option>
                            <option value="admin">admin</option>
                          </select>
                        ) : (
                          user.role
                        )}
                      </td>
                      <td className="border border-green-500 p-2">
                        {editingUser?.id === user.id ? (
                          <input
                            type="number"
                            value={editingUser.balance}
                            onChange={(e) => setEditingUser({...editingUser, balance: Number(e.target.value)})}
                            className="bg-black border border-red-600 w-20"
                          />
                        ) : (
                          `${user.balance}₽`
                        )}
                      </td>
                      <td className="border border-green-500 p-2">{user.created_at}</td>
                      <td className="border border-green-500 p-2">
                        {editingUser?.id === user.id ? (
                          <>
                            <button
                              onClick={() => updateUser(user.id, editingUser)}
                              className="border border-green-500 px-2 py-1 mr-2 hover:bg-green-500"
                            >
                              Сохранить
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="border border-red-600 px-2 py-1 hover:bg-red-600"
                            >
                              Отмена
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setEditingUser(user)}
                            className="border border-yellow-500 px-2 py-1 hover:bg-yellow-500"
                          >
                            Редактировать
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Таблица заявок на покупку */}
        {activeTab === "purchases" && (
          <div>
            <h2 className="text-2xl text-green-500 mb-4" style={{ fontFamily: "monospace" }}>
              [ЗАЯВКИ_НА_ПОКУПКУ] (демо данные)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-green-500">
                <thead>
                  <tr className="bg-green-900">
                    <th className="border border-green-500 p-2">ID</th>
                    <th className="border border-green-500 p-2">Пользователь</th>
                    <th className="border border-green-500 p-2">Блюдо</th>
                    <th className="border border-green-500 p-2">Сумма</th>
                    <th className="border border-green-500 p-2">Статус</th>
                    <th className="border border-green-500 p-2">Дата</th>
                    <th className="border border-green-500 p-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseRequests.map(request => (
                    <tr key={request.id} className="hover:bg-gray-800">
                      <td className="border border-green-500 p-2">{request.id}</td>
                      <td className="border border-green-500 p-2">{request.user_name}</td>
                      <td className="border border-green-500 p-2">{request.dish_name}</td>
                      <td className="border border-green-500 p-2">{request.amount}₽</td>
                      <td className="border border-green-500 p-2">
                        <span className={`px-2 py-1 ${
                          request.status === "approved" ? "bg-green-900" :
                          request.status === "rejected" ? "bg-red-900" :
                          "bg-yellow-900"
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="border border-green-500 p-2">{request.request_date}</td>
                      <td className="border border-green-500 p-2">
                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updatePurchaseStatus(request.id, "approved")}
                              className="border border-green-500 px-2 py-1 hover:bg-green-500"
                            >
                              Одобрить
                            </button>
                            <button
                              onClick={() => updatePurchaseStatus(request.id, "rejected")}
                              className="border border-red-600 px-2 py-1 hover:bg-red-600"
                            >
                              Отклонить
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Таблица платежей */}
        {activeTab === "payments" && (
          <div>
            <h2 className="text-2xl text-green-500 mb-4" style={{ fontFamily: "monospace" }}>
              [ПЛАТЕЖИ] (демо данные)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-green-500">
                <thead>
                  <tr className="bg-green-900">
                    <th className="border border-green-500 p-2">ID</th>
                    <th className="border border-green-500 p-2">Пользователь</th>
                    <th className="border border-green-500 p-2">Сумма</th>
                    <th className="border border-green-500 p-2">Метод</th>
                    <th className="border border-green-500 p-2">Статус</th>
                    <th className="border border-green-500 p-2">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-800">
                      <td className="border border-green-500 p-2">{payment.id}</td>
                      <td className="border border-green-500 p-2">{payment.user_name}</td>
                      <td className="border border-green-500 p-2">{payment.amount}₽</td>
                      <td className="border border-green-500 p-2">{payment.method}</td>
                      <td className="border border-green-500 p-2">
                        <span className={`px-2 py-1 ${
                          payment.status === "completed" ? "bg-green-900" :
                          payment.status === "failed" ? "bg-red-900" :
                          "bg-yellow-900"
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="border border-green-500 p-2">{payment.transaction_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Таблица инвентаря */}
        {activeTab === "inventory" && (
          <div>
            <h2 className="text-2xl text-green-500 mb-4" style={{ fontFamily: "monospace" }}>
              [ИНВЕНТАРЬ] (демо данные)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-green-500">
                <thead>
                  <tr className="bg-green-900">
                    <th className="border border-green-500 p-2">ID</th>
                    <th className="border border-green-500 p-2">Название</th>
                    <th className="border border-green-500 p-2">Категория</th>
                    <th className="border border-green-500 p-2">Количество</th>
                    <th className="border border-green-500 p-2">Ед. изм.</th>
                    <th className="border border-green-500 p-2">Мин. запас</th>
                    <th className="border border-green-500 p-2">Поставщик</th>
                    <th className="border border-green-500 p-2">Дата пополнения</th>
                    <th className="border border-green-500 p-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item.id} className={`hover:bg-gray-800 ${
                      item.quantity < item.min_quantity ? "bg-red-900/30" : ""
                    }`}>
                      <td className="border border-green-500 p-2">{item.id}</td>
                      <td className="border border-green-500 p-2">{item.name}</td>
                      <td className="border border-green-500 p-2">{item.category}</td>
                      <td className="border border-green-500 p-2">
                        {editingItem?.id === item.id ? (
                          <input
                            type="number"
                            value={editingItem.quantity}
                            onChange={(e) => setEditingItem({...editingItem, quantity: Number(e.target.value)})}
                            className="bg-black border border-red-600 w-20"
                          />
                        ) : (
                          item.quantity
                        )}
                      </td>
                      <td className="border border-green-500 p-2">{item.unit}</td>
                      <td className="border border-green-500 p-2">{item.min_quantity}</td>
                      <td className="border border-green-500 p-2">
                        {editingItem?.id === item.id ? (
                          <input
                            type="text"
                            value={editingItem.supplier}
                            onChange={(e) => setEditingItem({...editingItem, supplier: e.target.value})}
                            className="bg-black border border-red-600"
                          />
                        ) : (
                          item.supplier
                        )}
                      </td>
                      <td className="border border-green-500 p-2">{item.last_restock}</td>
                      <td className="border border-green-500 p-2">
                        {editingItem?.id === item.id ? (
                          <>
                            <button
                              onClick={() => updateInventoryItem(item.id, editingItem)}
                              className="border border-green-500 px-2 py-1 mr-2 hover:bg-green-500"
                            >
                              Сохранить
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="border border-red-600 px-2 py-1 hover:bg-red-600"
                            >
                              Отмена
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setEditingItem(item)}
                            className="border border-yellow-500 px-2 py-1 hover:bg-yellow-500"
                          >
                            Редактировать
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-4 border-2 border-green-500">
              <h3 className="text-xl text-green-500 mb-2" style={{ fontFamily: "monospace" }}>
                [БЫСТРОЕ_ПОПОЛНЕНИЕ]
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {inventory.filter(item => item.quantity < item.min_quantity).map(item => (
                  <div key={item.id} className="border border-red-600 p-3">
                    <div className="font-bold text-red-500">{item.name}</div>
                    <div className="text-sm">Текущее: {item.quantity}{item.unit}</div>
                    <div className="text-sm">Мин.: {item.min_quantity}{item.unit}</div>
                    <button
                      onClick={() => {
                        const newQuantity = prompt(`Введите новое количество для ${item.name} (${item.unit}):`, 
                          String(Math.max(item.quantity, item.min_quantity * 2)));
                        if (newQuantity) {
                          updateInventoryItem(item.id, { 
                            quantity: Number(newQuantity),
                            last_restock: new Date().toISOString().split('T')[0]
                          });
                        }
                      }}
                      className="mt-2 border border-green-500 px-3 py-1 hover:bg-green-500 w-full"
                    >
                      Пополнить
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}