import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { getShopItems, buyItem, equipItem } from '../services/apiService'; // Will create this later

interface ShopItem {
  id: string;
  name: string;
  type: 'character' | 'board' | 'trail';
  price: number;
  owned: boolean;
  equipped: boolean;
}

const mockShopItems: ShopItem[] = [
  { id: 'char_default', name: 'Default Runner', type: 'character', price: 0, owned: true, equipped: true },
  { id: 'char_punk', name: 'Punk Dude', type: 'character', price: 1000, owned: false, equipped: false },
  { id: 'char_robot', name: 'Robot Racer', type: 'character', price: 2500, owned: false, equipped: false },
  { id: 'board_basic', name: 'Basic Board', type: 'board', price: 0, owned: true, equipped: true },
  { id: 'board_speed', name: 'Speed Board', type: 'board', price: 800, owned: false, equipped: false },
  { id: 'trail_none', name: 'No Trail', type: 'trail', price: 0, owned: true, equipped: true },
  { id: 'trail_sparkle', name: 'Sparkle Trail', type: 'trail', price: 500, owned: false, equipped: false },
];

const Shop: React.FC = () => {
  const [shopItems, setShopItems] = useState<ShopItem[]>(mockShopItems);
  const [userCoins, setUserCoins] = useState(5000); // Mock user coins
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        // In a real app, this would fetch user's owned items and current coins
        // const { items, coins } = await getShopItems();
        // setShopItems(items);
        // setUserCoins(coins);

        // For mock:
        setShopItems(mockShopItems.map(item => ({ 
            ...item, 
            owned: Math.random() > 0.7, // Simulate some owned items
            equipped: item.id === 'char_default' || item.id === 'board_basic' || item.id === 'trail_none' // Only default is equipped initially
        })));
        setUserCoins(Math.floor(Math.random() * 10000) + 1000); // Random mock coins
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch shop data.');
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, []);

  const handleBuy = async (itemId: string) => {
    const itemToBuy = shopItems.find(item => item.id === itemId);
    if (!itemToBuy || itemToBuy.owned || userCoins < itemToBuy.price) return;

    try {
      // await buyItem(itemId);
      // Update local state
      setShopItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, owned: true } : item
        )
      );
      setUserCoins(userCoins - itemToBuy.price);
      alert(`Successfully purchased ${itemToBuy.name}!`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to purchase item.');
    }
  };

  const handleEquip = async (itemId: string, itemType: string) => {
    const itemToEquip = shopItems.find(item => item.id === itemId);
    if (!itemToEquip || !itemToEquip.owned || itemToEquip.equipped) return;

    try {
      // await equipItem(itemId);
      // Update local state: unequip old item of same type, equip new one
      setShopItems(prevItems =>
        prevItems.map(item => {
          if (item.type === itemType) {
            return { ...item, equipped: item.id === itemId };
          }
          return item;
        })
      );
      alert(`Successfully equipped ${itemToEquip.name}!`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to equip item.');
    }
  };

  const renderItems = (type: ShopItem['type']) => {
    return shopItems.filter(item => item.type === type).map(item => (
      <div key={item.id} className="flex flex-col items-center bg-gray-700 p-4 rounded-md shadow-md">
        <h3 className="text-xl font-semibold text-yellow-300">{item.name}</h3>
        <p className="text-gray-300 mb-2">Price: {item.price} coins</p>
        {item.owned ? (
          item.equipped ? (
            <span className="text-green-400 font-bold">EQUIPPED</span>
          ) : (
            <button
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm transition-colors duration-200"
              onClick={() => handleEquip(item.id, item.type)}
            >
              Equip
            </button>
          )
        ) : (
          <button
            className={`mt-2 px-4 py-2 rounded-md text-sm transition-colors duration-200 ${userCoins >= item.price ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-500 cursor-not-allowed'}`}
            onClick={() => handleBuy(item.id)}
            disabled={userCoins < item.price}
          >
            Buy ({item.price})
          </button>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-800 rounded-lg shadow-xl w-3/4 max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400">Shop</h2>
      <p className="text-xl text-white mb-4">Your Coins: {userCoins}</p>
      {loading && <p>Loading shop...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="w-full space-y-8">
        <div>
          <h3 className="text-2xl font-bold mb-4 text-orange-300">Characters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderItems('character')}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4 text-orange-300">Boards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderItems('board')}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4 text-orange-300">Trails</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderItems('trail')}
          </div>
        </div>
      </div>

      <button
        className="mt-8 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-md text-lg font-semibold transition-colors duration-200"
        onClick={() => navigate('/')}
      >
        Back to Main Menu
      </button>
    </div>
  );
};

export default Shop;
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShopItems, buyItem, equipItem } from '../services/apiService';
import useAuthStore from '../stores/authStore';

interface ShopItem {
  id: string;
  name: string;
  type: 'character' | 'board' | 'trail';
  price: number;
  owned: boolean;
  equipped: boolean;
}

const Shop: React.FC = () => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUserProfile } = useAuthStore();

  const fetchShopData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setError('You must be logged in to view the shop.');
      setLoading(false);
      setShopItems([]);
      return;
    }
    try {
      const response = await getShopItems();
      // getShopItems now returns items with owned/equipped status based on backend and actual user data
      setShopItems(response.items.map(item => ({
        ...item,
        // Explicitly set equipped for character based on current_character from user data
        equipped: item.type === 'character' ? item.id === user.current_character : item.equipped
      })));
      // userCoins and currentCharacter are already in authStore, no need to update from here
    } catch (err: any) {
      setError(err.message || 'Failed to fetch shop data.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchShopData();
  }, [fetchShopData]);

  const handleBuy = async (itemId: string) => {
    if (!isAuthenticated || !user) {
      setError('Please login to buy items.');
      return;
    }

    const itemToBuy = shopItems.find(item => item.id === itemId);
    if (!itemToBuy || itemToBuy.owned || user.coins < itemToBuy.price) return;

    try {
      const response = await buyItem(itemId);
      // Update user coins and owned items in auth store
      updateUserProfile({ coins: response.coins, owned_items: response.owned_items, current_character: response.current_character });
      // Re-fetch shop data to update display
      await fetchShopData();
      alert(`Successfully purchased ${itemToBuy.name}!`);
    } catch (err: any) {
      setError(err.message || 'Failed to purchase item.');
    }
  };

  const handleEquip = async (itemId: string, itemType: string) => {
    if (!isAuthenticated || !user) {
      setError('Please login to equip items.');
      return;
    }

    const itemToEquip = shopItems.find(item => item.id === itemId);
    if (!itemToEquip || !itemToEquip.owned || itemToEquip.equipped) return;

    try {
      const response = await equipItem(itemId);
      // Update user's equipped character in auth store
      updateUserProfile({ current_character: response.current_character });
      // Re-fetch shop data to update display
      await fetchShopData();
      alert(`Successfully equipped ${itemToEquip.name}!`);
    } catch (err: any) {
      setError(err.message || 'Failed to equip item.');
    }
  };

  const renderItems = (type: ShopItem['type']) => {
    return shopItems.filter(item => item.type === type).map(item => (
      <div key={item.id} className="flex flex-col items-center bg-gray-700 p-4 rounded-md shadow-md">
        <h3 className="text-xl font-semibold text-yellow-300">{item.name}</h3>
        <p className="text-gray-300 mb-2">Price: {item.price} coins</p>
        {item.owned ? (
          item.equipped ? (
            <span className="text-green-400 font-bold">EQUIPPED</span>
          ) : (
            <button
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm transition-colors duration-200"
              onClick={() => handleEquip(item.id, item.type)}
            >
              Equip
            </button>
          )
        ) : (
          <button
            className={`mt-2 px-4 py-2 rounded-md text-sm transition-colors duration-200 ${user && user.coins >= item.price ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-500 cursor-not-allowed'}`}
            onClick={() => handleBuy(item.id)}
            disabled={user && user.coins < item.price}
          >
            Buy ({item.price})
          </button>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-800 rounded-lg shadow-xl w-3/4 max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400">Shop</h2>
      {isAuthenticated && user ? (
        <p className="text-xl text-white mb-4">Your Coins: {user.coins}</p>
      ) : (
        <p className="text-xl text-red-400 mb-4">Login to see your coins and purchase items!</p>
      )}
      {loading && <p>Loading shop...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!loading && !error && (
        <div className="w-full space-y-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-orange-300">Characters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderItems('character')}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 text-orange-300">Boards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderItems('board')}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 text-orange-300">Trails</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderItems('trail')}
            </div>
          </div>
        </div>
      )}

      <button
        className="mt-8 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-md text-lg font-semibold transition-colors duration-200"
        onClick={() => navigate('/')}
      >
        Back to Main Menu
      </button>
    </div>
  );
};

export default Shop;
