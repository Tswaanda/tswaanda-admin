export const categories = [
  "Fruits and Vegetables",
  "Grains and Cereals",
  "Dairy Products",
  "Meat and Poultry",
  "Eggs",
  "Mushrooms",
  "Honey and Bee Products",
  "Fish and Seafood",
  "Herbs and Spices",
  "Flowers and Plants",
  "Nuts and Seeds",
  "Beverages",
  "Organic and Specialty",
];

export const formatDate = (timestamp: string | number): string => {
  const date = new Date(Number(timestamp));
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

export const formatTime = (timestamp: string | number): string => {
  const date = new Date(Number(timestamp));
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return date.toLocaleTimeString("en-US", options);
};


