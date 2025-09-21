import { useEffect } from "react";
import api from "@/api/axios";
import { useGlobalDialog } from "@/components/GlobalDialog/GlobalDialog";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface User {
  id?: number;
  name: string;
  email: string;
  role: "USER" | "RESTAURANT_ADMIN" | "SUPERADMIN";
}
interface UserFormValues {
  id?: number;
  name: string;
  email: string;
  role: "USER" | "RESTAURANT_ADMIN" | "SUPERADMIN";
  password?: string; // optional for edit mode
}
// ✅ Yup schema
const schema = yup.object({
  name: yup.string().required("Name is required").min(3, "At least 3 chars"),
  email: yup.string().email("Invalid email").required("Email is required"),
  username: yup
    .string()
    .required("Username is required")
    .min(3, "At least 3 chars"),

  role: yup
    .string()
    .oneOf(["USER", "RESTAURANT_ADMIN", "SUPERADMIN"])
    .required("Role is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[0-9+ ]+$/, "Invalid phone number"),
  password: yup.string().when("id", {
    is: (id: number | undefined) => !id, // if no id → Add mode
    then: (schema) =>
      schema
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function UserForm({
  user,
  refetch,
}: {
  user?: User; // optional → if undefined = add mode
  refetch: () => void;
}) {
  const { closeDialog } = useGlobalDialog();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: user || { name: "", email: "", role: "USER", password: "" },
  });

  // ✅ Fill form when editing
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("role", user.role);
    }
  }, [user, setValue]);

  const mutation = useMutation({
    mutationFn: (data: User) => {
      if (user?.id) {
        // Edit
        return api.put(`/admin/users/${user.id}`, data);
      } else {
        // Add
        return api.post(`/admin/users`, data);
      }
    },
    onSuccess: () => {
      refetch();
      toast.success(
        user?.id ? "User updated successfully" : "User created successfully"
      );
      closeDialog();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Operation failed");
    },
  });

  const onSubmit = (data: User) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          {...register("name")}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">
            {errors.name.message as string}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          {...register("email")}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">
            {errors.email.message as string}
          </p>
        )}
      </div>
      {/* Password (only for Add) */}
      {!user && (
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password")}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">
              {errors.password.message as string}
            </p>
          )}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium">Username</label>
        <input
          {...register("username")}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
        {errors.username && (
          <p className="text-red-500 text-sm">
            {String(errors.username.message)}
          </p>
        )}
      </div>
      {/* Phone */}
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input
          type="text"
          {...register("phone")}
          className="w-full border rounded px-3 py-2"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">
            {errors.phone.message as string}
          </p>
        )}
      </div>
      {/* Role */}
      <div>
        <label className="block text-sm font-medium">Role</label>
        <select
          {...register("role")}
          className="mt-1 block w-full border rounded px-3 py-2"
        >
          <option value="USER">User</option>
          <option value="RESTAURANT_ADMIN">Restaurant Admin</option>
          <option value="SUPERADMIN">Super Admin</option>
        </select>
        {errors.role && (
          <p className="text-red-500 text-sm">
            {errors.role.message as string}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={closeDialog}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {mutation.isPending
            ? "Saving..."
            : user?.id
            ? "Update User"
            : "Create User"}
        </button>
      </div>
    </form>
  );
}
