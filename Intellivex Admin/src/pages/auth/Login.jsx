import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, LockKeyhole, TriangleAlert, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useAuth } from '@/hooks/useAuth'

const schema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean(),
})

const HIGHLIGHTS = ['Services, industries & portfolio', 'Testimonials, partners & team', 'Website inquiries in one inbox']

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-navy-deep text-white lg:flex lg:w-[46%] lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      {/* decorative glow + grid, echoing the public site's hero */}
      <div className="pointer-events-none absolute -top-40 -left-32 size-[520px] rounded-full bg-brand/30 blur-[120px]" aria-hidden />
      <div className="pointer-events-none absolute -right-40 bottom-0 size-[420px] rounded-full bg-brand-deep/25 blur-[120px]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />

      <img src="/logo.svg" alt="IntelliVex Technologies" className="relative h-10 w-auto self-start" />

      <div className="relative max-w-md">
        <p className="mb-4 font-display text-[13px] font-medium tracking-[0.14em] text-brand-soft uppercase">Admin Panel</p>
        <h1 className="text-[40px] leading-[1.15] font-medium xl:text-[44px]">
          Manage the IntelliVex website from <span className="text-brand">one place</span>.
        </h1>
        <ul className="mt-8 space-y-3 text-[15px] text-white/75">
          {HIGHLIGHTS.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-brand" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-sm text-white/45">© {new Date().getFullYear()} IntelliVex Technologies</p>
    </aside>
  )
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '', remember: false },
  })
  const { isSubmitting } = form.formState

  const onSubmit = async (values) => {
    setServerError('')
    try {
      const user = await login(values)
      toast.success(`Welcome back, ${user.name}`)
      navigate(location.state?.from?.pathname ?? '/admin', { replace: true })
    } catch (err) {
      setServerError(err.message || 'Unable to sign in. Please try again.')
      form.setValue('password', '')
      form.setFocus('password')
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <BrandPanel />

      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[400px]">
          {/* On small screens the brand panel is hidden, so show the logo on a navy tile. */}
          <div className="mb-8 inline-flex rounded-xl bg-navy-deep px-4 py-3 lg:hidden">
            <img src="/logo.svg" alt="IntelliVex Technologies" className="h-8 w-auto" />
          </div>

          <h2 className="text-[28px] leading-tight font-medium tracking-tight">Sign in</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">Enter your admin credentials to continue.</p>

          {serverError && (
            <div role="alert" className="mt-6 flex items-start gap-3 rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              {serverError}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input {...field} autoComplete="username" autoFocus placeholder="Enter your username" className="h-11 bg-card pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          className="h-11 bg-card pr-11 pl-10"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2.5">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
                    </FormControl>
                    <FormLabel className="font-normal text-muted-foreground">Keep me signed in</FormLabel>
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" disabled={isSubmitting} className="h-11 w-full text-[15px]">
                {isSubmitting && <Loader2 className="animate-spin" />}
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  )
}
