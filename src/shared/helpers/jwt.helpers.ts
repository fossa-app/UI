export const decodeJwt = <T = unknown>(token?: string): T | null => {
  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split('.');
    const decodedPayload = atob(payload);

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};
