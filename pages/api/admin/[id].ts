import { getAuth } from 'firebase-admin/auth';
import { NextApiRequest, NextApiResponse } from 'next';

export interface EventCountsData {
  event: string;
  count: number;
}

const edit = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  // get id
  const { id } = req.query;
  // check type
  if (req.method === 'DELETE') {
    try {
      // get auth
      const auth = getAuth();
      // delete user
      await auth.deleteUser(id as string);
      // return success with created uid
      return res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      return res.status(404).json({ success: false });
    }
  } else if (req.method === 'GET') {
    try {
      // get auth
      const auth = getAuth();
      // delete user
      const record = await auth.getUser(id as string);
      // return success with created uid
      return res.status(200).json({
        success: true,
        displayName: record.displayName,
        email: record.email,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({ success: false });
    }
  }
  return res.status(200).json({ success: false });
};

export default edit;
