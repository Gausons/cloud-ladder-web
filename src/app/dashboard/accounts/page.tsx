"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";

interface Account {
  id: number;
  platform: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    platform: "tiktok",
    username: "",
    accountId: "",
  });

  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts");
      setAccounts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleConnect = async () => {
    try {
      // Mocking accountId for now since we don't have real OAuth
      const payload = {
        ...newAccount,
        accountId: newAccount.accountId || `mock_${Date.now()}`, 
        avatar: `https://ui-avatars.com/api/?name=${newAccount.username}&background=random`
      };
      
      await api.post("/accounts", payload);
      setIsDialogOpen(false);
      setNewAccount({ platform: "tiktok", username: "", accountId: "" });
      fetchAccounts();
    } catch (err) {
      console.error("Failed to connect account", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to remove this account?")) {
      try {
        await api.delete(`/accounts/${id}`);
        fetchAccounts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Connected Accounts</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Connect Account</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Connect New Account</DialogTitle>
              <DialogDescription>
                Select a platform and enter your account details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="platform" className="text-right">
                  Platform
                </Label>
                <Select
                  value={newAccount.platform}
                  onValueChange={(val) => setNewAccount({ ...newAccount, platform: val })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tiktok">TikTok (抖音)</SelectItem>
                    <SelectItem value="xiaohongshu">Xiaohongshu (小红书)</SelectItem>
                    <SelectItem value="bilibili">Bilibili (B站)</SelectItem>
                    <SelectItem value="kuaishou">Kuaishou (快手)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  value={newAccount.username}
                  onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                  className="col-span-3"
                  placeholder="@username"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleConnect}>Connect</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Connected At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-gray-500">
                  No accounts connected yet.
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="capitalize font-medium">{account.platform}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={account.avatar} />
                      <AvatarFallback>{account.username[0]}</AvatarFallback>
                    </Avatar>
                    <span>{account.username}</span>
                  </TableCell>
                  <TableCell>{new Date(account.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(account.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
