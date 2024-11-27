import { translateError } from '@/errors/errorTranslations';
import { AxiosError, AxiosResponse } from 'axios';

interface ApiErrorResponse {
  error_code?: string;
  error_description?: string;
}

export interface CustomAxiosResponse<T = any> extends AxiosResponse<T | ApiErrorResponse> {}

type ErrorWithResponse = AxiosError<CustomAxiosResponse> | Error | unknown;

export const defaultErrorToast = (error: ErrorWithResponse) => {
  if (error instanceof AxiosError && error.response) {
    const response = error.response as CustomAxiosResponse;

    if (response.data?.error_code && response.data?.error_description) {
      const { error_code, error_description } = response.data;
      const { title, description } = translateError(error_code, error_description);

      return {
        title,
        description,
        status: "error",
      };
    }
  }

  return {
    title: "Erro desconhecido",
    description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
    status: "error",
  };
};
