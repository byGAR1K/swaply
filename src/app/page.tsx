'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gifts from "@/data/gifts.json";


export default function Home() {
  const [activeTab, setActiveTab] = useState("Telegram");
  const [activeGiftFilter, setActiveGiftFilter] = useState("Все");
  const [theme, setTheme] = useState<'dark' | 'light'>('dark'); // состояние темы


  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <section className="max-w-5xl mx-auto py-12 text-left px-6">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Получите услуги{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 animate-gradient-x">
                  Telegram
                </span>{" "}
                быстро -{" "}
                <span className="inline-block text-center w-full md:w-auto">KYC</span>
              </h2>
            </section>

            <section className="max-w-5xl mx-auto bg-[#2C3E50] border border-gray-600 rounded-3xl shadow-lg p-6 mt-5 mb-12 flex flex-col md:flex-row items-center gap-6">
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
                  Вы можете быстро покупать звезды, управлять подарками и оплачивать услуги безопасно.
                  Всё через Telegram, без лишней волокиты и KYC.
                </p>
                <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition">
                  Начать
                </button>
              </div>
            </section>

            <section className="max-w-5xl mx-auto bg-[#2C3E50] shadow-xl rounded-3xl p-8">
              <h3 className="text-2xl font-semibold mb-6 text-center">Купить звезды ⭐</h3>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <form className="flex-1 space-y-4 w-full">
                  <div>
                    <label className="block mb-1 text-gray-300">Вставьте ссылку</label>
                    <input
                      type="text"
                      placeholder="Enter Telegram username"
                      className="w-full p-3 rounded-lg bg-[#1E293B] border-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-300">Выберите способ оплаты</label>
                    <select className="w-full p-3 rounded-lg bg-[#1E293B] border-none focus:outline-none focus:ring-2 focus:ring-blue-400">
                      <option>Card</option>
                      <option>PayPal</option>
                      <option>Crypto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-300">Сколько звезд купить</label>
                    <input
                      type="number"
                      placeholder="Введите сумму (50 - 20 000)"
                      className="w-full p-3 rounded-lg bg-[#1E293B] border-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
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
          </>
        );

      case "Premium":
        return (
          <section className="max-w-5xl mx-auto bg-[#2C3E50] rounded-3xl shadow-lg p-6 mt-5 mb-12">
            <h2 className="text-3xl font-bold text-center mb-6">Premium услуги 🚀</h2>
            <form className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="block mb-1 text-gray-300">Ник Telegram</label>
                <input
                  type="text"
                  placeholder="@username"
                  className="w-full p-3 rounded-lg bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Срок подписки (месяцы)</label>
                <input
                  type="number"
                  placeholder="1"
                  className="w-full p-3 rounded-lg bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
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
                    className="mt-6 w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold text-white"
                  >
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
          </nav>
        </div>
      </header>
      {/* Модальное окно */}
      <AnimatePresence>
        {selectedGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                onClick={() => alert(`Вы купили ${selectedGift.name}!`)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Купить
              </button>
            </motion.div>
          </motion.div>
        )}
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
