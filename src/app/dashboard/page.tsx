"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get("/auth/profile")
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div>
                <p className="text-lg">Hello, <strong>{user.name || user.email}</strong></p>
                <p className="text-gray-500 text-sm mt-1">ID: {user.userId}</p>
              </div>
            ) : (
              <p>Loading user profile...</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-4xl font-bold">0</p>
             <p className="text-gray-500">Connected Accounts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
