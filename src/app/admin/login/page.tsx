"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, LoginFormData } from "@/lib/validations";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email hoặc mật khẩu không chính xác");
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#EE4D2D] rounded-xl flex items-center justify-center mx-auto mb-4">
            <Store className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-neutral-900">Tinori Admin</h1>
          <p className="text-neutral-400 text-sm mt-1">Đăng nhập để quản lý cửa hàng</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-neutral-700">Email</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="admin@tinori.vn"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label className="mb-1.5 block text-sm font-medium text-neutral-700">Mật khẩu</Label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-lg"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>

          <p className="text-xs text-neutral-400 text-center mt-4">
            Trang quản trị dành riêng cho admin
          </p>
        </div>

        <p className="text-center text-neutral-400 text-xs mt-6">
          <a href="/" className="hover:text-neutral-700 transition-colors">← Quay về cửa hàng</a>
        </p>
      </div>
    </div>
  );
}
