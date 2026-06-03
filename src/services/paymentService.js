import axios from "axios";
export const coinPackages = [
  {
    id: 1,
    coins: 100,
    price: 1,
  },

  {
    id: 2,
    coins: 500,
    price: 5,
  },

  {
    id: 3,
    coins: 1000,
    price: 10,
  },

  {
    id: 4,
    coins: 5000,
    price: 50,
  },
  ];
  export const initializePayment = async ({
  email,
  amount,
}) => {
  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email,
      amount: amount * 100, // Paystack uses kobo/pesewas
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const verifyPayment = async (
  reference
) => {
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  return response.data;
};

