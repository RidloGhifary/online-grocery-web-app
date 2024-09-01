export default async function (input:string):Promise<string> {
  return input.split(' ').map(word => `%${word}`).join('%') + '%';
}