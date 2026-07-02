'use server';

/**
 * @fileOverview Server Action to verify Google reCAPTCHA v3 token.
 */

export async function verifyRecaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.error('CRITICAL: RECAPTCHA_SECRET_KEY is missing.');
    return { success: false, error: 'المفتاح السري (Secret Key) غير معرف في إعدادات الخادم.' };
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', secretKey);
    params.append('response', token);

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.success) {
      if (data.score >= 0.5) {
        return { success: true };
      } else {
        return { success: false, error: `نشاط مشبوه (Score: ${data.score}). يرجى المحاولة لاحقاً.` };
      }
    }

    // تحليل الأخطاء القادمة من Google
    const errorCodes = data['error-codes'] ? data['error-codes'] : [];
    const errorString = errorCodes.join(', ').toLowerCase();
    
    console.error('reCAPTCHA Failed details:', data);

    if (errorString.includes('project') && errorString.includes('deleted')) {
      return { success: false, error: 'مشروع الكابتشا محذوف من جوجل. يجب إنشاء مفاتيح جديدة من Google reCAPTCHA Console.' };
    }
    
    if (errorCodes.includes('invalid-input-secret')) {
      return { success: false, error: 'المفتاح السري (Secret Key) غير صحيح أو منتهي الصلاحية.' };
    }
    
    if (errorCodes.includes('invalid-input-response')) {
      return { success: false, error: 'الرمز غير صالح. تأكد من تطابق مفتاحي الكابتشا (Site & Secret).' };
    }

    return { success: false, error: `فشل التحقق: ${errorString || 'خطأ في الإعدادات'}.` };
  } catch (error) {
    console.error('reCAPTCHA Error:', error);
    return { success: false, error: 'فشل الاتصال بخدمة التحقق. تأكد من جودة الإنترنت.' };
  }
}
