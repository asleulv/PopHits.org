"use client";

import ConfirmResetPassword from "@/components/users/ConfirmResetPassword";
import { useParams } from "next/navigation";

export default function ConfirmResetPasswordPage() {
  const params = useParams();
  // params.uid and params.token will be available

  return <ConfirmResetPassword uid={params.uid} token={params.token} />;
}