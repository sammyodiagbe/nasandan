'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, ChevronDown, Car } from 'lucide-react';
import { Container } from '@/components/shared/Container';
import { Button } from '@/components/ui';
import { navigation } from '@/config/site';
import { cn } from '@/lib/utils';
import { useCustomerAuth } from '@/lib/context/CustomerAuthContext';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { customer, logout } = useCustomerAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setAccountMenuOpen(false);
    if (accountMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [accountMenuOpen]);

  const isHomePage = pathname === '/';
  const showSolidHeader = scrolled || !isHomePage;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        showSolidHeader
          ? 'bg-white border-b border-slate-200/80 shadow-sm'
          : 'bg-transparent'
      )}
    >
      <Container>
        <nav className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
              showSolidHeader
                ? 'bg-[#0c2340]'
                : 'bg-white/20 backdrop-blur-sm'
            )}>
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className={cn(
              'font-display font-bold text-xl tracking-tight transition-colors',
              showSolidHeader ? 'text-[#0c2340]' : 'text-white'
            )}>
              Nasandan
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.main.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-[15px] font-medium rounded-lg transition-all',
                  pathname === item.href
                    ? showSolidHeader
                      ? 'text-[#ff6b5b] bg-[#ff6b5b]/5'
                      : 'text-white bg-white/15'
                    : showSolidHeader
                      ? 'text-slate-600 hover:text-[#0c2340] hover:bg-slate-50'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Account */}
          <div className="hidden md:flex items-center gap-2">
            {customer ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAccountMenuOpen(!accountMenuOpen);
                  }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
                    showSolidHeader
                      ? 'text-slate-700 hover:bg-slate-50'
                      : 'text-white hover:bg-white/10'
                  )}
                >
                  <div className="h-8 w-8 bg-[#0c2340] rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {customer.firstName[0]}
                    </span>
                  </div>
                  <span className="font-medium">{customer.firstName}</span>
                  <ChevronDown className={cn(
                    'h-4 w-4 transition-transform',
                    accountMenuOpen && 'rotate-180'
                  )} />
                </button>
                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-2 animate-scale-in">
                    {navigation.account.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <hr className="my-2 border-slate-100" />
                    <button
                      onClick={() => {
                        logout();
                        setAccountMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/account/login">
                  <button
                    className={cn(
                      'px-4 py-2 text-[15px] font-medium rounded-lg transition-all',
                      showSolidHeader
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    )}
                  >
                    Sign In
                  </button>
                </Link>
                <Link href="/account/register">
                  <button className="px-5 py-2.5 bg-[#ff6b5b] hover:bg-[#e85a4a] text-white text-[15px] font-semibold rounded-lg transition-all hover:shadow-md hover:shadow-[#ff6b5b]/20">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn(
              'md:hidden p-2 rounded-lg transition-colors',
              showSolidHeader
                ? 'text-slate-900 hover:bg-slate-100'
                : 'text-white hover:bg-white/10'
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </Container>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-slide-down">
          <Container>
            <div className="py-4 space-y-1">
              {navigation.main.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block py-3 px-4 rounded-lg text-base font-medium transition-colors',
                    pathname === item.href
                      ? 'text-[#ff6b5b] bg-[#ff6b5b]/5'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <hr className="my-4 border-slate-100" />
              {customer ? (
                <>
                  {navigation.account.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block py-3 px-4 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-3 px-4 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link href="/account/login" className="flex-1">
                    <button className="w-full py-3 px-4 text-[#0c2340] font-semibold border-2 border-[#0c2340] rounded-lg hover:bg-slate-50 transition-colors">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/account/register" className="flex-1">
                    <button className="w-full py-3 px-4 bg-[#ff6b5b] text-white font-semibold rounded-lg hover:bg-[#e85a4a] transition-colors">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
