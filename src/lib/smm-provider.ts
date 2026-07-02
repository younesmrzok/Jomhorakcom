
'use server';
/**
 * @fileOverview SMM Provider API Service for Jomhorak.com
 * Handles communication with smmcpan.com with strict platform isolation.
 */

const API_URL = "https://smmcpan.com/api/v2";
const API_KEY = process.env.SMM_API_KEY;

export interface SmmOrderResponse {
  order?: number;
  error?: string;
}

export interface SmmService {
  service: string;
  name: string;
  rate: string;
  min: string;
  max: string;
  category: string;
}

/**
 * Sends an order request to the SMM provider.
 */
export async function smmOrder(data: { service: number, link: string, quantity: number }): Promise<SmmOrderResponse> {
  if (!API_KEY) {
    return { error: "إعدادات المزود غير مكتملة (API Key مفقود)" };
  }

  try {
    const params = new URLSearchParams();
    params.append('key', API_KEY);
    params.append('action', 'add');
    params.append('service', data.service.toString());
    params.append('link', data.link);
    params.append('quantity', data.quantity.toString());

    const response = await fetch(API_URL, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      cache: 'no-store',
    });

    const result = await response.text();
    let jsonResult;
    
    try {
      jsonResult = JSON.parse(result);
    } catch (e) {
      return { error: "استجابة غير صالحة من المزود" };
    }

    if (!response.ok || jsonResult.error) {
      return { error: jsonResult.error || "فشل الطلب من طرف المزود" };
    }

    return jsonResult;
  } catch (error) {
    return { error: "حدث خطأ أثناء الاتصال بالمزود" };
  }
}

/**
 * Fetches statuses for multiple orders from the provider.
 */
export async function smmOrdersStatus(orderIds: string): Promise<any> {
  if (!API_KEY || !orderIds) {
    return { error: "بيانات غير مكتملة للمزامنة" };
  }

  try {
    const params = new URLSearchParams();
    params.append('key', API_KEY);
    params.append('action', 'status');
    params.append('orders', orderIds);

    const response = await fetch(API_URL, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      cache: 'no-store',
    });

    if (!response.ok) throw new Error("API Response not OK");

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("SMM Status Fetch Error:", error);
    return { error: "فشل تحديث حالة الطلبات من المزود" };
  }
}

/**
 * Fetches services for a specific platform using STRICT EXCLUSION.
 */
export async function smmServicesByPlatform(platformId: string): Promise<SmmService[] | { error: string }> {
  if (!API_KEY) {
    return { error: "إعدادات المزود غير مكتملة (API Key مفقود)" };
  }

  try {
    const params = new URLSearchParams({
      key: API_KEY,
      action: 'services'
    });

    const response = await fetch(API_URL, {
      method: 'POST',
      body: params,
      cache: 'no-store',
    });

    const allServices: SmmService[] = await response.json();
    
    if (!Array.isArray(allServices)) {
      return { error: "فشل جلب قائمة الخدمات من المزود" };
    }

    const platformConfigs: Record<string, { pos: string[], neg: string[] }> = {
      instagram: {
        pos: ['instagram', 'ig', 'insta', 'انستقرام', 'انستغرام', 'انستجرام', 'انستا'],
        neg: ['tiktok', 'youtube', 'facebook', 'telegram', 'twitter', 'snapchat', 'kwai', 'threads', 'يوتيوب', 'تيك', 'فيسبوك', 'تليجرام', 'سناب']
      },
      tiktok: {
        pos: ['tiktok', 'تيك', 'تيكتوك', 'تيك توك'],
        neg: ['instagram', 'youtube', 'facebook', 'telegram', 'twitter', 'snapchat', 'kwai', 'threads', 'انستقرام', 'يوتيوب', 'فيسبوك', 'تليجرام', 'سناب']
      },
      facebook: {
        pos: ['facebook', 'fb', 'فيسبوك', 'فيس'],
        neg: ['instagram', 'tiktok', 'youtube', 'telegram', 'twitter', 'snapchat', 'kwai', 'threads', 'انستقرام', 'تيك', 'يوتيوب', 'تليجرام', 'سناب']
      },
      youtube: {
        pos: ['youtube', 'يوتيوب', 'يوتوب', ' yt ', 'subs'],
        neg: ['instagram', 'tiktok', 'facebook', 'telegram', 'twitter', 'snapchat', 'kwai', 'threads', 'انستقرام', 'تيك', 'فيسبوك', 'تليجرام', 'سناب']
      },
      telegram: {
        pos: ['telegram', 'tg', 'تليجرام', 'تلغرام', 'قنوات'],
        neg: ['instagram', 'tiktok', 'facebook', 'youtube', 'twitter', 'snapchat', 'kwai', 'threads', 'انستقرام', 'تيك', 'فيسبوك', 'يوتيوب', 'سناب']
      },
      twitter: {
        pos: ['twitter', ' x ', 'تويتر'],
        neg: ['instagram', 'tiktok', 'facebook', 'youtube', 'telegram', 'snapchat', 'kwai', 'threads', 'انستقرام', 'تيك', 'فيسبوك', 'يوتيوب', 'تليجرام']
      },
      snapchat: {
        pos: ['snapchat', 'snap', 'سناب'],
        neg: ['instagram', 'tiktok', 'facebook', 'youtube', 'telegram', 'twitter', 'kwai', 'threads', 'انستقرام', 'تيك', 'فيسبوك', 'يوتيوب', 'تليجرام']
      },
      threads: {
        pos: ['threads', 'ثريدز'],
        neg: ['instagram', 'tiktok', 'facebook', 'youtube', 'telegram', 'twitter', 'snapchat', 'kwai', 'انستقرام', 'تيك', 'فيسبوك', 'يوتيوب', 'تليجرام']
      }
    };

    const config = platformConfigs[platformId.toLowerCase()];
    if (!config) return [];

    const excludedIds = ['12995', '15354'];

    return allServices.filter((s) => {
      if (excludedIds.includes(s.service.toString())) return false;

      const combined = (s.category + " " + s.name).toLowerCase();
      const hasPositive = config.pos.some(k => combined.includes(k));
      const hasNegative = config.neg.some(k => combined.includes(k));
      return hasPositive && !hasNegative;
    });
  } catch (error) {
    return { error: "فشل الاتصال بالمزود" };
  }
}

export async function smmBalance() {
  if (!API_KEY) {
    return { error: "إعدادات المزود غير مكتملة" };
  }
  try {
    const params = new URLSearchParams({
      key: API_KEY,
      action: 'balance'
    });
    const response = await fetch(API_URL, {
      method: 'POST',
      body: params,
      cache: 'no-store',
    });
    return await response.json();
  } catch (error) {
    return { error: "فشل جلب الرصيد من المزود" };
  }
}

export async function smmServices() {
  if (!API_KEY) {
    return { error: "إعدادات المزود غير مكتملة" };
  }
  try {
    const params = new URLSearchParams({
      key: API_KEY,
      action: 'services'
    });
    const response = await fetch(API_URL, {
      method: 'POST',
      body: params,
      cache: 'no-store',
    });
    const services = await response.json();
    
    if (Array.isArray(services)) {
      const excludedIds = ['12995', '15354'];
      return services.filter((s: any) => !excludedIds.includes(s.service.toString()));
    }
    return services;
  } catch (error) {
    return { error: "فشل جلب قائمة الخدمات من المزود" };
  }
}
