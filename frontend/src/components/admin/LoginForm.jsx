import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner"; // pastikan ada komponen Spinner

const LoginForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="font-serif">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="admin@veritas.org"
          disabled={isLoading}
          className="font-serif rounded-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="font-serif">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          disabled={isLoading}
          className="font-serif rounded-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full font-serif font-semibold flex items-center justify-center gap-2"
        size="lg"
      >
        {isLoading && <Spinner className="size-4" />}
        {isLoading ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
};

export default LoginForm;
