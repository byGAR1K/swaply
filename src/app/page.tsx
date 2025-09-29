'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gifts from "@/data/gifts.json";
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import { THEME, UIWallet } from '@tonconnect/ui';



export const  HeaderWithBalance = () => {
  const [tonConnectUI] = useTonConnectUI();
  const account = tonConnectUI?.account;

  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!account) return;

    const fetchBalance = async () => {
      try {
        const res = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${account.address}`);
        const data = await res.json();
        if (data.result) {
          setBalance(parseInt(data.result) / 1_000_000_000); // переводим в TON
        }
      } catch (err) {
        console.error("Ошибка при получении баланса:", err);
        setBalance(null);
      }
    };

    fetchBalance();
  }, [account]);
}
export const SetTonTheme = () => {
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    if (!tonConnectUI) return;

    tonConnectUI.uiOptions = {
      uiPreferences: {
        theme: THEME.DARK, // DARK или LIGHT
      },
    };
  }, [tonConnectUI]);

  return null; // Компонент ничего не рендерит
};

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  
  
  const [isProcessing, setIsProcessing] = useState(false); // Процесс покупки подарка {КУПИТЬ, ОБРАБОТКА, ОТМЕНА ТРАНЗАКЦИИ, НЕДОСТАТОЧНО СРЕДСТВ}

  // Вверху компонента Home:
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Функция для показа уведомления на 3 секунды
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };
  const [activeTab, setActiveTab] = useState("Telegram");
  const [activeGiftFilter, setActiveGiftFilter] = useState("Все");
  const [theme, setTheme] = useState<'dark' | 'light'>('dark'); // состояние темы

  const [isModalOpen, setIsModalOpen] = useState(false);

  

  const [tonConnectUI] = useTonConnectUI();
  const account = tonConnectUI?.account;
  const connector = tonConnectUI?.connector;

  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (account) {
      // Пример через API Toncenter (альтернатива Ton SDK)
      fetch(`https://toncenter.com/api/v2/getAddressInformation?address=${account.address}`)
        .then(res => res.json())
        .then(data => {
          if (data?.result?.balance) {
            setBalance(data.result.balance / 1_000_000_000);
          }
        })
        .catch(() => setBalance(0));
    } else {
      setBalance(null);
    }
  }, [account]);


  // блокировка скролла при открытом модальном окне
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);
  // Определяем тип подарка
  type Gift = {
    name: string;
    desc: string;
    type: string;
    image: string;
    link?: string;
    price?: string; // если у тебя есть цена
  };

  // Используем тип в useState
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  // Фильтры для вкладки Gifts
  const giftFilters = ["Все", "Популярные", "Редкие", "Новые", "Акционные"];
  
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
  useEffect(() => {
    if (selectedGift) {
      // Запрещаем прокрутку
      document.body.style.overflow = 'hidden';
    } else {
      // Разрешаем прокрутку
      document.body.style.overflow = 'auto';
    }
  
    // Очистка эффекта при размонтировании
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedGift]);
  


  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState<{
    avatar: string | null;
    name: string;
    username: string; // <-- поле с логином пользователя
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string | null>(null);

  // Убираем @ и "Contact " из имени
  const cleanUsername = (name: string) => {
    return name.replace(/^@/, "").replace(/^Contact\s*/, "");
  };

  // Проверка валидности Telegram username
  const isValidTelegramUsername = (username: string) => {
    return /^[a-zA-Z_][a-zA-Z0-9_]{4,31}$/.test(username);
  };

  useEffect(() => {
    if (!username) {
      setUserInfo(null);
      setError(null);
      return;
    }

    if (!isValidTelegramUsername(username)) {
      setUserInfo(null);
      setError("Некорректный ник Telegram");
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/get_user?username=${username}`);
        const data = await res.json();

        if (!data.error) {
          // Подставляем чистый логин
          setUserInfo({
            ...data,
            username: cleanUsername(data.username || data.name), 
          });
          setError(null);
        } else {
          setUserInfo(null);
          setError("Пользователь не найден");
        }
      } catch {
        setUserInfo(null);
        setError("Ошибка сервера");
      }

      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [username]);




  const [stars, setStars] = useState<number | "">("");
  const [tonRateUsd, setTonRateUsd] = useState<number | null>(null);
  const starsToTonRate = 0.0056; // 1 Star ≈ 0.0056 TON

  // Загружаем курс TON → USD
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd"
        );
        const data = await res.json();
        setTonRateUsd(data["the-open-network"].usd);
      } catch {
        setTonRateUsd(null);
      }
    };

    fetchRate();
    const interval = setInterval(fetchRate, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Конвертация
  const starsToTon = stars ? Number(stars) * starsToTonRate : 0;
  const starsToUsd = tonRateUsd ? starsToTon * tonRateUsd : 0;

  // Валидация
  useEffect(() => {
    if (!stars) {
      setErrors(null); //Error  name new
      return;
    }
    if (Number(stars) < 50) setErrors("Ошибка меньше 50");
    else if (Number(stars) > 20000) setErrors("Ошибка  больше 20000");
    else setErrors(null);
  }, [stars]);


  // Включение класса на body при смене темы
  useEffect(() => {
    document.body.className = theme === 'dark' 
      ? 'bg-[#1E293B] text-white font-sans' 
      : 'bg-white text-gray-900 font-sans';
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case "Telegram":
        return (
          <>
            <section className="max-w-5xl mx-auto py-12 px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-left">
              Получите услуги{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 animate-gradient-x">
                Telegram
              </span>{" "}
              быстро - <span className="inline-block">KYC</span>
            </h2>

            {/* Блок с уткой */}
            <section className="max-w-5xl mx-auto bg-[#2C3E50] border border-gray-600 rounded-3xl shadow-lg p-12 mt-5 mb-12 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <img
                  src="https://media.tenor.com/-UVdGp9pWrAAAAAi/utya-telegram.gif"
                  alt="Веселая утка"
                  className="w-48 h-48 md:w-56 md:h-56 rounded-xl shadow-lg"
                />
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left">
                <h3 className="text-3xl font-bold">Крутые функции Swaply</h3>
                <p className="text-gray-300 text-lg">
                  Вы можете быстро покупать звезды, управлять подарками и оплачивать услуги безопасно. Всё через Telegram, без лишней волокиты и KYC.
                </p>
                <button
                  onClick={() => setIsOpen(true)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
                >
                  Начать
                </button>
              </div>
            </section>

            {/* Купить звезды */}
            <section className="max-w-5xl mx-auto bg-[#2C3E50] shadow-xl rounded-3xl p-8">
              <h3 className="text-2xl font-semibold mb-6 text-center">Купить звезды ⭐</h3>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <form className="flex-1 space-y-4 w-full">
                  <div className="relative">
                    <label className="block mb-1 text-gray-300">CHOOSE RECIPIENT</label>

                    <input
                      type="text"
                      placeholder="Enter Telegram username"
                      value={userInfo ? userInfo.username : username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setUserInfo(null);
                        setError(null);
                      }}
                      disabled={!!userInfo}
                      className={`w-full pl-12 pr-10 py-3 rounded-lg bg-[#1E293B] border-none text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                        error ? "focus:ring-red-400" : "focus:ring-blue-400"
                      }`}
                    />

                    {/* Аватар слева */}
                    {userInfo?.avatar && (
                      <img
                        src={userInfo.avatar}
                        alt="Avatar"
                        className="w-7 h-7 rounded-full absolute left-3 top-12 -translate-y-1/2"
                      />
                    )}

                    {/* Крестик справа */}
                    {(username || userInfo) && (
                      <button
                        type="button"
                        onClick={() => {
                          setUsername("");
                          setUserInfo(null);
                          setError(null);
                        }}
                        className="absolute right-3 top-13 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {loading && <p className="text-gray-300">Загрузка...</p>}
                  {error && <p className="text-red-400">{error}</p>}

                  <div>
                    <label className="block mb-1 text-gray-300">SELECT PAYMENT METHOD</label>
                    <select className="w-full p-3 rounded-lg bg-[#1E293B] border-none focus:outline-none focus:ring-2 focus:ring-blue-400">
                      <option>Ton</option>
                    </select>
                  </div>

                  <div>
                  <label className="block mb-1 text-gray-300">CHOOSE THE NUMBER OF TELEGRAM STARS</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Enter the amount (50 - 20,000)"
                      value={stars}
                      onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : "";
                        setStars(value);

                        if (value !== "") {
                          if (value < 50) {
                            setErrors("Минимум 50 ⭐");
                          } else if (value > 20000) {
                            setErrors("Максимум 20 000 ⭐");
                          } else {
                            setErrors(null);
                          }
                        } else {
                          setErrors(null);
                        }
                      }}
                      className={`w-full p-3 rounded-lg bg-[#1E293B] border ${
                        errors ? "border-red-500 focus:ring-red-400" : "border-none focus:ring-blue-400"
                      } text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                    />

                    {/* Справа конвертация */}
                    {stars && !errors && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        ≈ {starsToTon.toFixed(2)} TON {tonRateUsd && `(${starsToUsd.toFixed(2)}$)`}
                      </span>
                    )}
                  </div>

                  {/* Ошибка ниже инпута */}
                  {errors && <p className="text-red-400 text-sm mt-1">{errors}</p>}
                </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Купить ⭐
                  </button>
                </form>

                <div className="flex-1 w-full flex justify-center">
                  <img
                    src="https://media.tenor.com/XeoIkKG0G2kAAAAi/%D1%83%D1%82%D0%B5%D0%BD%D0%BE%D0%BA.gif"
                    alt="GIF"
                    className="rounded-xl max-h-80 object-cover"
                  />
                </div>
              </div>
            </section>
          </section>

          </>
        );
        
        case "Premium":
          return (
            <section className="max-w-5xl mx-auto bg-[#2C3E50] rounded-3xl shadow-lg p-6 mt-5 mb-12">
              <h2 className="text-3xl font-bold text-center mb-6">Premium услуги 🚀</h2>
              <form className="space-y-4 max-w-lg mx-auto">
                <div className="relative">
                  <label className="block mb-1 text-gray-300">Ник Telegram</label>
                  <input
                    type="text"
                    placeholder="@username Telegram"
                    value={userInfo ? userInfo.username : username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUserInfo(null);
                      setError(null);
                    }}
                    disabled={!!userInfo}
                    className={`w-full pl-12 pr-10 py-3 rounded-lg bg-[#1E293B] border-none text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                      error ? "focus:ring-red-400" : "focus:ring-blue-400"
                    }`}
                  />
                  {/* Аватар слева */}
                  {userInfo?.avatar && (
                    <img
                      src={userInfo.avatar}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full absolute left-3 top-12 -translate-y-1/2"
                    />
                  )}
                  {/* Крестик справа для очистки */}
                  {(username || userInfo) && (
                    <button
                      type="button"
                      onClick={() => {
                        setUsername("");
                        setUserInfo(null);
                        setError(null);
                      }}
                      className="absolute right-3 top-13 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {loading && <p className="text-gray-300">Загрузка...</p>}
                {error && <p className="text-red-400">{error}</p>}
        
                <div>
                  <label className="block mb-1 text-gray-300">Срок подписки</label>
                  <select className="w-full p-3 rounded-lg bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="3">3 месяца</option>
                    <option value="6">6 месяцев</option>
                    <option value="12">12 месяцев</option>
                  </select>
                </div>

        
                <div>
                  <label className="block mb-1 text-gray-300">Способ оплаты</label>
                  <select className="w-full p-3 rounded-lg bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option>Stars</option>
                    <option>Crypto</option>
                    <option>Card</option>
                  </select>
                </div>
        
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
                >
                  Оплатить Premium
                </button>
              </form>
            </section>
          );

      case "Stars":
        return (
          <section className="max-w-5xl mx-auto text-center py-12 text-gray-300">
            <h2 className="text-4xl font-bold mb-4">Звезды</h2>
            <p>Здесь можно управлять покупкой и использованием звезд.</p>
          </section>
        );

      case "Gifts":
        const filteredGifts = gifts.filter(
          (g) => activeGiftFilter === "Все" || g.type === activeGiftFilter
        );
        
        return (
          <section className="max-w-6xl mx-auto py-8 px-4 flex flex-col gap-6">
            {/* Инфо-блок */}
            <div className="bg-[#2C3E50] p-6 rounded-3xl shadow-lg text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">Telegram gifts</h2>
              <p className="text-gray-300 mb-3">
                 Gifts — это твоя витрина уникальных Telegram-подарков. Собирай, храни и продавай.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm text-blue-400 hover:underline"
              >
                Как добавить новые подарки?
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              {/* Блок фильтров */}
              <div className="w-full md:w-1/4 bg-[#2C3E50] p-3 md:p-6 rounded-3xl shadow-lg flex flex-row md:flex-col gap-2 md:gap-3 overflow-x-auto scrollbar-hide h-fit">
                {giftFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveGiftFilter(filter)}
                    className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold flex-shrink-0 transition text-sm md:text-base ${
                      activeGiftFilter === filter
                        ? "bg-blue-500 text-white"
                        : "bg-[#1E293B] text-gray-300 hover:bg-blue-600 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Блок сетки подарков */}
              <div className="w-full md:w-3/4 bg-[#2C3E50] p-3 md:p-6 rounded-3xl shadow-lg">
                {filteredGifts.length === 0 ? (
                  <p className="text-gray-400 text-center py-10 text-lg">
                    😢 Информация про подарки отсутствует
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {filteredGifts.map((gift, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedGift(gift)} // открытие модалки для подарка
                        className="relative bg-[#1E293B] p-4 md:p-6 rounded-2xl shadow-md flex flex-col items-center justify-center hover:scale-105 transition cursor-pointer"
                      >
                        {/* Badge */}
                        {gift.type && (
                          <span
                            className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded-full text-white ${
                              gift.type === "Новые" ? "bg-green-500" :
                              gift.type === "Популярные" ? "bg-purple-500" :
                              gift.type === "Редкие" ? "bg-yellow-500" :
                              gift.type === "Популярные" ? "bg-blue-400" :

                              "bg-gray-500"
                            }`}
                          >
                            {gift.type}
                          </span>
                        )}

                        <img
                          src={gift.image}
                          alt={gift.name}
                          className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-lg mb-3"
                        />
                        <h3 className="text-sm md:text-base font-semibold text-center mb-2">
                          {gift.name}
                        </h3>
                        <p className="text-gray-300 text-xs md:text-sm text-center mb-2">
                          {gift.desc}
                        </p>
                        {gift.link && (
                          <a
                            href={gift.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline text-xs md:text-sm"
                          >
                            Подробнее
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Модалка */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-[#2C3E50] text-white p-6 md:p-8 rounded-3xl shadow-xl w-full max-w-lg relative">
                  {/* Кнопка закрыть */}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl"
                  >
                    ✖
                  </button>

                  {/* Заголовок */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-[#1E293B] rounded-full flex items-center justify-center mb-3">
                    <img
                        src="https://media.tenor.com/EsfiU8pyvMsAAAAi/utya-utya-duck.gif"
                        alt="utya"
                        className="w-48 h-48 mx-auto rounded-lg mb-4 object-contain"
                    />
                    </div>
                    <h2 className="text-2xl font-bold">Как добавить подарки</h2>
                    <p className="text-gray-300 text-sm mt-2 text-center">
                      Отправляйте свои NFT-подарки и сразу выставляйте их на продажу.
                    </p>
                  </div>

                  {/* Шаги */}
                  <div className="space-y-4">
                    <div className="bg-[#1E293B] p-4 rounded-xl">
                      <h3 className="font-semibold text-blue-400">ШАГ 1</h3>
                      <p className="text-sm text-gray-300 mt-1">
                        Отправьте любое сообщение боту{" "}
                        <a
                          href="@"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          @none
                        </a>
                      </p>
                    </div>

                    <div className="bg-[#1E293B] p-4 rounded-xl">
                      <h3 className="font-semibold text-blue-400">ШАГ 2</h3>
                      <p className="text-sm text-gray-300 mt-1">
                        Перейдите в профиль{" "}
                        <a
                          href="@"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          @none
                        </a>{" "}
                        и нажмите «Send Gift».
                      </p>
                    </div>

                    <div className="bg-[#1E293B] p-4 rounded-xl">
                      <h3 className="font-semibold text-blue-400">ШАГ 3</h3>
                      <p className="text-sm text-gray-300 mt-1">
                        Выберите подарок и купите его для{" "}
                        <span className="text-blue-400">@none</span>.
                      </p>
                    </div>

                    <div className="bg-[#1E293B] p-4 rounded-xl">
                      <h3 className="font-semibold text-blue-400">ШАГ 4</h3>
                      <p className="text-sm text-gray-300 mt-1">
                        Найдите свой подарок в профиле и выставьте его на продажу.
                      </p>
                    </div>
                  </div>

                  {/* Кнопка закрыть */}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-6 w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold text-white">
                    Понятно, закрыть
                  </button>
                </div>
              </div>
            )}
          </section>
        );

      default:
        return null;
    }
  };
  
  return (
    <main className="min-h-screen bg-[#1E293B] text-white font-sans flex flex-col">
      {/* Шапка */}
      <header className="bg-[#2C3E50] shadow-md py-4">
        <div className="flex items-center max-w-5xl mx-6 md:mx-auto justify-between">
          <div className="flex items-center gap-2 flex-shrink-0">
            <h1 className="text-xl font-bold">🚀 SWAPLY</h1>
          </div>

          <nav className="overflow-x-auto scrollbar-hide ml-6 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex space-x-6 px-4 md:justify-center">
                {["Telegram", "Premium", "Stars", "Gifts"].map((tab) => (
                  <span
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`cursor-pointer whitespace-nowrap pb-2 transition border-b-2 ${
                      activeTab === tab
                        ? "border-blue-400 text-white"
                        : "border-transparent text-gray-300 hover:text-white"
                    }`}
                  >
                    {tab}
                  </span>
                ))}
              </div>

              {/* TON Connect кнопка справа */}
              <div className="ml-4">
                <SetTonTheme />
                <TonConnectButton />
              </div>
              
            </div>
          </nav>
        </div>
      </header>
      {/* Модальное окно НАЧАТЬ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#2C3E50] border border-gray-600 rounded-2xl shadow-xl p-6 max-w-lg w-full relative text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {/* Кнопка закрытия */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
              >
                ✖
              </button>

              <h2 className="text-2xl font-bold mb-6 text-center">
                🚀 Добро пожаловать в Swaply
              </h2>

              {/* Шаги в карточках */}
              <div className="space-y-4">
                <div className="bg-[#1E293B] p-4 rounded-xl shadow-md">
                  <h3 className="font-semibold text-blue-400">ШАГ 1</h3>
                  <p className="text-sm text-gray-300 mt-1 font-bold">
                    Авторизуйтесь через Telegram
                  </p>
                </div>

                <div className="bg-[#1E293B] p-4 rounded-xl shadow-md">
                  <h3 className="font-semibold text-blue-400">ШАГ 2</h3>
                  <p className="text-sm text-gray-300 mt-1 font-bold">
                    Пополните баланс или подключите Ton Wallet
                  </p>
                </div>

                <div className="bg-[#1E293B] p-4 rounded-xl shadow-md">
                  <h3 className="font-semibold text-blue-400">ШАГ 3</h3>
                  <p className="text-sm text-gray-300 mt-1 font-bold">
                    Выбирайте подарки и услуги прямо на сайте
                  </p>
                </div>

                <div className="bg-[#1E293B] p-4 rounded-xl shadow-md">
                  <h3 className="font-semibold text-blue-400">ШАГ 4</h3>
                  <p className="text-sm text-gray-300 mt-1 font-bold">
                    Оплачивайте в пару кликов без KYC
                  </p>
                </div>

                <div className="bg-[#1E293B] p-4 rounded-xl shadow-md">
                  <h3 className="font-semibold text-blue-400">ШАГ 5</h3>
                  <p className="text-sm text-gray-300 mt-1 font-bold">
                    Подписывайте транзакцию в сети TON и получайте услугу
                  </p>
                </div>
              </div>

              {/* Кнопка закрыть */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold"
                >
                  Понятно
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      
      
      
      {/* Модальное окно */}
      <AnimatePresence>
      {selectedGift && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={selectedGift.name} // 👈 уникальный ключ для модалки
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-[#2C3E50] rounded-3xl shadow-xl max-w-md w-full p-6 relative"
          >
            {/* Кнопка закрытия */}
            <button
              onClick={() => setSelectedGift(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold"
            >
              &times;
            </button>

            {/* Изображение подарка */}
            <img
              src={selectedGift.image}
              alt={selectedGift.name}
              className="w-48 h-48 mx-auto rounded-lg mb-4 object-contain"
            />

            {/* Название и описание */}
            <h3 className="text-2xl font-bold text-center mb-2">{selectedGift.name}</h3>
            <p className="text-gray-300 text-center mb-4">{selectedGift.desc}</p>

            {/* Цена в TON */}
            <div className="bg-[#1E293B] flex items-center justify-center gap-2 p-3 rounded-2xl mb-4 border border-blue-400">
              <img
                src="https://ton.org/icons/custom/ton_logo.svg"
                alt="toncoin"
                className="w-6 h-6 object-contain"
              />
              <span className="text-sm md:text-base font-bold text-white">
                {selectedGift.price} TON
              </span>
            </div>

            {/* Кнопка Купить */}
            <button
              disabled={isProcessing} // 🚫 блокировка во время выполнения
              onClick={async () => {
                if (!connector || !account) {
                  return showNotification("error", "Сначала подключите кошелек!");
                }

                try {
                  setIsProcessing(true); // 🚀 блокируем кнопку
                  const valueNano = Number(selectedGift.price || 0) * 1_000_000_000;

                  const transaction = {
                    validUntil: Math.floor(Date.now() / 1000) + 60,
                    messages: [
                      {
                        address: "UQBQtv0HGH1jp9dXx3OcUoD2j-CW5NyMff7MlRBgVkuhP0Ki",
                        amount: valueNano.toString(),
                      }
                    ]
                  };

                  // уведомление сразу
                  showNotification("success", `Транзакция на ${selectedGift.price} TON отправлена в кошелек`);

                  const result = await connector.sendTransaction(transaction);
                  console.log("Транзакция отправлена:", result);

                  showNotification("success", `Вы успешно купили ${selectedGift.name}!`);
                  setSelectedGift(null); // закрыть модалку
                } catch (err) {
                  console.error("Ошибка транзакции:", err);
                  showNotification("error", "Ошибка при отправке транзакции");
                } finally {
                  setIsProcessing(false); // ✅ разблокировка кнопки
                }
              }}
              className={`w-full font-semibold py-3 rounded-lg transition 
                ${isProcessing 
                  ? "bg-gray-500 cursor-not-allowed" 
                  : "bg-blue-500 hover:bg-blue-600 text-white"}`}
            >
              {isProcessing ? "Обработка..." : "Купить"}
            </button>

          </motion.div>
        </motion.div>
      )}
      <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl shadow-lg text-white font-semibold z-50 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {notification.message}
        </motion.div>
      )}
    </AnimatePresence>

      </AnimatePresence>         
      {/* Контент */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Футер */}
      <footer className="bg-[#2C3E50] py-6 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between text-gray-400 px-6 md:px-0">
          <a
            href="https://t.me/yourchannel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-blue-400 transition"
          >
            <span className="text-lg">📢</span> Наш Telegram канал
          </a>
          <p className="mt-4 md:mt-0 text-sm">
            &copy; {new Date().getFullYear()} Swaply. Все права защищены.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-400 transition">Terms</a>
            <a href="#" className="hover:text-blue-400 transition">Privacy</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}
