import { useLocation } from 'wouter';

function scrollTo(hash: string) {
  const el = document.querySelector(hash);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

interface NavHrefProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function NavHref({ href, children, onClick }: NavHrefProps) {
  const [, navigate] = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('http')) return;
    e.preventDefault();
    onClick?.();
    if (href === '/') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href.startsWith('/#')) {
      navigate('/');
      setTimeout(() => scrollTo(href.replace('/', '')), 50);
    } else if (href.includes('#')) {
      const [path, hash] = href.split('#');
      navigate(path || '/');
      setTimeout(() => scrollTo(`#${hash}`), 50);
    } else {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <a href={href} onClick={handleClick} style={{ color: 'inherit', textDecoration: 'none' }}>
      {children}
    </a>
  );
}
