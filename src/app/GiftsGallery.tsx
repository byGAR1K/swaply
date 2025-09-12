import { useEffect, useState } from 'react';

interface Gift {
  id: string;
  name: string;
  description: string;
  image: string;
}

const GiftsGallery = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await fetch('https://api.getgems.io/gifts'); // реальный API URL
        const data = await response.json();
        setGifts(data);
      } catch (error) {
        console.error("Ошибка при загрузке подарков:", error);
      }
    };

    fetchGifts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {gifts.map((gift) => (
        <div
          key={gift.id}
          className="bg-[#1E293B] p-4 rounded-2xl shadow-md flex flex-col items-center justify-center hover:scale-105 transition"
        >
          <img src={gift.image} alt={gift.name} className="w-32 h-32 object-contain rounded-lg mb-3" />
          <h3 className="text-sm md:text-base font-semibold text-center mb-2">{gift.name}</h3>
          <p className="text-gray-300 text-xs md:text-sm text-center">{gift.description}</p>
        </div>
      ))}
    </div>
  );
};

export default GiftsGallery;