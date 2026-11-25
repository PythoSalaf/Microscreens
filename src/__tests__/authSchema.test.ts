import { loginSchema, signupSchema } from "../schemas/auth";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      username: "emilys",
      password: "emilyspass",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a short username", () => {
    const result = loginSchema.safeParse({
      username: "em",
      password: "emilyspass",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a short password", () => {
    const result = loginSchema.safeParse({
      username: "emilys",
      password: "123",
    });
    expect(result.success).toBe(false);
  });
});

describe("signupSchema", () => {
  const valid = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    password: "password1",
    confirm: "password1",
  };

  it("accepts a valid form", () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(
      signupSchema.safeParse({ ...valid, email: "not-an-email" }).success,
    ).toBe(false);
  });

  it("requires a number in the password", () => {
    const result = signupSchema.safeParse({
      ...valid,
      password: "password",
      confirm: "password",
    });
    expect(result.success).toBe(false);
  });

  it("flags mismatched passwords on the confirm field", () => {
    const result = signupSchema.safeParse({ ...valid, confirm: "password2" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["confirm"]);
    }
  });
});
