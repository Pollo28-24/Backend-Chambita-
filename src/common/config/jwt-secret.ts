export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error(
      'JWT_SECRET no está definido. Configúralo en el archivo .env antes de iniciar la aplicación.',
    );
  }

  return secret;
};
