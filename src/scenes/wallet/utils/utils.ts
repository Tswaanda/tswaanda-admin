export const formatAddress = (hash: string) => {
    if (hash.length > 20) {
      return hash.substring(0, 10) + '...' + hash.substring(hash.length - 10);
    }
    return hash;
  }