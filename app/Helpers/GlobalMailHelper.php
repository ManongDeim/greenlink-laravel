<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Models\GoogleUser;

class GlobalMailHelper
{
     // Existing notifyAdmins function
    public static function notifyAdmins($subject, $body)
    {
        $admins = GoogleUser::table('google_users')
            ->where('role', 'admin')
            ->pluck('email');

        foreach ($admins as $email) {
            Mail::raw($body, function ($message) use ($email, $subject) {
                $message->to($email)
                        ->subject($subject)
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });
        }

        Log::info('notifyAdmins: Email sent to admins', ['count' => count($admins)]);
    }

    public static function notifyCustomers($customerEmail, $subject, $body)
    {
        try {
            Mail::raw($body, function ($message) use ($customerEmail, $subject) {
                $message->to($customerEmail)
                        ->subject($subject)
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });

            Log::info('notifyCustomers: Email sent to customer', ['email' => $customerEmail]);
        } catch (\Exception $e) {
            Log::error('notifyCustomers: Failed to send email', [
                'email' => $customerEmail,
                'error' => $e->getMessage()
            ]);
        }
    }
}
