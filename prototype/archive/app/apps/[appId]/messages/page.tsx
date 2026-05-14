import { redirect } from "next/navigation";

/* Back-compat redirect: the messages page is now at /apps/[appId] directly.
   Any old links pointing to /apps/[appId]/messages land here and bounce. */
export default async function MessagesRedirect({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;
  redirect(`/apps/${appId}`);
}
