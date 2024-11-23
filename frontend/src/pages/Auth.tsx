import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserRegisterForm } from "@/components/user-register-form";
import { UserLoginForm } from "@/components/user-login-form";
import { ModeToggle } from "@/components/mode-toggle";
interface AuthPageProps {
  variant: "register" | "login";
}

export default function AuthPage({ variant }: AuthPageProps) {
  return (
    <>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="absolute right-4 top-4 flex space-x-2 md:right-8 md:top-8">
          {variant === "register" ? (
            <a
              href="/login"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Login
            </a>
          ) : (
            <a
              href="/register"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Register
            </a>
          )}
          <ModeToggle />
        </div>
        <div
          className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex"
          style={{
            backgroundImage: "url('/productivity.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-zinc-900 opacity-50" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              fill="#fff"
              height="20px"
              width="20px"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 479.989 479.989"
            >
              <g>
                <g>
                  <g>
                    <path
                      d="M470.4,2.122c-4.693-3.52-11.413-2.56-14.933,2.133l-258.24,342.187L98.24,246.815c-4.267-4.16-10.987-4.053-15.04,0.213
              c-4.053,4.16-4.053,10.667,0,14.827l107.52,108.267c2.027,2.027,4.693,3.093,7.573,3.2h0.747
              c3.093-0.213,5.973-1.813,7.787-4.267l265.707-352C476.053,12.362,475.093,5.642,470.4,2.122z"
                    />
                    <path
                      d="M421.333,213.322c-5.867,0-10.667,4.8-10.667,10.667v234.667h-384V63.989H303.68c5.333,0,10.133-3.84,10.88-9.067
              c0.96-6.613-4.16-12.267-10.56-12.267H16c-5.867,0-10.667,4.8-10.667,10.667v416c0,5.867,4.8,10.667,10.667,10.667h405.333
              c5.867,0,10.667-4.8,10.667-10.667V223.989C432,218.122,427.2,213.322,421.333,213.322z"
                    />
                  </g>
                </g>
              </g>
            </svg>
            Todos
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                Photo by{" "}
                <a
                  href="https://www.pexels.com/photo/person-using-macbook-pro-on-white-table-4065864/"
                  className="underline underline-offset-4 hover:text-primary"
                  target="_blank"
                >
                  cottonbro studio
                </a>
              </p>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {variant === "register" ? <UserRegisterForm /> : <UserLoginForm />}
          </div>
        </div>
      </div>
    </>
  );
}
