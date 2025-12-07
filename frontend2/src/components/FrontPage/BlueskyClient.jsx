"use client";

import { useEffect, useState } from "react";
import { getBlueskyPosts } from "@/lib/bluesky";
import BlueskyDiscoverySection from "./BlueskyDiscoverySection";

export default function BlueskyClient() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getBlueskyPosts();
        setPosts(data || []);
      } catch (err) {
        console.error("Bluesky fetch failed:", err);
      }
    }
    fetchPosts();
  }, []);

  if (!posts || posts.length === 0) return null;
  return <BlueskyDiscoverySection posts={posts} />;
}
