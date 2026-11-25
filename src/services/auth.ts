import { Session, User } from "../types/user";

const BASE = "https://dummyjson.com";

type Result<T> = { ok: boolean; status: number; data: T };

async function post<T>(path: string, body: object): Promise<Result<T>> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as T;
    return { ok: res.ok, status: res.status, data };
  } catch {
    throw new Error(
      "Can't reach the server. Check your connection and try again.",
    );
  }
}

type LoginResponse = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
};

export async function login(
  username: string,
  password: string,
): Promise<Session> {
  const { ok, status, data } = await post<LoginResponse>("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });

  if (!ok) {
    throw new Error(
      status === 400
        ? "Wrong username or password"
        : "Something went wrong. Try again.",
    );
  }

  return {
    token: data.accessToken,
    user: {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    },
  };
}

type SignUpInput = { name: string; email: string; password: string };

// DummyJSON only simulates account creation: it returns a new id but does
// not store the user. We sign the person in locally with a demo token.
export async function signUp({
  name,
  email,
  password,
}: SignUpInput): Promise<Session> {
  const [firstName, ...rest] = name.trim().split(/\s+/);
  const lastName = rest.join(" ");

  const { ok, data } = await post<{ id: number }>("/users/add", {
    firstName,
    lastName,
    email,
    password,
  });

  if (!ok) throw new Error("Couldn't create your account. Try again.");

  const user: User = {
    id: data.id,
    username: email.split("@")[0],
    email,
    firstName,
    lastName,
  };

  return { token: `demo-${data.id}`, user };
}
