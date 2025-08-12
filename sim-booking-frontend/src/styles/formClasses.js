// src/styles/formClasses.js

export const inputClass =
  "w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400";

export const labelClass = "block font-medium";

export const radioGroupClassYes = "peer-checked:bg-green-700 peer-checked:text-white px-4 py-2 border rounded-lg cursor-pointer hover:bg-indigo-100 transition";

export const radioGroupClassNo = "peer-checked:bg-red-700 peer-checked:text-white px-4 py-2 border rounded-lg cursor-pointer hover:bg-indigo-100 transition";

export const submitButtonClass = "mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700";

//versi responsif
//buat div headernya dulu
export const grid_col_6x = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4";
//baaru di dalamnya setiap div dibuat seperti ini
export const grid_2x = "col-span-12 sm:col-span-6 md:col-span-2";

//buat div headernya dulu
export const grid_head = "grid grid-cols-12 gap-4";
export const grid_head_nonform = "grid grid-cols-12 gap-4 mb-4";
//baaru di dalamnya setiap div dibuat seperti ini
export const grid_1 = "col-span-1";
export const grid_2 = "col-span-2";
export const grid_3 = "col-span-3";
export const grid_4 = "col-span-4";
export const grid_5 = "col-span-5";
export const grid_6 = "col-span-6";
export const grid_7 = "col-span-7";
export const grid_8 = "col-span-8";
export const grid_9 = "col-span-9";
export const grid_10 = "col-span-10";
export const grid_11 = "col-span-11";
export const grid_12 = "col-span-12";

//section title
export const section_head = "mb-2 border-b pb-0";
export const section_font = "text-lg font-semibold text-gray-700";
//section detail
//font detail
export const section_fd = "text-gray-700 font-medium";

//mengatur posisi item
export const itemPosition = "d-flex gap-3 mt-6 mb-4";

//border alami
export const border_head = "min-h-screen bg-gray-100 flex items-center justify-center px-4";
export const border_detail = "text-sm mb-6 px-4 py-4 bg-white rounded-md shadow-md border text-gray-700";

//font text biasa
export const labelBiasa = "block mb-1 font-medium text-gray-600 block mb-1";

//textbox disabled
export const textDisabled = "p-2 bg-gray-100 rounded-md font-medium";
export const textDisabledRed = "p-2 bg-red-100 rounded-md font-medium";
export const textDisabledGreen = "p-2 bg-green-100 rounded-md font-medium";
export const textDisabledOrange = "p-2 bg-orange-100 rounded-md font-medium";

//textbox varian
export const boxColorLine = "w-full p-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400";

//button style 
// // none,spin,ping,pulse,bounce
export const btnPulse = "bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:animate-pulse transition-all duration-300";
export const btnManualPulse = "bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300";
