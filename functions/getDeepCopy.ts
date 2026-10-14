export const getDeepCopy = (arr: any) => {
  return JSON.parse(JSON.stringify(arr))
};