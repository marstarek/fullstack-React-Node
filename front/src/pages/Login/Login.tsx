import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/authSlice";
import api from "@/api/axios";
import type { AppDispatch } from "@/store";
import { useEffect } from "react";
import toast from "react-hot-toast";

// 🔹 Validation Schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Min 6 chars").required("Password is required"),
});

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();

  // 🔹 Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    defaultValues: { email: "tarek@gmail.com", password: "tarek@2025" },
  });

  // 🔹 React Query Mutation
  const mutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const res = await api.post("/login", data);
      return res.data; // { user, token }
    },
  onSuccess: (data) => {
    console.log(data.accessToken)
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  // save user in localStorage too (optional)
  localStorage.setItem("user", JSON.stringify(data.user));
  dispatch(loginUser.fulfilled(data, "loginUser", data));

  const role = data.user.role;
console.log(role)
  if (role === "SUPERADMIN") {
    window.location.href = "/superAdmin/users";
  } else if (role === "RESTAURANT_ADMIN") {
    window.location.href = "/restaurant-dashboard";
  } else {
    window.location.href = "/favorites"; // default for USER
  }

  toast.success("Login successful!");
},
    onError: (err: any) => {
      console.error(err.response?.data || err.message);
    },
  });

  const onSubmit = (data: LoginForm) => {
    mutation.mutate(data);
  };
useEffect(() => {
toast.success("Login successful!");

}, [])
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-2xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Login</h2>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                className="w-full border p-2 rounded mt-1"
                placeholder="Enter email"
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium">Password</label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                className="w-full border p-2 rounded mt-1"
                placeholder="Enter password"
              />
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>

        {mutation.isError && (
          <p className="text-red-500 text-sm text-center mt-2">
            {(mutation.error as any)?.response?.data?.message ||
              "Login failed"}
          </p>
        )}
      </form>
    </div>
  );
}
