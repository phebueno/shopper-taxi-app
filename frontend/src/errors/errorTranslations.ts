const errorTranslations: {
  [key: string]:
    | { title: string; description: string }
    | ((errorDescription: string) => { title: string; description: string });
} = {
  ROUTE_NOT_FOUND: {
    title: "Rota não encontrada",
    description: "Não foi possível calcular a sua rota.",
  },
  INVALID_DISTANCE: (errorDescription: string) => {
    if (errorDescription.includes("Driver")) {
      return {
        title: "Distância inválida",
        description: "O motorista selecionado não cobre a distância exigida.",
      };
    } else {
      return {
        title: "Distância inválida",
        description:
          "Não foi possível encontrar a distância entre os pontos fornecidos.",
      };
    }
  },
  INVALID_DATA: {
    title: "Dados inválidos",
    description:
      "Algum dos seus dados informados não foi processado corretamente, tente novamente.",
  },
  DRIVER_NOT_FOUND:{
    title: "Motorista não encontrado.",
    description:
      "O motorista requisitado não está nos nossos servidores!",
  },
  INVALID_DRIVER:{
    title: "Informações de motorista inválidas.",
    description:
      "Não foi possível pesquisar por este motorista!",
  },
  NO_RIDES_FOUND:{
    title: "Nenhuma viagem encontrada.",
    description:
      "Este usuário ainda não fez nenhuma viagem!",
  },
};

export const translateError = (
  error_code: string,
  error_description: string
) => {
  const translation = errorTranslations[error_code];

  if (translation) {
    if (typeof translation === "function") {
      return translation(error_description);
    } else {
      return translation;
    }
  }

  return {
    title: "Erro desconhecido",
    description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
  };
};
