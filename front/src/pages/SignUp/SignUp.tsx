// src/pages/Signup.tsx
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
// import { useDispatch } from "react-redux";
import api from "@/api/axios";
// import type { AppDispatch } from "@/store";

// 🔹 Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10,15}$/, "Phone must be 10-15 digits")
    .required("Phone is required"),
  password: yup.string().min(6, "Min 6 chars").required("Password is required"),
});

type SignupForm = {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
};

export default function Signup() {
//   const dispatch = useDispatch<AppDispatch>();

  // 🔹 Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", username: "", email: "", phone: "", password: "" },
  });

  // 🔹 React Query Mutation
  const mutation = useMutation({
    mutationFn: async (data: SignupForm) => {
      const res = await api.post("/auth/signup", data); // make sure backend route matches
      return res.data; // { message } or { user, token }
    },
    onSuccess: () => {
      window.location.href = "/login";
    },
    onError: (err: any) => {
      console.error(err.response?.data || err.message);
    },
  });

  const onSubmit = (data: SignupForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-2xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Signup</h2>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input {...field} type="text" className="w-full border p-2 rounded mt-1" placeholder="Enter full name" />
            )}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium">Username</label>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <input {...field} type="text" className="w-full border p-2 rounded mt-1" placeholder="Enter username" />
            )}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input {...field} type="email" className="w-full border p-2 rounded mt-1" placeholder="Enter email" />
            )}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input {...field} type="text" className="w-full border p-2 rounded mt-1" placeholder="Enter phone" />
            )}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium">Password</label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input {...field} type="password" className="w-full border p-2 rounded mt-1" placeholder="Enter password" />
            )}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          {mutation.isPending ? "Signing up..." : "Signup"}
        </button>

        {mutation.isError && (
          <p className="text-red-500 text-sm text-center mt-2">
            {(mutation.error as any)?.response?.data?.error || "Signup failed"}
          </p>
        )}
      </form>
    </div>
  );
}
