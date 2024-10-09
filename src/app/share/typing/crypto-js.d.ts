declare module 'crypto-js' {
  export const AES: {
    encrypt(message: string, key: string): { toString: () => string };
    decrypt(ciphertext: string, key: string): { toString: () => string };
  };
  export const enc: {
    Hex: {
      parse(str: string): any;
    };
  };
}
