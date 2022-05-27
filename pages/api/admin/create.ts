import { getAuth } from 'firebase-admin/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { FirebaseError } from '@firebase/util';

export interface EventCountsData {
  event: string;
  count: number;
}

const create = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    // get auth
    const auth = getAuth();
    // get body
    const body = JSON.parse(req.body);
    // create user
    const record = await auth.createUser({
      displayName: body.displayName,
      email: body.email,
      emailVerified: true,
      password: body.password,
    });
    // return success with created uid
    return res.status(200).json({ success: true, id: record.uid });
  } catch (error) {
    // check code
    if ((error as FirebaseError).code === 'auth/email-already-exists') {
      // get auth
      const auth = getAuth();
      // get body
      const body = JSON.parse(req.body);
      // get user
      const user = await auth.getUserByEmail(body.email);
      // return success with user uid
      return res.status(200).json({ success: true, id: user.uid });
    } else {
      console.log(error);
    }
    return res.status(404).json({ success: false });
  }
};

export default create;
