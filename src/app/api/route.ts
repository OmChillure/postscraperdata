import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

// MongoDB Models
let Content: mongoose.Model<any>;

try {
  // Try to get the existing model to avoid "Cannot overwrite model" error
  Content = mongoose.model('Content');
} catch {
  // Define schema if model doesn't exist yet
  const contentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    category: { type: String, required: true },
    contentType: { type: String, required: true },
    marketingPatterns: [String],
    format: {
      hasImages: Boolean,
      hasVideos: Boolean,
      hasLinks: Boolean,
      isThread: Boolean,
      hasCTA: Boolean,
      usesStatistics: Boolean,
      containsEmoji: Boolean,
      hashtagCount: Number,
      listItemCount: Number
    },
    platform: { type: String, required: true },
    engagement: {
      views: Number,
      likes: Number,
      reposts: Number,
      comments: Number,
      followerCount: Number,
      engagementRate: Number,
      engagementScore: Number
    },
    createdAt: { type: Date, default: Date.now }
  });

  // Pre-save hook to calculate engagement metrics
  contentSchema.pre('save', function(next) {
    const engagement = this.engagement;
    
    // Calculate engagement rate (as percentage of followers)
    if (engagement.followerCount && engagement.followerCount > 0) {
      const totalEngagement = (engagement.likes || 0) + 
                             (engagement.reposts || 0) * 2 + 
                             (engagement.comments || 0) * 3;
      engagement.engagementRate = (totalEngagement / engagement.followerCount) * 100;
    } else {
      engagement.engagementRate = 0;
    }
    
    // Calculate engagement score (0-100)
    const likeWeight = 1.0;
    const repostWeight = 2.0;
    const commentWeight = 3.0;
    const viewWeight = 0.1;
    
    const weightedEngagement = 
      (engagement.likes || 0) * likeWeight + 
      (engagement.reposts || 0) * repostWeight + 
      (engagement.comments || 0) * commentWeight +
      (engagement.views || 0) * viewWeight;
    
    // Normalize score to 0-100 range
    if (engagement.followerCount && engagement.followerCount > 0) {
      // Score relative to audience size
      engagement.engagementScore = Math.min(100, (weightedEngagement / engagement.followerCount) * 1000);
    } else {
      // Absolute score if no follower count
      engagement.engagementScore = Math.min(100, weightedEngagement / 10);
    }
    
    next();
  });

  Content = mongoose.model('Content', contentSchema);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  // Connect to MongoDB
  await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        const contents = await Content.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: contents });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const content = new Content(req.body);
        const savedContent = await content.save();
        res.status(201).json({ success: true, data: savedContent });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}