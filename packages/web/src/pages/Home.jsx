// src/pages/Home.jsx
import React from 'react';
import "../globals.css"

const Home = () => {
  const campaigns = [
    {
      title: "Kampanya #1",
      description: "Ünlü bir markadan yüksek bütçeli işbirliği!",
    },
    {
      title: "Kampanya #2",
      description: "Moda kategorisinde 5 işbirliği yayında!",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-4">Aktif Kampanyalar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((c, index) => (
          <div key={index} className="p-4 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold">{c.title}</h2>
            <p className="text-gray-400">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;