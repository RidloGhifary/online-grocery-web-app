import { Prisma, PrismaClient } from '@prisma/client';
import { getDMMF } from '@prisma/internals';

export default new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });


// Type-safe Model Names using Prisma Models (auto-generated by Prisma)
type PrismaModelNames = keyof (Prisma.DMMF.Datamodel)['models'][number]['name']; 

// Function to get field/column names of a Prisma model
export async function getPrismaModelFields(modelName: PrismaModelNames): Promise<string[]> {
  const dmmf = await getDMMF({ datamodelPath: './prisma/schema.prisma' }); // Ensure you pass the correct path to your schema

  // Find the model by name
  const model = dmmf.datamodel.models.find((m) => m.name === modelName);

  if (!model) {
    throw new Error(`Model ${String(modelName)} not found in the Prisma schema.`);
  }

  // Extract field/column names
  const fieldNames = model.fields.map((field) => field.name);
  
  return fieldNames;
}