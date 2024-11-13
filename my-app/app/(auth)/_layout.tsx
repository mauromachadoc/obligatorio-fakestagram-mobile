import { Stack } from "expo-router";

export default function AuthLayout() {

    return (
        <Stack>
            <Stack.Screen
                name="login"
                options={{
                    headerTitle: 'Log In',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="register"
                options={{
                    headerTitle: 'Log In',
                    headerShown: false,
                }}
            />
        </Stack>
    )
}