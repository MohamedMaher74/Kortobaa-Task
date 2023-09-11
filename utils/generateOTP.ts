import crypto from 'crypto';

const encrypt = (code: string) => {
  return crypto.createHash('sha256').update(code).digest('hex');
};

const generateOTP = () => {
  const otpExpiration = new Date(Date.now() + 3 * 60 * 1000);
  const otp = Math.floor(1000 + Math.random() * 9000);
  const hashedOTP = encrypt(otp.toString());
  return { otp, hashedOTP, otpExpiration };
};

export default generateOTP;
export { encrypt };
