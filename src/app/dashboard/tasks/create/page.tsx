"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

const PLATFORMS = [
  { id: "tiktok", label: "TikTok (抖音)" },
  { id: "kuaishou", label: "Kuaishou (快手)" },
  { id: "bilibili", label: "Bilibili (B站)" },
  { id: "xiaohongshu", label: "Xiaohongshu (小红书)" },
  { id: "zhihu", label: "Zhihu (知乎)" },
  { id: "toutiao", label: "Toutiao (今日头条)" },
];

export default function CreateTaskPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mediaUrl: "",
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // AI Generation States
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const togglePlatform = (id: string) => {
    if (selectedPlatforms.includes(id)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== id));
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform");
      return;
    }

    setLoading(true);
    try {
      await api.post("/tasks", {
        ...formData,
        platforms: selectedPlatforms.join(","),
      });
      router.push("/dashboard/tasks");
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      // Prioritize the first selected platform for style context, otherwise default
      const platformContext = selectedPlatforms.length > 0 ? selectedPlatforms[0] : undefined;
      
      const res = await api.post("/ai/generate", {
        prompt: aiPrompt,
        platform: platformContext,
      });

      setFormData(prev => ({
        ...prev,
        content: res.data.content
      }));
      setIsAiDialogOpen(false);
    } catch (err) {
      console.error("AI Generation failed", err);
      alert("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Task</h1>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="content">Content</Label>
                <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="gap-2 text-purple-600 border-purple-200 hover:bg-purple-50">
                      <Sparkles className="w-4 h-4" />
                      AI Generate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>AI Content Assistant</DialogTitle>
                      <DialogDescription>
                        Describe what you want to post about, and AI will generate the content for you.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Prompt</Label>
                        <Textarea 
                          placeholder="e.g. Write a review about the new iPhone 16 focusing on its camera features..." 
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                      {selectedPlatforms.length > 0 && (
                        <p className="text-sm text-gray-500">
                          Generating for style: <span className="font-medium capitalize">{selectedPlatforms[0]}</span>
                        </p>
                      )}
                    </div>
                    <DialogFooter>
                      <Button type="button" onClick={handleAiGenerate} disabled={isGenerating || !aiPrompt}>
                        {isGenerating ? "Generating..." : "Generate Content"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Textarea
                id="content"
                className="min-h-[150px]"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter your post content..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mediaUrl">Media URL (Optional)</Label>
              <Input
                id="mediaUrl"
                value={formData.mediaUrl}
                onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Target Platforms</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PLATFORMS.map((platform) => (
                  <div 
                    key={platform.id}
                    className={`
                      border rounded-md p-3 cursor-pointer transition-colors
                      ${selectedPlatforms.includes(platform.id) 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-gray-50'}
                    `}
                    onClick={() => togglePlatform(platform.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center
                        ${selectedPlatforms.includes(platform.id) ? 'bg-primary border-primary' : 'border-gray-400'}
                      `}>
                         {selectedPlatforms.includes(platform.id) && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className="text-sm font-medium">{platform.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
