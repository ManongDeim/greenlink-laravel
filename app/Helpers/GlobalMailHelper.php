<?php

namespace App\Helpers;

use Google\Client as GoogleClient;
use Google\Service\Gmail;
use Google\Service\Gmail\Message;
use Illuminate\Support\Facades\Log;

class GlobalMailHelper
{
    protected $client;
    protected $service;

    public function __construct()
    {
        $this->client = new GoogleClient();
        $this->client->setClientId(env('GOOGLE_CLIENT_ID'));
        $this->client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $this->client->setRedirectUri(env('GOOGLE_REDIRECT_URL'));
        $this->client->refreshToken(env('GOOGLE_REFRESH_TOKEN'));
        $this->service = new Gmail($this->client);
    }

    public function sendMail($to, $subject, $body)
    {
        try {
            $strRawMessage = "From: <greenlinklolasayong@gmail.com>\r\n";
            $strRawMessage .= "To: <$to>\r\n";
            $strRawMessage .= "Subject: $subject\r\n";
            $strRawMessage .= "MIME-Version: 1.0\r\n";
            $strRawMessage .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
            $strRawMessage .= $body;

            $mime = rtrim(strtr(base64_encode($strRawMessage), '+/', '-_'), '=');

            $message = new Message();
            $message->setRaw($mime);

            $this->service->users_messages->send('me', $message);

            Log::info("Email sent to: $to");

            return true;
        } catch (\Exception $e) {
            Log::error("Failed to send Gmail: " . $e->getMessage());
            return false;
        }
    }
}
