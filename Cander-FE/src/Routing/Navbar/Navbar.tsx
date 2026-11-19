import { Menu } from "lucide-react";
import { cn } from "cn";

import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { NavLink } from "react-router-dom";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar35Props {
  className?: string;
  logo: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu: MenuItem[];
  auth: {
    login: { title: string; url: string };
    signup: { title: string; url: string };
  };
}

const defaultProps: Navbar35Props = {
  logo: {
    url: "/",
    src: "https://cdn.shadcnblocks.com/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "Candor App",
  },
  menu: [
    { title: "Home", url: "/" },
    { title: "Messages", url: "/messages" },
  ],
  auth: {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/register" },
  },
};

const menuLinkClass = (isActive: boolean, height: "h-10" = "h-10") =>
  cn(
    "inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors",
    height,
    isActive
      ? "border-primary bg-primary text-primary-foreground shadow-sm"
      : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent hover:text-accent-foreground",
  );

const Navbar = ({ className, ...props }: Partial<Navbar35Props>) => {
  const { logo, menu, auth } = {
    ...defaultProps,
    ...props,
  };

  return (
    <section
      className={cn(
        "sticky top-0 left-0 z-50 w-full border-b border-border bg-background py-4 text-foreground",
        className,
      )}
    >
      <div className="container mx-auto">
        {/* Desktop */}
        <nav className="hidden grid-cols-[1fr_auto_1fr] items-center lg:grid">
          <NavLink
            to={logo.url}
            className="flex items-center gap-2 justify-self-start text-foreground transition-colors hover:text-primary"
          >
            <span className="text-xl font-bold tracking-tight text-primary">
              Candor App
            </span>
          </NavLink>

          <div className="flex gap-3">
            {menu.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                end={item.url === "/"}
                className={({ isActive }) => menuLinkClass(isActive)}
              >
                {item.title}
              </NavLink>
            ))}
          </div>

          <div className="flex gap-2 justify-self-end">
            <NavLink
              to={auth.login.url}
              className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground"
            >
              {auth.login.title}
            </NavLink>
            <NavLink
              to={auth.signup.url}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              {auth.signup.title}
            </NavLink>
          </div>
        </nav>

        {/* Mobile */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <NavLink
              to={logo.url}
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary"
            >
              Candor App
            </NavLink>
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <Menu className="size-4" />
                  </Button>
                }
              />
              <SheetContent className="overflow-y-auto border-border bg-background text-foreground">
                <SheetHeader>
                  <SheetTitle>
                    <SheetClose
                      nativeButton={false}
                      render={
                        <NavLink
                          to={logo.url}
                          className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary"
                        >
                          Candor App
                        </NavLink>
                      }
                    />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <div className="flex flex-col gap-3">
                    {menu.map((item) => {
                      const link = (
                        <NavLink
                          to={item.url}
                          end={item.url === "/"}
                          className={({ isActive }) => menuLinkClass(isActive)}
                        >
                          {item.title}
                        </NavLink>
                      );

                      return <SheetClose key={item.url} render={link} />;
                    })}
                  </div>

                  <div className="flex flex-col gap-3">
                    <SheetClose
                      nativeButton={false}
                      render={
                        <NavLink
                          to={auth.login.url}
                          className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          {auth.login.title}
                        </NavLink>
                      }
                    />
                    <SheetClose
                      nativeButton={false}
                      render={
                        <NavLink
                          to={auth.signup.url}
                          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          {auth.signup.title}
                        </NavLink>
                      }
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Navbar };
