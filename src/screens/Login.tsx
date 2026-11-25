import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthButton from "../components/AuthButton";
import FloatingInput from "../components/FloatingInput";
import { useShake } from "../hooks/useShake";
import { LoginValues, loginSchema } from "../schemas/auth";
import { login } from "../services/auth";
import { useAuth } from "../store/useAuth";

export default function Login() {
  const signIn = useAuth((s) => s.signIn);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { style: shakeStyle, shake } = useShake();

  const { control, handleSubmit, setValue } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onValid = async (v: LoginValues) => {
    setError(null);
    setLoading(true);
    try {
      signIn(await login(v.username.trim(), v.password));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      shake();
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setError(null);
    setValue("username", "emilys", { shouldValidate: true });
    setValue("password", "emilyspass", { shouldValidate: true });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 24,
          }}
        >
          <Animated.View entering={FadeInDown.springify().damping(14)}>
            <View className="items-center justify-center mb-6 bg-indigo-500 w-14 h-14 rounded-2xl">
              <Ionicons name="newspaper" size={26} color="#FFFFFF" />
            </View>
            <Text className="text-4xl font-black text-white">Welcome back</Text>
            <Text className="mt-2 mb-8 text-base text-slate-400">
              Sign in to read and save the top tech stories.
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(120).springify().damping(14)}
          >
            <Animated.View style={shakeStyle}>
              {error && (
                <View className="flex-row items-center px-4 py-3 mb-4 border bg-red-500/10 border-red-500/30 rounded-2xl">
                  <Ionicons name="alert-circle" size={18} color="#F87171" />
                  <Text className="flex-1 ml-2 text-sm text-red-300">
                    {error}
                  </Text>
                </View>
              )}

              <Controller
                control={control}
                name="username"
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <FloatingInput
                    label="Username"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <FloatingInput
                    label="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    secure
                    error={fieldState.error?.message}
                  />
                )}
              />
            </Animated.View>

            <Pressable
              onPress={fillDemo}
              className="flex-row items-center self-start px-4 py-2 mb-6 border rounded-full bg-slate-900 border-slate-800 active:opacity-80"
            >
              <Ionicons name="flash" size={14} color="#FB923C" />
              <Text className="ml-2 text-xs text-slate-300">
                Tap to use demo account (emilys)
              </Text>
            </Pressable>

            <AuthButton
              label="Sign in"
              loading={loading}
              onPress={handleSubmit(onValid, shake)}
            />

            <Text className="mt-6 text-center text-slate-400">
              New here?{" "}
              <Link
                href="/signup"
                replace
                className="font-semibold text-indigo-300"
              >
                Create account
              </Link>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
