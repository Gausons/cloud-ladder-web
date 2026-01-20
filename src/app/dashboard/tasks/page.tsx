"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Trash2, Edit, Send, Loader2 } from "lucide-react";
import { toast } from "sonner"; // We should install sonner for toasts, but for now simple alert

interface Task {
  id: number;
  title: string;
  platforms: string;
  status: string;
  createdAt: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [publishingId, setPublishingId] = useState<number | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePublish = async (id: number) => {
    setPublishingId(id);
    try {
      const res = await api.post(`/tasks/${id}/publish`);
      if (res.data.status === 'published') {
        alert("Published successfully!");
      } else if (res.data.status === 'partial_success') {
        alert("Published with some errors. Check logs.");
      }
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to publish task.");
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Link href="/dashboard/tasks/create">
          <Button>Create Task</Button>
        </Link>
      </div>

      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Platforms</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                  No tasks found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {task.platforms.split(",").map((p) => (
                        <Badge key={p} variant="secondary" className="capitalize">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      task.status === "published" ? "default" : 
                      task.status === "failed" ? "destructive" : 
                      "outline"
                    }>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(task.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {task.status === 'draft' && (
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => handlePublish(task.id)}
                           disabled={publishingId === task.id}
                         >
                           {publishingId === task.id ? (
                             <Loader2 className="h-4 w-4 animate-spin" />
                           ) : (
                             <Send className="h-4 w-4 mr-1" />
                           )}
                           Publish
                         </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
