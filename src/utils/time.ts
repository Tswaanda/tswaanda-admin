export const formatDate = (timestamp: string | number): string => {
    const date = new Date(Number(timestamp));
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleDateString("en-US", options);
  };


  export const nanoDateFormat = (timestamp: string | number | bigint): string => {
    let timestampBigInt: bigint;
    if (typeof timestamp === 'bigint') {
        timestampBigInt = timestamp;
    } else {
        timestampBigInt = BigInt(timestamp);
    }

    const milliseconds = Number(timestampBigInt / 1000000n);

    const date = new Date(milliseconds);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleDateString("en-US", options);
};
  