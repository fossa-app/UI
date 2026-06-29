export const areEqualBigIds = (value1: number | string, value2: number | string): boolean => {
  try {
    return BigInt(value1) === BigInt(value2);
  } catch {
    return false;
  }
};
