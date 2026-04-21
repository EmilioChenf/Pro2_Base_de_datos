export function getErrorMessage(error: any, fallback = 'Ocurrio un error inesperado.') {
  return error?.response?.data?.message ?? fallback;
}
