// SubscriptionModal.jsx

import React from 'react';

const SubscriptionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#202020] rounded-lg p-6 w-11/12 max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Subscription Required</h2>
        <p className="text-gray-300 mb-6">
          Unlock this content by subscribing to our premium plan.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
