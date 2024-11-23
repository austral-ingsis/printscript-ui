class Config {
  readonly apiUrl = import.meta.env.VITE_API_URL as string;
}

export default new Config();
