import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";
import { authClient } from "@/lib/auth-client";

const API_BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:3000/api"
    : `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"}/api`;

const authFetch = (url: string, options: RequestInit = {}) => {
  const extraHeaders: Record<string, string> =
    Platform.OS !== "web" ? { cookie: authClient.getCookie() } : {};
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
      ...options.headers,
    },
  });
};

export const useTransaction = (userId: string) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expense: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await authFetch(`${API_BASE_URL}/transaction/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await authFetch(
        `${API_BASE_URL}/transaction/summary/${userId}`,
      );
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchTransactions, fetchSummary]);

  const deleteTransaction = async (id: string) => {
    try {
      const response = await authFetch(`${API_BASE_URL}/transaction/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete transaction");

      loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", error.message);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction}
};
