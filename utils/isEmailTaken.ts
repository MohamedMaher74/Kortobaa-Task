import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sendEmail = async function isEmailTaken(email: string): Promise<boolean> {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  return !!existingUser;
};

export default sendEmail;
