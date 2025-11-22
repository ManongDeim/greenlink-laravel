<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Models\GoogleUser;

class GlobalMailHelper
{
     /**
     * Send an email message to all admin role users (google_users table)
     *
     * @param string $subject
     * @param string $message
     * @return void
     */
   public static function notifyAdmins($subject, $message)
    {
        // Get admins from google_users
        $admins = GoogleUser::where('role', 'admin')->pluck('email');

        if ($admins->isEmpty()) {
            Log::warning("notifyAdmins: No admin emails found.");
            return;
        }

        foreach ($admins as $email) {
            Mail::raw($message, function ($mail) use ($email, $subject) {
                $mail->to($email)
                     ->subject($subject);
            });
        }

        Log::info("notifyAdmins: Email sent to admins", ['count' => count($admins)]);
    }

    public static function notifyUser($email, $subject, $message)
    {
        Mail::raw($message, function ($mail) use ($email, $subject) {
            $mail->to($email)
                 ->subject($subject);
        });
    }
}
