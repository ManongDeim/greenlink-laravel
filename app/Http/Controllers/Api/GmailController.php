<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Google\Client as GoogleClient;
use Illuminate\Http\Request;

class GmailController extends Controller
{
    public function authorize()
    {
        $client = new GoogleClient();
        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->setRedirectUri(env('GOOGLE_REDIRECT_GMAIL'));
        $client->addScope('https://www.googleapis.com/auth/gmail.send');
        $client->setAccessType('offline');

        $authUrl = $client->createAuthUrl();
        return redirect($authUrl);
    }

    public function oauthCallback(Request $request)
    {
        $client = new GoogleClient();
        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->setRedirectUri(env('GOOGLE_REDIRECT_GMAIL'));
        $client->addScope('https://www.googleapis.com/auth/gmail.send');
        $client->setAccessType('offline');

        $code = $request->query('code');
        $token = $client->fetchAccessTokenWithAuthCode($code);

        // Save refresh token somewhere secure for sending emails later
        $refreshToken = $token['refresh_token'] ?? null;

        // Example: save to DB or a file
        // Setting up Gmail for sending notifications
        return response()->json(['success' => true, 'refresh_token' => $refreshToken]);
    }
}
