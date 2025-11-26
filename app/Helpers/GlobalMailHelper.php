<?php
namespace App\Helpers;

use Google\Client;
use Google\Service\Gmail;
use Google\Service\Gmail\Message;

class GlobalMailHelper
{
    public static function getClient()
    {
        $client = new Client();
        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->setRedirectUri(env('GOOGLE_REDIRECT_URI'));
        $client->addScope(Gmail::GMAIL_SEND);
        $client->setAccessType('offline');

        return $client;
    }

    public static function sendEmail($to, $subject, $body)
    {
        $client = self::getClient();
        $service = new Gmail($client);

        $rawMessage = "From: me\r\n";
        $rawMessage .= "To: $to\r\n";
        $rawMessage .= "Subject: $subject\r\n\r\n";
        $rawMessage .= $body;

        $encodedMessage = base64_encode($rawMessage);
        $encodedMessage = strtr($encodedMessage, array('+' => '-', '/' => '_'));

        $message = new Message();
        $message->setRaw($encodedMessage);

        return $service->users_messages->send('me', $message);
    }
}
