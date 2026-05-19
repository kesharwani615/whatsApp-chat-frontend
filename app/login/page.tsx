// app/login/page.tsx
import AuthContainer from '../../components/AuthConatainer';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("whatsApp")?.value;

  if (token) {
    redirect("/");
  }

  return <AuthContainer initialMode="login" />;
}