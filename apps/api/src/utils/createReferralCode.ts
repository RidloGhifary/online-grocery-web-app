export default function createReferralCode(identifier: string) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `${identifier.slice(0, 3).toUpperCase()}-${result}`;
}
