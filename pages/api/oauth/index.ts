// pages/api/yourRouteName.js

// Assuming that jsonGet and jsonPost are imported or defined the same way as in your original function
import { jsonGet, jsonPost } from "../../../utils/request";

// Import the 'cookie' package to set cookies easily. You can install it using npm or yarn.
import cookie from 'cookie';

export default async function handler(req, res) {
  const clientId = process.env.ATLASSIAN_CLIENT_ID;
  const secret = process.env.ATLASSIAN_CLIENT_SECRET;
  const { code } = req.query;

  if (!code) {
    res.status(400).json({ error: "No code query parameter provided" });
    return;
  }

  try {
    const url = "https://auth.atlassian.com/oauth/token";
    const {
      access_token,
    } = await jsonPost({
      url,
      data: {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: secret,
        code,
        redirect_uri: "https://tangential.eu.ngrok.io/api/oauth",
      },
    });

    // Store the access token in a cookie
    res.setHeader('Set-Cookie', cookie.serialize('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Set secure to true if you are in a production environment
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'strict',
      path: '/',
    }));

    const resourceUrl = "https://api.atlassian.com/oauth/token/accessible-resources";
    const [{ id }] = await jsonGet({
      url: resourceUrl,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const response = await jsonGet({
      url: `https://api.atlassian.com/ex/jira/${id}/rest/api/3/project`,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
