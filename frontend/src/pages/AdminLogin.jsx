import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, formData);
      
      // Store token
      localStorage.setItem("admin_token", response.data.access_token);
      
      toast.success("Login successful!");
      navigate("/admin/blog");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fidelis-cyan/10 via-fidelis-blue/5 to-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <img 
              src="/logo-color.png" 
              alt="Fidelis Logic" 
              className="h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Blog Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="mt-2"
                placeholder="Enter your username"
                data-testid="admin-login-username"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="mt-2"
                placeholder="Enter your password"
                data-testid="admin-login-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-fidelis-blue hover:bg-fidelis-dark-blue text-white"
              disabled={isLoading}
              data-testid="admin-login-submit"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Fidelis Logic LLC</p>
            <p className="mt-1">Secure Admin Access</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
