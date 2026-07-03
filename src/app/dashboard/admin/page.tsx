"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Users, 
  Wallet, 
  Mail, 
  Search, 
  ArrowRight,
  UserCheck,
  MessageSquare,
  Trash2,
  Building2,
  Loader2,
  Check,
  Save,
  AlertTriangle,
  X,
  ChevronDown,
  Coins,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/firebase/hooks';
import { 
  getPaginatedDocs,
  getExchangeRate,
} from '@/firebase/db-service';
import { 
  approveShippingRequest, 
  rejectShippingRequest,
  adminUpdateUserBalance,
  adminDeleteUser,
  adminDeleteDocument,
  updateExchangeRate
} from '@/firebase/finance-service'; 
import { smmBalance } from '@/lib/smm-provider';
import { getPaginatedCache, updatePaginatedCache } from '@/lib/pagination-store';

export default function AdminDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('users');
  const [initialLoading, setInitialLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<string>('10');
  const [rateLoading, setRateLoading] = useState(false);

  const [usersState, setUsersState] = useState(getPaginatedCache('adminUsers'));
  const [shippingsState, setShippingsState] = useState(getPaginatedCache('adminShippings'));
  const [ticketsState, setTicketsState] = useState(getPaginatedCache('adminTickets'));
  const [providerBalance, setProviderBalance] = useState<any>(null);

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: 'danger' | 'primary';
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
    variant: 'primary'
  });

  useEffect(() => {
    if (!authLoading && user && userData && !userData.isAdmin) {
      router.replace('/dashboard');
    }
  }, [user, userData, authLoading, router]);

  const formatBalance = (val: number) => {
    return Number(val.toFixed(2)).toString();
  };

  const fetchData = useCallback(async (key: string, collection: string, state: any, setState: any) => {
    setInitialLoading(true);
    try {
      const result = await getPaginatedDocs(collection, 10, state.lastVisible);
      const newState = {
        items: [...state.items, ...result.docs],
        lastVisible: result.lastVisible,
        hasMore: result.hasMore
      };
      setState(newState);
      updatePaginatedCache(key, newState);
    } catch (error) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل تحميل البيانات" });
    } finally {
      setInitialLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const init = async () => {
      try {
        const bal = await smmBalance();
        setProviderBalance(bal);
        
        const rate = await getExchangeRate();
        setExchangeRate(rate.toString());

        if (usersState.items.length === 0) {
          await fetchData('adminUsers', 'users', usersState, setUsersState);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (user && userData?.isAdmin) {
      init();
    }
  }, [user, userData?.isAdmin, fetchData, usersState.items.length]);

  useEffect(() => {
    if (user && userData?.isAdmin) {
      if (activeTab === 'funding' && shippingsState.items.length === 0) {
        fetchData('adminShippings', 'shippings', shippingsState, setShippingsState);
      } else if (activeTab === 'support' && ticketsState.items.length === 0) {
        fetchData('adminTickets', 'tickets', ticketsState, setTicketsState);
      }
    }
  }, [activeTab, user, userData?.isAdmin, fetchData, shippingsState.items.length, ticketsState.items.length]);

  if (authLoading || !userData?.isAdmin) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
      </div>
    );
  }

  const openConfirm = (title: string, description: string, onConfirm: () => void, variant: 'danger' | 'primary' = 'primary') => {
    setConfirmConfig({ isOpen: true, title, description, onConfirm, variant });
  };

  const handleUpdateBalance = async (userId: string, newBalance: string) => {
    openConfirm("تعديل الرصيد", "هل أنت متأكد من تعديل رصيد هذا المستخدم؟", async () => {
      setActionLoading(userId);
      try {
        const balNum = parseFloat(newBalance) || 0;
        await adminUpdateUserBalance(userId, balNum); 
        toast({ variant: "success", title: "تم التحديث بنجاح" });
      } catch (error) {
        toast({ variant: "destructive", title: "خطأ في التحديث" });
      } finally {
        setActionLoading(null);
      }
    });
  };

  const handleUpdateExchangeRate = async () => {
    openConfirm("تأكيد حفظ سعر الصرف", "هل أنت متأكد من تغيير سعر الصرف؟ سيؤثر هذا على كافة عمليات الشحن القادمة.", async () => {
      setRateLoading(true);
      try {
        const rateNum = parseFloat(exchangeRate);
        if (isNaN(rateNum) || rateNum <= 0) {
          toast({ variant: "destructive", title: "سعر صرف غير صحيح" });
          return;
        }
        await updateExchangeRate(rateNum); 
        toast({ variant: "success", title: "تم تحديث سعر الصرف بنجاح" });
      } catch (error) {
        toast({ variant: "destructive", title: "خطأ في التحديث" });
      } finally {
        setRateLoading(false);
      }
    });
  };

  const handleDeleteUser = async (userId: string) => {
    openConfirm("حذف مستخدم", "هل أنت متأكد من حذف هذا الحساب نهائياً؟", async () => {
      try {
        await adminDeleteUser(userId); 
        const newState = { ...usersState, items: usersState.items.filter((u: any) => u.id !== userId) };
        setUsersState(newState);
        updatePaginatedCache('adminUsers', newState);
        toast({ variant: "success", title: "تم الحذف بنجاح" });
      } catch (error) {
        toast({ variant: "destructive", title: "خطأ في الحذف" });
      }
    }, 'danger');
  };

  const handleApproveShipping = async (ship: any) => {
    openConfirm("قبول الشحن", `سيتم إضافة المبلغ لرصيد ${ship.userName} بالدولار حسب سعر الصرف الحالي (${exchangeRate}). هل ترغب في المتابعة؟`, async () => {
      setActionLoading(ship.id);
      try {
        await approveShippingRequest(ship.id, ship.userId, ship.amount); 
        const newState = { ...shippingsState, items: shippingsState.items.map((s: any) => s.id === ship.id ? { ...s, status: 'completed' } : s) };
        setShippingsState(newState);
        updatePaginatedCache('adminShippings', newState);
        toast({ variant: "success", title: "تم قبول الشحن وتحويل الرصيد" });
      } catch (error) {
        toast({ variant: "destructive", title: "خطأ في المعالجة" });
      } finally {
        setActionLoading(null);
      }
    });
  };

  const handleRejectShipping = async (shipId: string) => {
    openConfirm("رفض الطلب", "هل أنت متأكد من رفض هذا الطلب؟ لن يتم شحن الرصيد.", async () => {
      setActionLoading(shipId);
      try {
        await rejectShippingRequest(shipId); 
        const newState = { ...shippingsState, items: shippingsState.items.map((s: any) => s.id === shipId ? { ...s, status: 'rejected' } : s) };
        setShippingsState(newState);
        updatePaginatedCache('adminShippings', newState);
        toast({ variant: "success", title: "تم رفض الطلب" });
      } catch (error) {
        toast({ variant: "destructive", title: "خطأ في الرفض" });
      } finally {
        setActionLoading(null);
      }
    }, 'danger');
  };

  const handleDeleteItem = async (coll: string, id: string, stateKey: string, state: any, setState: any) => {
    openConfirm("حذف السجل", "هل أنت متأكد من حذف هذا السجل نهائياً؟", async () => {
      try {
        await adminDeleteDocument(coll, id); 
        const newState = { ...state, items: state.items.filter((i: any) => i.id !== id) };
        setState(newState);
        updatePaginatedCache(stateKey, newState);
        toast({ variant: "success", title: "تم الحذف" });
      } catch (error) {
        toast({ variant: "destructive", title: "خطأ" });
      }
    }, 'danger');
  };

  return (
    <div className="space-y-6 pb-24 text-right" dir="rtl">
      <AlertDialog open={confirmConfig.isOpen} onOpenChange={(open) => setConfirmConfig(prev => ({ ...prev, isOpen: open }))}>
        <AlertDialogContent className="max-w-[300px] rounded-[2.5rem] border-none p-8 bg-white shadow-2xl outline-none">
          <AlertDialogHeader className="space-y-4 text-center items-center">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", confirmConfig.variant === 'danger' ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500")}>
               <AlertTriangle className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <AlertDialogTitle className="text-sm font-black text-gray-900">{confirmConfig.title}</AlertDialogTitle>
              <AlertDialogDescription className="text-[10px] font-bold text-gray-400 leading-relaxed">{confirmConfig.description}</AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <div className="flex flex-col gap-3 w-full mt-8">
            <AlertDialogAction 
              onClick={confirmConfig.onConfirm} 
              className={cn(
                "w-full h-12 rounded-2xl font-black text-xs border-none shadow-none text-white transition-none active:opacity-100 outline-none focus:outline-none focus:ring-0", 
                confirmConfig.variant === 'danger' 
                  ? "bg-red-500 hover:bg-red-500 active:bg-red-500 focus:bg-red-500" 
                  : "bg-slate-900 hover:bg-slate-900 active:bg-slate-900 focus:bg-slate-900"
              )}
            >
              تأكيد العملية
            </AlertDialogAction>
            <AlertDialogCancel className="w-full h-12 rounded-2xl border-none font-black text-xs text-gray-400 bg-gray-50 hover:bg-gray-50 active:bg-gray-50 focus:bg-gray-50 active:text-gray-400 active:opacity-100 hover:text-gray-400 focus:text-gray-400 shadow-none m-0 transition-none outline-none focus:outline-none ring-0 focus:ring-0">
              إلغاء
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-start gap-2">
         <Link href="/dashboard"><button className="text-gray-400 p-0 h-10 w-10 flex items-center justify-center bg-transparent border-none outline-none"><ArrowRight className="h-5 w-5" /></button></Link>
         <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-slate-900 rounded-full" />
            <h1 className="text-xl font-black text-gray-900">لوحة تحكم المشرف</h1>
         </div>
      </div>

      <div className="px-1 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1 text-right">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">رصيد المزود:</span>
            <span className="text-lg font-black text-green-600 leading-none">
              {providerBalance && !providerBalance.error ? `${parseFloat(providerBalance.balance).toFixed(2)} ${providerBalance.currency || '$'}` : '...'}
            </span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} activationMode="manual" className="w-full" dir="rtl">
          <div className="w-full overflow-x-auto scrollbar-hide flex items-center justify-start gap-2 py-2">
            <TabsList className="bg-transparent h-auto p-0 flex items-center gap-2 border-none">
              <TabsTrigger value="users" className="rounded-xl h-10 px-6 font-black text-xs shrink-0 flex items-center gap-2 border transition-all outline-none data-[state=active]:bg-slate-900 data-[state=active]:text-white bg-white text-gray-600 border-gray-100 shadow-none flex-row-reverse hover:bg-slate-50 hover:text-slate-900 data-[state=active]:hover:bg-slate-900 data-[state=active]:hover:text-white">
                <span>المستخدمين</span><Users className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="funding" className="rounded-xl h-10 px-6 font-black text-xs shrink-0 flex items-center gap-2 border transition-all outline-none data-[state=active]:bg-slate-900 data-[state=active]:text-white bg-white text-gray-600 border-gray-100 shadow-none flex-row-reverse hover:bg-slate-50 hover:text-slate-900 data-[state=active]:hover:bg-slate-900 data-[state=active]:hover:text-white">
                <span>الشحن</span><Wallet className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="exchange" className="rounded-xl h-10 px-6 font-black text-xs shrink-0 flex items-center gap-2 border transition-all outline-none data-[state=active]:bg-slate-900 data-[state=active]:text-white bg-white text-gray-600 border-gray-100 shadow-none flex-row-reverse hover:bg-slate-50 hover:text-slate-900 data-[state=active]:hover:bg-slate-900 data-[state=active]:hover:text-white">
                <span>إعدادات الصرف</span><Coins className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="support" className="rounded-xl h-10 px-6 font-black text-xs shrink-0 flex items-center gap-2 border transition-all outline-none data-[state=active]:bg-slate-900 data-[state=active]:text-white bg-white text-gray-600 border-gray-100 shadow-none flex-row-reverse hover:bg-slate-50 hover:text-slate-900 data-[state=active]:hover:bg-slate-900 data-[state=active]:hover:text-white">
                <span>الدعم</span><Mail className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="users" className="space-y-6 mt-6 outline-none">
            {initialLoading && usersState.items.length === 0 ? (
              <div className="py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-slate-900" /></div>
            ) : (
              <>
                <div className="relative">
                  <Input 
                    placeholder="ابحث عن مستخدم..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 font-bold text-sm text-right pr-12 focus-visible:ring-slate-900 shadow-none text-gray-600 font-tajawal" 
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>

                <div className="flex flex-col gap-4 md:grid md:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] md:items-start md:gap-5">
                  {usersState.items.filter((u: any) => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase())).map((user: any) => (
                    <Card key={user.id} className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
                      <CardContent className="p-6 flex flex-col gap-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-900">
                            <UserCheck className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-sm font-black text-gray-900">{user.name}</span>
                            <span className="text-[10px] font-black text-gray-400">{user.email}</span>
                          </div>
                        </div>
                        <div className="flex flex-row items-center gap-2 w-full">
                          <div className="flex-1 flex flex-col gap-1.5 text-right">
                             <Input 
                               id={`balance-${user.id}`} 
                               type="number" 
                               step="0.01"
                               defaultValue={formatBalance(Number(user.balance || 0))} 
                               className="h-11 rounded-xl bg-gray-50/50 border-gray-100 font-bold text-sm text-center text-gray-600 focus-visible:ring-slate-900 shadow-none" 
                             />
                          </div>
                          <div className="flex gap-2 items-end">
                             <button onClick={() => handleUpdateBalance(user.id, (document.getElementById(`balance-${user.id}`) as HTMLInputElement).value)} className="h-11 px-4 rounded-xl bg-slate-900 text-white flex items-center justify-center gap-2 transition-none active:opacity-100 outline-none"><Save className="h-3.5 w-3.5" /><span className="text-[11px] font-black">حفظ</span></button>
                             <button onClick={() => handleDeleteUser(user.id)} className="h-11 w-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 transition-none active:opacity-100 outline-none"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {usersState.hasMore && usersState.items.length >= 10 && (
                    <button 
                      onClick={() => fetchData('adminUsers', 'users', usersState, setUsersState)} 
                      disabled={initialLoading}
                      className="w-full max-w-[280px] mx-auto py-5 bg-white rounded-[2rem] border border-orange-100 text-orange-500 font-black text-xs flex items-center justify-center gap-2 transition-all outline-none active:scale-[0.98] md:col-span-full"
                    >
                      {initialLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      <span>عرض المزيد</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="funding" className="space-y-6 mt-6 outline-none">
            {initialLoading && shippingsState.items.length === 0 ? (
              <div className="py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-slate-900" /></div>
            ) : shippingsState.items.length > 0 ? (
              <div className="flex flex-col gap-4 md:grid md:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] md:items-start md:gap-5">
                {shippingsState.items.map((order: any) => (
                  <Card key={order.id} className="rounded-[2.2rem] border-none shadow-sm bg-white overflow-hidden">
                    <CardContent className="p-6 space-y-5 text-right">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500"><Building2 className="h-5 w-5" /></div>
                           <div className="flex flex-col text-right">
                              <span className="text-[12px] font-black text-gray-900">{order.type === 'bank' ? order.bankName : order.company}</span>
                              <span className="text-[9px] font-black text-gray-300">{new Date(order.createdAt).toLocaleDateString('ar-MA')}</span>
                           </div>
                        </div>
                        <div className={cn("px-3 py-1.5 rounded-full text-[9px] font-black uppercase", order.status === 'completed' ? "bg-green-50 text-green-600" : order.status === 'rejected' ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600")}>
                          {order.status === 'completed' ? 'مكتمل' : order.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                        </div>
                      </div>
                      <div className="space-y-2 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-start gap-2"><span className="text-[10px] font-bold text-gray-400">المستخدم:</span><span className="text-[11px] font-black text-gray-900">{order.userName || 'مستخدم'}</span></div>
                        {order.type === 'bank' && (
                          <>
                            <div className="flex items-center justify-start gap-2"><span className="text-[10px] font-bold text-gray-400">الاسم المرسل:</span><span className="text-[11px] font-black text-gray-900">{order.senderName}</span></div>
                            <div className="flex items-center justify-start gap-2"><span className="text-[10px] font-bold text-gray-400">رقم الحساب:</span><span className="text-[11px] font-black text-gray-900">{order.senderAccount}</span></div>
                          </>
                        )}
                        {order.type === 'voucher' && (
                          <div className="flex items-center justify-start gap-2"><span className="text-[10px] font-bold text-gray-400">الرمز:</span><span className="text-[11px] font-black text-gray-900">{order.code}</span></div>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex flex-col text-right"><span className="text-[9px] font-bold text-gray-400 uppercase">المبلغ</span><span className="text-lg font-black text-green-600 leading-none">{order.amount} درهم</span></div>
                        <div className="flex gap-2">
                          {order.status === 'pending' ? (
                            <>
                              <button onClick={() => handleApproveShipping(order)} className="h-11 px-5 rounded-2xl font-black text-[11px] bg-green-600 text-white flex items-center justify-center gap-2 transition-none active:opacity-100 outline-none"><Check className="h-3.5 w-3.5" /> قبول</button>
                              <button onClick={() => handleRejectShipping(order.id)} className="h-11 px-5 rounded-2xl font-black text-[11px] bg-red-50 text-red-500 flex items-center justify-center gap-2 border border-red-100 transition-none active:opacity-100 outline-none"><X className="h-3.5 w-3.5" /> رفض</button>
                            </>
                          ) : (
                            <button onClick={() => handleDeleteItem('shippings', order.id, 'adminShippings', shippingsState, setShippingsState)} className="h-11 w-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 transition-none active:opacity-100 outline-none"><Trash2 className="h-4 w-4" /></button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {shippingsState.hasMore && shippingsState.items.length >= 10 && (
                  <button 
                    onClick={() => fetchData('adminShippings', 'shippings', shippingsState, setShippingsState)} 
                    disabled={initialLoading}
                    className="w-full max-w-[280px] mx-auto py-5 bg-white rounded-[2rem] border border-orange-100 text-orange-500 font-black text-xs flex items-center justify-center gap-2 transition-all outline-none active:scale-[0.98] md:col-span-full"
                  >
                    {initialLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <span>عرض المزيد</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-[1.8rem] bg-gray-50 flex items-center justify-center border border-gray-100 mb-2">
                  <Wallet className="h-8 w-8 text-gray-200" />
                </div>
                <p className="text-xs font-black text-gray-300">لا توجد طلبات شحن حالياً.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="exchange" className="space-y-6 mt-6 outline-none">
             <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden md:max-w-md">
               <CardContent className="p-8 space-y-6 text-right">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500"><Coins className="h-5 w-5" /></div>
                    <h2 className="text-sm font-black text-gray-900">إعدادات سعر الدولار مقابل الدرهم</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-[11px] font-bold text-gray-400 leading-relaxed">
                      هنا تحدد قيمة "الدولار الواحد" كم يساوي بالدرهم المغربي. سيتم استخدام هذا الرقم لقسمة مبالغ الشحن (بالدرهم) عليه لإضافة الرصيد (بالدولار).
                    </p>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">كم يساوي 1 دولار بالدرهم؟ (مثال: 10)</label>
                      <div className="flex gap-2">
                        <Input 
                          type="number" 
                          value={exchangeRate} 
                          onChange={(e) => setExchangeRate(e.target.value)}
                          placeholder="مثال: 10"
                          className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 font-black text-center text-lg focus-visible:ring-slate-900 text-gray-600 shadow-none"
                        />
                        <button 
                          onClick={handleUpdateExchangeRate} 
                          disabled={rateLoading}
                          className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-black text-xs flex items-center justify-center gap-2 transition-none active:opacity-100"
                        >
                          {rateLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          حفظ السعر
                        </button>
                      </div>
                    </div>
                  </div>
               </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6 mt-6 outline-none">
            {initialLoading && ticketsState.items.length === 0 ? (
              <div className="py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-slate-900" /></div>
            ) : ticketsState.items.length > 0 ? (
              <div className="flex flex-col gap-4 md:grid md:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] md:items-start md:gap-5">
                {ticketsState.items.map((ticket: any) => (
                  <Card key={ticket.id} className="rounded-[2.2rem] border-none shadow-sm bg-white overflow-hidden">
                    <CardContent className="p-6 space-y-5 text-right">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600"><MessageSquare className="h-5 w-5" /></div>
                          <div className="flex flex-col text-right">
                            <span className="text-[12px] font-black text-gray-900">{ticket.userName || 'مستخدم'}</span>
                            <span className="text-[9px] font-black text-gray-300">{new Date(ticket.createdAt).toLocaleDateString('ar-MA')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-2 text-right">
                        <div className="flex items-center justify-start gap-2"><span className="text-[10px] font-bold text-gray-400">القسم:</span><span className="text-[11px] font-black text-gray-900">{ticket.type === 'order' ? 'طلب' : ticket.type === 'payment' ? 'شحن' : 'أخرى'}</span></div>
                        <div className="flex items-center justify-start gap-2"><span className="text-[10px] font-bold text-gray-400">الموضوع:</span><span className="text-[11px] font-black text-gray-900">{ticket.title}</span></div>
                        <div className="flex flex-col gap-1.5 pt-1 border-t border-gray-100 mt-2"><span className="text-[10px] font-bold text-gray-400">الرسالة:</span><p className="text-[11px] font-black text-gray-900 leading-relaxed">{ticket.message}</p></div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <a href={`mailto:${ticket.email}`} className="h-11 px-6 rounded-2xl font-black text-[11px] bg-slate-900 text-white flex items-center justify-center gap-2 transition-none active:opacity-100 outline-none">الرد عبر البريد</a>
                        <button onClick={() => handleDeleteItem('tickets', ticket.id, 'adminTickets', ticketsState, setTicketsState)} className="h-11 w-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 transition-none active:opacity-100 outline-none"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {ticketsState.hasMore && ticketsState.items.length >= 10 && (
                  <button 
                    onClick={() => fetchData('adminTickets', 'tickets', ticketsState, setTicketsState)} 
                    disabled={initialLoading}
                    className="w-full max-w-[280px] mx-auto py-5 bg-white rounded-[2rem] border border-orange-100 text-orange-500 font-black text-xs flex items-center justify-center gap-2 transition-all outline-none active:scale-[0.98] md:col-span-full"
                  >
                    {initialLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <span>عرض المزيد</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-[1.8rem] bg-gray-50 flex items-center justify-center border border-gray-100 mb-2">
                  <Mail className="h-8 w-8 text-gray-200" />
                </div>
                <p className="text-xs font-black text-gray-300">لا توجد تذاكر دعم حالياً.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
