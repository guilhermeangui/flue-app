import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import type { AppLocale } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n";
import { I18nProvider } from "@/i18n/context";
import { getCurrentUser } from "@/lib/db/queries";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const locale = (user.appLanguage as AppLocale) || DEFAULT_LOCALE;

  return (
    <I18nProvider locale={locale}>
      <AppShell>{children}</AppShell>
    </I18nProvider>
  );
}
