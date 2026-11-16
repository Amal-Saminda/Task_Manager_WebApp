export const addThousandSeparater = (num) => {
  if(num == null || isNaN(num) ) return "";

  const [integerPart , fractionalPart] = num.toString().split(".");
  const formattedIntegrer = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart ? `${formattedIntegrer}.${fractionalPart}` : formattedIntegrer


}