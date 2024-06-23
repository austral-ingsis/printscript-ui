import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        setAccessToken(token);
      } catch (error) {
        console.error('Error fetching access token', error);
      }
    };

    fetchAccessToken();
  }, [getAccessTokenSilently]);

  return accessToken;
};
