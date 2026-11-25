import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthButton from "../components/AuthButton";
import FloatingInput from "../components/FloatingInput";
import { useShake } from "../hooks/useShake";
import { SignupValues, signupSchema } from "../schemas/auth";
import { signUp } from "../services/auth";
import { useAuth } from "../store/useAuth";

export default function Signup() {
  const signIn = useAuth((s) => s.signIn);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { style: shakeStyle, shake } = useShake();

  const { control, handleSubmit } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  const onValid = async (v: SignupValues) => {
    setError(null);
    setLoading(true);
    try {
      signIn(
        await signUp({
          name: v.name,
          email: v.email.trim(),
          password: v.password,
        }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      shake();
    } finally {
      setLoading(false);
    }
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
              <Ionicons name="person-add" size={24} color="#FFFFFF" />
            </View>
            <Text className="text-4xl font-black text-white">
              Create account
            </Text>
            <Text className="mt-2 mb-8 text-base text-slate-400">
              Save stories and pick up where you left off.
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
                name="name"
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <FloatingInput
                    label="Full name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <FloatingInput
                    label="Email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    keyboardType="email-address"
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

              <Controller
                control={control}
                name="confirm"
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <FloatingInput
                    label="Confirm password"
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

            <View className="mt-2">
              <AuthButton
                label="Create account"
                loading={loading}
                onPress={handleSubmit(onValid, shake)}
              />
            </View>

            <Text className="mt-6 text-center text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                replace
                className="font-semibold text-indigo-300"
              >
                Sign in
              </Link>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
