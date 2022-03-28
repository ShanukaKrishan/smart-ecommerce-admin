import { setAuthCookies } from 'next-firebase-auth';
// next firebase
import initAuth from '../../lib/firebase_auth';
// types
import type { NextApiRequest, NextApiResponse } from 'next';

initAuth();

const login = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    await setAuthCookies(req, res);
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.' });
  }
  return res.status(200).json({ success: true });
};

export default login;
