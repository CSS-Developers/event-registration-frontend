import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'brand' | 'paper' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:
    'bg-black text-white hover:bg-neutral-800 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)] focus-visible:outline-heading',
  brand:
    'bg-brand text-on-brand hover:bg-brand-strong shadow-[0_10px_26px_-12px_rgba(45,94,240,0.8)] focus-visible:outline-heading',
  paper: 'bg-ink-text text-ink hover:bg-white focus-visible:outline-ink',
  secondary:
    'bg-transparent text-heading border border-border hover:bg-surface-inset focus-visible:outline-heading',
  danger: 'bg-danger text-white hover:opacity-90 focus-visible:outline-danger',
  ghost: 'bg-surface-inset text-heading hover:bg-border focus-visible:outline-heading',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-8 text-base',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export function Button({ variant = 'primary', size = 'md', className = '', ...rest }: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    />
  )
}
