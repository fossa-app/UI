export const toBigIntId = (value: bigint | number | string): bigint => (typeof value === 'bigint' ? value : BigInt(value));

export const toNullableBigIntId = (value: bigint | number | string | null | undefined): bigint | null => {
  if (value === null || value === undefined) {
    return null;
  }

  return toBigIntId(value);
};
