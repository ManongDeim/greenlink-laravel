<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymongoService
{
    protected $secretKey;

    public function __construct()
    {
        $this->secretKey = env('PAYMONGO_SECRET_KEY');
    }

    public function createGcashSource($amount, $returnUrl)
    {
      
        $payload = [
            'data' => [
                'attributes' => [
                    'amount' => $amount * 100, // pesos → cents
                    'currency' => 'PHP',
                    'type' => 'gcash',
                    'redirect' => [
                        'success' => 'https://4c0eb1608e27.ngrok-free.app/public/pages/paymentSuccess.html',
                        'failed'  => 'https://4c0eb1608e27.ngrok-free.app/public/pages/paymentFailed.html',
                    ],
                ],
            ],
        ];

        $response = Http::withBasicAuth($this->secretKey, '')
            ->post('https://api.paymongo.com/v1/sources', $payload);

        if ($response->failed()) {
            Log::error('PayMongo error: ' . $response->body());
        }

        return $response->json();
    }
}
