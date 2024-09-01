export default async function (input?:string):Promise<string> {
  if (input && input != '' && input != ' ') {
    return input.split(' ').map(word => `%${word}`).join('%') + '%';
  }
  return ''
}