import { Redirect } from "expo-router";
import { useAuth } from "../store/useAuth";

export default function Index() {
  const token = useAuth((s) => s.token);
  const hydrated = useAuth((s) => s.hydrated);
  const seen = useAuth((s) => s.seenOnboarding);

  if (!hydrated) return null;

  return <Redirect href={token ? "/feed" : seen ? "/login" : "/welcome"} />;
}
