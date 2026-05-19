// app/signup/page.tsx
import AuthContainer from '../../components/AuthConatainer';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SignupPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("whatsApp")?.value;
  if (token) {
    localStorage.setItem("whatsApp", token);
  }

  if (token) {
    redirect("/");
  }

  return <AuthContainer initialMode="signup" />;
}