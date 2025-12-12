import React from 'react';

export default function LoginBox() {
  return (
    <div className="border-2 border-green-300 rounded-2xl p-6 w-[400px] bg-white shadow-sm mx-auto">
      <div className="flex flex-col gap-4">
        <label className="flex items-center justify-between text-lg">
          <span className="mr-4">ID</span>
          <input
            type="text"
            placeholder="XXXXXXXX..."
            className="border px-3 py-2 rounded w-[220px]"
          />
        </label>

        <label className="flex items-center justify-between text-lg">
          <span className="mr-4">パスワード</span>
          <input
            type="password"
            placeholder="XXXXXXXX..."
            className="border px-3 py-2 rounded w-[220px]"
          />
        </label>

        <button className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-6 rounded shadow mx-auto">
          ログイン
        </button>
      </div>
    </div>
  );
}
