import bcrypt from 'bcrypt';

async function comparePasswords(
  candidatePassword: string,
  userPassword: string,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

export default comparePasswords;
