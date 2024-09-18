import React from "react";

const Home = () => {
    const items = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        name: `Hoodie ${index + 1}`,
        price: `$49.99`,
        image: process.env.PUBLIC_URL + "/hoodie1.png",
      }));
    
      return (
        <div className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {items.slice(0, 9).map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 flex flex-col items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-50 object-cover rounded-lg mb-4" // Устанавливаем фиксированную высоту
                  style={{ maxWidth: '300px' }} // Ограничиваем максимальную ширину
                />
                <h2 className="text-xl font-semibold mb-2 text-center">{item.name}</h2>
                <p className="text-gray-700 mb-4 text-center">{item.price}</p>
                <button className="bg-black text-white py-2 px-4 rounded-lg hover:bg-green-600 transition">
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>
      );
  };
  
export default Home;