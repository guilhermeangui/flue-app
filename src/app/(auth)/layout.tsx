import { cookies } from "next/headers";
import type { AppLocale } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n";
import { I18nProvider } from "@/i18n/context";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale =
    (cookieStore.get("app-locale")?.value as AppLocale) || DEFAULT_LOCALE;

  return (
    <I18nProvider locale={locale}>
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
        {children}
      </div>
    </I18nProvider>
  );
}
