import useSWR from "swr";
import queryString from 'query-string';
import { CreditHistory } from "types";

export function useCredits(page: number, pageSize: number, status: 'pending' | 'completed' | undefined,  token: string) {
  const url = queryString.stringify({page, page_size: pageSize, status})
  const request = async (): Promise<CreditHistory[]> => {
    const response = await fetch(
      `/api/credit_history?${url}`,
    );
    const result = await response.json();
    return result.data;
  };

  const { data, error, isLoading } = useSWR(
    () => `/api/credit_history?${url}`,
    request,
  );
  return {
    data,
    isLoading,
    error,
  };
}
