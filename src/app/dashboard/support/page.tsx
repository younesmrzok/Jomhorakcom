
"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, 
  Send, 
  HelpCircle, 
  ArrowRight,
  Headphones,
  Mail,
  Zap,
  X,
  CheckCircle2,
  Loader2,
  Ticket,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTicket } from '@/firebase/db-service';
import { useAuth } from '@/firebase/hooks';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function SupportPage() {
  const [isTicketFormOpen, setIsTicketFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    type: 'order',
    email: '',
    title: '',
    message: ''
  });

  const faqs = [
    { q: 'متى يبدأ تنفيذ الطلب؟', a: 'معظم الخدمات تبدأ بشكل فوري، وبعضها قد يستغرق من 30 دقيقة إلى 12 ساعة حسب ضغط النظام.' },
    { q: 'هل هناك ضمان ضد النقص؟', a: 'نعم، نوفر ضمان تعويض النقص لمعظم الخدمات لمدة تتراوح بين 30 إلى 100 يوم.' },
    { q: 'كيف يمكنني شحن رصيدي؟', a: 'يمكنك شحن الرصيد عبر التحويل البنكي أو التعبئة من قسم "شحن الرصيد" في لوحة التحكم.' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: "destructive", title: "خطأ", description: "يجب تسجيل الدخول أولاً." });
      return;
    }
    setLoading(true);
    try {
      await createTicket(user.uid, {
        ...formData,
        status: 'pending',
        priority: 'عادية',
        userName: user.displayName || 'مستخدم'
      });
      setIsSubmitted(true);
      toast({ variant: "success", title: "تم الإرسال", description: "تم استلام تذكرتك بنجاح." });
      setTimeout(() => {
        setIsSubmitted(false);
        setIsTicketFormOpen(false);
        setFormData({ type: 'order', email: '', title: '', message: '' });
      }, 2000);
    } catch (error) {
      console.error("Ticket Error:", error);
      toast({ variant: "destructive", title: "خطأ", description: "فشل إرسال التذكرة." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 text-right" dir="rtl">
      <div className="flex items-center gap-2">
         <Link href="/dashboard">
            <button className="text-gray-400 p-0 h-10 w-10 flex items-center justify-center bg-transparent border-none outline-none transition-none">
              <ArrowRight className="h-5 w-5" />
            </button>
         </Link>
         <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-orange-500 rounded-full" />
            <h1 className="text-xl font-black text-gray-900">الدعم والمساعدة</h1>
         </div>
      </div>

      <div className="px-1 space-y-6">
        {!isTicketFormOpen ? (
          <Card className="rounded-[2.5rem] bg-orange-500 border-none shadow-lg shadow-orange-500/20 overflow-hidden">
            <CardContent className="p-10 flex flex-col items-center text-center text-white gap-6">
               <div className="w-20 h-20 rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Headphones className="h-10 w-10 text-white" />
               </div>
               <div className="space-y-2">
                  <h2 className="text-xl font-black">نحن هنا لمساعدتك</h2>
                  <p className="text-[11px] font-black opacity-80 uppercase tracking-widest leading-relaxed">فريق دعم جمهورك متاح 24/7 للرد على استفساراتك وحل مشاكلك الفنية</p>
               </div>
               <button 
                  onClick={() => setIsTicketFormOpen(true)}
                  className="w-full h-14 rounded-2xl bg-white text-orange-500 font-black text-sm transition-none active:scale-95 shadow-none border-none outline-none"
                >
                  فتح تذكرة دعم جديدة
               </button>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-[2.5rem] bg-white border border-gray-50 shadow-[0_15px_40px_rgba(0,0,0,0.04)] overflow-hidden animate-in slide-in-from-bottom-5">
            <CardContent className="p-8">
              {isSubmitted ? (
                <div className="py-14 flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in">
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-gray-900">تم إرسال تذكرتك بنجاح</h3>
                    <p className="text-xs font-black text-gray-400">سيقوم فريق دعم جمهورك بالرد عليك في أقرب وقت ممكن.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-2.5">
                      <Zap className="h-6 w-6 text-orange-500" />
                      <span className="text-base font-black text-gray-900 uppercase">إنشاء تذكرة جديدة</span>
                    </div>
                    <button type="button" onClick={() => setIsTicketFormOpen(false)} className="text-gray-300 p-2 bg-transparent border-none">
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mr-1">
                      <Activity className="h-4 w-4 text-gray-400" />
                      <Label className="text-sm font-black text-gray-800 uppercase">نوع المشكلة</Label>
                    </div>
                    <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                      <SelectTrigger className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 font-bold text-sm px-5 outline-none text-gray-500">
                        <SelectValue placeholder="اختر القسم المناسب" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-gray-100 font-bold text-sm">
                        <SelectItem value="order">مشكلة في تنفيذ طلب</SelectItem>
                        <SelectItem value="payment">مشكلة في شحن الرصيد</SelectItem>
                        <SelectItem value="other">استفسار أو اقتراح عام</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mr-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <Label className="text-sm font-black text-gray-800 uppercase">البريد الإلكتروني</Label>
                    </div>
                    <Input 
                      type="email"
                      placeholder="name@example.com" 
                      required
                      maxLength={100}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={cn(
                        "h-14 rounded-2xl bg-gray-50/50 border-gray-100 font-bold text-sm px-5 shadow-none text-gray-500 outline-none transition-all",
                        formData.email.length >= 100 && "border-red-500"
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mr-1">
                      <Ticket className="h-4 w-4 text-gray-400" />
                      <Label className="text-sm font-black text-gray-800 uppercase">عنوان التذكرة</Label>
                    </div>
                    <Input 
                      placeholder="مثال: تأخر في تنفيذ الطلب رقم #1250" 
                      required
                      maxLength={100}
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className={cn(
                        "h-14 rounded-2xl bg-gray-50/50 border-gray-100 font-bold text-sm px-5 shadow-none text-gray-500 outline-none transition-all",
                        formData.title.length >= 100 && "border-red-500"
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mr-1">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <Label className="text-sm font-black text-gray-800 uppercase">تفاصيل المشكلة</Label>
                    </div>
                    <Textarea 
                      placeholder="يرجى شرح المشكلة بوضوح لمساعدتك بشكل أسرع..." 
                      required
                      maxLength={1000}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className={cn(
                        "min-h-[140px] rounded-2xl bg-gray-50/50 border-gray-100 font-bold text-sm p-5 resize-none leading-relaxed shadow-none text-gray-500 outline-none transition-all",
                        formData.message.length >= 1000 && "border-red-500"
                      )}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsTicketFormOpen(false)} className="flex-1 h-14 rounded-2xl border border-gray-100 text-gray-400 font-black text-sm bg-white outline-none">
                      إلغاء
                    </button>
                    <Button disabled={loading} type="submit" className="flex-[2] h-14 rounded-2xl orange-gradient text-white font-black text-sm shadow-lg border-none outline-none">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "إرسال التذكرة"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Link href="https://wa.me/212600000000" className="flex flex-col items-center justify-center p-8 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm gap-4 group outline-none select-none">
             <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 transition-transform group-hover:scale-110">
                <MessageSquare className="h-7 w-7" />
             </div>
             <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">واتساب</span>
          </Link>
          <Link href="https://t.me/jomhorak" className="flex flex-col items-center justify-center p-8 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm gap-4 group outline-none select-none">
             <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 transition-transform group-hover:scale-110">
                <Send className="h-7 w-7" />
             </div>
             <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">تليجرام</span>
          </Link>
        </div>

        <div className="space-y-6 pt-2">
          <div className="flex items-center gap-2.5 px-1">
            <HelpCircle className="h-6 w-6 text-orange-500" />
            <span className="text-base font-black text-gray-900 uppercase">الأسئلة الأكثر شيوعاً</span>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-none bg-white rounded-[2rem] px-6 shadow-sm overflow-hidden">
                <AccordionTrigger className="hover:no-underline py-5 text-right outline-none active:bg-transparent">
                   <span className="text-[13px] font-black text-gray-800 leading-tight">{faq.q}</span>
                </AccordionTrigger>
                <AccordionContent className="text-[12px] font-black text-gray-500 leading-relaxed pb-6 text-right">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Card className="rounded-[2.5rem] border border-gray-50 shadow-sm bg-white overflow-hidden select-none">
           <CardContent className="p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                 <Mail className="h-7 w-7 text-orange-500" />
              </div>
              <div className="flex flex-col gap-1 text-right">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">البريد الإلكتروني المباشر</span>
                 <a 
                   href="mailto:contact@jomhorak.com" 
                   className="text-sm font-black text-gray-900 outline-none active:text-orange-500 transition-colors"
                 >
                   contact@jomhorak.com
                 </a>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
